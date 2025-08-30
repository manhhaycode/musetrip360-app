import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  PaginatedResponse,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';

import {
  createPayout,
  getMuseumPayouts,
  getPayouts,
  approvePayout,
  rejectPayout,
  getMuseumWallet,
  getPayoutsAdmin,
} from '../endpoints/payout';
import { MuseumWallet, Payout, PayoutCreate, PayoutUpdate, PayoutParams } from '@/types';

export function usePayouts(options?: CustomQueryOptions<Payout[]>) {
  return useQuery(['payouts'], () => getPayouts(), options);
}

export function useMuseumPayouts(museumId: string, options?: CustomQueryOptions<Payout[]>) {
  return useQuery(['payouts', museumId], () => getMuseumPayouts(museumId), options);
}

export function usePayoutsAdmin(params: PayoutParams, options?: CustomQueryOptions<PaginatedResponse<Payout>>) {
  return useQuery(['payoutsAdmin', params], () => getPayoutsAdmin(params), options);
}

export function useMuseumWallet(museumId: string, options?: CustomQueryOptions<MuseumWallet>) {
  return useQuery(['museumWallet', museumId], () => getMuseumWallet(museumId), options);
}

export function useCreatePayout(options?: CustomMutationOptions<Payout, APIError, PayoutCreate>) {
  return useMutation((data: PayoutCreate) => createPayout(data), options);
}

export function useApprovePayout(options?: CustomMutationOptions<Payout, APIError, PayoutUpdate>) {
  return useMutation((data: PayoutUpdate) => approvePayout(data), options);
}

export function useRejectPayout(options?: CustomMutationOptions<Payout, APIError, PayoutUpdate>) {
  return useMutation((data: PayoutUpdate) => rejectPayout(data), options);
}
