'use client';

import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useFOVZoom } from '../hooks/useFOVZoom';
import type { Hotspot } from './types';

export interface PanoramaControlsProps {
  hotspots?: Hotspot[];
  enableDamping?: boolean;
  dampingFactor?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
  enableRotate?: boolean;
  // NEW: Controlled camera position
  controlledPosition?: { theta: number; phi: number; fov?: number };
  // NEW: Camera change callback
  onViewChange?: (position: { theta: number; phi: number; fov: number }) => void;
  // NEW: Enable/disable user controls
  enableUserControls?: boolean;
}

/**
 * Panorama controls component that combines OrbitControls with FOV zoom and hotspots
 * Handles camera controls, zoom functionality, and renders interactive hotspots
 */
export function PanoramaControls({
  enableDamping = false,
  dampingFactor = 0.02,
  minPolarAngle = Math.PI / 6,
  maxPolarAngle = (5 * Math.PI) / 6,
  enableRotate = true,
  controlledPosition,
  onViewChange,
  enableUserControls = true,
}: PanoramaControlsProps) {
  // Initialize FOV zoom functionality with control awareness
  useFOVZoom(enableUserControls, (fov) => {
    if (onViewChange && enableUserControls) {
      // Get current camera position when FOV changes via zoom
      const position = camera.position;
      const distance = position.length();
      const theta = Math.atan2(position.z, position.x);
      const phi = Math.acos(position.y / distance);
      onViewChange({ theta, phi, fov });
    }
  });

  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const lastPosition = useRef({ theta: 0, phi: 0, distance: 1 });

  // Apply controlled camera position
  useEffect(() => {
    if (controlledPosition && camera) {
      const { theta, phi, fov } = controlledPosition;

      // Convert spherical coordinates to cartesian position
      const radius = camera.position.length() || 0.1;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      camera.position.set(x, y, z);
      camera.lookAt(0, 0, 0);

      // Update FOV if provided
      if (fov && 'fov' in camera) {
        (camera as any).fov = fov;
        camera.updateProjectionMatrix();
      }

      // Update OrbitControls target
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }
  }, [controlledPosition, camera]);

  // Track camera changes and call callbacks
  useFrame(() => {
    if (controlsRef.current && onViewChange && enableUserControls) {
      // Get current spherical coordinates
      const position = camera.position;
      const distance = position.length();
      const theta = Math.atan2(position.z, position.x);
      const phi = Math.acos(position.y / distance);

      // Check if position changed significantly
      const threshold = 0.01; // Radians
      const thetaChanged = Math.abs(theta - lastPosition.current.theta) > threshold;
      const phiChanged = Math.abs(phi - lastPosition.current.phi) > threshold;

      if (thetaChanged || phiChanged) {
        lastPosition.current.theta = theta;
        lastPosition.current.phi = phi;

        // Get current FOV
        const fov = 'fov' in camera ? (camera as any).fov : 75;
        onViewChange({ theta, phi, fov });
      }
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false} // Disabled to use custom FOV zoom
        enableRotate={enableRotate && enableUserControls}
        enableDamping={enableDamping}
        dampingFactor={dampingFactor}
        target={[0, 0, 0]}
        minPolarAngle={minPolarAngle}
        maxPolarAngle={maxPolarAngle}
      />
    </>
  );
}
