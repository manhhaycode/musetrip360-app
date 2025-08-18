import React from 'react';
import { ScrollView, View, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Phone,
  Globe,
  Heart,
  Share,
  Calendar,
  Users,
  Play,
  Info,
} from 'lucide-react-native';

import { Text } from '@/components/core/ui/text';
import { Card, CardContent, CardHeader } from '@/components/core/ui/card';
import { Badge } from '@/components/core/ui/badge';
import { Image } from '@/components/core/ui/image';
import { Button } from '@/components/core/ui/button';
import { featuredMuseums, featuredArtifacts, onlineTours, upcomingEvents } from '@/lib/mockData';

const { width, height } = Dimensions.get('window');

type TabType = 'intro' | 'info' | 'artifacts' | 'events';

export default function MuseumDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, tab } = params;
  const [activeTab, setActiveTab] = React.useState<TabType>((tab as TabType) || 'intro');

  const museum = featuredMuseums.find((m) => m.id === id);
  const museumArtifacts = featuredArtifacts.filter((a) => a.museumId === id);
  const museumTours = onlineTours.filter((t) => t.museumId === id);
  const museumEvents = upcomingEvents.filter((e) => e.museumId === id);

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

      {museum.features.length > 0 && (
        <View className="mb-4">
          <Text className="text-base font-semibold text-foreground mb-3">Tiện ích</Text>
          <View className="flex-row flex-wrap">
            {museum.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="mr-2 mb-2">
                <Text className="text-xs">{feature}</Text>
              </Badge>
            ))}
          </View>
        </View>
      )}

      {museum.galleries.length > 0 && (
        <View>
          <Text className="text-base font-semibold text-foreground mb-3">Phòng trưng bày</Text>
          <View className="space-y-2">
            {museum.galleries.map((gallery, index) => (
              <View key={index} className="flex-row items-center">
                <View className="w-2 h-2 bg-primary rounded-full mr-2" />
                <Text className="text-muted-foreground text-sm">{gallery}</Text>
              </View>
            ))}
          </View>
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
              <Clock size={16} color="#6b7280" className="mt-1" />
              <View className="flex-1 ml-3">
                <Text className="text-xs text-muted-foreground">Giờ mở cửa</Text>
                <Text className="text-sm text-foreground">{museum.openingHours}</Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Phone size={16} color="#6b7280" className="mt-1" />
              <View className="flex-1 ml-3">
                <Text className="text-xs text-muted-foreground">Điện thoại</Text>
                <Text className="text-sm text-foreground">{museum.phone}</Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Globe size={16} color="#6b7280" className="mt-1" />
              <View className="flex-1 ml-3">
                <Text className="text-xs text-muted-foreground">Website</Text>
                <Text className="text-sm text-primary">{museum.website}</Text>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <Text className="text-base font-semibold text-foreground mb-3">Giá vé</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground text-sm">Vé người lớn</Text>
            <Text className="text-lg font-bold text-primary">{museum.price}</Text>
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
          {museumArtifacts.map((artifact) => (
            <Card key={artifact.id}>
              <CardContent className="p-0">
                <View className="flex-row">
                  <Image source={artifact.image} className="w-20 h-20 rounded-l-lg" />
                  <View className="flex-1 p-3">
                    <Text className="font-bold text-sm text-foreground mb-1" numberOfLines={2}>
                      {artifact.name}
                    </Text>
                    <Text className="text-muted-foreground text-xs mb-2" numberOfLines={2}>
                      {artifact.period} • {artifact.category}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground text-xs">Phát hiện: {artifact.discovered}</Text>
                      <View className="flex-row items-center">
                        <Star size={10} color="#fbbf24" fill="#fbbf24" />
                        <Text className="text-foreground text-xs ml-1">{artifact.rating}</Text>
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
          {museumEvents.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-0">
                <View className="flex-row">
                  <Image source={event.image} className="w-20 h-20 rounded-l-lg" />
                  <View className="flex-1 p-3">
                    <Text className="font-bold text-sm text-foreground mb-1" numberOfLines={2}>
                      {event.title}
                    </Text>
                    <View className="flex-row items-center mb-1">
                      <Calendar size={10} color="#6b7280" />
                      <Text className="text-muted-foreground text-xs ml-1">
                        {new Date(event.date).toLocaleDateString('vi-VN')} • {event.time}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground text-xs">{event.location}</Text>
                      <Badge variant="outline">
                        <Text className="text-xs">{event.price}</Text>
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

      {/* Tours section */}
      {museumTours.length > 0 && (
        <View className="mt-6">
          <Text className="text-base font-semibold text-foreground mb-3">Tour online</Text>
          <View className="space-y-3">
            {museumTours.map((tour) => (
              <Card key={tour.id}>
                <CardContent className="p-0">
                  <View className="flex-row">
                    <View className="relative">
                      <Image source={tour.thumbnail} className="w-20 h-20 rounded-l-lg" />
                      <View className="absolute inset-0 bg-black/30 rounded-l-lg items-center justify-center">
                        <Play size={16} color="white" fill="white" />
                      </View>
                    </View>
                    <View className="flex-1 p-3">
                      <Text className="font-bold text-sm text-foreground mb-1" numberOfLines={2}>
                        {tour.title}
                      </Text>
                      <View className="flex-row items-center mb-1">
                        <Text className="text-muted-foreground text-xs">{tour.duration}</Text>
                        <Text className="text-muted-foreground text-xs mx-1">•</Text>
                        <Users size={10} color="#6b7280" />
                        <Text className="text-muted-foreground text-xs ml-1">{tour.viewCount.toLocaleString()}</Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Star size={10} color="#fbbf24" fill="#fbbf24" />
                          <Text className="text-foreground text-xs ml-1">{tour.rating}</Text>
                        </View>
                        <Badge variant="outline">
                          <Text className="text-xs">{tour.price}</Text>
                        </Badge>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      )}
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
        <Image source={museum.image} className="w-full h-full" resizeMode="cover" />

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
                  <Text className="text-foreground text-sm ml-1 font-medium">{museum.rating}</Text>
                  <Text className="text-muted-foreground text-sm ml-1">({museum.reviewCount})</Text>
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
