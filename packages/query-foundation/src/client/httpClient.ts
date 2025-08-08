import { config, getEnvironment, getEnvVar } from '@musetrip360/infras';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type {
  APIClientConfig,
  APIError,
  RequestInterceptorContext,
  ResponseInterceptorContext,
  UploadConfig,
  UploadProgress,
} from '../types/api-types';

/**
 * Default API client configuration
 */
const DEFAULT_CONFIG: APIClientConfig = {
  timeout: 50000, // 50 seconds
  retries: 0,
  retryDelay: 1000, // 1 second
  maxRetryDelay: 10000, // 10 seconds
  enableOffline: true,
  enableCache: true,
  cacheTimeout: 300000, // 5 minutes
  enableAuth: true,
};

/**
 * HTTP Client class for API communication
 */
export class HTTPClient {
  private client: AxiosInstance;
  private config: APIClientConfig;
  private authToken: string | null = null;

  private responseErrorHandlers: ((error: AxiosError) => Promise<any>) | null = null;

  constructor(configuration: Partial<APIClientConfig> = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...configuration,
    };
    this.config.baseURL = config('API_URL');
    this.config.enableLogging = getEnvironment() === 'development' && getEnvVar('LOGGING_REQUEST') === 'true';
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
  private async handleRequest(context: RequestInterceptorContext): Promise<InternalAxiosRequestConfig> {
    const { config } = context;

    // Add authentication token
    if (this.config.enableAuth && this.authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${this.authToken}`;
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
    // Log error in development
    if (this.config.enableLogging) {
      console.error('[HTTP Client] Response Error:', error);
    }

    // Check if we have custom error handlers
    if (this.responseErrorHandlers) {
      try {
        await this.responseErrorHandlers(error);
        return Promise.reject({
          ...error,
          response: {
            ...error.response,
            data: {
              ...(error.response?.data as object),
              retry: true,
            },
          },
        });
      } catch (error) {
        return Promise.reject(this.formatError(error as AxiosError));
      }
    }
    return Promise.reject(this.formatError(error));
  }

  /**
   * Set authentication token
   */
  public setAuth(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear authentication
   */
  public clearAuth(): void {
    this.authToken = null;
  }

  /*
  /**
   * Make generic HTTP request
   */
  public async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await this.client.request<T>(config);
    return response;
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

    const response = await this.client.post<T>(url, { file }, axiosConfig);
    return response.data;
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
      retry: responseData?.retry || false,
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

  public setErrorHandlers(handlers: (error: AxiosError) => Promise<any>): void {
    this.responseErrorHandlers = handlers;
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
