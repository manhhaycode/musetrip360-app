import { useGetEventById, useGetEventsByMuseumId } from '@musetrip360/event-management/api';
import { EventStatusEnum, EventTypeEnum } from '@musetrip360/event-management/types';

interface EventSearchParams {
  Page?: number;
  PageSize?: number;
  museumId?: string;
  eventType?: EventTypeEnum;
  status?: EventStatusEnum;
  startDate?: string;
  endDate?: string;
}

export const useEvents = (params?: EventSearchParams, options?: { enabled?: boolean }) => {
  // Use real API
  const apiResult = useGetEventsByMuseumId(
    params?.museumId || '',
    {
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 12,
      EventType: params?.eventType,
      Status: params?.status,
      StartDate: params?.startDate,
      EndDate: params?.endDate,
    },
    {
      enabled: options?.enabled !== false && !!params?.museumId,
      refetchOnWindowFocus: false,
    }
  );

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
