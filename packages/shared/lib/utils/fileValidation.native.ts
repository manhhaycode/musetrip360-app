// React Native/mobile version: only support basic file validation, no web APIs
import { DEFAULT_VALIDATION_CONFIG, FileData, FileValidationConfig, FileValidationResult, MediaType } from '../types';

export const getAcceptConfig = (mediaType: MediaType) => {
  const config = getValidationConfig(mediaType);
  const accept: Record<string, string[]> = {};

  config.allowedTypes.forEach((type) => {
    accept[type] = config.allowedExtensions;
  });

  return accept;
};

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

export function validateFileByMediaType(file: File, mediaType: MediaType): FileValidationResult {
  const config = DEFAULT_VALIDATION_CONFIG[mediaType];
  return validateFile(file, config);
}

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

export function validateImageDimensions(file: File, config: FileValidationConfig): Promise<FileValidationResult> {
  return Promise.resolve({
    isValid: false,
    errors: ['Tính năng kiểm tra kích thước hình ảnh không hỗ trợ trên mobile'],
    file,
  });
}

export function validateVideoDuration(file: File, config: FileValidationConfig): Promise<FileValidationResult> {
  return Promise.resolve({
    isValid: false,
    errors: ['Tính năng kiểm tra thời lượng video không hỗ trợ trên mobile'],
    file,
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return '.' + filename.split('.').pop()?.toLowerCase() || '';
}

export function isFileTypeSupported(file: File, mediaType: MediaType): boolean {
  const config = DEFAULT_VALIDATION_CONFIG[mediaType];

  return config.allowedTypes.some((type) => {
    if (type.includes('*')) {
      return file.type.startsWith(type.replace('*', ''));
    }
    return file.type === type;
  });
}

export function generateFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}
