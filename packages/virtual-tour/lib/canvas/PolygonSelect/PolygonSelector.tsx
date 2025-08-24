'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Polygon, Vector3Like } from '../types';
import { PolygonOverlay } from './PolygonOverlay';

// Helper function to convert Vector3Like to THREE.Vector3
function toVector3(point: Vector3Like): THREE.Vector3 {
  return point instanceof THREE.Vector3 ? point.clone() : new THREE.Vector3(point.x, point.y, point.z);
}

export interface PolygonSelectorProps {
  completedPolygons?: Polygon[];
  onPolygonClick?: (polygon: Polygon) => void;
}

export function PolygonSelector({ completedPolygons = [], onPolygonClick }: PolygonSelectorProps) {
  return (
    <group>
      {/* Render completed polygons */}
      {completedPolygons.map((polygon) => (
        <group key={polygon.id}>
          {/* Polygon overlay with semi-transparent fill */}
          <PolygonOverlay points={polygon.points} onClick={() => onPolygonClick?.(polygon)} />
          {/* Polygon outline */}
          <PolygonLine points={polygon.points} color="#ffffff" closed />
        </group>
      ))}
    </group>
  );
}

// Helper component for rendering polygon lines
interface PolygonLineProps {
  points: Vector3Like[];
  color: string;
  closed?: boolean;
  dashed?: boolean;
}

function PolygonLine({ points, color, closed = false, dashed = false }: PolygonLineProps) {
  const linePoints = useMemo(() => {
    if (points.length < 2) return [];

    // Convert all points to THREE.Vector3
    const convertedPoints = points.map(toVector3);

    if (closed && convertedPoints.length >= 3 && convertedPoints[0]) {
      convertedPoints.push(convertedPoints[0]); // Close the polygon
    }

    return convertedPoints;
  }, [points, closed]);

  if (linePoints.length < 2) return null;

  return <Line points={linePoints} color={color} lineWidth={2} dashed={dashed} dashScale={0.5} />;
}
