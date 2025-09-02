import { Event, EventTypeEnum, useGetEventRooms, useSearchEvents } from '@musetrip360/event-management';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card } from '@musetrip360/ui-core/card';
import { Input } from '@musetrip360/ui-core/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { cn } from '@musetrip360/ui-core/utils';
import { AlertCircle, ChevronLeft, ChevronRight, Clock, Eye, MapPin, Search, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

interface MuseumEventsTabProps {
  museumId: string;
  className?: string;
}

// Utility functions

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateHeader = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

const getEventTypeIcon = (type: EventTypeEnum): string => {
  switch (type) {
    case EventTypeEnum.Exhibition:
      return '🖼️';
    case EventTypeEnum.Workshop:
      return '🔨';
    case EventTypeEnum.Lecture:
      return '🎓';
    case EventTypeEnum.SpecialEvent:
      return '⭐';
    case EventTypeEnum.HolidayEvent:
      return '🎉';
    default:
      return '📅';
  }
};

const getEventTypeColor = (type: EventTypeEnum) => {
  switch (type) {
    case EventTypeEnum.Exhibition:
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case EventTypeEnum.Workshop:
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case EventTypeEnum.Lecture:
      return 'bg-green-50 text-green-700 border-green-200';
    case EventTypeEnum.SpecialEvent:
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case EventTypeEnum.HolidayEvent:
      return 'bg-pink-50 text-pink-700 border-pink-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

// Join Event Button Component
export const JoinEventButton = ({ eventId }: { eventId: string }) => {
  const router = useRouter();
  const { data: eventRooms, isLoading } = useGetEventRooms(eventId);

  const handleJoinEvent = () => {
    if (eventRooms && eventRooms.length > 0) {
      // Navigate to the first room
      const firstRoom = eventRooms[0];
      router.push(`/stream/setup/${firstRoom!.id}`);
    } else {
      console.error('No rooms found for this event');
    }
  };

  return (
    <Button
      size="sm"
      className="h-6 px-3 text-xs bg-red-500 hover:bg-red-600 text-white"
      onClick={handleJoinEvent}
      disabled={isLoading || !eventRooms || eventRooms.length === 0}
    >
      📍 Tham gia
    </Button>
  );
};

// Calendar Component
const CalendarFilter = ({
  onDateFilter,
  selectedDate,
}: {
  onDateFilter: (date: Date | null) => void;
  selectedDate: Date | null;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateForDay = new Date(year, month, day);
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isSelected =
        selectedDate &&
        day === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => {
            if (isSelected) {
              onDateFilter(null); // Deselect if clicking the same date
            } else {
              onDateFilter(currentDateForDay);
            }
          }}
          className={cn(
            'h-8 w-8 text-sm rounded-md hover:bg-primary/10 transition-colors',
            isToday && !isSelected
              ? 'bg-primary/20 text-primary font-bold border-2 border-primary'
              : isSelected
                ? 'bg-primary text-white font-bold'
                : 'text-gray-700',
            'flex items-center justify-center'
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

        {/* Filter Options */}
        <div className="space-y-3 pt-4 border-t">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Bộ lọc nhanh</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => onDateFilter(new Date())}
              >
                📅 Từ hôm nay
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => onDateFilter(null)}
              >
                🗓️ Tất cả sự kiện
              </Button>
            </div>
          </div>

          {selectedDate && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h5 className="text-xs font-medium text-blue-900 mb-1">Đang lọc từ:</h5>
              <p className="text-sm font-semibold text-blue-700">
                {selectedDate.toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-xs text-blue-600 h-6"
                onClick={() => onDateFilter(null)}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export function MuseumEventsTab({ museumId, className }: MuseumEventsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  const router = useRouter();

  const {
    data: eventsData,
    isLoading,
    error,
  } = useSearchEvents({
    museumId,
    Page: 1,
    PageSize: 10000,
  });

  const allEvents = (eventsData as any)?.list || [];

  // Frontend filtering and sorting with time-based categories
  const filteredAndGroupedEvents = useMemo(() => {
    let filtered = allEvents;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (event: Event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    // Event type filter
    if (eventTypeFilter !== 'all') {
      filtered = filtered.filter((event: Event) => event.eventType === eventTypeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((event: Event) => event.status === statusFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter((event: Event) => new Date(event.startTime) >= now);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter((event: Event) => new Date(event.endTime) < now);
    }

    // Calendar date filter - show events from selected date onwards
    if (selectedCalendarDate) {
      const selectedDateStart = new Date(selectedCalendarDate);
      selectedDateStart.setHours(0, 0, 0, 0); // Start of selected date

      filtered = filtered.filter((event: Event) => {
        const eventStart = new Date(event.startTime);
        return eventStart >= selectedDateStart;
      });
    }

    // Categorize events by time status
    const categorizedEvents = {
      ongoing: [] as Event[],
      upcoming: [] as Event[],
      past: [] as Event[],
    };

    filtered.forEach((event: Event) => {
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);

      if (startTime <= now && endTime >= now) {
        // Event is currently ongoing
        categorizedEvents.ongoing.push(event);
      } else if (startTime > now) {
        // Event is upcoming
        categorizedEvents.upcoming.push(event);
      } else {
        // Event is past
        categorizedEvents.past.push(event);
      }
    });

    // Sort each category by time (closest first)
    categorizedEvents.ongoing.sort(
      (a: Event, b: Event) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime() // Sort by end time for ongoing events
    );

    categorizedEvents.upcoming.sort(
      (a: Event, b: Event) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime() // Sort by start time for upcoming events
    );

    categorizedEvents.past.sort(
      (a: Event, b: Event) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime() // Sort by most recent first for past events
    );

    // Combine all events in priority order: ongoing -> upcoming -> past
    const sortedEvents = [...categorizedEvents.ongoing, ...categorizedEvents.upcoming, ...categorizedEvents.past];

    // Group by date while maintaining the sorted order
    const grouped = sortedEvents.reduce(
      (acc: Record<string, Event[]>, event: Event) => {
        const dateKey = new Date(event.startTime).toDateString();
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
      },
      {} as Record<string, Event[]>
    );

    return grouped;
  }, [allEvents, searchQuery, eventTypeFilter, statusFilter, dateFilter, selectedCalendarDate]);

  const totalEvents = Object.values(filteredAndGroupedEvents).flat().length;

  // Calculate event stats for display
  const eventStats = useMemo(() => {
    const now = new Date();
    const allFilteredEvents = Object.values(filteredAndGroupedEvents).flat();

    const ongoing = allFilteredEvents.filter((event: Event) => {
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);
      return startTime <= now && endTime >= now;
    }).length;

    const upcoming = allFilteredEvents.filter((event: Event) => {
      const startTime = new Date(event.startTime);
      return startTime > now;
    }).length;

    const past = allFilteredEvents.filter((event: Event) => {
      const endTime = new Date(event.endTime);
      return endTime < now;
    }).length;

    return { ongoing, upcoming, past };
  }, [filteredAndGroupedEvents]);

  const clearFilters = () => {
    setSearchQuery('');
    setEventTypeFilter('all');
    setStatusFilter('all');
    setDateFilter('all');
    setSelectedCalendarDate(null);
  };

  const handleCalendarDateFilter = (date: Date | null) => {
    setSelectedCalendarDate(date);
    // Clear other date filters when using calendar
    if (date) {
      setDateFilter('all');
    }
  };

  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải danh sách sự kiện. Vui lòng thử lại sau.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search and Filter Header */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm sự kiện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Loại sự kiện" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value={EventTypeEnum.Exhibition}>Triển lãm</SelectItem>
              <SelectItem value={EventTypeEnum.Workshop}>Workshop</SelectItem>
              <SelectItem value={EventTypeEnum.Lecture}>Hội thảo</SelectItem>
              <SelectItem value={EventTypeEnum.SpecialEvent}>Sự kiện đặc biệt</SelectItem>
              <SelectItem value={EventTypeEnum.HolidayEvent}>Sự kiện lễ hội</SelectItem>
              <SelectItem value={EventTypeEnum.Other}>Khác</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery ||
            eventTypeFilter !== 'all' ||
            statusFilter !== 'all' ||
            dateFilter !== 'all' ||
            selectedCalendarDate) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="flex gap-6">
        {/* Events List - Left Side */}
        <div className="flex-1 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-16 bg-muted/30" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4 bg-muted/30" />
                      <Skeleton className="h-4 w-full bg-muted/30" />
                      <Skeleton className="h-4 w-1/2 bg-muted/30" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : totalEvents === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-semibold mb-2">Không có sự kiện</h3>
              <p className="text-muted-foreground">
                {selectedCalendarDate
                  ? `Không có sự kiện nào từ ${selectedCalendarDate.toLocaleDateString('vi-VN')} trở đi`
                  : searchQuery || eventTypeFilter !== 'all'
                    ? 'Không tìm thấy sự kiện phù hợp'
                    : 'Chưa có sự kiện nào'}
              </p>
              {(searchQuery || eventTypeFilter !== 'all' || selectedCalendarDate) && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Xóa tất cả bộ lọc
                </Button>
              )}
            </Card>
          ) : (
            <>
              {/* Results Summary */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Sự kiện ({totalEvents})</h2>
                  {selectedCalendarDate && (
                    <p className="text-sm text-blue-600 mt-1">
                      📅 Từ {selectedCalendarDate.toLocaleDateString('vi-VN')} trở đi
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {eventStats.ongoing > 0 && (
                    <Badge className="bg-red-100 text-red-700 text-xs">🔴 {eventStats.ongoing} đang diễn ra</Badge>
                  )}
                  {eventStats.upcoming > 0 && (
                    <Badge className="bg-blue-100 text-blue-700 text-xs">🔵 {eventStats.upcoming} sắp tới</Badge>
                  )}
                </div>
              </div>

              {/* Events Timeline */}
              <div className="space-y-6">
                {Object.entries(filteredAndGroupedEvents).map(([dateKey, events]) => {
                  const eventList = events as Event[];
                  return (
                    <div key={dateKey} className="space-y-3">
                      {/* Date Header */}
                      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 pb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <h3 className="font-semibold text-gray-900">{formatDateHeader(eventList[0]!.startTime)}</h3>
                          </div>
                          <div className="flex-1 h-px bg-border"></div>
                          <Badge variant="secondary" className="text-xs">
                            {eventList.length} sự kiện
                          </Badge>
                        </div>
                      </div>

                      {/* Compact Event Cards */}
                      <div className="space-y-3">
                        {eventList.map((event: Event) => {
                          const now = new Date();
                          const startTime = new Date(event.startTime);
                          const endTime = new Date(event.endTime);
                          const isOngoing = startTime <= now && endTime >= now;
                          const isUpcoming = startTime > now;

                          return (
                            <Card
                              key={event.id}
                              className={cn(
                                'p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer bg-white border border-gray-100',
                                isOngoing
                                  ? 'border-l-4 border-l-red-500 shadow-red-100/50'
                                  : isUpcoming
                                    ? 'border-l-4 border-l-blue-500 shadow-blue-100/50'
                                    : 'border-l-4 border-l-gray-300 shadow-gray-100/50'
                              )}
                              onClick={() => router.push(`/event/${event.id}`)}
                            >
                              <div className="flex gap-4">
                                {/* Event Image */}
                                <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                  {event.metadata?.thumbnail ? (
                                    <Image
                                      src={event.metadata.thumbnail}
                                      alt={event.title}
                                      width={80}
                                      height={64}
                                      className="w-full h-full object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                      <span className="text-lg opacity-60">{getEventTypeIcon(event.eventType)}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Event Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <h4 className="font-semibold text-gray-900 line-clamp-1">{event.title}</h4>
                                    <div className="flex gap-1 flex-shrink-0">
                                      {isOngoing && (
                                        <Badge className="bg-red-500 text-white text-xs animate-pulse">LIVE</Badge>
                                      )}
                                      <Badge className={cn('text-xs', getEventTypeColor(event.eventType))}>
                                        {event.eventType === 'Exhibition'
                                          ? 'Triển lãm'
                                          : event.eventType === 'Workshop'
                                            ? 'Workshop'
                                            : event.eventType === 'Lecture'
                                              ? 'Hội thảo'
                                              : 'Khác'}
                                      </Badge>
                                    </div>
                                  </div>

                                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.description}</p>

                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{formatTime(event.startTime)}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span className="line-clamp-1">{event.location}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        <span>
                                          {event.availableSlots}/{event.capacity}
                                        </span>
                                      </div>
                                    </div>

                                    <div onClick={(e) => e.stopPropagation()}>
                                      {isOngoing ? (
                                        <JoinEventButton eventId={event.id} />
                                      ) : (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 px-3 text-xs"
                                          onClick={() => router.push(`/event/${event.id}`)}
                                        >
                                          <Eye className="h-3 w-3 mr-1" />
                                          Chi tiết
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Calendar Filter - Right Side */}
        <div className="w-80 flex-shrink-0">
          <CalendarFilter onDateFilter={handleCalendarDateFilter} selectedDate={selectedCalendarDate} />
        </div>
      </div>
    </div>
  );
}
