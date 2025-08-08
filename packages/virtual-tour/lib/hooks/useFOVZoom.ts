'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { PerspectiveCamera } from 'three';

/**
 * Hook for FOV-based zoom functionality in panorama viewers
 * Handles camera setup and wheel event listening for smooth FOV zoom
 */
export function useFOVZoom() {
  const { camera, gl } = useThree();

  // Set initial camera position and FOV
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.position.set(0, 0, 0.1);
      camera.fov = 75; // Standard panorama FOV
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  // Handle wheel events for FOV zoom
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Only handle wheel events when mouse is over the canvas
      if (event.target === gl.domElement) {
        event.preventDefault();
        event.stopPropagation();

        if (camera instanceof PerspectiveCamera) {
          const zoomSpeed = 0.1;
          const delta = event.deltaY * zoomSpeed;

          // Constrain FOV between 30° (zoomed in) and 100° (zoomed out)
          camera.fov = Math.max(30, Math.min(100, camera.fov + delta));
          camera.updateProjectionMatrix();
        }
      }
    };

    // Use passive: false to allow preventDefault
    gl.domElement.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      gl.domElement.removeEventListener('wheel', handleWheel);
    };
  }, [camera, gl]);

  return null;
}
