/**
 * Network Quality & Performance Types
 *
 * Defines types for network detection, quality adaptation,
 * and performance monitoring in virtual tour system.
 */

// Network quality categories for adaptive loading
export type NetworkQuality = 'slow' | 'medium' | 'fast' | 'ultra';

// Network connection information
export interface NetworkInfo {
  /** Detected network quality */
  quality: NetworkQuality;
  /** Estimated bandwidth in Mbps */
  bandwidth?: number;
  /** Connection type if available */
  connectionType?: string;
  /** Effective connection type from Navigator API */
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  /** Round trip time in milliseconds */
  rtt?: number;
  /** Data usage monitoring */
  saveData?: boolean;
  /** Last tested timestamp */
  lastTested?: Date;
}

// Network test configuration
export interface NetworkTestConfig {
  /** Test image URL for bandwidth measurement */
  testImageUrl?: string;
  /** Test image size in bytes */
  testImageSize?: number;
  /** Test timeout in milliseconds */
  timeout?: number;
  /** Number of test attempts */
  attempts?: number;
  /** Minimum interval between tests (ms) */
  testInterval?: number;
}

// Network quality thresholds and adaptation rules
export interface NetworkAdaptation {
  slow: {
    maxResolutionLevels: number;
    maxFaceSize: string;
    parallelLoads: number;
    preloadNext: boolean;
  };
  medium: {
    maxResolutionLevels: number;
    maxFaceSize: string;
    parallelLoads: number;
    preloadNext: boolean;
  };
  fast: {
    maxResolutionLevels: number;
    maxFaceSize: string;
    parallelLoads: number;
    preloadNext: boolean;
  };
  ultra: {
    maxResolutionLevels: number;
    maxFaceSize: string;
    parallelLoads: number;
    preloadNext: boolean;
  };
}

// Default network adaptation configuration
export const DEFAULT_NETWORK_ADAPTATION: NetworkAdaptation = {
  slow: {
    maxResolutionLevels: 2,
    maxFaceSize: '512x512',
    parallelLoads: 2,
    preloadNext: false,
  },
  medium: {
    maxResolutionLevels: 3,
    maxFaceSize: '1024x1024',
    parallelLoads: 4,
    preloadNext: true,
  },
  fast: {
    maxResolutionLevels: 4,
    maxFaceSize: '2048x2048',
    parallelLoads: 6,
    preloadNext: true,
  },
  ultra: {
    maxResolutionLevels: 5,
    maxFaceSize: '4096x4096',
    parallelLoads: 6,
    preloadNext: true,
  },
};

// Bandwidth thresholds for quality classification (Mbps)
export const NETWORK_THRESHOLDS = {
  slow: { min: 0, max: 1.5 },
  medium: { min: 1.5, max: 5.0 },
  fast: { min: 5.0, max: 25.0 },
  ultra: { min: 25.0, max: Infinity },
} as const;

// Helper function to classify network quality based on bandwidth
export function classifyNetworkQuality(bandwidthMbps: number): NetworkQuality {
  if (bandwidthMbps <= NETWORK_THRESHOLDS.slow.max) return 'slow';
  if (bandwidthMbps <= NETWORK_THRESHOLDS.medium.max) return 'medium';
  if (bandwidthMbps <= NETWORK_THRESHOLDS.fast.max) return 'fast';
  return 'ultra';
}

// Helper function to get adaptation config for network quality
export function getNetworkAdaptation(quality: NetworkQuality): NetworkAdaptation[NetworkQuality] {
  return DEFAULT_NETWORK_ADAPTATION[quality];
}
