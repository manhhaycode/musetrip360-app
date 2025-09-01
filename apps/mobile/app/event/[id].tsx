import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Text } from '@/components/core/ui/text';
import { useGetEventById, useGetEventParticipants } from '@musetrip360/event-management/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, Clock, MapPin, UserCheck, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EventDetailPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [refreshing, setRefreshing] = useState(false);

  const { data: event, isLoading: isLoadingEvent, error: eventError, refetch: refetchEvent } = useGetEventById(id!);

  const {
    data: eventParticipants,
    isLoading: isLoadingParticipants,
    refetch: refetchParticipants,
  } = useGetEventParticipants(id!);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([refetchEvent(), refetchParticipants()]).finally(() => setRefreshing(false));
  }, [refetchEvent, refetchParticipants]);

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
  const isPast = endTime < now;
  const isFree = event.price === 0;
  const isSoldOut = event.availableSlots === 0;

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
                <Text className="ml-2 text-base font-semibold text-[#a67c52]">
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

          {/* Registration Button */}
          {!isPast && !isSoldOut && (
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg">
              <CardContent className="p-4">
                <Button className="w-full bg-transparent">
                  <Text className="text-white font-semibold text-lg">
                    {isFree ? 'Đăng ký tham gia' : 'Mua vé ngay'}
                  </Text>
                </Button>
              </CardContent>
            </Card>
          )}
        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
