'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@musetrip360/ui-core/tooltip';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { forwardRef, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Mesh } from 'three';
import type { Hotspot } from './types';

export interface HotspotContentProps {
  hotspot: Hotspot;
  position: [number, number, number];
  hovered: boolean;
  isDragging: boolean;
  isDragMode: boolean;
  isEditing: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onClick?: () => void;
}

/**
 * Visual content component for hotspots
 * Contains the 3D geometry and tooltip display
 */
export const HotspotContent = forwardRef<THREE.Group, HotspotContentProps>(function HotspotContent(
  { hotspot, position, hovered, isDragging, isDragMode, isEditing, onPointerEnter, onPointerLeave, onClick },
  ref
) {
  const meshRef = useRef<Mesh>(null!);

  // Calculate proper size and position for panorama sphere (100x100x100 with scale [-1,1,1])
  const normalizedPosition = useMemo(() => {
    const pos = new THREE.Vector3(...position);
    // Normalize to sphere surface (radius ~45 to stay inside the 100x100x100 box)
    const sphereRadius = 45;
    pos.normalize().multiplyScalar(sphereRadius);
    return [pos.x, pos.y, pos.z] as [number, number, number];
  }, [position]);

  // Subtle pulsing animation for both rings (disabled during drag)
  useFrame((state) => {
    if (meshRef.current && !isDragging) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={!isDragMode ? onClick : undefined}
      position={normalizedPosition}
    >
      {/* Invisible bounds mesh for better mouse detection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Outer ring */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.5, 32]} />
        <meshStandardMaterial
          color={isDragging ? '#ffcc00' : '#ffffff'}
          emissive={isDragging ? '#ffcc00' : '#ffffff'}
          emissiveIntensity={isDragging ? 0.8 : hovered ? 1 : 0.3}
        />
      </mesh>

      {/* Inner ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1, 1.3, 32]} />
        <meshStandardMaterial
          color={isDragging ? '#ffcc00' : '#ffffff'}
          emissive={isDragging ? '#ffcc00' : '#ffffff'}
          emissiveIntensity={isDragging ? 0.8 : hovered ? 1 : 0.3}
        />
      </mesh>

      {!isDragMode && (
        <Html
          center
          style={{
            pointerEvents: hovered ? 'auto' : 'none',
          }}
        >
          <Tooltip open={hovered}>
            <TooltipTrigger asChild>
              <div
                style={{
                  width: '1px',
                  height: '1px',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={30}
              className="bg-yellow-400 border-yellow-500 text-base font-medium px-4 py-3 shadow-xl"
            >
              {hotspot.title}
              {isEditing && <div className="text-xs mt-1 opacity-80 font-normal">Click to edit</div>}
            </TooltipContent>
          </Tooltip>
        </Html>
      )}
    </group>
  );
});
