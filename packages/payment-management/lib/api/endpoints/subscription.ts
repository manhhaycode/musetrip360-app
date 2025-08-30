import {
  BuySubscription,
  OrderMetadata,
  Plan,
  PlanCreate,
  PlanUpdate,
  Subscription,
  SubscriptionParams,
} from '@/types';
import { APIResponse, getHttpClient, PaginatedResponse } from '@musetrip360/query-foundation';

export const subscriptionEndpoints = {
  plans: '/subscriptions/plans',
  adminPlan: '/subscriptions/plans/admin',
  getPlanById: (planId: string) => `/subscriptions/plans/${planId}`,
  buy: '/subscriptions/buy',
  getMuseumSubscriptions: (museumId: string) => `/subscriptions/museum/${museumId}`,
  generateContract: '/subscriptions/contract/generate',
  getAdminSubscriptions: () => `/subscriptions/admin`,
};

export const getPlans = async () => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Plan[]>>(subscriptionEndpoints.plans);
  return response.data;
};

export const getPlanDetail = async (planId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Plan>>(subscriptionEndpoints.getPlanById(planId));
  return response.data;
};

export const getAdminPlans = async () => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Plan[]>>(subscriptionEndpoints.adminPlan);
  return response.data;
};

export const createPlan = async (data: PlanCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<Plan>>(subscriptionEndpoints.plans, data);
  return response.data;
};

export const updatePlan = async (data: PlanUpdate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Plan>>(subscriptionEndpoints.getPlanById(data.id), data);
  return response.data;
};

export const deletePlan = async (planId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.delete<APIResponse<void>>(subscriptionEndpoints.getPlanById(planId));
  return response.data;
};

export const buySubscription = async (data: BuySubscription) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<OrderMetadata>>(subscriptionEndpoints.buy, data);
  return response.data;
};

export const getMuseumSubscriptions = async (museumId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Subscription[]>>(
    subscriptionEndpoints.getMuseumSubscriptions(museumId)
  );
  return response.data;
};

export const generateContract = async (data: BuySubscription) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<{ url: string }>>(subscriptionEndpoints.generateContract, {
    params: {
      museumId: data.museumId,
      planId: data.planId,
    },
  });
  return response.data;
};

export const getAdminSubscriptions = async (params: SubscriptionParams) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Subscription>>>(
    subscriptionEndpoints.getAdminSubscriptions(),
    { params }
  );
  return response.data;
};
