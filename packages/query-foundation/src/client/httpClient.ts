import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type {
  APIClientConfig,
  APIError,
  AuthToken,
  RequestInterceptorContext,
  ResponseInterceptorContext,
  UploadConfig,
  UploadProgress,
} from '../types/api-types';
import { getEnvVar } from '@musetrip360/infras';

/**
 * Default API client configuration
 */
const DEFAULT_CONFIG: APIClientConfig = {
  baseURL: getEnvVar('API_URL')!,
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  maxRetryDelay: 10000, // 10 seconds
  enableOffline: true,
  enableCache: true,
  cacheTimeout: 300000, // 5 minutes
  enableAuth: true,
  enableLogging: getEnvVar('NODE_ENV') === 'development',
};

/**
 * HTTP Client class for API communication
 */
export class HTTPClient {
  private client: AxiosInstance;
  private config: APIClientConfig;
  private authToken: AuthToken | null = null;
  private tokenRefreshPromise: Promise<AuthToken> | null = null;

  constructor(config: Partial<APIClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    if (!this.config.baseURL) {
      throw new Error('API_URL is not set in the environment variables');
    }
    this.client = this.createAxiosInstance();
    this.setupInterceptors();
  }

  /**
   * Create Axios instance with base configuration
   */
  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return this.handleRequest({ config });
      },
      (error: AxiosError) => {
        return this.handleRequestError(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return this.handleResponse({ response, config: response.config });
      },
      (error: AxiosError) => {
        return this.handleResponseError(error);
      }
    );
  }

  /**
   * Handle outgoing requests
   */
  private handleRequest(context: RequestInterceptorContext): InternalAxiosRequestConfig {
    const { config } = context;

    // Add authentication token
    if (this.config.enableAuth && this.authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `${this.authToken.tokenType} ${this.authToken.accessToken}`;
    }

    // Add request ID for tracking
    config.metadata = {
      ...config.metadata,
      requestId: this.generateRequestId(),
      timestamp: Date.now(),
    };

    // Log request in development
    if (this.config.enableLogging) {
      console.log(`[HTTP Client] Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  }

  /**
   * Handle request errors
   */
  private handleRequestError(error: AxiosError): Promise<AxiosRequestConfig> {
    if (this.config.enableLogging) {
      console.error('[HTTP Client] Request Error:', error);
    }
    return Promise.reject(this.formatError(error));
  }

  /**
   * Handle successful responses
   */
  private handleResponse(context: ResponseInterceptorContext): AxiosResponse {
    const { response } = context;

    // Log response in development
    if (this.config.enableLogging) {
      console.log(`[HTTP Client] Response: ${response.status} ${response.config.url}`, {
        data: response.data,
      });
    }

    return response;
  }

  /**
   * Handle response errors
   */
  private async handleResponseError(error: AxiosError): Promise<AxiosResponse> {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry && this.config.enableAuth) {
      originalRequest._retry = true;

      try {
        await this.refreshToken();
        return this.client(originalRequest);
      } catch {
        this.clearAuth();
        throw this.formatError(error);
      }
    }

    // Handle retries for network errors or 5xx responses
    if (this.shouldRetry(error) && !originalRequest._retry) {
      const retryCount = (originalRequest._retryCount || 0) + 1;

      if (retryCount <= this.config.retries) {
        originalRequest._retryCount = retryCount;
        originalRequest._retry = true;

        const delay = this.calculateRetryDelay(retryCount);
        await this.delay(delay);

        return this.client(originalRequest);
      }
    }

    // Log error in development
    if (this.config.enableLogging) {
      console.error('[HTTP Client] Response Error:', error);
    }

    throw this.formatError(error);
  }

  /**
   * Set authentication token
   */
  public setAuth(token: AuthToken): void {
    this.authToken = token;
  }

  /**
   * Clear authentication
   */
  public clearAuth(): void {
    this.authToken = null;
    this.tokenRefreshPromise = null;
  }

  /**
   * Refresh authentication token
   */
  private async refreshToken(): Promise<AuthToken> {
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    if (!this.authToken?.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.tokenRefreshPromise = this.client
      .post('/auth/refresh', {
        refreshToken: this.authToken!.refreshToken,
      })
      .then((response: AxiosResponse<{ data: AuthToken }>) => {
        const newToken: AuthToken = response.data.data;
        this.setAuth(newToken);
        this.tokenRefreshPromise = null;
        return newToken;
      })
      .catch((error: AxiosError) => {
        this.tokenRefreshPromise = null;
        throw error;
      });

    return this.tokenRefreshPromise;
  }

  /**
   * Make HTTP GET request
   */
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Make HTTP POST request
   */
  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make HTTP PUT request
   */
  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make HTTP PATCH request
   */
  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Make HTTP DELETE request
   */
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Upload file with progress tracking
   */
  public async upload<T = any>(url: string, file: File, config?: UploadConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (config?.onProgress && progressEvent.total) {
          const progress: UploadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          };
          config.onProgress(progress);
        }
      },
    };

    const response = await this.client.post<T>(url, formData, axiosConfig);
    return response.data;
  }

  /**
   * Check if error should be retried
   */
  private shouldRetry(error: AxiosError): boolean {
    // Don't retry for 4xx errors (except 408, 429)
    if (error.response?.status && error.response.status >= 400 && error.response.status < 500) {
      return error.response.status === 408 || error.response.status === 429;
    }

    // Retry for network errors or 5xx responses
    return !error.response || error.response.status >= 500;
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(retryCount: number): number {
    const delay = this.config.retryDelay * Math.pow(2, retryCount - 1);
    const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
    return Math.min(delay + jitter, this.config.maxRetryDelay);
  }

  /**
   * Delay helper function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Format error for consistent error handling
   */
  private formatError(error: AxiosError): APIError {
    const response = error.response;
    const responseData = response?.data as any;

    return {
      code: responseData?.code || error.code || 'NETWORK_ERROR',
      message: responseData?.message || error.message || 'An unexpected error occurred',
      details: responseData?.details || {},
      timestamp: new Date().toISOString(),
      path: error.config?.url,
      statusCode: response?.status || 0,
    };
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get the underlying Axios instance
   */
  public getAxiosInstance(): AxiosInstance {
    return this.client;
  }

  /**
   * Update client configuration
   */
  public updateConfig(config: Partial<APIClientConfig>): void {
    this.config = { ...this.config, ...config };

    // Update Axios instance if base configuration changed
    if (config.baseURL || config.timeout) {
      this.client.defaults.baseURL = this.config.baseURL;
      this.client.defaults.timeout = this.config.timeout;
    }
  }
}

/**
 * Default HTTP client instance (lazy-initialized)
 */
let _httpClient: HTTPClient | null = null;

/**
 * Get or create the default HTTP client
 */
export function getHttpClient(config?: Partial<APIClientConfig>): HTTPClient {
  if (!_httpClient) {
    _httpClient = new HTTPClient(config);
  }
  return _httpClient;
}
