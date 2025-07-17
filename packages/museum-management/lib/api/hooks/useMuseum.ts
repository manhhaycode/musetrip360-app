import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';

import { Museum } from '@/types';
import { museumManagementCacheKeys } from '../cache/cacheKeys';
import { getMuseumById, getUserMuseums, updateMuseum } from '../endpoints/museums';

export function useGetUserMuseums(options?: CustomQueryOptions<Museum[]>) {
  return useQuery([museumManagementCacheKeys.userMuseums()], () => getUserMuseums(), {
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  });
}

export function useGetMuseumById(id: string, options?: CustomQueryOptions<Museum>) {
  return useQuery([museumManagementCacheKeys.museum(id)], () => getMuseumById(id), options);
}

export function useUpdateMuseum(options?: CustomMutationOptions<Museum, APIError, Partial<Museum>>) {
  return useMutation((data: Partial<Museum>) => updateMuseum(data.id!, data), options);
}
