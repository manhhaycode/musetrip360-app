import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Filter, Search as SearchIcon } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Input } from '@/components/core/ui/input';
import { Pagination } from '@/components/core/ui/pagination';
import { Text } from '@/components/core/ui/text';
import { searchUtils, useGlobalSearch } from '@/hooks/useSearch';
import type { SearchFilters, SearchResultItem } from '@/types/api';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    query: (params.q as string) || '',
    type: 'Museum',
    page: 1,
    pageSize: 12,
  });

  // Convert filters to API parameters
  const apiParams = useMemo(() => {
    return searchUtils.formatFiltersForAPI({
      ...filters,
      type: activeTab,
      page: currentPage,
    });
  }, [filters, activeTab, currentPage]);

  // Global search API call
  const { data: searchResponse, isLoading, error } = useGlobalSearch(apiParams, true);

  const searchResults = useMemo(() => {
    return searchResponse?.data?.items || [];
  }, [searchResponse]);

  const totalPages = useMemo(() => {
    if (!searchResponse?.data) return 0;
    return searchUtils.calculateTotalPages(searchResponse.data.total, filters.pageSize);
  }, [searchResponse?.data, filters.pageSize]);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      searchUtils.debounceSearch((newQuery: string) => {
        setFilters((prev) => ({ ...prev, query: newQuery, page: 1 }));
        setCurrentPage(1);
      }, 500),
    []
  );

  const handleSearch = () => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, query: searchQuery, page: 1 }));
  };

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
    // Debounced search for live search
    if (text.length >= 2 || text.length === 0) {
      debouncedSearch(text);
    }
  };

  const handleTabChange = (tab: SearchTabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, type: tab, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const navigateToDetail = (item: SearchResultItem) => {
    switch (item.type) {
      case 'Museum':
        router.push(`/museum/${item.id}` as any);
        break;
      case 'Artifact':
        router.push(`/artifact/${item.id}` as any);
        break;
      case 'Event':
        router.push(`/event/${item.id}` as any);
        break;
      case 'Article':
        router.push(`/article/${item.id}` as any);
        break;
      case 'TourOnline':
        // Tour online details can be implemented later
        break;
    }
  };

  const renderSearchResultCard = ({ item }: { item: SearchResultItem }) => {
    // Tăng chiều cao cho bảo tàng vì có nhiều text hơn
    const cardHeight = item.type === 'Museum' ? 'h-32' : 'h-28';
    const imageHeight = item.type === 'Museum' ? 'h-32' : 'h-28';

    return (
      <TouchableOpacity onPress={() => navigateToDetail(item)} className="mb-4">
        <Card className="overflow-hidden bg-card border border-card rounded-xl shadow-md">
          <View className={`flex-row ${cardHeight}`}>
            <View className={`w-24 ${imageHeight} bg-gray-100`}>
              <Image
                source={{
                  uri: item.thumbnail || 'https://via.placeholder.com/96x96/e5e7eb/9ca3af?text=Image',
                }}
                className={`w-24 ${imageHeight}`}
                resizeMode="cover"
                defaultSource={{ uri: 'https://via.placeholder.com/96x96/e5e7eb/9ca3af?text=Loading' }}
              />
            </View>
            <View className="flex-1 p-3 justify-between">
              <View className="flex-1">
                <View className="flex-row items-start justify-between mb-2">
                  <Text className="font-semibold text-base text-foreground flex-1 mr-2" numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View className="bg-primary border border-primary rounded px-2 py-1 shrink-0">
                    <Text className="text-xs text-primary-foreground">
                      {SEARCH_TABS.find((tab) => tab.key === item.type)?.icon}{' '}
                      {SEARCH_TABS.find((tab) => tab.key === item.type)?.label}
                    </Text>
                  </View>
                </View>

                <Text
                  className="text-muted-foreground text-sm leading-5"
                  numberOfLines={item.type === 'Museum' ? 4 : 3}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-4 pt-8 pb-6 bg-background rounded-2xl shadow-lg">
        {/* Search Bar */}
        <View className="relative mb-4 bg-card rounded-xl">
          <Input
            className="bg-card text-card-foreground border-primary pl-12 h-12 text-base rounded-lg"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChangeText={handleSearchInputChange}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} className="absolute left-4 top-3">
            <SearchIcon size={20} color="#ff941d" />
          </TouchableOpacity>
          <TouchableOpacity className="absolute right-4 top-3">
            <Filter size={20} color="#a67c52" />
          </TouchableOpacity>
        </View>

        {/* Search Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          <View className="flex-row">
            {SEARCH_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-full border mr-6 ${
                  activeTab === tab.key ? 'bg-primary border-primary' : 'bg-card border-card'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${activeTab === tab.key ? 'text-primary-foreground' : 'text-card-foreground'}`}
                >
                  {tab.icon} {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Results */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-4 px-4">
          <Text className="text-gray-600">{searchResults.length} kết quả</Text>
        </View>

        {isLoading ? (
          <View className="px-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden bg-white border border-gray-200 rounded-lg mb-4">
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
        ) : error ? (
          <View className="px-4">
            <Card className="bg-white border border-red-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">⚠️</Text>
                <Text className="text-lg font-semibold text-red-900 mb-2">Lỗi tìm kiếm</Text>
                <Text className="text-red-600 text-center">{error?.message || 'Không thể thực hiện tìm kiếm'}</Text>
              </CardContent>
            </Card>
          </View>
        ) : searchResults.length > 0 ? (
          <View className="flex-1">
            <FlatList
              data={searchResults}
              renderItem={renderSearchResultCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              ItemSeparatorComponent={() => <View className="h-4" />}
              ListFooterComponent={() => (
                <View className="pt-4 pb-20">
                  {/* Pagination */}
                  {searchResponse?.data?.total && totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      showPages={5}
                      className="pt-4"
                    />
                  )}
                </View>
              )}
            />
          </View>
        ) : (
          <View className="px-4">
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">🔍</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  {filters.query ? 'Không tìm thấy kết quả' : 'Nhập từ khóa để tìm kiếm'}
                </Text>
                <Text className="text-gray-600 text-center">
                  {filters.query
                    ? 'Thử tìm kiếm với từ khóa khác hoặc chọn tab khác'
                    : 'Tìm kiếm bảo tàng, hiện vật, sự kiện và tour ảo'}
                </Text>
              </CardContent>
            </Card>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
