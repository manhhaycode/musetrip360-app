'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useThree, ThreeEvent } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export interface PolygonSelectorProps {
  isActive: boolean;
  points?: THREE.Vector3[];
  onPointAdd?: (point: THREE.Vector3) => void;
  onPolygonComplete?: (points: THREE.Vector3[]) => void;
  onCancel?: () => void;
  completedPolygons?: THREE.Vector3[][];
}

interface PolygonDrawingState {
  currentPoints: THREE.Vector3[];
  isDrawing: boolean;
  previewPoint: THREE.Vector3 | null;
}

export function PolygonSelector({
  isActive,
  points = [],
  onPointAdd,
  onPolygonComplete,
  onCancel,
  completedPolygons = [],
}: PolygonSelectorProps) {
  const [drawingState, setDrawingState] = useState<PolygonDrawingState>({
    currentPoints: points,
    isDrawing: false,
    previewPoint: null,
  });

  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Sync external points with internal state
  useEffect(() => {
    setDrawingState((prev) => ({
      ...prev,
      currentPoints: points,
      isDrawing: points.length > 0,
    }));
  }, [points]);

  // Handle mouse move for preview
  const handleMouseMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isActive || !drawingState.isDrawing) return;

    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);

    // Intersect with the panorama sphere (assuming it's at origin with radius ~50)
    const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 50);
    const intersectionPoint = new THREE.Vector3();

    if (raycaster.current.ray.intersectSphere(sphere, intersectionPoint)) {
      setDrawingState((prev) => ({
        ...prev,
        previewPoint: intersectionPoint.clone(),
      }));
    }
  };

  // Handle click to add point
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!isActive) return;

    event.stopPropagation();

    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);

    const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 50);
    const intersectionPoint = new THREE.Vector3();

    if (raycaster.current.ray.intersectSphere(sphere, intersectionPoint)) {
      const newPoint = intersectionPoint.clone();

      // Check if clicking near the first point to close polygon
      if (drawingState.currentPoints.length >= 3) {
        const firstPoint = drawingState.currentPoints[0];
        if (firstPoint) {
          const distance = newPoint.distanceTo(firstPoint);

          if (distance < 5) {
            // Close polygon threshold
            onPolygonComplete?.(drawingState.currentPoints);
            setDrawingState({
              currentPoints: [],
              isDrawing: false,
              previewPoint: null,
            });
            return;
          }
        }
      }

      // Add new point
      const updatedPoints = [...drawingState.currentPoints, newPoint];
      setDrawingState((prev) => ({
        ...prev,
        currentPoints: updatedPoints,
        isDrawing: true,
      }));

      onPointAdd?.(newPoint);
    }
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isActive) return;

      if (event.key === 'Enter' && drawingState.currentPoints.length >= 3) {
        onPolygonComplete?.(drawingState.currentPoints);
        setDrawingState({
          currentPoints: [],
          isDrawing: false,
          previewPoint: null,
        });
      } else if (event.key === 'Escape') {
        onCancel?.();
        setDrawingState({
          currentPoints: [],
          isDrawing: false,
          previewPoint: null,
        });
      }
    };

    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, drawingState.currentPoints, onPolygonComplete, onCancel]);

  if (!isActive) return null;

  return (
    <group>
      {/* Invisible click handler */}
      <mesh onClick={handleClick} onPointerMove={handleMouseMove}>
        <sphereGeometry args={[51, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Render completed polygons */}
      {completedPolygons.map((polygon, index) => (
        <PolygonLine key={`completed-${index}`} points={polygon} color="#ffffff" closed />
      ))}

      {/* Render current drawing polygon */}
      {drawingState.currentPoints.length > 0 && (
        <>
          <PolygonLine points={drawingState.currentPoints} color="#00ff00" closed={false} />

          {/* Preview line to mouse cursor */}
          {drawingState.previewPoint &&
            drawingState.currentPoints.length > 0 &&
            (() => {
              const lastPoint = drawingState.currentPoints[drawingState.currentPoints.length - 1];
              return lastPoint ? (
                <PolygonLine points={[lastPoint, drawingState.previewPoint]} color="#ffff00" dashed closed={false} />
              ) : null;
            })()}
        </>
      )}

      {/* Render point indicators */}
      {drawingState.currentPoints.map((point, index) => (
        <mesh key={`point-${index}`} position={point}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial color={index === 0 ? '#ff0000' : '#00ff00'} />
        </mesh>
      ))}
    </group>
  );
}

// Helper component for rendering polygon lines
interface PolygonLineProps {
  points: THREE.Vector3[];
  color: string;
  closed?: boolean;
  dashed?: boolean;
}

function PolygonLine({ points, color, closed = false, dashed = false }: PolygonLineProps) {
  const linePoints = useMemo(() => {
    if (points.length < 2) return [];

    const linePoints = [...points];
    if (closed && points.length >= 3 && points[0]) {
      linePoints.push(points[0]); // Close the polygon
    }

    return linePoints;
  }, [points, closed]);

  if (linePoints.length < 2) return null;

  return <Line points={linePoints} color={color} lineWidth={2} dashed={dashed} dashScale={0.5} />;
}
