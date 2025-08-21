import { useGetMuseumById, useMuseums as useMuseumsApi } from '@musetrip360/museum-management/api';

interface MuseumSearchParams {
  Page?: number;
  PageSize?: number;
  Search?: string;
}

export const useMuseums = (params?: MuseumSearchParams, options?: { enabled?: boolean }) => {
  console.log('🏛️ useMuseums called with params:', params);
  console.log('🏛️ useMuseums options:', options);

  // Use real API exactly like visitor-portal
  const apiResult = useMuseumsApi(
    {
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 10,
      Search: params?.Search,
    },
    {
      enabled: options?.enabled !== false,
    }
  );

  console.log('🏛️ useMuseums API result:', {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

export const useMuseum = (id: string) => {
  // Use real API exactly like visitor-portal
  const apiResult = useGetMuseumById(id, {
    enabled: !!id,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};
