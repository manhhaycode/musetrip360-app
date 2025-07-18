import { BaseCacheKeyFactory } from '@musetrip360/query-foundation';

/**
 * Shared cache keys
 */
export class SharedCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('shared');
  }
}

export const sharedCacheKeys = new SharedCacheKeys();
