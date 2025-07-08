/**
 * Base API response structure
 */
export interface APIResponse<T> {
  data: T;
  code: number;
  message?: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * API error response structure
 */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  path?: string;
  statusCode: number;
}

/**
 * Request configuration
 */
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  offline?: boolean;
  optimistic?: boolean;
  background?: boolean;
}

/**
 * HTTP methods
 */
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API endpoints
 */
export interface APIEndpoint {
  method: HTTPMethod;
  path: string;
  config?: RequestConfig;
}

/**
 * Authentication token
 */
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

/**
 * API client configuration
 */
export interface APIClientConfig {
  baseURL?: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  maxRetryDelay: number;
  enableOffline: boolean;
  enableCache: boolean;
  cacheTimeout: number;
  enableAuth: boolean;
  enableLogging?: boolean;
}

/**
 * Request interceptor context
 */
export interface RequestInterceptorContext {
  config: any;
  token?: AuthToken;
  isRetry?: boolean;
  retryCount?: number;
}

/**
 * Response interceptor context
 */
export interface ResponseInterceptorContext {
  response: any;
  config: any;
  isOffline?: boolean;
  fromCache?: boolean;
}

/**
 * File upload progress
 */
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * File upload configuration
 */
export interface UploadConfig {
  onProgress?: (progress: UploadProgress) => void;
  chunkSize?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
  multiple?: boolean;
}
