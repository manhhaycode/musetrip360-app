/**
 * @fileoverview Roles API Endpoints
 *
 * API endpoints for role and permission management operations.
 * Handles role assignment, removal, and permission checking.
 */

import { getHttpClient } from '@musetrip360/query-foundation';
import type { UserRoleFormDto } from '@/types';

// API Base URLs
const ROLES_API_BASE = '/users/roles';
const ADMIN_API_BASE = '/users/admin';

/**
 * Role management API endpoints
 */
export const roleEndpoints = {
  // POST /users/roles - Add role to user
  addUserRole: async (roleData: UserRoleFormDto): Promise<void> => {
    const client = getHttpClient();
    await client.post(ROLES_API_BASE, roleData);
  },

  // DELETE /users/roles - Remove role from user
  removeUserRole: async (roleData: UserRoleFormDto): Promise<void> => {
    const client = getHttpClient();
    await client.delete(ROLES_API_BASE, { data: roleData });
  },

  // GET /users/admin/{userId}/roles - Get roles for specific user
  getUserRoles: async (userId: string): Promise<any> => {
    const client = getHttpClient();
    const response = await client.get<any>(`${ADMIN_API_BASE}/${userId}/roles`);
    return response;
  },

  // GET /users/privileges - Get current user privileges
  getCurrentUserPrivileges: async (): Promise<any> => {
    const client = getHttpClient();
    const response = await client.get<any>('/users/privileges');
    return response;
  },
} as const;

/**
 * Role-specific error handling
 */
export const roleErrorHandler = {
  /**
   * Handle role management errors
   */
  handleError: (error: any): string => {
    if (error.response?.status === 401) {
      return 'You must be logged in to manage roles';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to manage user roles';
    }
    if (error.response?.status === 404) {
      return 'User or role not found';
    }
    if (error.response?.status === 409) {
      return 'User already has this role assigned';
    }
    if (error.response?.status === 400) {
      return error.response?.data?.message || 'Invalid role assignment data';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Failed to manage user roles. Please try again.';
  },

  /**
   * Handle role removal errors
   */
  handleRemovalError: (error: any): string => {
    if (error.response?.status === 404) {
      return 'User does not have this role assigned';
    }
    if (error.response?.status === 409) {
      return 'Cannot remove this role - it may be required for the user';
    }
    return roleErrorHandler.handleError(error);
  },
};
