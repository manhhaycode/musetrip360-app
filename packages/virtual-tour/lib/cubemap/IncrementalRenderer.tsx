/**
 * IncrementalRenderer
 *
 * React Three Fiber component for incremental cubemap rendering.
 * Renders faces as they load, showing placeholders initially.
 */

import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { CubeMapData, CubemapLoadingState, FaceLoadingState, NetworkQuality } from '../types';
import { HybridCubemapLoader, type HybridLoaderOptions, type LoaderCallbacks } from './HybridCubemapLoader';

export interface IncrementalRendererProps {
  /** Cubemap data to render */
  cubeMapData: CubeMapData;
  /** Current resolution level to load (0-based) */
  currentLevel?: number;
  /** Network quality for optimization */
  networkQuality?: NetworkQuality;
  /** Loader options */
  loaderOptions?: HybridLoaderOptions;
  /** Unique ID for this renderer instance */
  rendererId?: string;
  /** Loading callbacks */
  onFaceLoaded?: (face: FaceLoadingState) => void;
  onProgress?: (progress: number) => void;
  onError?: (error: any) => void;
  onLevelComplete?: (level: number) => void;
  /** Render props for custom effects */
  children?: React.ReactNode;
}

export const IncrementalRenderer: React.FC<IncrementalRendererProps> = ({
  cubeMapData,
  currentLevel = 0,
  networkQuality = 'medium',
  loaderOptions = {},
  rendererId = 'default',
  onFaceLoaded,
  onProgress,
  onError,
  onLevelComplete,
  children,
}) => {
  const { scene } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const loaderRef = useRef<HybridCubemapLoader | null>(null);

  const [cubeTexture, setCubeTexture] = useState<THREE.CubeTexture | null>(null);
  const [loadingState, setLoadingState] = useState<CubemapLoadingState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize loader callbacks to prevent recreation
  const callbacks: LoaderCallbacks = useMemo(
    () => ({
      onFaceLoaded: (faceState) => {
        onFaceLoaded?.(faceState);

        // Update local loading state
        const currentState = loaderRef.current?.getLoadingState(rendererId);
        if (currentState) {
          setLoadingState({ ...currentState });
        }
      },
      onProgress: (progress) => {
        onProgress?.(progress);
      },
      onError: (error) => {
        onError?.(error);
      },
      onLevelComplete: (level) => {
        onLevelComplete?.(level);
        setIsLoading(false);
      },
    }),
    [rendererId, onFaceLoaded, onProgress, onError, onLevelComplete]
  );

  // Initialize loader
  useEffect(() => {
    loaderRef.current = new HybridCubemapLoader(loaderOptions, callbacks);

    return () => {
      loaderRef.current?.dispose();
      loaderRef.current = null;
    };
  }, [loaderOptions, callbacks]);

  // Load cubemap level when it changes
  useEffect(() => {
    if (!loaderRef.current || !cubeMapData.cubeMaps[currentLevel]) {
      return;
    }

    const loadLevel = async () => {
      setIsLoading(true);

      try {
        const level = cubeMapData.cubeMaps[currentLevel];
        if (!level) {
          throw new Error(`Level ${currentLevel} not found in cubemap data`);
        }

        const texture = await loaderRef.current!.loadCubeMapLevelIncremental(
          level,
          currentLevel,
          networkQuality,
          rendererId
        );

        setCubeTexture(texture);
      } catch (error) {
        console.error('Failed to load cubemap level:', error);
        onError?.(error);
        setIsLoading(false);
      }
    };

    loadLevel();
  }, [cubeMapData, currentLevel, networkQuality, rendererId]);

  // Create sphere geometry for cubemap
  const sphereGeometry = useMemo(() => {
    // Create inverted sphere for inside-out viewing
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // Invert normals for inside viewing
    geometry.scale(-1, 1, 1);
    return geometry;
  }, []);

  // Create material with cubemap
  const material = useMemo(() => {
    if (!cubeTexture) {
      // Placeholder material while loading
      return new THREE.MeshBasicMaterial({ color: 0x888888 });
    }

    return new THREE.MeshBasicMaterial({
      envMap: cubeTexture,
      side: THREE.BackSide, // Render inside faces
    });
  }, [cubeTexture]);

  // Update material when texture changes
  useEffect(() => {
    if (meshRef.current && cubeTexture) {
      const mesh = meshRef.current;
      if (mesh.material) {
        // Dispose old material
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
      }

      // Apply new material
      mesh.material = new THREE.MeshBasicMaterial({
        envMap: cubeTexture,
        side: THREE.BackSide,
      });
    }
  }, [cubeTexture]);

  // Auto-rotate based on loading state
  useFrame((state, delta) => {
    if (meshRef.current && isLoading) {
      // Gentle rotation while loading
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cubeTexture) {
        cubeTexture.dispose();
      }
      if (material && material instanceof THREE.Material) {
        material.dispose();
      }
    };
  }, []);

  return (
    <>
      {/* Main cubemap sphere */}
      <mesh ref={meshRef} geometry={sphereGeometry} material={material} position={[0, 0, 0]} />

      {/* Loading indicator */}
      {isLoading && <LoadingIndicator loadingState={loadingState} position={[0, 0, -50]} />}

      {/* Custom children */}
      {children}
    </>
  );
};

/**
 * Simple 3D loading indicator
 */
interface LoadingIndicatorProps {
  loadingState: CubemapLoadingState | null;
  position?: [number, number, number];
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loadingState, position = [0, 0, 0] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 2;
    }
  });

  if (!loadingState) {
    return null;
  }

  const progress = loadingState.overallProgress / 100;

  return (
    <group position={position}>
      {/* Progress ring */}
      <mesh ref={meshRef}>
        <ringGeometry args={[8, 10, 32]} />
        <meshBasicMaterial color={0x00ff88} transparent opacity={0.8} />
      </mesh>

      {/* Progress bar */}
      <mesh position={[0, 0, 0.1]}>
        <ringGeometry args={[9, 9.5, 32, 1, 0, Math.PI * 2 * progress]} />
        <meshBasicMaterial color={0x00ffff} />
      </mesh>

      {/* Face indicators */}
      {loadingState.faces.map((face, index) => {
        const angle = (index / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 15;
        const y = Math.sin(angle) * 15;

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

// Named export only to avoid export conflicts
