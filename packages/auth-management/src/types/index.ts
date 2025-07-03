// Import User types from user-management package for internal use
import type { User } from '@musetrip360/user-management';

// Re-export User for convenience
export type { User } from '@musetrip360/user-management';

// Auth types based on swagger.json
export enum AuthTypeEnum {
  Email = 'Email',
  Google = 'Google',
  Firebase = 'Firebase',
  Phone = 'Phone',
  Facebook = 'Facebook',
}

export interface RegisterReq {
  email?: string;
  password?: string;
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface LoginReq {
  authType: AuthTypeEnum;
  email?: string;
  password?: string;
  redirect?: string;
  firebaseToken?: string;
}

export interface RefreshReq {
  refreshToken?: string;
  userId?: string;
}

// OTP types
export interface OTPRequestReq {
  email: string;
  type?: string;
}

export interface OTPVerifyReq {
  email: string;
  otp: string;
  type?: string;
}

export interface OTPGenerateResponse {
  message: string;
  expiresAt: string;
  canResendAt: string;
}

export interface OTPStatusResponse {
  hasPendingOTP: boolean;
  expiresAt?: string;
  canResendAt?: string;
  attemptsRemaining?: number;
}

export interface RequestOTP {
  email?: string;
}

export interface VerifyOTPChangePassword {
  email?: string;
  otp?: string;
  newPassword?: string;
}

// Response types - Using the User class from user-management
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface TokenVerificationResponse {
  isValid: boolean;
  user?: User;
  expiresAt?: string;
}

// Auth state types - Using the User class from user-management
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Form validation types
export interface LoginFormData {
  email: string;
  password: string;
  authType: AuthTypeEnum;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber?: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

// Error types
export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

// OAuth types
export interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

export interface GoogleAuthConfig extends OAuthConfig {
  googleClientId: string;
}

// Authentication result for frontend service methods
export interface AuthenticationResult {
  success: boolean;
  user?: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
  message?: string;
}
