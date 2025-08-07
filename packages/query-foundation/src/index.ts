/**
 * @fileoverview MuseTrip360 Query Foundation
 *
 * A comprehensive React Query foundation with API client setup, caching strategies,
 * and offline functionality for the MuseTrip360 museum platform.
 *
 * Features:
 * - HTTP client with automatic retries and token refresh
 * - Enhanced TanStack Query hooks with custom configuration
 * - Centralized cache key management
 * - Offline-first query strategies
 * - Optimistic updates and background sync
 * - TypeScript support with comprehensive type definitions
 *
 * @version 0.1.0
 * @author MuseTrip360 Team
 */

import { getHttpClient } from './client/httpClient';
import { getQueryClientManager, QueryClientManager, resetQueryClientManager } from './client/queryClient';
import type { QueryCacheConfig, OfflineQueryConfig, BackgroundSyncConfig } from './types/query-types';

// Re-export TanStack Query essentials
export { QueryClient, QueryClientProvider, useQueryClient, useIsFetching, useIsMutating } from '@tanstack/react-query';
export type { QueryKey } from '@tanstack/react-query';

// Types
export * from './types';

// HTTP Client
export { HTTPClient, getHttpClient } from './client/httpClient';

// Query Client
export {
  QueryClientManager,
  getQueryClientManager,
  getQueryClient,
  resetQueryClientManager,
} from './client/queryClient';

// Enhanced Hooks
export {
  useQuery,
  useGetQuery,
  usePaginatedQuery,
  useSearchQuery,
  useDependentQuery,
  useBackgroundQuery,
  useOfflineQuery,
} from './hooks/useQuery';

export {
  useMutation,
  usePostMutation,
  usePutMutation,
  usePatchMutation,
  useDeleteMutation,
  useUploadMutation,
  useOptimisticMutation,
  useBulkMutation,
  useRetryMutation,
} from './hooks/useMutation';

// Cache Management
export { createCacheKey, BaseCacheKeyFactory } from './cache/cacheKeys';

// Default configurations and utilities
export const queryFoundationVersion = '0.1.0';

/**
 * Default query foundation configuration
 */
export const DEFAULT_CONFIG = {
  query: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retries: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },
  offline: {
    enabled: true,
    syncOnReconnect: true,
    backgroundSync: true,
  },
  api: {
    timeout: 50000,
    retryDelay: 1000,
    maxRetryDelay: 10000,
  },
} as const;

/**
 * Initialize query foundation with custom configuration
 */
export async function initializeQueryFoundation(config?: {
  apiBaseURL?: string;
  enableOffline?: boolean;
  enableLogging?: boolean;
  cacheConfig?: Partial<QueryCacheConfig>;
  offlineConfig?: Partial<OfflineQueryConfig>;
  backgroundSyncConfig?: Partial<BackgroundSyncConfig>;
}) {
  const {
    apiBaseURL,
    enableOffline = true,
    enableLogging = process.env.NODE_ENV === 'development',
    cacheConfig = {},
    offlineConfig = {},
    backgroundSyncConfig = {},
  } = config || {};

  // Reset any existing instance to allow reconfiguration
  await resetQueryClientManager();

  // Update HTTP client configuration
  if (apiBaseURL) {
    getHttpClient().updateConfig({ baseURL: apiBaseURL });
  }

  // Initialize query client with configuration
  const mergedOfflineConfig = { enabled: enableOffline, ...offlineConfig };
  const mergedBackgroundSyncConfig = { enabled: enableOffline, ...backgroundSyncConfig };

  getQueryClientManager(cacheConfig, mergedOfflineConfig, mergedBackgroundSyncConfig);

  console.log('[Query Foundation] Initialized with config:', {
    apiBaseURL,
    enableOffline,
    enableLogging,
    version: queryFoundationVersion,
  });
}

/**
 * Utility function to create a pre-configured query client
 */
export function createQueryClient(config?: { staleTime?: number; cacheTime?: number; retries?: number }) {
  return new QueryClientManager(
    {
      defaultStaleTime: config?.staleTime || DEFAULT_CONFIG.query.staleTime,
      defaultCacheTime: config?.cacheTime || DEFAULT_CONFIG.query.cacheTime,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    DEFAULT_CONFIG.offline,
    { enabled: true }
  ).getQueryClient();
}
