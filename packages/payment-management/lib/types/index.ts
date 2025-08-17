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
