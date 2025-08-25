import { FeedbackSearchParams } from '@/types';
import { BaseCacheKeyFactory } from '@musetrip360/query-foundation';
import type { QueryKey } from '@tanstack/react-query';

/**
 * Upload-related cache keys
 */
export class UploadCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('upload');
  }

  /**
   * Cache key for file upload operations
   */
  fileUpload(fileId?: string): QueryKey {
    return fileId ? [this.prefix, 'file', fileId] : [this.prefix, 'file'];
  }

  /**
   * Cache key for multiple file uploads
   */
  multipleUploads(): QueryKey {
    return [this.prefix, 'multiple'];
  }

  /**
   * Cache key for upload progress
   */
  uploadProgress(fileId: string): QueryKey {
    return [this.prefix, 'progress', fileId];
  }

  /**
   * Cache key for upload history
   */
  uploadHistory(): QueryKey {
    return [this.prefix, 'history'];
  }

  /**
   * Cache key for upload by media type
   */
  byMediaType(mediaType: string): QueryKey {
    return [this.prefix, 'media-type', mediaType];
  }
}

export class CategoryCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('category');
  }
  /**
   * Cache key for categories
   */
  categories(): QueryKey {
    return [this.prefix, 'list'];
  }
}

export class HistoricalPeriodCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('historical-period');
  }
  /**
   * Cache key for historical periods
   */
  periods(): QueryKey {
    return [this.prefix, 'periods'];
  }
}

export class FeedbackCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('feedback');
  }

  /**
   * Cache key for feedback
   */
  feedback(params: FeedbackSearchParams): QueryKey {
    return [this.prefix, 'list', params.Page, params.PageSize, params.targetId ?? '', params.targetType ?? ''];
  }
}

/**
 * Shared cache keys
 */
export class SharedCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('shared');
  }

  /**
   * Upload-specific cache keys
   */
  upload = new UploadCacheKeys();
  category = new CategoryCacheKeys();
  historicalPeriod = new HistoricalPeriodCacheKeys();
  feedback = new FeedbackCacheKeys();
}

export const sharedCacheKeys = new SharedCacheKeys();
