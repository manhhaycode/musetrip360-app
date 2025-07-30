import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  PaginatedResponse,
  Pagination,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';
import { MuseumRequest, MuseumRequestCreate } from '@/types';
import {
  approveMuseumRequest,
  createMuseumRequest,
  getMuseumRequestById,
  getMuseumRequests,
  getUserMuseumRequests,
  rejectMuseumRequest,
  updateMuseumRequest,
} from '../endpoints';
import { museumRequestManagementCacheKeys } from '../cache/cacheKeys';

export function useCreateMuseumRequest(options?: CustomMutationOptions<MuseumRequest, APIError, MuseumRequestCreate>) {
  return useMutation((data: MuseumRequestCreate) => createMuseumRequest(data), options);
}

export function useUpdateMuseumRequest(options?: CustomMutationOptions<MuseumRequest, APIError, MuseumRequest>) {
  return useMutation((data: MuseumRequest) => updateMuseumRequest(data.id!, data), options);
}

export function useApproveMuseumRequest(options?: CustomMutationOptions<MuseumRequest, APIError, string>) {
  return useMutation((id: string) => approveMuseumRequest(id), options);
}

export function useRejectMuseumRequest(options?: CustomMutationOptions<MuseumRequest, APIError, string>) {
  return useMutation((id: string) => rejectMuseumRequest(id), options);
}

export function useGetMuseumRequestById(id: string, options?: CustomQueryOptions<MuseumRequest>) {
  return useQuery([museumRequestManagementCacheKeys.museumRequest(id)], () => getMuseumRequestById(id), options);
}

export function useGetMuseumRequests(
  params: Pagination,
  options?: CustomQueryOptions<PaginatedResponse<MuseumRequest>>
) {
  return useQuery([museumRequestManagementCacheKeys.museumRequests(params)], () => getMuseumRequests(params), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

export function useGetUserMuseumRequests(
  params: Pagination,
  options?: CustomQueryOptions<PaginatedResponse<MuseumRequest>>
) {
  return useQuery([museumRequestManagementCacheKeys.userMuseumRequests(params)], () => getUserMuseumRequests(params), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}
