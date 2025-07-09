import {
  LoginReq,
  RegisterReq,
  RefreshReq,
  LoginResponse,
  TokenVerificationResponse,
  VerifyOTPChangePassword,
} from '@/types';
import { getHttpClient, type HTTPClient, type AuthToken } from '@musetrip360/query-foundation';

export class AuthEndpoints {
  private httpClient: HTTPClient;

  constructor() {
    this.httpClient = getHttpClient();
  }

  // Register endpoint
  async register(data: RegisterReq): Promise<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/auth/register', data);
  }

  // Login endpoint
  async login(data: LoginReq): Promise<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/auth/login', data);
  }

  // Token refresh endpoint
  async refreshToken(data: RefreshReq): Promise<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/auth/refresh', data);
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
  async requestOTP(email: string): Promise<{ message: string }> {
    return this.httpClient.post<{ message: string }>('/auth/forgot-password/request', { email });
  }

  // Verify OTP and change password
  async verifyOTPChangePassword(data: VerifyOTPChangePassword): Promise<{ message: string }> {
    return this.httpClient.post<{ message: string }>('/auth/forgot-password/verify', data);
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

// Lazy initialization - only create instance when first accessed
let _authEndpointsInstance: AuthEndpoints | null = null;

/**
 * Get the singleton AuthEndpoints instance
 * Uses lazy initialization to avoid creating the instance at module load time
 */
export function getAuthEndpoints(): AuthEndpoints {
  if (!_authEndpointsInstance) {
    _authEndpointsInstance = new AuthEndpoints();
  }
  return _authEndpointsInstance;
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetAuthEndpoints(): void {
  _authEndpointsInstance = null;
}

// For backward compatibility, you can also export this
export const authEndpoints = {
  get instance() {
    return getAuthEndpoints();
  },
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
