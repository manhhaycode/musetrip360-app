'use client';

import { Box } from '@react-three/drei';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Texture } from 'three';
import * as THREE from 'three';
import { PanoramaControls } from '../canvas/PanoramaControls';

export interface ProgressivePanoramaSphereProps {
  /** Preloaded textures array [px, nx, py, ny, pz, nz] */
  textures: Texture[] | null;
  className?: string;
  children?: React.ReactNode;
  enableRotate?: boolean;
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  // Camera control props
  controlledCameraPosition?: { theta: number; phi: number; fov?: number };
  onCameraChange?: (position: { theta: number; phi: number; fov: number }) => void;
  enableUserControls?: boolean;
}

function ProgressivePanoramaContent({
  textures,
  children,
  enableRotate,
  onClick,
  controlledCameraPosition,
  onCameraChange,
  enableUserControls,
}: {
  textures: Texture[];
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  children?: React.ReactNode;
  enableRotate: boolean;
  controlledCameraPosition?: { theta: number; phi: number; fov?: number };
  onCameraChange?: (position: { theta: number; phi: number; fov: number }) => void;
  enableUserControls?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialsRef = useRef<THREE.MeshBasicMaterial[]>([]);

  // Initialize materials once and reuse them
  const materials = useMemo(() => {
    // Dispose old materials
    materialsRef.current.forEach((material) => material.dispose());

    // Create new materials for 6 faces
    const newMaterials = Array.from({ length: 6 }, (_, index) => {
      const material = new THREE.MeshBasicMaterial({
        map: textures[index],
        side: THREE.BackSide,
      });
      return material;
    });

    materialsRef.current = newMaterials;
    return newMaterials;
  }, [textures]);

  // Update material textures when textures change (no material recreation)
  useEffect(() => {
    if (materialsRef.current.length === 6) {
      textures.forEach((texture, index) => {
        if (materialsRef.current[index]) {
          materialsRef.current[index].map = texture;
          materialsRef.current[index].needsUpdate = true;
        }
      });
    }
  }, [textures]);

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      materialsRef.current.forEach((material) => material.dispose());
    };
  }, []);

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 1, 0]} intensity={1} />

      {/* Environment sphere */}
      <Box onClick={onClick} ref={meshRef} args={[100, 100, 100]} scale={[-1, 1, 1]} material={materials} />

      {children}
      <PanoramaControls
        enableDamping={false}
        enableRotate={enableRotate}
        controlledPosition={controlledCameraPosition}
        onViewChange={onCameraChange}
        enableUserControls={enableUserControls}
      />
    </>
  );
}

/**
 * Progressive Panorama Sphere that accepts preloaded textures
 *
 * Key differences from regular PanoramaSphere:
 * - Accepts preloaded Texture objects instead of URLs/Files
 * - No useTexture/useLoader - no Suspense blocking
 * - Immediate rendering when textures are available
 * - Perfect for progressive loading scenarios
 */
export function ProgressivePanoramaSphere({
  textures,
  children,
  enableRotate = true,
  onClick,
  controlledCameraPosition,
  onCameraChange,
  enableUserControls = true,
}: ProgressivePanoramaSphereProps) {
  // Show loading state when no textures available
  if (!textures || textures.length !== 6) {
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
        <ambientLight intensity={0.5} />
        {/* Simple loading sphere */}
        <mesh>
          <sphereGeometry args={[50, 32, 32]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        {children}
      </Canvas>
    );
  }

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
      <ProgressivePanoramaContent
        textures={textures}
        enableRotate={enableRotate}
        onClick={onClick}
        controlledCameraPosition={controlledCameraPosition}
        onCameraChange={onCameraChange}
        enableUserControls={enableUserControls}
      >
        {children}
      </ProgressivePanoramaContent>
    </Canvas>
  );
}
