'use client';

import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import type { CubeMapLevel } from '../types/cubemap';

export interface CubemapPreviewProps {
  cubeMapLevel: CubeMapLevel;
  className?: string;
}

export function CubemapPreview({ cubeMapLevel }: CubemapPreviewProps) {
  // Convert File objects to URLs for Environment component
  const cubeMapFiles = useMemo(() => {
    // THREE.js cube texture face order: [px, nx, py, ny, pz, nz]
    const faces = [
      cubeMapLevel.px, // Right (+X)
      cubeMapLevel.nx, // Left (-X)
      cubeMapLevel.py, // Top (+Y)
      cubeMapLevel.ny, // Bottom (-Y)
      cubeMapLevel.pz, // Front (+Z)
      cubeMapLevel.nz, // Back (-Z)
    ];

    return faces.map((face) => {
      if (face instanceof File) {
        return URL.createObjectURL(face);
      }
      return face;
    });
  }, [cubeMapLevel]);

  return (
    <Canvas
      camera={{
        position: [0, 0, 0],
        fov: 75,
        near: 0.01,
        far: 1000,
      }}
      style={{ background: '#000' }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        {/* Environment component handles cubemap as background */}
        <Environment
          files={cubeMapFiles}
          background={true}
          backgroundBlurriness={0}
          backgroundIntensity={1}
          environmentIntensity={1}
        />

        {/* Orbit controls for panorama navigation */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={0.1}
          maxDistance={10}
          target={[0, 0, 0]}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={(5 * Math.PI) / 6}
        />
      </Suspense>
    </Canvas>
  );
}
