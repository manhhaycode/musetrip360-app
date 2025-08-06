/**
 * useProgressiveLoader Hook
 *
 * React hook for managing progressive cubemap loading with intelligent
 * quality adaptation based on network conditions and user interactions.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { ProgressiveLoader } from '../cubemap/ProgressiveLoader';
import type {
  ProgressiveLoaderOptions,
  ProgressiveLoaderCallbacks,
  ProgressiveLoadingState,
  ProgressiveMetrics,
  ProgressiveStrategy,
} from '../cubemap/ProgressiveLoader';
import type { CubeMapData, LoadingError, FaceLoadingState } from '../types';

export interface UseProgressiveLoaderConfig {
  /** Progressive loader options */
  options?: ProgressiveLoaderOptions;
  /** Enable automatic quality adaptation */
  enableAutoAdaptation?: boolean;
  /** Adaptation trigger sensitivity */
  adaptationSensitivity?: 'low' | 'medium' | 'high';
  /** Loading identifier */
  loadingId?: string;
}

export interface UseProgressiveLoaderCallbacks extends ProgressiveLoaderCallbacks {
  /** Called when loading starts */
  onLoadingStart?: (cubeMapData: CubeMapData) => void;
  /** Called when loading completes */
  onLoadingComplete?: (metrics: ProgressiveMetrics) => void;
}

export interface ProgressiveLoaderState {
  /** Current loading state */
  loadingState: ProgressiveLoadingState | null;
  /** Progressive metrics */
  metrics: ProgressiveMetrics | null;
  /** Current strategy */
  strategy: ProgressiveStrategy | null;
  /** Loading status */
  isLoading: boolean;
  /** Error state */
  error: LoadingError | null;
  /** Active quality level */
  activeLevel: number;
  /** Available levels */
  availableLevels: number[];
}

export interface ProgressiveLoaderActions {
  /** Start progressive loading */
  startLoading: (cubeMapData: CubeMapData) => Promise<void>;
  /** Adapt to specific quality level */
  adaptToLevel: (level: number, trigger?: 'network' | 'user' | 'automatic') => Promise<void>;
  /** Record user interaction */
  recordInteraction: (action: 'zoom' | 'pan' | 'quality_request', level: number, success?: boolean) => void;
  /** Force strategy update */
  updateStrategy: (strategy: Partial<ProgressiveStrategy>) => void;
  /** Reset loading state */
  reset: () => void;
  /** Pause/resume progressive loading */
  setPaused: (paused: boolean) => void;
}

export interface UseProgressiveLoaderReturn {
  state: ProgressiveLoaderState;
  actions: ProgressiveLoaderActions;
  loader: ProgressiveLoader | null;
}

export const useProgressiveLoader = (
  config: UseProgressiveLoaderConfig = {},
  callbacks: UseProgressiveLoaderCallbacks = {}
): UseProgressiveLoaderReturn => {
  const {
    options = {},
    enableAutoAdaptation = true,
    adaptationSensitivity = 'medium',
    loadingId = 'progressive-hook',
  } = config;

  const {
    onLoadingStart,
    onLoadingComplete,
    onLevelActivated,
    onStrategyChange,
    onQualityAdaptation,
    onFaceLoaded,
    onProgress,
    onError,
    onLevelComplete,
  } = callbacks;

  // Refs
  const loaderRef = useRef<ProgressiveLoader | null>(null);
  const currentDataRef = useRef<CubeMapData | null>(null);
  const isPausedRef = useRef(false);

  // State
  const [loadingState, setLoadingState] = useState<ProgressiveLoadingState | null>(null);
  const [metrics, setMetrics] = useState<ProgressiveMetrics | null>(null);
  const [strategy, setStrategy] = useState<ProgressiveStrategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoadingError | null>(null);
  const [activeLevel, setActiveLevel] = useState(0);
  const [availableLevels, setAvailableLevels] = useState<number[]>([]);

  // Initialize loader
  useEffect(() => {
    const progressiveCallbacks: ProgressiveLoaderCallbacks = {
      onLevelActivated: (level, progressiveMetrics) => {
        setActiveLevel(level);
        setMetrics(progressiveMetrics);
        onLevelActivated?.(level, progressiveMetrics);
      },
      onStrategyChange: (newStrategy, reason) => {
        setStrategy(newStrategy);
        onStrategyChange?.(newStrategy, reason);
      },
      onQualityAdaptation: (fromLevel, toLevel, trigger) => {
        setActiveLevel(toLevel);
        onQualityAdaptation?.(fromLevel, toLevel, trigger);
      },
      onFaceLoaded: (faceState: FaceLoadingState) => {
        // Update loading state
        const currentState = loaderRef.current?.getProgressiveState(loadingId);
        if (currentState) {
          setLoadingState({ ...currentState });
        }
        onFaceLoaded?.(faceState);
      },
      onProgress: (progress: number) => {
        onProgress?.(progress);
      },
      onError: (loadingError: LoadingError) => {
        setError(loadingError);
        onError?.(loadingError);
      },
      onLevelComplete: (level: number) => {
        const currentState = loaderRef.current?.getProgressiveState(loadingId);
        if (currentState) {
          setLoadingState({ ...currentState });

          // Check if all levels are complete
          if (currentState.isComplete) {
            setIsLoading(false);
            const finalMetrics = loaderRef.current?.getProgressiveMetrics();
            if (finalMetrics) {
              onLoadingComplete?.(finalMetrics);
            }
          }
        }
        onLevelComplete?.(level);
      },
    };

    loaderRef.current = new ProgressiveLoader(options, progressiveCallbacks);

    return () => {
      loaderRef.current?.dispose();
      loaderRef.current = null;
    };
  }, [options, loadingId]); // Recreate if options change

  // Auto-adaptation based on network changes
  useEffect(() => {
    if (!enableAutoAdaptation || !loaderRef.current || !currentDataRef.current) {
      return;
    }

    const sensitivityMap = {
      low: 5000, // 5 seconds
      medium: 3000, // 3 seconds
      high: 1000, // 1 second
    };

    const interval = setInterval(async () => {
      if (isPausedRef.current) return;

      try {
        const currentMetrics = loaderRef.current?.getProgressiveMetrics();
        if (currentMetrics) {
          // Simple adaptation logic: if network quality changed significantly
          const networkChanged = Math.abs(Date.now() - currentMetrics.timestamp.getTime()) > 30000;

          if (networkChanged) {
            // Trigger network-based adaptation
            await loaderRef.current?.adaptQuality(
              Math.min(activeLevel + 1, availableLevels.length - 1),
              'network',
              loadingId
            );
          }
        }
      } catch (error) {
        console.warn('Auto-adaptation failed:', error);
      }
    }, sensitivityMap[adaptationSensitivity]);

    return () => clearInterval(interval);
  }, [enableAutoAdaptation, adaptationSensitivity, activeLevel, availableLevels.length, loadingId]);

  // Actions
  const startLoading = useCallback(
    async (cubeMapData: CubeMapData) => {
      if (!loaderRef.current) return;

      try {
        setError(null);
        setIsLoading(true);
        currentDataRef.current = cubeMapData;

        // Set available levels
        const levels = Array.from({ length: cubeMapData.cubeMaps.length }, (_, i) => i);
        setAvailableLevels(levels);

        onLoadingStart?.(cubeMapData);

        await loaderRef.current.startProgressiveLoading(cubeMapData, loadingId);

        // Update initial state
        const initialState = loaderRef.current.getProgressiveState(loadingId);
        if (initialState) {
          setLoadingState(initialState);
        }
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
    },
    [loadingId, onLoadingStart]
  );

  const adaptToLevel = useCallback(
    async (level: number, trigger: 'network' | 'user' | 'automatic' = 'user') => {
      if (!loaderRef.current || isPausedRef.current) return;

      try {
        setError(null);
        await loaderRef.current.adaptQuality(level, trigger, loadingId);
      } catch (error) {
        const loadingError: LoadingError = {
          type: 'network',
          message: `Failed to adapt to level ${level}: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date(),
          recoverable: true,
        };
        setError(loadingError);
        throw error;
      }
    },
    [loadingId]
  );

  const recordInteraction = useCallback(
    (action: 'zoom' | 'pan' | 'quality_request', level: number, success: boolean = true) => {
      if (!loaderRef.current) return;

      loaderRef.current.recordUserInteraction(action, level, success);

      // Update metrics
      const updatedMetrics = loaderRef.current.getProgressiveMetrics();
      setMetrics(updatedMetrics);
    },
    []
  );

  const updateStrategy = useCallback((strategyUpdate: Partial<ProgressiveStrategy>) => {
    if (!loaderRef.current) return;

    // This would require extending ProgressiveLoader with strategy update method
    // For now, we'll update local state
    setStrategy((prev) => (prev ? { ...prev, ...strategyUpdate } : null));
  }, []);

  const reset = useCallback(() => {
    if (!loaderRef.current) return;

    // Reset all state
    setLoadingState(null);
    setMetrics(null);
    setStrategy(null);
    setIsLoading(false);
    setError(null);
    setActiveLevel(0);
    setAvailableLevels([]);
    currentDataRef.current = null;
    isPausedRef.current = false;
  }, []);

  const setPaused = useCallback((paused: boolean) => {
    isPausedRef.current = paused;
  }, []);

  return {
    state: {
      loadingState,
      metrics,
      strategy,
      isLoading,
      error,
      activeLevel,
      availableLevels,
    },
    actions: {
      startLoading,
      adaptToLevel,
      recordInteraction,
      updateStrategy,
      reset,
      setPaused,
    },
    loader: loaderRef.current,
  };
};
