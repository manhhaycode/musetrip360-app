import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, MapPin, MessageCircle, Star, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Text } from '@/components/core/ui/text';
import { useEventDetail } from '@/hooks/useEvents';
import { useReviews } from '@/hooks/useReviews';

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const { data: event, isLoading, error, refetch } = useEventDetail(id!);
  const { data: reviewsData, isLoading: isLoadingReviews } = useReviews(id!, 'Event');

  const reviews = reviewsData?.data?.list || [];
  const totalReviews = reviewsData?.data?.total || 0;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={16} color={i < rating ? '#fbbf24' : '#d1d5db'} fill={i < rating ? '#fbbf24' : 'none'} />
    ));
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="dark" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Chi tiết sự kiện</Text>
          <View className="w-10" />
        </View>

        {/* Loading Content */}
        <ScrollView className="flex-1 px-4 py-4">
          <View className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
          <View className="w-3/4 h-6 bg-gray-200 rounded mb-2" />
          <View className="w-1/2 h-4 bg-gray-200 rounded mb-4" />
          <View className="w-full h-20 bg-gray-200 rounded" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar style="dark" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Chi tiết sự kiện</Text>
          <View className="w-10" />
        </View>

        {/* Error Content */}
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

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-background">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Chi tiết sự kiện</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 bg-background"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Event Image */}
        {event.metadata?.images && event.metadata.images.length > 0 && (
          <Image
            source={{
              uri: event.metadata.images[0] || 'https://via.placeholder.com/400x200/e5e7eb/9ca3af?text=Event',
            }}
            className="w-full h-64"
            resizeMode="cover"
          />
        )}

        {/* Event Info */}
        <View className="px-4 py-4 space-y-6">
          {/* Basic Info */}
          <View className="pb-2">
            <Text className="text-2xl font-bold text-foreground mb-1">{event.title}</Text>

            <View className="flex-row items-center mb-1">
              {(event.eventType === 'SpecialEvent' || event.eventType === 'Exhibition' || event.eventType) && (
                <View className="bg-accent/10 border border-accent rounded px-2 py-0.5 mr-2">
                  <Text className="text-xs text-accent">
                    {event.eventType === 'SpecialEvent'
                      ? 'Sự kiện đặc biệt'
                      : event.eventType === 'Exhibition'
                        ? 'Triển lãm'
                        : 'Khác'}
                  </Text>
                </View>
              )}
            </View>

            {/* Date and Time */}
            <View className="flex-row items-center mb-1">
              <Calendar size={16} color="#9ca3af" />
              <Text className="text-muted-foreground text-xs ml-2">
                {new Date(event.startTime).toLocaleDateString('vi-VN')} -{' '}
                {new Date(event.endTime).toLocaleDateString('vi-VN')}
              </Text>
            </View>

            {/* Location */}
            <View className="flex-row items-center mb-1">
              <MapPin size={16} color="#9ca3af" />
              <Text className="text-muted-foreground text-xs ml-2">{event.location}</Text>
            </View>

            {/* Capacity and Availability */}
            <View className="flex-row items-center mb-1">
              <Users size={16} color="#9ca3af" />
              <Text className="text-muted-foreground text-xs ml-2">
                {event.availableSlots}/{event.capacity} chỗ còn trống
              </Text>
            </View>
          </View>

          {/* Description */}
          <Card className="bg-card border border-border rounded-lg shadow-sm mb-5">
            <CardContent className="px-3 py-2">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-lg">📖</Text>
                </View>
                <Text className="text-lg font-semibold text-primary">Mô tả sự kiện</Text>
              </View>
              {event.description ? (
                <Text className="text-foreground text-base leading-6">{event.description}</Text>
              ) : (
                <Text className="text-muted-foreground text-base italic">Thông tin mô tả đang được cập nhật...</Text>
              )}
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="bg-card border border-border rounded-lg shadow-sm mb-5">
            <CardContent className="px-3 py-2">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-accent rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-lg">🎫</Text>
                </View>
                <Text className="text-lg font-semibold text-primary">Thông tin chi tiết</Text>
              </View>

              <View className="space-y-3">
                {/* Time Details */}
                <View className="flex-row justify-between items-center p-3 bg-card rounded-lg border border-border">
                  <Text className="text-sm font-medium text-foreground">Thời gian bắt đầu</Text>
                  <Text className="text-sm text-muted-foreground">
                    {new Date(event.startTime).toLocaleString('vi-VN')}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center p-3 bg-card rounded-lg border border-border">
                  <Text className="text-sm font-medium text-foreground">Thời gian kết thúc</Text>
                  <Text className="text-sm text-muted-foreground">
                    {new Date(event.endTime).toLocaleString('vi-VN')}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center p-3 bg-card rounded-lg border border-border">
                  <Text className="text-sm font-medium text-foreground">Hạn đăng ký</Text>
                  <Text className="text-sm text-muted-foreground">
                    {new Date(event.bookingDeadline).toLocaleString('vi-VN')}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center p-3 bg-card rounded-lg border border-border">
                  <Text className="text-sm font-medium text-foreground">Giá vé</Text>
                  <Text className="text-sm text-muted-foreground">
                    {event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Tour Onlines */}
          {event.tourOnlines && event.tourOnlines.length > 0 && (
            <Card className="bg-card border border-border rounded-lg shadow-sm mb-5">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 bg-secondary rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-lg">🌐</Text>
                  </View>
                  <Text className="text-lg font-semibold text-primary">Tour trực tuyến </Text>
                </View>
                <View className="space-y-2">
                  {event.tourOnlines.map((tour) => (
                    <View key={tour.id} className="p-3 bg-card rounded-lg border border-border">
                      <Text className="font-semibold text-foreground">{tour.name}</Text>
                      {tour.description && (
                        <Text className="text-sm text-muted-foreground mt-1">{tour.description}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}

          {/* Artifacts */}
          {event.artifacts && event.artifacts.length > 0 && (
            <Card className="bg-card border border-border rounded-lg shadow-sm mb-5">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 bg-accent rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-lg">🏺</Text>
                  </View>
                  <Text className="text-lg font-semibold text-accent">Hiện vật liên quan</Text>
                </View>
                <View className="space-y-3">
                  {event.artifacts.map((artifact) => (
                    <View key={artifact.id} className="flex-row space-x-3 p-3 bg-card rounded-lg border border-border">
                      <Image
                        source={artifact.imageUrl || 'https://via.placeholder.com/64x64/e5e7eb/9ca3af?text=Artifact'}
                        className="w-16 h-16 rounded-lg"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <Text className="font-semibold text-foreground">{artifact.name}</Text>
                        {artifact.description && (
                          <Text className="text-sm text-muted-foreground mt-1" numberOfLines={2}>
                            {artifact.description}
                          </Text>
                        )}
                        {artifact.historicalPeriod && (
                          <Text className="text-xs text-muted-foreground mt-1">{artifact.historicalPeriod}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <Card className="bg-white border border-gray-200 rounded-lg mb-5">
            <CardContent className="px-3 py-2">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-3">
                    <Users size={16} color="#d97706" />
                  </View>
                  <Text className="text-lg font-semibold text-gray-900">Người tham gia ({totalReviews})</Text>
                </View>
              </View>

              {isLoadingReviews ? (
                <View className="py-8">
                  <Text className="text-center text-gray-500">Đang tải đánh giá...</Text>
                </View>
              ) : reviews.length === 0 ? (
                <View className="py-8 items-center">
                  <Users size={48} color="#d1d5db" />
                  <Text className="text-gray-500 text-center mt-2">Chưa có người tham gia đánh giá này</Text>
                </View>
              ) : (
                <View className="space-y-4">
                  {reviews.map((review) => (
                    <View key={review.id} className="border-b border-gray-100 pb-4">
                      <View className="flex-row items-start">
                        <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center mr-3">
                          {review.createdByUser.avatarUrl ? (
                            <Image
                              source={{ uri: review.createdByUser.avatarUrl }}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <Text className="text-gray-600 font-semibold">
                              {review.createdByUser.fullName.charAt(0).toUpperCase()}
                            </Text>
                          )}
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center justify-between mb-1">
                            <Text className="font-semibold text-gray-900">{review.createdByUser.fullName}</Text>
                            <Text className="text-gray-500 text-sm">{formatDate(review.createdAt)}</Text>
                          </View>
                          <View className="flex-row items-center mb-2">
                            {renderStars(review.rating)}
                            <Text className="text-gray-600 ml-2 text-sm">({review.rating}/5)</Text>
                          </View>
                          <Text className="text-gray-700">{review.comment}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </CardContent>
          </Card>

          {/* Đánh giá sự kiện section */}
          <Card className="bg-white border border-gray-200 rounded-lg mb-5">
            <CardContent className="px-3 py-2">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                  <MessageCircle size={16} color="#059669" />
                </View>
                <Text className="text-lg font-semibold text-gray-900">Đánh giá sự kiện</Text>
              </View>

              {reviews.length === 0 ? (
                <View className="py-8 items-center">
                  <MessageCircle size={48} color="#d1d5db" />
                  <Text className="text-gray-500 text-center mb-1 mt-2">Chưa có đánh giá nào</Text>
                  <Text className="text-gray-400 text-center text-sm">
                    Hãy là người đầu tiên chia sẻ ý kiến của bạn!
                  </Text>
                </View>
              ) : (
                <View className="space-y-4">
                  {reviews.map((review) => (
                    <View key={review.id} className="p-4 bg-gray-50 rounded-lg">
                      <View className="flex-row items-start">
                        <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3 shadow-sm">
                          {review.createdByUser.avatarUrl ? (
                            <Image
                              source={{ uri: review.createdByUser.avatarUrl }}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <Text className="text-gray-600 font-semibold">
                              {review.createdByUser.fullName.charAt(0).toUpperCase()}
                            </Text>
                          )}
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center justify-between mb-1">
                            <Text className="font-semibold text-gray-900">{review.createdByUser.fullName}</Text>
                            <Text className="text-gray-500 text-sm">{formatDate(review.createdAt)}</Text>
                          </View>
                          <View className="flex-row items-center mb-2">{renderStars(review.rating)}</View>
                          <Text className="text-gray-700">{review.comment}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </CardContent>
          </Card>

          {/* Registration Button */}
          {event.status === 'Published' && event.availableSlots > 0 && new Date() < new Date(event.bookingDeadline) && (
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg">
              <CardContent className="p-4">
                <Button className="w-full bg-transparent">
                  <Text className="text-white font-semibold text-lg">Đăng ký tham gia</Text>
                </Button>
              </CardContent>
            </Card>
          )}
        </View>

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
