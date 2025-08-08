// Main package exports
export * from './canvas';
export * from './components';
export * from './hooks';
export * from './api';
export * from './types';
export * from './cubemap';
export * from './ui';
export * from './store';

// Utils exports with explicit re-exports to avoid conflicts
export {
  sphericalToCartesian,
  cartesianToSpherical,
  degToRad,
  radToDeg,
  normalizeAngle,
  angularDistance,
  interpolateCameraPosition,
  easeInOutCubic,
  calculateOptimalFOV,
  validatePanoramaConfig,
  generateDefaultCameraPositions,
} from './utils/panoramaUtils';

export {
  PanoramaTextureLoader,
  panoramaTextureLoader,
  loadPanoramaTexture,
  preloadPanoramaTextures,
} from './utils/textureUtils';

export {
  clamp,
  lerp,
  smoothstep,
  smootherstep,
  mapRange,
  approximately,
  distance3D,
  calculateCenter,
  randomPointOnSphere,
  createLookAtMatrix,
  quaternionToEuler,
  eulerToQuaternion,
  slerpQuaternions,
  angleBetweenVectors,
  projectToScreen,
  unprojectFromScreen,
} from './utils/mathUtils';

export { NetworkDetector } from './utils/NetworkDetector';
export type { NetworkDetectorOptions } from './utils/NetworkDetector';

// Types from utils with alias to avoid conflicts
export type { PanoramaConfig, TextureLoadOptions, SphericalCoordinates } from './utils/types';

export type { CameraPosition as UtilsCameraPosition } from './utils/types';
