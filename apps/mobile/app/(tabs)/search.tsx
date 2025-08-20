import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MapPin, Search, Star } from 'lucide-react-native';
import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/core/ui/badge';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Input } from '@/components/core/ui/input';
import { Text } from '@/components/core/ui/text';
import { Header } from '@/components/layout/Header';
import type { Artifact } from '@musetrip360/artifact-management';
import type { Museum } from '@musetrip360/museum-management';
import { useArtifacts } from '../../hooks/useArtifacts';
import { useMuseums } from '../../hooks/useMuseums';

export default function SearchPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = React.useState((params.q as string) || '');
  const [selectedType, setSelectedType] = React.useState('all');

  const searchTypes = [
    { id: 'all', label: 'Tất cả', icon: '🔍' },
    { id: 'museums', label: 'Bảo tàng', icon: '🏛️' },
    { id: 'artifacts', label: 'Hiện vật', icon: '🏺' },
    { id: 'tours', label: 'Tour VR', icon: '🎧' },
    { id: 'events', label: 'Sự kiện', icon: '📅' },
  ];

  // Fetch data based on search query and type
  const { data: museumsData, isLoading: museumsLoading } = useMuseums(
    {
      Page: 1,
      PageSize: 20,
      Search: searchQuery || undefined,
    },
    { enabled: selectedType === 'all' || selectedType === 'museums' }
  );

  const { data: artifactsData, isLoading: artifactsLoading } = useArtifacts();

  const searchResults = React.useMemo(() => {
    const results: any[] = [];

    if (selectedType === 'all' || selectedType === 'museums') {
      // Handle museums data structure (could be array or paginated response)
      let museumsList: Museum[] = [];

      if (Array.isArray(museumsData?.data)) {
        museumsList = museumsData.data;
      } else if (museumsData?.data?.data && Array.isArray(museumsData.data.data)) {
        museumsList = museumsData.data.data;
      } else if (museumsData?.data?.list && Array.isArray(museumsData.data.list)) {
        museumsList = museumsData.data.list;
      }

      const museums = museumsList.map((museum: Museum) => ({
        ...museum,
        type: 'museum',
        image: museum.metadata?.coverImageUrl || 'https://images.unsplash.com/photo-1554757387-ea8f60cde1f0?w=400',
        category: museum.categories?.[0]?.name || 'Bảo tàng',
        categoryIcon: '🏛️',
      }));
      results.push(...museums);
    }

    if (selectedType === 'all' || selectedType === 'artifacts') {
      // Handle artifacts data structure from custom hook
      let artifactsList: Artifact[] = [];

      if ((artifactsData as any)?.list && Array.isArray((artifactsData as any).list)) {
        artifactsList = (artifactsData as any).list;
      }

      const artifacts = artifactsList.map((artifact: Artifact) => ({
        ...artifact,
        type: 'artifact',
        image: artifact.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        period: artifact.historicalPeriod,
        category: artifact.metadata?.type || 'Hiện vật cổ',
      }));
      results.push(...artifacts);
    }

    // Filter by search query if provided
    if (searchQuery) {
      return results.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return results;
  }, [museumsData, artifactsData, selectedType, searchQuery]);

  const renderSearchResult = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'museum':
        return (
          <TouchableOpacity onPress={() => router.push(`/museum/${item.id}`)} className="mobile-container mb-4">
            <Card className="mobile-card-shadow">
              <CardContent className="p-0">
                <View className="flex-row">
                  <Image source={item.image} className="w-24 h-24 rounded-l-lg" />
                  <View className="flex-1 p-4">
                    <View className="flex-row items-start justify-between mb-2">
                      <Text className="font-bold text-mobile-sm text-foreground flex-1 mr-2" numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Badge variant="secondary">
                        <Text className="text-mobile-xs">
                          {item.categoryIcon} {item.category}
                        </Text>
                      </Badge>
                    </View>

                    <View className="flex-row items-center mb-2">
                      <MapPin size={12} color="#6b7280" />
                      <Text className="text-muted-foreground text-mobile-xs ml-1 flex-1" numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Star size={12} color="#fbbf24" fill="#fbbf24" />
                        <Text className="text-foreground text-mobile-xs ml-1">{item.rating.toFixed(1)}</Text>
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
        );

      case 'artifact':
        return (
          <TouchableOpacity
            onPress={() => router.push(`/museum/${item.museumId}?tab=artifacts`)}
            className="mobile-container mb-4"
          >
            <Card className="mobile-card-shadow">
              <CardContent className="p-0">
                <View className="flex-row">
                  <Image source={item.image} className="w-24 h-24 rounded-l-lg" />
                  <View className="flex-1 p-4">
                    <View className="flex-row items-start justify-between mb-2">
                      <Text className="font-bold text-mobile-sm text-foreground flex-1 mr-2" numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Badge variant="secondary">
                        <Text className="text-mobile-xs">🏺 Hiện vật</Text>
                      </Badge>
                    </View>

                    <Text className="text-muted-foreground text-mobile-xs mb-2" numberOfLines={2}>
                      {item.period} • {item.category}
                    </Text>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground text-mobile-xs">{item.museumName || 'Bảo tàng'}</Text>
                      <View className="flex-row items-center">
                        <Star size={12} color="#fbbf24" fill="#fbbf24" />
                        <Text className="text-foreground text-mobile-xs ml-1">4.5</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  const handleSearch = () => {
    // Search function already handled by useMemo searchResults
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />

      <Header title="Tìm kiếm" showSearch={false} showNotification={true} showProfile={true} />

      <View className="flex-1">
        {/* Search Section */}
        <View className="mobile-container mobile-section bg-card border-b border-border pb-4">
          {/* Search Input */}
          <View className="relative mb-4">
            <Input
              placeholder="Tìm kiếm bảo tàng, hiện vật, tour ảo..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              className="pl-12 h-12 bg-background border-border text-mobile-base"
            />
            <Search size={20} color="#6b7280" className="absolute left-4 top-3" />
          </View>

          {/* Search Type Toggle */}
          <View className="flex-row bg-muted rounded-lg p-1">
            {searchTypes.slice(0, 3).map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedType(type.id)}
                className={`flex-1 py-2 rounded-md ${selectedType === type.id ? 'bg-card shadow-sm' : ''}`}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="mr-1 text-mobile-sm">{type.icon}</Text>
                  <Text
                    className={`font-medium text-mobile-sm ${
                      selectedType === type.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {type.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Extended Types */}
          <View className="flex-row mt-3 space-x-2">
            {searchTypes.slice(3).map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-lg mr-2 touch-target ${selectedType === type.id ? 'bg-primary' : 'bg-muted'}`}
              >
                <View className="flex-row items-center">
                  <Text className="mr-1 text-mobile-xs">{type.icon}</Text>
                  <Text
                    className={`text-mobile-xs font-medium ${
                      selectedType === type.id ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {type.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results Count */}
        <View className="mobile-container py-3 bg-muted border-b border-border">
          <Text className="text-muted-foreground text-mobile-sm">
            {museumsLoading || artifactsLoading ? 'Đang tìm kiếm...' : `${searchResults.length} kết quả`}
          </Text>
        </View>

        {/* Search Results */}
        <View className="flex-1">
          {searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              contentContainerStyle={{
                paddingTop: 16,
                paddingBottom: 16,
              }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="flex-1 items-center justify-center py-16 mobile-container">
              {museumsLoading || artifactsLoading ? (
                <>
                  <Text className="text-4xl mb-4">⏳</Text>
                  <Text className="text-mobile-lg font-bold text-foreground mb-2">Đang tìm kiếm...</Text>
                  <Text className="text-muted-foreground text-center text-mobile-base">
                    Vui lòng chờ trong giây lát
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-4xl mb-4">🔍</Text>
                  <Text className="text-mobile-lg font-bold text-foreground mb-2">Không tìm thấy kết quả</Text>
                  <Text className="text-muted-foreground text-center text-mobile-base leading-6">
                    {searchQuery
                      ? `Không tìm thấy kết quả cho "${searchQuery}". Hãy thử với từ khóa khác.`
                      : 'Nhập từ khóa để bắt đầu tìm kiếm bảo tàng, hiện vật hoặc tour ảo'}
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
