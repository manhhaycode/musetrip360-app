/**
 * CubemapViewer
 *
 * Main user-facing React component for cubemap panorama viewing.
 * Uses useCubemapViewer hook for all complex logic and state management.
 */

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';

import type { CubemapViewerCallbacks, CubemapViewerConfig } from '../hooks/useCubemapViewer';
import { useCubemapViewer } from '../hooks/useCubemapViewer';
import { IncrementalRenderer } from './IncrementalRenderer';

export interface CubemapViewerProps extends CubemapViewerConfig, CubemapViewerCallbacks {
  /** Canvas styling */
  style?: React.CSSProperties;
  className?: string;
  /** Children components (overlays, hotspots) */
  children?: React.ReactNode;
}

export const CubemapViewer: React.FC<CubemapViewerProps> = ({
  // Config props
  cubeMapData,
  initialCamera,
  controls,
  qualitySettings,
  loaderOptions,
  // Callback props
  onLoad,
  onError,
  onProgress,
  onQualityChange,
  onCameraChange,
  // UI props
  style,
  className,
  children,
}) => {
  // Extract config and callbacks for the hook
  const config: CubemapViewerConfig = {
    cubeMapData,
    initialCamera,
    controls,
    qualitySettings,
    loaderOptions,
  };

  const callbacks: CubemapViewerCallbacks = {
    onLoad,
    onError,
    onProgress,
    onQualityChange,
    onCameraChange,
  };

  // Use the hook for all complex logic
  const { state, actions, configs, refs } = useCubemapViewer(config, callbacks);
  const { currentLevel, networkQuality, isLoaded, error } = state;
  const { cameraConfig, controlsConfig, qualityConfig } = configs;
  const { controlsRef, canvasRef } = refs;
  const { handleFaceLoaded, handleProgress, handleError, handleLevelComplete, handleCameraChange, handleCanvasError } =
    actions;

  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        ...style,
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{
          position: cameraConfig.position,
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ gl }) => {
          // Configure renderer for better quality
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        onError={handleCanvasError}
        style={{ display: 'block' }}
      >
        {/* Camera Controls */}
        <OrbitControls
          ref={controlsRef}
          target={cameraConfig.target}
          enabled={controlsConfig.enableControls}
          enableZoom={controlsConfig.enableZoom}
          enablePan={controlsConfig.enablePan}
          enableRotate={controlsConfig.enableRotate}
          autoRotate={controlsConfig.autoRotate}
          autoRotateSpeed={controlsConfig.autoRotateSpeed}
          enableDamping={controlsConfig.enableDamping}
          dampingFactor={controlsConfig.dampingFactor}
          minDistance={controlsConfig.minDistance}
          maxDistance={controlsConfig.maxDistance}
          minPolarAngle={controlsConfig.minPolarAngle}
          maxPolarAngle={controlsConfig.maxPolarAngle}
          minAzimuthAngle={controlsConfig.minAzimuthAngle}
          maxAzimuthAngle={controlsConfig.maxAzimuthAngle}
          onChange={(event) => {
            if (event?.target) {
              const target = event.target as any;
              handleCameraChange({
                position: target.object.position,
                target: target.target,
              });
            }
          }}
        />

        {/* Cubemap Renderer */}
        <IncrementalRenderer
          cubeMapData={cubeMapData}
          currentLevel={currentLevel}
          networkQuality={networkQuality}
          loaderOptions={loaderOptions}
          rendererId={`cubemap-viewer-${Date.now()}`}
          onFaceLoaded={handleFaceLoaded}
          onProgress={handleProgress}
          onError={handleError}
          onLevelComplete={handleLevelComplete}
        >
          {children}
        </IncrementalRenderer>
      </Canvas>

      {/* Error Display */}
      {error && !error.recoverable && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            zIndex: 1000,
          }}
        >
          <h3>Loading Error</h3>
          <p>{error.message}</p>
          <small>Please try refreshing the page</small>
        </div>
      )}

      {/* Loading State Indicator */}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '20px',
            fontSize: '14px',
            zIndex: 1000,
          }}
        >
          Loading... {state.loadingState ? Math.round(state.loadingState.overallProgress) : 0}%
        </div>
      )}

      {/* Network Quality Indicator */}
      {qualityConfig.enableNetworkAdaptation && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            background: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            zIndex: 1000,
          }}
        >
          Network: {networkQuality} | Quality: Level {currentLevel}
        </div>
      )}
    </div>
  );
};
