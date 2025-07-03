/**
 * @fileoverview OTP API Endpoints
 *
 * API endpoints for OTP (One-Time Password) operations including
 * generation, verification, and management.
 */

import { getHttpClient } from '@musetrip360/query-foundation';
import type { OTPRequestReq, OTPVerifyReq, OTPStatusResponse, OTPGenerateResponse } from '../../types';

// API Base URLs
const OTP_API_BASE = '/api/v1/auth/otp';

/**
 * OTP management API endpoints
 */
export const otpEndpoints = {
  // POST /api/v1/auth/otp/request - Request OTP for email verification
  requestEmailOTP: async (data: OTPRequestReq): Promise<OTPGenerateResponse> => {
    const client = getHttpClient();
    const response = await client.post<OTPGenerateResponse>(`${OTP_API_BASE}/request`, data);
    return response;
  },

  // POST /api/v1/auth/otp/verify - Verify OTP code
  verifyOTP: async (data: OTPVerifyReq): Promise<{ message: string; isValid: boolean }> => {
    const client = getHttpClient();
    const response = await client.post<{ message: string; isValid: boolean }>(`${OTP_API_BASE}/verify`, data);
    return response;
  },

  // GET /api/v1/auth/otp/status/{email} - Get OTP status for email
  getOTPStatus: async (email: string): Promise<OTPStatusResponse> => {
    const client = getHttpClient();
    const response = await client.get<OTPStatusResponse>(`${OTP_API_BASE}/status/${encodeURIComponent(email)}`);
    return response;
  },

  // POST /api/v1/auth/otp/resend - Resend OTP
  resendOTP: async (data: { email: string; type?: string }): Promise<OTPGenerateResponse> => {
    const client = getHttpClient();
    const response = await client.post<OTPGenerateResponse>(`${OTP_API_BASE}/resend`, data);
    return response;
  },

  // DELETE /api/v1/auth/otp/cancel - Cancel pending OTP
  cancelOTP: async (data: { email: string; type?: string }): Promise<{ message: string }> => {
    const client = getHttpClient();
    const response = await client.delete<{ message: string }>(`${OTP_API_BASE}/cancel`, { data });
    return response;
  },
} as const;

/**
 * OTP validation utilities
 */
export const otpValidationUtils = {
  /**
   * Validate OTP request data
   */
  validateOTPRequest: (data: OTPRequestReq): { isValid: boolean; errors: string[] } => {
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
  },

  /**
   * Validate OTP verification data
   */
  validateOTPVerification: (data: OTPVerifyReq): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.email) {
      errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (!data.otp) {
      errors.push('OTP code is required');
    } else if (!isValidOTPCode(data.otp)) {
      errors.push('Invalid OTP code format');
    }

    if (data.type && !isValidOTPType(data.type)) {
      errors.push('Invalid OTP type');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Check if OTP is expired
   */
  isOTPExpired: (expiresAt: string): boolean => {
    const expirationDate = new Date(expiresAt);
    return expirationDate <= new Date();
  },

  /**
   * Get OTP expiration time remaining in minutes
   */
  getOTPTimeRemaining: (expiresAt: string): number => {
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const diffMs = expirationDate.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60)));
  },
};

/**
 * OTP-specific error handling
 */
export const otpErrorHandler = {
  /**
   * Handle OTP request errors
   */
  handleRequestError: (error: any): string => {
    if (error.response?.status === 429) {
      return 'Too many OTP requests. Please wait before requesting another code.';
    }
    if (error.response?.status === 400) {
      return error.response?.data?.message || 'Invalid OTP request data';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Failed to send OTP. Please try again.';
  },

  /**
   * Handle OTP verification errors
   */
  handleVerificationError: (error: any): string => {
    if (error.response?.status === 400) {
      return 'Invalid or expired OTP code';
    }
    if (error.response?.status === 404) {
      return 'No OTP found for this email';
    }
    if (error.response?.status === 429) {
      return 'Too many verification attempts. Please request a new OTP.';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Failed to verify OTP. Please try again.';
  },
};

/**
 * OTP constants
 */
export const OTP_CONSTANTS = {
  TYPES: {
    EMAIL_VERIFICATION: 'email_verification',
    PASSWORD_RESET: 'password_reset',
    TWO_FACTOR: 'two_factor',
    PHONE_VERIFICATION: 'phone_verification',
  },
  EXPIRATION_MINUTES: 10,
  CODE_LENGTH: 6,
  MAX_ATTEMPTS: 3,
  RESEND_COOLDOWN_MINUTES: 1,
} as const;

// Helper validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function isValidOTPCode(otp: string): boolean {
  // Assuming 6-digit numeric OTP
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp.trim());
}

function isValidOTPType(type: string): boolean {
  const validTypes = Object.values(OTP_CONSTANTS.TYPES);
  return validTypes.includes(type as any);
}
