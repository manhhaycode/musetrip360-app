import { useVirtualTourByMuseum } from '@musetrip360/virtual-tour/api';

interface VirtualTourSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
}

export const useVirtualTours = (params?: VirtualTourSearchParams, options?: { enabled?: boolean }) => {
  console.log('🌐 useVirtualTours called with params:', params);
  console.log('🌐 useVirtualTours options:', options);

  // Use real API - fix parameters structure
  const apiResult = useVirtualTourByMuseum({
    museumId: params?.museumId || '',
    Page: params?.Page || 1,
    PageSize: params?.PageSize || 12,
  });

  console.log('🌐 useVirtualTours API result:', {
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
