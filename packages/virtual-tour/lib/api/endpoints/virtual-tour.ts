/**
 * @fileoverview User Profile API Endpoints
 *
 * API endpoints for user profile management operations.
 * Handles current user profile operations and password changes.
 */

import { APIResponse, getHttpClient, PaginatedResponse, Pagination } from '@musetrip360/query-foundation';
import { IVirtualTour } from '../types';

// API Base URLs
const VIRTUAL_TOUR_API_BASE = 'tour-onlines';

export const virtualTourEndpoints = {
  // Public virtual tour endpoints
  list: () => VIRTUAL_TOUR_API_BASE,
  getById: (id: string) => `${VIRTUAL_TOUR_API_BASE}/${id}`,
  create: () => VIRTUAL_TOUR_API_BASE,
  update: (id: string) => `${VIRTUAL_TOUR_API_BASE}/${id}`,
  delete: (id: string) => `${VIRTUAL_TOUR_API_BASE}/${id}`,
  activate: (id: string) => `${VIRTUAL_TOUR_API_BASE}/${id}/activate`,
  deactivate: (id: string) => `${VIRTUAL_TOUR_API_BASE}/${id}/deactivate`,

  // Museum-specific virtual tour endpoints
  listByMuseum: (museumId: string) => `/museums/${museumId}/${VIRTUAL_TOUR_API_BASE}`,
  createForMuseum: (museumId: string) => `/museums/${museumId}/${VIRTUAL_TOUR_API_BASE}`,

  // Admin virtual tour endpoints
  adminList: () => `${VIRTUAL_TOUR_API_BASE}/admin`,
} as const;

/**
 * Get a paginated list of virtual tours by museum
 * @param museumId - The ID of the museum
 * @returns A promise that resolves to the API response containing the list of virtual tours
 */

export const getVirtualToursByMuseum = async (museumId: string, params: Pagination) => {
  const httpClient = getHttpClient();
  return (
    await httpClient.get<PaginatedResponse<IVirtualTour>>(virtualTourEndpoints.listByMuseum(museumId), { params })
  ).data;
};

export const getVirtualTours = async (params: Pagination) => {
  const httpClient = getHttpClient();
  return (await httpClient.get<PaginatedResponse<IVirtualTour>>(virtualTourEndpoints.list(), { params })).data;
};

/**
 * Get details of a specific virtual tour by ID
 * @param virtualTourId - The ID of the virtual tour
 * @returns A promise that resolves to the API response containing the virtual tour details
 */
export const getVirtualTourById = async (virtualTourId: string) => {
  const httpClient = getHttpClient();
  return (await httpClient.get<APIResponse<IVirtualTour>>(virtualTourEndpoints.getById(virtualTourId))).data;
};

/**
 * Create a new virtual tour
 * @param virtualTour - The virtual tour data to create
 * @returns A promise that resolves to the API response containing the created virtual tour
 */
export const createVirtualTourForMuseum = async (museumId: string, virtualTour: IVirtualTour) => {
  const httpClient = getHttpClient();
  return (await httpClient.post<APIResponse<IVirtualTour>>(virtualTourEndpoints.createForMuseum(museumId), virtualTour))
    .data;
};

/**
 * Update an existing virtual tour
 * @param virtualTourId - The ID of the virtual tour to update
 * @param virtualTour - The updated virtual tour data
 * @returns A promise that resolves to the API response containing the updated virtual tour
 */
export const updateVirtualTour = async (virtualTourId: string, virtualTour: IVirtualTour) => {
  const httpClient = getHttpClient();
  return (await httpClient.put<APIResponse<IVirtualTour>>(virtualTourEndpoints.update(virtualTourId), virtualTour))
    .data;
};
/**
 * Delete a virtual tour by ID
 * @param virtualTourId - The ID of the virtual tour to delete
 * @returns A promise that resolves to the API response confirming deletion
 */
export const deleteVirtualTour = async (virtualTourId: string) => {
  const httpClient = getHttpClient();
  return (await httpClient.delete<APIResponse<void>>(virtualTourEndpoints.delete(virtualTourId))).data;
};
/**
 * Activate a virtual tour by ID
 * @param virtualTourId - The ID of the virtual tour to activate
 * @returns A promise that resolves to the API response confirming activation
 */
export const activateVirtualTour = async (virtualTourId: string) => {
  const httpClient = getHttpClient();
  return (await httpClient.patch<APIResponse<void>>(virtualTourEndpoints.activate(virtualTourId))).data;
};
/**
 * Deactivate a virtual tour by ID
 * @param virtualTourId - The ID of the virtual tour to deactivate
 * @returns A promise that resolves to the API response confirming deactivation
 */
export const deactivateVirtualTour = async (virtualTourId: string) => {
  const httpClient = getHttpClient();
  return (await httpClient.patch<APIResponse<void>>(virtualTourEndpoints.deactivate(virtualTourId))).data;
};
