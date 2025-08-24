import { useGetEventsByMuseumId } from '@musetrip360/event-management/api';

interface EventSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
  eventType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const useEvents = (params?: EventSearchParams, options?: { enabled?: boolean }) => {
  console.log('📅 useEvents called with params:', params);
  console.log('📅 useEvents options:', options);

  // Use real API - fix function name
  const apiResult = useGetEventsByMuseumId(
    params?.museumId || '',
    {
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 12,
    },
    {
      enabled: options?.enabled !== false && !!params?.museumId,
      refetchOnWindowFocus: false,
    }
  );

  console.log('📅 useEvents API result:', {
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
