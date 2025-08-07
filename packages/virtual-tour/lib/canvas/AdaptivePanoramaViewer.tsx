import React, { useState, useEffect, useRef } from 'react';
import { VirtualTourCanvas } from './VirtualTourCanvas';
import { PanoramaSphere } from './PanoramaSphere';
import { CameraController } from './CameraController';
import {
  CloudinaryPanoramaGenerator,
  CloudinaryConfig,
  PanoramaQuality,
  NetworkQualityDetector,
  NetworkQuality,
} from '../utils';

export interface AdaptivePanoramaViewerProps {
  /** Cloudinary public ID for the panorama */
  publicId: string;
  /** Cloudinary configuration */
  cloudinaryConfig: CloudinaryConfig;
  /** Enable automatic quality adaptation based on network */
  enableAdaptiveQuality?: boolean;
  /** Initial camera configuration */
  initialCamera?: {
    position?: [number, number, number];
    rotation?: { x: number; y: number; z: number };
    zoom?: number;
  };
  /** Control settings */
  controls?: {
    enableControls?: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
    enableRotate?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    enableDamping?: boolean;
    dampingFactor?: number;
    minZoom?: number;
    maxZoom?: number;
  };
  /** Event callbacks */
  onQualityChange?: (quality: PanoramaQuality['level']) => void;
  onNetworkChange?: (networkQuality: NetworkQuality) => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  /** Children components (hotspots, overlays) */
  children?: React.ReactNode;
}

export const AdaptivePanoramaViewer: React.FC<AdaptivePanoramaViewerProps> = ({
  publicId,
  cloudinaryConfig,
  enableAdaptiveQuality = true,
  initialCamera = {},
  controls = {},
  onQualityChange,
  onNetworkChange,
  onLoad,
  onError,
  children,
}) => {
  // State management
  const [currentTexture, setCurrentTexture] = useState<string>('');
  const [currentQuality, setCurrentQuality] = useState<PanoramaQuality['level']>('instant');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality | null>(null);

  // Refs
  const cloudinaryGenerator = useRef<CloudinaryPanoramaGenerator | null>(null);
  const networkDetector = useRef<NetworkQualityDetector | null>(null);
  const qualityUpgradeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Initialize services and load panorama
  useEffect(() => {
    // Start adaptive quality loading
    const startQualityAdaptation = async () => {
      if (!networkDetector.current || !cloudinaryGenerator.current) return;

      try {
        // Measure network quality
        const network = await networkDetector.current.measureBandwidth();
        setNetworkQuality(network);
        onNetworkChange?.(network);

        // Get optimal quality for network
        const optimalQuality = cloudinaryGenerator.current.getOptimalQuality(network.bandwidth);

        // Progressive upgrade schedule
        const upgradeSchedule = [
          { delay: 500, quality: 'preview' as const },
          { delay: 2000, quality: 'standard' as const },
          { delay: 5000, quality: 'high' as const },
        ];

        // Apply upgrades progressively
        upgradeSchedule.forEach(({ delay, quality }) => {
          setTimeout(() => {
            const qualityOrder: PanoramaQuality['level'][] = ['instant', 'preview', 'standard', 'high', 'ultra'];
            const optimalIndex = qualityOrder.indexOf(optimalQuality);
            const targetIndex = qualityOrder.indexOf(quality);

            if (targetIndex <= optimalIndex && cloudinaryGenerator.current) {
              const newUrl = cloudinaryGenerator.current.generatePanoramaUrl(publicId, quality);
              setCurrentTexture(newUrl);
              setCurrentQuality(quality);
              onQualityChange?.(quality);
            }
          }, delay);
        });
      } catch (error) {
        console.warn('Network quality adaptation failed:', error);
      }
    };

    const initializeAndLoad = async () => {
      try {
        // Initialize services
        cloudinaryGenerator.current = new CloudinaryPanoramaGenerator(cloudinaryConfig);
        networkDetector.current = new NetworkQualityDetector();

        // Load instant quality first
        const instantUrl = cloudinaryGenerator.current.generatePanoramaUrl(publicId, 'instant');
        setCurrentTexture(instantUrl);
        setCurrentQuality('instant');
        setIsLoading(false);
        onLoad?.();

        // Start quality adaptation if enabled
        if (enableAdaptiveQuality) {
          startQualityAdaptation();
        } else {
          // Load high quality if not adaptive
          setTimeout(() => {
            if (cloudinaryGenerator.current) {
              const high = cloudinaryGenerator.current.generatePanoramaUrl(publicId, 'high');
              setCurrentTexture(high);
              setCurrentQuality('high');
              onQualityChange?.('high');
            }
          }, 1000);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to initialize panorama');
        setLoadError(err);
        setIsLoading(false);
        onError?.(err);
      }
    };

    initializeAndLoad();

    // Cleanup
    return () => {
      const currentTimeout = qualityUpgradeTimeout.current;
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, [publicId, cloudinaryConfig, enableAdaptiveQuality, onLoad, onError, onQualityChange, onNetworkChange]);

  // Camera configuration
  const cameraConfig = {
    position: (initialCamera.position || [0, 0, 0.1]) as [number, number, number],
    fov: 75,
    near: 0.01,
    far: 1000,
  };

  // Control configuration
  const controlConfig = {
    enableOrbit: controls.enableControls ?? true,
    enableZoom: controls.enableZoom ?? true,
    enablePan: controls.enablePan ?? false,
    enableRotate: controls.enableRotate ?? true,
    autoRotate: controls.autoRotate ?? false,
    autoRotateSpeed: controls.autoRotateSpeed ?? 2.0,
    enableDamping: controls.enableDamping ?? true,
    dampingFactor: controls.dampingFactor ?? 0.05,
    minDistance: controls.minZoom ?? 0.5,
    maxDistance: controls.maxZoom ?? 10,
    minPolarAngle: Math.PI / 6, // 30 degrees from top
    maxPolarAngle: (5 * Math.PI) / 6, // 30 degrees from bottom
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <VirtualTourCanvas camera={cameraConfig} style={{ background: '#000' }}>
        {/* Ambient light for basic visibility */}
        <ambientLight intensity={1} />

        {/* Main panorama sphere */}
        <PanoramaSphere texture={currentTexture} radius={500} widthSegments={64} heightSegments={32} />

        {/* Camera controls for zoom/pan/rotate */}
        <CameraController {...controlConfig} />

        {/* Custom children (hotspots, overlays, etc.) */}
        {children}
      </VirtualTourCanvas>

      {/* Loading overlay */}
      {isLoading && (
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
      )}

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

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px',
            fontSize: '12px',
            borderRadius: '4px',
            zIndex: 100,
          }}
        >
          <div>Quality: {currentQuality}</div>
          {networkQuality && (
            <>
              <div>Network: {networkQuality.bandwidth.toFixed(1)} Mbps</div>
              <div>Latency: {networkQuality.latency.toFixed(0)}ms</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
