import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Text } from '@/components/core/ui/text';
import { useAuthStore } from '@musetrip360/auth-system/state';
import {
  useGetEventById,
  useGetEventParticipants,
  useGetEventRooms,
  useGetUserEventParticipants,
} from '@musetrip360/event-management/api';
import { CreateOrder, OrderTypeEnum, PaymentStatusEnum } from '@musetrip360/payment-management';
import { useCreateOrder, useGetOrderByCode } from '@musetrip360/payment-management/api';
import { useFeedback } from '@musetrip360/shared/api';
import type { FeedbackSearchParams } from '@musetrip360/shared/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  Loader2,
  MapPin,
  UserCheck,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Linking, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventDetailPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [refreshing, setRefreshing] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);

  // Get userId from auth store
  const { userId } = useAuthStore();

  const { data: event, isLoading: isLoadingEvent, error: eventError, refetch: refetchEvent } = useGetEventById(id!);

  const {
    data: eventParticipants,
    isLoading: isLoadingParticipants,
    refetch: refetchParticipants,
  } = useGetEventParticipants(id!);

  // Check if user is already participating
  const { data: userParticipants, refetch: refetchUserParticipants } = useGetUserEventParticipants(userId || '', {
    enabled: !!userId,
  });

  // Get event rooms for join functionality
  const { data: eventRooms } = useGetEventRooms(id!, {
    enabled: !!id,
  });

  // Order tracking
  const { data: order } = useGetOrderByCode(orderCode || '', {
    enabled: !!orderCode,
    staleTime: 5000, // Refresh every 5 seconds
  });

  // Create order mutation
  const createOrderMutation = useCreateOrder({
    onSuccess: (data) => {
      if (data) {
        if (data.orderCode) {
          setOrderCode(String(data.orderCode));
        }
        setIsOrdering(false);

        // Open payment link in mobile browser
        if (data.checkoutUrl) {
          Linking.openURL(data.checkoutUrl).catch(() => {
            Alert.alert('Lỗi', 'Không thể mở trang thanh toán. Vui lòng thử lại!');
          });
        }
      }

      refetchParticipants();
      refetchUserParticipants();
      Alert.alert('Thành công', 'Đơn hàng đã được tạo thành công!');
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
      setIsOrdering(false);
    },
  });

  // Feedback data
  const feedbackParams: FeedbackSearchParams = {
    targetId: id!,
    targetType: 'event',
    Page: 1,
    PageSize: 20,
  };

  const { data: feedbackResponse, isLoading: isLoadingFeedback } = useFeedback(feedbackParams);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([refetchEvent(), refetchParticipants(), refetchUserParticipants()]).finally(() => setRefreshing(false));
  }, [refetchEvent, refetchParticipants, refetchUserParticipants]);

  const handleRegisterEvent = () => {
    if (!event) return;

    setIsOrdering(true);

    const orderData: CreateOrder = {
      orderType: OrderTypeEnum.Event,
      itemIds: [event.id],
      returnUrl: 'mobile://order/success',
      cancelUrl: 'mobile://order/cancel',
    };

    createOrderMutation.mutate(orderData);
  };

  const handleJoinEvent = () => {
    if (eventRooms && eventRooms.length > 0) {
      Alert.alert('Tham gia sự kiện', 'Bạn có muốn tham gia sự kiện đang diễn ra?', [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Tham gia',
          onPress: () => {
            // TODO: Navigate to stream/setup room
            Alert.alert('Thông báo', 'Tính năng tham gia trực tiếp sẽ được cập nhật!');
          },
        },
      ]);
    } else {
      Alert.alert('Lỗi', 'Không tìm thấy phòng sự kiện để tham gia!');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (isLoadingEvent) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="dark" />
        <View className="flex-row items-center justify-between px-4 py-4 bg-background">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Chi tiết sự kiện</Text>
          <View className="w-10" />
        </View>
        <ScrollView className="flex-1 px-4 py-4">
          <View className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
          <View className="w-3/4 h-6 bg-gray-200 rounded mb-2" />
          <View className="w-1/2 h-4 bg-gray-200 rounded mb-4" />
          <View className="w-full h-20 bg-gray-200 rounded" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (eventError || !event) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="dark" />
        <View className="flex-row items-center justify-between px-4 py-4 bg-background">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Chi tiết sự kiện</Text>
          <View className="w-10" />
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-4xl mb-4">😞</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sự kiện</Text>
          <Text className="text-gray-600 text-center mb-6">Sự kiện này có thể đã bị xóa hoặc không tồn tại</Text>
          <Button onPress={() => router.back()} className="bg-blue-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-medium">Quay lại</Text>
          </Button>
        </View>
      </SafeAreaView>
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

  // Check if user has participated in this event
  const hasParticipated =
    userParticipants?.some((participant) => participant.eventId === id) ||
    eventParticipants?.some((participant) => participant.userId === userId) ||
    false;

  if (isLoadingEvent) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="dark" />
        <View className="flex-row items-center justify-between px-4 py-4 bg-background">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Chi tiết sự kiện</Text>
          <View className="w-10" />
        </View>
        <ScrollView className="flex-1 px-4 py-4">
          <View className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
          <View className="w-3/4 h-6 bg-gray-200 rounded mb-2" />
          <View className="w-1/2 h-4 bg-gray-200 rounded mb-4" />
          <View className="w-full h-20 bg-gray-200 rounded" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (eventError || !event) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="dark" />
        <View className="flex-row items-center justify-between px-4 py-4 bg-background">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Chi tiết sự kiện</Text>
          <View className="w-10" />
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-4xl mb-4">😞</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sự kiện</Text>
          <Text className="text-gray-600 text-center mb-6">Sự kiện này có thể đã bị xóa hoặc không tồn tại</Text>
          <Button onPress={() => router.back()} className="bg-blue-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-medium">Quay lại</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-4 py-4 bg-background">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Chi tiết sự kiện</Text>
        <View className="w-10" />
      </View>

      {/* Order Status Alert */}
      {order && (
        <View className="px-4 pb-2">
          <Card
            className={`${
              order.status === PaymentStatusEnum.Success
                ? 'bg-green-50 border-green-200'
                : order.status === PaymentStatusEnum.Canceled
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
            } rounded-lg`}
          >
            <CardContent className="p-4 flex-row items-center">
              {order.status === PaymentStatusEnum.Success && <CheckCircle size={20} color="#16a34a" />}
              {order.status === PaymentStatusEnum.Pending && <Loader2 size={20} color="#2563eb" />}
              {order.status === PaymentStatusEnum.Canceled && <AlertCircle size={20} color="#dc2626" />}

              <View className="ml-3 flex-1">
                <Text
                  className={`font-medium ${
                    order.status === PaymentStatusEnum.Success
                      ? 'text-green-800'
                      : order.status === PaymentStatusEnum.Canceled
                        ? 'text-red-800'
                        : 'text-blue-800'
                  }`}
                >
                  {order.status === PaymentStatusEnum.Success && 'Thanh toán thành công! Bạn đã đăng ký sự kiện.'}
                  {order.status === PaymentStatusEnum.Pending && 'Đang xử lý thanh toán...'}
                  {order.status === PaymentStatusEnum.Canceled && 'Thanh toán thất bại. Vui lòng thử lại.'}
                </Text>
              </View>

              {order.status === PaymentStatusEnum.Pending && order.metadata?.checkoutUrl && (
                <TouchableOpacity className="ml-2" onPress={() => Linking.openURL(order.metadata!.checkoutUrl)}>
                  <ExternalLink size={16} color="#2563eb" />
                </TouchableOpacity>
              )}
            </CardContent>
          </Card>
        </View>
      )}

      <ScrollView
        className="flex-1 bg-background"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Event Image */}
        {event.metadata?.thumbnail &&
        typeof event.metadata.thumbnail === 'string' &&
        event.metadata.thumbnail.startsWith('http') ? (
          <Image source={{ uri: event.metadata.thumbnail }} className="w-full h-64" resizeMode="cover" />
        ) : null}
        <View className="px-4 py-4 space-y-6">
          {/* Participation Status Alert */}
          {hasParticipated && (
            <Card className="bg-green-50 border border-green-200 rounded-lg">
              <CardContent className="p-3">
                <View className="flex-row items-center">
                  <CheckCircle size={20} color="#16a34a" />
                  <Text className="ml-2 text-green-800 font-medium">Bạn đã đăng ký tham gia sự kiện này</Text>
                </View>
              </CardContent>
            </Card>
          )}

          {/* Event Info */}
          <View className="pb-2">
            <Text className="text-2xl font-bold text-foreground mb-1">{event.title}</Text>
            <View className="flex-row items-center mb-1">
              <Text className="bg-accent/10 border border-accent rounded px-2 py-0.5 mr-2 text-xs text-accent">
                {event.eventType === 'SpecialEvent'
                  ? 'Sự kiện đặc biệt'
                  : event.eventType === 'Exhibition'
                    ? 'Triển lãm'
                    : event.eventType === 'Workshop'
                      ? 'Workshop'
                      : event.eventType === 'Lecture'
                        ? 'Hội thảo'
                        : event.eventType === 'HolidayEvent'
                          ? 'Sự kiện lễ hội'
                          : 'Khác'}
              </Text>
              {isOngoing && (
                <Text className="bg-red-500 text-white rounded px-2 py-0.5 text-xs ml-2">ĐANG DIỄN RA</Text>
              )}
              {isPast && (
                <Text className="border border-gray-300 text-gray-600 rounded px-2 py-0.5 text-xs ml-2">
                  ĐÃ KẾT THÚC
                </Text>
              )}
            </View>
            <View className="flex-row items-center mb-1">
              <Calendar size={16} color="#9ca3af" />
              <Text className="text-muted-foreground text-xs ml-2">
                {new Date(event.startTime).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Clock size={16} color="#9ca3af" />
              <Text className="text-muted-foreground text-xs ml-2">
                {new Date(event.endTime).toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <MapPin size={16} color="#9ca3af" />
              <Text className="text-muted-foreground text-xs ml-2">{event.location}</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Users size={16} color="#9ca3af" />
              <Text className="text-muted-foreground text-xs ml-2">
                Còn {event.availableSlots}/{event.capacity} chỗ
              </Text>
            </View>
          </View>

          {/* Description */}
          <Card className="bg-card border border-border rounded-lg shadow-sm mb-5">
            <CardContent className="px-3 py-2">
              <Text className="text-lg font-semibold text-primary mb-2">Mô tả sự kiện</Text>
              <Text className="text-foreground text-base leading-6">
                {event.description || 'Thông tin mô tả đang được cập nhật...'}
              </Text>
            </CardContent>
          </Card>

          {/* Artifacts & Tours */}
          {event.artifacts && event.artifacts.length > 0 && (
            <Card className="bg-card border border-border rounded-lg shadow-sm mb-5">
              <CardContent className="p-4">
                <Text className="text-lg font-semibold text-primary mb-2">Hiện vật liên quan</Text>
                <View className="space-y-2">
                  {event.artifacts.map((artifact: any) => (
                    <View key={artifact.id} className="flex-row items-center mb-2">
                      <Image source={{ uri: artifact.imageUrl }} className="w-12 h-12 rounded mr-3" />
                      <View>
                        <Text className="font-medium text-foreground">{artifact.name}</Text>
                        <Text className="text-xs text-muted-foreground">{artifact.historicalPeriod}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}
          {event.tourOnlines && event.tourOnlines.length > 0 && (
            <Card className="bg-card border border-border rounded-lg shadow-sm mb-5">
              <CardContent className="p-4">
                <Text className="text-lg font-semibold text-primary mb-2">Tour trực tuyến</Text>
                <View className="space-y-2">
                  {event.tourOnlines.map((tour: any) => (
                    <View key={tour.id} className="p-2 bg-card rounded-lg border border-border mb-2">
                      <Text className="font-semibold text-foreground">{tour.name}</Text>
                      <Text className="text-sm text-muted-foreground mt-1">{tour.description}</Text>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}

          {/* Event Participants */}
          <Card className="bg-white border border-gray-200 rounded-lg mb-5">
            <CardContent className="px-3 py-2">
              <View className="flex-row items-center mb-2">
                <UserCheck size={20} color="#a67c52" />
                <Text className="ml-2 text-base font-semibold text-primary">
                  Người tham gia ({eventParticipants?.length || 0})
                </Text>
              </View>
              {isLoadingParticipants ? (
                <View className="flex-row flex-wrap gap-3 mt-2">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <View key={idx} className="w-16 h-16 bg-gray-200 rounded-full" />
                  ))}
                </View>
              ) : eventParticipants && eventParticipants.length > 0 ? (
                <View className="flex-row flex-wrap gap-3 mt-2">
                  {eventParticipants.map((participant: any) => {
                    // Badge màu cho vai trò
                    let roleColor = '#a67c52';
                    let roleLabel = 'Tham dự';
                    let roleIcon = <Users size={14} color={roleColor} />;
                    if (participant.role === 'Organizer') {
                      roleColor = '#2563eb';
                      roleLabel = 'Tổ chức';
                      roleIcon = <UserCheck size={14} color={roleColor} />;
                    } else if (participant.role === 'TourGuide') {
                      roleColor = '#059669';
                      roleLabel = 'Hướng dẫn';
                      roleIcon = <UserCheck size={14} color={roleColor} />;
                    } else if (participant.role === 'Guest') {
                      roleColor = '#f59e42';
                      roleLabel = 'Khách';
                      roleIcon = <Users size={14} color={roleColor} />;
                    }
                    return (
                      <View key={participant.id} className="items-center">
                        <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center overflow-hidden mb-1">
                          {participant.user?.avatarUrl ? (
                            <Image
                              source={{ uri: participant.user.avatarUrl }}
                              className="w-16 h-16 rounded-full"
                              resizeMode="cover"
                            />
                          ) : (
                            <Text className="text-primary font-bold text-xl">
                              {participant.user?.fullName?.[0] || participant.user?.username?.[0] || 'U'}
                            </Text>
                          )}
                        </View>
                        <Text className="font-medium text-xs text-center" numberOfLines={1} ellipsizeMode="tail">
                          {participant.user?.fullName || 'Unknown'}
                        </Text>
                        <View
                          className="flex-row items-center justify-center mt-1 px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: roleColor + '22' }}
                        >
                          {roleIcon}
                          <Text className="ml-1 text-xs font-semibold" style={{ color: roleColor }}>
                            {roleLabel}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View className="items-center mt-4">
                  <Text className="text-gray-500 text-center mb-2">Không có người tham dự</Text>
                  <Users size={48} color="#d1d5db" />
                </View>
              )}
            </CardContent>
          </Card>

          {/* Event Feedback Section */}
          <View className="mb-5">
            <Text className="text-lg font-semibold text-primary mb-4 px-4">Đánh giá sự kiện</Text>

            <View className="px-2">
              {/* Loading state */}
              {isLoadingFeedback ? (
                <Card className="bg-card border border-border rounded-lg">
                  <CardContent className="p-8 items-center">
                    <Text className="text-lg font-semibold text-foreground mb-2">Đang tải đánh giá...</Text>
                  </CardContent>
                </Card>
              ) : (
                (() => {
                  // Mapping đúng chuẩn visitor-portal
                  const feedbacks: any[] =
                    (feedbackResponse as any)?.list || (feedbackResponse as any)?.data?.list || [];
                  const feedbackCount = feedbacks.length;
                  const averageRating =
                    feedbackCount > 0 ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbackCount : 0;

                  // Star rating component
                  const StarRating = ({ rating }: { rating: number }) => (
                    <View className="flex-row items-center">
                      {[...Array(5)].map((_, i) => (
                        <Text
                          key={i}
                          className={`text-base ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
                          style={{ marginRight: 2 }}
                        >
                          ★
                        </Text>
                      ))}
                      <Text className="ml-1 text-sm text-muted-foreground">({rating}/5)</Text>
                    </View>
                  );

                  // Empty state
                  if (feedbackCount === 0) {
                    return (
                      <Card className="bg-card border border-border rounded-lg">
                        <CardContent className="p-8 items-center">
                          <Text className="text-3xl mb-3">⭐</Text>
                          <Text className="text-lg font-semibold text-foreground mb-2">Chưa có đánh giá</Text>
                          <Text className="text-muted-foreground text-center">
                            Hãy là người đầu tiên đánh giá sự kiện này!
                          </Text>
                        </CardContent>
                      </Card>
                    );
                  }

                  // List state
                  return (
                    <View>
                      {/* Summary Card */}
                      <Card className="bg-card border border-border rounded-lg mb-4">
                        <CardContent className="p-4 flex-row items-center justify-between">
                          <View className="items-center">
                            <Text className="text-2xl font-bold text-primary mb-1">{averageRating.toFixed(1)}</Text>
                            <StarRating rating={Math.round(averageRating)} />
                          </View>
                          <View className="items-center">
                            <Text className="text-sm text-muted-foreground">{feedbackCount} đánh giá</Text>
                          </View>
                        </CardContent>
                      </Card>

                      {/* Feedback List */}
                      {feedbacks.map((review: any) => (
                        <Card key={review.id} className="bg-card border border-border rounded-lg mb-4">
                          <CardContent className="p-4">
                            <View className="flex-row items-center justify-between mb-3">
                              <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
                                  {review.createdByUser?.avatarUrl ? (
                                    <Image
                                      source={{ uri: review.createdByUser.avatarUrl }}
                                      className="w-10 h-10 rounded-full"
                                      resizeMode="cover"
                                    />
                                  ) : (
                                    <Text className="text-white text-sm font-semibold">
                                      {review.createdByUser?.fullName?.charAt(0).toUpperCase() || '?'}
                                    </Text>
                                  )}
                                </View>
                                <View>
                                  <Text className="font-semibold text-foreground">
                                    {review.createdByUser?.fullName || 'Ẩn danh'}
                                  </Text>
                                  <Text className="text-muted-foreground text-xs">
                                    {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </Text>
                                </View>
                              </View>
                              <StarRating rating={review.rating} />
                            </View>
                            <Text className="text-foreground text-base leading-6">{review.comment}</Text>
                          </CardContent>
                        </Card>
                      ))}

                      {/* Load more if needed */}
                      {(feedbackResponse as any)?.total && Math.ceil((feedbackResponse as any).total / 20) > 1 && (
                        <TouchableOpacity
                          className="bg-primary p-3 rounded-lg items-center mt-2"
                          onPress={() => {
                            // TODO: Implement pagination
                          }}
                        >
                          <Text className="text-white font-semibold">Xem thêm</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })()
              )}
            </View>
          </View>

          {/* Registration/Booking Card */}
          <Card className="bg-white border border-gray-200 rounded-lg shadow-lg mb-5">
            <CardContent className="p-4">
              <View className="items-center mb-4">
                <Text className="text-3xl font-bold text-gray-900 mb-1">
                  {isFree ? 'Miễn phí' : formatPrice(event.price)}
                </Text>
                {!isFree && <Text className="text-sm text-gray-600">Giá vé</Text>}
              </View>

              <View className="space-y-3 border-t border-gray-200 pt-4 mb-4">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Trạng thái:</Text>
                  <Text
                    className={`font-medium ${
                      isOngoing ? 'text-red-600' : isUpcoming ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    {isOngoing ? 'Đang diễn ra' : isUpcoming ? 'Sắp diễn ra' : 'Đã kết thúc'}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Chỗ còn lại:</Text>
                  <Text className={`font-medium ${isSoldOut ? 'text-red-600' : 'text-green-600'}`}>
                    {event.availableSlots} / {event.capacity}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Hạn đăng ký:</Text>
                  <Text className="font-medium">{new Date(event.bookingDeadline).toLocaleDateString('vi-VN')}</Text>
                </View>
              </View>

              {/* Action Button */}
              <View className="border-t border-gray-200 pt-4">
                {isPast ? (
                  <View className="bg-gray-100 p-3 rounded-lg">
                    <Text className="text-gray-600 text-center font-medium">Sự kiện đã kết thúc</Text>
                  </View>
                ) : isSoldOut ? (
                  <View className="bg-red-100 p-3 rounded-lg">
                    <Text className="text-red-600 text-center font-medium">Đã hết chỗ</Text>
                  </View>
                ) : new Date(event.bookingDeadline) < now && !hasParticipated ? (
                  <View className="bg-gray-100 p-3 rounded-lg">
                    <Text className="text-gray-600 text-center font-medium">Đã hết hạn đăng ký</Text>
                  </View>
                ) : hasParticipated ? (
                  <View className="space-y-2">
                    <View className="bg-green-600 p-3 rounded-lg flex-row items-center justify-center">
                      <CheckCircle size={16} color="white" />
                      <Text className="text-white font-medium ml-2">Đã đăng ký</Text>
                    </View>
                    {isOngoing && (
                      <TouchableOpacity className="bg-red-500 p-3 rounded-lg" onPress={handleJoinEvent}>
                        <Text className="text-white font-medium text-center">📍 Tham gia sự kiện</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <TouchableOpacity
                    className={`p-3 rounded-lg flex-row items-center justify-center ${
                      isOrdering ? 'bg-gray-400' : 'bg-primary'
                    }`}
                    onPress={handleRegisterEvent}
                    disabled={isOrdering}
                  >
                    {isOrdering ? (
                      <Text className="text-white font-medium">Đang xử lý...</Text>
                    ) : (
                      <>
                        <CreditCard size={16} color="white" />
                        <Text className="text-white font-medium ml-2">
                          {isFree ? 'Đăng ký tham gia' : 'Mua vé ngay'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </CardContent>
          </Card>
        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
