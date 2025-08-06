// Custom React hooks for virtual tour functionality

// Cubemap viewer hook - Phase 2
export { useCubemapViewer } from './useCubemapViewer';
export type {
  CubemapViewerConfig,
  CubemapViewerCallbacks,
  CubemapViewerState,
  CubemapViewerActions,
  CubemapViewerConfigs,
  UseCubemapViewerReturn,
} from './useCubemapViewer';

// Cubemap file selector hook - Phase 2
export { useCubemapFileSelector } from './useCubemapFileSelector';
export type {
  FileSelectorConfig,
  FileSelectorCallbacks,
  FileSelectorState,
  FileSelectorActions,
  UseCubemapFileSelectorReturn,
} from './useCubemapFileSelector';

// Progressive loader hook - Phase 3
export { useProgressiveLoader } from './useProgressiveLoader';
export type {
  UseProgressiveLoaderConfig,
  UseProgressiveLoaderCallbacks,
  ProgressiveLoaderState,
  ProgressiveLoaderActions,
  UseProgressiveLoaderReturn,
} from './useProgressiveLoader';

// Zoom adaptive loader hook - Phase 3
export { useZoomAdaptiveLoader } from './useZoomAdaptiveLoader';
export type {
  UseZoomAdaptiveConfig,
  UseZoomAdaptiveCallbacks,
  ZoomAdaptiveState,
  ZoomAdaptiveActions,
  UseZoomAdaptiveReturn,
} from './useZoomAdaptiveLoader';

// // Legacy hooks - will be implemented in future phases
// export interface UsePanoramaReturn {
//   // To be implemented
// }

// export interface UseHotspotsReturn {
//   // To be implemented
// }

// export interface UseSocketControlReturn {
//   // To be implemented
// }

// TODO: Phase 3-4 - Implement these hooks
// export { usePanorama } from './usePanorama';
// export { useHotspots } from './useHotspots';
// export { useSocketControl } from './useSocketControl';
