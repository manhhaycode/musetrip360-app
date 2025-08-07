/**
 * ProgressiveLoader
 *
 * Intelligent multi-resolution cubemap loader that adapts to network conditions
 * and user interaction patterns. Manages progressive enhancement from low to
 * high quality based on available bandwidth and viewing behavior.
 */

import type {
  CubeMapData,
  CubemapLoadingState,
  FaceLoadingState,
  LoadingError,
  LoadingMetrics,
  NetworkQuality,
} from '../types';
import { NetworkDetector, type NetworkDetectorOptions } from '../utils/NetworkDetector';
import { HybridCubemapLoader, type HybridLoaderOptions, type LoaderCallbacks } from './HybridCubemapLoader';

export interface ProgressiveLoaderOptions {
  /** Hybrid loader configuration */
  loaderOptions?: HybridLoaderOptions;
  /** Network detector configuration */
  networkOptions?: NetworkDetectorOptions;
  /** Progressive loading strategy */
  strategy?: ProgressiveStrategy;
  /** Priority boost for specific levels */
  priorityBoost?: Record<number, number>;
  /** Enable predictive loading */
  enablePredictiveLoading?: boolean;
  /** Maximum concurrent level loads */
  maxConcurrentLevels?: number;
  /** Delay between level transitions (ms) */
  levelTransitionDelay?: number;
  /** Enable adaptive quality based on viewport */
  enableViewportAdaptation?: boolean;
}

export interface ProgressiveStrategy {
  /** Network quality to level mapping */
  qualityLevelMap: Record<NetworkQuality, number[]>;
  /** Loading order preference */
  loadingOrder: 'sequential' | 'parallel' | 'adaptive';
  /** Fallback behavior on errors */
  fallbackBehavior: 'retry' | 'skip' | 'degrade';
  /** Bandwidth thresholds for level switching */
  bandwidthThresholds: Record<number, number>; // level -> min Mbps
}

export interface ProgressiveLoadingState extends CubemapLoadingState {
  /** Currently active level */
  activeLevel: number;
  /** Levels queued for loading */
  queuedLevels: number[];
  /** Levels successfully loaded */
  completedLevels: number[];
  /** Levels that failed to load */
  failedLevels: number[];
  /** Progressive loading metrics */
  progressiveMetrics: ProgressiveMetrics;
}

export interface ProgressiveMetrics extends LoadingMetrics {
  /** Time to first meaningful level */
  timeToFirstLevel: number;
  /** Time to optimal quality */
  timeToOptimalQuality: number;
  /** Level transition timings */
  levelTransitions: Array<{
    fromLevel: number;
    toLevel: number;
    timestamp: number;
    duration: number;
    trigger: 'network' | 'user' | 'automatic';
  }>;
  /** Bandwidth utilization efficiency */
  bandwidthEfficiency: number;
  /** User interaction impact */
  interactionMetrics: {
    zoomEvents: number;
    panEvents: number;
    qualityRequestTime: number;
  };
}

export interface ProgressiveLoaderCallbacks extends LoaderCallbacks {
  /** Called when level becomes active */
  onLevelActivated?: (level: number, metrics: ProgressiveMetrics) => void;
  /** Called when loading strategy changes */
  onStrategyChange?: (newStrategy: ProgressiveStrategy, reason: string) => void;
  /** Called on quality adaptation */
  onQualityAdaptation?: (fromLevel: number, toLevel: number, trigger: string) => void;
}

export class ProgressiveLoader {
  private options: Required<ProgressiveLoaderOptions>;
  private callbacks: ProgressiveLoaderCallbacks;
  private hybridLoader: HybridCubemapLoader;
  private networkDetector: NetworkDetector;

  private currentData: CubeMapData | null = null;
  private loadingStates = new Map<string, ProgressiveLoadingState>();
  private loadingQueue = new Map<string, number[]>();
  private activeLoads = new Set<string>();

  private strategy: ProgressiveStrategy;
  private metrics: ProgressiveMetrics;

  // Adaptive learning
  private userBehaviorHistory: Array<{
    timestamp: number;
    action: 'zoom' | 'pan' | 'quality_request';
    level: number;
    success: boolean;
  }> = [];

  constructor(options: ProgressiveLoaderOptions = {}, callbacks: ProgressiveLoaderCallbacks = {}) {
    this.options = {
      loaderOptions: {},
      networkOptions: {},
      strategy: this.getDefaultStrategy(),
      priorityBoost: {},
      enablePredictiveLoading: true,
      maxConcurrentLevels: 2,
      levelTransitionDelay: 500,
      enableViewportAdaptation: true,
      ...options,
    };

    this.callbacks = callbacks;
    this.strategy = this.options.strategy;

    // Initialize metrics
    this.metrics = this.createInitialMetrics();

    // Initialize hybrid loader with progressive callbacks
    this.hybridLoader = new HybridCubemapLoader(this.options.loaderOptions, {
      onFaceLoaded: this.handleFaceLoaded.bind(this),
      onProgress: this.handleProgress.bind(this),
      onError: this.handleError.bind(this),
      onLevelComplete: this.handleLevelComplete.bind(this),
    });

    // Initialize network detector
    this.networkDetector = new NetworkDetector(this.options.networkOptions);
  }

  /**
   * Start progressive loading for cubemap data
   */
  async startProgressiveLoading(cubeMapData: CubeMapData, loadingId: string = 'progressive-default'): Promise<void> {
    this.currentData = cubeMapData;

    // Initialize loading state
    const networkQuality = this.networkDetector.getCurrentNetworkInfo().quality;
    const initialState = this.createProgressiveLoadingState(cubeMapData, networkQuality);
    this.loadingStates.set(loadingId, initialState);

    // Determine initial loading strategy
    const levelSequence = this.determineLevelSequence(networkQuality, cubeMapData);
    this.loadingQueue.set(loadingId, levelSequence);

    // Start loading first level
    await this.loadNextLevel(loadingId);
  }

  /**
   * Adapt quality based on current conditions
   */
  async adaptQuality(
    targetLevel: number,
    trigger: 'network' | 'user' | 'automatic',
    loadingId: string = 'progressive-default'
  ): Promise<void> {
    const state = this.loadingStates.get(loadingId);
    if (!state || !this.currentData) return;

    const fromLevel = state.activeLevel;
    const startTime = performance.now();

    try {
      // Update strategy if needed
      if (trigger === 'network') {
        await this.updateStrategyForNetwork();
      }

      // Load target level if not already loaded
      if (!state.completedLevels.includes(targetLevel)) {
        await this.loadSpecificLevel(targetLevel, loadingId);
      }

      // Activate new level
      await this.activateLevel(targetLevel, loadingId);

      // Record transition
      const duration = performance.now() - startTime;
      this.recordLevelTransition(fromLevel, targetLevel, trigger, duration);

      this.callbacks.onQualityAdaptation?.(fromLevel, targetLevel, trigger);
    } catch (error) {
      console.error('Quality adaptation failed:', error);
      this.handleAdaptationError(error, fromLevel, targetLevel, loadingId);
    }
  }

  /**
   * Handle user interaction for predictive loading
   */
  recordUserInteraction(action: 'zoom' | 'pan' | 'quality_request', level: number, success: boolean = true): void {
    this.userBehaviorHistory.push({
      timestamp: Date.now(),
      action,
      level,
      success,
    });

    // Limit history size
    if (this.userBehaviorHistory.length > 100) {
      this.userBehaviorHistory.shift();
    }

    // Update interaction metrics
    switch (action) {
      case 'zoom':
        this.metrics.interactionMetrics.zoomEvents++;
        break;
      case 'pan':
        this.metrics.interactionMetrics.panEvents++;
        break;
      case 'quality_request':
        this.metrics.interactionMetrics.qualityRequestTime = Date.now();
        break;
    }

    // Trigger predictive loading if enabled
    if (this.options.enablePredictiveLoading) {
      this.triggerPredictiveLoading(action, level);
    }
  }

  /**
   * Get current loading state
   */
  getProgressiveState(loadingId: string = 'progressive-default'): ProgressiveLoadingState | null {
    return this.loadingStates.get(loadingId) || null;
  }

  /**
   * Get progressive metrics
   */
  getProgressiveMetrics(): ProgressiveMetrics {
    return { ...this.metrics };
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.hybridLoader.dispose();
    this.networkDetector.dispose();
    this.loadingStates.clear();
    this.loadingQueue.clear();
    this.activeLoads.clear();
    this.userBehaviorHistory.length = 0;
  }

  // Private implementation methods

  public getDefaultStrategy(): ProgressiveStrategy {
    return {
      qualityLevelMap: {
        slow: [0], // Only lowest quality
        medium: [0, 1], // Low to medium
        fast: [0, 1, 2], // Low to high
        ultra: [0, 1, 2, 3], // All levels
      },
      loadingOrder: 'sequential',
      fallbackBehavior: 'degrade',
      bandwidthThresholds: {
        0: 0.5, // 0.5 Mbps minimum
        1: 2.0, // 2 Mbps for medium
        2: 5.0, // 5 Mbps for high
        3: 10.0, // 10 Mbps for ultra
      },
    };
  }

  private createInitialMetrics(): ProgressiveMetrics {
    return {
      networkQuality: 'medium',
      totalFaces: 0,
      resolutionLevels: 0,
      totalLoadTime: 0,
      averageTimePerFace: 0,
      fastestFace: 0,
      slowestFace: 0,
      totalDataSize: 0,
      failedLoads: 0,
      timestamp: new Date(),
      timeToFirstLevel: 0,
      timeToOptimalQuality: 0,
      levelTransitions: [],
      bandwidthEfficiency: 1.0,
      interactionMetrics: {
        zoomEvents: 0,
        panEvents: 0,
        qualityRequestTime: 0,
      },
    };
  }

  private createProgressiveLoadingState(
    cubeMapData: CubeMapData,
    networkQuality: NetworkQuality
  ): ProgressiveLoadingState {
    const baseState = {
      currentLevel: 0,
      totalLevels: cubeMapData.cubeMaps.length,
      overallProgress: 0,
      faces: [],
      networkQuality,
      startTime: Date.now(),
      failedFaces: 0,
      loadedFaces: 0,
      isComplete: false,
      hasErrors: false,
    };

    return {
      ...baseState,
      activeLevel: 0,
      queuedLevels: [],
      completedLevels: [],
      failedLevels: [],
      progressiveMetrics: { ...this.metrics },
    };
  }

  private determineLevelSequence(networkQuality: NetworkQuality, cubeMapData: CubeMapData): number[] {
    const availableLevels = Array.from({ length: cubeMapData.cubeMaps.length }, (_, i) => i);
    const qualityLevels = this.strategy.qualityLevelMap[networkQuality] || [0];

    // Filter to only include available levels
    const targetLevels = qualityLevels.filter((level) => level < availableLevels.length);

    // Sort by priority (lowest first for sequential)
    return targetLevels.sort((a, b) => a - b);
  }

  private async loadNextLevel(loadingId: string): Promise<void> {
    const queue = this.loadingQueue.get(loadingId);
    const state = this.loadingStates.get(loadingId);

    if (!queue || !state || !this.currentData || queue.length === 0) {
      return;
    }

    const nextLevel = queue.shift()!;
    await this.loadSpecificLevel(nextLevel, loadingId);
  }

  private async loadSpecificLevel(level: number, loadingId: string): Promise<void> {
    if (!this.currentData || this.activeLoads.has(`${loadingId}-${level}`)) {
      return;
    }

    const cubeMapLevel = this.currentData.cubeMaps[level];
    if (!cubeMapLevel) {
      throw new Error(`Level ${level} not found in cubemap data`);
    }

    const loadKey = `${loadingId}-${level}`;
    this.activeLoads.add(loadKey);

    try {
      const networkQuality = this.networkDetector.getCurrentNetworkInfo().quality;

      await this.hybridLoader.loadCubeMapLevelIncremental(cubeMapLevel, level, networkQuality, loadKey);

      // Mark level as completed
      const state = this.loadingStates.get(loadingId);
      if (state) {
        state.completedLevels.push(level);

        // Activate first level immediately
        if (level === 0 && state.activeLevel !== 0) {
          await this.activateLevel(level, loadingId);
        }
      }
    } catch (error) {
      const state = this.loadingStates.get(loadingId);
      if (state) {
        state.failedLevels.push(level);
      }
      throw error;
    } finally {
      this.activeLoads.delete(loadKey);
    }
  }

  private async activateLevel(level: number, loadingId: string): Promise<void> {
    const state = this.loadingStates.get(loadingId);
    if (!state) return;

    const previousLevel = state.activeLevel;
    state.activeLevel = level;

    // Update metrics
    if (level === 0 && this.metrics.timeToFirstLevel === 0) {
      this.metrics.timeToFirstLevel = Date.now() - state.startTime;
    }

    this.callbacks.onLevelActivated?.(level, this.metrics);
  }

  private recordLevelTransition(
    fromLevel: number,
    toLevel: number,
    trigger: 'network' | 'user' | 'automatic',
    duration: number
  ): void {
    this.metrics.levelTransitions.push({
      fromLevel,
      toLevel,
      timestamp: Date.now(),
      duration,
      trigger,
    });
  }

  private async updateStrategyForNetwork(): Promise<void> {
    const networkInfo = this.networkDetector.getCurrentNetworkInfo();
    const currentBandwidth = networkInfo.bandwidth || 0;

    // Check if strategy should change based on bandwidth
    const shouldAdjust = this.shouldAdjustStrategy(currentBandwidth);

    if (shouldAdjust) {
      const newStrategy = this.adaptStrategyToBandwidth(currentBandwidth);
      const oldStrategy = this.strategy;
      this.strategy = newStrategy;

      this.callbacks.onStrategyChange?.(newStrategy, `Bandwidth changed to ${currentBandwidth.toFixed(1)} Mbps`);
    }
  }

  private shouldAdjustStrategy(currentBandwidth: number): boolean {
    // Simple heuristic: adjust if bandwidth changed significantly
    const lastBandwidth =
      this.metrics.networkQuality === 'slow'
        ? 1
        : this.metrics.networkQuality === 'medium'
          ? 3
          : this.metrics.networkQuality === 'fast'
            ? 7
            : 15;

    return Math.abs(currentBandwidth - lastBandwidth) > 2;
  }

  private adaptStrategyToBandwidth(bandwidth: number): ProgressiveStrategy {
    const strategy = { ...this.strategy };

    // Adjust quality level map based on bandwidth
    if (bandwidth < 1) {
      strategy.qualityLevelMap.medium = [0];
      strategy.qualityLevelMap.fast = [0, 1];
    } else if (bandwidth < 3) {
      strategy.qualityLevelMap.fast = [0, 1];
      strategy.qualityLevelMap.ultra = [0, 1, 2];
    }

    return strategy;
  }

  private triggerPredictiveLoading(action: string, currentLevel: number): void {
    // Analyze user behavior patterns
    const recentActions = this.userBehaviorHistory
      .filter((h) => Date.now() - h.timestamp < 30000) // Last 30 seconds
      .filter((h) => h.action === action);

    // If user frequently requests higher quality, preload next level
    if (recentActions.length >= 2 && currentLevel < (this.currentData?.cubeMaps.length || 1) - 1) {
      const nextLevel = currentLevel + 1;
      // Queue next level for background loading
      setTimeout(() => {
        this.loadSpecificLevel(nextLevel, 'progressive-default').catch(console.error);
      }, this.options.levelTransitionDelay);
    }
  }

  private handleFaceLoaded(faceState: FaceLoadingState): void {
    this.callbacks.onFaceLoaded?.(faceState);
  }

  private handleProgress(progress: number): void {
    this.callbacks.onProgress?.(progress);
  }

  private handleError(error: LoadingError): void {
    this.callbacks.onError?.(error);
  }

  private handleLevelComplete(level: number): void {
    this.callbacks.onLevelComplete?.(level);
  }

  private handleAdaptationError(error: any, fromLevel: number, targetLevel: number, loadingId: string): void {
    console.error(`Failed to adapt from level ${fromLevel} to ${targetLevel}:`, error);

    // Fallback strategy
    if (this.strategy.fallbackBehavior === 'degrade' && fromLevel > 0) {
      // Stay at current level or go to a lower one
      this.activateLevel(Math.max(0, fromLevel - 1), loadingId);
    }
  }
}
