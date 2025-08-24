'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { PointIndicatorProps } from './types';
import { toVector3 } from './utils';

export function PointIndicator({ position, color, camera }: PointIndicatorProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && camera) {
      const positionVec3 = toVector3(position);

      const distance = camera.position.distanceTo(positionVec3);

      const minScale = 0.1;
      const maxScale = 0.5;
      const baseDistance = 50;

      const scaleFactor = Math.max(minScale, Math.min(maxScale, (distance / baseDistance) * 0.2));

      meshRef.current.scale.setScalar(scaleFactor);
    }
  });

  const vec3 = toVector3(position);
  const positionArray: [number, number, number] = [vec3.x, vec3.y, vec3.z];

  return (
    <Billboard position={positionArray}>
      <mesh ref={meshRef}>
        <circleGeometry args={[1, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </Billboard>
  );
}
