/**
 * @fileoverview Order Management Cache Keys
 *
 * Cache key definitions for Order management-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { OrderSearchParams, SubscriptionParams } from '@/types';
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
  plans(): QueryKey {
    return [this.prefix, 'plans'];
  }
  adminPlans(): QueryKey {
    return [this.prefix, 'plans', 'admin'];
  }
  planDetail(planId: string): QueryKey {
    return [this.prefix, 'plans', planId];
  }
  museumSubscriptions(museumId: string): QueryKey {
    return [this.prefix, 'museumSubscriptions', museumId];
  }
  museumSubscriptionList(): QueryKey {
    return [this.prefix, 'museumSubscriptions'];
  }
  adminSubscriptionList(params: SubscriptionParams): QueryKey {
    return [
      this.prefix,
      'adminSubscriptions',
      params.Page,
      params.PageSize,
      params.museumId,
      params.planId,
      params.status,
    ];
  }
  checkExisted(id: string): QueryKey {
    return [this.prefix, 'checkExisted', id];
  }
}

/**
 * Default cache keys instance
 */
export const orderManagementCacheKeys = new OrderManagementCacheKeys();
