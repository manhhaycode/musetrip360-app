/**
 * Base API response structure
 */
export interface APIResponse<T> {
  data: T;
  code: number;
  message?: string;
}

/**
 * Pagination information
 */
export interface Pagination {
  Page: number;
  PageSize: number;
  IsActive?: boolean;
  SearchKeyword?: string;
  sortList?: string[];
}

export interface SearchRequest extends Pagination {
  Id: string;
  Name: string;
  Title: string;
  Type: string;
  Thumbnail: string;
  Description: string;
  Status: string;
}

/**
 * Paginated API response
 */
export type PaginatedResponse<T> = APIResponse<{
  list: T[];
  total: number;
}>;

/**
 * API error response structure
 */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  path?: string;
  retry?: boolean;
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
