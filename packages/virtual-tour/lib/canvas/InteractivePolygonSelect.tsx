'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useThree, ThreeEvent, useFrame } from '@react-three/fiber';
import { Line, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { Vector3Like } from './types';

// Type for plain object Vector3 from API

// Helper function to convert Vector3Like to THREE.Vector3
function toVector3(point: Vector3Like): Vector3 {
  return point instanceof THREE.Vector3 ? point.clone() : new THREE.Vector3(point.x, point.y, point.z);
}

export interface InteractivePolygonSelectProps {
  isActive: boolean;
  points?: Vector3[];
  completedPolygons?: Vector3Like[][];
  onPointAdd?: (point: Vector3) => void;
  onPolygonComplete?: (points: Vector3[]) => void;
  onCancel?: () => void;
  onPolygonClick?: (polygonIndex: number, points: Vector3Like[]) => void;
}

interface PolygonDrawingState {
  currentPoints: Vector3[];
  isDrawing: boolean;
  previewPoint: Vector3 | null;
}

export function InteractivePolygonSelect({
  isActive,
  points = [],
  completedPolygons = [],
  onPointAdd,
  onPolygonComplete,
  onCancel,
  onPolygonClick,
}: InteractivePolygonSelectProps) {
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

  // Handle click to add point
  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (!isActive) return;

      console.log('Polygon click detected!', { isActive, event });

      // Use the intersection point directly from the event if available
      const intersectionPoint = event.point;
      if (intersectionPoint) {
        const newPoint = intersectionPoint.clone();
        console.log('Adding point:', newPoint);

        // Check if clicking near the first point to close polygon
        if (drawingState.currentPoints.length >= 3) {
          const firstPoint = drawingState.currentPoints[0];
          if (firstPoint) {
            // Convert to THREE.Vector3 if needed for distance calculation
            const firstVec3 = toVector3(firstPoint);
            const distance = newPoint.distanceTo(firstVec3);

            if (distance < 0.8) {
              // Very strict threshold for detailed polygon work
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

        console.log('Calling onPointAdd:', newPoint);
        onPointAdd?.(newPoint);
      } else {
        console.log('No intersection point found in event');
      }
    },
    [isActive, drawingState.currentPoints, onPointAdd, onPolygonComplete]
  );

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

  // Add effect to listen for clicks on the document when active
  useEffect(() => {
    if (!isActive) return;

    const handleDocumentClick = (event: MouseEvent) => {
      // Create a synthetic Three.js event-like object
      const syntheticEvent = {
        point: null, // We'll calculate this
        clientX: event.clientX,
        clientY: event.clientY,
        stopPropagation: () => event.stopPropagation(),
      } as any;

      // Calculate intersection manually
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 50);
      const intersectionPoint = new THREE.Vector3();

      if (raycaster.current.ray.intersectSphere(sphere, intersectionPoint)) {
        syntheticEvent.point = intersectionPoint;
        handleClick(syntheticEvent);
      }
    };

    gl.domElement.addEventListener('click', handleDocumentClick);

    return () => {
      gl.domElement.removeEventListener('click', handleDocumentClick);
    };
  }, [isActive, gl.domElement, camera, handleClick]);

  return (
    <group>
      {/* Render completed polygons - always visible */}
      {completedPolygons.map((polygon, index) => (
        <group key={`completed-${index}`}>
          {/* Polygon overlay with semi-transparent fill */}
          <PolygonOverlay points={polygon} onClick={() => onPolygonClick?.(index, polygon)} />
          {/* Polygon outline */}
          <PolygonLine points={polygon} color="#ffffff" closed />
        </group>
      ))}

      {/* Render current drawing polygon - only when active */}
      {isActive && drawingState.currentPoints.length > 0 && (
        <>
          <PolygonLine points={drawingState.currentPoints} color="#00ff00" closed={false} />
        </>
      )}

      {/* Render point indicators - only when active */}
      {isActive &&
        drawingState.currentPoints.map((point, index) => (
          <PointIndicator
            key={`point-${index}`}
            position={point}
            color={index === 0 ? '#ff0000' : '#00ff00'}
            camera={camera}
          />
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

    // Convert all points to Vector3
    const convertedPoints = points.map(toVector3);
    if (closed && convertedPoints.length >= 3 && convertedPoints[0]) {
      convertedPoints.push(convertedPoints[0]); // Close the polygon
    }

    return convertedPoints;
  }, [points, closed]);

  if (linePoints.length < 2) return null;

  return <Line points={linePoints} color={color} lineWidth={2} dashed={dashed} dashScale={0.5} />;
}

// PolygonOverlay component for clickable filled polygon
interface PolygonOverlayProps {
  points: Vector3Like[];
  onClick?: () => void;
}

function PolygonOverlay({ points, onClick }: PolygonOverlayProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create triangulated geometry for the polygon fill
  const geometry = useMemo(() => {
    if (points.length < 3) return null;

    const shape = new THREE.Shape();

    // Convert 3D points to 2D for shape creation
    // We'll project them onto a plane
    const center = points
      .map(toVector3) // Convert all points to Vector3 first
      .reduce((acc, vec3) => acc.add(vec3), new THREE.Vector3())
      .divideScalar(points.length);

    // Create a local coordinate system
    const normal = new THREE.Vector3(0, 0, 1);
    const tangent = new THREE.Vector3(1, 0, 0);
    const bitangent = new THREE.Vector3(0, 1, 0);

    // Project points to 2D
    const projectedPoints = points.map((point) => {
      // Convert to THREE.Vector3 if needed
      const vec3 = toVector3(point);
      const localPoint = vec3.sub(center);
      return new THREE.Vector2(localPoint.dot(tangent), localPoint.dot(bitangent));
    });

    // Create the shape
    if (projectedPoints.length > 0 && projectedPoints[0]) {
      shape.moveTo(projectedPoints[0].x, projectedPoints[0].y);
      for (let i = 1; i < projectedPoints.length; i++) {
        const point = projectedPoints[i];
        if (point) {
          shape.lineTo(point.x, point.y);
        }
      }
      shape.closePath();
    }

    const geometry = new THREE.ShapeGeometry(shape);

    // Transform geometry back to 3D space
    const matrix = new THREE.Matrix4();
    matrix.makeBasis(tangent, bitangent, normal);
    matrix.setPosition(center);
    geometry.applyMatrix4(matrix);

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
      <meshBasicMaterial color="#ffffff" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Point indicator with responsive size based on camera distance
interface PointIndicatorProps {
  position: Vector3Like;
  color: string;
  camera: THREE.Camera;
}

function PointIndicator({ position, color, camera }: PointIndicatorProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && camera) {
      // Convert position to THREE.Vector3 if needed
      const positionVec3 = toVector3(position);

      // Calculate distance from camera to point
      const distance = camera.position.distanceTo(positionVec3);

      // Adjust scale based on distance with better scaling formula
      const minScale = 0.1;
      const maxScale = 0.5;
      const baseDistance = 50; // Reference distance

      // Logarithmic scaling for better visual consistency
      const scaleFactor = Math.max(minScale, Math.min(maxScale, (distance / baseDistance) * 0.2));

      meshRef.current.scale.setScalar(scaleFactor);
    }
  });

  // Convert position to array format for Billboard component
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
