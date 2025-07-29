/**
 * @fileoverview Role Management React Query Hooks
 *
 * React Query hooks for role and permission management operations.
 */

import { useQuery } from '@musetrip360/query-foundation';
import { roleEndpoints } from '../endpoints/roles';
import type { RoleParams } from '@/types';
import { userCacheKeys } from '../cache/cacheKeys';

/**
 * Hook to get roles from system
 */
export function useRoles(params: RoleParams) {
  return useQuery(userCacheKeys.roles(), () => roleEndpoints.getRoles(params));
}
