/**
 * @fileoverview Search API Integration for Mobile
 * Provides search functionality across different entity types using global search API
 */

import type { SearchParams, SearchResponse } from '@/types/api';
import { getHttpClient, useQuery } from '@musetrip360/query-foundation';

// Custom cache keys for search
const createSearchCacheKey = (prefix: string, query?: string, filters?: Record<string, any>) => {
  return filters ? ['search', prefix, query, filters] : ['search', prefix, query];
};

/**
 * Search API endpoints
 */
const SEARCH_ENDPOINTS = {
  global: '/search',
} as const;

/**
 * Build search URL with query parameters
 */
function buildSearchUrl(params: SearchParams): string {
  const searchParams = new URLSearchParams();

  if (params.Search) searchParams.append('Search', params.Search);
  if (params.Type && params.Type !== 'All') searchParams.append('Type', params.Type);
  if (params.Location) searchParams.append('Location', params.Location);
  if (params.RadiusKm) searchParams.append('RadiusKm', params.RadiusKm.toString());
  if (params.Latitude) searchParams.append('Latitude', params.Latitude.toString());
  if (params.Longitude) searchParams.append('Longitude', params.Longitude.toString());
  if (params.Status && params.Status !== 'All') searchParams.append('Status', params.Status);
  if (params.Page) searchParams.append('Page', params.Page.toString());
  if (params.PageSize) searchParams.append('PageSize', params.PageSize.toString());

  return `${SEARCH_ENDPOINTS.global}?${searchParams.toString()}`;
}

/**
 * Hook to perform global search across all entity types
 */
export function useGlobalSearch(params: SearchParams, enabled: boolean = true) {
  const url = buildSearchUrl(params);
  const cacheKey = createSearchCacheKey('global', params.Search || '', params);

  return useQuery<SearchResponse>(cacheKey, () => getHttpClient().get<SearchResponse>(url), {
    enabled: enabled && (!!params.Search || !!params.Type || !!params.Status),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to search museums specifically
 */
export function useMuseumSearch(params: SearchParams, enabled: boolean = true) {
  const museumParams = { ...params, Type: 'Museum' as const };
  const url = buildSearchUrl(museumParams);
  const cacheKey = createSearchCacheKey('museums', params.Search || '', museumParams);

  return useQuery<SearchResponse>(cacheKey, () => getHttpClient().get<SearchResponse>(url), {
    enabled: enabled && (!!params.Search || !!params.Status),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to search artifacts specifically
 */
export function useArtifactSearch(params: SearchParams, enabled: boolean = true) {
  const artifactParams = { ...params, Type: 'Artifact' as const };
  const url = buildSearchUrl(artifactParams);
  const cacheKey = createSearchCacheKey('artifacts', params.Search || '', artifactParams);

  return useQuery<SearchResponse>(cacheKey, () => getHttpClient().get<SearchResponse>(url), {
    enabled: enabled && (!!params.Search || !!params.Status),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to search events specifically
 */
export function useEventSearch(params: SearchParams, enabled: boolean = true) {
  const eventParams = { ...params, Type: 'Event' as const };
  const url = buildSearchUrl(eventParams);
  const cacheKey = createSearchCacheKey('events', params.Search || '', eventParams);

  return useQuery<SearchResponse>(cacheKey, () => getHttpClient().get<SearchResponse>(url), {
    enabled: enabled && (!!params.Search || !!params.Status),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to search virtual tours specifically
 */
export function useTourOnlineSearch(params: SearchParams, enabled: boolean = true) {
  const tourParams = { ...params, Type: 'TourOnline' as const };
  const url = buildSearchUrl(tourParams);
  const cacheKey = createSearchCacheKey('tours', params.Search || '', tourParams);

  return useQuery<SearchResponse>(cacheKey, () => getHttpClient().get<SearchResponse>(url), {
    enabled: enabled && (!!params.Search || !!params.Status),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Search utility functions
 */
export const searchUtils = {
  /**
   * Debounce search input
   */
  debounceSearch: (callback: Function, delay: number = 300) => {
    let timeoutId: any;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback.apply(null, args), delay);
    };
  },

  /**
   * Format search filters for API
   */
  formatFiltersForAPI: (filters: any): SearchParams => {
    return {
      Search: filters.query || undefined,
      Type: filters.type && filters.type !== 'All' ? filters.type : undefined,
      Page: filters.page || 1,
      PageSize: filters.pageSize || 12,
    };
  },

  /**
   * Calculate total pages from response
   */
  calculateTotalPages: (total: number, pageSize: number): number => {
    return Math.ceil(total / pageSize);
  },
};
