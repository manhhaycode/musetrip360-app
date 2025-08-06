/**
 * LoadingIndicator
 *
 * Standalone loading progress indicator for cubemap loading.
 * Supports both 2D overlay and 3D in-scene variants.
 */

import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { CubemapLoadingState, FaceLoadingState } from '../types';

export interface LoadingIndicatorProps {
  /** Loading state data */
  loadingState: CubemapLoadingState | null;
  /** Display variant */
  variant?: '2d-overlay' | '3d-scene' | 'minimal';
  /** Position for 3D variant */
  position?: [number, number, number];
  /** Size scale */
  scale?: number;
  /** Custom styling for 2D variants */
  style?: React.CSSProperties;
  className?: string;
  /** Show detailed face status */
  showFaceDetails?: boolean;
  /** Show network quality info */
  showNetworkInfo?: boolean;
  /** Animation settings */
  animation?: {
    rotationSpeed?: number;
    pulseSpeed?: number;
    enabled?: boolean;
  };
}

// 3D Scene Loading Indicator
export const Scene3DLoadingIndicator: React.FC<{
  loadingState: CubemapLoadingState;
  position: [number, number, number];
  scale: number;
  animation: Required<LoadingIndicatorProps['animation']>;
}> = ({ loadingState, position, scale, animation }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef<THREE.Mesh>(null);

  // Animation frame
  useFrame((state, delta) => {
    if (!animation?.enabled) return;

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * animation.rotationSpeed;
    }

    if (progressRef.current) {
      // Subtle pulsing effect
      const pulse = Math.sin(state.clock.elapsedTime * animation.pulseSpeed) * 0.1 + 1;
      progressRef.current.scale.setScalar(pulse);
    }
  });

  const progress = loadingState.overallProgress / 100;

  return (
    <group position={position} scale={scale}>
      {/* Background ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[8, 10, 32]} />
        <meshBasicMaterial color={0x333333} transparent opacity={0.3} />
      </mesh>

      {/* Progress ring */}
      <mesh ref={progressRef} position={[0, 0, 0.1]}>
        <ringGeometry args={[9, 9.5, 32, 1, 0, Math.PI * 2 * progress]} />
        <meshBasicMaterial color={0x00aaff} />
      </mesh>

      {/* Center progress text */}
      {/* Note: Text would require additional dependencies, using simple geometry instead */}
      <mesh position={[0, 0, 0.2]}>
        <circleGeometry args={[6]} />
        <meshBasicMaterial color={0x000000} transparent opacity={0.7} />
      </mesh>

      {/* Face indicators arranged in circle */}
      {loadingState.faces.map((face, index) => {
        const angle = (index / 6) * Math.PI * 2;
        const radius = 15;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        let color = 0x666666; // Pending
        if (face.status === 'loading') color = 0xffaa00;
        if (face.status === 'loaded') color = 0x00ff00;
        if (face.status === 'error') color = 0xff0000;

        return (
          <mesh key={index} position={[x, y, 0]}>
            <circleGeometry args={[2]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
};

// 2D Overlay Loading Indicator
export const Overlay2DLoadingIndicator: React.FC<{
  loadingState: CubemapLoadingState;
  showFaceDetails: boolean;
  showNetworkInfo: boolean;
  style?: React.CSSProperties;
  className?: string;
}> = ({ loadingState, showFaceDetails, showNetworkInfo, style, className }) => {
  const progress = loadingState.overallProgress;
  const loadedFaces = loadingState.loadedFaces;
  const totalFaces = loadingState.faces.length;

  const getStatusColor = (status: FaceLoadingState['status']) => {
    switch (status) {
      case 'loading':
        return '#ffa500';
      case 'loaded':
        return '#28a745';
      case 'error':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status: FaceLoadingState['status']) => {
    switch (status) {
      case 'loading':
        return '⏳';
      case 'loaded':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏸️';
    }
  };

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        minWidth: '200px',
        zIndex: 1000,
        ...style,
      }}
    >
      {/* Main Progress */}
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}
        >
          <span style={{ fontWeight: 'bold' }}>Loading Cubemap</span>
          <span style={{ fontSize: '12px' }}>{Math.round(progress)}%</span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#333',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#00aaff',
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        <div
          style={{
            fontSize: '11px',
            color: '#ccc',
            marginTop: '4px',
            textAlign: 'center',
          }}
        >
          {loadedFaces}/{totalFaces} faces loaded
        </div>
      </div>

      {/* Network Quality */}
      {showNetworkInfo && (
        <div
          style={{
            marginBottom: '12px',
            fontSize: '12px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Network:</span>
          <span
            style={{
              color:
                loadingState.networkQuality === 'slow'
                  ? '#ffa500'
                  : loadingState.networkQuality === 'medium'
                    ? '#00aaff'
                    : loadingState.networkQuality === 'fast'
                      ? '#28a745'
                      : '#00ff88',
              fontWeight: 'bold',
            }}
          >
            {loadingState.networkQuality.toUpperCase()}
          </span>
        </div>
      )}

      {/* Face Details */}
      {showFaceDetails && (
        <div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '8px',
              borderBottom: '1px solid #444',
              paddingBottom: '4px',
            }}
          >
            Face Status
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
            {loadingState.faces.map((face, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <span style={{ fontSize: '10px' }}>{getStatusIcon(face.status)}</span>
                <span style={{ fontWeight: 'bold', minWidth: '20px' }}>{face.faceName.toUpperCase()}</span>
                <span
                  style={{
                    color: getStatusColor(face.status),
                    fontSize: '10px',
                    flex: 1,
                  }}
                >
                  {face.status}
                </span>
                {face.loadTime && <span style={{ fontSize: '9px', color: '#999' }}>{Math.round(face.loadTime)}ms</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Count */}
      {loadingState.hasErrors && (
        <div
          style={{
            marginTop: '8px',
            padding: '6px',
            backgroundColor: 'rgba(220, 53, 69, 0.2)',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#ff6b6b',
          }}
        >
          ⚠️ {loadingState.failedFaces} face{loadingState.failedFaces !== 1 ? 's' : ''} failed to load
        </div>
      )}
    </div>
  );
};

// Minimal Loading Indicator
export const MinimalLoadingIndicator: React.FC<{
  loadingState: CubemapLoadingState;
  style?: React.CSSProperties;
  className?: string;
}> = ({ loadingState, style, className }) => {
  const progress = loadingState.overallProgress;

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        ...style,
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: '12px',
          height: '12px',
          border: '2px solid #333',
          borderTop: '2px solid #00aaff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />

      <span>Loading... {Math.round(progress)}%</span>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Main LoadingIndicator Component
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  loadingState,
  variant = '2d-overlay',
  position = [0, 0, -50],
  scale = 1,
  style,
  className,
  showFaceDetails = true,
  showNetworkInfo = true,
  animation = {},
}) => {
  const animationConfig = useMemo(
    () => ({
      rotationSpeed: 2,
      pulseSpeed: 3,
      enabled: true,
      ...animation,
    }),
    [animation]
  );

  if (!loadingState) {
    return null;
  }

  switch (variant) {
    case '3d-scene':
      return (
        <Scene3DLoadingIndicator
          loadingState={loadingState}
          position={position}
          scale={scale}
          animation={animationConfig}
        />
      );

    case 'minimal':
      return <MinimalLoadingIndicator loadingState={loadingState} style={style} className={className} />;

    case '2d-overlay':
    default:
      return (
        <Overlay2DLoadingIndicator
          loadingState={loadingState}
          showFaceDetails={showFaceDetails}
          showNetworkInfo={showNetworkInfo}
          style={style}
          className={className}
        />
      );
  }
};
