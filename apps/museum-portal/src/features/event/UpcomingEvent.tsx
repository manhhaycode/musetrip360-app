import { Badge, Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core';
import { Event, EventStatusEnum, useGetEventsByMuseumId } from '@musetrip360/event-management';
import { useMuseumStore } from '@musetrip360/museum-management';
import { EventStatusName, EventTypeName } from '@/config/constants/event';
import get from 'lodash.get';
import { useMemo } from 'react';

const getStatusVariant = (status: EventStatusEnum) => {
  switch (status) {
    case EventStatusEnum.Published:
      return 'default';
    case EventStatusEnum.Pending:
      return 'secondary';
    case EventStatusEnum.Draft:
      return 'outline';
    case EventStatusEnum.Cancelled:
      return 'destructive';
    case EventStatusEnum.Expired:
      return 'destructive';
    default:
      return 'outline';
  }
};

const UpcomingEvent = () => {
  const { selectedMuseum } = useMuseumStore();
  const museumId = selectedMuseum?.id || '';

  // Use same parameters as EventDataTable to leverage cache
  const queryParams = useMemo(
    () => ({
      Page: 1,
      PageSize: 10,
    }),
    []
  );

  const { data: eventsData, isLoading } = useGetEventsByMuseumId(museumId, queryParams, {
    enabled: !!museumId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Filter for upcoming events
  const upcomingEvents = useMemo(() => {
    const events = get(eventsData, 'list', []) as Event[];
    const now = new Date();

    return events
      .filter((event) => {
        const startTime = new Date(event.startTime);
        return event.status === EventStatusEnum.Published && startTime > now;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 4);
  }, [eventsData]);

  if (!museumId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sự kiện sắp tới</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chọn bảo tàng để xem sự kiện sắp tới</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sự kiện sắp tới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sự kiện sắp tới</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Không có sự kiện sắp tới</p>
          ) : (
            upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium truncate">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.startTime).toLocaleDateString('vi-VN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.capacity - event.availableSlots}/{event.capacity} người tham dự
                  </p>
                  <p className="text-xs text-muted-foreground">{EventTypeName[event.eventType] || event.eventType}</p>
                </div>
                <Badge variant={getStatusVariant(event.status)}>{EventStatusName[event.status] || 'N/A'}</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvent;
