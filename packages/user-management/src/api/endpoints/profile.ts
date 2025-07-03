/**
 * @fileoverview User Profile API Endpoints
 *
 * API endpoints for user profile management operations.
 * Handles current user profile operations and password changes.
 */

import { getHttpClient } from '@musetrip360/query-foundation';
import type { UpdateProfileReq, ChangePasswordReq, UserViewModel, UserPermissions } from '../../types';

// API Base URLs
const PROFILE_API_BASE = '/api/v1/users/profile';

/**
 * User profile API endpoints
 */
export const profileEndpoints = {
  // GET /api/v1/users/profile - Get current user profile
  getCurrentProfile: async (): Promise<UserViewModel> => {
    const client = getHttpClient();
    const response = await client.get<UserViewModel>(PROFILE_API_BASE);
    return response;
  },

  // PUT /api/v1/users/profile - Update current user profile
  updateProfile: async (profileData: UpdateProfileReq): Promise<UserViewModel> => {
    const client = getHttpClient();
    const response = await client.put<UserViewModel>(PROFILE_API_BASE, profileData);
    return response;
  },

  // PUT /api/v1/users/profile/change-password - Change user password
  changePassword: async (passwordData: ChangePasswordReq): Promise<void> => {
    const client = getHttpClient();
    await client.put(`${PROFILE_API_BASE}/change-password`, passwordData);
  },

  // GET /api/v1/users/privileges - Get current user privileges
  getCurrentUserPrivileges: async (): Promise<UserPermissions> => {
    const client = getHttpClient();
    const response = await client.get<UserPermissions>('/api/v1/users/privileges');
    return response;
  },
} as const;

/**
 * Profile validation utilities
 */
export const profileValidationUtils = {
  /**
   * Validate profile update data
   */
  validateProfileData: (data: UpdateProfileReq): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validate full name
    if (data.fullName !== undefined) {
      if (data.fullName && data.fullName.trim().length < 2) {
        errors.push('Full name must be at least 2 characters long');
      }
      if (data.fullName && data.fullName.trim().length > 100) {
        errors.push('Full name must be less than 100 characters');
      }
    }

    // Validate phone number format (basic validation)
    if (data.phoneNumber !== undefined && data.phoneNumber) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(data.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
        errors.push('Invalid phone number format');
      }
    }

    // Validate avatar URL
    if (data.avatarUrl !== undefined && data.avatarUrl) {
      try {
        new URL(data.avatarUrl);
      } catch {
        errors.push('Invalid avatar URL format');
      }
    }

    // Validate birth date
    if (data.birthDate !== undefined && data.birthDate) {
      const birthDate = new Date(data.birthDate);
      const currentDate = new Date();
      const hundredYearsAgo = new Date();
      hundredYearsAgo.setFullYear(currentDate.getFullYear() - 100);

      if (isNaN(birthDate.getTime())) {
        errors.push('Invalid birth date format');
      } else if (birthDate > currentDate) {
        errors.push('Birth date cannot be in the future');
      } else if (birthDate < hundredYearsAgo) {
        errors.push('Birth date cannot be more than 100 years ago');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate password change data
   */
  validatePasswordChange: (data: ChangePasswordReq): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.oldPassword) {
      errors.push('Current password is required');
    }

    if (!data.newPassword) {
      errors.push('New password is required');
    } else {
      // Basic password strength validation
      if (data.newPassword.length < 8) {
        errors.push('New password must be at least 8 characters long');
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.newPassword)) {
        errors.push('New password must contain at least one uppercase letter, one lowercase letter, and one number');
      }
    }

    if (data.oldPassword && data.newPassword && data.oldPassword === data.newPassword) {
      errors.push('New password must be different from current password');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

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
