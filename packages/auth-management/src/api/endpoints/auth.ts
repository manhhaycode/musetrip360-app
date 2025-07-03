import { LoginReq, RegisterReq, RefreshReq, AuthResponse, TokenVerificationResponse } from '../../types';
import { getHttpClient, type HTTPClient, type AuthToken } from '@musetrip360/query-foundation';

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class AuthEndpoints {
  private httpClient: HTTPClient;

  constructor() {
    this.httpClient = getHttpClient();
  }

  // Register endpoint
  async register(data: RegisterReq): Promise<AuthResponse> {
    return this.httpClient.post<AuthResponse>('/auth/register', data);
  }

  // Login endpoint
  async login(data: LoginReq): Promise<AuthResponse> {
    return this.httpClient.post<AuthResponse>('/auth/login', data);
  }

  // Token refresh endpoint
  async refreshToken(data: RefreshReq): Promise<AuthResponse> {
    return this.httpClient.post<AuthResponse>('/auth/refresh', data);
  }

  // Logout endpoint
  async logout(): Promise<{ message: string }> {
    return this.httpClient.post<{ message: string }>('/auth/logout');
  }

  // Verify token endpoint
  async verifyToken(token?: string): Promise<TokenVerificationResponse> {
    return this.httpClient.post<TokenVerificationResponse>('/auth/verify-token', { token });
  }

  // Get current user endpoint
  async getCurrentUser(): Promise<any> {
    return this.httpClient.get<any>('/auth/me');
  }

  // Request OTP for password reset
  async requestOTP(data: { email: string }): Promise<{ message: string }> {
    return this.httpClient.post<{ message: string }>('/auth/request-otp', data);
  }

  // Verify OTP and change password
  async verifyOTPChangePassword(data: {
    email: string;
    otp: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return this.httpClient.post<{ message: string }>('/auth/verify-otp-change-password', data);
  }

  // Set authentication token for future requests
  setAuthToken(accessToken: string, refreshToken: string, expiresAt: number): void {
    const authToken: AuthToken = {
      accessToken,
      refreshToken,
      expiresAt,
      tokenType: 'Bearer',
    };
    this.httpClient.setAuth(authToken);
  }

  // Clear authentication token
  clearAuthToken(): void {
    this.httpClient.clearAuth();
  }
}

// Export a singleton instance
export const authEndpoints = new AuthEndpoints();

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
