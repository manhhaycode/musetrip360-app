// Export main package components
export * from './api';
export * from './domain';
export * from './types';

// State exports (renamed to avoid conflicts)
export {
  useAuthStore,
  authSelectors,
  useAuth,
  useAuthState,
  useAuthGuard,
  useUserProfile,
  useAuthPersistence,
  useAuthSelectors,
} from './state';

// Export commonly used types for convenience (User should be imported from @musetrip360/user-management)
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
} from './types';
