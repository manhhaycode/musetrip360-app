import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Search } from 'lucide-react-native';
import React from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, CardContent } from '@/components/core/ui/card';
import { Input } from '@/components/core/ui/input';
import { Text } from '@/components/core/ui/text';
import { MuseumCard } from '@/components/MuseumCard';
import { useMuseums } from '@/hooks/useMuseums';
import type { Museum } from '@musetrip360/museum-management';

export default function HomePage() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const {
    data: museumsData,
    isLoading: museumsLoading,
    refetch: refetchMuseums,
    error,
  } = useMuseums({ Page: 1, PageSize: 6 });

  const featuredMuseums = React.useMemo(() => {
    if (museumsData?.data?.list && Array.isArray(museumsData.data.list)) {
      return museumsData.data.list;
    }
    return [];
  }, [museumsData]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetchMuseums().finally(() => setRefreshing(false));
  }, [refetchMuseums]);

  const handleSearch = () => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hero Section */}
        <View className="px-4 pt-8 pb-6 bg-background rounded-2xl shadow-lg">
          {/* Search Bar */}
          <View className="relative">
            <Input
              className="bg-card text-foreground border-primary pl-12 h-12 text-base rounded-lg"
              placeholder="Tìm kiếm bảo tàng, hiện vật, sự kiện..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} className="absolute left-4 top-3">
              <Search size={20} color="#FF7A00" />
            </TouchableOpacity>
          </View>
        </View>
        <Text> </Text>
        {/* Featured Museums */}
        <View className="px-4 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-semibold text-foreground">Bảo tàng nổi bật</Text>
            <TouchableOpacity onPress={() => router.push('/search')} className="flex-row items-center">
              <Text className="text-primary font-medium mr-1">Xem tất cả</Text>
              <ArrowRight size={16} color="#FF7A00" />
            </TouchableOpacity>
          </View>
          {museumsLoading ? (
            <View className="space-y-4">
              <Text className="text-center text-muted-foreground mb-2">Đang tải bảo tàng...</Text>
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden bg-card border border-card rounded-xl shadow-md">
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
              ))}
            </View>
          ) : error ? (
            <Card className="bg-card border border-card rounded-xl shadow-md">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">⚠️</Text>
                <Text className="text-lg font-semibold text-foreground mb-2">Lỗi tải dữ liệu</Text>
                <Text className="text-muted-foreground text-center mb-4">
                  {error?.message || 'Không thể tải danh sách bảo tàng'}
                </Text>
                <TouchableOpacity onPress={() => refetchMuseums()} className="bg-primary px-4 py-2 rounded-lg">
                  <Text className="text-primary-foreground font-medium">Thử lại</Text>
                </TouchableOpacity>
              </CardContent>
            </Card>
          ) : featuredMuseums.length > 0 ? (
            <View className="space-y-4">
              {featuredMuseums.map((museum: Museum) => (
                <MuseumCard key={museum.id} museum={museum} />
              ))}
            </View>
          ) : (
            <Card className="bg-card border border-card rounded-xl shadow-md">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">🏛️</Text>
                <Text className="text-lg font-semibold text-foreground mb-2">Chưa có bảo tàng nổi bật</Text>
                <Text className="text-muted-foreground text-center">Các bảo tàng thú vị đang được cập nhật...</Text>
              </CardContent>
            </Card>
          )}
        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
