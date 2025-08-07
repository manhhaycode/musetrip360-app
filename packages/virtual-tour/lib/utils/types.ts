import { Vector3, Euler } from 'three';

export interface PanoramaConfig {
  /** URL or path to panorama image */
  url: string;
  /** Image format (jpg, png, hdr, exr) */
  format?: 'jpg' | 'png' | 'hdr' | 'exr';
  /** Image dimensions */
  dimensions?: {
    width: number;
    height: number;
  };
  /** Metadata about the panorama */
  metadata?: {
    title?: string;
    description?: string;
    captureDate?: string;
    location?: string;
  };
}

export interface TextureLoadOptions {
  /** Enable anisotropic filtering */
  anisotropy?: number;
  /** Flip Y coordinate */
  flipY?: boolean;
  /** Generate mipmaps */
  generateMipmaps?: boolean;
  /** Premultiply alpha */
  premultiplyAlpha?: boolean;
}

export interface CameraPosition {
  /** Position in 3D space */
  position: Vector3;
  /** Rotation as Euler angles */
  rotation: Euler;
  /** Field of view */
  fov?: number;
  /** Zoom level */
  zoom?: number;
}

export interface SphericalCoordinates {
  /** Radius (distance from center) */
  radius: number;
  /** Polar angle (vertical, 0 = top, π = bottom) */
  phi: number;
  /** Azimuthal angle (horizontal, 0 = forward) */
  theta: number;
}
