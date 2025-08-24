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

      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
        <View className="px-4 py-4 space-y-8">
          {/* Basic Info */}
          <View>
            <Text className="text-2xl font-bold text-gray-900 mb-3">{event.title}</Text>

            <View className="flex-row items-center justify-between mb-4">
              {/* Event Type */}
              <View className="bg-blue-100 border border-blue-200 rounded px-3 py-1">
                <Text className="text-sm text-blue-800">{event.eventType}</Text>
              </View>

              {/* Status */}
              <View
                className={`${
                  event.status === 'Published'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : event.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                } border rounded px-3 py-1`}
              >
                <Text className="text-sm">{event.status}</Text>
              </View>
            </View>

            {/* Date and Time */}
            <View className="flex-row items-center mb-3">
              <Calendar size={16} color="#6b7280" />
              <Text className="text-gray-600 text-base ml-2">
                {new Date(event.startTime).toLocaleDateString('vi-VN')} -{' '}
                {new Date(event.endTime).toLocaleDateString('vi-VN')}
              </Text>
            </View>

            {/* Location */}
            <View className="flex-row items-center mb-3">
              <MapPin size={16} color="#6b7280" />
              <Text className="text-gray-600 text-base ml-2">{event.location}</Text>
            </View>

            {/* Capacity and Availability */}
            <View className="flex-row items-center mb-3">
              <Users size={16} color="#6b7280" />
              <Text className="text-gray-600 text-base ml-2">
                {event.availableSlots}/{event.capacity} chỗ còn trống
              </Text>
            </View>
          </View>

          {/* Description */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
            <CardContent className="p-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-lg">📖</Text>
                </View>
                <Text className="text-lg font-semibold text-blue-900">Mô tả sự kiện</Text>
              </View>
              {event.description ? (
                <Text className="text-blue-800 text-base leading-6">{event.description}</Text>
              ) : (
                <Text className="text-blue-700 text-base italic">Thông tin mô tả đang được cập nhật...</Text>
              )}
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm">
            <CardContent className="p-4">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-lg">🎫</Text>
                </View>
                <Text className="text-lg font-semibold text-green-900">Thông tin chi tiết</Text>
              </View>

              <View className="space-y-3">
                {/* Time Details */}
                <View className="flex-row justify-between items-center p-3 bg-green-100/50 rounded-lg border border-green-200">
                  <Text className="text-sm font-medium text-green-900">Thời gian bắt đầu</Text>
                  <Text className="text-sm text-green-700">{new Date(event.startTime).toLocaleString('vi-VN')}</Text>
                </View>

                <View className="flex-row justify-between items-center p-3 bg-green-100/50 rounded-lg border border-green-200">
                  <Text className="text-sm font-medium text-green-900">Thời gian kết thúc</Text>
                  <Text className="text-sm text-green-700">{new Date(event.endTime).toLocaleString('vi-VN')}</Text>
                </View>

                <View className="flex-row justify-between items-center p-3 bg-green-100/50 rounded-lg border border-green-200">
                  <Text className="text-sm font-medium text-green-900">Hạn đăng ký</Text>
                  <Text className="text-sm text-green-700">
                    {new Date(event.bookingDeadline).toLocaleString('vi-VN')}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center p-3 bg-green-100/50 rounded-lg border border-green-200">
                  <Text className="text-sm font-medium text-green-900">Giá vé</Text>
                  <Text className="text-sm text-green-700">
                    {event.price > 0 ? `${event.price.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Tour Onlines */}
          {event.tourOnlines && event.tourOnlines.length > 0 && (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg shadow-sm">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 bg-purple-500 rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-lg">🌐</Text>
                  </View>
                  <Text className="text-lg font-semibold text-purple-900">Tour trực tuyến liên quan</Text>
                </View>
                <View className="space-y-2">
                  {event.tourOnlines.map((tour) => (
                    <View key={tour.id} className="p-3 bg-purple-100/50 rounded-lg border border-purple-300">
                      <Text className="font-semibold text-purple-900">{tour.name}</Text>
                      {tour.description && <Text className="text-sm text-purple-700 mt-1">{tour.description}</Text>}
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}

          {/* Artifacts */}
          {event.artifacts && event.artifacts.length > 0 && (
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg shadow-sm">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 bg-amber-500 rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-lg">🏺</Text>
                  </View>
                  <Text className="text-lg font-semibold text-amber-900">Hiện vật liên quan</Text>
                </View>
                <View className="space-y-3">
                  {event.artifacts.map((artifact) => (
                    <View
                      key={artifact.id}
                      className="flex-row space-x-3 p-3 bg-amber-100/50 rounded-lg border border-amber-300"
                    >
                      <Image
                        source={artifact.imageUrl || 'https://via.placeholder.com/64x64/e5e7eb/9ca3af?text=Artifact'}
                        className="w-16 h-16 rounded-lg"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <Text className="font-semibold text-amber-900">{artifact.name}</Text>
                        {artifact.description && (
                          <Text className="text-sm text-amber-700 mt-1" numberOfLines={2}>
                            {artifact.description}
                          </Text>
                        )}
                        {artifact.historicalPeriod && (
                          <Text className="text-xs text-amber-600 mt-1">{artifact.historicalPeriod}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <Card className="bg-white border border-gray-200 rounded-lg mb-6">
            <CardContent className="p-4">
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
          <Card className="bg-white border border-gray-200 rounded-lg mb-6">
            <CardContent className="p-4">
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
