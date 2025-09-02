import { useVirtualTourById, useVirtualTours as useVirtualToursAPI } from '@musetrip360/virtual-tour/api';

interface VirtualTourSearchParams {
  Page?: number;
  PageSize?: number;
  Search?: string;
  museumId?: string;
}

export const useVirtualTours = (params?: VirtualTourSearchParams, options?: { enabled?: boolean }) => {
  const apiResult = useVirtualToursAPI(
    {
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 12,
      Search: params?.Search,
    },
    {
      enabled: options?.enabled !== false,
    }
  );

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

export const useVirtualTourDetail = (tourId: string) => {
  const apiResult = useVirtualTourById(tourId);

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

export type { VirtualTourSearchParams };
