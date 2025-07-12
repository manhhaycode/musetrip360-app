import {
  LoginReq,
  RegisterReq,
  RefreshReq,
  LoginResponse,
  TokenVerificationResponse,
  VerifyOTPChangePassword,
} from '@/types';
import { type HTTPClient, type AuthToken, getHttpClient } from '@musetrip360/query-foundation';

export class AuthEndpoints {
  private static httpClient: HTTPClient;

  static getHttpClient(): HTTPClient {
    if (!this.httpClient) {
      this.httpClient = getHttpClient();
    }
    return this.httpClient;
  }

  // Register endpoint
  static async register(data: RegisterReq): Promise<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/auth/register', data);
  }

  // Login endpoint
  static async login(data: LoginReq): Promise<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/auth/login', data);
  }

  // Token refresh endpoint
  static async refreshToken(data: RefreshReq): Promise<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/auth/refresh', data);
  }

  // Logout endpoint
  static async logout(): Promise<{ message: string }> {
    return this.httpClient.post<{ message: string }>('/auth/logout');
  }

  // Verify token endpoint
  static async verifyToken(token?: string): Promise<TokenVerificationResponse> {
    return this.httpClient.post<TokenVerificationResponse>('/auth/verify-token', { token });
  }

  // Get current user endpoint
  static async getCurrentUser(): Promise<any> {
    return this.httpClient.get<any>('/auth/me');
  }

  // Request OTP for password reset
  static async requestOTP(email: string): Promise<{ message: string }> {
    return this.httpClient.post<{ message: string }>('/auth/forgot-password/request', { email });
  }

  // Verify OTP and change password
  static async verifyOTPChangePassword(data: VerifyOTPChangePassword): Promise<{ message: string }> {
    return this.httpClient.post<{ message: string }>('/auth/forgot-password/verify', data);
  }

  // Set authentication token for future requests
  static setAuthToken(accessToken: string, refreshToken: string, expiresAt: number): void {
    const authToken: AuthToken = {
      accessToken,
      refreshToken,
      expiresAt,
      tokenType: 'Bearer',
    };
    this.httpClient.setAuth(authToken);
  }

  // Clear authentication token
  static clearAuthToken(): void {
    this.httpClient.clearAuth();
  }
}

export const initAuthEndpoints = () => {
  AuthEndpoints.getHttpClient();
};

/**
 * Authentication error handling utilities
 */
export const authErrorHandler = {
  /**
   * Handle login errors
   */
  handleLoginError: (error: any): string => {
    if (error.response?.status === 401) {
      return 'Invalid email or password';
    }
    if (error.response?.status === 403) {
      return 'Account is disabled or suspended';
    }
    if (error.response?.status === 429) {
      return 'Too many login attempts. Please try again later.';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Login failed. Please try again.';
  },

  /**
   * Handle registration errors
   */
  handleRegisterError: (error: any): string => {
    if (error.response?.status === 409) {
      return 'An account with this email already exists';
    }
    if (error.response?.status === 400) {
      return error.response?.data?.message || 'Invalid registration data';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Registration failed. Please try again.';
  },

  /**
   * Handle token refresh errors
   */
  handleRefreshError: (error: any): string => {
    if (error.response?.status === 401) {
      return 'Session expired. Please log in again.';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Failed to refresh session. Please log in again.';
  },

  /**
   * Handle logout errors
   */
  handleLogoutError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Logout completed with warnings.';
  },

  /**
   * Handle OTP request errors
   */
  handleOTPRequestError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Failed to request OTP. Please try again. Error: ' + error.message;
  },

  /**
   * Handle OTP verification errors
   */
  handleOTPVerificationError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'Failed to verify OTP. Please try again. Error: ' + error.message;
  },

  /**
   * Handle general authentication errors
   */
  handleError: (error: any): string => {
    if (error.response?.status === 401) {
      return 'Authentication required. Please log in.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'An authentication error occurred. Please try again.';
  },
};
