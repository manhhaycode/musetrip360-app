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
  orderEvents?: OrderEvent[];
};

export type OrderEvent = {
  orderId: string;
  eventId: string;
  event?: {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  };
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

export type PlanCreate = {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  maxEvents?: number;
  discountPercent?: number; // from 0 - 100
  isActive: boolean;
};
export type PlanUpdate = Partial<PlanCreate> & { id: string };

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
  order?: Order;
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

export type SubscriptionParams = {
  museumId?: string;
  planId?: string;
  status?: SubscriptionStatusEnum;
} & Pagination;

export type BankAccount = {
  id: string;
  museumId: string;
  userId: string;
  holderName: string;
  bankName: string;
  accountNumber: string;
  qrCode: string;
};

export type BankAccountCreate = {
  museumId: string;
  userId: string;
  holderName: string;
  bankName: string;
  accountNumber: string;
  qrCode: string;
};

export type BankAccountUpdate = Partial<BankAccountCreate> & { id: string };

export type MuseumWallet = {
  id: string;
  museumId: string;
  availableBalance: number;
  pendingBalance: number;
  totalBalance: number;
};

export type Payout = {
  id: string;
  museumId: string;
  bankAccountId: string;
  amount: number;
  processedDate: string;
  status: PayoutStatusEnum;
  metadata?: PayoutMetadata;
  bankAccount?: BankAccount;
  museum?: {
    id: string;
    name: string;
    description: string;
    location: string;
    contactEmail: string;
    contactPhone: string;
  };
};

export type PayoutMetadata = {
  imageUrl?: string;
  note?: string;
};

export type PayoutCreate = {
  museumId: string;
  bankAccountId: string;
  amount: number;
  metadata?: PayoutMetadata;
};

export type PayoutUpdate = {
  id: string;
  bankAccountId?: string;
  amount?: number;
  metadata?: PayoutMetadata;
};

export type PayoutParams = {
  museumId?: string;
  bankAccountId?: string;
  status?: PayoutStatusEnum;
} & Pagination;

export enum PayoutStatusEnum {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}
