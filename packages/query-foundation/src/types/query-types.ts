import type {
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
  QueryClient,
  QueryKey,
  InfiniteData,
} from '@tanstack/react-query';
import type { PaginatedResponse, APIError, RequestConfig } from './api-types';

// Re-export commonly used types
export type { APIError } from './api-types';

/**
 * Enhanced query options with custom configuration
 */
export interface CustomQueryOptions<
  TQueryFnData = unknown,
  TError = APIError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'> {
  requestConfig?: RequestConfig;
  background?: boolean;
  offlineFirst?: boolean;
  optimisticUpdate?: boolean;
}

/**
 * Enhanced mutation options with custom configuration
 */
export interface CustomMutationOptions<TData = unknown, TError = APIError, TVariables = void, TContext = unknown>
  extends Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> {
  requestConfig?: RequestConfig;
  optimisticUpdate?: boolean;
  backgroundSync?: boolean;
  removeQueries?: QueryKey[];
  revalidateQueries?: QueryKey[];
}

/**
 * Enhanced infinite query options
 */
export interface CustomInfiniteQueryOptions<
  TQueryFnData = unknown,
  TError = APIError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<
    UseInfiniteQueryOptions<TQueryFnData, TError, TData, readonly unknown[], TQueryKey>,
    'queryKey' | 'queryFn'
  > {
  requestConfig?: RequestConfig;
  background?: boolean;
  offlineFirst?: boolean;
}

/**
 * Query cache configuration
 */
export interface QueryCacheConfig {
  defaultStaleTime: number;
  defaultCacheTime: number;
  maxAge: number;
  maxQueries: number;
  retryDelay: (attemptIndex: number) => number;
  retryOnMount: boolean;
  refetchOnMount: boolean;
  refetchOnWindowFocus: boolean;
  refetchOnReconnect: boolean;
}

/**
 * Offline query configuration
 */
export interface OfflineQueryConfig {
  enabled: boolean;
  storageQuota: number;
  maxOfflineQueries: number;
  syncOnReconnect: boolean;
  backgroundSync: boolean;
  conflictResolution: 'server' | 'client' | 'merge';
}

/**
 * Cache key factory interface
 */
export interface CacheKeyFactory {
  all: QueryKey;
  lists: () => QueryKey;
  list: (filters?: Record<string, any>) => QueryKey;
  details: () => QueryKey;
  detail: (id: string | number) => QueryKey;
  search: (query: string, filters?: Record<string, any>) => QueryKey;
  infinite: (filters?: Record<string, any>) => QueryKey;
}

/**
 * Optimistic update context
 */
export interface OptimisticUpdateContext<T = any> {
  previousData?: T;
  optimisticData: T;
  queryKey: QueryKey;
  rollback: () => void;
}

/**
 * Background sync configuration
 */
export interface BackgroundSyncConfig {
  enabled: boolean;
  syncInterval: number;
  maxRetries: number;
  retryDelay: number;
  batchSize: number;
  priorityQueries: QueryKey[];
}

/**
 * Query invalidation options
 */
export interface InvalidationOptions {
  exact?: boolean;
  refetchType?: 'active' | 'inactive' | 'all';
  cancelRefetch?: boolean;
  throwOnError?: boolean;
}

/**
 * Pagination query data
 */
export interface PaginationQueryData<T = any> extends InfiniteData<PaginatedResponse<T>> {
  pages: PaginatedResponse<T>[];
  pageParams: unknown[];
}

/**
 * Search query configuration
 */
export interface SearchQueryConfig {
  debounceMs: number;
  minQueryLength: number;
  maxResults: number;
  cacheResults: boolean;
  staleTime: number;
}

/**
 * Mutation queue item
 */
export interface MutationQueueItem {
  id: string;
  mutationKey: string[];
  variables: any;
  timestamp: number;
  retryCount: number;
  priority: 'high' | 'medium' | 'low';
  context?: any;
}

/**
 * Sync status
 */
export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

/**
 * Query client context
 */
export interface QueryClientContext {
  client: QueryClient;
  isOnline: boolean;
  syncStatus: SyncStatus;
  pendingMutations: number;
  lastSyncTime?: Date;
}

/**
 * Error boundary context
 */
export interface QueryErrorBoundaryContext {
  error: APIError;
  queryKey?: QueryKey;
  retry: () => void;
  reset: () => void;
  fallback?: React.ComponentType<any>;
}
