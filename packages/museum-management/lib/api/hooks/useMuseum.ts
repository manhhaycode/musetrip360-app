import { CustomQueryOptions, useQuery } from '@musetrip360/query-foundation';

import { getMuseumById, getUserMuseums } from '../endpoints/museums';
import { museumManagementCacheKeys } from '../cache/cacheKeys';
import { Museum } from '@/types';

export function useGetUserMuseums(options?: CustomQueryOptions<Museum[]>) {
  return useQuery([museumManagementCacheKeys.userMuseums()], () => getUserMuseums(), {
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  });
}

export function useGetMuseumById(id: string, options?: CustomQueryOptions) {
  return useQuery([museumManagementCacheKeys.museum(id)], () => getMuseumById(id), options);
}
