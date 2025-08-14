// Rolebase management hooks
import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  PaginatedResponse,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';

import {
  Role,
  Permission,
  UserPrivilege,
  CreateRole,
  UpdateRole,
  CreatePermission,
  UpdatePermission,
  UpdateRolePermissions,
} from '@/types';
import { Pagination } from '@musetrip360/query-foundation';

import {
  getRoles,
  getRoleById,
  createRole,
  getPermissions,
  getPermissionById,
  createPermission,
  updatePermissionById,
  deletePermissionById,
  getUserPrivileges,
  updateRoleById,
  updateRolePermissions,
} from '../endpoints';

import { rolebaseManagementCacheKeys } from '../cache/cacheKeys';

export function useGetRoles(params: Pagination, options?: CustomQueryOptions<PaginatedResponse<Role>>) {
  return useQuery([rolebaseManagementCacheKeys.roles(params)], () => getRoles(params), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useGetRoleById(roleId: string, options?: CustomQueryOptions<Role>) {
  return useQuery([rolebaseManagementCacheKeys.role(roleId)], () => getRoleById(roleId), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useCreateRole(options?: CustomMutationOptions<Role, APIError, CreateRole>) {
  return useMutation((data: CreateRole) => createRole(data), options);
}

export function useUpdateRole(options?: CustomMutationOptions<Role, APIError, UpdateRole & { roleId: string }>) {
  return useMutation((data: UpdateRole & { roleId: string }) => updateRoleById(data.roleId, data), options);
}

export function useGetPermissions(params: Pagination, options?: CustomQueryOptions<PaginatedResponse<Permission>>) {
  return useQuery([rolebaseManagementCacheKeys.permissions(params)], () => getPermissions(params), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useGetPermissionById(permissionId: string, options?: CustomQueryOptions<Permission>) {
  return useQuery([rolebaseManagementCacheKeys.permission(permissionId)], () => getPermissionById(permissionId), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useCreatePermission(options?: CustomMutationOptions<Permission, APIError, CreatePermission>) {
  return useMutation((data: CreatePermission) => createPermission(data), options);
}

export function useUpdatePermission(
  options?: CustomMutationOptions<Permission, APIError, UpdatePermission & { permissionId: string }>
) {
  return useMutation(
    (data: UpdatePermission & { permissionId: string }) => updatePermissionById(data.permissionId, data),
    options
  );
}

export function useDeletePermission(options?: CustomMutationOptions<void, APIError, string>) {
  return useMutation((permissionId: string) => deletePermissionById(permissionId), options);
}

export function useGetUserPrivileges(options?: CustomQueryOptions<UserPrivilege>) {
  return useQuery([rolebaseManagementCacheKeys.userPrivileges()], () => getUserPrivileges(), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useUpdateRolePermissions(
  options?: CustomMutationOptions<Role, APIError, UpdateRolePermissions & { roleId: string }>
) {
  return useMutation(
    (data: UpdateRolePermissions & { roleId: string }) => updateRolePermissions(data.roleId, data),
    options
  );
}
