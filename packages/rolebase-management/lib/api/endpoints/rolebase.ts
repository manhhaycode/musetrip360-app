import { PaginatedResponse, Pagination } from '@musetrip360/query-foundation';
/**
 * @fileoverview Museum Rolebase Endpoints
 *
 * API endpoints for museum search operations.
 */

import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';
import {
  Role,
  Permission,
  UserPrivilege,
  CreateRole,
  UpdateRole,
  UpdateRolePermissions,
  UpdatePermission,
  CreatePermission,
} from '@/types';

/**
 * AI API endpoints configuration
 */
export const rolebaseEndpoints = {
  getRoles: '/rolebase/roles',
  getRoleById: (roleId: string) => `/rolebase/roles/${roleId}`,
  createRole: '/rolebase/roles',
  getPermissions: '/rolebase/permissions',
  getPermissionById: (permissionId: string) => `/rolebase/permissions/${permissionId}`,
  createPermission: '/rolebase/permissions',
  updatePermissionById: (permissionId: string) => `/rolebase/permissions/${permissionId}`,
  deletePermissionById: (permissionId: string) => `/rolebase/permissions/${permissionId}`,
  getUserPrivileges: '/users/privileges',
  updateRoleById: (roleId: string) => `/rolebase/roles/${roleId}`,
  updateRolePermissions: (roleId: string) => `/rolebase/roles/${roleId}/permissions`,
} as const;

export const getRoles = async (params: Pagination) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Role>>>(rolebaseEndpoints.getRoles, { params });
  return response.data;
};

export const getRoleById = async (roleId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Role>>(rolebaseEndpoints.getRoleById(roleId));
  return response.data;
};

export const createRole = async (data: CreateRole) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<Role>>(rolebaseEndpoints.createRole, data);
  return response.data;
};

export const getPermissions = async (params: Pagination) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Permission>>>(rolebaseEndpoints.getPermissions, {
    params,
  });
  return response.data;
};

export const getPermissionById = async (permissionId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Permission>>(rolebaseEndpoints.getPermissionById(permissionId));
  return response.data;
};

export const createPermission = async (data: CreatePermission) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<Permission>>(rolebaseEndpoints.createPermission, data);
  return response.data;
};

export const updatePermissionById = async (permissionId: string, data: UpdatePermission) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Permission>>(
    rolebaseEndpoints.updatePermissionById(permissionId),
    data
  );
  return response.data;
};

export const deletePermissionById = async (permissionId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.delete<APIResponse<void>>(rolebaseEndpoints.deletePermissionById(permissionId));
  return response.data;
};

export const getUserPrivileges = async () => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<UserPrivilege>>(rolebaseEndpoints.getUserPrivileges);
  return response.data;
};
export const updateRoleById = async (roleId: string, data: UpdateRole) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Role>>(rolebaseEndpoints.updateRoleById(roleId), data);
  return response.data;
};

export const updateRolePermissions = async (roleId: string, data: UpdateRolePermissions) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Role>>(rolebaseEndpoints.updateRolePermissions(roleId), data);
  return response.data;
};

/**
 * AI search error handler
 */
export const rolebaseErrorHandler = {
  handleSearchError: (error: any): string => {
    if (error.response?.status === 400) {
      return 'Invalid search parameters. Please check your input.';
    }
    if (error.response?.status === 404) {
      return 'No museums found matching your criteria.';
    }
    if (error.response?.status === 500) {
      return 'Server error occurred while searching museums. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
  },

  handleGetError: (error: any): string => {
    if (error.response?.status === 404) {
      return 'Record not found.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to access this Record.';
    }
    return 'An error occurred while loading the Record. Please try again.';
  },
};
