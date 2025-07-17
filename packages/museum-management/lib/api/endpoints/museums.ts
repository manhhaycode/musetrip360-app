/**
 * @fileoverview Museum Search API Endpoints
 *
 * API endpoints for museum search operations.
 */

import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';
import { MuseumSearchParams, MuseumSearchResponse, Museum } from '@/types';

/**
 * Museum API endpoints configuration
 */
export const museumEndpoints = {
  search: 'museums',
  getById: (id: string) => `museums/${id}`,
  getUserMuseums: 'museums/user',
} as const;

/**
 * Search museums with filters and pagination
 */
export const searchMuseums = async (params: MuseumSearchParams): Promise<MuseumSearchResponse> => {
  const httpClient = getHttpClient();
  const searchParams = new URLSearchParams();

  // Add search parameters
  if (params.Name) searchParams.append('Name', params.Name);
  if (params.Description) searchParams.append('Description', params.Description);
  if (params.Page) searchParams.append('Page', params.Page.toString());
  if (params.PageSize) searchParams.append('PageSize', params.PageSize.toString());
  if (params.sortBy) searchParams.append('SortBy', params.sortBy);

  const url = `${museumEndpoints.search}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  return await httpClient.get<MuseumSearchResponse>(url);
};

/**
 * Get museum by ID
 */
export const getMuseumById = async (id: string): Promise<Museum> => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<{ data: Museum; code: number; message: string }>(museumEndpoints.getById(id));
  return response.data;
};

/**
 * Get User Museums
 */
export const getUserMuseums = async (): Promise<Museum[]> => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Museum[]>>(museumEndpoints.getUserMuseums);
  return response.data;
};

/**
 * Update Museum
 */
export const updateMuseum = async (id: string, data: Partial<Museum>): Promise<Museum> => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Museum>>(museumEndpoints.getById(id), data);
  return response.data;
};

/**
 * Museum search error handler
 */
export const museumErrorHandler = {
  handleSearchError: (error: any): string => {
    if (error.response?.status === 400) {
      return 'Invalid search parameters. Please check your input.';
    }
    if (error.response?.status === 404) {
      return 'No museums found matching your criteria.';
    }
    if (error.response?.status === 500) {
      return 'Server error occurred while searching museums. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
  },

  handleGetError: (error: any): string => {
    if (error.response?.status === 404) {
      return 'Museum not found.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to access this museum.';
    }
    return 'An error occurred while loading the museum. Please try again.';
  },
};
