/**
 * @fileoverview Authentication API Layer Exports
 *
 * Exports all API-related components including endpoints, hooks, utilities,
 * and cache keys for authentication management operations.
 */

// API Endpoints
export * from './endpoints/auth';
export * from './endpoints/otp';

// React Query Hooks
export * from './hooks/useAuth';
export * from './hooks/useOTP';

// Cache Keys
export * from './cache/cacheKeys';

// Utilities
export * from './utils/transformers';
export * from './utils/validators';

// Re-export types for convenience (excluding User - import from @musetrip360/user-management)
export type {
  LoginReq,
  RegisterReq,
  RefreshReq,
  AuthResponse,
  AuthState,
  OTPRequestReq,
  OTPVerifyReq,
  OTPGenerateResponse,
  OTPStatusResponse,
  LoginFormData,
  RegisterFormData,
  ResetPasswordFormData,
  AuthTypeEnum,
  TokenVerificationResponse,
} from '../types';
