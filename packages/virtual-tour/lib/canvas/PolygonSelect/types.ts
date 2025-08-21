'use client';

import { Camera } from '@react-three/fiber';
import { Vector3 } from 'three';

export type Vector3Like =
  | {
      x: number;
      y: number;
      z: number;
    }
  | Vector3;

export interface PolygonDrawingState {
  currentPoints: Vector3[];
  isDrawing: boolean;
  previewPoint: Vector3 | null;
}

export interface InteractivePolygonSelectProps {
  isActive: boolean;
  points?: Vector3[];
  completedPolygons?: Vector3Like[][];
  onPointAdd?: (point: Vector3) => void;
  onPolygonComplete?: (points: Vector3[]) => void;
  onCancel?: () => void;
  onPolygonClick?: (polygonIndex: number, points: Vector3Like[]) => void;
}

export interface PolygonLineProps {
  points: Vector3Like[];
  color: string;
  closed?: boolean;
  dashed?: boolean;
}

export interface PolygonOverlayProps {
  points: Vector3Like[];
  onClick?: () => void;
}

export interface PointIndicatorProps {
  position: Vector3Like;
  color: string;
  camera: Camera;
}
