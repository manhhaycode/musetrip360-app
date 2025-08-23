import { BuySubscription, OrderMetadata, Plan, Subscription } from '@/types';
import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';

export const subscriptionEndpoints = {
  plans: '/subscriptions/plans',
  buy: '/subscriptions/buy',
  getMuseumSubscriptions: (museumId: string) => `/subscriptions/museum/${museumId}`,
};

export const getPlans = async () => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Plan[]>>(subscriptionEndpoints.plans);
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
