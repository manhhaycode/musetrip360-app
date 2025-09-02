/**
 * @fileoverview Global Search API Endpoints
 *
 * API endpoints for global search operations across all content types.
 */

import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';

export interface GlobalSearchItem {
  id: string;
  title: string;
  type: 'Museum' | 'Event' | 'Artifact' | 'TourOnline' | 'User';
  description?: string;
  thumbnail?: string;
  location?: string;
  museumName?: string;
}

export interface GlobalSearchParams {
  search?: string;
  type?: string;
  location?: string;
  radiusKm?: number;
  latitude?: number;
  longitude?: number;
  page?: number;
  pageSize?: number;
}

export interface GlobalSearchResponse {
  items: GlobalSearchItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * Global search endpoints
 */
export const globalSearchEndpoints = {
  search: '/search',
} as const;

/**
 * Search across all content types
 */
export const globalSearch = async (params: GlobalSearchParams): Promise<APIResponse<GlobalSearchResponse>> => {
  const httpClient = getHttpClient();
  return await httpClient.get<APIResponse<GlobalSearchResponse>>(globalSearchEndpoints.search, { params });
};

/**
 * Get autocomplete suggestions (limited results for dropdown)
 */
export const getSearchSuggestions = async (searchTerm: string, limit: number = 8): Promise<GlobalSearchItem[]> => {
  if (!searchTerm || searchTerm.length < 2) return [];

  try {
    const response = await globalSearch({
      search: searchTerm,
      pageSize: limit,
      page: 1,
    });
    return response.data?.items || [];
  } catch (error) {
    console.error('Search suggestions error:', error);
    return [];
  }
};

/**
 * Global search error handler
 */
export const globalSearchErrorHandler = {
  handleSearchError: (error: any): string => {
    if (error.response?.status === 400) {
      return 'Invalid search parameters. Please check your input.';
    }
    if (error.response?.status === 404) {
      return 'No results found for your search.';
    }
    if (error.response?.status === 500) {
      return 'Server error occurred while searching. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
  },
};
