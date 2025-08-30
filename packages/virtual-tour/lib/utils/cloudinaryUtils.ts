import type { CubeMapLevel } from '@/types/cubemap';

/**
 * Simple Cloudinary utilities for generating progressive cubemap levels
 */

/**
 * Extract Cloudinary public ID from URL
 *
 * @param url - Cloudinary image URL
 * @returns Public ID or null if invalid URL
 *
 * @example
 * extractPublicId('https://res.cloudinary.com/demo/image/upload/sample.jpg')
 * // returns: 'sample'
 */
export function extractPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);

    // Check if it's a Cloudinary URL
    if (!urlObj.hostname.includes('cloudinary.com')) {
      return null;
    }

    // Extract path segments
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);

    // Find upload index
    const uploadIndex = pathSegments.findIndex((segment) => segment === 'upload');
    if (uploadIndex === -1) return null;

    // Get everything after upload (skipping version if present)
    const afterUpload = pathSegments.slice(uploadIndex + 1);

    // Skip version if present (starts with v followed by numbers)
    const startIndex = afterUpload[0]?.match(/^v\d+$/) ? 1 : 0;

    // Join remaining segments and remove extension
    const publicIdWithExt = afterUpload.slice(startIndex).join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // Remove file extension

    return publicId || null;
  } catch {
    return null;
  }
}

/**
 * Add scale transformation to Cloudinary URL
 *
 * @param baseUrl - Original Cloudinary URL
 * @param scale - Scale factor (0.25 = 25%, 0.5 = 50%, 0.75 = 75%)
 * @returns Scaled URL
 */
function addCloudinaryScale(baseUrl: string, scale: number): string {
  if (scale === 1.0) return baseUrl;

  try {
    const url = new URL(baseUrl);
    const pathSegments = url.pathname.split('/');

    // Find upload segment
    const uploadIndex = pathSegments.findIndex((segment) => segment === 'upload');
    if (uploadIndex === -1) return baseUrl;

    // Add scale transformation
    const scaleTransform = `c_scale,w_${scale}`;
    pathSegments.splice(uploadIndex + 1, 0, scaleTransform);

    const newUrl = new URL(url);
    newUrl.pathname = pathSegments.join('/');
    return newUrl.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * Generate progressive cubemap levels from high-quality face URLs
 *
 * @param faceUrls - CubeMapLevel with high-quality Cloudinary URLs
 * @returns Array of CubeMapLevel objects [25%, 50%, 75%, 100%]
 */
export function generateProgressiveCubemap(faceUrls: CubeMapLevel): CubeMapLevel[] {
  const scales = [0.25, 0.5, 0.75, 1.0]; // 25%, 50%, 75%, 100%

  return scales.map((scale) => ({
    px: addCloudinaryScale(faceUrls.px as string, scale),
    nx: addCloudinaryScale(faceUrls.nx as string, scale),
    py: addCloudinaryScale(faceUrls.py as string, scale),
    ny: addCloudinaryScale(faceUrls.ny as string, scale),
    pz: addCloudinaryScale(faceUrls.pz as string, scale),
    nz: addCloudinaryScale(faceUrls.nz as string, scale),
  }));
}

/**
 * Validate if URL is a valid Cloudinary image URL
 */
export function isValidCloudinaryUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('cloudinary.com') && urlObj.pathname.includes('/upload/');
  } catch {
    return false;
  }
}
