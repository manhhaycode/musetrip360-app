/**
 * @fileoverview Museum Management Types
 *
 * Type definitions for museum management operations including museums,
 * exhibitions, and devices.
 */
import { Pagination } from '@musetrip360/query-foundation';
import { IUser } from '@musetrip360/user-management/types';

export type Order = {
  id: string;
  totalAmount: number;
  status: PaymentStatusEnum;
  orderType: OrderTypeEnum;
  metadata?: OrderMetadata;
  createdByUser: IUser;
  createdAt: Date;
  updatedAt: Date;
};

export enum PaymentStatusEnum {
  Pending = 'Pending',
  Success = 'Success',
  Canceled = 'Canceled',
}

export enum OrderTypeEnum {
  Subscription = 'Subscription',
  Event = 'Event',
  Tour = 'Tour',
}

export type CreateOrder = {
  orderType: OrderTypeEnum;
  metadata?: any;
  itemIds: string[];
  returnUrl?: string;
  cancelUrl?: string;
};

export type OrderSearchParams = {
  status?: PaymentStatusEnum;
  orderType?: OrderTypeEnum;
} & Pagination;

export type OrderMetadata = {
  checkoutUrl: string;
  orderCode: number;
  expiredAt?: Date;
  paymentLinkId?: string;
  status?: string;
  currency?: string;
  amount: number;
  description?: string;
  bin?: string;
  accountNumber?: string;
  qrCode?: string;
};

export type Plan = {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  maxEvents?: number;
  discountPercent?: number; // from 0 - 100
  isActive: boolean;
  subscriptionCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Subscription = {
  id: string;
  userId: string;
  planId: string;
  orderId: string;
  museumId: string;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  metadata?: SubscriptionMetadata;
  user?: IUser;
  plan?: Plan;
  museum?: any;
};

export enum SubscriptionStatusEnum {
  Active = 'Active',
  Expired = 'Expired',
  Cancelled = 'Cancelled',
}

export type BuySubscription = {
  planId: string;
  museumId: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: SubscriptionMetadata;
};

export type SubscriptionMetadata = {
  documents: string[];
};
