/**
 * @fileoverview Authentication React Query Hooks
 *
 * React Query hooks for authentication operations including login, register,
 * logout, and token management.
 */

import { useMutation, useQueryClient, CustomMutationOptions, APIError } from '@musetrip360/query-foundation';
import { AuthEndpoints, authErrorHandler } from '../endpoints/auth';
import {
  type LoginReq,
  type RegisterReq,
  type RefreshReq,
  type LoginResponse,
  type VerifyOTPChangePassword,
  type LoginWithGoogleReq,
  AuthTypeEnum,
} from '@/types';
import { authCacheKeys } from '../cache';
import { useAuthStore } from '@/state';

/**
 * Hook for user login
 */
export function useLogin(options?: CustomMutationOptions<LoginResponse, APIError, LoginReq, unknown>) {
  const { onSuccess, ...optionMutate } = options || {};
  return useMutation((loginData: LoginReq) => AuthEndpoints.login(loginData), {
    mutationKey: authCacheKeys.login(),
    onSuccess: (...data) => {
      const authResponse = data[0].data;
      if (data[1].authType !== AuthTypeEnum.Email) {
        return onSuccess?.(...data);
      } else if ('accessToken' in authResponse && 'refreshToken' in authResponse) {
        useAuthStore.getState().login(
          {
            accessToken: {
              token: authResponse.accessToken,
              expiresAt: authResponse.accessTokenExpAt * 1000,
              type: 'access',
            },
            refreshToken: {
              token: authResponse.refreshToken,
              expiresAt: authResponse.refreshTokenExpAt * 1000,
              type: 'refresh',
            },
          },
          authResponse.userId
        );
      }
      return onSuccess?.(...data);
    },
    ...optionMutate,
  });
}

export function useLoginWithGoogle(
  options?: CustomMutationOptions<LoginResponse, APIError, LoginWithGoogleReq, unknown>
) {
  return useMutation((loginData: LoginWithGoogleReq) => AuthEndpoints.loginWithGoogle(loginData), {
    ...options,
  });
}

/**
 * Hook for user registration
 */
export function useRegister(options?: CustomMutationOptions<LoginResponse, APIError, RegisterReq, unknown>) {
  return useMutation((registerData: RegisterReq) => AuthEndpoints.register(registerData), {
    ...options,
  });
}

/**
 * Hook for token refresh
 */
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation((refreshData: RefreshReq) => AuthEndpoints.refreshToken(refreshData), {
    onSuccess: ({ data: authResponse }: LoginResponse) => {
      if ('accessToken' in authResponse && 'refreshToken' in authResponse) {
        useAuthStore.getState().setAccessToken({
          token: authResponse.accessToken,
          expiresAt: authResponse.accessTokenExpAt * 1000,
          type: 'access',
        });
      }
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
export function useVerifyToken(options?: CustomMutationOptions<LoginResponse, APIError, string, unknown>) {
  const { onSuccess, ...optionMutate } = options || {};
  return useMutation((token: string) => AuthEndpoints.verifyToken(token), {
    onSuccess: (...data) => {
      const authResponse = data[0].data;
      if ('accessToken' in authResponse && 'refreshToken' in authResponse) {
        useAuthStore.getState().login(
          {
            accessToken: {
              token: authResponse.accessToken,
              expiresAt: authResponse.accessTokenExpAt * 1000,
              type: 'access',
            },
            refreshToken: {
              token: authResponse.refreshToken,
              expiresAt: authResponse.refreshTokenExpAt * 1000,
              type: 'refresh',
            },
          },
          authResponse.userId
        );
      }
      return onSuccess?.(...data);
    },
    ...optionMutate,
  });
}

export function useRequestOTP(options?: CustomMutationOptions<any, APIError, string, unknown>) {
  return useMutation((email: string) => AuthEndpoints.requestOTP(email), {
    ...options,
  });
}

export function useVerifyOTP(options?: CustomMutationOptions<any, APIError, VerifyOTPChangePassword, unknown>) {
  return useMutation((otpVerifyData: VerifyOTPChangePassword) => AuthEndpoints.verifyOTPChangePassword(otpVerifyData), {
    ...options,
  });
}
