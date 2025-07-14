/**
 * @fileoverview User Profile API Endpoints
 *
 * API endpoints for user profile management operations.
 * Handles current user profile operations and password changes.
 */

import { getHttpClient } from '@musetrip360/query-foundation';
import type { UpdateProfileReq, ChangePasswordReq, IUser } from '@/types';

// API Base URLs
const PROFILE_API_BASE = '/users/profile';

/**
 * User profile API endpoints
 */
export const profileEndpoints = {
  // GET /api/v1/users/profile - Get current user profile
  getCurrentProfile: async (): Promise<IUser> => {
    const client = getHttpClient();
    const response = await client.get<IUser>(PROFILE_API_BASE);
    return response;
  },

  // PUT /api/v1/users/profile - Update current user profile
  updateProfile: async (profileData: UpdateProfileReq): Promise<IUser> => {
    const client = getHttpClient();
    const response = await client.put<IUser>(PROFILE_API_BASE, profileData);
    return response;
  },

  // PUT /api/v1/users/profile/change-password - Change user password
  changePassword: async (passwordData: ChangePasswordReq): Promise<void> => {
    const client = getHttpClient();
    await client.put(`${PROFILE_API_BASE}/change-password`, passwordData);
  },

  // GET /api/v1/users/privileges - Get current user privileges
  getCurrentUserPrivileges: async (): Promise<any> => {
    const client = getHttpClient();
    const response = await client.get<any>('/users/privileges');
    return response;
  },
} as const;

/**
 * Profile-specific error handling
 */
export const profileErrorHandler = {
  /**
   * Handle profile API errors
   */
  handleError: (error: any): string => {
    if (error.response?.status === 401) {
      return 'You must be logged in to access your profile';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to update this profile';
    }
    if (error.response?.status === 400) {
      return error.response?.data?.message || 'Invalid profile data provided';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Failed to update profile. Please try again.';
  },

  /**
   * Handle password change errors
   */
  handlePasswordChangeError: (error: any): string => {
    if (error.response?.status === 401) {
      return 'Current password is incorrect';
    }
    if (error.response?.status === 400) {
      return error.response?.data?.message || 'Invalid password data provided';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Failed to change password. Please try again.';
  },
};
