'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { PerspectiveCamera } from 'three';

/**
 * Hook for FOV-based zoom functionality in panorama viewers
 * Handles camera setup and wheel event listening for smooth FOV zoom
 * @param enableUserControls - Whether to allow user zoom controls (default: true)
 * @param onFOVChange - Callback when FOV changes due to user interaction
 */
export function useFOVZoom(enableUserControls: boolean = true, onFOVChange?: (fov: number) => void) {
  const { camera, gl } = useThree();

  // Set initial camera position (but don't override FOV if controlled)
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.position.set(0, 0, 0.1);
      // Only set default FOV if not controlled by external system
      if (enableUserControls && camera.fov === 50) {
        // 50 is Three.js default
        camera.fov = 75; // Standard panorama FOV
        camera.updateProjectionMatrix();
      }
    }
  }, [camera, enableUserControls]);

  // Handle wheel events for FOV zoom (only when user controls are enabled)
  useEffect(() => {
    if (!enableUserControls) return;

    const handleWheel = (event: WheelEvent) => {
      // Only handle wheel events when mouse is over the canvas
      if (event.target === gl.domElement) {
        event.preventDefault();
        event.stopPropagation();

        if (camera instanceof PerspectiveCamera) {
          const zoomSpeed = 0.1;
          const delta = event.deltaY * zoomSpeed;
          const oldFOV = camera.fov;

          // Constrain FOV between 30° (zoomed in) and 100° (zoomed out)
          camera.fov = Math.max(30, Math.min(100, camera.fov + delta));
          camera.updateProjectionMatrix();

          // Notify parent component of FOV change
          if (onFOVChange && camera.fov !== oldFOV) {
            onFOVChange(camera.fov);
          }
        }
      }
    };

    // Use passive: false to allow preventDefault
    gl.domElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      gl.domElement.removeEventListener('wheel', handleWheel);
    };
  }, [camera, gl, enableUserControls, onFOVChange]);

  return null;
}
