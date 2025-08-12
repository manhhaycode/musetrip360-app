/**
 * @fileoverview Event Management Cache Keys
 *
 * Cache key definitions for event management-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { EventSearchParams } from '@/types';
import { BaseCacheKeyFactory, QueryKey } from '@musetrip360/query-foundation';

/**
 * Event Management cache keys
 */
export class EventManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('eventManagement');
  }

  // Museum management keys
  events(): QueryKey {
    return [this.prefix, 'events'];
  }

  event(id: string): QueryKey {
    return [this.prefix, 'event', id];
  }

  eventsByMuseum(museumId: string, params: EventSearchParams): QueryKey {
    return [this.prefix, 'events', 'byMuseum', museumId, params.Page, params.PageSize, params.startDate, params.status];
  }
}

/**
 * Default cache keys instance
 */
export const eventManagementCacheKeys = new EventManagementCacheKeys();
