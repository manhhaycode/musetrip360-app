/**
 * @fileoverview Authentication React Query Hooks
 *
 * React Query hooks for authentication operations including login, register,
 * logout, and token management.
 */

import { useQuery, useMutation, useQueryClient } from '@musetrip360/query-foundation';
import { authEndpoints, authErrorHandler } from '../endpoints/auth';
import type { LoginReq, RegisterReq, RefreshReq, AuthResponse } from '../../types';
import { authCacheKeys } from '../cache/cacheKeys';

/**
 * Hook for user login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation((loginData: LoginReq) => authEndpoints.login(loginData), {
    onSuccess: (authResponse: AuthResponse) => {
      // Cache user data
      queryClient.setQueryData(authCacheKeys.currentUser(), authResponse.user);

      // Cache tokens
      queryClient.setQueryData(authCacheKeys.tokens(), {
        accessToken: authResponse.token,
        refreshToken: authResponse.refreshToken,
        expiresAt: Date.now() + authResponse.expiresIn * 1000,
      });
    },
    onError: (error: any) => {
      console.error('Login failed:', authErrorHandler.handleLoginError(error));
    },
  });
}

/**
 * Hook for user registration
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation((registerData: RegisterReq) => authEndpoints.register(registerData), {
    onSuccess: (authResponse: AuthResponse) => {
      // Cache user and tokens
      queryClient.setQueryData(authCacheKeys.currentUser(), authResponse.user);
      queryClient.setQueryData(authCacheKeys.tokens(), {
        accessToken: authResponse.token,
        refreshToken: authResponse.refreshToken,
        expiresAt: Date.now() + authResponse.expiresIn * 1000,
      });
    },
    onError: (error: any) => {
      console.error('Registration failed:', authErrorHandler.handleRegisterError(error));
    },
  });
}

/**
 * Hook for token refresh
 */
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation((refreshData: RefreshReq) => authEndpoints.refreshToken(refreshData), {
    onSuccess: (authResponse: AuthResponse) => {
      // Update cached tokens and user data
      queryClient.setQueryData(authCacheKeys.tokens(), {
        accessToken: authResponse.token,
        refreshToken: authResponse.refreshToken,
        expiresAt: Date.now() + authResponse.expiresIn * 1000,
      });

      queryClient.setQueryData(authCacheKeys.currentUser(), authResponse.user);
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
  return useQuery(authCacheKeys.authState(), () => authEndpoints.verifyToken(token), {
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

  return useMutation(() => authEndpoints.logout(), {
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
  return useQuery(authCacheKeys.currentUser(), () => authEndpoints.getCurrentUser(), {
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
