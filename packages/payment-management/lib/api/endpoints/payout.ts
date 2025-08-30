import { MuseumWallet, Payout, PayoutCreate, PayoutParams, PayoutUpdate } from '@/types';
import { APIResponse, getHttpClient, PaginatedResponse } from '@musetrip360/query-foundation';

export const payoutEndpoints = {
  museumWallet: (museumId: string) => `/wallets/museum/${museumId}`,
  payouts: `/wallets/payouts`,
  payoutsAdmin: `/wallets/payouts/admin`,
  museumPayouts: (museumId: string) => `/wallets/payouts/museum/${museumId}`,
  payoutApprove: (payoutId: string) => `/wallets/payouts/${payoutId}/approve`,
  payoutReject: (payoutId: string) => `/wallets/payouts/${payoutId}/reject`,
};

export const getMuseumWallet = async (museumId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<MuseumWallet>>(payoutEndpoints.museumWallet(museumId));
  return response.data;
};

export const getPayouts = async () => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Payout[]>>(payoutEndpoints.payouts);
  return response.data;
};

export const getPayoutsAdmin = async (params: PayoutParams) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<PaginatedResponse<Payout>>>(payoutEndpoints.payoutsAdmin, {
    params,
  });
  return response.data;
};

export const getMuseumPayouts = async (museumId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<Payout[]>>(payoutEndpoints.museumPayouts(museumId));
  return response.data;
};

export const createPayout = async (data: PayoutCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<Payout>>(payoutEndpoints.payouts, data);
  return response.data;
};

export const approvePayout = async (data: PayoutUpdate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Payout>>(payoutEndpoints.payoutApprove(data.id), data);
  return response.data;
};

export const rejectPayout = async (data: PayoutUpdate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<Payout>>(payoutEndpoints.payoutReject(data.id), data);
  return response.data;
};
