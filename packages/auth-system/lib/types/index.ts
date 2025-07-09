// Import User types from user-management package for internal use
import { APIResponse } from '@musetrip360/query-foundation';
import type { User } from '@musetrip360/user-management';

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
export type RegisterResponse = APIResponse<User>;

export interface LoginReq {
  authType: AuthTypeEnum;
  email?: string;
  password?: string;
  redirect?: string;
  firebaseToken?: string;
}

export interface RefreshReq {
  refreshToken: string;
  userId: string;
}

export interface RequestChangePasswordOTP {
  email: string;
}

export interface VerifyOTPChangePassword {
  email: string;
  otp: string;
  newPassword: string;
}

export type LoginResponse = APIResponse<{
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpAt: number;
  refreshTokenExpAt: number;
}>;

export interface TokenVerificationResponse {
  isValid: boolean;
  user?: User;
  expiresAt?: string;
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

export type AuthModalStep = 'login' | 'register' | 'forgot-password' | 'reset-password';
