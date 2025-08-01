import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@musetrip360/query-foundation';

import { Museum, MuseumCreateDto, MuseumSearchParams, MuseumSearchResponse } from '../../types';
import { museumManagementCacheKeys } from '../cache/cacheKeys';
import { createMuseum, getMuseumById, getMuseums, getUserMuseums, updateMuseum } from '../endpoints/museums';

export function useGetUserMuseums(options?: CustomQueryOptions<Museum[]>) {
  return useQuery([museumManagementCacheKeys.userMuseums()], () => getUserMuseums(), {
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  });
}

export function useMuseums(params: MuseumSearchParams, options?: CustomQueryOptions<MuseumSearchResponse>) {
  return useQuery([museumManagementCacheKeys.museums(), params], () => getMuseums(params), {
    placeholderData: (previousData: MuseumSearchResponse | undefined) => previousData,
    ...options,
  });
}

export function useGetMuseumById(id: string, options?: CustomQueryOptions<Museum>) {
  return useQuery([museumManagementCacheKeys.museum(id)], () => getMuseumById(id), options);
}

export function useUpdateMuseum(options?: CustomMutationOptions<Museum, APIError, Partial<Museum>>) {
  return useMutation((data: Partial<Museum>) => updateMuseum(data.id!, data), options);
}

export function useCreateMuseum(options?: CustomMutationOptions<Museum, APIError, MuseumCreateDto>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation((data: MuseumCreateDto) => createMuseum(data), {
    mutationKey: museumManagementCacheKeys.createMuseum(),
    onSuccess: (data, variables, context) => {
      // Invalidate museums list to refresh the data
      queryClient.invalidateQueries({ queryKey: museumManagementCacheKeys.museums() });

      onSuccess?.(data, variables, context);
    },
    ...restOptions,
  });
}
