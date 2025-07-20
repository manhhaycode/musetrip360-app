/**
 * @fileoverview Artifact Management Cache Keys
 *
 * Cache key definitions for artifact and museum management-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { BaseCacheKeyFactory, QueryKey } from '@musetrip360/query-foundation';
import { ArtifactListParams, ArtifactAdminListParams, ArtifactMuseumSearchParams } from '@/types';

/**
 * Artifact Management cache keys
 */
export class ArtifactManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('artifactManagement');
  }

  // Artifact keys
  list(params?: ArtifactListParams): QueryKey {
    return [this.prefix, 'artifacts', 'list', params];
  }

  adminList(params?: ArtifactAdminListParams): QueryKey {
    return [this.prefix, 'artifacts', 'adminList', params];
  }

  detail(id: string): QueryKey {
    return [this.prefix, 'artifact', id];
  }

  byMuseum(params: Partial<ArtifactMuseumSearchParams>): QueryKey {
    return [this.prefix, 'artifacts', 'byMuseum', params.museumId, params];
  }

  // Mutation keys
  create(): QueryKey {
    return [this.prefix, 'artifact', 'create'];
  }

  update(): QueryKey {
    return [this.prefix, 'artifact', 'update'];
  }

  delete(): QueryKey {
    return [this.prefix, 'artifact', 'delete'];
  }

  activate(): QueryKey {
    return [this.prefix, 'artifact', 'activate'];
  }

  deactivate(): QueryKey {
    return [this.prefix, 'artifact', 'deactivate'];
  }
}

/**
 * Default cache keys instances
 */
export const artifactCacheKeys = new ArtifactManagementCacheKeys();
