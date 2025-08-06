/**
 * useZoomAdaptiveLoader Hook
 *
 * React hook for zoom-adaptive cubemap loading with ultra-high resolution
 * support and intelligent quality switching based on zoom level and viewport.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomAdaptiveLoader } from '../cubemap/ZoomAdaptiveLoader';
import type {
  ZoomAdaptiveOptions,
  ZoomAdaptiveCallbacks,
  ZoomState,
  ZoomMetrics,
  ZoomThresholds,
  ViewportAdaptationConfig,
  UltraHighResConfig,
} from '../cubemap/ZoomAdaptiveLoader';
import type { CubeMapData, LoadingError } from '../types';

export interface UseZoomAdaptiveConfig {
  /** Zoom adaptive loader options */
  options?: ZoomAdaptiveOptions;
  /** Enable automatic zoom tracking */
  enableAutoZoomTracking?: boolean;
  /** Zoom smoothing factor (0-1) */
  zoomSmoothingFactor?: number;
  /** Enable viewport size tracking */
  enableViewportTracking?: boolean;
  /** Performance monitoring frequency (ms) */
  performanceMonitoringInterval?: number;
}

export interface UseZoomAdaptiveCallbacks extends ZoomAdaptiveCallbacks {
  /** Called when zoom state changes */
  onZoomStateChange?: (zoomState: ZoomState) => void;
  /** Called when performance metrics update */
  onPerformanceUpdate?: (metrics: ZoomMetrics) => void;
  /** Called when ultra-high resolution is recommended */
  onUltraHighRecommended?: (currentZoom: number, recommended: boolean) => void;
}

export interface ZoomAdaptiveState {
  /** Current zoom state */
  zoomState: ZoomState;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: LoadingError | null;
  /** Current metrics */
  metrics: ZoomMetrics | null;
  /** Ultra-high resolution status */
  ultraHighStatus: {
    enabled: boolean;
    available: boolean;
    active: boolean;
    memoryUsage: number;
  };
  /** Performance status */
  performanceStatus: {
    frameRate: number;
    memoryWarning: boolean;
    canUpgrade: boolean;
  };
}

export interface ZoomAdaptiveActions {
  /** Start zoom-adaptive loading */
  startLoading: (cubeMapData: CubeMapData) => Promise<void>;
  /** Update zoom level */
  updateZoom: (zoom: number, smooth?: boolean) => void;
  /** Force ultra-high resolution */
  forceUltraHigh: () => Promise<void>;
  /** Update zoom thresholds */
  updateZoomThresholds: (thresholds: Partial<ZoomThresholds>) => void;
  /** Update viewport config */
  updateViewportConfig: (config: Partial<ViewportAdaptationConfig>) => void;
  /** Reset zoom state */
  resetZoom: () => void;
  /** Get current metrics */
  getCurrentMetrics: () => ZoomMetrics | null;
  /** Enable/disable ultra-high resolution */
  setUltraHighEnabled: (enabled: boolean) => void;
}

export interface UseZoomAdaptiveReturn {
  state: ZoomAdaptiveState;
  actions: ZoomAdaptiveActions;
  loader: ZoomAdaptiveLoader | null;
}

export const useZoomAdaptiveLoader = (
  config: UseZoomAdaptiveConfig = {},
  callbacks: UseZoomAdaptiveCallbacks = {}
): UseZoomAdaptiveReturn => {
  const {
    options = {},
    enableAutoZoomTracking = true,
    zoomSmoothingFactor = 0.1,
    enableViewportTracking = true,
    performanceMonitoringInterval = 1000,
  } = config;

  const {
    onZoomStateChange,
    onPerformanceUpdate,
    onUltraHighRecommended,
    onZoomQualityChange,
    onViewportAdaptation,
    onUltraHighActivated,
    onPerformanceConstraint,
    onPrediction,
    ...otherCallbacks
  } = callbacks;

  // Refs
  const loaderRef = useRef<ZoomAdaptiveLoader | null>(null);
  const currentDataRef = useRef<CubeMapData | null>(null);
  const smoothedZoomRef = useRef(1.0);
  const lastUpdateTimeRef = useRef(Date.now());

  // State
  const [zoomState, setZoomState] = useState<ZoomState>({
    currentZoom: 1.0,
    zoomVelocity: 0,
    targetZoom: 1.0,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    pixelDensity: window.devicePixelRatio || 1,
    activeQualityLevel: 0,
    loadingLevels: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoadingError | null>(null);
  const [metrics, setMetrics] = useState<ZoomMetrics | null>(null);
  const [ultraHighStatus, setUltraHighStatus] = useState({
    enabled: options.ultraHighResolution?.enabled ?? true,
    available: true,
    active: false,
    memoryUsage: 0,
  });
  const [performanceStatus, setPerformanceStatus] = useState({
    frameRate: 60,
    memoryWarning: false,
    canUpgrade: true,
  });

  // Initialize loader
  useEffect(() => {
    const zoomCallbacks: ZoomAdaptiveCallbacks = {
      ...otherCallbacks,
      onZoomQualityChange: (zoom, newLevel, oldLevel) => {
        setZoomState((prev) => ({ ...prev, activeQualityLevel: newLevel }));
        onZoomQualityChange?.(zoom, newLevel, oldLevel);
      },
      onViewportAdaptation: (viewport, newStrategy) => {
        setZoomState((prev) => ({ ...prev, viewport }));
        onViewportAdaptation?.(viewport, newStrategy);
      },
      onUltraHighActivated: (level, memoryUsage) => {
        setUltraHighStatus((prev) => ({
          ...prev,
          active: true,
          memoryUsage,
        }));
        onUltraHighActivated?.(level, memoryUsage);
      },
      onPerformanceConstraint: (constraint, action) => {
        if (constraint === 'memory_usage') {
          setPerformanceStatus((prev) => ({ ...prev, memoryWarning: true, canUpgrade: false }));
        }
        onPerformanceConstraint?.(constraint, action);
      },
      onPrediction: (currentZoom, predictedZoom, targetLevel) => {
        // Update loading levels state
        setZoomState((prev) => ({
          ...prev,
          loadingLevels: [...prev.loadingLevels, targetLevel].filter((v, i, a) => a.indexOf(v) === i),
        }));
        onPrediction?.(currentZoom, predictedZoom, targetLevel);
      },
      onError: (loadingError) => {
        setError(loadingError);
        otherCallbacks.onError?.(loadingError);
      },
    };

    loaderRef.current = new ZoomAdaptiveLoader(options, zoomCallbacks);

    return () => {
      loaderRef.current?.dispose();
      loaderRef.current = null;
    };
  }, [options]);

  // Performance monitoring
  useEffect(() => {
    if (!loaderRef.current) return;

    const interval = setInterval(() => {
      const currentMetrics = loaderRef.current?.getZoomMetrics();
      if (currentMetrics) {
        setMetrics(currentMetrics);

        // Update performance status
        const { performanceMetrics } = currentMetrics;
        setPerformanceStatus((prev) => ({
          frameRate: Math.max(0, 60 - performanceMetrics.frameRateImpacts),
          memoryWarning:
            performanceMetrics.peakMemoryUsage > (options.performanceConstraints?.memoryWarningThreshold ?? 400),
          canUpgrade:
            performanceMetrics.peakMemoryUsage < (options.performanceConstraints?.memoryWarningThreshold ?? 400),
        }));

        onPerformanceUpdate?.(currentMetrics);
      }
    }, performanceMonitoringInterval);

    return () => clearInterval(interval);
  }, [performanceMonitoringInterval, onPerformanceUpdate, options.performanceConstraints]);

  // Automatic zoom tracking (e.g., from Three.js camera controls)
  useEffect(() => {
    if (!enableAutoZoomTracking) return;

    // This could be connected to camera controls
    // For now, we'll just track window scroll as a demo
    const handleWheel = (event: WheelEvent) => {
      if (!loaderRef.current) return;

      const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, Math.min(10, smoothedZoomRef.current + zoomDelta));

      updateZoom(newZoom, true);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [enableAutoZoomTracking]);

  // Viewport tracking
  useEffect(() => {
    if (!enableViewportTracking) return;

    const handleResize = () => {
      const newViewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      setZoomState((prev) => ({
        ...prev,
        viewport: newViewport,
        pixelDensity: window.devicePixelRatio || 1,
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [enableViewportTracking]);

  // Actions
  const startLoading = useCallback(async (cubeMapData: CubeMapData) => {
    if (!loaderRef.current) return;

    try {
      setError(null);
      setIsLoading(true);
      currentDataRef.current = cubeMapData;

      await loaderRef.current.startProgressiveLoading(cubeMapData);

      // Check ultra-high availability
      const hasUltraHigh = cubeMapData.cubeMaps.length > 2;
      setUltraHighStatus((prev) => ({
        ...prev,
        available: hasUltraHigh,
      }));
    } catch (error) {
      setIsLoading(false);
      const loadingError: LoadingError = {
        type: 'network',
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        recoverable: true,
      };
      setError(loadingError);
      throw error;
    }
  }, []);

  const updateZoom = useCallback(
    (zoom: number, smooth: boolean = true) => {
      if (!loaderRef.current) return;

      const now = Date.now();
      const deltaTime = now - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = now;

      // Apply smoothing if enabled
      if (smooth && zoomSmoothingFactor > 0) {
        const factor = Math.min(1, (deltaTime / 16.67) * zoomSmoothingFactor); // 60fps baseline
        smoothedZoomRef.current = smoothedZoomRef.current + (zoom - smoothedZoomRef.current) * factor;
      } else {
        smoothedZoomRef.current = zoom;
      }

      // Update loader
      loaderRef.current.updateZoom(smoothedZoomRef.current, smooth);

      // Update local state
      setZoomState((prev) => ({
        ...prev,
        currentZoom: smoothedZoomRef.current,
        targetZoom: zoom,
      }));

      onZoomStateChange?.({
        ...zoomState,
        currentZoom: smoothedZoomRef.current,
        targetZoom: zoom,
      });

      // Check ultra-high recommendation
      const shouldRecommendUltraHigh = zoom > 3 && ultraHighStatus.available && !ultraHighStatus.active;
      if (shouldRecommendUltraHigh) {
        onUltraHighRecommended?.(zoom, true);
      }
    },
    [zoomSmoothingFactor, onZoomStateChange, ultraHighStatus, zoomState]
  );

  const forceUltraHigh = useCallback(async () => {
    if (!loaderRef.current) return;

    try {
      await loaderRef.current.forceUltraHighResolution();
      setUltraHighStatus((prev) => ({ ...prev, active: true }));
    } catch (error) {
      const loadingError: LoadingError = {
        type: 'memory',
        message: `Ultra-high resolution failed: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date(),
        recoverable: true,
      };
      setError(loadingError);
      throw error;
    }
  }, []);

  const updateZoomThresholds = useCallback((thresholds: Partial<ZoomThresholds>) => {
    // This would require extending the ZoomAdaptiveLoader with threshold update method
    // For now, we'll just log the update
    console.log('Zoom thresholds updated:', thresholds);
  }, []);

  const updateViewportConfig = useCallback((config: Partial<ViewportAdaptationConfig>) => {
    // This would require extending the ZoomAdaptiveLoader with viewport config update
    console.log('Viewport config updated:', config);
  }, []);

  const resetZoom = useCallback(() => {
    smoothedZoomRef.current = 1.0;
    updateZoom(1.0, false);

    setZoomState((prev) => ({
      ...prev,
      currentZoom: 1.0,
      targetZoom: 1.0,
      zoomVelocity: 0,
      activeQualityLevel: 0,
      loadingLevels: [],
    }));
  }, [updateZoom]);

  const getCurrentMetrics = useCallback(() => {
    return loaderRef.current?.getZoomMetrics() || null;
  }, []);

  const setUltraHighEnabled = useCallback((enabled: boolean) => {
    setUltraHighStatus((prev) => ({
      ...prev,
      enabled,
      active: enabled ? prev.active : false,
    }));
  }, []);

  return {
    state: {
      zoomState,
      isLoading,
      error,
      metrics,
      ultraHighStatus,
      performanceStatus,
    },
    actions: {
      startLoading,
      updateZoom,
      forceUltraHigh,
      updateZoomThresholds,
      updateViewportConfig,
      resetZoom,
      getCurrentMetrics,
      setUltraHighEnabled,
    },
    loader: loaderRef.current,
  };
};
