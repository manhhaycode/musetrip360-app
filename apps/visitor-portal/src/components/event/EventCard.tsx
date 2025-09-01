'use client';

import { type Event, EventStatusEnum, EventTypeEnum } from '@musetrip360/event-management/types';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardFooter, CardHeader } from '@musetrip360/ui-core/card';
import { Progress } from '@musetrip360/ui-core/progress';
import { cn } from '@musetrip360/ui-core/utils';
import { ArrowRight, Calendar, Clock, MapPin, Zap } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface EventCardProps {
  event: Event;
  className: string;
  onBooking?: (eventId: string) => void;
}

const eventTypeLabels = {
  [EventTypeEnum.Workshop]: 'Workshop',
  [EventTypeEnum.Exhibition]: 'Triển lãm',
  [EventTypeEnum.HolidayEvent]: 'Sự kiện lễ hội',
  [EventTypeEnum.Lecture]: 'Bài giảng',
  [EventTypeEnum.SpecialEvent]: 'Sự kiện đặc biệt',
  [EventTypeEnum.Other]: 'Khác',
};

const statusLabels = {
  [EventStatusEnum.Pending]: 'Đang chờ duyệt',
  [EventStatusEnum.Draft]: 'Bản nháp',
  [EventStatusEnum.Published]: 'Đã xuất bản',
  [EventStatusEnum.Cancelled]: 'Đã hủy',
  [EventStatusEnum.Expired]: 'Hoàn thành',
};

export function EventCard({ event, className }: EventCardProps) {
  const router = useRouter();
  const capacityPercentage = ((event.capacity - event.availableSlots) / event.capacity) * 100;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const isBookingAvailable = () => {
    const now = new Date();
    const deadline = new Date(event.bookingDeadline);
    return event.status === EventStatusEnum.Published && event.availableSlots > 0 && now < deadline;
  };

  return (
    <Card
      onClick={() => router.push(`/event/${event.id}`)}
      className={cn(
        'w-full max-w-md hover:shadow-lg transition-shadow duration-200 overflow-hidden justify-between group cursor-pointer',
        className
      )}
    >
      {event.metadata?.thumbnail && (
        <div className="relative h-48 w-full">
          <Image
            src={event.metadata?.thumbnail || '/placeholder.svg'}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight text-balance">{event.title}</h3>
          <Badge variant={event.status === EventStatusEnum.Published ? 'default' : 'secondary'}>
            {statusLabels[event.status]}
          </Badge>
        </div>
        <Badge variant="outline" className="w-fit">
          {eventTypeLabels[event.eventType]}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{formatDate(event.startTime)}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground shrink-0" />
            <span className="truncate font-medium">{event.location}</span>
          </div>

          {/* Capacity Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Đã đăng ký</span>
              <span className="font-medium">
                {event.capacity - event.availableSlots}/{event.capacity}
              </span>
            </div>
            <Progress value={capacityPercentage} className="h-2" />
            {capacityPercentage > 80 && (
              <p className="text-xs text-orange-600 dark:text-orange-400">
                <Zap className="inline h-3 w-3 mr-1" />
                Sắp hết chỗ!
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              Đăng ký đến: <span className="font-medium">{formatDate(event.bookingDeadline)}</span>
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex flex-1 items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">
              {event.price ? formatPrice(event.price) : 'Miễn phí'}
            </span>
          </div>
          <Button
            disabled={isBookingAvailable()}
            size="sm"
            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            Đăng ký
            <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
