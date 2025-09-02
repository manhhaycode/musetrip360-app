'use client';

import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { useSearchEvents } from '@musetrip360/event-management/api';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { cn } from '@musetrip360/ui-core/utils';
import { ArrowRight } from 'lucide-react';
import { EventCard } from '../event/EventCard';
import { useMemo } from 'react';
import { EventStatusEnum } from '@musetrip360/event-management/types';
import Link from 'next/link';

export function UpcomingEvents() {
  // Fetch museums first to get their events
  const { data: eventData, isLoading } = useSearchEvents({
    Page: 1,
    PageSize: 10000,
  });

  const eventList = useMemo(() => {
    return (
      eventData?.list
        .filter(
          (event) =>
            event.status === EventStatusEnum.Published &&
            (new Date(event.startTime) >= new Date() ||
              (!event.price && new Date(event.endTime) >= new Date() && event.availableSlots > 0))
        )
        .slice(0, 6) || []
    );
  }, [eventData]);

  const { ref, visibleItems } = useStaggeredAnimation(eventData?.total || 0, 150);

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-screen-2xl px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-lg font-medium rounded-xl p-2">
            📅 Sự kiện sắp diễn ra
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight mb-4 lg:text-4xl">
            Tham gia{' '}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
              sự kiện hấp dẫn
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Đăng ký tham gia các triển lãm, workshop và sự kiện văn hóa độc đáo từ khắp nơi trên thế giới.
          </p>
        </div>

        {/* Events Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : eventList.map((event, index) => {
                const isVisible = visibleItems.includes(index);
                return (
                  <EventCard
                    key={event.id}
                    className={cn(isVisible ? 'opacity-100' : 'opacity-0', 'transition-opacity duration-300')}
                    event={event}
                    onBooking={() => {}}
                  />
                );
              })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link href={'/search?type=Event'}>
            <Button size="lg" variant="outline" className="group">
              Xem tất cả sự kiện
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
