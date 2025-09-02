/**
 * @fileoverview Authentication Cache Keys
 *
 * Cache key definitions for authentication-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { BaseCacheKeyFactory, Pagination, QueryKey } from '@musetrip360/query-foundation';

/**
 * Virtual Tour cache keys
 */
export class VirtualTourCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('virtualTour');
  }

  listByMuseum(museumId?: string, params?: Pagination): QueryKey {
    return [this.prefix, 'lists', 'byMuseum', ...(museumId ? [museumId] : []), ...(params ? [params] : [])];
  }
}

export const virtualTourCacheKeys = new VirtualTourCacheKeys();
