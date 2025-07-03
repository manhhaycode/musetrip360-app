/**
 * @fileoverview Roles API Endpoints
 *
 * API endpoints for role and permission management operations.
 * Handles role assignment, removal, and permission checking.
 */

import { getHttpClient } from '@musetrip360/query-foundation';
import type { UserRoleFormDto, UserPermissions } from '../../types';
import { Role } from '../../domain';

// API Base URLs
const ROLES_API_BASE = '/api/v1/users/roles';
const ADMIN_API_BASE = '/api/v1/users/admin';

/**
 * Role management API endpoints
 */
export const roleEndpoints = {
  // POST /api/v1/users/roles - Add role to user
  addUserRole: async (roleData: UserRoleFormDto): Promise<void> => {
    const client = getHttpClient();
    await client.post(ROLES_API_BASE, roleData);
  },

  // DELETE /api/v1/users/roles - Remove role from user
  removeUserRole: async (roleData: UserRoleFormDto): Promise<void> => {
    const client = getHttpClient();
    await client.delete(ROLES_API_BASE, { data: roleData });
  },

  // GET /api/v1/users/admin/{userId}/roles - Get roles for specific user
  getUserRoles: async (userId: string): Promise<Role[]> => {
    const client = getHttpClient();
    const response = await client.get<Role[]>(`${ADMIN_API_BASE}/${userId}/roles`);
    return response;
  },

  // GET /api/v1/users/privileges - Get current user privileges
  getCurrentUserPrivileges: async (): Promise<UserPermissions> => {
    const client = getHttpClient();
    const response = await client.get<UserPermissions>('/api/v1/users/privileges');
    return response;
  },
} as const;

/**
 * Role validation utilities
 */
export const roleValidationUtils = {
  /**
   * Validate role form data
   */
  validateRoleForm: (data: UserRoleFormDto): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.userId) {
      errors.push('User ID is required');
    } else if (!isValidUUID(data.userId)) {
      errors.push('Invalid user ID format');
    }

    if (!data.roleId) {
      errors.push('Role ID is required');
    } else if (!isValidUUID(data.roleId)) {
      errors.push('Invalid role ID format');
    }

    if (data.museumId && !isValidUUID(data.museumId)) {
      errors.push('Invalid museum ID format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Check if user has specific permission
   */
  hasPermission: (userPermissions: UserPermissions, permission: string): boolean => {
    return userPermissions.permissions.some((p) => p.name === permission);
  },

  /**
   * Check if user has admin access
   */
  hasAdminAccess: (userPermissions: UserPermissions): boolean => {
    return userPermissions.canAccessAdmin;
  },

  /**
   * Check if user can manage museums
   */
  canManageMuseums: (userPermissions: UserPermissions): boolean => {
    return userPermissions.canManageMuseum;
  },

  /**
   * Check if user can manage events
   */
  canManageEvents: (userPermissions: UserPermissions): boolean => {
    return userPermissions.canManageEvents;
  },

  /**
   * Check if user can manage other users
   */
  canManageUsers: (userPermissions: UserPermissions): boolean => {
    return userPermissions.canManageUsers;
  },

  /**
   * Get user roles by name
   */
  getRolesByName: (userPermissions: UserPermissions): string[] => {
    return userPermissions.roles.map((role) => role.name);
  },

  /**
   * Check if user has specific role
   */
  hasRole: (userPermissions: UserPermissions, roleName: string): boolean => {
    return userPermissions.roles.some((role) => role.name === roleName);
  },
};

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

/**
 * Permission constants for easier reference
 */
export const PERMISSIONS = {
  // Museum permissions
  MUSEUM_VIEW: 'museum.view',
  MUSEUM_CREATE: 'museum.create',
  MUSEUM_UPDATE: 'museum.update',
  MUSEUM_DELETE: 'museum.delete',
  MUSEUM_MANAGE: 'museum.manage',

  // Event permissions
  EVENT_VIEW: 'event.view',
  EVENT_CREATE: 'event.create',
  EVENT_UPDATE: 'event.update',
  EVENT_DELETE: 'event.delete',
  EVENT_MANAGE: 'event.manage',

  // User permissions
  USER_VIEW: 'user.view',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_MANAGE: 'user.manage',

  // System permissions
  SYSTEM_ADMIN: 'system.admin',
  SYSTEM_CONFIG: 'system.config',
} as const;

/**
 * Common role names
 */
export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MUSEUM_MANAGER: 'Museum Manager',
  EVENT_ORGANIZER: 'Event Organizer',
  STAFF: 'Staff',
  USER: 'User',
} as const;

/**
 * Utility function to validate UUID format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
