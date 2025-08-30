import { useEffect, useState, useCallback, useRef } from 'react';
import { TextureLoader, Texture } from 'three';
import * as THREE from 'three';
import type { CubeMapLevel } from '@/types/cubemap';

export interface ProgressiveCubemapState {
  /** Currently active preloaded textures (ready for THREE.js) */
  currentTextures: Texture[] | null;
  /** Current level index (0 = lowest quality) */
  currentLevelIndex: number;
  /** Total number of available levels */
  totalLevels: number;
  /** Loading progress for current level (0-1) */
  loadingProgress: number;
  /** Whether any level is currently loading */
  isLoading: boolean;
  /** Whether all available levels have been loaded */
  isComplete: boolean;
  /** Error state if loading fails */
  error: string | null;
  /** Array of successfully loaded levels */
  loadedLevels: number[];
}

export interface UseProgressiveCubemapOptions {
  /** Enable progressive loading (default: true) */
  enabled?: boolean;
  /** Auto-advance to next level when current loads (default: true) */
  autoAdvance?: boolean;
  /** Delay between level advances in ms (default: 500) */
  advanceDelay?: number;
  /** Start from specific level index (default: 0) */
  startLevel?: number;
}

/**
 * Progressive cubemap loading hook with preloaded textures
 *
 * Strategy:
 * 1. Preload textures using native TextureLoader (no Suspense)
 * 2. Return ready Texture objects for direct use in THREE.js
 * 3. Progressively upgrade texture quality automatically
 *
 * Key advantage: Bypasses R3F's useTexture/useLoader Suspense behavior
 */
export function useProgressiveCubemap(
  cubeMaps: CubeMapLevel[],
  options: UseProgressiveCubemapOptions = {}
): ProgressiveCubemapState {
  const { enabled = true, autoAdvance = true, advanceDelay = 500, startLevel = 0 } = options;

  const [currentLevelIndex, setCurrentLevelIndex] = useState(startLevel);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadedLevels, setLoadedLevels] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTextures, setCurrentTextures] = useState<Texture[] | null>(null);

  const loaderRef = useRef<TextureLoader | null>(null);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textureCache = useRef<Map<number, Texture[]>>(new Map());

  // Initialize loader
  useEffect(() => {
    if (!loaderRef.current) {
      loaderRef.current = new TextureLoader();
    }
  }, []);

  // Reset state when cubeMaps change
  useEffect(() => {
    setCurrentLevelIndex(startLevel);
    setLoadingProgress(0);
    setError(null);
    setLoadedLevels([]);
    setIsLoading(false);
    setCurrentTextures(null);
    textureCache.current.clear();

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  }, [cubeMaps, startLevel]);

  const totalLevels = cubeMaps.length;

  // Load specific level and return preloaded textures
  const loadLevel = useCallback(
    (levelIndex: number) => {
      if (!enabled || !loaderRef.current || !cubeMaps[levelIndex]) {
        return;
      }

      // Check if level is already cached
      if (textureCache.current.has(levelIndex)) {
        const cachedTextures = textureCache.current.get(levelIndex)!;
        setCurrentTextures(cachedTextures);
        setCurrentLevelIndex(levelIndex);
        setLoadedLevels((prev) => (prev.includes(levelIndex) ? prev : [...prev, levelIndex]));
        return;
      }

      const level = cubeMaps[levelIndex];
      setIsLoading(true);
      setLoadingProgress(0);
      setError(null);

      // Convert level to URLs
      const faces = [level.px, level.nx, level.py, level.ny, level.pz, level.nz];
      const urls = faces.map((face) => (face instanceof File ? URL.createObjectURL(face) : face));

      let loadedCount = 0;
      let hasError = false;
      const loadedTextures: Texture[] = [];

      const checkComplete = () => {
        const progress = loadedCount / 6;
        setLoadingProgress(progress);

        if (loadedCount === 6 && !hasError) {
          // Configure all textures for optimal display - no cloning needed
          loadedTextures.forEach((texture) => {
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
          });

          // Cache and set textures
          textureCache.current.set(levelIndex, loadedTextures);
          setCurrentTextures(loadedTextures);
          setCurrentLevelIndex(levelIndex);
          setIsLoading(false);
          setLoadedLevels((prev) => [...prev, levelIndex]);

          if (autoAdvance && levelIndex < totalLevels - 1) {
            // Schedule next level loading
            loadingTimeoutRef.current = setTimeout(() => {
              loadLevel(levelIndex + 1);
            }, advanceDelay);
          }
        }
      };

      // Load each face texture
      urls.forEach((url, faceIndex) => {
        loaderRef.current!.load(
          url,
          // onLoad
          (texture) => {
            loadedTextures[faceIndex] = texture;
            loadedCount++;
            checkComplete();
          },
          // onProgress
          undefined,
          // onError
          (err: unknown) => {
            if (!hasError) {
              hasError = true;
              const errorMessage = err instanceof Error ? err.message : 'Unknown error';
              setError(`Failed to load face ${faceIndex} of level ${levelIndex}: ${errorMessage}`);
              setIsLoading(false);
            }
          }
        );
      });
    },
    [enabled, cubeMaps, autoAdvance, advanceDelay, totalLevels]
  );

  // Start loading when component mounts or cubeMaps change
  useEffect(() => {
    if (enabled && cubeMaps.length > 0) {
      loadLevel(startLevel);
    }
  }, [enabled, cubeMaps, startLevel, loadLevel]);

  // Cleanup
  useEffect(() => {
    const currentCache = textureCache.current;
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Dispose of cached textures
      currentCache.forEach((textures) => {
        textures.forEach((texture) => texture.dispose());
      });
      currentCache.clear();
    };
  }, []);

  return {
    currentTextures,
    currentLevelIndex,
    totalLevels,
    loadingProgress,
    isLoading,
    isComplete: currentLevelIndex === totalLevels - 1 && loadedLevels.includes(totalLevels - 1),
    error,
    loadedLevels,
  };
}
