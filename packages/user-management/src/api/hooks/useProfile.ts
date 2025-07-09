/**
 * @fileoverview User Profile React Query Hooks
 *
 * React Query hooks for user profile operations including current user profile,
 * profile updates, and password changes.
 */

import { useQuery, useMutation, useQueryClient } from '@musetrip360/query-foundation';
import { profileEndpoints, profileErrorHandler } from '../endpoints/profile';
import type { UpdateProfileReq, ChangePasswordReq, UserViewModel } from '../../types';
import { userCacheKeys } from '../cache/cacheKeys';

/**
 * Hook to fetch current user profile
 */
export function useCurrentProfile() {
  return useQuery(userCacheKeys.profile(), () => profileEndpoints.getCurrentProfile());
}

/**
 * Hook to update current user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation((profileData: UpdateProfileReq) => profileEndpoints.updateProfile(profileData), {
    onSuccess: (updatedProfile: UserViewModel) => {
      // Update current profile cache
      queryClient.setQueryData<UserViewModel>(userCacheKeys.profile(), updatedProfile);

      // Update user in any lists that might contain the current user
      queryClient.setQueriesData<any>({ queryKey: userCacheKeys.lists() }, (oldData: any) => {
        if (oldData?.data) {
          return {
            ...oldData,
            data: oldData.data.map((user: UserViewModel) => (user.id === updatedProfile.id ? updatedProfile : user)),
          };
        }
        return oldData;
      });

      // Invalidate privileges in case role information changed
      queryClient.invalidateQueries({
        queryKey: userCacheKeys.privileges(),
      });
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', profileErrorHandler.handleError(error));
    },
  });
}

/**
 * Hook to change user password
 */
export function useChangePassword() {
  return useMutation((passwordData: ChangePasswordReq) => profileEndpoints.changePassword(passwordData), {
    onSuccess: () => {
      // Password change doesn't affect cached data, but might trigger re-auth
      console.log('Password changed successfully');
    },
    onError: (error: any) => {
      console.error('Failed to change password:', profileErrorHandler.handlePasswordChangeError(error));
    },
  });
}

/**
 * Hook to get current user privileges (profile-specific version)
 */
export function useCurrentUserPrivileges() {
  return useQuery(userCacheKeys.privileges(), () => profileEndpoints.getCurrentUserPrivileges());
}

/**
 * Combined hook for profile management
 */
export function useProfileManagement() {
  const profileQuery = useCurrentProfile();
  const privilegesQuery = useCurrentUserPrivileges();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  return {
    // Queries
    profile: profileQuery.data,
    privileges: privilegesQuery.data,
    isLoading: profileQuery.isLoading || privilegesQuery.isLoading,
    isError: profileQuery.isError || privilegesQuery.isError,
    error: profileQuery.error || privilegesQuery.error,

    // Mutations
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,

    // Utility functions
    refetchProfile: profileQuery.refetch,
    refetchPrivileges: privilegesQuery.refetch,
  };
}

/**
 * Hook for profile validation
 */
export function useProfileValidation() {
  const validateAndUpdate = async (
    profileData: UpdateProfileReq
  ): Promise<{
    success: boolean;
    errors?: string[];
  }> => {
    try {
      // Basic client-side validation
      const errors: string[] = [];

      if (profileData.fullName !== undefined) {
        if (profileData.fullName && profileData.fullName.trim().length < 2) {
          errors.push('Full name must be at least 2 characters long');
        }
        if (profileData.fullName && profileData.fullName.trim().length > 100) {
          errors.push('Full name must be less than 100 characters');
        }
      }

      if (profileData.phoneNumber !== undefined && profileData.phoneNumber) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(profileData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
          errors.push('Invalid phone number format');
        }
      }

      if (profileData.avatarUrl !== undefined && profileData.avatarUrl) {
        try {
          new URL(profileData.avatarUrl);
        } catch {
          errors.push('Invalid avatar URL format');
        }
      }

      if (profileData.birthDate !== undefined && profileData.birthDate) {
        const birthDate = new Date(profileData.birthDate);
        const currentDate = new Date();

        if (isNaN(birthDate.getTime())) {
          errors.push('Invalid birth date format');
        } else if (birthDate > currentDate) {
          errors.push('Birth date cannot be in the future');
        }
      }

      if (errors.length > 0) {
        return { success: false, errors };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        errors: ['Validation failed due to unexpected error'],
      };
    }
  };

  return { validateAndUpdate };
}
