'use client';

import type { CubeMapLevel } from '@/types/cubemap';
import { Box, useTexture } from '@react-three/drei';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PanoramaControls } from './PanoramaControls';
export interface PanoramaSphereProps {
  cubeMapLevel: CubeMapLevel;
  className?: string;
  children?: React.ReactNode;
  enableRotate?: boolean;
  autoRotate?: boolean;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  // NEW: Camera control props
  controlledCameraPosition?: { theta: number; phi: number; fov?: number };
  onCameraChange?: (position: { theta: number; phi: number; fov: number }) => void;
  enableUserControls?: boolean;
}

function PanoramaContent({
  cubeMapFiles,
  children,
  enableRotate,
  autoRotate,
  onClick,
  controlledCameraPosition,
  onCameraChange,
  enableUserControls,
}: {
  cubeMapFiles: string[];
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  children?: React.ReactNode;
  enableRotate: boolean;
  autoRotate?: boolean;
  controlledCameraPosition?: { theta: number; phi: number; fov?: number };
  onCameraChange?: (position: { theta: number; phi: number; fov: number }) => void;
  enableUserControls?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textures = useTexture(cubeMapFiles);

  // Configure all textures
  textures.forEach((texture) => {
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  });

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 1, 0]} intensity={1} />

      {/* Environment sphere */}
      <Box onClick={onClick} ref={meshRef} args={[100, 100, 100]} scale={[-1, 1, 1]}>
        {textures.map((texture, index) => (
          <meshBasicMaterial key={index} map={texture} side={THREE.BackSide} attach={`material-${index}`} />
        ))}
      </Box>

      {children}
      <PanoramaControls
        enableDamping={false}
        enableRotate={enableRotate}
        autoRotate={autoRotate}
        controlledPosition={controlledCameraPosition}
        onViewChange={onCameraChange}
        enableUserControls={enableUserControls}
      />
    </>
  );
}

export function PanoramaSphere({
  cubeMapLevel,
  children,
  enableRotate = true,
  autoRotate = false,
  onClick,
  controlledCameraPosition,
  onCameraChange,
  enableUserControls = true,
}: PanoramaSphereProps) {
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
        <PanoramaContent
          cubeMapFiles={cubeMapFiles}
          enableRotate={enableRotate}
          autoRotate={autoRotate}
          onClick={onClick}
          controlledCameraPosition={controlledCameraPosition}
          onCameraChange={onCameraChange}
          enableUserControls={enableUserControls}
        >
          {children}
        </PanoramaContent>
      </Suspense>
    </Canvas>
  );
}
