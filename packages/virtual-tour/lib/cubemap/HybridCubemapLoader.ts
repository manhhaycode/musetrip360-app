/**
 * HybridCubemapLoader
 *
 * Core class for loading cubemap faces from both URLs and File objects.
 * Supports incremental face-by-face loading with immediate rendering.
 */

import * as THREE from 'three';
import type {
  CubeMapLevel,
  CubemapLoadingState,
  FaceLoadingState,
  FaceName,
  FaceSource,
  LoadingError,
  NetworkQuality,
  OnErrorCallback,
  OnFaceLoadedCallback,
  OnProgressCallback,
} from '../types';
import {
  createInitialLoadingState,
  FACE_INDICES,
  isFileSource,
  isUrlSource,
  updateFaceState,
  validateCubeMapLevel,
} from '../types';

export interface HybridLoaderOptions {
  /** Maximum concurrent loads */
  maxConcurrentLoads?: number;
  /** Timeout for individual face loads (ms) */
  faceTimeout?: number;
  /** Whether to create placeholders immediately */
  useePlaceholders?: boolean;
  /** Placeholder color for unloaded faces */
  placeholderColor?: number;
  /** Enable detailed error logging */
  enableLogging?: boolean;
}

export interface LoaderCallbacks {
  onFaceLoaded?: OnFaceLoadedCallback;
  onProgress?: OnProgressCallback;
  onError?: OnErrorCallback;
  onLevelComplete?: (level: number) => void;
  onAllComplete?: () => void;
}

export class HybridCubemapLoader {
  private options: Required<HybridLoaderOptions>;
  private callbacks: LoaderCallbacks;
  private loadingStates = new Map<string, CubemapLoadingState>();
  private objectUrls = new Set<string>();
  private abortControllers = new Map<string, AbortController>();

  constructor(options: HybridLoaderOptions = {}, callbacks: LoaderCallbacks = {}) {
    this.options = {
      maxConcurrentLoads: 6, // All faces in parallel by default
      faceTimeout: 30000, // 30 seconds
      useePlaceholders: true,
      placeholderColor: 0x888888, // Gray
      enableLogging: false,
      ...options,
    };
    this.callbacks = callbacks;
  }

  /**
   * Load a single face texture from either URL or File
   */
  async loadFaceTexture(faceSource: FaceSource, signal?: AbortSignal): Promise<THREE.Texture> {
    if (isFileSource(faceSource)) {
      return this.loadFromFile(faceSource, signal);
    } else if (isUrlSource(faceSource)) {
      return this.loadFromUrl(faceSource, signal);
    } else {
      throw new Error(`Invalid face source type: ${typeof faceSource}`);
    }
  }

  /**
   * Load texture from File object
   */
  private async loadFromFile(file: File, signal?: AbortSignal): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error('Load cancelled'));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error(`Invalid file type: ${file.type}`));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (!imageUrl) {
          reject(new Error('Failed to read file'));
          return;
        }

        // Track object URL for cleanup
        this.objectUrls.add(imageUrl);

        const loader = new THREE.TextureLoader();
        const texture = loader.load(
          imageUrl,
          (loadedTexture) => {
            // Configure texture
            loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
            loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
            loadedTexture.minFilter = THREE.LinearFilter;
            loadedTexture.magFilter = THREE.LinearFilter;

            if (this.options.enableLogging) {
              console.log(`Loaded texture from file: ${file.name}`);
            }

            resolve(loadedTexture);
          },
          undefined,
          (error) => {
            URL.revokeObjectURL(imageUrl);
            this.objectUrls.delete(imageUrl);
            reject(error);
          }
        );

        // Handle abort signal
        signal?.addEventListener('abort', () => {
          URL.revokeObjectURL(imageUrl);
          this.objectUrls.delete(imageUrl);
          reject(new Error('Load cancelled'));
        });
      };

      reader.onerror = () => {
        reject(new Error('File reading failed'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Load texture from URL
   */
  private async loadFromUrl(url: string, signal?: AbortSignal): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new Error('Load cancelled'));
        return;
      }

      const loader = new THREE.TextureLoader();
      const texture = loader.load(
        url,
        (loadedTexture) => {
          // Configure texture
          loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
          loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
          loadedTexture.minFilter = THREE.LinearFilter;
          loadedTexture.magFilter = THREE.LinearFilter;

          if (this.options.enableLogging) {
            console.log(`Loaded texture from URL: ${url}`);
          }

          resolve(loadedTexture);
        },
        undefined,
        (error) => {
          const message = error instanceof Error ? error.message : 'Unknown error';
          reject(new Error(`Failed to load texture from ${url}: ${message}`));
        }
      );

      // Handle abort signal
      signal?.addEventListener('abort', () => {
        reject(new Error('Load cancelled'));
      });
    });
  }

  /**
   * Create placeholder cube texture for immediate display
   */
  createPlaceholderCubeTexture(): THREE.CubeTexture {
    const size = 64; // Small placeholder size for performance
    const faces: HTMLCanvasElement[] = [];

    for (let i = 0; i < 6; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      // Fill with placeholder color
      ctx.fillStyle = `#${this.options.placeholderColor.toString(16).padStart(6, '0')}`;
      ctx.fillRect(0, 0, size, size);

      // Add face indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      const faceIcons = ['→', '←', '↑', '↓', '⚬', '⚫'];
      ctx.fillText(faceIcons[i] || '?', size / 2, size / 2);

      faces.push(canvas);
    }

    const cubeTexture = new THREE.CubeTexture(faces);
    cubeTexture.needsUpdate = true;

    return cubeTexture;
  }

  /**
   * Load cubemap level incrementally (face by face)
   */
  async loadCubeMapLevelIncremental(
    level: CubeMapLevel,
    levelIndex: number = 0,
    networkQuality: NetworkQuality = 'medium',
    loadingId: string = 'default'
  ): Promise<THREE.CubeTexture> {
    // Validate input
    const validation = validateCubeMapLevel(level);
    if (!validation.valid) {
      throw new Error(`Invalid CubeMapLevel: ${validation.errors.join(', ')}`);
    }

    // Initialize loading state if not exists
    if (!this.loadingStates.has(loadingId)) {
      this.loadingStates.set(loadingId, createInitialLoadingState(1, networkQuality));
    }

    const loadingState = this.loadingStates.get(loadingId)!;

    // Create initial cube texture with placeholders
    let cubeTexture: THREE.CubeTexture;
    if (this.options.useePlaceholders) {
      cubeTexture = this.createPlaceholderCubeTexture();
    } else {
      cubeTexture = new THREE.CubeTexture([]);
    }

    // Get face entries and start loading
    const faceEntries = Object.entries(level) as [FaceName, FaceSource][];
    const abortController = new AbortController();
    this.abortControllers.set(loadingId, abortController);

    // Track loading promises for concurrent limiting
    const loadingPromises: Promise<void>[] = [];
    let activeLoads = 0;

    for (const [faceName, faceSource] of faceEntries) {
      const faceIndex = FACE_INDICES[faceName];

      // Limit concurrent loads
      if (activeLoads >= this.options.maxConcurrentLoads) {
        await Promise.race(loadingPromises);
      }

      const loadPromise = this.loadFaceWithState(
        faceSource,
        faceName,
        faceIndex,
        cubeTexture,
        loadingId,
        abortController.signal
      );

      loadingPromises.push(loadPromise);
      activeLoads++;

      // Clean up completed promises
      loadPromise.finally(() => {
        activeLoads--;
        const index = loadingPromises.indexOf(loadPromise);
        if (index > -1) {
          loadingPromises.splice(index, 1);
        }
      });
    }

    // Wait for all faces to complete (or fail)
    await Promise.allSettled(loadingPromises);

    // Clean up abort controller
    this.abortControllers.delete(loadingId);

    return cubeTexture;
  }

  /**
   * Load individual face with state tracking
   */
  private async loadFaceWithState(
    faceSource: FaceSource,
    faceName: FaceName,
    faceIndex: number,
    cubeTexture: THREE.CubeTexture,
    loadingId: string,
    signal: AbortSignal
  ): Promise<void> {
    const startTime = performance.now();
    const sourceType = isFileSource(faceSource) ? 'file' : 'url';

    // Update loading state to 'loading'
    const loadingState = this.loadingStates.get(loadingId)!;
    this.updateLoadingState(loadingId, faceIndex, {
      status: 'loading',
      sourceType,
      startTime,
    });

    try {
      // Load the texture
      const texture = await this.loadFaceTexture(faceSource, signal);
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Update cube texture immediately
      if (cubeTexture.images) {
        cubeTexture.images[faceIndex] = texture.image;
        cubeTexture.needsUpdate = true;
      }

      // Update loading state to 'loaded'
      this.updateLoadingState(loadingId, faceIndex, {
        status: 'loaded',
        endTime,
        loadTime,
        fileSize: isFileSource(faceSource) ? faceSource.size : undefined,
      });

      // Fire callback
      const faceState = loadingState.faces[faceIndex];
      if (faceState) {
        this.callbacks.onFaceLoaded?.(faceState);
      }

      if (this.options.enableLogging) {
        console.log(`Face ${faceName} loaded in ${loadTime.toFixed(1)}ms`);
      }
    } catch (error) {
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Update loading state to 'error'
      this.updateLoadingState(loadingId, faceIndex, {
        status: 'error',
        endTime,
        loadTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Fire error callback
      const loadingError: LoadingError = {
        type: 'network',
        message: error instanceof Error ? error.message : 'Unknown error',
        faceName,
        resolution: 'low',
        originalError: error instanceof Error ? error : new Error(String(error)),
        timestamp: new Date(),
        recoverable: true,
      };

      this.callbacks.onError?.(loadingError);

      if (this.options.enableLogging) {
        console.error(`Face ${faceName} failed to load:`, error);
      }
    }
  }

  /**
   * Update loading state and fire progress callback
   */
  private updateLoadingState(loadingId: string, faceIndex: number, updates: Partial<FaceLoadingState>): void {
    const currentState = this.loadingStates.get(loadingId)!;
    const updatedState = updateFaceState(currentState, faceIndex, updates);
    this.loadingStates.set(loadingId, updatedState);

    // Fire progress callback
    this.callbacks.onProgress?.(updatedState.overallProgress);

    // Check if level is complete
    if (updatedState.isComplete) {
      this.callbacks.onLevelComplete?.(updatedState.currentLevel);

      // Check if all levels are complete
      if (updatedState.currentLevel === updatedState.totalLevels - 1) {
        this.callbacks.onAllComplete?.();
      }
    }
  }

  /**
   * Cancel loading for specific ID
   */
  cancelLoading(loadingId: string = 'default'): void {
    const abortController = this.abortControllers.get(loadingId);
    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(loadingId);
    }

    this.loadingStates.delete(loadingId);
  }

  /**
   * Get current loading state
   */
  getLoadingState(loadingId: string = 'default'): CubemapLoadingState | undefined {
    return this.loadingStates.get(loadingId);
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    // Cancel all active loading
    for (const [loadingId] of this.abortControllers) {
      this.cancelLoading(loadingId);
    }

    // Revoke all object URLs
    for (const objectUrl of this.objectUrls) {
      URL.revokeObjectURL(objectUrl);
    }
    this.objectUrls.clear();

    // Clear loading states
    this.loadingStates.clear();
  }
}
