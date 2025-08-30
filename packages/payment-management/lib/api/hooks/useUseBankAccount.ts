import {
  APIError,
  CustomMutationOptions,
  CustomQueryOptions,
  useMutation,
  useQuery,
} from '@musetrip360/query-foundation';

import {
  getMuseumBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
} from '../endpoints/bankAccount';
import { BankAccount, BankAccountCreate } from '@/types';

export function useGetMuseumBankAccounts(museumId: string, options?: CustomQueryOptions<BankAccount[]>) {
  return useQuery([`museumBankAccounts`, museumId], () => getMuseumBankAccounts(museumId), options);
}

export function useCreateBankAccount(options?: CustomMutationOptions<BankAccount, APIError, BankAccountCreate>) {
  return useMutation((data: BankAccountCreate) => createBankAccount(data), options);
}

export function useUpdateBankAccount(id: string, options?: CustomMutationOptions<BankAccount, APIError, BankAccount>) {
  return useMutation((data: BankAccount) => updateBankAccount(id, data), options);
}

export function useDeleteBankAccount(options?: CustomMutationOptions<void, APIError, string>) {
  return useMutation((id: string) => deleteBankAccount(id), options);
}
