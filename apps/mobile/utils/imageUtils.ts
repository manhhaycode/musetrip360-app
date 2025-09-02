/**
 * Utility functions for handling image URLs
 */

const API_BASE_URL = 'https://api.musetrip360.site';

/**
 * Convert relative image path to absolute URL
 * @param imagePath - Relative path like "./image.jpg" or absolute URL
 * @returns Absolute URL
 */
export const getAbsoluteImageUrl = (imagePath: string | undefined | null): string | undefined => {
    if (!imagePath || typeof imagePath !== 'string') return undefined;

    // If already absolute URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If relative path, convert to absolute
    if (imagePath.startsWith('./')) {
        return `${API_BASE_URL}${imagePath.substring(1)}`;
    }

    if (imagePath.startsWith('/')) {
        return `${API_BASE_URL}${imagePath}`;
    }

    // Default case - assume it's a relative path
    return `${API_BASE_URL}/${imagePath}`;
};

/**
 * Extract image URL from various possible structures
 */
export const extractImageUrl = (imageData: any): string | undefined => {
    if (!imageData) return undefined;

    if (typeof imageData === 'string') {
        return getAbsoluteImageUrl(imageData);
    }

    // Handle object with path/file properties
    if (typeof imageData === 'object' && imageData !== null) {
        const path = imageData.path || imageData.file || imageData.url || imageData.relativePath;
        if (path && typeof path === 'string') {
            return getAbsoluteImageUrl(path);
        }
    }

    return undefined;
};
