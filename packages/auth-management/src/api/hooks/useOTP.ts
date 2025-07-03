/**
 * @fileoverview OTP React Query Hooks
 *
 * React Query hooks for OTP (One-Time Password) operations including
 * generation, verification, and status checking.
 */

import { useQuery, useMutation, useQueryClient } from '@musetrip360/query-foundation';
import { otpEndpoints, otpErrorHandler, OTP_CONSTANTS } from '../endpoints/otp';
import type { OTPRequestReq, OTPVerifyReq, OTPGenerateResponse, OTPStatusResponse } from '../../types';
import { authCacheKeys } from '../cache/cacheKeys';

/**
 * Hook to request OTP
 */
export function useRequestOTP() {
  const queryClient = useQueryClient();

  return useMutation((data: OTPRequestReq) => otpEndpoints.requestEmailOTP(data), {
    onSuccess: (response: OTPGenerateResponse, variables) => {
      // Cache OTP status
      queryClient.setQueryData(authCacheKeys.otpStatus(variables.email), {
        hasPendingOTP: true,
        expiresAt: response.expiresAt,
        canResendAt: response.canResendAt,
        attemptsRemaining: OTP_CONSTANTS.MAX_ATTEMPTS,
      });
    },
    onError: (error: any) => {
      console.error('OTP request failed:', otpErrorHandler.handleRequestError(error));
    },
  });
}

/**
 * Hook to verify OTP
 */
export function useVerifyOTP() {
  const queryClient = useQueryClient();

  return useMutation((data: OTPVerifyReq) => otpEndpoints.verifyOTP(data), {
    onSuccess: (response, variables) => {
      if (response.isValid) {
        // Clear OTP status cache on successful verification
        queryClient.removeQueries({
          queryKey: authCacheKeys.otpStatus(variables.email),
        });

        // Update verification status
        queryClient.setQueryData(
          authCacheKeys.verificationStatus(variables.type || 'email_verification', variables.email),
          { isVerified: true, verifiedAt: new Date().toISOString() }
        );
      } else {
        // Update attempts remaining
        queryClient.setQueryData(authCacheKeys.otpStatus(variables.email), (oldData: any) => {
          if (oldData) {
            return {
              ...oldData,
              attemptsRemaining: Math.max(0, (oldData.attemptsRemaining || 0) - 1),
            };
          }
          return oldData;
        });
      }
    },
    onError: (error: any) => {
      console.error('OTP verification failed:', otpErrorHandler.handleVerificationError(error));
    },
  });
}

/**
 * Hook to get OTP status
 */
export function useOTPStatus(email: string, enabled: boolean = true) {
  return useQuery(authCacheKeys.otpStatus(email), () => otpEndpoints.getOTPStatus(email), {
    enabled: enabled && !!email,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: (query) => {
      // Auto-refresh if OTP is still pending and not expired
      const data = query.state.data as OTPStatusResponse | undefined;
      if (data?.hasPendingOTP && data?.expiresAt) {
        const isExpired = new Date(data.expiresAt) <= new Date();
        return isExpired ? false : 10 * 1000; // Refresh every 10 seconds
      }
      return false;
    },
  });
}

/**
 * Hook to resend OTP
 */
export function useResendOTP() {
  const queryClient = useQueryClient();

  return useMutation((data: { email: string; type?: string }) => otpEndpoints.resendOTP(data), {
    onSuccess: (response: OTPGenerateResponse, variables) => {
      // Update OTP status with new expiration times
      queryClient.setQueryData(authCacheKeys.otpStatus(variables.email), {
        hasPendingOTP: true,
        expiresAt: response.expiresAt,
        canResendAt: response.canResendAt,
        attemptsRemaining: OTP_CONSTANTS.MAX_ATTEMPTS,
      });
    },
    onError: (error: any) => {
      console.error('OTP resend failed:', otpErrorHandler.handleRequestError(error));
    },
  });
}

/**
 * Hook to cancel OTP
 */
export function useCancelOTP() {
  const queryClient = useQueryClient();

  return useMutation((data: { email: string; type?: string }) => otpEndpoints.cancelOTP(data), {
    onSuccess: (_, variables) => {
      // Clear OTP status cache
      queryClient.removeQueries({
        queryKey: authCacheKeys.otpStatus(variables.email),
      });
    },
    onError: (error: any) => {
      console.error('OTP cancellation failed:', otpErrorHandler.handleRequestError(error));
    },
  });
}

/**
 * Combined OTP management hook
 */
export function useOTPManagement(email: string) {
  const otpStatusQuery = useOTPStatus(email, !!email);
  const requestOTPMutation = useRequestOTP();
  const verifyOTPMutation = useVerifyOTP();
  const resendOTPMutation = useResendOTP();
  const cancelOTPMutation = useCancelOTP();

  const canResend = otpStatusQuery.data?.canResendAt ? new Date(otpStatusQuery.data.canResendAt) <= new Date() : false;

  const timeRemaining = otpStatusQuery.data?.expiresAt
    ? Math.max(0, Math.floor((new Date(otpStatusQuery.data.expiresAt).getTime() - Date.now()) / 1000))
    : 0;

  const timeUntilResend = otpStatusQuery.data?.canResendAt
    ? Math.max(0, Math.floor((new Date(otpStatusQuery.data.canResendAt).getTime() - Date.now()) / 1000))
    : 0;

  return {
    // OTP Status
    otpStatus: otpStatusQuery.data,
    hasPendingOTP: otpStatusQuery.data?.hasPendingOTP || false,
    isLoading: otpStatusQuery.isLoading,
    isError: otpStatusQuery.isError,
    error: otpStatusQuery.error,

    // Timing information
    canResend,
    timeRemaining,
    timeUntilResend,
    attemptsRemaining: otpStatusQuery.data?.attemptsRemaining || 0,

    // Actions
    requestOTP: (type?: string) => requestOTPMutation.mutate({ email, type }),
    verifyOTP: (otp: string, type?: string) => verifyOTPMutation.mutate({ email, otp, type }),
    resendOTP: (type?: string) => resendOTPMutation.mutate({ email, type }),
    cancelOTP: (type?: string) => cancelOTPMutation.mutate({ email, type }),

    // Loading states
    isRequesting: requestOTPMutation.isPending,
    isVerifying: verifyOTPMutation.isPending,
    isResending: resendOTPMutation.isPending,
    isCancelling: cancelOTPMutation.isPending,

    // Utility functions
    refetchStatus: otpStatusQuery.refetch,
  };
}

/**
 * Hook for OTP validation
 */
export function useOTPValidation() {
  const validateOTPRequest = (data: OTPRequestReq): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.email) {
      errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.type && !isValidOTPType(data.type)) {
      errors.push('Invalid OTP type');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const validateOTPVerification = (data: OTPVerifyReq): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.email) {
      errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!data.otp) {
      errors.push('OTP code is required');
    } else if (!isValidOTPCode(data.otp)) {
      errors.push('OTP code must be 6 digits');
    }

    if (data.type && !isValidOTPType(data.type)) {
      errors.push('Invalid OTP type');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  return {
    validateOTPRequest,
    validateOTPVerification,
  };
}

// Helper validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function isValidOTPCode(otp: string): boolean {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp.trim());
}

function isValidOTPType(type: string): boolean {
  const validTypes = Object.values(OTP_CONSTANTS.TYPES);
  return validTypes.includes(type as any);
}
