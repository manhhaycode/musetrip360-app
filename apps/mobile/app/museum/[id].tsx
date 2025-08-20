import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Calendar, Globe, Heart, MapPin, Phone, Share, Star } from 'lucide-react-native';
import React from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/core/ui/badge';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Text } from '@/components/core/ui/text';
import type { Artifact } from '@musetrip360/artifact-management';
import { useArtifactsByMuseum } from '@musetrip360/artifact-management/api';
import type { Event } from '@musetrip360/event-management';
import { useGetEventsByMuseumId } from '@musetrip360/event-management/api';
import { useGetMuseumById } from '@musetrip360/museum-management/api';

const { width, height } = Dimensions.get('window');

type TabType = 'intro' | 'info' | 'artifacts' | 'events';

export default function MuseumDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, tab } = params;
  const [activeTab, setActiveTab] = React.useState<TabType>((tab as TabType) || 'intro');

  // Fetch museum data
  const { data: museum, isLoading: museumLoading } = useGetMuseumById(id as string, { enabled: !!id });

  // Fetch artifacts for this museum
  const { data: artifactsData, isLoading: artifactsLoading } = useArtifactsByMuseum(
    { museumId: id as string, Page: 1, PageSize: 20 },
    { enabled: !!id }
  );

  // Fetch events for this museum
  const { data: eventsData, isLoading: eventsLoading } = useGetEventsByMuseumId(
    id as string,
    { Page: 1, PageSize: 20 },
    { enabled: !!id }
  );

  // Handle artifacts data structure - useArtifactsByMuseum returns PaginatedResponse<Artifact>['data']
  const museumArtifacts = React.useMemo(() => {
    if (Array.isArray(artifactsData)) {
      return artifactsData;
    }
    return [];
  }, [artifactsData]);

  // Handle events data structure - useGetEventsByMuseumId returns PaginatedResponse<Event>
  const museumEvents = React.useMemo(() => {
    if (Array.isArray(eventsData?.data)) {
      return eventsData.data;
    } else if (eventsData?.data && Array.isArray(eventsData.data)) {
      return eventsData.data;
    }
    return [];
  }, [eventsData]);

  if (museumLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground">Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (!museum) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground">Không tìm thấy bảo tàng</Text>
      </SafeAreaView>
    );
  }

  const tabs = [
    { id: 'intro', label: 'Giới thiệu', icon: '📋' },
    { id: 'info', label: 'Thông tin', icon: '📍' },
    { id: 'artifacts', label: 'Hiện vật', icon: '🏺', count: museumArtifacts.length },
    { id: 'events', label: 'Sự kiện', icon: '📅', count: museumEvents.length },
  ];

  const renderIntroTab = () => (
    <View className="p-4">
      <Text className="text-lg font-bold text-foreground mb-3">Giới thiệu</Text>
      <Text className="text-muted-foreground text-sm leading-6 mb-4">{museum.description}</Text>

      {museum.categories && museum.categories.length > 0 && (
        <View className="mb-4">
          <Text className="text-base font-semibold text-foreground mb-3">Danh mục</Text>
          <View className="flex-row flex-wrap">
            {museum.categories.map((category, index) => (
              <Badge key={index} variant="secondary" className="mr-2 mb-2">
                <Text className="text-xs">{category.name}</Text>
              </Badge>
            ))}
          </View>
        </View>
      )}

      {museum.metadata?.detail && (
        <View>
          <Text className="text-base font-semibold text-foreground mb-3">Chi tiết</Text>
          <Text className="text-muted-foreground text-sm leading-6">{museum.metadata.detail}</Text>
        </View>
      )}
    </View>
  );

  const renderInfoTab = () => (
    <View className="p-4">
      <Text className="text-lg font-bold text-foreground mb-4">Thông tin chi tiết</Text>

      <Card className="mb-4">
        <CardContent className="p-4">
          <View className="space-y-3">
            <View className="flex-row items-start">
              <MapPin size={16} color="#6b7280" className="mt-1" />
              <View className="flex-1 ml-3">
                <Text className="text-xs text-muted-foreground">Địa chỉ</Text>
                <Text className="text-sm text-foreground">{museum.location}</Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Phone size={16} color="#6b7280" className="mt-1" />
              <View className="flex-1 ml-3">
                <Text className="text-xs text-muted-foreground">Điện thoại</Text>
                <Text className="text-sm text-foreground">{museum.contactPhone}</Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Globe size={16} color="#6b7280" className="mt-1" />
              <View className="flex-1 ml-3">
                <Text className="text-xs text-muted-foreground">Email</Text>
                <Text className="text-sm text-primary">{museum.contactEmail}</Text>
              </View>
            </View>

            {museum.metadata?.socialLinks?.website && (
              <View className="flex-row items-start">
                <Globe size={16} color="#6b7280" className="mt-1" />
                <View className="flex-1 ml-3">
                  <Text className="text-xs text-muted-foreground">Website</Text>
                  <Text className="text-sm text-primary">{museum.metadata.socialLinks.website}</Text>
                </View>
              </View>
            )}
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Text className="text-base font-semibold text-foreground mb-3">Trạng thái</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground text-sm">Trạng thái hoạt động</Text>
            <Badge variant={museum.status === 'Active' ? 'default' : 'secondary'}>
              <Text className="text-xs">{museum.status}</Text>
            </Badge>
          </View>
        </CardContent>
      </Card>
    </View>
  );

  const renderArtifactsTab = () => (
    <View className="p-4">
      <Text className="text-lg font-bold text-foreground mb-4">Hiện vật ({museumArtifacts.length})</Text>

      {museumArtifacts.length > 0 ? (
        <View className="space-y-3">
          {museumArtifacts.map((artifact: Artifact) => (
            <Card key={artifact.id}>
              <CardContent className="p-0">
                <View className="flex-row">
                  <Image
                    source={artifact.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'}
                    className="w-20 h-20 rounded-l-lg"
                  />
                  <View className="flex-1 p-3">
                    <Text className="font-bold text-sm text-foreground mb-1" numberOfLines={2}>
                      {artifact.name}
                    </Text>
                    <Text className="text-muted-foreground text-xs mb-2" numberOfLines={2}>
                      {artifact.historicalPeriod} • {artifact.metadata?.type || 'Hiện vật'}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground text-xs">
                        {artifact.metadata?.discoveryLocation
                          ? `Phát hiện: ${artifact.metadata.discoveryLocation}`
                          : 'Hiện vật bảo tàng'}
                      </Text>
                      <View className="flex-row items-center">
                        <Star size={10} color="#fbbf24" fill="#fbbf24" />
                        <Text className="text-foreground text-xs ml-1">{artifact.rating.toFixed(1)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      ) : (
        <View className="items-center py-8">
          <Text className="text-2xl mb-2">🏺</Text>
          <Text className="text-muted-foreground text-center">Chưa có hiện vật nào được trưng bày</Text>
        </View>
      )}
    </View>
  );

  const renderEventsTab = () => (
    <View className="p-4">
      <Text className="text-lg font-bold text-foreground mb-4">Sự kiện ({museumEvents.length})</Text>

      {museumEvents.length > 0 ? (
        <View className="space-y-3">
          {museumEvents.map((event: Event) => (
            <Card key={event.id}>
              <CardContent className="p-0">
                <View className="flex-row">
                  <Image
                    source={
                      event.metadata?.images?.[0] ||
                      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
                    }
                    className="w-20 h-20 rounded-l-lg"
                  />
                  <View className="flex-1 p-3">
                    <Text className="font-bold text-sm text-foreground mb-1" numberOfLines={2}>
                      {event.title}
                    </Text>
                    <View className="flex-row items-center mb-1">
                      <Calendar size={10} color="#6b7280" />
                      <Text className="text-muted-foreground text-xs ml-1">
                        {new Date(event.startTime).toLocaleDateString('vi-VN')}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground text-xs">{event.location}</Text>
                      <Badge variant={event.status === 'Published' ? 'default' : 'secondary'}>
                        <Text className="text-xs">{event.eventType}</Text>
                      </Badge>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      ) : (
        <View className="items-center py-8">
          <Text className="text-2xl mb-2">📅</Text>
          <Text className="text-muted-foreground text-center">Chưa có sự kiện nào được lên lịch</Text>
        </View>
      )}

      {/* TODO: Tours section - Need virtual tour API integration */}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'intro':
        return renderIntroTab();
      case 'info':
        return renderInfoTab();
      case 'artifacts':
        return renderArtifactsTab();
      case 'events':
        return renderEventsTab();
      default:
        return renderIntroTab();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="light" />

      {/* Hero Image with Header */}
      <View className="relative" style={{ height: height * 0.35 }}>
        <Image
          source={museum.metadata?.coverImageUrl || 'https://images.unsplash.com/photo-1554757387-ea8f60cde1f0?w=400'}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Overlay */}
        <View className="absolute inset-0 bg-black/30" />

        {/* Header */}
        <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between p-4 pt-12">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-black/50 rounded-full items-center justify-center"
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <View className="flex-row space-x-2">
            <TouchableOpacity className="w-10 h-10 bg-black/50 rounded-full items-center justify-center">
              <Heart size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-black/50 rounded-full items-center justify-center">
              <Share size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Museum Info Overlay */}
        <View className="absolute bottom-0 left-0 right-0 p-4">
          <Card>
            <CardContent className="p-4">
              <Text className="text-lg font-bold text-foreground mb-2">{museum.name}</Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <MapPin size={14} color="#6b7280" />
                  <Text className="text-muted-foreground text-sm ml-1 flex-1" numberOfLines={1}>
                    {museum.location}
                  </Text>
                </View>
                <View className="flex-row items-center ml-4">
                  <Star size={14} color="#fbbf24" fill="#fbbf24" />
                  <Text className="text-foreground text-sm ml-1 font-medium">{museum.rating.toFixed(1)}</Text>
                  <Text className="text-muted-foreground text-sm ml-1">(50+)</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>

      {/* Tabs Navigation */}
      <View className="flex-row bg-card border-b border-border">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 py-3 border-b-2 ${activeTab === tab.id ? 'border-primary' : 'border-transparent'}`}
          >
            <View className="items-center">
              <View className="flex-row items-center">
                <Text className="mr-1">{tab.icon}</Text>
                <Text
                  className={`font-medium text-xs ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {tab.label}
                </Text>
                {tab.count !== undefined && tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    <Text className="text-xs">{tab.count}</Text>
                  </Badge>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {renderTabContent()}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
