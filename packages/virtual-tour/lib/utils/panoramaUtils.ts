import { Vector3, Euler, MathUtils } from 'three';
import { PanoramaConfig, CameraPosition, SphericalCoordinates } from './types';

/**
 * Convert spherical coordinates to Cartesian coordinates
 */
export const sphericalToCartesian = (spherical: SphericalCoordinates): Vector3 => {
  const { radius, phi, theta } = spherical;

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
};

/**
 * Convert Cartesian coordinates to spherical coordinates
 */
export const cartesianToSpherical = (position: Vector3): SphericalCoordinates => {
  const radius = position.length();
  const phi = Math.acos(position.y / radius);
  const theta = Math.atan2(position.z, position.x);

  return { radius, phi, theta };
};

/**
 * Convert degrees to radians
 */
export const degToRad = (degrees: number): number => {
  return MathUtils.degToRad(degrees);
};

/**
 * Convert radians to degrees
 */
export const radToDeg = (radians: number): number => {
  return MathUtils.radToDeg(radians);
};

/**
 * Normalize angle to be within [-π, π] range
 */
export const normalizeAngle = (angle: number): number => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

/**
 * Calculate the angular distance between two spherical positions
 */
export const angularDistance = (pos1: SphericalCoordinates, pos2: SphericalCoordinates): number => {
  const dPhi = pos2.phi - pos1.phi;
  const dTheta = pos2.theta - pos1.theta;

  // Haversine formula for spherical distance
  const a = Math.sin(dPhi / 2) ** 2 + Math.cos(pos1.phi) * Math.cos(pos2.phi) * Math.sin(dTheta / 2) ** 2;

  return 2 * Math.asin(Math.sqrt(a));
};

/**
 * Interpolate between two camera positions
 */
export const interpolateCameraPosition = (start: CameraPosition, end: CameraPosition, t: number): CameraPosition => {
  // Clamp t between 0 and 1
  t = Math.max(0, Math.min(1, t));

  // Interpolate position
  const position = new Vector3().lerpVectors(start.position, end.position, t);

  // Interpolate rotation (using slerp would be better for quaternions)
  const rotation = new Euler(
    MathUtils.lerp(start.rotation.x, end.rotation.x, t),
    MathUtils.lerp(start.rotation.y, end.rotation.y, t),
    MathUtils.lerp(start.rotation.z, end.rotation.z, t)
  );

  // Interpolate optional properties
  const fov = start.fov && end.fov ? MathUtils.lerp(start.fov, end.fov, t) : start.fov || end.fov;
  const zoom = start.zoom && end.zoom ? MathUtils.lerp(start.zoom, end.zoom, t) : start.zoom || end.zoom;

  return { position, rotation, fov, zoom };
};

/**
 * Create a smooth easing function for camera animations
 */
export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Calculate optimal field of view based on panorama dimensions
 */
export const calculateOptimalFOV = (
  imageWidth: number,
  imageHeight: number,
  viewportWidth: number,
  viewportHeight: number
): number => {
  const imageAspect = imageWidth / imageHeight;
  const viewportAspect = viewportWidth / viewportHeight;

  // Base FOV calculation
  let fov = 75; // Default FOV

  if (imageAspect > viewportAspect) {
    // Image is wider than viewport
    fov = radToDeg(2 * Math.atan((imageHeight / imageWidth) * Math.tan(degToRad(fov / 2))));
  } else {
    // Image is taller than viewport
    fov = radToDeg(2 * Math.atan((imageWidth / imageHeight) * Math.tan(degToRad(fov / 2))));
  }

  // Clamp FOV to reasonable limits
  return Math.max(30, Math.min(120, fov));
};

/**
 * Validate panorama configuration
 */
export const validatePanoramaConfig = (config: PanoramaConfig): boolean => {
  if (!config.url || typeof config.url !== 'string') {
    return false;
  }

  if (config.dimensions) {
    const { width, height } = config.dimensions;
    if (width <= 0 || height <= 0 || !Number.isInteger(width) || !Number.isInteger(height)) {
      return false;
    }
  }

  return true;
};

/**
 * Generate default camera positions for panorama tours
 */
export const generateDefaultCameraPositions = (count: number = 8): CameraPosition[] => {
  const positions: CameraPosition[] = [];

  for (let i = 0; i < count; i++) {
    const theta = (i / count) * 2 * Math.PI;
    const phi = Math.PI / 2; // Horizontal view

    const position = sphericalToCartesian({ radius: 0.1, phi, theta });
    const rotation = new Euler(0, theta, 0);

    positions.push({
      position,
      rotation,
      fov: 75,
      zoom: 1,
    });
  }

  return positions;
};
