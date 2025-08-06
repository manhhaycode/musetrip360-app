import { Vector3, Matrix4, Euler, Quaternion } from 'three';

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Linear interpolation between two values
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * Smooth step function (Hermite interpolation)
 */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Smoother step function (Ken Perlin's improved version)
 */
export const smootherstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/**
 * Convert a normalized value to a range
 */
export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Check if a value is approximately equal to another (within epsilon)
 */
export const approximately = (a: number, b: number, epsilon = 1e-6): boolean => {
  return Math.abs(a - b) < epsilon;
};

/**
 * Calculate distance between two 3D points
 */
export const distance3D = (a: Vector3, b: Vector3): number => {
  return a.distanceTo(b);
};

/**
 * Calculate the center point of multiple 3D points
 */
export const calculateCenter = (points: Vector3[]): Vector3 => {
  if (points.length === 0) return new Vector3();

  const center = new Vector3();
  points.forEach((point) => center.add(point));
  center.divideScalar(points.length);

  return center;
};

/**
 * Generate a random point on a unit sphere
 */
export const randomPointOnSphere = (): Vector3 => {
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);

  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.sin(phi) * Math.sin(theta);
  const z = Math.cos(phi);

  return new Vector3(x, y, z);
};

/**
 * Create a look-at matrix for a camera
 */
export const createLookAtMatrix = (eye: Vector3, target: Vector3, up: Vector3 = new Vector3(0, 1, 0)): Matrix4 => {
  const matrix = new Matrix4();
  matrix.lookAt(eye, target, up);
  return matrix;
};

/**
 * Extract Euler angles from a quaternion with a specific order
 */
export const quaternionToEuler = (
  quaternion: Quaternion,
  order: 'XYZ' | 'YXZ' | 'ZXY' | 'ZYX' | 'YZX' | 'XZY' = 'XYZ'
): Euler => {
  const euler = new Euler();
  euler.setFromQuaternion(quaternion, order);
  return euler;
};

/**
 * Create a quaternion from Euler angles
 */
export const eulerToQuaternion = (euler: Euler): Quaternion => {
  const quaternion = new Quaternion();
  quaternion.setFromEuler(euler);
  return quaternion;
};

/**
 * Spherical linear interpolation between two quaternions
 */
export const slerpQuaternions = (q1: Quaternion, q2: Quaternion, t: number): Quaternion => {
  const result = new Quaternion();
  result.slerpQuaternions(q1, q2, t);
  return result;
};

/**
 * Calculate the angle between two vectors
 */
export const angleBetweenVectors = (v1: Vector3, v2: Vector3): number => {
  const dot = v1.dot(v2);
  const lengths = v1.length() * v2.length();
  return Math.acos(clamp(dot / lengths, -1, 1));
};

/**
 * Project a 3D point to 2D screen coordinates
 */
export const projectToScreen = (
  point: Vector3,
  camera: any, // Camera type from Three.js
  screenWidth: number,
  screenHeight: number
): { x: number; y: number; z: number } => {
  const vector = point.clone();
  vector.project(camera);

  return {
    x: (vector.x * 0.5 + 0.5) * screenWidth,
    y: (vector.y * -0.5 + 0.5) * screenHeight,
    z: vector.z,
  };
};

/**
 * Unproject 2D screen coordinates to 3D world coordinates
 */
export const unprojectFromScreen = (
  x: number,
  y: number,
  z: number,
  camera: any, // Camera type from Three.js
  screenWidth: number,
  screenHeight: number
): Vector3 => {
  const vector = new Vector3((x / screenWidth) * 2 - 1, -(y / screenHeight) * 2 + 1, z);

  vector.unproject(camera);
  return vector;
};
