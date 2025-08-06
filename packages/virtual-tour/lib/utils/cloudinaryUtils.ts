export interface CloudinaryConfig {
  cloudName: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface PanoramaQuality {
  level: 'instant' | 'preview' | 'standard' | 'high' | 'ultra';
  width: number;
  height: number;
  bandwidth: number; // Required Mbps
  description: string;
}

export interface CloudinaryOptions {
  quality?: 'auto' | 'auto:low' | 'auto:good' | 'auto:best' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'avif';
  dpr?: 'auto' | number;
  progressive?: boolean;
}

/**
 * Cloudinary URL generator for panorama transformations
 */
export class CloudinaryPanoramaGenerator {
  private cloudName: string;
  private baseUrl: string;

  // Standard panorama qualities
  public readonly qualities: PanoramaQuality[] = [
    { level: 'instant', width: 512, height: 256, bandwidth: 0.5, description: 'Ultra-fast loading' },
    { level: 'preview', width: 1024, height: 512, bandwidth: 2, description: 'Fast preview' },
    { level: 'standard', width: 2048, height: 1024, bandwidth: 5, description: 'Standard quality' },
    { level: 'high', width: 4096, height: 2048, bandwidth: 15, description: 'High quality' },
    { level: 'ultra', width: 8192, height: 4096, bandwidth: 40, description: 'Ultra quality' },
  ];

  constructor(config: CloudinaryConfig) {
    this.cloudName = config.cloudName;
    this.baseUrl = `https://res.cloudinary.com/${this.cloudName}/image/upload`;
  }

  /**
   * Generate panorama URL for specific quality level
   */
  generatePanoramaUrl(
    publicId: string,
    quality: PanoramaQuality['level'],
    options: Partial<CloudinaryOptions> = {}
  ): string {
    const qualityConfig = this.qualities.find((q) => q.level === quality);
    if (!qualityConfig) {
      throw new Error(`Unknown quality level: ${quality}`);
    }

    const transformations = [
      `w_${qualityConfig.width}`,
      `h_${qualityConfig.height}`,
      'c_scale',
      `q_${options.quality || 'auto'}`,
      `f_${options.format || 'auto'}`,
    ];

    if (options.dpr) {
      transformations.push(`dpr_${options.dpr}`);
    }

    if (options.progressive) {
      transformations.push('fl_progressive');
    }

    return `${this.baseUrl}/${transformations.join(',')}/${publicId}`;
  }

  /**
   * Generate all quality URLs for a panorama
   */
  generateAllQualityUrls(publicId: string, options: Partial<CloudinaryOptions> = {}): Record<string, string> {
    const urls: Record<string, string> = {};

    this.qualities.forEach((quality) => {
      urls[quality.level] = this.generatePanoramaUrl(publicId, quality.level, options);
    });

    return urls;
  }

  /**
   * Get optimal quality level based on network bandwidth
   */
  getOptimalQuality(bandwidthMbps: number): PanoramaQuality['level'] {
    // Find the highest quality that fits within bandwidth
    const suitable = this.qualities
      .filter((q) => q.bandwidth <= bandwidthMbps)
      .sort((a, b) => b.bandwidth - a.bandwidth);

    return suitable.length > 0 ? suitable[0]!.level : 'instant';
  }

  /**
   * Generate responsive URLs for different device pixel ratios
   */
  generateResponsiveUrls(
    publicId: string,
    quality: PanoramaQuality['level']
  ): { '1x': string; '2x': string; '3x': string } {
    return {
      '1x': this.generatePanoramaUrl(publicId, quality, { dpr: 1 }),
      '2x': this.generatePanoramaUrl(publicId, quality, { dpr: 2 }),
      '3x': this.generatePanoramaUrl(publicId, quality, { dpr: 3 }),
    };
  }
}

/**
 * Default configuration utilities
 */
export const createCloudinaryGenerator = (cloudName: string): CloudinaryPanoramaGenerator => {
  return new CloudinaryPanoramaGenerator({ cloudName });
};

/**
 * Utility function to extract public ID from Cloudinary URL
 */
export const extractPublicId = (cloudinaryUrl: string): string | null => {
  const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1]! : null;
};

/**
 * Utility function to validate Cloudinary configuration
 */
export const validateCloudinaryConfig = (config: CloudinaryConfig): boolean => {
  return !!(config.cloudName && typeof config.cloudName === 'string' && config.cloudName.length > 0);
};
