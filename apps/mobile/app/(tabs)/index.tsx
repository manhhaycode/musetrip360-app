import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Calendar, Heart, MapPin, Search, Star, Users } from 'lucide-react-native';
import React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/core/ui/badge';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Input } from '@/components/core/ui/input';
import { Text } from '@/components/core/ui/text';
import { Header } from '@/components/layout/Header';
import { museumCategories } from '@/libs/categories';
import type { Museum } from '@musetrip360/museum-management';
import { useMuseums } from '@musetrip360/museum-management/api';
import { useArtifacts } from '../../hooks/useArtifacts';
import { useEvents } from '../../hooks/useEvents';

export default function HomePage() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Fetch museums data
  const {
    data: museumsData,
    isLoading: museumsLoading,
    refetch: refetchMuseums,
  } = useMuseums({ Page: 1, PageSize: 10 }, { staleTime: 1000 * 60 * 5 });

  // Fetch events data
  const { data: eventsData, isLoading: eventsLoading, refetch: refetchEvents } = useEvents();

  // Fetch artifacts data
  const { data: artifactsData, isLoading: artifactsLoading, refetch: refetchArtifacts } = useArtifacts();

  // Handle museums data structure
  const featuredMuseums = React.useMemo(() => {
    if (Array.isArray(museumsData?.data)) {
      return museumsData.data;
    } else if (museumsData?.data?.data && Array.isArray(museumsData.data.data)) {
      return museumsData.data.data;
    } else if (museumsData?.data?.list && Array.isArray(museumsData.data.list)) {
      return museumsData.data.list;
    }
    return [];
  }, [museumsData]);

  // Handle events data structure
  const upcomingEvents = React.useMemo(() => {
    if ((eventsData as any)?.list && Array.isArray((eventsData as any).list)) {
      return (eventsData as any).list;
    }
    return [];
  }, [eventsData]);

  // Handle artifacts data structure
  const featuredArtifacts = React.useMemo(() => {
    if ((artifactsData as any)?.list && Array.isArray((artifactsData as any).list)) {
      return (artifactsData as any).list;
    }
    return [];
  }, [artifactsData]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([refetchMuseums(), refetchEvents(), refetchArtifacts()]).finally(() => setRefreshing(false));
  }, [refetchMuseums, refetchEvents, refetchArtifacts]);

  const handleSearch = () => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />

      <Header />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Search Bar */}
        <View className="mobile-container mobile-section">
          <View className="relative">
            <Input
              placeholder="Tìm kiếm bảo tàng, hiện vật, sự kiện..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              className="pl-12 h-12 bg-card border-border text-mobile-base"
            />
            <TouchableOpacity onPress={handleSearch} className="absolute left-4 top-3">
              <Search size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View className="mobile-section">
          <View className="flex-row items-center justify-between mobile-container mb-4">
            <Text className="text-mobile-lg font-semibold text-foreground">Danh mục</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {museumCategories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => router.push(`/search?category=${category.id}`)}
                className="mr-3"
              >
                <Card className="w-20 h-20 mobile-card-shadow">
                  <CardContent className="p-3 items-center justify-center">
                    <Text className="text-2xl mb-1">{category.icon}</Text>
                    <Text className="text-mobile-xs text-center text-foreground font-medium" numberOfLines={2}>
                      {category.label}
                    </Text>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Museums */}
        <View className="mobile-section">
          <View className="flex-row items-center justify-between mobile-container mb-4">
            <Text className="text-mobile-lg font-semibold text-foreground">Bảo tàng nổi bật</Text>
            <TouchableOpacity onPress={() => router.push('/search')} className="flex-row items-center">
              <Text className="text-primary font-medium mr-1 text-mobile-sm">Xem tất cả</Text>
              <ArrowRight size={16} color="hsl(var(--primary))" />
            </TouchableOpacity>
          </View>

          {museumsLoading
            ? // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <View key={index} className="mobile-container mb-4">
                  <Card className="overflow-hidden mobile-card-shadow">
                    <CardContent className="p-0">
                      <View className="flex-row">
                        <View className="w-24 h-24 bg-muted" />
                        <View className="flex-1 p-4">
                          <View className="w-3/4 h-4 bg-muted rounded mb-2" />
                          <View className="w-1/2 h-3 bg-muted rounded mb-2" />
                          <View className="w-1/3 h-3 bg-muted rounded" />
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              ))
            : featuredMuseums.slice(0, 5).map((museum: Museum) => (
                <TouchableOpacity
                  key={museum.id}
                  onPress={() => router.push(`/museum/${museum.id}`)}
                  className="mobile-container mb-4"
                >
                  <Card className="overflow-hidden mobile-card-shadow">
                    <CardContent className="p-0">
                      <View className="flex-row">
                        <Image
                          source={
                            museum.metadata?.coverImageUrl ||
                            'https://images.unsplash.com/photo-1554757387-ea8f60cde1f0?w=400'
                          }
                          className="w-24 h-24"
                          resizeMode="cover"
                        />
                        <View className="flex-1 p-4">
                          <View className="flex-row items-start justify-between mb-2">
                            <Text className="font-bold text-mobile-sm text-foreground flex-1 mr-2" numberOfLines={2}>
                              {museum.name}
                            </Text>
                            <TouchableOpacity className="p-1 touch-target">
                              <Heart size={16} color="#6b7280" />
                            </TouchableOpacity>
                          </View>

                          <View className="flex-row items-center mb-2">
                            <MapPin size={12} color="#6b7280" />
                            <Text className="text-muted-foreground text-mobile-xs ml-1 flex-1" numberOfLines={1}>
                              {museum.location}
                            </Text>
                          </View>

                          <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                              <Star size={12} color="#fbbf24" fill="#fbbf24" />
                              <Text className="text-foreground text-mobile-xs ml-1 font-medium">
                                {museum.rating.toFixed(1)}
                              </Text>
                              <Text className="text-muted-foreground text-mobile-xs ml-1">(50+)</Text>
                            </View>
                            <Badge variant="outline">
                              <Text className="text-mobile-xs">Miễn phí</Text>
                            </Badge>
                          </View>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))}
        </View>

        {/* Upcoming Events */}
        <View className="mobile-section">
          <View className="flex-row items-center justify-between mobile-container mb-4">
            <Text className="text-mobile-lg font-semibold text-foreground">Sự kiện sắp tới</Text>
            <TouchableOpacity onPress={() => router.push('/search?type=events')} className="flex-row items-center">
              <Text className="text-primary font-medium mr-1 text-mobile-sm">Xem tất cả</Text>
              <ArrowRight size={16} color="var(--primary)" />
            </TouchableOpacity>
          </View>

          {eventsLoading ? (
            // Loading skeleton
            <View className="mobile-container">
              <Card className="mobile-card-shadow">
                <CardContent className="p-4">
                  <View className="w-3/4 h-4 bg-muted rounded mb-2" />
                  <View className="w-1/2 h-3 bg-muted rounded mb-2" />
                  <View className="w-1/3 h-3 bg-muted rounded" />
                </CardContent>
              </Card>
            </View>
          ) : upcomingEvents.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {upcomingEvents.slice(0, 3).map((event: any, index: number) => (
                <TouchableOpacity
                  key={event.id || index}
                  onPress={() => router.push(`/museum/${event.museumId || event.museum?.id}?tab=events`)}
                  className="mr-4 w-80"
                >
                  <Card className="mobile-card-shadow">
                    <CardContent className="p-4">
                      <View className="flex-row items-start justify-between mb-3">
                        <View className="flex-1 mr-3">
                          <Text className="font-bold text-mobile-sm text-foreground mb-1" numberOfLines={2}>
                            {event.title || event.name}
                          </Text>
                          <Text className="text-muted-foreground text-mobile-xs" numberOfLines={2}>
                            {event.description}
                          </Text>
                        </View>
                        <Badge variant="secondary">
                          <Calendar size={10} color="#6b7280" />
                          <Text className="text-mobile-xs ml-1">Sự kiện</Text>
                        </Badge>
                      </View>

                      <View className="space-y-2">
                        <View className="flex-row items-center">
                          <MapPin size={12} color="#6b7280" />
                          <Text className="text-muted-foreground text-mobile-xs ml-1" numberOfLines={1}>
                            {event.location || event.museum?.name || 'Online'}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Calendar size={12} color="#6b7280" />
                          <Text className="text-muted-foreground text-mobile-xs ml-1">
                            {event.startTime ? new Date(event.startTime).toLocaleDateString('vi-VN') : 'Sắp diễn ra'}
                          </Text>
                        </View>
                        {event.capacity && (
                          <View className="flex-row items-center">
                            <Users size={12} color="#6b7280" />
                            <Text className="text-muted-foreground text-mobile-xs ml-1">
                              {event.availableSlots || 0}/{event.capacity || 100}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-border">
                        <Text className="text-primary font-semibold text-mobile-sm">Miễn phí</Text>
                        <TouchableOpacity className="bg-primary rounded-md px-3 py-1">
                          <Text className="text-primary-foreground text-mobile-xs font-medium">Đăng ký</Text>
                        </TouchableOpacity>
                      </View>
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View className="mobile-container">
              <Card className="mobile-card-shadow">
                <CardContent className="p-6 items-center">
                  <Text className="text-4xl mb-3">🎭</Text>
                  <Text className="text-mobile-lg font-semibold text-foreground mb-2">Sự kiện sắp tới</Text>
                  <Text className="text-muted-foreground text-mobile-sm text-center">
                    Các sự kiện thú vị đang được cập nhật...
                  </Text>
                </CardContent>
              </Card>
            </View>
          )}
        </View>

        {/* Featured Artifacts */}
        <View className="mobile-section">
          <View className="flex-row items-center justify-between mobile-container mb-4">
            <Text className="text-mobile-lg font-semibold text-foreground">Hiện vật nổi bật</Text>
            <TouchableOpacity onPress={() => router.push('/search?type=artifacts')}>
              <View className="flex-row items-center">
                <Text className="text-primary text-mobile-sm font-medium mr-1">Xem tất cả</Text>
                <ArrowRight size={16} color="#0ea5e9" />
              </View>
            </TouchableOpacity>
          </View>

          {!artifactsLoading && featuredArtifacts.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="pl-4"
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {featuredArtifacts.slice(0, 5).map((artifact: any, index: number) => (
                <TouchableOpacity
                  key={artifact.id || index}
                  onPress={() =>
                    router.push(`/museum/${artifact.museumId || 'unknown'}?tab=artifacts&artifactId=${artifact.id}`)
                  }
                  className="mr-4"
                >
                  <Card className="w-44 mobile-card-shadow">
                    <CardContent className="p-0">
                      <Image
                        source={{ uri: artifact.imageUrl || 'https://via.placeholder.com/176x128' }}
                        className="w-full h-32 rounded-t-lg"
                        style={{ width: 176, height: 128 }}
                      />
                      <View className="p-3">
                        <Text className="text-mobile-sm font-semibold text-foreground mb-1" numberOfLines={2}>
                          {artifact.name || 'Hiện vật bí ẩn'}
                        </Text>
                        <Text className="text-muted-foreground text-mobile-xs mb-2" numberOfLines={2}>
                          {artifact.description || 'Khám phá câu chuyện thú vị đằng sau hiện vật này'}
                        </Text>

                        <View className="flex-row items-center justify-between">
                          <Badge variant="outline">
                            <Text className="text-mobile-xs">{artifact.period || 'Cổ đại'}</Text>
                          </Badge>
                          <View className="flex-row items-center">
                            <Star size={12} color="#fbbf24" fill="#fbbf24" />
                            <Text className="text-mobile-xs text-muted-foreground ml-1">
                              {artifact.rating || '4.5'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View className="mobile-container">
              <Card className="mobile-card-shadow">
                <CardContent className="p-6 items-center">
                  <Text className="text-4xl mb-3">🏺</Text>
                  <Text className="text-mobile-lg font-semibold text-foreground mb-2">Hiện vật nổi bật</Text>
                  <Text className="text-muted-foreground text-mobile-sm text-center">
                    Các hiện vật quý giá đang được cập nhật...
                  </Text>
                </CardContent>
              </Card>
            </View>
          )}
        </View>

        {/* Bottom spacing for bottom navigation */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
