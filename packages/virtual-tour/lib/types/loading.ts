/**
 * Loading State & Progress Types
 *
 * Defines types for tracking loading progress, states,
 * and performance metrics during cubemap loading.
 */

import type { FaceName } from './cubemap';
import type { NetworkQuality } from './network';

// Loading status for individual faces
export type LoadingStatus = 'pending' | 'loading' | 'loaded' | 'error';

// Resolution quality levels
export type ResolutionLevel = 'placeholder' | 'low' | 'medium' | 'high' | 'ultra';

// Source type for tracking
export type SourceType = 'file' | 'url';

// Individual face loading state
export interface FaceLoadingState {
  /** Face index (0-5) */
  faceIndex: number;
  /** Face name (px, nx, py, ny, pz, nz) */
  faceName: FaceName;
  /** Current loading status */
  status: LoadingStatus;
  /** Source type (file or url) */
  sourceType: SourceType;
  /** Current resolution level */
  resolution: ResolutionLevel;
  /** Loading start time */
  startTime?: number;
  /** Loading completion time */
  endTime?: number;
  /** Loading duration in milliseconds */
  loadTime?: number;
  /** File/texture size in bytes */
  fileSize?: number;
  /** Error message if failed */
  error?: string;
  /** Progress percentage (0-100) */
  progress?: number;
}

// Overall cubemap loading state
export interface CubemapLoadingState {
  /** Current resolution level being loaded */
  currentLevel: number;
  /** Total resolution levels available */
  totalLevels: number;
  /** Overall loading progress (0-100) */
  overallProgress: number;
  /** Individual face states */
  faces: FaceLoadingState[];
  /** Network quality affecting loading */
  networkQuality: NetworkQuality;
  /** Loading start timestamp */
  startTime: number;
  /** Loading completion timestamp */
  endTime?: number;
  /** Total loading duration */
  totalLoadTime?: number;
  /** Failed face count */
  failedFaces: number;
  /** Successfully loaded faces count */
  loadedFaces: number;
  /** Whether loading is complete */
  isComplete: boolean;
  /** Whether any errors occurred */
  hasErrors: boolean;
}

// Performance metrics for monitoring
export interface LoadingMetrics {
  /** Cubemap identifier */
  cubemapId?: string;
  /** Network quality during loading */
  networkQuality: NetworkQuality;
  /** Total faces loaded */
  totalFaces: number;
  /** Resolution levels loaded */
  resolutionLevels: number;
  /** Total loading time (ms) */
  totalLoadTime: number;
  /** Average time per face (ms) */
  averageTimePerFace: number;
  /** Fastest face load time (ms) */
  fastestFace: number;
  /** Slowest face load time (ms) */
  slowestFace: number;
  /** Total data transferred (bytes) */
  totalDataSize: number;
  /** Failed loads count */
  failedLoads: number;
  /** Cache hit ratio (0-1) */
  cacheHitRatio?: number;
  /** Memory usage peak (bytes) */
  peakMemoryUsage?: number;
  /** Loading timestamp */
  timestamp: Date;
}

// Progress callback types
export type OnFaceLoadedCallback = (faceState: FaceLoadingState) => void;
export type OnProgressCallback = (progress: number) => void;
export type OnLoadCompleteCallback = (metrics: LoadingMetrics) => void;
export type OnErrorCallback = (error: LoadingError) => void;

// Error types for loading failures
export interface LoadingError {
  /** Error type */
  type: 'network' | 'file' | 'validation' | 'memory' | 'timeout';
  /** Error message */
  message: string;
  /** Face that failed (if applicable) */
  faceName?: FaceName;
  /** Resolution level that failed */
  resolution?: ResolutionLevel;
  /** Original error object */
  originalError?: Error;
  /** Timestamp when error occurred */
  timestamp: Date;
  /** Whether error is recoverable */
  recoverable: boolean;
}

// Helper functions for loading state management
export function createInitialFaceState(
  faceIndex: number,
  faceName: FaceName,
  sourceType: SourceType
): FaceLoadingState {
  return {
    faceIndex,
    faceName,
    status: 'pending',
    sourceType,
    resolution: 'placeholder',
    startTime: Date.now(),
    progress: 0,
  };
}

export function createInitialLoadingState(totalLevels: number, networkQuality: NetworkQuality): CubemapLoadingState {
  const faces: FaceLoadingState[] = [];
  const faceNames: FaceName[] = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

  faceNames.forEach((faceName, index) => {
    faces.push(createInitialFaceState(index, faceName, 'url')); // Default to URL
  });

  return {
    currentLevel: 0,
    totalLevels,
    overallProgress: 0,
    faces,
    networkQuality,
    startTime: Date.now(),
    failedFaces: 0,
    loadedFaces: 0,
    isComplete: false,
    hasErrors: false,
  };
}

export function updateFaceState(
  loadingState: CubemapLoadingState,
  faceIndex: number,
  updates: Partial<FaceLoadingState>
): CubemapLoadingState {
  const updatedFaces = [...loadingState.faces];
  const currentFace = updatedFaces[faceIndex];
  if (currentFace) {
    updatedFaces[faceIndex] = { ...currentFace, ...updates };
  }

  // Recalculate overall progress
  const totalFaces = updatedFaces.length;
  const loadedCount = updatedFaces.filter((f) => f.status === 'loaded').length;
  const failedCount = updatedFaces.filter((f) => f.status === 'error').length;
  const overallProgress = (loadedCount / totalFaces) * 100;

  return {
    ...loadingState,
    faces: updatedFaces,
    loadedFaces: loadedCount,
    failedFaces: failedCount,
    overallProgress,
    hasErrors: failedCount > 0,
    isComplete: loadedCount + failedCount === totalFaces,
  };
}

export function calculateLoadingMetrics(loadingState: CubemapLoadingState): LoadingMetrics {
  const completedFaces = loadingState.faces.filter((f) => f.status === 'loaded' && f.loadTime !== undefined);

  const loadTimes = completedFaces.map((f) => f.loadTime!);
  const totalLoadTime = loadingState.endTime
    ? loadingState.endTime - loadingState.startTime
    : Date.now() - loadingState.startTime;

  return {
    networkQuality: loadingState.networkQuality,
    totalFaces: loadingState.faces.length,
    resolutionLevels: loadingState.totalLevels,
    totalLoadTime,
    averageTimePerFace: loadTimes.length > 0 ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0,
    fastestFace: loadTimes.length > 0 ? Math.min(...loadTimes) : 0,
    slowestFace: loadTimes.length > 0 ? Math.max(...loadTimes) : 0,
    totalDataSize: loadingState.faces.reduce((sum, f) => sum + (f.fileSize || 0), 0),
    failedLoads: loadingState.failedFaces,
    timestamp: new Date(),
  };
}
