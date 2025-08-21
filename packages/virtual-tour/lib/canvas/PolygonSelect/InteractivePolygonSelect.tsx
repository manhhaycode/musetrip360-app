'use client';

import { ThreeEvent, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PointIndicator } from './PointIndicator';
import { PolygonLine } from './PolygonLine';
import { PolygonOverlay } from './PolygonOverlay';
import type { InteractivePolygonSelectProps, PolygonDrawingState } from './types';
import { toVector3 } from './utils';

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

  useEffect(() => {
    setDrawingState((prev) => ({
      ...prev,
      currentPoints: points,
      isDrawing: points.length > 0,
    }));
  }, [points]);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      if (!isActive) return;

      console.log('Polygon click detected!', { isActive, event });

      const intersectionPoint = event.point;
      if (intersectionPoint) {
        const newPoint = intersectionPoint.clone();
        console.log('Adding point:', newPoint);

        if (drawingState.currentPoints.length >= 3) {
          const firstPoint = drawingState.currentPoints[0];
          if (firstPoint) {
            const firstVec3 = toVector3(firstPoint);
            const distance = newPoint.distanceTo(firstVec3);

            if (distance < 0.8) {
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

  useEffect(() => {
    if (!isActive) return;

    const handleDocumentClick = (event: MouseEvent) => {
      const syntheticEvent = {
        point: null,
        clientX: event.clientX,
        clientY: event.clientY,
        stopPropagation: () => event.stopPropagation(),
      } as any;

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
      {completedPolygons.map((polygon, index) => (
        <group key={`completed-${index}`}>
          <PolygonOverlay points={polygon} onClick={() => onPolygonClick?.(index, polygon)} />
          <PolygonLine points={polygon} color="#ffffff" closed />
        </group>
      ))}

      {isActive && drawingState.currentPoints.length > 0 && (
        <>
          <PolygonLine points={drawingState.currentPoints} color="#00ff00" closed={false} />
        </>
      )}

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
