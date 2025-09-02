import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Input } from '@/components/core/ui/input';
import { Pagination } from '@/components/core/ui/pagination';
import { Text } from '@/components/core/ui/text';
import { useArtifacts } from '@/hooks/useArtifacts';
import { useEntityImage } from '@/hooks/useEntityImage';
import { useEvents } from '@/hooks/useEvents';
import { useMuseums } from '@/hooks/useMuseums';
import { useVirtualTours } from '@/hooks/useVirtualTours';
import type { SearchFilters, SearchResultItem } from '@/types/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CalendarDays, Filter, Frown, Globe2, Landmark, Package, Search as SearchIcon } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchUtils } from '../../hooks/useSearch';
import { extractImageUrl } from '../../utils/imageUtils';

// SearchHeader component: search bar + tabs
type SearchHeaderProps = {
  searchQuery: string;
  handleSearchInputChange: (text: string) => void;
  handleSearch: () => void;
  activeTab: SearchTabKey;
  handleTabChange: (tab: SearchTabKey) => void;
};

function SearchHeader({
  searchQuery,
  handleSearchInputChange,
  handleSearch,
  activeTab,
  handleTabChange,
}: SearchHeaderProps) {
  return (
    <View className="px-4 pt-8 pb-6 bg-background rounded-2xl shadow-lg">
      {/* Search Bar */}
      <View className="relative mb-8 bg-card rounded-xl">
        <Input
          className="bg-card text-card-foreground border-primary pl-12 h-12 text-base rounded-lg"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChangeText={handleSearchInputChange}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} className="absolute left-4 top-3">
          <SearchIcon size={20} color="#ff914d" />
        </TouchableOpacity>
        <TouchableOpacity className="absolute right-4 top-3">
          <Filter size={20} color="#a67c52" />
        </TouchableOpacity>
      </View>
      {/* Search Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row px-2">
          {SEARCH_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handleTabChange(tab.key)}
              className={`px-3 py-2 rounded-full border mr-3 min-w-[100px] ${activeTab === tab.key ? 'bg-primary border-primary' : 'bg-card border-card'}`}
            >
              <View className="flex-row items-center justify-center">
                <tab.icon size={16} color={activeTab === tab.key ? '#fff6ed' : '#a67c52'} style={{ marginRight: 4 }} />
                <Text
                  className={`text-sm font-medium ${activeTab === tab.key ? 'text-primary-foreground' : 'text-card-foreground'}`}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const SEARCH_TABS = [
  { key: 'Museum', label: 'Bảo tàng', icon: Landmark },
  { key: 'Artifact', label: 'Hiện vật', icon: Package },
  { key: 'Event', label: 'Sự kiện', icon: CalendarDays },
  { key: 'TourOnline', label: 'Tour ảo', icon: Globe2 },
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

  // API calls for different entity types  
  const museumParams = {
    Page: currentPage,
    PageSize: filters.pageSize,
    Search: filters.query || undefined,
  };

  const tourParams = {
    Page: currentPage,
    PageSize: filters.pageSize,
    Search: filters.query || undefined,
  };

  const artifactParams = {
    Page: currentPage,
    PageSize: filters.pageSize,
    Search: filters.query || undefined,
  };

  const eventParams = {
    Page: currentPage,
    PageSize: filters.pageSize,
    Search: filters.query || undefined,
  };

  // Conditional API calls based on active tab
  const { data: museumData, isLoading: isLoadingMuseums, error: museumError } = useMuseums(museumParams, {
    enabled: activeTab === 'Museum',
  });

  const { data: tourData, isLoading: isLoadingTours, error: tourError } = useVirtualTours(tourParams, {
    enabled: activeTab === 'TourOnline',
  });

  const { data: artifactData, isLoading: isLoadingArtifacts, error: artifactError } = useArtifacts(artifactParams, {
    enabled: activeTab === 'Artifact',
  });

  const { data: eventData, isLoading: isLoadingEvents, error: eventError } = useEvents(eventParams, {
    enabled: activeTab === 'Event',
  });

  // Determine current loading state and error
  const isLoading =
    (activeTab === 'Museum' && isLoadingMuseums) ||
    (activeTab === 'TourOnline' && isLoadingTours) ||
    (activeTab === 'Artifact' && isLoadingArtifacts) ||
    (activeTab === 'Event' && isLoadingEvents) ||
    false;

  const error =
    (activeTab === 'Museum' && museumError) ||
    (activeTab === 'TourOnline' && tourError) ||
    (activeTab === 'Artifact' && artifactError) ||
    (activeTab === 'Event' && eventError) ||
    null;

  // Đảm bảo fetch data ngay khi component mount
  useEffect(() => {
    // Force refresh data khi component mount hoặc tab change
    // Điều này đảm bảo data sẽ được fetch ngay cả khi không có search query
  }, [activeTab]);

  const searchResults = useMemo(() => {
    // Convert data from different APIs to SearchResultItem format
    let items: SearchResultItem[] = [];

    if (activeTab === 'Museum' && museumData?.data?.list) {
      items = museumData.data.list.map(museum => ({
        id: museum.id,
        title: museum.name,
        description: museum.description || '',
        type: 'Museum' as const,
        thumbnail: extractImageUrl(museum.metadata?.images?.[0]) ||
          extractImageUrl(museum.metadata?.logoUrl) ||
          undefined, // Following visitor-portal pattern
        location: museum.location || '',
      }));
    } else if (activeTab === 'TourOnline' && tourData?.list) {
      items = tourData.list.map(tour => ({
        id: tour.id,
        title: tour.name,
        description: tour.description || '',
        type: 'TourOnline' as const,
        thumbnail: extractImageUrl(tour.metadata?.images?.[0]) || undefined,
        location: '',
      }));
    } else if (activeTab === 'Artifact' && artifactData?.data?.list) {
      items = artifactData.data.list.map((artifact: any) => ({
        id: artifact.id,
        title: artifact.name,
        description: artifact.description || '',
        type: 'Artifact' as const,
        thumbnail: extractImageUrl(artifact.imageUrl) ||
          extractImageUrl(artifact.metadata?.images?.[0]) ||
          undefined,
        location: artifact.location || '',
      }));
    } else if (activeTab === 'Event' && eventData?.list) {
      // Event data structure: eventData = {list: [...], total: 27}
      items = eventData.list.map((event: any) => {
        const thumbnail = extractImageUrl(event.metadata?.thumbnail) ||
          extractImageUrl(event.representationMaterials?.[0]) ||
          extractImageUrl(event.metadata?.images?.[0]) ||
          extractImageUrl(event.bannerUrl) ||
          'https://thumb.ac-illust.com/11/11f66d349dd80280994aa0eea7902af5_t.jpeg'; // Fallback image

        return {
          id: event.id,
          title: event.title,
          description: event.description || '',
          type: 'Event' as const,
          thumbnail,
          location: event.location || '',
        };
      });
    }

    return items;
  }, [activeTab, museumData, tourData, artifactData, eventData]);

  const totalPages = useMemo(() => {
    let total = 0;
    if (activeTab === 'Museum' && museumData?.data?.total) {
      total = museumData.data.total;
    } else if (activeTab === 'TourOnline' && tourData?.total) {
      total = tourData.total;
    } else if (activeTab === 'Artifact' && artifactData?.data?.total) {
      total = artifactData.data.total;
    } else if (activeTab === 'Event' && eventData?.total) {
      total = eventData.total;
    }
    return searchUtils.calculateTotalPages(total, filters.pageSize);
  }, [activeTab, museumData, tourData, artifactData, eventData, filters.pageSize]);

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
    // Debounced search for live search - trigger ngay cả khi text rỗng
    debouncedSearch(text);
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
        router.push(`/tour/${item.id}` as any);
        break;
    }
  };

  const SearchResultCard = React.memo(({ item }: { item: SearchResultItem }) => {
    // Sử dụng hook để lấy ảnh thực tế khi search API không có thumbnail
    const { data: entityImage } = useEntityImage({
      id: item.id,
      type: item.type as 'Museum' | 'Artifact' | 'Event' | 'TourOnline', // Cast để tránh lỗi Article type
      enabled: !item.thumbnail, // Chỉ fetch khi search API không có thumbnail
    });

    const finalImageSource =
      item.thumbnail || entityImage || 'https://thumb.ac-illust.com/11/11f66d349dd80280994aa0eea7902af5_t.jpeg';

    // Tăng chiều cao cho bảo tàng vì có nhiều text hơn
    const cardHeight = item.type === 'Museum' ? 'h-32' : 'h-28';
    const imageHeight = item.type === 'Museum' ? 'h-32' : 'h-28';

    return (
      <TouchableOpacity onPress={() => navigateToDetail(item)} className="mb-4">
        <Card className="overflow-hidden bg-card border border-card rounded-lg shadow-md">
          <View className={`flex-row ${cardHeight}`}>
            <View className={`w-24 ${imageHeight} bg-muted`}>
              <Image
                source={{
                  uri: finalImageSource,
                }}
                className={`w-24 ${imageHeight}`}
                resizeMode="cover"
                defaultSource={{ uri: 'https://thumb.ac-illust.com/11/11f66d349dd80280994aa0eea7902af5_t.jpeg' }}
              />
            </View>
            <View className="flex-1 p-3 justify-between">
              <View className="flex-1">
                <View className="flex-row items-start justify-between mb-2">
                  <Text className="font-semibold text-base text-foreground flex-1 mr-2" numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View className="bg-primary border border-primary rounded px-2 py-1 shrink-0 flex-row items-center">
                    {(() => {
                      const tab = SEARCH_TABS.find((tab) => tab.key === item.type);
                      if (!tab) return null;
                      const Icon = tab.icon;
                      return <Icon size={14} color="#fff6ed" style={{ marginRight: 4 }} />;
                    })()}
                    <Text className="text-xs text-primary-foreground">
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
  });
  SearchResultCard.displayName = 'SearchResultCard';

  const renderSearchResultCard = ({ item }: { item: SearchResultItem }) => <SearchResultCard item={item} />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <SearchHeader
        searchQuery={searchQuery}
        handleSearchInputChange={handleSearchInputChange}
        handleSearch={handleSearch}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      />
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
          <Card className="bg-card border border-destructive rounded-lg">
            <CardContent className="p-8 items-center">
              <Frown size={40} color="#ff914d" className="mb-3" />
              <Text className="text-lg font-semibold text-destructive mb-2">Lỗi tìm kiếm</Text>
              <Text className="text-destructive text-center">{error?.message || 'Không thể thực hiện tìm kiếm'}</Text>
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
                {totalPages > 1 && (
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
          <Card className="bg-card border border-border rounded-lg">
            <CardContent className="p-8 items-center">
              <SearchIcon size={40} color="#ff914d" className="mb-3" />
              <Text className="text-lg font-semibold text-foreground mb-2">
                {filters.query ? 'Không tìm thấy kết quả' : 'Nhập từ khóa để tìm kiếm'}
              </Text>
              <Text className="text-muted-foreground text-center">
                {filters.query
                  ? 'Thử tìm kiếm với từ khóa khác hoặc chọn tab khác'
                  : 'Tìm kiếm bảo tàng, hiện vật, sự kiện và tour ảo'}
              </Text>
            </CardContent>
          </Card>
        </View>
      )}
    </SafeAreaView>
  );
}
