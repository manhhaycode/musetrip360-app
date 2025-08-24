'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { PolygonOverlayProps } from './types';
import { toVector3 } from './utils';

export function PolygonOverlay({ points, onClick }: PolygonOverlayProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    if (points.length < 3) return null;

    const vertices = points.map(toVector3);

    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];

    vertices.forEach((vertex) => {
      positions.push(vertex.x, vertex.y, vertex.z);
    });

    for (let i = 1; i < vertices.length - 1; i++) {
      indices.push(0, i, i + 1);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }, [points]);

  if (!geometry || points.length < 3) return null;

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <meshBasicMaterial color="#ffffff" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}
