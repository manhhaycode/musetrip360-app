/**
 * @fileoverview Role Management React Query Hooks
 *
 * React Query hooks for role and permission management operations.
 */

import { useQuery, useMutation, useQueryClient } from '@musetrip360/query-foundation';
import { roleEndpoints, roleErrorHandler } from '../endpoints/roles';
import type { UserRoleFormDto } from '@/types';
import { userCacheKeys } from '../cache/cacheKeys';

/**
 * Hook to fetch roles for a specific user
 */
export function useUserRoles(userId: string) {
  return useQuery(userCacheKeys.roles(userId), () => roleEndpoints.getUserRoles(userId));
}

/**
 * Hook to get current user privileges
 */
export function useCurrentUserPrivileges() {
  return useQuery(userCacheKeys.privileges(), () => roleEndpoints.getCurrentUserPrivileges());
}

/**
 * Hook to add a role to a user
 */
export function useAddUserRole() {
  const queryClient = useQueryClient();

  return useMutation((roleData: UserRoleFormDto) => roleEndpoints.addUserRole(roleData), {
    onSuccess: (_, variables) => {
      // Invalidate user roles query
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.roles(variables.userId),
      });

      // Invalidate user details if cached
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.detail(variables.userId),
      });

      // Invalidate user lists to refresh role information
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.lists(),
      });

      // If this is the current user, invalidate privileges
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.privileges(),
      });
    },
    onError: (error: any) => {
      console.error('Failed to add user role:', roleErrorHandler.handleError(error));
    },
  });
}

/**
 * Hook to remove a role from a user
 */
export function useRemoveUserRole() {
  const queryClient = useQueryClient();

  return useMutation((roleData: UserRoleFormDto) => roleEndpoints.removeUserRole(roleData), {
    onSuccess: (_, variables) => {
      // Invalidate user roles query
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.roles(variables.userId),
      });

      // Invalidate user details if cached
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.detail(variables.userId),
      });

      // Invalidate user lists to refresh role information
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.lists(),
      });

      // If this is the current user, invalidate privileges
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.privileges(),
      });
    },
    onError: (error: any) => {
      console.error('Failed to remove user role:', roleErrorHandler.handleRemovalError(error));
    },
  });
}
