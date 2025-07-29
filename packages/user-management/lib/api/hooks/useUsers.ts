/**
 * @fileoverview User Management React Query Hooks
 *
 * React Query hooks for user management operations including queries and mutations.
 * Integrates with the query-foundation package for consistent caching and offline support.
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, CustomMutationOptions, APIError } from '@musetrip360/query-foundation';
import { userEndpoints, adminUserEndpoints, userApiErrorHandler } from '../endpoints/users';
import type {
  UserAdminSearchParams,
  UserCreateDto,
  UserUpdateDto,
  IUser,
  PaginatedResponse,
  UserRoleFormDto,
  UserSearchParams,
} from '@/types';
import { userCacheKeys } from '../cache/cacheKeys';

/**
 * Hook to fetch all users for admin (with additional filters)
 */
export function useAdminUsers(params: UserAdminSearchParams) {
  return useQuery(userCacheKeys.list(params), () => adminUserEndpoints.getAllUsers(params));
}

/**
 * Hook to fetch user roles
 */
export function useUserRoles(userId: string) {
  return useQuery(userCacheKeys.roles(userId), () => userEndpoints.getUserRoles(userId));
}

/**
 * Hook to fetch users for a museum
 */
export function useMuseumUsers(params: UserSearchParams, museumId: string) {
  return useQuery(userCacheKeys.museumUsers(museumId), () => userEndpoints.getMuseumUsers(params, museumId));
}

/**
 * Hook to create a new user (admin only)
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation((userData: UserCreateDto) => userEndpoints.createUser(userData), {
    onSuccess: () => {
      // Invalidate users list to refetch with new user
      queryClient.invalidateQueries({ queryKey: userCacheKeys.lists() });
    },
    onError: (error: any) => {
      console.error('Failed to create user:', userApiErrorHandler.handleError(error));
    },
  });
}

/**
 * Hook to update a user (admin only)
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, userData }: { id: string; userData: UserUpdateDto }) => userEndpoints.updateUser(id, userData),
    {
      onSuccess: (updatedUser: IUser) => {
        // Update user in all relevant queries
        queryClient.setQueryData<IUser>(userCacheKeys.detail(updatedUser.id), updatedUser);

        // Update user in lists
        queryClient.setQueriesData<PaginatedResponse<IUser>>({ queryKey: userCacheKeys.lists() }, (oldData) => {
          if (oldData) {
            return {
              ...oldData,
              data: oldData.data.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
            };
          }
          return oldData;
        });
      },
      onError: (error: any) => {
        console.error('Failed to update user:', userApiErrorHandler.handleError(error));
      },
    }
  );
}

/**
 * Hook to add a role to a user
 */
export function useAddUserRole(options?: CustomMutationOptions<unknown, APIError, Partial<UserRoleFormDto>>) {
  const queryClient = useQueryClient();

  return useMutation((roleData: UserRoleFormDto) => userEndpoints.addUserRole(roleData), {
    onSuccess: (_, variables, context) => {
      if (options) {
        options.onSuccess?.(_, variables, context);
      }
      // Invalidate user permissions query
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.privileges(),
      });

      // Invalidate user details if cached
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.detail(variables.userId),
      });

      // Invalidate user lists to refresh role information
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.lists(),
      });
    },
    onError: (error: any, variables, context) => {
      console.error('Failed to add user role:', userApiErrorHandler.handleError(error));
      if (options) {
        options.onError?.(error, variables, context);
      }
    },
  });
}

/**
 * Hook to remove a role from a user
 */
export function useRemoveUserRole(options?: CustomMutationOptions<unknown, APIError, Partial<UserRoleFormDto>>) {
  const queryClient = useQueryClient();

  return useMutation((roleData: UserRoleFormDto) => userEndpoints.removeUserRole(roleData), {
    onSuccess: (_, variables, context) => {
      if (options) {
        options.onSuccess?.(_, variables, context);
      }
      // Invalidate user permissions query
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.privileges(),
      });

      // Invalidate user details if cached
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.detail(variables.userId),
      });

      // Invalidate user lists to refresh role information
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.lists(),
      });
    },
    onError: (error: any, variables, context) => {
      console.error('Failed to remove user role:', userApiErrorHandler.handleError(error));
      if (options) {
        options.onError?.(error, variables, context);
      }
    },
  });
}

/**
 * Hook to get current user privileges
 */
export function useUserPrivileges() {
  return useQuery(userCacheKeys.privileges(), () => userEndpoints.getUserPrivileges());
}

/**
 * Hook for bulk user operations (utility hook)
 */
export function useBulkUserOperations() {
  const queryClient = useQueryClient();

  return useMutation(
    async (operations: Array<{ operation: 'delete' | 'activate' | 'deactivate'; userId: string }>) => {
      const promises = operations.map(({ operation, userId }) => {
        switch (operation) {
          case 'activate':
            return userEndpoints.updateUser(userId, { isActive: true });
          case 'deactivate':
            return userEndpoints.updateUser(userId, { isActive: false });
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      });

      const responses = await Promise.all(promises);
      return responses.map((response: any) => response.data);
    },
    {
      onSuccess: () => {
        // Invalidate all user-related queries after bulk operations
        queryClient.invalidateQueries({ queryKey: userCacheKeys.lists() });
        queryClient.invalidateQueries({ queryKey: userCacheKeys.profile() });
      },
    }
  );
}

/**
 * Hook for bulk role assignments
 */
export function useBulkRoleAssignment() {
  const queryClient = useQueryClient();

  return useMutation(
    async (assignments: UserRoleFormDto[]) => {
      const promises = assignments.map((roleData) => userEndpoints.addUserRole(roleData));
      const responses = await Promise.all(promises);
      return responses.map((response: any) => response.data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: userCacheKeys.lists() });
        queryClient.invalidateQueries({ queryKey: userCacheKeys.privileges() });
      },
    }
  );
}

/**
 * Hook for searching users with debounced search term
 */
export function useUserSearch(searchTerm: string, delay: number = 300) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return useQuery(userCacheKeys.search(debouncedSearchTerm), () =>
    userEndpoints.getUsers({ search: debouncedSearchTerm })
  );
}
