import { TextureLoader, Texture, RepeatWrapping, LinearFilter, SRGBColorSpace } from 'three';
import { TextureLoadOptions } from './types';

/**
 * Enhanced texture loader with support for panorama-specific configurations
 */
export class PanoramaTextureLoader {
  private loader: TextureLoader;

  constructor() {
    this.loader = new TextureLoader();
  }

  /**
   * Load a panorama texture with optimized settings
   */
  async loadPanoramaTexture(url: string, options: TextureLoadOptions = {}): Promise<Texture> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (texture) => {
          // Configure texture for panorama viewing
          this.configurePanoramaTexture(texture, options);
          resolve(texture);
        },
        (progress) => {
          // Optional progress callback could be added here
        },
        (error) => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          reject(new Error(`Failed to load panorama texture: ${errorMessage}`));
        }
      );
    });
  }

  /**
   * Configure texture settings optimized for panorama viewing
   */
  private configurePanoramaTexture(texture: Texture, options: TextureLoadOptions): void {
    const { anisotropy = 16, flipY = false, generateMipmaps = true, premultiplyAlpha = false } = options;

    // Essential panorama settings
    texture.wrapS = RepeatWrapping;
    texture.repeat.x = -1; // Flip horizontally for inside-out sphere
    texture.colorSpace = SRGBColorSpace;

    // Performance and quality optimizations
    texture.anisotropy = anisotropy;
    texture.flipY = flipY;
    texture.generateMipmaps = generateMipmaps;
    texture.premultiplyAlpha = premultiplyAlpha;

    // Use linear filtering for smooth viewing
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;

    // Mark for update
    texture.needsUpdate = true;
  }

  /**
   * Preload multiple panorama textures
   */
  async preloadTextures(urls: string[]): Promise<Texture[]> {
    const promises = urls.map((url) => this.loadPanoramaTexture(url));
    return Promise.all(promises);
  }

  /**
   * Dispose of texture resources
   */
  disposeTexture(texture: Texture): void {
    texture.dispose();
  }
}

/**
 * Singleton instance for global use
 */
export const panoramaTextureLoader = new PanoramaTextureLoader();

/**
 * Utility function to load panorama texture
 */
export const loadPanoramaTexture = (url: string, options?: TextureLoadOptions): Promise<Texture> => {
  return panoramaTextureLoader.loadPanoramaTexture(url, options);
};

/**
 * Utility function to preload multiple textures
 */
export const preloadPanoramaTextures = (urls: string[]): Promise<Texture[]> => {
  return panoramaTextureLoader.preloadTextures(urls);
};
