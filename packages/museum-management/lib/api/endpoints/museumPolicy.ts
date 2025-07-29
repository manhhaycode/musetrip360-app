/**
 * @fileoverview Museum Policy management
 *
 * API endpoints for museum policy management.
 */

import { APIResponse, getHttpClient, PaginatedResponse, Pagination } from '@musetrip360/query-foundation';
import { MuseumPolicy, MuseumPolicyCreate, MuseumPolicyUpdate } from '@/types';

/**
 * Museum Policy API endpoints configuration
 */
export const museumPolicyEndpoints = {
  getPoliciesByMuseum: (museumId: string) => `museums/policies/museum/${museumId}`,
  createBulkPolicies: 'museums/policies/bulk',
  createPolicy: 'museums/policies',
  updatePolicy: (policyId: string) => `museums/policies/${policyId}`,
  deletePolicy: (policyId: string) => `museums/policies/${policyId}`,
} as const;

export const getPoliciesByMuseum = async (museumId: string, params: Pagination) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<MuseumPolicy>>>(
    museumPolicyEndpoints.getPoliciesByMuseum(museumId),
    { params }
  );
  return response.data;
};

export const createBulkPolicies = async (data: MuseumPolicyCreate[]) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<MuseumPolicy[]>>(museumPolicyEndpoints.createBulkPolicies, data);
  return response.data;
};

export const createPolicy = async (data: MuseumPolicyCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<MuseumPolicy>>(museumPolicyEndpoints.createPolicy, data);
  return response.data;
};

export const updatePolicy = async (policyId: string, data: MuseumPolicyUpdate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<MuseumPolicy>>(museumPolicyEndpoints.updatePolicy(policyId), data);
  return response.data;
};

export const deletePolicy = async (policyId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.delete<APIResponse<MuseumPolicy>>(museumPolicyEndpoints.deletePolicy(policyId));
  return response.data;
};
