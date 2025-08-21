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

export const useEvents = (params?: EventSearchParams) => {
  // Use real API exactly like visitor-portal
  const apiResult = useGetEventsByMuseumId(
    params?.museumId || '',
    {
      Page: params?.Page || 1,
      PageSize: params?.PageSize || 10,
      eventType: params?.eventType as any,
      status: params?.status as any,
      startDate: params?.startDate,
      endDate: params?.endDate,
    },
    {
      enabled: !!params?.museumId,
    }
  );

  return apiResult;
};
