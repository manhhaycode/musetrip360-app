'use client';

import { OrbitControls } from '@react-three/drei';
import { useFOVZoom } from '../hooks/useFOVZoom';
import { InteractiveHotspot } from './InteractiveHotspot';
import type { Hotspot } from './types';

export interface PanoramaControlsProps {
  hotspots?: Hotspot[];
  enableDamping?: boolean;
  dampingFactor?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

/**
 * Panorama controls component that combines OrbitControls with FOV zoom and hotspots
 * Handles camera controls, zoom functionality, and renders interactive hotspots
 */
export function PanoramaControls({
  hotspots,
  enableDamping = false,
  dampingFactor = 0.02,
  minPolarAngle = Math.PI / 6,
  maxPolarAngle = (5 * Math.PI) / 6,
}: PanoramaControlsProps) {
  // Initialize FOV zoom functionality
  useFOVZoom();

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={false} // Disabled to use custom FOV zoom
        enableRotate={true}
        enableDamping={enableDamping}
        dampingFactor={dampingFactor}
        target={[0, 0, 0]}
        minPolarAngle={minPolarAngle}
        maxPolarAngle={maxPolarAngle}
      />
    </>
  );
}
