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
  // Use real API exactly like visitor-portal when museumId is provided
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

  // If no museumId provided, return mock data for homepage
  if (!params?.museumId) {
    const mockEvents = [
      {
        id: '1',
        title: 'Triển lãm Nghệ thuật Đương đại',
        description: 'Khám phá những tác phẩm nghệ thuật hiện đại độc đáo',
        eventType: 'Exhibition' as const,
        startTime: '2025-09-01T09:00:00.000Z',
        endTime: '2025-09-01T17:00:00.000Z',
        location: 'Bảo tàng Mỹ thuật',
        capacity: 100,
        availableSlots: 55,
        bookingDeadline: '2025-08-30T23:59:59.000Z',
        museumId: '1',
        status: 'Published' as const,
        createdAt: '2025-08-01T00:00:00.000Z',
        updatedAt: '2025-08-01T00:00:00.000Z',
      },
      {
        id: '2',
        title: 'Hội thảo Lịch sử Việt Nam',
        description: 'Tìm hiểu về những giai đoạn quan trọng trong lịch sử dân tộc',
        eventType: 'Lecture' as const,
        startTime: '2025-08-25T14:00:00.000Z',
        endTime: '2025-08-25T16:00:00.000Z',
        location: 'Bảo tàng Lịch sử',
        capacity: 50,
        availableSlots: 30,
        bookingDeadline: '2025-08-24T23:59:59.000Z',
        museumId: '2',
        status: 'Published' as const,
        createdAt: '2025-08-01T00:00:00.000Z',
        updatedAt: '2025-08-01T00:00:00.000Z',
      },
    ];

    return {
      data: {
        list: mockEvents,
      },
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }

  return apiResult;
};
