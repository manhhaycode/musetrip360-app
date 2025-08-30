/**
 * @fileoverview Ai Management Cache Keys
 *
 * Cache key definitions for Ai management-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { BaseCacheKeyFactory, Pagination, QueryKey } from '@musetrip360/query-foundation';

/**
 * Ai Management cache keys
 */
export class AiManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('AiManagement');
  }

  conversations(): QueryKey {
    return [this.prefix, 'conversations'];
  }

  messages(conversationId: string, params: Pagination): QueryKey {
    return [this.prefix, 'messages', conversationId, params.Page, params.PageSize];
  }

  voice(): QueryKey {
    return [this.prefix, 'voice'];
  }
}

/**
 * Default cache keys instance
 */
export const aiManagementCacheKeys = new AiManagementCacheKeys();
