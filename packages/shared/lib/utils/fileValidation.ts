import { MediaType, FileValidationConfig, FileValidationResult, DEFAULT_VALIDATION_CONFIG, FileData } from '../types';

export const getAcceptConfig = (mediaType: MediaType) => {
  const config = getValidationConfig(mediaType);
  const accept: Record<string, string[]> = {};

  config.allowedTypes.forEach((type) => {
    accept[type] = config.allowedExtensions;
  });

  return accept;
};

/**
 * Validate a single file against the provided configuration
 */
export function validateFile(
  file: File,
  config: FileValidationConfig = DEFAULT_VALIDATION_CONFIG.Image
): FileValidationResult {
  const errors: string[] = [];

  // Check file size
  if (file.size > config.maxSize) {
    const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(1);
    errors.push(`Kích thước tệp vượt quá giới hạn ${maxSizeMB}MB`);
  }

  // Check MIME type
  if (config.allowedTypes.length > 0) {
    const isValidType = config.allowedTypes.some((type) => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.type === type;
    });

    if (!isValidType) {
      errors.push(`Loại tệp "${file.type}" không được phép`);
    }
  }

  // Check file extension
  if (config.allowedExtensions.length > 0) {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = config.allowedExtensions.map((ext) => ext.toLowerCase()).includes(fileExtension);

    if (!isValidExtension) {
      errors.push(`Phần mở rộng "${fileExtension}" không được phép`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    file,
  };
}

/**
 * Validate file by media type using default configurations
 */
export function validateFileByMediaType(file: File, mediaType: MediaType): FileValidationResult {
  const config = DEFAULT_VALIDATION_CONFIG[mediaType];
  return validateFile(file, config);
}

/**
 * Get file validation configuration for a media type
 */
export function getValidationConfig(mediaType: MediaType): FileValidationConfig {
  return DEFAULT_VALIDATION_CONFIG[mediaType];
}

export function getFileName(fileData: FileData) {
  return (
    fileData.fileName ||
    (fileData.file instanceof File
      ? fileData.file.name
      : typeof fileData.file === 'string'
        ? fileData.file.split('/').pop() || 'File'
        : 'File')
  );
}

/**
 * Check if file is an image and validate dimensions
 */
export function validateImageDimensions(file: File, config: FileValidationConfig): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({
        isValid: false,
        errors: ['Tệp không phải là hình ảnh'],
        file,
      });
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');

    img.onload = () => {
      const errors: string[] = [];

      if (config.minWidth && img.width < config.minWidth) {
        errors.push(`Chiều rộng hình ảnh phải ít nhất ${config.minWidth}px`);
      }

      if (config.maxWidth && img.width > config.maxWidth) {
        errors.push(`Chiều rộng hình ảnh không được vượt quá ${config.maxWidth}px`);
      }

      if (config.minHeight && img.height < config.minHeight) {
        errors.push(`Chiều cao hình ảnh phải ít nhất ${config.minHeight}px`);
      }

      if (config.maxHeight && img.height > config.maxHeight) {
        errors.push(`Chiều cao hình ảnh không được vượt quá ${config.maxHeight}px`);
      }

      resolve({
        isValid: errors.length === 0,
        errors,
        file,
      });

      // Cleanup
      canvas.remove();
    };

    img.onerror = () => {
      resolve({
        isValid: false,
        errors: ['Không thể tải hình ảnh để xác thực'],
        file,
      });
      canvas.remove();
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Check if file is a video and validate duration
 */
export function validateVideoDuration(file: File, config: FileValidationConfig): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('video/')) {
      resolve({
        isValid: false,
        errors: ['Tệp không phải là video'],
        file,
      });
      return;
    }

    const video = document.createElement('video');

    video.onloadedmetadata = () => {
      const errors: string[] = [];

      if (config.maxDuration && video.duration > config.maxDuration) {
        const maxDurationMin = Math.floor(config.maxDuration / 60);
        errors.push(`Thời lượng video không được vượt quá ${maxDurationMin} phút`);
      }

      resolve({
        isValid: errors.length === 0,
        errors,
        file,
      });

      // Cleanup
      video.remove();
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      resolve({
        isValid: false,
        errors: ['Không thể tải video để xác thực'],
        file,
      });
      video.remove();
      URL.revokeObjectURL(video.src);
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return '.' + filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if file type is supported by media type
 */
export function isFileTypeSupported(file: File, mediaType: MediaType): boolean {
  const config = DEFAULT_VALIDATION_CONFIG[mediaType];

  return config.allowedTypes.some((type) => {
    if (type.includes('*')) {
      return file.type.startsWith(type.replace('*', ''));
    }
    return file.type === type;
  });
}

/**
 * Generate a unique file ID based on file properties
 */
export function generateFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}
