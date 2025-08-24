'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import type { PolygonLineProps } from './types';
import { toVector3 } from './utils';

export function PolygonLine({ points, color, closed = false, dashed = false }: PolygonLineProps) {
  const linePoints = useMemo(() => {
    if (points.length < 2) return [];

    const convertedPoints = points.map(toVector3);
    if (closed && convertedPoints.length >= 3 && convertedPoints[0]) {
      convertedPoints.push(convertedPoints[0]);
    }

    return convertedPoints;
  }, [points, closed]);

  if (linePoints.length < 2) return null;

  return <Line points={linePoints} color={color} lineWidth={2} dashed={dashed} dashScale={0.5} />;
}
