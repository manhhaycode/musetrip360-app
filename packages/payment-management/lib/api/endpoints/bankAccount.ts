import { BankAccount, BankAccountCreate } from '@/types';
import { APIResponse, getHttpClient } from '@musetrip360/query-foundation';

export const bankAccountEndpoints = {
  bankAccounts: (museumId: string) => `/bank-accounts/museum/${museumId}`,
  bankAccountById: (id: string) => `/bank-accounts/${id}`,
};

export const getMuseumBankAccounts = async (museumId: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<BankAccount[]>>(bankAccountEndpoints.bankAccounts(museumId));
  return response.data;
};

export const getBankAccountById = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.get<APIResponse<BankAccount>>(bankAccountEndpoints.bankAccountById(id));
  return response.data;
};

export const createBankAccount = async (data: BankAccountCreate) => {
  const httpClient = getHttpClient();
  const response = await httpClient.post<APIResponse<BankAccount>>(
    bankAccountEndpoints.bankAccounts(data.museumId),
    data
  );
  return response.data;
};

export const updateBankAccount = async (id: string, data: Partial<BankAccountCreate>) => {
  const httpClient = getHttpClient();
  const response = await httpClient.put<APIResponse<BankAccount>>(bankAccountEndpoints.bankAccountById(id), data);
  return response.data;
};

export const deleteBankAccount = async (id: string) => {
  const httpClient = getHttpClient();
  const response = await httpClient.delete<APIResponse<void>>(bankAccountEndpoints.bankAccountById(id));
  return response.data;
};
