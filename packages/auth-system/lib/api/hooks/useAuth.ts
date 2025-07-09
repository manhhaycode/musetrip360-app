/**
 * @fileoverview Authentication React Query Hooks
 *
 * React Query hooks for authentication operations including login, register,
 * logout, and token management.
 */

import { useQuery, useMutation, useQueryClient, CustomMutationOptions, APIError } from '@musetrip360/query-foundation';
import { authEndpoints, authErrorHandler } from '../endpoints/auth';
import type { LoginReq, RegisterReq, RefreshReq, LoginResponse, VerifyOTPChangePassword } from '@/types';
import { authCacheKeys } from '../cache/cacheKeys';
import { useAuthStore } from '@/state';
import { AuthToken } from '@/domain';

/**
 * Hook for user login
 */
export function useLogin(options?: CustomMutationOptions<LoginResponse, APIError, LoginReq, unknown>) {
  return useMutation((loginData: LoginReq) => authEndpoints.instance.login(loginData), {
    onSuccess: ({ data: authResponse }: LoginResponse) => {
      useAuthStore
        .getState()
        .setAccessToken(
          AuthToken.createAccessToken(authResponse.accessToken, authResponse.userId, authResponse.accessTokenExpAt)
        );
      useAuthStore
        .getState()
        .setRefreshToken(
          AuthToken.createRefreshToken(authResponse.refreshToken, authResponse.userId, authResponse.refreshTokenExpAt)
        );
      useAuthStore.getState().setIsAuthenticated(true);
    },
    onError: (error: any) => {
      console.error('Login failed:', authErrorHandler.handleLoginError(error));
    },
    ...options,
  });
}

/**
 * Hook for user registration
 */
export function useRegister(options?: CustomMutationOptions<LoginResponse, APIError, RegisterReq, unknown>) {
  return useMutation((registerData: RegisterReq) => authEndpoints.instance.register(registerData), {
    ...options,
  });
}

/**
 * Hook for token refresh
 */
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation((refreshData: RefreshReq) => authEndpoints.instance.refreshToken(refreshData), {
    onSuccess: ({ data: authResponse }: LoginResponse, { userId }) => {
      useAuthStore
        .getState()
        .setAccessToken(AuthToken.createAccessToken(authResponse.accessToken, userId, authResponse.accessTokenExpAt));
    },
    onError: (error: any) => {
      console.error('Token refresh failed:', authErrorHandler.handleRefreshError(error));
      // Clear invalid tokens
      queryClient.removeQueries({ queryKey: authCacheKeys.tokens() });
      queryClient.removeQueries({ queryKey: authCacheKeys.currentUser() });
    },
  });
}

/**
 * Hook for token verification
 */
export function useVerifyToken(token?: string) {
  return useQuery(authCacheKeys.authState(), () => authEndpoints.instance.verifyToken(token), {
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation(() => authEndpoints.instance.logout(), {
    onSuccess: () => {
      // Clear all authentication-related cache
      queryClient.removeQueries({ queryKey: authCacheKeys.currentUser() });
      queryClient.removeQueries({ queryKey: authCacheKeys.tokens() });
      queryClient.removeQueries({ queryKey: authCacheKeys.authState() });
      queryClient.removeQueries({ queryKey: authCacheKeys.permissions() });
    },
    onError: (error: any) => {
      console.error('Logout failed:', authErrorHandler.handleLogoutError(error));
      // Even if logout fails on server, clear local cache
      queryClient.clear();
    },
  });
}

/**
 * Hook to get current authenticated user
 */
export function useCurrentUser() {
  return useQuery(authCacheKeys.currentUser(), () => authEndpoints.instance.getCurrentUser(), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if user is not authenticated
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useRequestOTP(options?: CustomMutationOptions<any, APIError, string, unknown>) {
  return useMutation((email: string) => authEndpoints.instance.requestOTP(email), {
    ...options,
  });
}

export function useVerifyOTP(options?: CustomMutationOptions<any, APIError, VerifyOTPChangePassword, unknown>) {
  return useMutation(
    (otpVerifyData: VerifyOTPChangePassword) => authEndpoints.instance.verifyOTPChangePassword(otpVerifyData),
    {
      ...options,
    }
  );
}

/**
 * Combined authentication management hook
 */
export function useAuthManagement() {
  const currentUserQuery = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const refreshTokenMutation = useRefreshToken();

  const isAuthenticated = !!currentUserQuery.data;
  const isLoading = currentUserQuery.isLoading;

  return {
    // Current state
    user: currentUserQuery.data,
    isAuthenticated,
    isLoading,
    isError: currentUserQuery.isError,
    error: currentUserQuery.error,

    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    refreshToken: refreshTokenMutation.mutate,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRefreshing: refreshTokenMutation.isPending,

    // Utility functions
    refetchUser: currentUserQuery.refetch,
  };
}
