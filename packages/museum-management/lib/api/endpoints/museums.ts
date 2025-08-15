/**
 * @fileoverview Museum Search API Endpoints
 *
 * API endpoints for museum search operations.
 */

import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';
import {
  AdminAnalyticsOverview,
  AnalyticsOverview,
  Museum,
  MuseumCreateDto,
  MuseumSearchParams,
  MuseumSearchResponse,
} from '../../types';

/**
 * Museum API endpoints configuration
 */
export const museumEndpoints = {
  search: 'museums',
  create: 'museums',
  getById: (id: string) => `museums/${id}`,
  getUserMuseums: 'museums/user',

  // Admin endpoints
  adminList: 'museums/admin',

  // Museum-specific artifact endpoints
  listByMuseum: (museumId: string) => `/museums/${museumId}`,
  createForMuseum: (museumId: string) => `/museums/${museumId}`,
  analyticsOverview: (museumId: string) => `/analytics/overview/${museumId}`,
  adminOverview: 'analytics/admin/overview',
} as const;

/**
 * Search museums with filters and pagination
 */
export const searchMuseums = async (params: MuseumSearchParams): Promise<MuseumSearchResponse> => {
  const httpClient = getHttpClient();

  return await httpClient.get<MuseumSearchResponse>(museumEndpoints.search, { params });
};

/**
 * Get museums with filters and pagination
 */
export const getMuseums = async (params: MuseumSearchParams): Promise<MuseumSearchResponse> => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<MuseumSearchResponse>(museumEndpoints.search, { params });
  return response;
};

export const getMuseumsAdmin = async (params: MuseumSearchParams): Promise<MuseumSearchResponse> => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<MuseumSearchResponse>(museumEndpoints.adminList, { params });
  return response;
};

/**
 * Create a new museum
 */
export const createMuseum = async (data: MuseumCreateDto): Promise<Museum> => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<{ data: Museum; code: number; message: string }>(museumEndpoints.create, data);
  return response.data;
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

export const getAnalyticsOverview = async (museumId: string): Promise<any> => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<AnalyticsOverview>>(museumEndpoints.analyticsOverview(museumId));
  return response.data;
};

export const getAdminAnalyticsOverview = async (): Promise<AdminAnalyticsOverview> => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<AdminAnalyticsOverview>>(museumEndpoints.adminOverview);
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
