import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';
import { orderManagementCacheKeys } from '../cache/cacheKeys';
import {
  buySubscription,
  createPlan,
  deletePlan,
  generateContract,
  getAdminPlans,
  getMuseumSubscriptions,
  getPlans,
  updatePlan,
  getAdminSubscriptions,
} from '../endpoints';
import { BuySubscription, OrderMetadata, Plan, PlanCreate, PlanUpdate, SubscriptionParams } from '@/types';

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

export function useGetAdminPlans(options?: CustomQueryOptions) {
  return useQuery(orderManagementCacheKeys.adminPlans(), () => getAdminPlans(), options);
}

export function useCreatePlan(options?: CustomMutationOptions<Plan, APIError, PlanCreate>) {
  return useMutation((data: PlanCreate) => createPlan(data), {
    ...options,
  });
}

export function useUpdatePlan(options?: CustomMutationOptions<Plan, APIError, PlanUpdate>) {
  return useMutation((data: PlanUpdate) => updatePlan(data), {
    ...options,
  });
}

export function useDeletePlan(options?: CustomMutationOptions<void, APIError, any>) {
  return useMutation((planId: string) => deletePlan(planId), {
    ...options,
  });
}

export function useBuySubscription(options?: CustomMutationOptions<OrderMetadata, APIError, BuySubscription>) {
  return useMutation((data: BuySubscription) => buySubscription(data), {
    ...options,
  });
}

export function useGenerateContract(options?: CustomMutationOptions<{ url: string }, APIError, BuySubscription>) {
  return useMutation((data: BuySubscription) => generateContract(data), {
    ...options,
  });
}

export function useGetAdminSubscriptions(params: SubscriptionParams, options?: CustomQueryOptions) {
  return useQuery(orderManagementCacheKeys.adminSubscriptionList(params), () => getAdminSubscriptions(params), options);
}
