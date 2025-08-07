/**
 * @fileoverview Artifact API Endpoints
 *
 * API endpoints for artifact management operations.
 */

import {
  Artifact,
  ArtifactCreateDto,
  ArtifactListParams,
  ArtifactMuseumSearchParams,
  ArtifactUpdateDto,
} from '@/types';
import { getHttpClient, APIResponse, PaginatedResponse } from '@musetrip360/query-foundation';

/**
 * Artifact API endpoints configuration
 */
export const artifactEndpoints = {
  // Public artifact endpoints
  list: '/artifacts',
  getById: (id: string) => `/artifacts/${id}`,
  update: (id: string) => `/artifacts/${id}`,
  delete: (id: string) => `/artifacts/${id}`,
  activate: (id: string) => `/artifacts/${id}/activate`,
  deactivate: (id: string) => `/artifacts/${id}/deactivate`,

  // Admin artifact endpoints
  adminList: '/artifacts/admin',

  // Museum-specific artifact endpoints
  listByMuseum: (museumId: string) => `/museums/${museumId}/artifacts`,
  createForMuseum: (museumId: string) => `/museums/${museumId}/artifacts`,
} as const;

/**
 * Get a paginated list of active artifacts
 */
export const getArtifacts = async (params?: ArtifactListParams): Promise<APIResponse<any>> => {
  const httpClient = getHttpClient();

  return await httpClient.get<APIResponse<any>>(artifactEndpoints.list, {
    params,
  });
};

/**
 * Get a paginated list of all artifacts (including inactive) for admin purposes
 */
export const getArtifactsAdmin = async (params?: ArtifactListParams): Promise<APIResponse<any>> => {
  const httpClient = getHttpClient();
  const searchParams = new URLSearchParams();

  if (params?.IsActive !== undefined) searchParams.append('IsActive', params.IsActive.toString());
  if (params?.SearchKeyword) searchParams.append('SearchKeyword', params.SearchKeyword);
  if (params?.Page) searchParams.append('Page', params.Page.toString());
  if (params?.PageSize) searchParams.append('PageSize', params.PageSize.toString());

  const url = `${artifactEndpoints.adminList}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  return await httpClient.get<APIResponse<any>>(url);
};

/**
 * Get an artifact by its unique identifier
 */
export const getArtifactById = async (id: string): Promise<APIResponse<any>> => {
  const httpClient = getHttpClient();
  return await httpClient.get<APIResponse<any>>(artifactEndpoints.getById(id));
};

/**
 * Update an existing artifact
 */
export const updateArtifact = async (id: string, data: ArtifactUpdateDto): Promise<APIResponse<any>> => {
  const httpClient = getHttpClient();
  return await httpClient.put<APIResponse<any>>(artifactEndpoints.update(id), data);
};

/**
 * Activate an artifact
 */
export const activateArtifact = async (id: string): Promise<APIResponse<any>> => {
  const httpClient = getHttpClient();
  return await httpClient.patch<APIResponse<any>>(artifactEndpoints.activate(id));
};

/**
 * Deactivate an artifact
 */
export const deactivateArtifact = async (id: string): Promise<APIResponse<any>> => {
  const httpClient = getHttpClient();
  return await httpClient.patch<APIResponse<any>>(artifactEndpoints.deactivate(id));
};

/**
 * Delete an artifact
 */
export const deleteArtifact = async (id: string): Promise<APIResponse<any>> => {
  const httpClient = getHttpClient();
  return await httpClient.delete<APIResponse<any>>(artifactEndpoints.delete(id));
};

/**
 * Get all artifacts for a specific museum
 */
export const getArtifactsByMuseum = async ({
  museumId,
  ...params
}: ArtifactMuseumSearchParams): Promise<PaginatedResponse<Artifact>['data']> => {
  const httpClient = getHttpClient();
  return (await httpClient.get<PaginatedResponse<Artifact>>(artifactEndpoints.listByMuseum(museumId), { params })).data;
};

/**
 * Create a new artifact for a museum
 */
export const createArtifactForMuseum = async (museumId: string, data: ArtifactCreateDto): Promise<APIResponse<any>> => {
  const httpClient = getHttpClient();
  return await httpClient.post<APIResponse<any>>(artifactEndpoints.createForMuseum(museumId), data);
};

/**
 * Artifact error handler
 */
export const artifactErrorHandler = {
  handleListError: (error: any): string => {
    if (error.response?.status === 400) {
      return 'Invalid search parameters. Please check your input.';
    }
    if (error.response?.status === 401) {
      return 'Authentication required. Please log in.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to access artifacts.';
    }
    return 'An error occurred while loading artifacts. Please try again.';
  },

  handleGetError: (error: any): string => {
    if (error.response?.status === 404) {
      return 'Artifact not found.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to access this artifact.';
    }
    return 'An error occurred while loading the artifact. Please try again.';
  },

  handleUpdateError: (error: any): string => {
    if (error.response?.status === 400) {
      return 'Invalid artifact data. Please check your input.';
    }
    if (error.response?.status === 401) {
      return 'Authentication required. Please log in.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to update this artifact.';
    }
    if (error.response?.status === 404) {
      return 'Artifact not found.';
    }
    return 'An error occurred while updating the artifact. Please try again.';
  },

  handleDeleteError: (error: any): string => {
    if (error.response?.status === 401) {
      return 'Authentication required. Please log in.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to delete this artifact.';
    }
    if (error.response?.status === 404) {
      return 'Artifact not found.';
    }
    return 'An error occurred while deleting the artifact. Please try again.';
  },

  handleCreateError: (error: any): string => {
    if (error.response?.status === 400) {
      return 'Invalid artifact data. Please check your input.';
    }
    if (error.response?.status === 401) {
      return 'Authentication required. Please log in.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to create artifacts.';
    }
    if (error.response?.status === 404) {
      return 'Museum not found.';
    }
    return 'An error occurred while creating the artifact. Please try again.';
  },

  handleActivationError: (error: any): string => {
    if (error.response?.status === 401) {
      return 'Authentication required. Please log in.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to activate artifacts.';
    }
    if (error.response?.status === 404) {
      return 'Artifact not found.';
    }
    return 'An error occurred while activating the artifact. Please try again.';
  },
};
