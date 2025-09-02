import { useGetEventById, useGetEventsByMuseumId, useSearchEvents } from '@musetrip360/event-management/api';

interface EventSearchParams {
  Page?: number;
  PageSize?: number;
  Search?: string;
}

export const useEvents = (params?: EventSearchParams, options?: { enabled?: boolean }) => {
  const apiResult = useSearchEvents({
    Page: params?.Page || 1,
    PageSize: params?.PageSize || 12,
    Search: params?.Search,
  }, {
    enabled: options?.enabled !== false,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

// New hook for getting events by museum ID
export const useMuseumEvents = (museumId: string, params?: EventSearchParams, options?: { enabled?: boolean }) => {
  const apiResult = useGetEventsByMuseumId(museumId, {
    Page: params?.Page || 1,
    PageSize: params?.PageSize || 12,
    Search: params?.Search,
  }, {
    enabled: options?.enabled !== false && !!museumId,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

// New hook for getting event details by ID
export const useEventDetail = (eventId: string, options?: { enabled?: boolean }) => {
  const apiResult = useGetEventById(eventId, {
    enabled: options?.enabled !== false && !!eventId,
  });

  return {
    data: apiResult.data,
    isLoading: apiResult.isLoading,
    error: apiResult.error,
    refetch: apiResult.refetch,
  };
};

export type { EventSearchParams };
