/**
 * @fileoverview Museum Request management
 *
 * API endpoints for museum request management.
 */

import { APIResponse, getHttpClient, PaginatedResponse, Pagination } from '@musetrip360/query-foundation';
import { MuseumRequest, MuseumRequestCreate } from '@/types';

/**
 * Museum Request API endpoints configuration
 */
export const museumRequestEndpoints = {
  createRequest: 'museums/requests',
  updateRequest: (id: string) => `museums/requests/${id}`,
  approveRequest: (id: string) => `museums/requests/${id}/approve`,
  rejectRequest: (id: string) => `museums/requests/${id}/reject`,
  getRequestById: (id: string) => `museums/requests/${id}`,
  getRequests: 'museums/requests',
  getUserRequests: 'museums/requests/user',
} as const;

export const createMuseumRequest = async (data: MuseumRequestCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<MuseumRequest>>(museumRequestEndpoints.createRequest, data);
  return response.data;
};

export const updateMuseumRequest = async (id: string, data: Partial<MuseumRequest>) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<MuseumRequest>>(museumRequestEndpoints.updateRequest(id), data);
  return response.data;
};

export const approveMuseumRequest = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<MuseumRequest>>(museumRequestEndpoints.approveRequest(id));
  return response.data;
};

export const rejectMuseumRequest = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<MuseumRequest>>(museumRequestEndpoints.rejectRequest(id));
  return response.data;
};

export const getMuseumRequestById = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<MuseumRequest>>(museumRequestEndpoints.getRequestById(id));
  return response.data;
};

export const getMuseumRequests = async (params: Pagination) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<MuseumRequest>>>(
    museumRequestEndpoints.getRequests,
    { params }
  );
  return response.data;
};

export const getUserMuseumRequests = async (params: Pagination) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<MuseumRequest>>>(
    museumRequestEndpoints.getUserRequests,
    { params }
  );
  return response.data;
};
