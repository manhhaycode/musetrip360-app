/**
 * @fileoverview Museum Management Cache Keys
 *
 * Cache key definitions for museum management-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { MuseumSearchParams } from '@/types';
import { BaseCacheKeyFactory, Pagination, QueryKey } from '@musetrip360/query-foundation';

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

  museumsAdmin(params?: MuseumSearchParams): QueryKey {
    return [this.prefix, 'museums', 'admin', params];
  }

  museum(id: string): QueryKey {
    return [this.prefix, 'museum', id];
  }

  createMuseum(): QueryKey {
    return [this.prefix, 'createMuseum'];
  }

  // Museum search keys
  museumSearch(params: MuseumSearchParams): QueryKey {
    return [this.prefix, 'museumSearch', params];
  }

  userMuseums(): QueryKey {
    return [this.prefix, 'userMuseums'];
  }

  analyticsOverview(museumId: string): QueryKey {
    return [this.prefix, 'analyticsOverview', museumId];
  }
}

/**
 * Default cache keys instance
 */
export const museumManagementCacheKeys = new MuseumManagementCacheKeys();

/**
 * Museum Request Management cache keys
 */
export class MuseumRequestManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('museumRequestManagement');
  }

  museumRequest(id: string): QueryKey {
    return [this.prefix, 'museumRequest', id];
  }

  museumRequests(params: Pagination): QueryKey {
    return [this.prefix, 'museumRequests', params];
  }

  userMuseumRequests(params: Pagination): QueryKey {
    return [this.prefix, 'userMuseumRequests', params];
  }
}

export const museumRequestManagementCacheKeys = new MuseumRequestManagementCacheKeys();

/**
 * Museum Policy Management cache keys
 */
export class MuseumPolicyManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('museumPolicyManagement');
  }

  museumPolicies(museumId: string, params: Pagination): QueryKey {
    return [this.prefix, 'museumPolicies', museumId, params];
  }
}

export const museumPolicyManagementCacheKeys = new MuseumPolicyManagementCacheKeys();

/**
 * Museum Article Management cache keys
 */
export class MuseumArticleManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('museumArticleManagement');
  }

  museumArticles(museumId: string, params: Pagination): QueryKey {
    return [this.prefix, 'museumArticles', museumId, params];
  }

  articlesByEntity(entityId: string, dataEntityType: string, params: Pagination): QueryKey {
    return [this.prefix, 'articlesByEntity', entityId, dataEntityType, params];
  }

  article(id: string): QueryKey {
    return [this.prefix, 'article', id];
  }
}

export const museumArticleManagementCacheKeys = new MuseumArticleManagementCacheKeys();
