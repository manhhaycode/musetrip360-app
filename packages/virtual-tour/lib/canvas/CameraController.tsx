import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CameraControllerProps } from './types';

export const CameraController: React.FC<CameraControllerProps> = ({
  enableOrbit = true,
  enableZoom = true,
  enablePan = false, // Disabled by default for panorama viewing
  enableRotate = true,
  autoRotate = false,
  autoRotateSpeed = 2.0,
  enableDamping = true,
  dampingFactor = 0.05,
  minDistance = 0.1,
  maxDistance = 1000,
  minPolarAngle = 0,
  maxPolarAngle = Math.PI,
  minAzimuthAngle = -Infinity,
  maxAzimuthAngle = Infinity,
  onViewChange,
  onZoomChange,
}) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const lastPosition = useRef({ theta: 0, phi: 0, distance: 1 });

  // Track camera changes and call callbacks
  useFrame(() => {
    if (controlsRef.current && (onViewChange || onZoomChange)) {
      // Get current spherical coordinates
      const position = camera.position;
      const distance = position.length();
      const theta = Math.atan2(position.z, position.x);
      const phi = Math.acos(position.y / distance);

      // Check if position changed significantly
      const threshold = 0.01; // Radians
      const distanceThreshold = 0.1;

      const thetaChanged = Math.abs(theta - lastPosition.current.theta) > threshold;
      const phiChanged = Math.abs(phi - lastPosition.current.phi) > threshold;
      const distanceChanged = Math.abs(distance - lastPosition.current.distance) > distanceThreshold;

      if (thetaChanged || phiChanged) {
        lastPosition.current.theta = theta;
        lastPosition.current.phi = phi;
        onViewChange?.(theta, phi, Math.PI / 2); // Approximate FOV
      }

      if (distanceChanged) {
        lastPosition.current.distance = distance;
        // Convert distance to zoom level (inverse relationship)
        const zoomLevel = Math.max(0.1, 10 / distance);
        onZoomChange?.(zoomLevel);
      }
    }
  });

  if (!enableOrbit) {
    return null;
  }

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={enableZoom}
      enablePan={enablePan}
      enableRotate={enableRotate}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      enableDamping={enableDamping}
      dampingFactor={dampingFactor}
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={minPolarAngle}
      maxPolarAngle={maxPolarAngle}
      minAzimuthAngle={minAzimuthAngle}
      maxAzimuthAngle={maxAzimuthAngle}
    />
  );
};
