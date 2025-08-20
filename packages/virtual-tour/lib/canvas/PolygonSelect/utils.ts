'use client';

import * as THREE from 'three';
import type { Vector3Like } from './types';

export function toVector3(point: Vector3Like): THREE.Vector3 {
  return point instanceof THREE.Vector3 ? point.clone() : new THREE.Vector3(point.x, point.y, point.z);
}
