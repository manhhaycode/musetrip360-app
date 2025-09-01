/**
 * @fileoverview Shared Type Definitions
 *
 * Common TypeScript types used across the shared package
 */

import type { Pagination } from '@musetrip360/query-foundation';
import { IUser } from 'node_modules/@musetrip360/auth-system/dist/types/types';
import { z, ZodType } from 'zod';

/**
 * Media type enumeration matching backend API
 */
export enum MediaType {
  IMAGE = 'Image',
  AUDIO = 'Audio',
  MODEL3D = 'Model3D',
  VIDEO = 'Video',
  DOCUMENT = 'Document',
}

export type BaseParams = {
  page: number;
  pageSize: number;
  search?: string;
};
/**
 * File upload request structure
 * /
 * @interface FileUploadRequest
 * */
export interface FileUploadRequest {
  file: File; // The file to be uploaded
  type: MediaType; // Type of the file (Image, Video, Document)
  FileName?: string; // Optional file name
}

/**
 * File upload response from API
 */
export interface UploadResponse {
  url: string; // URL of the uploaded file
}

/**
 * File validation configuration
 */
export interface FileValidationConfig {
  maxSize: number; // in bytes
  allowedTypes: string[]; // MIME types
  allowedExtensions: string[];
  minWidth?: number; // for images
  minHeight?: number; // for images
  maxWidth?: number; // for images
  maxHeight?: number; // for images
  maxDuration?: number; // for videos, in seconds
}

/**
 * File validation result
 */
export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  file: File;
}

/**
 * Upload error structure
 */
export interface UploadError {
  code: string;
  message: string;
  details?: Record<string, any>;
  file?: File;
  statusCode?: number;
}

/**
 * File preview information
 */
export interface FilePreview {
  id: string;
  file: File;
  previewUrl: string;
  type: MediaType;
  isLoading: boolean;
  error?: string;
}

/**
 * Default file validation configurations by media type
 */
export const DEFAULT_VALIDATION_CONFIG: Record<MediaType, FileValidationConfig> = {
  [MediaType.IMAGE]: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
    maxWidth: 4096,
    maxHeight: 4096,
  },

  [MediaType.VIDEO]: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
    allowedExtensions: ['.mp4', '.webm', '.ogg'],
    maxDuration: 600, // 10 minutes
  },

  [MediaType.AUDIO]: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac', 'audio/x-m4a', 'audio/webm'],
    allowedExtensions: ['.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a', '.webm'],
    maxDuration: 1800, // 30 minutes
  },

  [MediaType.MODEL3D]: {
    maxSize: 10 * 1024 * 1024, // 10MB (3D models can be large)
    allowedTypes: [
      'model/gltf-binary', // .glb files
      'model/gltf+json', // .gltf files
      'application/octet-stream', // Generic binary format for .obj, .fbx, etc.
      'model/obj', // .obj files
      'model/x3d+xml', // .x3d files
      'model/stl', // .stl files
      'model/ply', // .ply files
      'application/x-3ds', // .3ds files
      'model/dae', // .dae (COLLADA) files
    ],
    allowedExtensions: ['.glb', '.gltf', '.obj', '.fbx', '.3ds', '.dae', '.ply', '.stl', '.x3d'],
  },

  [MediaType.DOCUMENT]: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    allowedExtensions: ['.pdf', '.txt', '.doc', '.docx'],
  },
};

export type FileData = {
  file: File | string | null; // File object or URL
  mediaType?: MediaType; // Type of the file
  fileName?: string; // Optional file name
  audioOptions?: {
    autoPlay?: boolean;
    volume?: number;
    loop?: boolean;
  };
};

export const ZodFileData = z.object({
  file: z.union([z.instanceof(File), z.string()]).nullable(),
  mediaType: z.nativeEnum(MediaType).optional(),
  fileName: z.string().optional(),
}) satisfies ZodType<FileData>;

export type Category = {
  id: string;
  name: string;
  description?: string;
  metadata?: any;
};

export type HistoricalPeriod = {
  id: string;
  name: string;
  description?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  metadata?: any;
};

export type FeedbackCreate = {
  targetId: string;
  target: string;
  comment: string;
  rating: number;
};

export type Feedback = {
  id: string;
  targetId: string;
  type: string;
  comment: string;
  rating: number;
  createdBy: string;
  createdByUser: IUser;
  createdAt: Date;
  updatedAt: Date;
};

export type FeedbackSearchParams = Pagination & {
  targetId?: string;
  targetType?: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: Date | null;
  target: 'User' | 'Admin' | 'All';
  createdAt: Date;
  userId: string;
  metadata?: NotificationMetadata;
};

export type NotificationMetadata = {
  TargetId?: string;
};

export type UpdateReadNotification = {
  notificationId: string;
  isRead: boolean;
};

export type NotificationSearchParams = Pagination & {
  isRead?: boolean;
};
