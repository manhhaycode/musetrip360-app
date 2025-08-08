'use client';

import { Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import { PanoramaControls } from '../canvas/PanoramaControls';
import type { Hotspot } from '../canvas/types';
import type { CubeMapLevel } from '../types/cubemap';
import { InteractiveHotspot } from '@/canvas';

export interface CubemapPreviewProps {
  cubeMapLevel: CubeMapLevel;
  className?: string;
  hotspots?: Hotspot[];
}

export function CubemapPreview({ cubeMapLevel, hotspots }: CubemapPreviewProps) {
  // Demo hotspot for testing
  const demoHotspots: Hotspot[] = useMemo(
    () => [
      {
        id: 'demo-info',
        position: [40, 15, 30], // Front-right, slightly up
        title: 'Demo Information Point',
        type: 'info',
        onClick: () => alert('Demo hotspot clicked! This is an info point.'),
      },
      {
        id: 'demo-nav',
        position: [-25, 0, 45], // Front-left, center height
        title: 'Navigation Point',
        type: 'navigation',
        onClick: () => console.log('Navigate to next scene'),
      },
      {
        id: 'demo-action',
        position: [0, -20, 35], // Front-center, lower
        title: 'Action Button',
        type: 'action',
        onClick: () => alert('Action performed!'),
      },
    ],
    []
  );

  // Combine demo hotspots with props hotspots
  const allHotspots = useMemo(() => [...demoHotspots, ...(hotspots || [])], [demoHotspots, hotspots]);

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
        {/* Use Environment with FOV-based zoom */}
        <Environment
          files={cubeMapFiles}
          background={true}
          backgroundBlurriness={0}
          backgroundIntensity={1}
          environmentIntensity={1}
        />
        {/* Render interactive hotspots */}
        {allHotspots?.map((hotspot) => (
          <InteractiveHotspot key={hotspot.id} hotspot={hotspot} />
        ))}
        {/* Panorama controls with FOV zoom and interactive hotspots */}
        <PanoramaControls enableDamping={false} />
      </Suspense>
    </Canvas>
  );
}
