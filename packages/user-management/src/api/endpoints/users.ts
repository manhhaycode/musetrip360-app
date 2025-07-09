/**
 * @fileoverview User API Endpoints
 *
 * API endpoint definitions for user management operations.
 * Integrates with the MuseTrip360 backend API as defined in swagger.json
 */

import { getHttpClient } from '@musetrip360/query-foundation';
import type {
  UserCreateDto,
  UserUpdateDto,
  UserSearchParams,
  UserAdminSearchParams,
  PaginatedResponse,
  UserViewModel,
  UserRoleFormDto,
  UserPermissions,
} from '../../types';
import { Role } from '../../domain';

// API Base URLs
const API_BASE = '/api/v1/users';

/**
 * User API endpoints
 */
export const userEndpoints = {
  // GET /api/v1/users - Get paginated list of users
  getUsers: async (params: UserSearchParams): Promise<PaginatedResponse<UserViewModel>> => {
    const client = getHttpClient();
    const response = await client.get<PaginatedResponse<UserViewModel>>(API_BASE, {
      params: {
        Search: params.search,
        Page: params.page,
        PageSize: params.pageSize,
      },
    });
    return response;
  },

  // GET /api/v1/users/admin/{userId}/roles - Get user roles (admin)
  getUserRoles: async (userId: string): Promise<Role[]> => {
    const client = getHttpClient();
    const response = await client.get<Role[]>(`${API_BASE}/admin/${userId}/roles`);
    return response;
  },

  // POST /api/v1/users/admin - Create user (admin)
  createUser: async (userData: UserCreateDto): Promise<UserViewModel> => {
    const client = getHttpClient();
    const response = await client.post<UserViewModel>(`${API_BASE}/admin`, userData);
    return response;
  },

  // PUT /api/v1/users/admin/{id} - Update user (admin)
  updateUser: async (id: string, userData: UserUpdateDto): Promise<UserViewModel> => {
    const client = getHttpClient();
    const response = await client.put<UserViewModel>(`${API_BASE}/admin/${id}`, userData);
    return response;
  },

  // POST /api/v1/users/roles - Add user role
  addUserRole: async (roleData: UserRoleFormDto): Promise<void> => {
    const client = getHttpClient();
    await client.post(`${API_BASE}/roles`, roleData);
  },

  // DELETE /api/v1/users/roles - Remove user role
  removeUserRole: async (roleData: UserRoleFormDto): Promise<void> => {
    const client = getHttpClient();
    await client.delete(`${API_BASE}/roles`, { data: roleData });
  },

  // GET /api/v1/users/privileges - Get current user privileges
  getUserPrivileges: async (): Promise<UserPermissions> => {
    const client = getHttpClient();
    const response = await client.get<UserPermissions>(`${API_BASE}/privileges`);
    return response;
  },
} as const;

/**
 * Admin-specific user endpoints
 */
export const adminUserEndpoints = {
  // GET /api/v1/users/admin - Get all users for admin (with additional filters)
  getAllUsers: async (params: UserAdminSearchParams): Promise<PaginatedResponse<UserViewModel>> => {
    const client = getHttpClient();
    const response = await client.get<PaginatedResponse<UserViewModel>>(`${API_BASE}/admin`, {
      params: {
        IsActive: params.isActive,
        SearchKeyword: params.search,
        Page: params.page,
        PageSize: params.pageSize,
      },
    });
    return response;
  },
} as const;

/**
 * User search and filtering utilities
 */
export const userSearchUtils = {
  /**
   * Build search parameters with defaults
   */
  buildSearchParams: (params: Partial<UserSearchParams> = {}): UserSearchParams => ({
    search: params.search || '',
    page: params.page || 1,
    pageSize: params.pageSize || 20,
  }),

  /**
   * Build admin search parameters with defaults
   */
  buildAdminSearchParams: (params: Partial<UserAdminSearchParams> = {}): UserAdminSearchParams => ({
    ...userSearchUtils.buildSearchParams(params),
    isActive: params.isActive,
  }),
};

/**
 * Error handling utilities for user API calls
 */
export const userApiErrorHandler = {
  /**
   * Handle common user API errors
   */
  handleError: (error: any): string => {
    if (error.response?.status === 401) {
      return 'You are not authorized to perform this action';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to access this resource';
    }
    if (error.response?.status === 404) {
      return 'User not found';
    }
    if (error.response?.status === 409) {
      return 'A user with this email already exists';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'An unexpected error occurred';
  },

  /**
   * Check if error is a validation error
   */
  isValidationError: (error: any): boolean => {
    return error.response?.status === 400;
  },

  /**
   * Extract validation errors from response
   */
  getValidationErrors: (error: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          errors[field] = messages[0];
        } else {
          errors[field] = String(messages);
        }
      });
    }
    return errors;
  },
};
