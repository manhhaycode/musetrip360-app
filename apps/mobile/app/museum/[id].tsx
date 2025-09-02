import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Camera,
  ClipboardList,
  Clock,
  Frown,
  Globe2,
  Mail,
  MapPin,
  Newspaper,
  Package,
  Phone,
  Star,
  Tag,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, RefreshControl, ScrollView, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Pagination } from '@/components/core/ui/pagination';
import { Text } from '@/components/core/ui/text';
import { useArticles } from '@/hooks/useArticles';
import { useMuseumArtifacts } from '@/hooks/useArtifacts';
import { useMuseumEvents } from '@/hooks/useEvents';
import { useFeedbacks } from '@/hooks/useFeedbacks';
import { useMuseum } from '@/hooks/useMuseums';
import { useVirtualTours } from '@/hooks/useVirtualTours';

function MuseumHeader() {
  const router = useRouter();
  const { from } = useLocalSearchParams<{ from?: string }>();

  const handleBackPress = () => {
    if (from === 'artifact') {
      // Nếu đến từ artifact detail, navigate về home hoặc search
      router.replace('/(tabs)/' as any);
    } else {
      // Normal back behavior
      router.back();
    }
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-4 bg-background ">
      <TouchableOpacity onPress={handleBackPress} className="p-2">
        <ArrowLeft size={24} color="#2d1f13" />
      </TouchableOpacity>
      <Text className="text-lg font-semibold text-foreground">Chi tiết bảo tàng</Text>
      <View className="w-10" />
    </View>
  );
}

const MUSEUM_TABS = [
  { key: 'overview', label: 'Giới thiệu', icon: BookOpen },
  { key: 'artifacts', label: 'Hiện vật', icon: Package },
  { key: 'events', label: 'Sự kiện', icon: CalendarDays },
  { key: 'articles', label: 'Bài viết', icon: Newspaper },
  { key: 'tours', label: 'Tour ảo', icon: Globe2 },
  { key: 'feedbacks', label: 'Đánh giá', icon: Star },
] as const;

type MuseumTabKey = (typeof MUSEUM_TABS)[number]['key'];

export default function MuseumDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<MuseumTabKey>('overview');
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

  // Pagination states for each tab
  const [artifactsPage, setArtifactsPage] = useState(1);
  const [eventsPage, setEventsPage] = useState(1);
  const [toursPage, setToursPage] = useState(1);
  const [articlesPage, setArticlesPage] = useState(1);

  const { data: museum, isLoading, error, refetch } = useMuseum(id!);

  // Fetch artifacts and events for this museum
  const {
    data: artifactsData,
    isLoading: artifactsLoading,
    error: artifactsError,
  } = useMuseumArtifacts(id!, { Page: artifactsPage, PageSize: 12 });

  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = useMuseumEvents(id!, { Page: eventsPage, PageSize: 12 });

  const {
    data: virtualToursData,
    isLoading: virtualToursLoading,
    error: virtualToursError,
  } = useVirtualTours({ museumId: id!, Page: toursPage, PageSize: 12 });

  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: articlesError,
  } = useArticles({ museumId: id!, Page: articlesPage, PageSize: 12 });

  const {
    data: feedbacksData,
    isLoading: feedbacksLoading,
    error: feedbacksError,
  } = useFeedbacks({ targetId: id!, targetType: 'Museum', Page: 1, PageSize: 20 });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  // Function to render HTML content
  const renderHtmlContent = (htmlContent: string) => {
    if (!htmlContent) return null;

    const tagsStyles = {
      h1: { fontSize: 24, fontWeight: 'bold' as const, marginBottom: 16, color: '#1f2937' },
      h2: { fontSize: 22, fontWeight: 'bold' as const, marginBottom: 14, color: '#1f2937' },
      h3: { fontSize: 20, fontWeight: 'bold' as const, marginBottom: 12, color: '#1f2937' },
      h4: { fontSize: 18, fontWeight: 'bold' as const, marginBottom: 10, color: '#1f2937' },
      p: { fontSize: 16, lineHeight: 24, marginBottom: 12, color: '#374151' },
      span: { fontSize: 16, color: '#374151' },
      strong: { fontWeight: 'bold' as const },
      b: { fontWeight: 'bold' as const },
      em: { fontStyle: 'italic' as const },
      i: { fontStyle: 'italic' as const },
      img: {
        marginVertical: 8,
        maxWidth: width - 64,
        width: '100%',
        height: 'auto',
        borderRadius: 12,
      },
    };

    const systemFonts = ['System'];

    return (
      <RenderHtml
        contentWidth={width - 32} // Account for padding
        source={{ html: htmlContent }}
        tagsStyles={tagsStyles}
        systemFonts={systemFonts}
        ignoredDomTags={['a']}
        renderersProps={{
          img: {
            enableExperimentalPercentWidth: true,
          },
        }}
      />
    );
  };

  // Function to get the best available image
  const getMuseumImage = () => {
    // Try cover image first
    if (museum?.metadata?.coverImageUrl) {
      return museum.metadata.coverImageUrl;
    }

    // Try first image from images array
    if (museum?.metadata?.images && museum.metadata.images.length > 0) {
      return museum.metadata.images[0];
    }

    // Fallback image
    return 'https://thumb.ac-illust.com/11/11f66d349dd80280994aa0eea7902af5_t.jpeg';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        if (!museum) return null;

        return (
          <View className="px-2">
            <Card className="bg-card border border-border rounded-lg shadow-sm mb-8">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                    <BookOpen size={20} color="#fff" />
                  </View>
                  <Text className="text-lg font-semibold text-primary">Giới thiệu</Text>
                </View>
                {museum.metadata?.contentHomePage ? (
                  renderHtmlContent(museum.metadata.contentHomePage)
                ) : (
                  <Text className="text-foreground text-base leading-6">
                    {museum.description || 'Thông tin giới thiệu đang được cập nhật...'}
                  </Text>
                )}
              </CardContent>
            </Card>

            {/* Detailed Information */}
            {museum.metadata?.detail && (
              <Card className="bg-card border border-border rounded-lg shadow-sm mb-8">
                <CardContent className="p-4">
                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                      <ClipboardList size={20} color="#fff" />
                    </View>
                    <Text className="text-lg font-semibold text-primary">Thông tin chi tiết</Text>
                  </View>
                  {renderHtmlContent(museum.metadata.detail)}
                </CardContent>
              </Card>
            )}

            {/* Museum Images */}

            {/* Categories */}
            {museum.categories && museum.categories.length > 0 && (
              <Card className="bg-card border border-border rounded-lg shadow-sm mb-8">
                <CardContent className="p-4">
                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                      <Tag size={20} color="#fff" />
                    </View>
                    <Text className="text-lg font-semibold text-primary">Danh mục bảo tàng</Text>
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {museum.categories.map((category) => (
                      <View key={category.id} className="px-3 py-2 bg-card rounded-lg border border-border">
                        <Text className="text-sm text-foreground font-medium">{category.name}</Text>
                        {category.description && (
                          <Text className="text-xs text-foreground mt-1">{category.description}</Text>
                        )}
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            )}

            {/* Additional Images - Only show if we have multiple images or different from cover */}
            {museum.metadata?.images &&
              museum.metadata.images.length > 0 &&
              (() => {
                // Filter out images that are the same as cover image and ensure they're valid URLs
                const availableImages = museum.metadata.images.filter(
                  (img) =>
                    img &&
                    img !== museum.metadata?.coverImageUrl &&
                    (img.startsWith('http://') || img.startsWith('https://'))
                );

                // If we have the cover image, include additional images
                // If no cover image, show first image as cover and rest as additional
                const displayImages = museum.metadata?.coverImageUrl
                  ? availableImages
                  : museum.metadata.images
                    .filter((img) => img && (img.startsWith('http://') || img.startsWith('https://')))
                    .slice(1); // Skip first image as it's used as cover

                if (displayImages.length === 0) return null;

                return (
                  <Card className="bg-card border border-border rounded-lg shadow-sm mb-8">
                    <CardContent className="p-4">
                      <View className="flex-row items-center mb-3">
                        <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                          <Camera size={20} color="#fff" />
                        </View>
                        <Text className="text-lg font-semibold text-primary">Hình ảnh bảo tàng</Text>
                      </View>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
                        {displayImages.map((imageUrl, index) => (
                          <Image
                            key={index}
                            source={imageUrl}
                            className="w-48 h-32 rounded-lg mr-3"
                            resizeMode="cover"
                          />
                        ))}
                      </ScrollView>
                    </CardContent>
                  </Card>
                );
              })()}
          </View>
        );

      case 'artifacts':
        if (artifactsLoading) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-lg font-semibold text-foreground mb-2">Đang tải hiện vật...</Text>
              </CardContent>
            </Card>
          );
        }

        if (artifactsError) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Frown size={32} color="#a67c52" className="mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-2">Lỗi tải hiện vật</Text>
                <Text className="text-muted-foreground text-center">
                  {artifactsError?.message || 'Không thể tải danh sách hiện vật'}
                </Text>
              </CardContent>
            </Card>
          );
        }

        const artifacts = (artifactsData as any)?.list || [];

        if (artifacts.length === 0) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Package size={32} color="#a67c52" className="mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-2">Chưa có hiện vật</Text>
                <Text className="text-muted-foreground text-center">
                  Bảo tàng này chưa có hiện vật nào được trưng bày
                </Text>
              </CardContent>
            </Card>
          );
        }

        return (
          <View className="px-2">
            {artifacts.map((artifact: any) => (
              <TouchableOpacity
                key={artifact.id}
                onPress={() => router.push(`/artifact/${artifact.id}` as any)}
                className="mb-4"
              >
                <Card className="bg-card border border-border rounded-lg overflow-hidden">
                  <View className="flex-row h-24">
                    <Image
                      source={{
                        uri: artifact.imageUrl || 'https://via.placeholder.com/96x96/e5e7eb/9ca3af?text=Artifact',
                      }}
                      className="w-24 h-24"
                      resizeMode="cover"
                    />
                    <View className="flex-1 p-3 justify-between">
                      <View className="flex-1">
                        <Text className="font-semibold text-base text-foreground mb-1" numberOfLines={2}>
                          {artifact.name}
                        </Text>
                        <Text className="text-muted-foreground text-sm flex-1" numberOfLines={2}>
                          {artifact.description}
                        </Text>
                      </View>
                      <Text className="text-muted-foreground text-xs mt-1">{artifact.historicalPeriod}</Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}

            {/* Artifacts Pagination */}
            {(artifactsData as any)?.total && Math.ceil((artifactsData as any).total / 12) > 1 && (
              <Pagination
                currentPage={artifactsPage}
                totalPages={Math.ceil((artifactsData as any).total / 12)}
                onPageChange={setArtifactsPage}
                showPages={5}
                className="pt-4"
              />
            )}
          </View>
        );

      case 'events':
        if (eventsLoading) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-lg font-semibold text-foreground mb-2">Đang tải sự kiện...</Text>
              </CardContent>
            </Card>
          );
        }

        if (eventsError) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Frown size={32} color="#a67c52" className="mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-2">Lỗi tải sự kiện</Text>
                <Text className="text-muted-foreground text-center">
                  {eventsError?.message || 'Không thể tải danh sách sự kiện'}
                </Text>
              </CardContent>
            </Card>
          );
        }

        const events = (eventsData as any)?.list || [];

        if (events.length === 0) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <CalendarDays size={32} color="#0ea5e9" className="mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-2">Chưa có sự kiện</Text>
                <Text className="text-muted-foreground text-center">Bảo tàng này chưa có sự kiện nào được tổ chức</Text>
              </CardContent>
            </Card>
          );
        }

        return (
          <View className="px-2">
            {events.map((event: any) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => router.push(`/event/${event.id}` as any)}
                className="mb-4"
              >
                <Card className="bg-card border border-border rounded-lg">
                  <CardContent className="p-4">
                    <Text className="font-semibold text-base text-foreground mb-2" numberOfLines={2}>
                      {event.title}
                    </Text>
                    <Text className="text-muted-foreground text-sm mb-3 leading-5" numberOfLines={3}>
                      {event.description}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground text-xs">
                        {new Date(event.startTime).toLocaleDateString('vi-VN')}
                      </Text>
                      <View className="bg-accent/10 border border-accent rounded px-2 py-1">
                        <Text className="text-xs text-accent">
                          {event.eventType === 'SpecialEvent'
                            ? 'Sự kiện đặc biệt'
                            : event.eventType === 'Exhibition'
                              ? 'Triển lãm'
                              : 'Khác'}
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}

            {/* Events Pagination */}
            {(eventsData as any)?.total && Math.ceil((eventsData as any).total / 12) > 1 && (
              <Pagination
                currentPage={eventsPage}
                totalPages={Math.ceil((eventsData as any).total / 12)}
                onPageChange={setEventsPage}
                showPages={5}
                className="pt-4"
              />
            )}
          </View>
        );

      case 'articles':
        if (articlesLoading) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-lg font-semibold text-foreground mb-2">Đang tải bài viết...</Text>
              </CardContent>
            </Card>
          );
        }

        if (articlesError) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Frown size={32} color="#a67c52" className="mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-2">Lỗi tải bài viết</Text>
                <Text className="text-muted-foreground text-center">
                  {articlesError?.message || 'Không thể tải danh sách bài viết'}
                </Text>
              </CardContent>
            </Card>
          );
        }

        const articles = (articlesData as any)?.list || [];

        if (articles.length === 0) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Newspaper size={32} color="#0ea5e9" className="mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-2">Chưa có bài viết</Text>
                <Text className="text-muted-foreground text-center">
                  Bảo tàng này chưa có bài viết nào được đăng tải
                </Text>
              </CardContent>
            </Card>
          );
        }

        return (
          <View className="px-2">
            {articles.map((article: any) => (
              <TouchableOpacity
                key={article.id}
                onPress={() => router.push(`/article/${article.id}` as any)}
                className="mb-4"
              >
                <Card className="bg-card border border-border rounded-lg">
                  <CardContent className="p-4">
                    <Text className="font-semibold text-base text-foreground mb-1" numberOfLines={2}>
                      {article.title}
                    </Text>
                    <Text className="text-muted-foreground text-sm mb-2" numberOfLines={3}>
                      {article.content.replace(/<[^>]*>/g, '')}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground text-xs">
                        {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                      </Text>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}

            {/* Articles Pagination */}
            {(articlesData as any)?.total && Math.ceil((articlesData as any).total / 12) > 1 && (
              <Pagination
                currentPage={articlesPage}
                totalPages={Math.ceil((articlesData as any).total / 12)}
                onPageChange={setArticlesPage}
                showPages={5}
                className="pt-4"
              />
            )}
          </View>
        );

      case 'tours':
        if (virtualToursLoading) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-lg font-semibold text-foreground mb-2">Đang tải tour ảo...</Text>
              </CardContent>
            </Card>
          );
        }

        if (virtualToursError) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Frown size={32} color="#a67c52" className="mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-2">Lỗi tải tour ảo</Text>
                <Text className="text-muted-foreground text-center">
                  {virtualToursError?.message || 'Không thể tải danh sách tour ảo'}
                </Text>
              </CardContent>
            </Card>
          );
        }

        const virtualTours = (virtualToursData as any)?.list || [];

        if (virtualTours.length === 0) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Globe2 size={32} color="#0ea5e9" className="mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-2">Chưa có tour ảo</Text>
                <Text className="text-muted-foreground text-center">
                  Bảo tàng này chưa có tour ảo nào được cung cấp
                </Text>
              </CardContent>
            </Card>
          );
        }

        return (
          <View className="px-2">
            {virtualTours.map((tour: any) => (
              <TouchableOpacity key={tour.id} onPress={() => router.push(`/tour/${tour.id}`)} className="mb-4">
                <Card className="overflow-hidden bg-card border border-card rounded-xl shadow-md">
                  <View className="flex-row h-28">
                    <View className="w-24 h-28 bg-gray-100">
                      {/* Hiển thị ảnh theo thứ tự ưu tiên: ảnh đại diện tour trước, nếu không có thì hiển thị thumbnail cảnh đầu tiên */}
                      {tour.metadata?.images?.[0]?.file &&
                        typeof tour.metadata.images[0].file === 'string' &&
                        tour.metadata.images[0].file.startsWith('http') ? (
                        <Image
                          source={{ uri: tour.metadata.images[0].file }}
                          className="w-24 h-28"
                          resizeMode="cover"
                        />
                      ) : tour.metadata?.scenes?.[0]?.thumbnail &&
                        typeof tour.metadata.scenes[0].thumbnail === 'string' &&
                        tour.metadata.scenes[0].thumbnail.startsWith('http') ? (
                        <Image
                          source={{ uri: tour.metadata.scenes[0].thumbnail }}
                          className="w-24 h-28"
                          resizeMode="cover"
                        />
                      ) : (
                        <Image
                          source={{
                            uri: 'https://thumb.ac-illust.com/11/11f66d349dd80280994aa0eea7902af5_t.jpeg',
                          }}
                          className="w-24 h-28"
                          resizeMode="cover"
                        />
                      )}
                    </View>
                    <View className="flex-1 p-3 justify-between">
                      <View className="flex-1">
                        <View className="flex-row items-start justify-between mb-2">
                          <Text className="font-semibold text-base text-foreground flex-1 mr-2" numberOfLines={2}>
                            {tour.name}
                          </Text>
                          <View className="bg-primary border border-primary rounded px-2 py-1 shrink-0 flex-row items-center">
                            <Globe2 size={14} color="#fff" style={{ marginRight: 4 }} />
                            <Text className="text-xs text-primary-foreground">Tour 360°</Text>
                          </View>
                        </View>
                        <Text className="text-muted-foreground text-sm leading-5" numberOfLines={3}>
                          {tour.description || 'Khám phá không gian 360° với công nghệ thực tế ảo hiện đại'}
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-muted-foreground text-xs">
                          {tour.isActive ? '🟢 Đang hoạt động' : '🔴 Tạm dừng'}
                        </Text>
                        {typeof tour.price === 'number' && (
                          <Text className="text-primary text-xs font-medium">
                            {tour.price === 0 ? 'Miễn phí' : tour.price.toLocaleString('vi-VN') + '₫'}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}

            {/* Virtual Tours Pagination */}
            {(virtualToursData as any)?.total && Math.ceil((virtualToursData as any).total / 12) > 1 && (
              <Pagination
                currentPage={toursPage}
                totalPages={Math.ceil((virtualToursData as any).total / 12)}
                onPageChange={setToursPage}
                showPages={5}
                className="pt-4"
              />
            )}
          </View>
        );

      case 'feedbacks':
        // Loading state
        if (feedbacksLoading) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-lg font-semibold text-foreground mb-2">Đang tải đánh giá...</Text>
              </CardContent>
            </Card>
          );
        }

        // Error state
        if (feedbacksError) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Frown size={32} color="#a67c52" className="mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-2">Lỗi tải đánh giá</Text>
                <Text className="text-muted-foreground text-center">
                  {feedbacksError?.message || 'Không thể tải danh sách đánh giá'}
                </Text>
              </CardContent>
            </Card>
          );
        }

        // Mapping đúng chuẩn visitor-portal
        const feedbacks: any[] = (feedbacksData as any)?.list || (feedbacksData as any)?.data?.list || [];
        const feedbackCount = feedbacks.length;
        const averageRating = feedbackCount > 0 ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbackCount : 0;

        // Star rating component
        const StarRating = ({ rating }: { rating: number }) => (
          <View className="flex-row items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                color={i < rating ? '#fbbf24' : '#d1d5db'}
                fill={i < rating ? '#fbbf24' : 'none'}
                style={{ marginRight: 2 }}
              />
            ))}
            <Text className="ml-1 text-sm text-muted-foreground">({rating}/5)</Text>
          </View>
        );

        // Empty state
        if (feedbackCount === 0) {
          return (
            <Card className="bg-card border border-border rounded-lg">
              <CardContent className="p-8 items-center">
                <Star size={32} color="#fbbf24" className="mb-3" />
                <Text className="text-lg font-semibold text-foreground mb-2">Chưa có đánh giá</Text>
                <Text className="text-muted-foreground text-center">Hãy là người đầu tiên đánh giá bảo tàng này!</Text>
              </CardContent>
            </Card>
          );
        }

        // List state
        return (
          <View className="px-2">
            {/* Summary Card */}
            <Card className="bg-card border border-border rounded-lg mb-4">
              <CardContent className="p-4 flex-row items-center justify-between">
                <View className="items-center">
                  <Text className="text-2xl font-bold text-primary mb-1">{averageRating.toFixed(1)}</Text>
                  <StarRating rating={Math.round(averageRating)} />
                </View>
                <View className="items-center">
                  <Text className="text-sm text-muted-foreground">{feedbackCount} đánh giá</Text>
                </View>
              </CardContent>
            </Card>

            {/* Feedback List */}
            {feedbacks.map((review: any) => (
              <Card key={review.id} className="bg-card border border-border rounded-lg mb-4">
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View className="w-10 h-10 bg-accent rounded-full items-center justify-center mr-3">
                        <Text className="text-white text-sm font-semibold">
                          {review.createdByUser?.fullName?.charAt(0).toUpperCase() || '?'}
                        </Text>
                      </View>
                      <View>
                        <Text className="font-semibold text-foreground">
                          {review.createdByUser?.fullName || 'Ẩn danh'}
                        </Text>
                        <Text className="text-muted-foreground text-xs">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                    <StarRating rating={review.rating} />
                  </View>
                  <Text className="text-foreground text-base leading-6">{review.comment}</Text>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            {feedbacksData?.data?.total && Math.ceil(feedbacksData.data.total / 20) > 1 && (
              <Pagination
                currentPage={1} // Nếu muốn phân trang thực tế, cần lưu state page cho feedbacks
                totalPages={Math.ceil(feedbacksData.data.total / 20)}
                onPageChange={() => { }}
                showPages={5}
                className="pt-4"
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="dark" />
        <MuseumHeader />
        {/* Loading Content */}
        <ScrollView className="flex-1 px-4 py-4">
          <View className="w-full h-48 bg-muted rounded-lg mb-4" />
          <View className="w-3/4 h-6 bg-muted rounded mb-2" />
          <View className="w-1/2 h-4 bg-muted rounded mb-4" />
          <View className="w-full h-20 bg-muted rounded" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || !museum) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="dark" />
        <MuseumHeader />
        {/* Error Content */}
        <View className="flex-1 items-center justify-center px-4">
          <Frown size={40} color="#a67c52" className="mb-4" />
          <Text className="text-xl font-semibold text-foreground mb-2">Không tìm thấy bảo tàng</Text>
          <Text className="text-muted-foreground text-center mb-6">
            Bảo tàng này có thể đã bị xóa hoặc không tồn tại
          </Text>
          <Button onPress={() => router.back()} className="bg-primary px-6 py-3 rounded-lg">
            <Text className="text-primary-foreground font-medium">Quay lại</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <MuseumHeader />
      <ScrollView
        className="flex-1 bg-background"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Museum Image */}
        <Image source={getMuseumImage()} className="w-full h-64" resizeMode="cover" />
        {/* Museum Info */}
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-foreground mb-2">{museum.name}</Text>
          {/* Rating */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center">
              <Star size={16} color="#ff6600" fill="#ff6600" />
              <Text className="text-primary text-base ml-1 font-medium">{museum.rating.toFixed(1)}</Text>
              <Text className="text-muted-foreground text-base ml-1">Đánh giá</Text>
            </View>
          </View>
          {/* Info Section - Improved Layout & Alignment */}
          <View className="flex-row gap-3 mb-6">
            {/* Operating Hours */}
            <View className="flex-1 bg-card border border-border rounded-lg px-1 py-2 items-center justify-center min-h-[50px]">
              <Clock size={18} color="#ff6600" />
              <Text className="text-xs font-semibold text-foreground mb-0.5">08:00 - 17:00</Text>
              <Text className="text-xs text-muted-foreground">Giờ mở cửa</Text>
            </View>
            {/* Address */}
            <View className="flex-1 bg-card border border-border rounded-lg px-1 py-2 items-center justify-center min-h-[50px]">
              <MapPin size={18} color="#ff6600" />
              <Text className="text-xs font-semibold text-foreground mb-0.5 text-center" numberOfLines={6}>
                {museum.location}
              </Text>
              <Text className="text-xs text-muted-foreground">Địa chỉ </Text>
            </View>
          </View>
          {/* Booking Button - Centered & Prominent */}
          {museum.contactPhone && (
            <View className="mb-6 items-center">
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${museum.contactPhone}`)}
                className="w-full max-w-md bg-accent py-4 px-4 rounded-lg shadow-md active:bg-accent/80"
              >
                <View className="flex-row items-center justify-center">
                  <Phone size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text className="text-accent-foreground font-semibold text-base">Đặt vé tham quan</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {/* Contact Information - Consistent Height & Spacing */}
          {(museum.contactPhone || museum.contactEmail) && (
            <View className="flex-row gap-3 mb-8">
              {/* Phone Card */}
              {museum.contactPhone && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${museum.contactPhone}`)}
                  className="flex-1 bg-card border border-border rounded-lg px-1 py-2 items-center justify-center min-h-[50px]"
                >
                  <Phone size={16} color="#ff6600" />
                  <Text className="text-foreground font-medium text-xs text-center" numberOfLines={3}>
                    {museum.contactPhone}
                  </Text>
                </TouchableOpacity>
              )}
              {/* Email Card */}
              {museum.contactEmail && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${museum.contactEmail}`)}
                  className="flex-1 bg-card border border-border rounded-lg px-1 py-2 items-center justify-center min-h-[50px]"
                >
                  <Mail size={16} color="#ff6600" />
                  <Text className="text-foreground font-medium text-xs text-center" numberOfLines={3}>
                    {museum.contactEmail}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
            <View className="flex-row">
              {MUSEUM_TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => {
                    setActiveTab(tab.key);
                    // Reset pagination when changing tabs
                    setArtifactsPage(1);
                    setEventsPage(1);
                    setToursPage(1);
                    setArticlesPage(1);
                  }}
                  className={`px-4 py-2 rounded-full border mr-6 ${activeTab === tab.key ? 'bg-primary border-primary' : 'bg-card border-border'
                    }`}
                >
                  <View className="flex-row items-center">
                    <tab.icon size={16} color={activeTab === tab.key ? '#fff' : '#a67c52'} style={{ marginRight: 4 }} />
                    <Text
                      className={`text-sm font-medium ${activeTab === tab.key ? 'text-white' : 'text-muted-foreground'}`}
                    >
                      {tab.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {/* Tab Content */}
          {renderTabContent()}
        </View>
        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
