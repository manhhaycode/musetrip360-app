import { useQuery } from '@musetrip360/query-foundation';

import { type Museum } from '@/types';
import { getMuseumById, getUserMuseums } from '../endpoints/museums';
import { museumManagementCacheKeys } from '../cache/cacheKeys';

export function useGetUserMuseums() {
  return useQuery<Museum[]>([museumManagementCacheKeys.userMuseums()], getUserMuseums);
}

export function useGetMuseumById(id: string) {
  return useQuery<Museum>([museumManagementCacheKeys.museum(id)], () => getMuseumById(id));
}
