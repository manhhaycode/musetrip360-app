'use client';

import { Html } from '@react-three/drei';
import { useState } from 'react';
import type { Hotspot } from './types';

export interface InteractiveHotspotProps {
  hotspot: Hotspot;
}

/**
 * Interactive 3D hotspot component for panorama viewers
 * Renders a clickable sphere with hover effects and HTML tooltip
 */
export function InteractiveHotspot({ hotspot }: InteractiveHotspotProps) {
  const [hovered, setHovered] = useState(false);

  const getHotspotColor = () => {
    switch (hotspot.type) {
      case 'info':
        return hovered ? '#3b82f6' : '#1d4ed8'; // Blue
      case 'navigation':
        return hovered ? '#10b981' : '#059669'; // Green
      case 'action':
        return hovered ? '#f59e0b' : '#d97706'; // Orange
      default:
        return hovered ? '#ef4444' : '#dc2626'; // Red
    }
  };

  return (
    <group position={hotspot.position}>
      {/* 3D clickable sphere */}
      <mesh
        onClick={hotspot.onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.5 : 1}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={getHotspotColor()} transparent opacity={0.8} />
      </mesh>

      {/* HTML tooltip */}
      {hovered && (
        <Html center>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-sm pointer-events-none">{hotspot.title}</div>
        </Html>
      )}
    </group>
  );
}
