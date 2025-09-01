import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  PaginatedResponse,
  Pagination,
  useMutation,
  useQuery,
  useQueryClient,
} from '@musetrip360/query-foundation';
import { MuseumRequest, MuseumRequestCreate, MuseumRequestSearchParams } from '../../types';
import { museumRequestManagementCacheKeys } from '../cache/cacheKeys';
import {
  approveMuseumRequest,
  createMuseumRequest,
  getMuseumRequestById,
  getMuseumRequests,
  getUserMuseumRequests,
  rejectMuseumRequest,
  updateMuseumRequest,
} from '../endpoints';

export function useCreateMuseumRequest(options?: CustomMutationOptions<MuseumRequest, APIError, MuseumRequestCreate>) {
  const queryClient = useQueryClient();

  return useMutation((data: MuseumRequestCreate) => createMuseumRequest(data), {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [museumRequestManagementCacheKeys.all],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useUpdateMuseumRequest(options?: CustomMutationOptions<MuseumRequest, APIError, MuseumRequest>) {
  const queryClient = useQueryClient();

  return useMutation((data: MuseumRequest) => updateMuseumRequest(data.id!, data), {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [museumRequestManagementCacheKeys.all],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useApproveMuseumRequest(options?: CustomMutationOptions<MuseumRequest, APIError, string>) {
  const queryClient = useQueryClient();

  return useMutation((id: string) => approveMuseumRequest(id), {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [museumRequestManagementCacheKeys.all],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useRejectMuseumRequest(options?: CustomMutationOptions<MuseumRequest, APIError, string>) {
  const queryClient = useQueryClient();

  return useMutation((id: string) => rejectMuseumRequest(id), {
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [museumRequestManagementCacheKeys.all],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}

export function useGetMuseumRequestById(id: string, options?: CustomQueryOptions<MuseumRequest>) {
  return useQuery([museumRequestManagementCacheKeys.museumRequest(id)], () => getMuseumRequestById(id), options);
}

export function useGetMuseumRequests(
  params: MuseumRequestSearchParams,
  options?: CustomQueryOptions<PaginatedResponse<MuseumRequest>>
) {
  return useQuery([museumRequestManagementCacheKeys.museumRequests(params)], () => getMuseumRequests(params), {
    placeholderData: (previousData: PaginatedResponse<MuseumRequest> | undefined) => previousData,
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
