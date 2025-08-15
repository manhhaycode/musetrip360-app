/**
 * @fileoverview Ai Management Cache Keys
 *
 * Cache key definitions for Ai management-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { BaseCacheKeyFactory } from '@musetrip360/query-foundation';

/**
 * Ai Management cache keys
 */
export class AiManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('AiManagement');
  }
}

/**
 * Default cache keys instance
 */
export const aiManagementCacheKeys = new AiManagementCacheKeys();
