'use client';

import {
  EventTypeEnum,
  useGetEventById,
  useGetUserEventParticipants,
  useGetEventParticipants,
  useGetEventRooms,
} from '@musetrip360/event-management';
import {
  CreateOrder,
  OrderTypeEnum,
  PaymentStatusEnum,
  useCreateOrder,
  useGetOrderByCode,
} from '@musetrip360/payment-management';
import { useAuthStore } from '@musetrip360/auth-system';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card } from '@musetrip360/ui-core/card';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { cn } from '@musetrip360/ui-core/utils';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  ExternalLink,
  MapPin,
  Users,
  CheckCircle,
  Loader2,
  UserCheck,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from '@musetrip360/ui-core';

// Join Event Button Component - copied from MuseumEventsTab
const JoinEventButton = ({ eventId }: { eventId: string }) => {
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
      className="h-8 px-4 text-sm bg-red-500 hover:bg-red-600 text-white"
      onClick={handleJoinEvent}
      disabled={isLoading || !eventRooms || eventRooms.length === 0}
    >
      📍 Tham gia sự kiện
    </Button>
  );
};
import { ParticipantRoleName } from '@/config/constants/type';
import { FeedbackList, FeedbackForm } from '../feedback';

interface EventDetailPageProps {
  eventId: string;
  className?: string;
}

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

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
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

export function EventDetailPage({ eventId, className }: EventDetailPageProps) {
  const router = useRouter();
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const userId = useAuthStore((state) => state.userId);

  const { data: event, isLoading: isLoadingEvent, error: eventError } = useGetEventById(eventId);
  const { data: userParticipants, refetch: refetchUserParticipants } = useGetUserEventParticipants(userId || '', {
    enabled: !!userId,
  });
  const {
    data: eventParticipants,
    isLoading: isLoadingParticipants,
    refetch: refetchEventParticipants,
  } = useGetEventParticipants(eventId);

  const { data: order } = useGetOrderByCode(orderCode || '', {
    enabled: !!orderCode,
    staleTime: 2000, // Refresh every 5 seconds
  });

  const createOrderMutation = useCreateOrder({
    onSuccess: (data) => {
      if (data) {
        if (data.orderCode) {
          setOrderCode(String(data.orderCode));
        }
        setIsOrdering(false);

        // Open payment link in new window
        if (data.checkoutUrl) {
          window.open(data.checkoutUrl, '_blank');
        }
      }

      refetchEventParticipants();
      refetchUserParticipants();
      toast.success('Đơn hàng đã được tạo thành công');
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
      setIsOrdering(false);
    },
  });

  const handleBuyTicket = () => {
    if (!event) return;

    setIsOrdering(true);

    const orderData: CreateOrder = {
      orderType: OrderTypeEnum.Event,
      itemIds: [event.id],
      returnUrl: `${window.location.origin}/order/success`,
      cancelUrl: `${window.location.origin}/order/cancel`,
    };

    createOrderMutation.mutate(orderData);
  };

  const handleBackClick = () => {
    router.back();
  };

  if (isLoadingEvent) {
    return (
      <div className={cn('container mx-auto py-8', className)}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (eventError || !event) {
    return (
      <div className={cn('container mx-auto py-8', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải thông tin sự kiện. Vui lòng thử lại sau.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const now = new Date();
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  const isOngoing = startTime <= now && endTime >= now;
  const isUpcoming = startTime > now;
  const isPast = endTime < now;
  const isFree = event.price === 0;
  const isSoldOut = event.availableSlots === 0;
  const hasParticipated =
    userParticipants?.some((participant) => participant.eventId === eventId) ||
    eventParticipants?.some((participant) => participant.userId === userId) ||
    false;

  return (
    <div className={cn('container mx-auto py-8', className)}>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={handleBackClick} className="flex items-center gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        {/* Order Status Alert */}
        {order && (
          <Alert
            className={cn(
              'flex',
              order.status === PaymentStatusEnum.Success
                ? 'border-green-200 bg-green-50'
                : order.status === PaymentStatusEnum.Canceled
                  ? 'border-red-200 bg-red-50'
                  : 'border-blue-200 bg-blue-50'
            )}
          >
            <div className="flex flex-1 items-center gap-2">
              {order.status === PaymentStatusEnum.Success && <CheckCircle className="h-4 w-4 text-green-600" />}
              {order.status === PaymentStatusEnum.Pending && <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />}
              {order.status === PaymentStatusEnum.Canceled && <AlertCircle className="h-4 w-4 text-red-600" />}
            </div>
            <AlertDescription
              className={cn(
                order.status === PaymentStatusEnum.Success
                  ? 'text-green-800'
                  : order.status === PaymentStatusEnum.Canceled
                    ? 'text-red-800'
                    : 'text-blue-800',
                'inline flex-1'
              )}
            >
              {order.status === PaymentStatusEnum.Success && 'Thanh toán thành công! Bạn đã đăng ký sự kiện.'}
              {order.status === PaymentStatusEnum.Pending && 'Đang xử lý thanh toán... (Tự động cập nhật mỗi 5 giây)'}
              {order.status === PaymentStatusEnum.Canceled && 'Thanh toán thất bại. Vui lòng thử lại.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Event Details - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            {event.metadata?.thumbnail && (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image src={event.metadata?.thumbnail} alt={event.title} fill className="object-cover" unoptimized />
              </div>
            )}

            {/* Event Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={cn('text-sm', getEventTypeColor(event.eventType))}>
                  {event.eventType === 'Exhibition'
                    ? 'Triển lãm'
                    : event.eventType === 'Workshop'
                      ? 'Workshop'
                      : event.eventType === 'Lecture'
                        ? 'Hội thảo'
                        : event.eventType === 'SpecialEvent'
                          ? 'Sự kiện đặc biệt'
                          : event.eventType === 'HolidayEvent'
                            ? 'Sự kiện lễ hội'
                            : 'Khác'}
                </Badge>
                {isOngoing && <Badge className="bg-red-500 text-white animate-pulse">ĐANG DIỄN RA</Badge>}
                {isPast && (
                  <Badge variant="outline" className="text-gray-600">
                    ĐÃ KẾT THÚC
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Bắt đầu: {formatDateTime(event.startTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Kết thúc: {formatDateTime(event.endTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    Còn {event.availableSlots}/{event.capacity} chỗ
                  </span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-3">Mô tả sự kiện</h3>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>

              {/* Artifacts & Tours */}
              {event.artifacts && event.artifacts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Hiện vật liên quan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.artifacts.map((artifact) => (
                      <Card key={artifact.id} className="p-4">
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={artifact.imageUrl}
                              alt={artifact.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{artifact.name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{artifact.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{artifact.historicalPeriod}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {event.tourOnlines && event.tourOnlines.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tour trực tuyến</h3>
                  <div className="space-y-3">
                    {event.tourOnlines.map((tour) => (
                      <Card key={tour.id} className="p-4">
                        <h4 className="font-medium text-gray-900">{tour.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{tour.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Participants */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Người tham gia ({eventParticipants?.length || 0})
                </h3>
                {isLoadingParticipants ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : eventParticipants && eventParticipants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {eventParticipants.map((participant) => (
                      <Card key={participant.id} className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-primary/10">
                            {participant.user?.avatarUrl ? (
                              <Image
                                src={participant.user.avatarUrl}
                                alt={participant.user.fullName || 'User'}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary font-medium">
                                {(
                                  participant.user?.fullName?.[0] ||
                                  participant.user?.username?.[0] ||
                                  '?'
                                ).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {participant.user?.fullName
                                ? participant.user.fullName
                                : participant.user?.username || 'Người dùng ẩn danh'}
                            </h4>
                            <p className="text-xs text-gray-500">{ParticipantRoleName[participant.role]}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-6">
                    <div className="text-center text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Chưa có người tham gia sự kiện này</p>
                    </div>
                  </Card>
                )}
              </div>

              {/* Event Feedback */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Đánh giá sự kiện</h3>

                  {/* Show feedback form only for participants or if event is past */}
                  {(hasParticipated || isPast) && (
                    <div className="mb-6">
                      <FeedbackForm targetId={eventId} targetType="event" targetName={event.title} />
                    </div>
                  )}

                  {/* Feedback list */}
                  <FeedbackList targetId={eventId} targetType="event" />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card - Right Side */}
          <div className="space-y-4">
            <Card className="p-6 sticky top-8">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {isFree ? 'Miễn phí' : formatPrice(event.price)}
                  </div>
                  {!isFree && <div className="text-sm text-gray-600">Giá vé</div>}
                </div>

                <div className="space-y-3 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span
                      className={cn(
                        'font-medium',
                        isOngoing ? 'text-red-600' : isUpcoming ? 'text-blue-600' : 'text-gray-600'
                      )}
                    >
                      {isOngoing ? 'Đang diễn ra' : isUpcoming ? 'Sắp diễn ra' : 'Đã kết thúc'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chỗ còn lại:</span>
                    <span className={cn('font-medium', isSoldOut ? 'text-red-600' : 'text-green-600')}>
                      {event.availableSlots} / {event.capacity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hạn đăng ký:</span>
                    <span className="font-medium">{new Date(event.bookingDeadline).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                {/* Buy Button */}
                <div className="pt-4 border-t">
                  {isPast ? (
                    <Button disabled className="w-full">
                      Sự kiện đã kết thúc
                    </Button>
                  ) : isSoldOut ? (
                    <Button disabled className="w-full">
                      Đã hết chỗ
                    </Button>
                  ) : new Date(event.bookingDeadline) < now && !hasParticipated ? (
                    <Button disabled className="w-full">
                      Đã hết hạn đăng ký
                    </Button>
                  ) : hasParticipated ? (
                    <div className="space-y-2">
                      <Button disabled className="w-full bg-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Đã đăng ký
                      </Button>
                      {isOngoing && <JoinEventButton eventId={eventId} />}
                    </div>
                  ) : (
                    <Button
                      onClick={handleBuyTicket}
                      disabled={isOrdering || createOrderMutation.isPending}
                      className="w-full"
                    >
                      {isOrdering || createOrderMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      {isFree
                        ? 'Đăng ký tham gia'
                        : isOrdering || createOrderMutation.isPending
                          ? 'Đang xử lý...'
                          : 'Mua vé ngay'}
                    </Button>
                  )}

                  {order?.metadata?.checkoutUrl && order.status === PaymentStatusEnum.Pending && (
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => window.open(order?.metadata?.checkoutUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Mở lại trang thanh toán
                    </Button>
                  )}
                </div>

                {createOrderMutation.isError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.</AlertDescription>
                  </Alert>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
