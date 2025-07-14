// Import User types from user-management package for internal use
import { APIResponse } from '@musetrip360/query-foundation';

export interface IUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  birthDate: string | null;
  authType: 'Email';
  status: 'Active';
  lastLogin: '2025-06-29T04:01:28.673817Z';
}

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
export type RegisterResponse = APIResponse<IUser>;

export interface LoginReq {
  authType: AuthTypeEnum;
  email?: string;
  password?: string;
  redirect?: string;
  firebaseToken?: string;
}

export interface LoginWithGoogleReq {
  state: string;
  redirect: string;
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

export type LoginResponse = APIResponse<
  | {
      userId: string;
      accessToken: string;
      refreshToken: string;
      accessTokenExpAt: number;
      refreshTokenExpAt: number;
    }
  | {
      redirectLink: string;
      token: string;
    }
>;

export interface AuthToken {
  token: string;
  expiresAt: number;
  type: 'access' | 'refresh';
}

export type AuthModalStep = 'login' | 'register' | 'forgot-password' | 'reset-password';
