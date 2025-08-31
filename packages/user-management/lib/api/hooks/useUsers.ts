/**
 * @fileoverview User Management React Query Hooks
 *
 * React Query hooks for user management operations including queries and mutations.
 * Integrates with the query-foundation package for consistent caching and offline support.
 */

import type {
  ApiResponse,
  IUser,
  PaginatedResponse,
  UserAdminSearchParams,
  UserCreateDto,
  UserRoleFormDto,
  UserSearchParams,
  UserUpdateDto,
} from '@/types';
import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@musetrip360/query-foundation';
import { useEffect, useState } from 'react';
import { userCacheKeys } from '../cache/cacheKeys';
import { adminUserEndpoints, userApiErrorHandler, userEndpoints } from '../endpoints/users';

/**
 * Hook to fetch all users for admin (with additional filters)
 */
export function useAdminUsers(
  params: UserAdminSearchParams,
  options?: CustomQueryOptions<ApiResponse<PaginatedResponse<IUser>>>
) {
  return useQuery(userCacheKeys.list(params), () => adminUserEndpoints.getAllUsers(params), {
    placeholderData: (previousData: ApiResponse<PaginatedResponse<IUser>> | undefined) => previousData,
    ...options,
  });
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
export function useCreateUser(options?: CustomMutationOptions<ApiResponse<IUser>, APIError, UserCreateDto>) {
  const queryClient = useQueryClient();

  return useMutation((userData: UserCreateDto) => userEndpoints.createUser(userData), {
    onSuccess: (data, variables, context) => {
      // Invalidate users list to refetch with new user
      queryClient.removeQueries({ queryKey: userCacheKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const errorMessage = userApiErrorHandler.handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
}

/**
 * Hook to update a user (admin only)
 */
export function useUpdateUser(
  options?: CustomMutationOptions<ApiResponse<IUser>, APIError, { id: string; userData: UserUpdateDto }>
) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, userData }: { id: string; userData: UserUpdateDto }) => userEndpoints.updateUser(id, userData),
    {
      onSuccess: (response, variables, context) => {
        const updatedUser = response.data;
        if (updatedUser) {
          // Update user in all relevant queries
          queryClient.setQueryData<IUser>(userCacheKeys.detail(updatedUser.id), updatedUser);

          // Update user in lists
          queryClient.setQueriesData<ApiResponse<PaginatedResponse<IUser>>>(
            { queryKey: userCacheKeys.lists() },
            (oldData) => {
              if (oldData?.data?.data) {
                return {
                  ...oldData,
                  data: {
                    ...oldData.data,
                    data: oldData.data.data.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
                  },
                };
              }
              return oldData;
            }
          );
        }
        options?.onSuccess?.(response, variables, context);
      },
      onError: (error: any, variables, context) => {
        const errorMessage = userApiErrorHandler.handleError(error);
        options?.onError?.(error, variables, context);
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
      queryClient.removeQueries({
        queryKey: userCacheKeys.privileges(),
      });

      // Invalidate user details if cached
      queryClient.removeQueries({
        queryKey: userCacheKeys.detail(variables.userId),
      });

      // Invalidate user lists to refresh role information
      queryClient.removeQueries({
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
      queryClient.removeQueries({
        queryKey: userCacheKeys.privileges(),
      });

      // Invalidate user details if cached
      queryClient.removeQueries({
        queryKey: userCacheKeys.detail(variables.userId),
      });

      // Invalidate user lists to refresh role information
      queryClient.removeQueries({
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
        queryClient.removeQueries({ queryKey: userCacheKeys.lists() });
        queryClient.removeQueries({ queryKey: userCacheKeys.profile() });
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
        queryClient.removeQueries({ queryKey: userCacheKeys.lists() });
        queryClient.removeQueries({ queryKey: userCacheKeys.privileges() });
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
