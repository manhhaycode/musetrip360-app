import { useQuery as useReactQuery, QueryKey } from '@tanstack/react-query';
import { httpClient } from '../client/httpClient';
import type { CustomQueryOptions, APIError } from '../types/query-types';
import type { RequestConfig } from '../types/api-types';

/**
 * Enhanced useQuery hook with custom configuration
 */
export function useQuery<
  TQueryFnData = unknown,
  TError = APIError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: CustomQueryOptions<TQueryFnData, TError, TData, TQueryKey>
) {
  const { background = false, offlineFirst = false, ...reactQueryOptions } = options || {};

  // Enhanced query function with request configuration
  const enhancedQueryFn = async (): Promise<TQueryFnData> => {
    try {
      return await queryFn();
    } catch (error) {
      // Handle offline scenarios
      if (offlineFirst && !navigator.onLine) {
        throw new Error('Query requires network connection');
      }
      throw error;
    }
  };

  // Configure query options based on custom settings
  const queryOptions = {
    ...reactQueryOptions,
    queryKey,
    queryFn: enhancedQueryFn,
    networkMode: offlineFirst ? ('offlineFirst' as const) : ('online' as const),
    notifyOnChangeProps: background ? [] : undefined,
  };

  return useReactQuery(queryOptions);
}

/**
 * Hook for HTTP GET requests
 */
export function useGetQuery<TData = unknown>(
  url: string,
  queryKey: QueryKey,
  requestConfig?: RequestConfig,
  options?: Omit<CustomQueryOptions<TData>, 'requestConfig'>
) {
  return useQuery(queryKey, () => httpClient.get<TData>(url), {
    ...options,
    requestConfig,
  });
}

/**
 * Hook for paginated queries
 */
export function usePaginatedQuery<TData = unknown>(
  url: string,
  queryKey: QueryKey,
  page: number = 1,
  limit: number = 10,
  requestConfig?: RequestConfig,
  options?: Omit<CustomQueryOptions<TData>, 'requestConfig'>
) {
  const paginatedUrl = `${url}?page=${page}&limit=${limit}`;
  const paginatedQueryKey = [...queryKey, { page, limit }];

  return useQuery(paginatedQueryKey as QueryKey, () => httpClient.get<TData>(paginatedUrl), {
    ...options,
    requestConfig,
    placeholderData: (previousData: TData | undefined) => previousData, // Keep previous data while loading new page
  } as any);
}

/**
 * Hook for search queries with debouncing
 */
export function useSearchQuery<TData = unknown>(
  url: string,
  queryKey: QueryKey,
  searchTerm: string,
  debounceMs: number = 300, // TODO: Implement debouncing logic
  minLength: number = 2,
  requestConfig?: RequestConfig,
  options?: Omit<CustomQueryOptions<TData>, 'requestConfig'>
) {
  const shouldSearch = searchTerm.length >= minLength;
  const searchUrl = shouldSearch ? `${url}?q=${encodeURIComponent(searchTerm)}` : '';

  return useQuery([...queryKey, { search: searchTerm }], () => httpClient.get<TData>(searchUrl), {
    ...options,
    enabled: shouldSearch && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5 minutes
    requestConfig,
  });
}

/**
 * Hook for dependent queries
 */
export function useDependentQuery<TData = unknown>(
  url: string,
  queryKey: QueryKey,
  dependency: unknown,
  requestConfig?: RequestConfig,
  options?: Omit<CustomQueryOptions<TData>, 'requestConfig'>
) {
  return useQuery([...queryKey, { dependency }], () => httpClient.get<TData>(url), {
    ...options,
    enabled: Boolean(dependency) && (options?.enabled ?? true),
    requestConfig,
  });
}

/**
 * Hook for background queries that don't affect loading states
 */
export function useBackgroundQuery<TData = unknown>(
  url: string,
  queryKey: QueryKey,
  requestConfig?: RequestConfig,
  options?: Omit<CustomQueryOptions<TData>, 'requestConfig' | 'background'>
) {
  return useQuery(queryKey, () => httpClient.get<TData>(url), {
    ...options,
    background: true,
    requestConfig,
    notifyOnChangeProps: [], // Don't trigger re-renders
  });
}

/**
 * Hook for offline-first queries
 */
export function useOfflineQuery<TData = unknown>(
  url: string,
  queryKey: QueryKey,
  requestConfig?: RequestConfig,
  options?: Omit<CustomQueryOptions<TData>, 'requestConfig' | 'offlineFirst'>
) {
  return useQuery(queryKey, () => httpClient.get<TData>(url), {
    ...options,
    offlineFirst: true,
    staleTime: 10 * 60 * 1000, // 10 minutes for offline
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    requestConfig,
  });
}
