import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Filter, Search as SearchIcon } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/core/ui/badge';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Input } from '@/components/core/ui/input';
import { Text } from '@/components/core/ui/text';
import { MuseumCard } from '@/components/MuseumCard';
import { useMuseums } from '@/hooks/useMuseums';
import type { SearchFilters } from '@/types/api';

const SEARCH_TABS = [
  { key: 'Museum', label: 'Bảo tàng', icon: '🏛️' },
  { key: 'Artifact', label: 'Hiện vật', icon: '🏺' },
  { key: 'Event', label: 'Sự kiện', icon: '📅' },
  { key: 'TourOnline', label: 'Tour ảo', icon: '🌐' },
] as const;

type SearchTabKey = (typeof SEARCH_TABS)[number]['key'];

export default function SearchPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState((params.q as string) || '');
  const [activeTab, setActiveTab] = useState<SearchTabKey>('Museum');
  const [filters, setFilters] = useState<SearchFilters>({
    query: (params.q as string) || '',
    type: 'Museum',
    page: 1,
    pageSize: 12,
  });

  // For now, only museums are working with real API
  const {
    data: museumsData,
    isLoading: museumsLoading,
    refetch: refetchMuseums,
    error: museumsError,
  } = useMuseums({
    Page: 1,
    PageSize: 20,
    Search: filters.query || undefined,
  });

  // Debug API response
  React.useEffect(() => {
    console.log('Search Museums Data:', museumsData);
    console.log('Search Museums Loading:', museumsLoading);
    console.log('Search Museums Error:', museumsError);
  }, [museumsData, museumsLoading, museumsError]);

  const searchResults = useMemo(() => {
    if (activeTab === 'Museum' && museumsData?.data?.list) {
      return museumsData.data.list.map((museum) => ({
        id: museum.id,
        title: museum.name,
        type: 'Museum' as const,
        thumbnail: museum.metadata?.coverImageUrl,
        description: museum.description,
        location: museum.location,
        rating: museum.rating,
        reviewCount: 0, // Default value since this field doesn't exist in Museum type
      }));
    }

    return [];
  }, [activeTab, museumsData]);

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, query: searchQuery, page: 1 }));
    if (activeTab === 'Museum') {
      refetchMuseums();
    }
  };

  const handleTabChange = (tab: SearchTabKey) => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, type: tab, page: 1 }));
  };

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.type === 'Museum') {
          router.push(`/museum/${item.id}`);
        }
        // Handle other types when their detail pages are implemented
      }}
      className="mb-4"
    >
      <Card className="overflow-hidden bg-white border border-gray-200 rounded-lg">
        <CardContent className="p-0">
          <View className="flex-row">
            <Image
              source={item.thumbnail || 'https://images.unsplash.com/photo-1554757387-ea8f60cde1f0?w=400'}
              className="w-24 h-24"
              resizeMode="cover"
            />
            <View className="flex-1 p-4">
              <View className="flex-row items-start justify-between mb-2">
                <Text className="font-semibold text-base text-gray-900 flex-1 mr-2" numberOfLines={2}>
                  {item.title}
                </Text>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Text className="text-xs">
                    {SEARCH_TABS.find((tab) => tab.key === item.type)?.icon}{' '}
                    {SEARCH_TABS.find((tab) => tab.key === item.type)?.label}
                  </Text>
                </Badge>
              </View>

              <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                {item.description}
              </Text>

              {item.location && <Text className="text-gray-500 text-sm">📍 {item.location}</Text>}

              {item.rating && (
                <View className="flex-row items-center mt-1">
                  <Text className="text-yellow-500">⭐</Text>
                  <Text className="text-gray-900 text-sm ml-1 font-medium">{item.rating.toFixed(1)}</Text>
                  {item.reviewCount && <Text className="text-gray-500 text-sm ml-1">({item.reviewCount})</Text>}
                </View>
              )}
            </View>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-4 pt-4 pb-2 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Tìm kiếm</Text>

        {/* Search Bar */}
        <View className="relative mb-4">
          <Input
            placeholder="Tìm kiếm bảo tàng, hiện vật, sự kiện..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            className="pl-12 h-12 bg-gray-50 border-gray-200 text-base rounded-lg"
          />
          <TouchableOpacity onPress={handleSearch} className="absolute left-4 top-3">
            <SearchIcon size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity className="absolute right-4 top-3">
            <Filter size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Search Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          <View className="flex-row space-x-2">
            {SEARCH_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-full border ${
                  activeTab === tab.key ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
                }`}
              >
                <Text className={`text-sm font-medium ${activeTab === tab.key ? 'text-white' : 'text-gray-700'}`}>
                  {tab.icon} {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Results */}
      <View className="flex-1 px-4 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-900">
            {SEARCH_TABS.find((tab) => tab.key === activeTab)?.label}
          </Text>
          <Text className="text-gray-600">{searchResults.length} kết quả</Text>
        </View>

        {activeTab === 'Museum' && museumsLoading ? (
          <View className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-0">
                  <View className="flex-row">
                    <View className="w-24 h-24 bg-gray-200" />
                    <View className="flex-1 p-4">
                      <View className="w-3/4 h-4 bg-gray-200 rounded mb-2" />
                      <View className="w-1/2 h-3 bg-gray-200 rounded mb-2" />
                      <View className="w-1/3 h-3 bg-gray-200 rounded" />
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        ) : searchResults.length > 0 ? (
          activeTab === 'Museum' ? (
            <View className="space-y-4">
              {searchResults.map((museum: any) => (
                <MuseumCard key={museum.id} museum={museum} />
              ))}
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          )
        ) : (
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="p-8 items-center">
              <Text className="text-4xl mb-3">🔍</Text>
              <Text className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</Text>
              <Text className="text-gray-600 text-center">Thử tìm kiếm với từ khóa khác hoặc chọn tab khác</Text>
            </CardContent>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}
