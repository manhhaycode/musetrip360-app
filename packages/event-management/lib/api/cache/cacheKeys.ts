/**
 * @fileoverview Museum Management Cache Keys
 *
 * Cache key definitions for museum management-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { BaseCacheKeyFactory, QueryKey } from '@musetrip360/query-foundation';
import { MuseumSearchParams } from '@/types';

/**
 * Museum Management cache keys
 */
export class MuseumManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('museumManagement');
  }

  // Museum management keys
  museums(): QueryKey {
    return [this.prefix, 'museums'];
  }

  museum(id: string): QueryKey {
    return [this.prefix, 'museum', id];
  }

  // Museum search keys
  museumSearch(params: MuseumSearchParams): QueryKey {
    return [this.prefix, 'museumSearch', params];
  }
}

/**
 * Default cache keys instance
 */
export const museumManagementCacheKeys = new MuseumManagementCacheKeys();
