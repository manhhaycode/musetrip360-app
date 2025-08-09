import { ReactNode } from 'react';
import { Texture } from 'three';

export interface PanoramaViewerProps {
  /** URL or path to the panorama image */
  panoramaUrl: string;
  /** Initial camera position */
  initialPosition?: {
    rotation: { x: number; y: number; z: number };
    zoom: number;
  };
  /** Whether controls are enabled */
  enableControls?: boolean;
  /** Minimum zoom level */
  minZoom?: number;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Enable damping for smooth controls */
  enableDamping?: boolean;
  /** Damping factor */
  dampingFactor?: number;
  /** Auto rotation speed (0 to disable) */
  autoRotateSpeed?: number;
  /** Callback when panorama is loaded */
  onLoad?: () => void;
  /** Callback when loading fails */
  onError?: (error: Error) => void;
  /** Children components (hotspots, overlays) */
  children?: ReactNode;
}

export interface VirtualTourCanvasProps {
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** CSS class name */
  className?: string;
  /** Canvas style */
  style?: React.CSSProperties;
  /** Enable shadows */
  shadows?: boolean;
  /** Camera configuration */
  camera?: {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
  /** Children components */
  children: ReactNode;
}

export interface PanoramaSphereProps {
  /** Panorama texture */
  texture: Texture | string;
  /** Sphere radius */
  radius?: number;
  /** Number of width segments */
  widthSegments?: number;
  /** Number of height segments */
  heightSegments?: number;
  /** Material opacity */
  opacity?: number;
  /** Enable wireframe mode */
  wireframe?: boolean;
}

export interface CameraControllerProps {
  /** Enable orbit controls */
  enableOrbit?: boolean;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Enable pan */
  enablePan?: boolean;
  /** Enable rotation */
  enableRotate?: boolean;
  /** Auto rotate */
  autoRotate?: boolean;
  /** Auto rotate speed */
  autoRotateSpeed?: number;
  /** Enable damping */
  enableDamping?: boolean;
  /** Damping factor */
  dampingFactor?: number;
  /** Minimum distance */
  minDistance?: number;
  /** Maximum distance */
  maxDistance?: number;
  /** Minimum polar angle */
  minPolarAngle?: number;
  /** Maximum polar angle */
  maxPolarAngle?: number;
  /** Minimum azimuth angle */
  minAzimuthAngle?: number;
  /** Maximum azimuth angle */
  maxAzimuthAngle?: number;
  /** Callback when view direction changes */
  onViewChange?: (theta: number, phi: number, fov: number) => void;
  /** Callback when zoom level changes */
  onZoomChange?: (zoomLevel: number) => void;
}

// Hotspot types for interactive panorama elements
export interface Hotspot {
  /** Unique identifier for the hotspot */
  id: string;
  /** 3D position in space [x, y, z] */
  position: [number, number, number];
  /** Display title for the hotspot */
  title: string;
  /** Visual style type */
  type: 'info' | 'navigation' | 'action';
  sceneIdLink?: string; // Optional link to another scene
}

export interface HotspotStyleConfig {
  /** Default colors for each hotspot type */
  colors: {
    info: { default: string; hover: string };
    navigation: { default: string; hover: string };
    action: { default: string; hover: string };
    default: { default: string; hover: string };
  };
  /** Size configuration */
  size: {
    radius: number;
    hoverScale: number;
  };
  /** Animation settings */
  animation: {
    duration: number;
    easing: string;
  };
}
