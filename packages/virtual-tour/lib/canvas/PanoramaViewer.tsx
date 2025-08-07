import React, { useCallback, useState } from 'react';
import { VirtualTourCanvas } from './VirtualTourCanvas';
import { PanoramaSphere } from './PanoramaSphere';
import { CameraController } from './CameraController';
import { PanoramaViewerProps } from './types';

export const PanoramaViewer: React.FC<PanoramaViewerProps> = ({
  panoramaUrl,
  initialPosition = {
    rotation: { x: 0, y: 0, z: 0 },
    zoom: 1,
  },
  enableControls = true,
  minZoom = 0.5,
  maxZoom = 3,
  enableDamping = true,
  dampingFactor = 0.05,
  autoRotateSpeed = 0,
  onLoad,
  onError,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const handleTextureLoad = useCallback(() => {
    setIsLoading(false);
    setLoadError(null);
    onLoad?.();
  }, [onLoad]);

  const handleTextureError = useCallback(
    (error: Error) => {
      setIsLoading(false);
      setLoadError(error);
      onError?.(error);
    },
    [onError]
  );

  // Camera configuration optimized for panorama viewing
  const cameraConfig = {
    position: [0, 0, 0.1] as [number, number, number],
    fov: 75,
    near: 0.01,
    far: 1000,
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <VirtualTourCanvas camera={cameraConfig} style={{ background: '#000' }}>
        {/* Ambient light for basic visibility */}
        <ambientLight intensity={1} />

        {/* Panorama sphere */}
        <PanoramaSphere texture={panoramaUrl} radius={500} widthSegments={64} heightSegments={32} />

        {/* Camera controls */}
        {enableControls && (
          <CameraController
            enableOrbit={true}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            autoRotate={autoRotateSpeed > 0}
            autoRotateSpeed={autoRotateSpeed}
            enableDamping={enableDamping}
            dampingFactor={dampingFactor}
            minDistance={minZoom}
            maxDistance={maxZoom}
            // Restrict vertical rotation for better panorama viewing
            minPolarAngle={Math.PI / 6} // 30 degrees from top
            maxPolarAngle={(5 * Math.PI) / 6} // 30 degrees from bottom
          />
        )}

        {/* Custom children (hotspots, overlays, etc.) */}
        {children}
      </VirtualTourCanvas>

      {/* Loading overlay */}
      {/* {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            fontSize: '16px',
            zIndex: 10,
          }}
        >
          Loading panorama...
        </div>
      )} */}

      {/* Error overlay */}
      {loadError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'red',
            fontSize: '16px',
            zIndex: 10,
          }}
        >
          Error loading panorama: {loadError.message}
        </div>
      )}
    </div>
  );
};
