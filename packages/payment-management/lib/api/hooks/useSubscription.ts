import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';
import { orderManagementCacheKeys } from '../cache/cacheKeys';
import { buySubscription, getMuseumSubscriptions, getPlans } from '../endpoints';
import { BuySubscription, OrderMetadata } from '@/types';

export function useGetMuseumSubscriptions(museumId: string, options?: CustomQueryOptions) {
  return useQuery(
    orderManagementCacheKeys.museumSubscriptions(museumId),
    () => getMuseumSubscriptions(museumId),
    options
  );
}

export function useGetPlans(options?: CustomQueryOptions) {
  return useQuery(orderManagementCacheKeys.plans(), () => getPlans(), options);
}

export function useBuySubscription(options?: CustomMutationOptions<OrderMetadata, APIError, BuySubscription>) {
  return useMutation((data: BuySubscription) => buySubscription(data), {
    ...options,
  });
}
