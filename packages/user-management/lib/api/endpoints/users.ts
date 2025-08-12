/**
 * @fileoverview User API Endpoints
 *
 * API endpoint definitions for user management operations.
 * Integrates with the MuseTrip360 backend API as defined in swagger.json
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
  UserWithRole,
} from '@/types';
import { getHttpClient } from '@musetrip360/query-foundation';

// API Base URLs
const API_BASE = '/users';

/**
 * User API endpoints
 */
export const userEndpoints = {
  // GET /users - Get paginated list of users
  getUsers: async (params: UserSearchParams): Promise<ApiResponse<PaginatedResponse<IUser>>> => {
    const client = getHttpClient();
    const response = await client.get<ApiResponse<PaginatedResponse<IUser>>>(API_BASE, {
      params: {
        Search: params.search,
        Page: params.page,
        PageSize: params.pageSize,
      },
    });
    return response;
  },

  // GET /users/admin/{userId}/roles - Get user roles (admin)
  getUserRoles: async (userId: string): Promise<any> => {
    const client = getHttpClient();
    const response = await client.get<any>(`${API_BASE}/admin/${userId}/roles`);
    return response;
  },

  // POST /users/admin - Create user (admin)
  createUser: async (userData: UserCreateDto): Promise<ApiResponse<IUser>> => {
    const client = getHttpClient();
    console.log('Creating user with data:', userData);
    try {
      const response = await client.post<ApiResponse<IUser>>(`${API_BASE}/admin`, userData);
      console.log('Create user response:', response);
      return response;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  // PUT /users/admin/{id} - Update user (admin)
  updateUser: async (id: string, userData: UserUpdateDto): Promise<ApiResponse<IUser>> => {
    const client = getHttpClient();
    const response = await client.put<ApiResponse<IUser>>(`${API_BASE}/admin/${id}`, userData);
    return response;
  },

  // POST /users/roles - Add user role
  addUserRole: async (roleData: UserRoleFormDto): Promise<void> => {
    const client = getHttpClient();
    await client.post(`${API_BASE}/roles`, roleData);
  },

  // DELETE /users/roles - Remove user role
  removeUserRole: async (roleData: UserRoleFormDto): Promise<void> => {
    const client = getHttpClient();
    await client.delete(`${API_BASE}/roles`, { data: roleData });
  },

  // GET /users/privileges - Get current user privileges
  getUserPrivileges: async (): Promise<any> => {
    const client = getHttpClient();
    const response = await client.get<any>(`${API_BASE}/privileges`);
    return response;
  },

  // GET /users/museum/{museumId}
  getMuseumUsers: async (
    params: UserSearchParams,
    museumId: string
  ): Promise<ApiResponse<PaginatedResponse<UserWithRole>>> => {
    const client = getHttpClient();
    const response = await client.get<ApiResponse<PaginatedResponse<UserWithRole>>>(`${API_BASE}/museum/${museumId}`, {
      params: {
        Search: params.search,
        Page: params.page,
        PageSize: params.pageSize,
      },
    });
    return response;
  },
} as const;

/**
 * Admin-specific user endpoints
 */
export const adminUserEndpoints = {
  // GET /users - Get all users for admin (with additional filters)
  getAllUsers: async (params: UserAdminSearchParams): Promise<ApiResponse<PaginatedResponse<IUser>>> => {
    const client = getHttpClient();

    const requestParams = {
      IsActive: params.isActive,
      Search: params.search,
      Page: params.page,
      PageSize: params.pageSize,
    };

    const response = await client.get<ApiResponse<PaginatedResponse<IUser>>>(API_BASE, {
      params: requestParams,
    });
    return response;
  },

  // POST /users/admin - Create new user (admin)
  createUser: async (data: UserCreateDto): Promise<ApiResponse<IUser>> => {
    const client = getHttpClient();
    const response = await client.post<ApiResponse<IUser>>(`${API_BASE}/admin`, data);
    return response;
  },

  // PUT /users/admin/{id} - Update user (admin)
  updateUser: async (id: string, data: Partial<UserCreateDto>): Promise<ApiResponse<IUser>> => {
    const client = getHttpClient();
    const response = await client.put<ApiResponse<IUser>>(`${API_BASE}/admin/${id}`, data);
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
};
