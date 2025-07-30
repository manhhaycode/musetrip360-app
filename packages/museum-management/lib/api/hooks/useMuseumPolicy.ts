import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  PaginatedResponse,
  Pagination,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';
import { MuseumPolicy, MuseumPolicyCreate, MuseumPolicyUpdate } from '@/types';
import { createBulkPolicies, createPolicy, deletePolicy, getPoliciesByMuseum, updatePolicy } from '../endpoints';
import { museumPolicyManagementCacheKeys } from '../cache/cacheKeys';

export function useCreateBulkPolicies(options?: CustomMutationOptions<MuseumPolicy[], APIError, MuseumPolicyCreate[]>) {
  return useMutation((data: MuseumPolicyCreate[]) => createBulkPolicies(data), options);
}

export function useGetPoliciesByMuseum(
  museumId: string,
  params: Pagination,
  options?: CustomQueryOptions<PaginatedResponse<MuseumPolicy>>
) {
  return useQuery(
    [museumPolicyManagementCacheKeys.museumPolicies(museumId, params)],
    () => getPoliciesByMuseum(museumId, params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    }
  );
}

export function useCreatePolicy(options?: CustomMutationOptions<MuseumPolicy, APIError, MuseumPolicyCreate>) {
  return useMutation((data: MuseumPolicyCreate) => createPolicy(data), options);
}

export function useUpdatePolicy(options?: CustomMutationOptions<MuseumPolicy, APIError, MuseumPolicyUpdate>) {
  return useMutation((data: MuseumPolicyUpdate) => updatePolicy(data.id, data), options);
}

export function useDeletePolicy(options?: CustomMutationOptions<MuseumPolicy, APIError, string>) {
  return useMutation((id: string) => deletePolicy(id), options);
}
