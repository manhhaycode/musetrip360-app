/**
 * Virtual Tour Cubemap Types
 *
 * Defines the core data structures for cubemap-based virtual tours
 * supporting both URL and File sources with incremental loading.
 */

import { Hotspot } from '@/canvas/types';

// Union type for maximum flexibility - support both URLs and File objects
export type FaceSource = string | File;

// 6 faces of a cubemap following Three.js convention
export interface CubeMapLevel {
  /** Positive X (Right) - URL or File */
  px: FaceSource;
  /** Negative X (Left) - URL or File */
  nx: FaceSource;
  /** Positive Y (Top) - URL or File */
  py: FaceSource;
  /** Negative Y (Bottom) - URL or File */
  ny: FaceSource;
  /** Positive Z (Front) - URL or File */
  pz: FaceSource;
  /** Negative Z (Back) - URL or File */
  nz: FaceSource;
}

// Complete cubemap data with multiple resolution levels
export interface CubeMapData {
  /** Array of resolution levels (low to high) */
  cubeMaps: CubeMapLevel[];
  hotspots: Hotspot[];
  /** Optional metadata */
  metadata?: {
    title?: string;
    description?: string;
    /** Total number of resolution levels */
    totalLevels: number;
    /** Track if contains File objects for preview mode */
    hasLocalFiles?: boolean;
    /** Creation timestamp */
    createdAt?: Date;
    /** Last modified timestamp */
    updatedAt?: Date;
  };
}

// Face names as union type for type safety
export type FaceName = 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz';

// Face index mapping (Three.js cubemap order)
export const FACE_INDICES: Record<FaceName, number> = {
  px: 0, // Right
  nx: 1, // Left
  py: 2, // Top
  ny: 3, // Bottom
  pz: 4, // Front
  nz: 5, // Back
} as const;

// Face labels for UI display
export const FACE_LABELS: Record<FaceName, string> = {
  px: 'Right',
  nx: 'Left',
  py: 'Top',
  ny: 'Bottom',
  pz: 'Front',
  nz: 'Back',
} as const;

// Type guards for face source detection
export function isFileSource(source: FaceSource): source is File {
  return source instanceof File;
}

export function isUrlSource(source: FaceSource): source is string {
  return typeof source === 'string';
}

// Validation helpers
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateFaceSource(source: FaceSource): ValidationResult {
  const errors: string[] = [];

  if (isFileSource(source)) {
    if (!source.type.startsWith('image/')) {
      errors.push(`Invalid file type: ${source.type}. Expected image file.`);
    }
    if (source.size > 50 * 1024 * 1024) {
      // 50MB limit
      errors.push(`File too large: ${(source.size / 1024 / 1024).toFixed(1)}MB. Max 50MB.`);
    }
  } else if (isUrlSource(source)) {
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif)(\?.*)?$/i;
    if (!urlPattern.test(source)) {
      errors.push(`Invalid URL format: ${source}. Expected image URL.`);
    }
  } else {
    errors.push('Invalid face source. Expected URL string or File object.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateCubeMapLevel(level: CubeMapLevel): ValidationResult {
  const allErrors: string[] = [];
  const faces: FaceName[] = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

  faces.forEach((face) => {
    const validation = validateFaceSource(level[face]);
    if (!validation.valid) {
      allErrors.push(`Face ${face}: ${validation.errors.join(', ')}`);
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

export function validateCubeMapData(data: CubeMapData): ValidationResult {
  const errors: string[] = [];

  if (!data.cubeMaps || data.cubeMaps.length === 0) {
    errors.push('CubeMapData must contain at least one CubeMapLevel');
    return { valid: false, errors };
  }

  data.cubeMaps.forEach((level, index) => {
    const validation = validateCubeMapLevel(level);
    if (!validation.valid) {
      errors.push(`Level ${index}: ${validation.errors.join(', ')}`);
    }
  });

  // Validate metadata consistency
  if (data.metadata?.totalLevels && data.metadata.totalLevels !== data.cubeMaps.length) {
    errors.push(
      `Metadata totalLevels (${data.metadata.totalLevels}) doesn't match actual levels (${data.cubeMaps.length})`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Helper to detect if cubemap contains local files
export function hasLocalFiles(data: CubeMapData): boolean {
  return data.cubeMaps.some((level) => Object.values(level).some((source) => isFileSource(source)));
}

// Helper to get all unique URLs from cubemap (excluding Files)
export function extractUrls(data: CubeMapData): string[] {
  const urls: string[] = [];

  data.cubeMaps.forEach((level) => {
    Object.values(level).forEach((source) => {
      if (isUrlSource(source) && !urls.includes(source)) {
        urls.push(source);
      }
    });
  });

  return urls;
}

// Helper to create cubemap with placeholders
export function createPlaceholderCubeMapLevel(placeholderUrl: string): CubeMapLevel {
  return {
    px: placeholderUrl,
    nx: placeholderUrl,
    py: placeholderUrl,
    ny: placeholderUrl,
    pz: placeholderUrl,
    nz: placeholderUrl,
  };
}
