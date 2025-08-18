'use client';

import { useAuthStore } from '@musetrip360/auth-system';
import { useGetUserEventParticipants } from '@musetrip360/event-management/api';
import { EventParticipant, EventTypeEnum, EventStatusEnum, ParticipantRoleEnum } from '@musetrip360/event-management';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Calendar, Clock, MapPin, Users, Eye, Ticket } from 'lucide-react';

const getEventTypeBadgeVariant = (type: EventTypeEnum) => {
  switch (type) {
    case EventTypeEnum.Exhibition:
      return 'default';
    case EventTypeEnum.Workshop:
      return 'secondary';
    case EventTypeEnum.Lecture:
      return 'outline';
    case EventTypeEnum.SpecialEvent:
      return 'destructive';
    case EventTypeEnum.HolidayEvent:
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getEventTypeText = (type: EventTypeEnum) => {
  switch (type) {
    case EventTypeEnum.Exhibition:
      return 'Triển lãm';
    case EventTypeEnum.Workshop:
      return 'Workshop';
    case EventTypeEnum.SpecialEvent:
      return 'Sự kiện đặc biệt';
    case EventTypeEnum.HolidayEvent:
      return 'Sự kiện lễ hội';
    default:
      return type;
  }
};

const getEventStatusText = (status: EventStatusEnum) => {
  switch (status) {
    case EventStatusEnum.Published:
      return 'Đang diễn ra';
    case EventStatusEnum.Draft:
      return 'Bản nháp';
    case EventStatusEnum.Pending:
      return 'Chờ duyệt';
    case EventStatusEnum.Cancelled:
      return 'Đã hủy';
    case EventStatusEnum.Expired:
      return 'Đã kết thúc';
    default:
      return status;
  }
};

const getRoleText = (role: ParticipantRoleEnum) => {
  switch (role) {
    case ParticipantRoleEnum.Attendee:
      return 'Người tham gia';
    case ParticipantRoleEnum.Organizer:
      return 'Tổ chức';
    case ParticipantRoleEnum.TourGuide:
      return 'Hướng dẫn viên';
    case ParticipantRoleEnum.Guest:
      return 'Khách mời';
    default:
      return role;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function UserEventsPage() {
  const userId = useAuthStore((state) => state.userId);

  const {
    data: eventParticipants,
    isLoading,
    error,
  } = useGetUserEventParticipants(userId || '', {
    enabled: !!userId,
  });

  if (!userId) {
    return (
      <div className="container mx-auto py-8 px-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Vui lòng đăng nhập</h3>
              <p className="text-muted-foreground">Bạn cần đăng nhập để xem các sự kiện đã tham gia.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-6">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Có lỗi xảy ra khi tải danh sách sự kiện. Vui lòng thử lại sau.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const events = eventParticipants || [];

  return (
    <div className="container mx-auto py-8 px-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sự kiện đã tham gia</h1>
            <p className="text-muted-foreground">Danh sách các sự kiện bạn đã tham gia</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Chưa tham gia sự kiện nào</h3>
                <p className="text-muted-foreground">Bạn chưa tham gia sự kiện nào. Hãy khám phá các sự kiện thú vị!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          events.map((participant: EventParticipant) => {
            const event = participant.event;
            if (!event) return null;

            return (
              <Card key={participant.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getEventTypeBadgeVariant(event.eventType)}>
                          {getEventTypeText(event.eventType)}
                        </Badge>
                        <Badge variant="outline">{getRoleText(participant.role)}</Badge>
                      </div>
                      <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
                      <CardDescription className="text-sm">
                        Tham gia ngày: {formatDate(participant.joinedAt)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-muted-foreground line-clamp-2">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Bắt đầu: {formatDate(event.startTime)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Kết thúc: {formatDate(event.endTime)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {event.capacity - event.availableSlots}/{event.capacity} người tham gia
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                          {event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{getEventStatusText(event.status)}</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
