/**
 * useCubemapViewer Hook
 *
 * Custom hook that handles all complex logic for cubemap viewing:
 * - Network detection and quality adaptation
 * - Camera controls and zoom-based quality switching
 * - Loading state management
 * - Error handling and recovery
 * - Configuration management
 */

import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { NetworkDetector } from '../utils/NetworkDetector';
import type {
  CubeMapData,
  FaceLoadingState,
  CubemapLoadingState,
  NetworkQuality,
  LoadingError,
  HybridLoaderOptions,
} from '../types';

export interface CubemapViewerConfig {
  /** Cubemap data to display */
  cubeMapData: CubeMapData;
  /** Initial camera position */
  initialCamera?: {
    position?: [number, number, number];
    target?: [number, number, number];
    zoom?: number;
  };
  /** Camera control configuration */
  controls?: {
    enableControls?: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
    enableRotate?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    enableDamping?: boolean;
    dampingFactor?: number;
    minDistance?: number;
    maxDistance?: number;
    minPolarAngle?: number;
    maxPolarAngle?: number;
    minAzimuthAngle?: number;
    maxAzimuthAngle?: number;
  };
  /** Quality and loading configuration */
  qualitySettings?: {
    enableNetworkAdaptation?: boolean;
    enableProgressiveLoading?: boolean;
    initialQualityLevel?: number;
    maxQualityLevel?: number;
    zoomQualityThreshold?: number;
  };
  /** Loader configuration */
  loaderOptions?: HybridLoaderOptions;
}

export interface CubemapViewerCallbacks {
  /** Event callbacks */
  onLoad?: () => void;
  onError?: (error: LoadingError) => void;
  onProgress?: (progress: number) => void;
  onQualityChange?: (level: number, networkQuality: NetworkQuality) => void;
  onCameraChange?: (camera: { position: THREE.Vector3; target: THREE.Vector3 }) => void;
}

export interface CubemapViewerState {
  currentLevel: number;
  networkQuality: NetworkQuality;
  loadingState: CubemapLoadingState | null;
  isLoaded: boolean;
  error: LoadingError | null;
}

export interface CubemapViewerActions {
  handleFaceLoaded: (faceState: FaceLoadingState) => void;
  handleProgress: (progress: number) => void;
  handleError: (error: any) => void;
  handleLevelComplete: (level: number) => void;
  handleCameraChange: (camera: { position: THREE.Vector3; target: THREE.Vector3 }) => void;
  handleCanvasError: (error: any) => void;
  clearError: () => void;
  setQualityLevel: (level: number) => void;
}

export interface CubemapViewerConfigs {
  cameraConfig: {
    position: [number, number, number];
    target: [number, number, number];
    zoom: number;
  };
  controlsConfig: {
    enableControls: boolean;
    enableZoom: boolean;
    enablePan: boolean;
    enableRotate: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableDamping: boolean;
    dampingFactor: number;
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle?: number;
    maxAzimuthAngle?: number;
  };
  qualityConfig: {
    enableNetworkAdaptation: boolean;
    enableProgressiveLoading: boolean;
    initialQualityLevel: number;
    maxQualityLevel: number;
    zoomQualityThreshold: number;
  };
}

export interface UseCubemapViewerReturn {
  state: CubemapViewerState;
  actions: CubemapViewerActions;
  configs: CubemapViewerConfigs;
  refs: {
    controlsRef: React.MutableRefObject<any>;
    networkDetectorRef: React.MutableRefObject<NetworkDetector | null>;
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  };
}

export const useCubemapViewer = (
  config: CubemapViewerConfig,
  callbacks: CubemapViewerCallbacks = {}
): UseCubemapViewerReturn => {
  const { cubeMapData, initialCamera = {}, controls = {}, qualitySettings = {}, loaderOptions = {} } = config;

  const { onLoad, onError, onProgress, onQualityChange, onCameraChange } = callbacks;

  // Refs
  const controlsRef = useRef<any>(null);
  const networkDetectorRef = useRef<NetworkDetector | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [currentLevel, setCurrentLevel] = useState(qualitySettings.initialQualityLevel || 0);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>('medium');
  const [loadingState, setLoadingState] = useState<CubemapLoadingState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<LoadingError | null>(null);

  // Configuration with defaults
  const cameraConfig = useMemo(
    () => ({
      position: initialCamera.position || ([0, 0, 0.1] as [number, number, number]),
      target: initialCamera.target || ([0, 0, 0] as [number, number, number]),
      zoom: initialCamera.zoom || 1,
    }),
    [initialCamera]
  );

  const controlsConfig = useMemo(
    () => ({
      enableControls: controls.enableControls ?? true,
      enableZoom: controls.enableZoom ?? true,
      enablePan: controls.enablePan ?? false, // Typically disabled for panoramas
      enableRotate: controls.enableRotate ?? true,
      autoRotate: controls.autoRotate ?? false,
      autoRotateSpeed: controls.autoRotateSpeed ?? 0.5,
      enableDamping: controls.enableDamping ?? true,
      dampingFactor: controls.dampingFactor ?? 0.1,
      minDistance: controls.minDistance ?? 0.1,
      maxDistance: controls.maxDistance ?? 100, // Fixed: was 1000 which broke immersion
      minPolarAngle: controls.minPolarAngle ?? 0,
      maxPolarAngle: controls.maxPolarAngle ?? Math.PI,
      minAzimuthAngle: controls.minAzimuthAngle,
      maxAzimuthAngle: controls.maxAzimuthAngle,
    }),
    [controls]
  );

  const qualityConfig = useMemo(
    () => ({
      enableNetworkAdaptation: qualitySettings.enableNetworkAdaptation ?? true,
      enableProgressiveLoading: qualitySettings.enableProgressiveLoading ?? true,
      initialQualityLevel: qualitySettings.initialQualityLevel ?? 0,
      maxQualityLevel: qualitySettings.maxQualityLevel ?? cubeMapData.cubeMaps.length - 1,
      zoomQualityThreshold: qualitySettings.zoomQualityThreshold ?? 2.0,
    }),
    [qualitySettings, cubeMapData.cubeMaps.length]
  );

  // Initialize network detector
  useEffect(() => {
    if (qualityConfig.enableNetworkAdaptation) {
      networkDetectorRef.current = new NetworkDetector({
        enableLogging: false,
        retryInterval: 60000, // 1 minute
      });

      // Get initial network quality
      const updateNetworkQuality = () => {
        const networkInfo = networkDetectorRef.current?.getCurrentNetworkInfo();
        if (networkInfo) {
          setNetworkQuality(networkInfo.quality);
        }
      };

      updateNetworkQuality();

      // Test network quality immediately
      networkDetectorRef.current.testNetworkQuality().then(() => {
        updateNetworkQuality();
      });

      return () => {
        networkDetectorRef.current?.dispose();
        networkDetectorRef.current = null;
      };
    }
  }, [qualityConfig.enableNetworkAdaptation]);

  // Handle camera changes for zoom-based quality adaptation
  const handleCameraChange = useCallback(
    (camera: { position: THREE.Vector3; target: THREE.Vector3 }) => {
      if (qualityConfig.enableProgressiveLoading && controlsRef.current) {
        const controls = controlsRef.current;
        const distance = controls.getDistance ? controls.getDistance() : camera.position.length();

        // Calculate zoom level (closer = higher zoom)
        const zoomLevel = Math.max(0.1, 100 / distance);

        // Determine required quality level based on zoom
        if (zoomLevel > qualityConfig.zoomQualityThreshold) {
          const targetLevel = Math.min(
            qualityConfig.maxQualityLevel,
            Math.floor(zoomLevel / qualityConfig.zoomQualityThreshold)
          );

          if (targetLevel > currentLevel) {
            setCurrentLevel(targetLevel);
            onQualityChange?.(targetLevel, networkQuality);
          }
        }
      }

      onCameraChange?.(camera);
    },
    [currentLevel, networkQuality, qualityConfig, onCameraChange, onQualityChange]
  );

  // Handle loading callbacks
  const handleFaceLoaded = useCallback((faceState: FaceLoadingState) => {
    // Face loaded successfully - clear any previous errors
    setError(null);

    // Update loading state if needed
    setLoadingState((prevState) => {
      if (!prevState) return prevState;

      const updatedFaces = [...prevState.faces];
      const faceIndex = updatedFaces.findIndex((f) => f.faceIndex === faceState.faceIndex);
      if (faceIndex >= 0) {
        updatedFaces[faceIndex] = faceState;
      }

      return {
        ...prevState,
        faces: updatedFaces,
      };
    });
  }, []);

  const handleProgress = useCallback(
    (progress: number) => {
      onProgress?.(progress);
    },
    [onProgress]
  );

  const handleError = useCallback(
    (error: any) => {
      const loadingError: LoadingError = {
        type: 'network',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        recoverable: true,
      };

      setError(loadingError);
      onError?.(loadingError);
    },
    [onError]
  );

  const handleLevelComplete = useCallback(
    (level: number) => {
      if (level === 0) {
        setIsLoaded(true);
        onLoad?.();
      }
    },
    [onLoad]
  );

  const handleCanvasError = useCallback(
    (error: any) => {
      const loadingError: LoadingError = {
        type: 'memory',
        message: 'Canvas rendering error: ' + (error instanceof Error ? error.message : String(error)),
        timestamp: new Date(),
        recoverable: false,
      };

      setError(loadingError);
      onError?.(loadingError);
    },
    [onError]
  );

  // Additional actions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setQualityLevel = useCallback(
    (level: number) => {
      const clampedLevel = Math.max(0, Math.min(level, qualityConfig.maxQualityLevel));
      setCurrentLevel(clampedLevel);
      onQualityChange?.(clampedLevel, networkQuality);
    },
    [qualityConfig.maxQualityLevel, networkQuality, onQualityChange]
  );

  // Network-based quality adjustment
  useEffect(() => {
    if (qualityConfig.enableNetworkAdaptation && isLoaded) {
      let targetLevel = qualityConfig.initialQualityLevel;

      switch (networkQuality) {
        case 'slow':
          targetLevel = 0; // Lowest quality
          break;
        case 'medium':
          targetLevel = Math.min(1, qualityConfig.maxQualityLevel);
          break;
        case 'fast':
          targetLevel = Math.min(2, qualityConfig.maxQualityLevel);
          break;
        case 'ultra':
          targetLevel = qualityConfig.maxQualityLevel;
          break;
      }

      if (targetLevel !== currentLevel) {
        setCurrentLevel(targetLevel);
        onQualityChange?.(targetLevel, networkQuality);
      }
    }
  }, [networkQuality, isLoaded, qualityConfig, currentLevel, onQualityChange]);

  return {
    state: {
      currentLevel,
      networkQuality,
      loadingState,
      isLoaded,
      error,
    },
    actions: {
      handleFaceLoaded,
      handleProgress,
      handleError,
      handleLevelComplete,
      handleCameraChange,
      handleCanvasError,
      clearError,
      setQualityLevel,
    },
    configs: {
      cameraConfig,
      controlsConfig,
      qualityConfig,
    },
    refs: {
      controlsRef,
      networkDetectorRef,
      canvasRef,
    },
  };
};
