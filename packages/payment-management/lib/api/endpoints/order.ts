/**
 * @fileoverview Museum AI Chat Endpoints
 *
 * API endpoints for museum search operations.
 */

import { APIResponse, getHttpClient, PaginatedResponse } from '@musetrip360/query-foundation';
import { Order, CreateOrder, OrderSearchParams, OrderMetadata } from '@/types';

/**
 * Order API endpoints configuration
 */
export const orderEndpoints = {
  orders: '/orders',
  orderById: (id: string) => `/orders/${id}`,
  orderByCode: (code: string) => `/orders/code/${code}`,
  orderExisted: (id: string) => `/orders/item/${id}/verify-order-for-item-exist`,
  admin: '/orders/admin',
} as const;

export const getOrders = async (params: OrderSearchParams) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Order>>>(orderEndpoints.orders, { params });
  return response.data;
};

export const getAdminOrders = async (params: OrderSearchParams) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Order>>>(orderEndpoints.admin, { params });
  return response.data;
};

export const getOrderById = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Order>>(orderEndpoints.orderById(id));
  return response.data;
};

export const getOrderByCode = async (code: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Order>>(orderEndpoints.orderByCode(code));
  return response.data;
};

export const createOrder = async (data: CreateOrder) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<OrderMetadata>>(orderEndpoints.orders, data);
  return response.data;
};

export const checkOrderExisted = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<boolean>>(orderEndpoints.orderExisted(id));
  return response.data;
};

/**
 * Order search error handler
 */
export const orderErrorHandler = {
  handleSearchError: (error: any): string => {
    if (error.response?.status === 400) {
      return 'Invalid search parameters. Please check your input.';
    }
    if (error.response?.status === 404) {
      return 'No orders found matching your criteria.';
    }
    if (error.response?.status === 500) {
      return 'Server error occurred while searching orders. Please try again later.';
    }
    return 'An unexpected error occurred. Please try again.';
  },

  handleGetError: (error: any): string => {
    if (error.response?.status === 404) {
      return 'Museum not found.';
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to access this museum.';
    }
    return 'An error occurred while loading the museum. Please try again.';
  },
};
