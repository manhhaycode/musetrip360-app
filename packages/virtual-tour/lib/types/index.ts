/**
 * Virtual Tour Types - Main Export
 *
 * Re-exports all types for convenient importing
 */

// Cubemap types
export type { FaceSource, CubeMapLevel, CubeMapData, FaceName, ValidationResult } from './cubemap';

export {
  FACE_INDICES,
  FACE_LABELS,
  isFileSource,
  isUrlSource,
  validateFaceSource,
  validateCubeMapLevel,
  validateCubeMapData,
  hasLocalFiles,
  extractUrls,
  createPlaceholderCubeMapLevel,
} from './cubemap';

// Network types
export type { NetworkQuality, NetworkInfo, NetworkTestConfig, NetworkAdaptation } from './network';

export {
  DEFAULT_NETWORK_ADAPTATION,
  NETWORK_THRESHOLDS,
  classifyNetworkQuality,
  getNetworkAdaptation,
} from './network';

// Loading types
export type {
  LoadingStatus,
  ResolutionLevel,
  SourceType,
  FaceLoadingState,
  CubemapLoadingState,
  LoadingMetrics,
  LoadingError,
  OnFaceLoadedCallback,
  OnProgressCallback,
  OnLoadCompleteCallback,
  OnErrorCallback,
} from './loading';

export { createInitialFaceState, createInitialLoadingState, updateFaceState, calculateLoadingMetrics } from './loading';

// // Legacy types (to be migrated or removed)
// export interface Tour {
//   // To be implemented - will be replaced with cubemap-based tours
// }

// export interface Scene {
//   // To be implemented - will be replaced with cubemap scenes
// }

// export interface Hotspot {
//   // To be implemented - future phase
// }

// export interface CameraPosition {
//   // To be implemented - camera control integration
// }
