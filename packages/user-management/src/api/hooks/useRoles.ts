/**
 * @fileoverview Role Management React Query Hooks
 *
 * React Query hooks for role and permission management operations.
 */

import { useQuery, useMutation, useQueryClient } from '@musetrip360/query-foundation';
import { roleEndpoints, roleErrorHandler, roleValidationUtils } from '../endpoints/roles';
import type { UserRoleFormDto, UserPermissions } from '../../types';
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

/**
 * Combined hook for role management operations
 */
export function useRoleManagement(userId?: string) {
  const userRolesQuery = useUserRoles(userId || '');
  const privilegesQuery = useCurrentUserPrivileges();
  const addRoleMutation = useAddUserRole();
  const removeRoleMutation = useRemoveUserRole();

  return {
    // Queries
    userRoles: userRolesQuery.data,
    currentPrivileges: privilegesQuery.data,
    isLoading: userRolesQuery.isLoading || privilegesQuery.isLoading,
    isError: userRolesQuery.isError || privilegesQuery.isError,
    error: userRolesQuery.error || privilegesQuery.error,

    // Mutations
    addRole: addRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    isAddingRole: addRoleMutation.isPending,
    isRemovingRole: removeRoleMutation.isPending,

    // Utility functions
    refetchUserRoles: userRolesQuery.refetch,
    refetchPrivileges: privilegesQuery.refetch,

    // Permission checks
    hasPermission: (permission: string) =>
      privilegesQuery.data ? roleValidationUtils.hasPermission(privilegesQuery.data, permission) : false,
    hasAdminAccess: () => (privilegesQuery.data ? roleValidationUtils.hasAdminAccess(privilegesQuery.data) : false),
    canManageMuseums: () => (privilegesQuery.data ? roleValidationUtils.canManageMuseums(privilegesQuery.data) : false),
    canManageEvents: () => (privilegesQuery.data ? roleValidationUtils.canManageEvents(privilegesQuery.data) : false),
    canManageUsers: () => (privilegesQuery.data ? roleValidationUtils.canManageUsers(privilegesQuery.data) : false),
    hasRole: (roleName: string) =>
      privilegesQuery.data ? roleValidationUtils.hasRole(privilegesQuery.data, roleName) : false,
  };
}

/**
 * Hook for role validation with real-time feedback
 */
export function useRoleValidation() {
  const validateRoleAssignment = (
    roleData: UserRoleFormDto
  ): {
    isValid: boolean;
    errors: string[];
  } => {
    return roleValidationUtils.validateRoleForm(roleData);
  };

  const canAssignRole = (currentPrivileges: UserPermissions | undefined, targetRoleName: string): boolean => {
    if (!currentPrivileges) return false;

    // Super admins can assign any role
    if (roleValidationUtils.hasAdminAccess(currentPrivileges)) {
      return true;
    }

    // Museum managers can assign staff and user roles
    if (roleValidationUtils.canManageUsers(currentPrivileges)) {
      const allowedRoles = ['Staff', 'User'];
      return allowedRoles.includes(targetRoleName);
    }

    return false;
  };

  const canRemoveRole = (
    currentPrivileges: UserPermissions | undefined,
    targetRoleName: string,
    isOwnRole: boolean = false
  ): boolean => {
    if (!currentPrivileges) return false;

    // Users cannot remove their own essential roles
    if (isOwnRole && ['Super Admin', 'Admin'].includes(targetRoleName)) {
      return false;
    }

    // Super admins can remove any role (except their own essential ones)
    if (roleValidationUtils.hasAdminAccess(currentPrivileges) && !isOwnRole) {
      return true;
    }

    // Museum managers can remove staff and user roles
    if (roleValidationUtils.canManageUsers(currentPrivileges) && !isOwnRole) {
      const allowedRoles = ['Staff', 'User'];
      return allowedRoles.includes(targetRoleName);
    }

    return false;
  };

  return {
    validateRoleAssignment,
    canAssignRole,
    canRemoveRole,
  };
}
