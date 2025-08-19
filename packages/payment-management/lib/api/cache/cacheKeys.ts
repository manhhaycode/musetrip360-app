/**
 * @fileoverview Order Management Cache Keys
 *
 * Cache key definitions for Order management-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { OrderSearchParams } from '@/types';
import { BaseCacheKeyFactory, QueryKey } from '@musetrip360/query-foundation';

/**
 * Order Management cache keys
 */
export class OrderManagementCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('OrderManagement');
  }

  orders(params: OrderSearchParams): QueryKey {
    return [this.prefix, 'orders', params.Page, params.PageSize, params.status, params.orderType];
  }
  adminOrders(params: OrderSearchParams): QueryKey {
    return [this.prefix, 'adminOrders', params.Page, params.PageSize, params.status, params.orderType];
  }
}

/**
 * Default cache keys instance
 */
export const orderManagementCacheKeys = new OrderManagementCacheKeys();
