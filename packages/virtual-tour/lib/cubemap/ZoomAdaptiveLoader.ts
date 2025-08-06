/**
 * ZoomAdaptiveLoader
 *
 * Intelligent zoom-based quality adaptation system that loads ultra-high
 * resolution textures on demand based on camera zoom level, viewport size,
 * and user interaction patterns.
 */

import type { CubeMapData, LoadingMetrics } from '../types';
import type { ProgressiveLoaderCallbacks, ProgressiveLoaderOptions, ProgressiveStrategy } from './ProgressiveLoader';
import { ProgressiveLoader } from './ProgressiveLoader';

export interface ZoomAdaptiveOptions extends ProgressiveLoaderOptions {
  /** Zoom level thresholds for quality switching */
  zoomThresholds?: ZoomThresholds;
  /** Viewport adaptation settings */
  viewportAdaptation?: ViewportAdaptationConfig;
  /** Ultra-high resolution settings */
  ultraHighResolution?: UltraHighResConfig;
  /** Predictive loading configuration */
  predictiveLoading?: PredictiveLoadingConfig;
  /** Performance constraints */
  performanceConstraints?: PerformanceConstraints;
}

export interface ZoomThresholds {
  /** Quality levels mapped to zoom ranges */
  qualityLevels: Array<{
    minZoom: number;
    maxZoom: number;
    targetLevel: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }>;
  /** Zoom velocity threshold for quality prediction */
  velocityThreshold: number;
  /** Smooth transition zones */
  transitionZones: Array<{
    zoomRange: [number, number];
    blendDuration: number; // ms
  }>;
}

export interface ViewportAdaptationConfig {
  /** Enable viewport size consideration */
  enabled: boolean;
  /** Minimum viewport size for ultra-high quality */
  minViewportSize: { width: number; height: number };
  /** Pixel density factor consideration */
  considerPixelDensity: boolean;
  /** Viewport utilization threshold (0-1) */
  utilizationThreshold: number;
}

export interface UltraHighResConfig {
  /** Enable ultra-high resolution loading */
  enabled: boolean;
  /** Maximum texture size (pixels) */
  maxTextureSize: number;
  /** Memory usage limit (MB) */
  memoryLimit: number;
  /** Enable texture compression */
  enableCompression: boolean;
  /** Tile-based loading for very large textures */
  enableTiling: boolean;
  /** Tile size for tiled textures */
  tileSize: number;
}

export interface PredictiveLoadingConfig {
  /** Enable predictive quality loading */
  enabled: boolean;
  /** Zoom velocity analysis window (ms) */
  velocityWindow: number;
  /** Prediction lookahead time (ms) */
  predictionLookahead: number;
  /** Learning rate for user behavior adaptation */
  learningRate: number;
  /** Maximum prediction cache size */
  maxPredictionCache: number;
}

export interface PerformanceConstraints {
  /** Maximum concurrent ultra-high loads */
  maxConcurrentUltraLoads: number;
  /** Memory usage warning threshold (MB) */
  memoryWarningThreshold: number;
  /** Frame rate impact tolerance */
  frameRateImpactTolerance: number;
  /** Automatic quality reduction on performance issues */
  enableAutoReduction: boolean;
}

export interface ZoomState {
  /** Current zoom level */
  currentZoom: number;
  /** Zoom velocity (zoom/second) */
  zoomVelocity: number;
  /** Target zoom (for smooth transitions) */
  targetZoom: number;
  /** Viewport dimensions */
  viewport: { width: number; height: number };
  /** Pixel density */
  pixelDensity: number;
  /** Active quality level */
  activeQualityLevel: number;
  /** Loading quality levels */
  loadingLevels: number[];
}

export interface ZoomMetrics extends LoadingMetrics {
  /** Zoom-specific metrics */
  zoomMetrics: {
    /** Average zoom level during session */
    averageZoom: number;
    /** Peak zoom level reached */
    peakZoom: number;
    /** Zoom events count */
    zoomEvents: number;
    /** Quality switches triggered by zoom */
    zoomTriggeredSwitches: number;
    /** Time spent at different quality levels */
    timeAtQualityLevels: Record<number, number>;
    /** Prediction accuracy */
    predictionAccuracy: number;
  };
  /** Performance impact metrics */
  performanceMetrics: {
    /** Memory usage peak (MB) */
    peakMemoryUsage: number;
    /** Frame rate impact events */
    frameRateImpacts: number;
    /** Texture loading delays */
    textureLoadingDelays: number;
    /** Cache hit ratio for predictions */
    predictionCacheHitRatio: number;
  };
}

export interface ZoomAdaptiveCallbacks extends ProgressiveLoaderCallbacks {
  /** Called when zoom triggers quality change */
  onZoomQualityChange?: (zoom: number, newLevel: number, oldLevel: number) => void;
  /** Called when viewport adaptation occurs */
  onViewportAdaptation?: (viewport: { width: number; height: number }, newStrategy: ProgressiveStrategy) => void;
  /** Called when ultra-high resolution is activated */
  onUltraHighActivated?: (level: number, memoryUsage: number) => void;
  /** Called on performance constraint violation */
  onPerformanceConstraint?: (constraint: string, action: string) => void;
  /** Called when prediction is made */
  onPrediction?: (currentZoom: number, predictedZoom: number, targetLevel: number) => void;
}

export class ZoomAdaptiveLoader extends ProgressiveLoader {
  private zoomOptions: Required<ZoomAdaptiveOptions>;
  private zoomCallbacks: ZoomAdaptiveCallbacks;

  private zoomState: ZoomState;
  private zoomHistory: Array<{ timestamp: number; zoom: number; quality: number }> = [];
  private predictionCache = new Map<string, { level: number; timestamp: number; accuracy: number }>();
  private performanceMonitor: PerformanceMonitor;

  // Viewport observer
  private viewportObserver?: ResizeObserver;
  private lastViewportUpdate = 0;

  constructor(options: ZoomAdaptiveOptions = {}, callbacks: ZoomAdaptiveCallbacks = {}) {
    // Pass through progressive loader options
    super(options, callbacks);

    this.zoomOptions = {
      loaderOptions: {},
      networkOptions: {},
      strategy: this.getDefaultStrategy(),
      priorityBoost: {},
      enablePredictiveLoading: true,
      maxConcurrentLevels: 2,
      levelTransitionDelay: 500,
      enableViewportAdaptation: true,
      ...options,
      zoomThresholds: {
        qualityLevels: [
          { minZoom: 0.1, maxZoom: 1.0, targetLevel: 0, priority: 'medium' },
          { minZoom: 1.0, maxZoom: 2.0, targetLevel: 1, priority: 'medium' },
          { minZoom: 2.0, maxZoom: 4.0, targetLevel: 2, priority: 'high' },
          { minZoom: 4.0, maxZoom: 10.0, targetLevel: 3, priority: 'critical' },
        ],
        velocityThreshold: 0.5, // zoom/second
        transitionZones: [
          { zoomRange: [0.8, 1.2], blendDuration: 300 },
          { zoomRange: [1.8, 2.2], blendDuration: 200 },
          { zoomRange: [3.8, 4.2], blendDuration: 150 },
        ],
        ...options.zoomThresholds,
      },
      viewportAdaptation: {
        enabled: true,
        minViewportSize: { width: 800, height: 600 },
        considerPixelDensity: true,
        utilizationThreshold: 0.7,
        ...options.viewportAdaptation,
      },
      ultraHighResolution: {
        enabled: true,
        maxTextureSize: 4096,
        memoryLimit: 512, // MB
        enableCompression: true,
        enableTiling: false,
        tileSize: 512,
        ...options.ultraHighResolution,
      },
      predictiveLoading: {
        enabled: true,
        velocityWindow: 1000, // 1 second
        predictionLookahead: 2000, // 2 seconds
        learningRate: 0.1,
        maxPredictionCache: 50,
        ...options.predictiveLoading,
      },
      performanceConstraints: {
        maxConcurrentUltraLoads: 2,
        memoryWarningThreshold: 400, // MB
        frameRateImpactTolerance: 0.1, // 10% frame rate drop
        enableAutoReduction: true,
        ...options.performanceConstraints,
      },
    };

    this.zoomCallbacks = callbacks;

    // Initialize zoom state
    this.zoomState = {
      currentZoom: 1.0,
      zoomVelocity: 0,
      targetZoom: 1.0,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      pixelDensity: window.devicePixelRatio || 1,
      activeQualityLevel: 0,
      loadingLevels: [],
    };

    // Initialize performance monitor
    this.performanceMonitor = new PerformanceMonitor(this.zoomOptions.performanceConstraints);

    // Setup viewport monitoring
    this.setupViewportMonitoring();
  }

  /**
   * Update zoom level and trigger adaptive loading
   */
  updateZoom(newZoom: number, smooth: boolean = true): void {
    const oldZoom = this.zoomState.currentZoom;
    const timestamp = performance.now();

    // Calculate zoom velocity
    const timeDelta = timestamp - (this.zoomHistory[this.zoomHistory.length - 1]?.timestamp || timestamp);
    this.zoomState.zoomVelocity = timeDelta > 0 ? (newZoom - oldZoom) / (timeDelta / 1000) : 0;

    // Update zoom state
    this.zoomState.currentZoom = newZoom;
    this.zoomState.targetZoom = smooth ? this.smoothZoomTarget(newZoom) : newZoom;

    // Add to history
    this.zoomHistory.push({
      timestamp,
      zoom: newZoom,
      quality: this.zoomState.activeQualityLevel,
    });

    // Limit history size
    if (this.zoomHistory.length > 100) {
      this.zoomHistory.shift();
    }

    // Determine target quality level
    const targetLevel = this.calculateTargetQualityLevel(newZoom);

    // Trigger quality adaptation if needed
    if (targetLevel !== this.zoomState.activeQualityLevel) {
      this.adaptToZoomLevel(targetLevel, oldZoom, newZoom);
    }

    // Handle predictive loading
    if (this.zoomOptions.predictiveLoading.enabled) {
      this.handlePredictiveLoading(newZoom);
    }
  }

  /**
   * Get current zoom-adaptive metrics
   */
  getZoomMetrics(): ZoomMetrics {
    const baseMetrics = this.getProgressiveMetrics();

    return {
      ...baseMetrics,
      zoomMetrics: {
        averageZoom: this.calculateAverageZoom(),
        peakZoom: Math.max(...this.zoomHistory.map((h) => h.zoom)),
        zoomEvents: this.zoomHistory.length,
        zoomTriggeredSwitches: this.countZoomTriggeredSwitches(),
        timeAtQualityLevels: this.calculateTimeAtQualityLevels(),
        predictionAccuracy: this.calculatePredictionAccuracy(),
      },
      performanceMetrics: {
        peakMemoryUsage: this.performanceMonitor.getPeakMemoryUsage(),
        frameRateImpacts: this.performanceMonitor.getFrameRateImpacts(),
        textureLoadingDelays: this.performanceMonitor.getTextureLoadingDelays(),
        predictionCacheHitRatio: this.calculatePredictionCacheHitRatio(),
      },
    };
  }

  /**
   * Force ultra-high resolution loading for current zoom
   */
  async forceUltraHighResolution(): Promise<void> {
    if (!this.zoomOptions.ultraHighResolution.enabled) {
      throw new Error('Ultra-high resolution is disabled');
    }

    const memoryUsage = this.performanceMonitor.getCurrentMemoryUsage();
    if (memoryUsage > this.zoomOptions.performanceConstraints.memoryWarningThreshold) {
      throw new Error('Memory usage too high for ultra-high resolution');
    }

    if (!this.getCurrentData()?.cubeMaps) {
      throw new Error('No cubemap data available');
    }

    // Find highest available quality level
    const maxLevel = this.getCurrentData()!.cubeMaps.length - 1;
    if (maxLevel === undefined || maxLevel < 0) {
      throw new Error('No cubemap data available');
    }

    await this.adaptQuality(maxLevel, 'user');
    this.zoomCallbacks.onUltraHighActivated?.(maxLevel, memoryUsage);
  }

  /**
   * Clean up zoom-adaptive resources
   */
  dispose(): void {
    super.dispose();

    // Clean up viewport observer
    if (this.viewportObserver) {
      this.viewportObserver.disconnect();
    }

    // Clean up performance monitor
    this.performanceMonitor.dispose();

    // Clear caches
    this.predictionCache.clear();
    this.zoomHistory.length = 0;
  }

  // Private implementation methods

  private calculateTargetQualityLevel(zoom: number): number {
    const thresholds = this.zoomOptions.zoomThresholds.qualityLevels;

    // Find matching threshold
    for (const threshold of thresholds) {
      if (zoom >= threshold.minZoom && zoom < threshold.maxZoom) {
        return threshold.targetLevel;
      }
    }

    // Default to highest level for extreme zoom
    return thresholds[thresholds.length - 1]?.targetLevel || 0;
  }

  private smoothZoomTarget(targetZoom: number): number {
    // Apply smooth transition zones
    for (const zone of this.zoomOptions.zoomThresholds.transitionZones) {
      const [min, max] = zone.zoomRange;
      if (targetZoom >= min && targetZoom <= max) {
        // Smooth transition within zone
        const progress = (targetZoom - min) / (max - min);
        return min + (max - min) * this.easeInOutCubic(progress);
      }
    }

    return targetZoom;
  }

  private async adaptToZoomLevel(targetLevel: number, oldZoom: number, newZoom: number): Promise<void> {
    const oldLevel = this.zoomState.activeQualityLevel;

    try {
      // Check performance constraints
      if (targetLevel > 2 && !this.performanceMonitor.canHandleUltraHigh()) {
        this.zoomCallbacks.onPerformanceConstraint?.('ultra_high_quality', 'downgrade');
        targetLevel = Math.min(targetLevel, 2);
      }

      // Perform adaptation
      await this.adaptQuality(targetLevel, 'user');

      // Update state
      this.zoomState.activeQualityLevel = targetLevel;

      // Fire callback
      this.zoomCallbacks.onZoomQualityChange?.(newZoom, targetLevel, oldLevel);
    } catch (error) {
      console.error('Zoom-based quality adaptation failed:', error);
      // Keep old level on failure
    }
  }

  private handlePredictiveLoading(currentZoom: number): void {
    if (Math.abs(this.zoomState.zoomVelocity) < this.zoomOptions.zoomThresholds.velocityThreshold) {
      return; // Not moving fast enough to predict
    }

    // Predict future zoom level
    const lookaheadTime = this.zoomOptions.predictiveLoading.predictionLookahead / 1000; // Convert to seconds
    const predictedZoom = currentZoom + this.zoomState.zoomVelocity * lookaheadTime;

    // Calculate target level for predicted zoom
    const targetLevel = this.calculateTargetQualityLevel(predictedZoom);

    // Check if we should preload
    if (targetLevel !== this.zoomState.activeQualityLevel && !this.zoomState.loadingLevels.includes(targetLevel)) {
      // Cache prediction
      const cacheKey = `${currentZoom.toFixed(2)}-${this.zoomState.zoomVelocity.toFixed(2)}`;
      this.predictionCache.set(cacheKey, {
        level: targetLevel,
        timestamp: Date.now(),
        accuracy: 0.8, // Initial accuracy
      });

      // Start preloading in background
      this.preloadQualityLevel(targetLevel);

      this.zoomCallbacks.onPrediction?.(currentZoom, predictedZoom, targetLevel);
    }
  }

  private async preloadQualityLevel(level: number): Promise<void> {
    if (this.zoomState.loadingLevels.includes(level)) {
      return; // Already loading
    }

    this.zoomState.loadingLevels.push(level);

    try {
      // Start background loading (don't await to avoid blocking)
      this.adaptQuality(level, 'automatic').then(() => {
        // Remove from loading list when complete
        const index = this.zoomState.loadingLevels.indexOf(level);
        if (index > -1) {
          this.zoomState.loadingLevels.splice(index, 1);
        }
      });
    } catch (error) {
      // Remove from loading list on error
      const index = this.zoomState.loadingLevels.indexOf(level);
      if (index > -1) {
        this.zoomState.loadingLevels.splice(index, 1);
      }
    }
  }

  private setupViewportMonitoring(): void {
    if (!this.zoomOptions.viewportAdaptation.enabled) {
      return;
    }

    // Setup ResizeObserver if available
    if (typeof ResizeObserver !== 'undefined') {
      this.viewportObserver = new ResizeObserver((entries) => {
        const now = Date.now();
        if (now - this.lastViewportUpdate < 250) return; // Throttle updates

        this.lastViewportUpdate = now;

        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          this.handleViewportChange(width, height);
        }
      });

      // Observe document body or a specific container
      this.viewportObserver.observe(document.body);
    }

    // Fallback to window resize
    window.addEventListener('resize', () => {
      const now = Date.now();
      if (now - this.lastViewportUpdate < 250) return;

      this.lastViewportUpdate = now;
      this.handleViewportChange(window.innerWidth, window.innerHeight);
    });
  }

  private handleViewportChange(width: number, height: number): void {
    const oldViewport = this.zoomState.viewport;
    this.zoomState.viewport = { width, height };

    // Check if viewport size affects quality requirements
    const { minViewportSize } = this.zoomOptions.viewportAdaptation;
    const supportsUltraHigh = width >= minViewportSize.width && height >= minViewportSize.height;

    if (!supportsUltraHigh && this.zoomState.activeQualityLevel > 2) {
      // Downgrade quality for small viewport
      this.adaptToZoomLevel(2, this.zoomState.currentZoom, this.zoomState.currentZoom);
    }

    this.zoomCallbacks.onViewportAdaptation?.(this.zoomState.viewport, this.getStrategy());
  }

  // Utility methods

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  private calculateAverageZoom(): number {
    if (this.zoomHistory.length === 0) return 1.0;
    const sum = this.zoomHistory.reduce((acc, h) => acc + h.zoom, 0);
    return sum / this.zoomHistory.length;
  }

  private countZoomTriggeredSwitches(): number {
    let switches = 0;
    for (let i = 1; i < this.zoomHistory.length; i++) {
      const currentZoom = this.zoomHistory[i];
      const prevZoom = this.zoomHistory[i - 1];
      if (!currentZoom || !prevZoom) continue;
      if (currentZoom.quality !== prevZoom.quality) {
        switches++;
      }
    }
    return switches;
  }

  private calculateTimeAtQualityLevels(): Record<number, number> {
    const timeAtLevels: Record<number, number> = {};

    for (let i = 1; i < this.zoomHistory.length; i++) {
      const currentZoom = this.zoomHistory[i];
      const prevZoom = this.zoomHistory[i - 1];
      if (!currentZoom || !prevZoom) continue;
      const duration = currentZoom.timestamp - prevZoom.timestamp;
      const level = prevZoom.quality;
      timeAtLevels[level] = (timeAtLevels[level] || 0) + duration;
    }

    return timeAtLevels;
  }

  private calculatePredictionAccuracy(): number {
    if (this.predictionCache.size === 0) return 0;

    let correctPredictions = 0;
    let totalPredictions = 0;

    for (const prediction of this.predictionCache.values()) {
      totalPredictions++;
      if (prediction.accuracy > 0.7) {
        correctPredictions++;
      }
    }

    return totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
  }

  private calculatePredictionCacheHitRatio(): number {
    // This would be calculated based on actual cache usage
    // For now, return a placeholder
    return 0.75;
  }

  private getCurrentData(): CubeMapData | null {
    // Access current cubemap data from parent class
    return (this as any).currentData || null;
  }

  private getStrategy(): ProgressiveStrategy {
    // Access strategy from parent class
    return (this as any).strategy || null;
  }
}

/**
 * Performance monitoring helper class
 */
class PerformanceMonitor {
  private constraints: PerformanceConstraints;
  private memoryUsageHistory: number[] = [];
  private frameRateHistory: number[] = [];
  private lastFrameTime = performance.now();
  private frameRateImpacts = 0;
  private textureLoadingDelays = 0;

  constructor(constraints: PerformanceConstraints) {
    this.constraints = constraints;
    this.startMonitoring();
  }

  private startMonitoring(): void {
    // Monitor frame rate
    const measureFrameRate = () => {
      const now = performance.now();
      const frameTime = now - this.lastFrameTime;
      const fps = 1000 / frameTime;

      this.frameRateHistory.push(fps);
      if (this.frameRateHistory.length > 60) {
        // Keep last 60 frames
        this.frameRateHistory.shift();
      }

      // Check for frame rate impact
      const avgFps = this.frameRateHistory.reduce((a, b) => a + b, 0) / this.frameRateHistory.length;
      if (avgFps < 60 * (1 - this.constraints.frameRateImpactTolerance)) {
        this.frameRateImpacts++;
      }

      this.lastFrameTime = now;
      requestAnimationFrame(measureFrameRate);
    };

    requestAnimationFrame(measureFrameRate);

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory) {
          const usageMB = memory.usedJSHeapSize / (1024 * 1024);
          this.memoryUsageHistory.push(usageMB);

          if (this.memoryUsageHistory.length > 100) {
            this.memoryUsageHistory.shift();
          }
        }
      }, 1000);
    }
  }

  getCurrentMemoryUsage(): number {
    return this.memoryUsageHistory[this.memoryUsageHistory.length - 1] || 0;
  }

  getPeakMemoryUsage(): number {
    return Math.max(...this.memoryUsageHistory, 0);
  }

  getFrameRateImpacts(): number {
    return this.frameRateImpacts;
  }

  getTextureLoadingDelays(): number {
    return this.textureLoadingDelays;
  }

  canHandleUltraHigh(): boolean {
    const memoryUsage = this.getCurrentMemoryUsage();
    const avgFrameRate =
      this.frameRateHistory.length > 0
        ? this.frameRateHistory.reduce((a, b) => a + b, 0) / this.frameRateHistory.length
        : 60;

    return (
      memoryUsage < this.constraints.memoryWarningThreshold &&
      avgFrameRate >= 60 * (1 - this.constraints.frameRateImpactTolerance)
    );
  }

  dispose(): void {
    this.memoryUsageHistory.length = 0;
    this.frameRateHistory.length = 0;
  }
}
