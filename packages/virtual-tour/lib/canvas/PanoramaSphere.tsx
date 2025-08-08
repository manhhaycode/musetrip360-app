'use client';

import type { CubeMapLevel } from '@/types/cubemap';
import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import { PanoramaControls } from './PanoramaControls';

export interface PanoramaSphereProps {
  cubeMapLevel: CubeMapLevel;
  className?: string;
  children?: React.ReactNode;
  enableRotate?: boolean;
}

export function PanoramaSphere({ cubeMapLevel, children, enableRotate = true }: PanoramaSphereProps) {
  // Convert File objects to URLs for Environment component
  const cubeMapFiles = useMemo(() => {
    // Standard cube face order: [px, nx, py, ny, pz, nz]
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
      style={{ background: '#000' }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <directionalLight position={[0, 1, 0]} intensity={1} />
        {/* Use Environment with FOV-based zoom */}
        <Environment
          files={cubeMapFiles}
          background={true}
          backgroundBlurriness={0}
          backgroundIntensity={1}
          environmentIntensity={1}
        />
        {children}
        <PanoramaControls enableDamping={false} enableRotate={enableRotate} />
      </Suspense>
    </Canvas>
  );
}
