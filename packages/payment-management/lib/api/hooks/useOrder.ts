// Event management hooks
import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  PaginatedResponse,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';

import { OrderSearchParams, CreateOrder, Order } from '@/types';

import { createOrder, getOrders, getAdminOrders, getOrderById } from '../endpoints';
import { orderManagementCacheKeys } from '../cache/cacheKeys';

export function useGetOrders(params: OrderSearchParams, options?: CustomQueryOptions<PaginatedResponse<Order>>) {
  return useQuery(orderManagementCacheKeys.orders(params), () => getOrders(params), {
    ...options,
  });
}

export function useCreateOrder(options?: CustomMutationOptions<Order, APIError, CreateOrder>) {
  return useMutation((data: CreateOrder) => createOrder(data), options);
}

export function useGetAdminOrders(params: OrderSearchParams, options?: CustomQueryOptions<PaginatedResponse<Order>>) {
  return useQuery(orderManagementCacheKeys.adminOrders(params), () => getAdminOrders(params), {
    ...options,
  });
}

export function useGetOrderById(id: string, options?: CustomQueryOptions<Order>) {
  return useQuery(orderManagementCacheKeys.detail(id), () => getOrderById(id), {
    ...options,
  });
}
