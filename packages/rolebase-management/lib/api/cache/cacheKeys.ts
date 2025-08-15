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
export class RolebaseManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('RolebaseManagement');
  }

  roles(params?: Pagination): QueryKey {
    return ['rolebase', 'roles', params?.Page, params?.PageSize];
  }
  role(roleId: string) {
    return ['rolebase', 'role', roleId];
  }
  permissions(params?: Pagination) {
    return ['rolebase', 'permissions', params];
  }
  permission(permissionId: string) {
    return ['rolebase', 'permission', permissionId];
  }
  userPrivileges() {
    return ['rolebase', 'userPrivileges'];
  }
}

/**
 * Default cache keys instance
 */
export const rolebaseManagementCacheKeys = new RolebaseManagementCacheKeys();
