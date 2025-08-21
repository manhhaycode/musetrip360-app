import { useVirtualTourByMuseum } from '@musetrip360/virtual-tour/api';

interface VirtualTourSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
}

export const useVirtualTours = (params?: VirtualTourSearchParams) => {
  // Use real API exactly like visitor-portal
  const apiResult = useVirtualTourByMuseum({
    museumId: params?.museumId || '',
    Page: params?.Page || 1,
    PageSize: params?.PageSize || 10,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};
