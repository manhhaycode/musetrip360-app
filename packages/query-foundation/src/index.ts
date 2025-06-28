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

import { httpClient } from './client/httpClient';
import { queryClientManager, QueryClientManager } from './client/queryClient';

// Re-export TanStack Query essentials
export { QueryClient, QueryClientProvider, useQueryClient, useIsFetching, useIsMutating } from '@tanstack/react-query';

// Types
export type * from './types/api-types';
export type * from './types/query-types';

// HTTP Client
export { HTTPClient, httpClient } from './client/httpClient';

// Query Client
export { QueryClientManager, queryClientManager, queryClient } from './client/queryClient';

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
export {
  cacheKeys,
  getAllCacheKeys,
  createCacheKey,
  MuseumCacheKeys,
  EventCacheKeys,
  UserCacheKeys,
  AuthCacheKeys,
  ArtifactCacheKeys,
  VirtualTourCacheKeys,
  SearchCacheKeys,
} from './cache/cacheKeys';

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
  mutation: {
    retries: 2,
  },
  offline: {
    enabled: true,
    syncOnReconnect: true,
    backgroundSync: true,
  },
  api: {
    timeout: 30000,
    retryDelay: 1000,
    maxRetryDelay: 10000,
  },
} as const;

/**
 * Initialize query foundation with custom configuration
 */
export function initializeQueryFoundation(config?: {
  apiBaseURL?: string;
  enableOffline?: boolean;
  enableLogging?: boolean;
  customCacheConfig?: Record<string, any>;
}) {
  const {
    apiBaseURL,
    enableOffline = true,
    enableLogging = process.env.NODE_ENV === 'development',
    customCacheConfig = {},
  } = config || {};

  // Update HTTP client configuration
  if (apiBaseURL) {
    httpClient.updateConfig({ baseURL: apiBaseURL });
  }

  // Update query client configuration
  queryClientManager.updateConfig(customCacheConfig, { enabled: enableOffline }, { enabled: enableOffline });

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
