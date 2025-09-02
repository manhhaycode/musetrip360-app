import { useGetPoliciesByMuseum } from '@musetrip360/museum-management/api';

interface PolicySearchParams {
  Page?: number;
  PageSize?: number;
}

export const usePolicies = (museumId: string, params?: PolicySearchParams, options?: { enabled?: boolean }) => {
  const apiResult = useGetPoliciesByMuseum(
    museumId,
    {
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 100,
    },
    {
      enabled: options?.enabled !== false && !!museumId,
    }
  );

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

export type { PolicySearchParams };
