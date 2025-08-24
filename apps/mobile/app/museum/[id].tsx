import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Share2, Star } from 'lucide-react-native';
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
import { useArtifacts } from '@/hooks/useArtifacts';
import { useEvents } from '@/hooks/useEvents';
import { useMuseum } from '@/hooks/useMuseums';
import { useReviews } from '@/hooks/useReviews';
import { useVirtualTours } from '@/hooks/useVirtualTours';

const MUSEUM_TABS = [
  { key: 'overview', label: 'Giới thiệu', icon: '📖' },
  { key: 'artifacts', label: 'Hiện vật', icon: '🏺' },
  { key: 'events', label: 'Sự kiện', icon: '📅' },
  { key: 'articles', label: 'Bài viết', icon: '📰' },
  { key: 'tours', label: 'Tour ảo', icon: '🌐' },
  { key: 'reviews', label: 'Đánh giá', icon: '⭐' },
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
  } = useArtifacts({ museumId: id!, Page: artifactsPage, PageSize: 12 });

  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEvents({ museumId: id!, Page: eventsPage, PageSize: 12 });

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

  // Reviews for this museum
  const { data: reviewsData } = useReviews(id!, 'Museum');

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
      img: { marginVertical: 8 },
    };

    const systemFonts = ['System'];

    return (
      <RenderHtml
        contentWidth={width - 32} // Account for padding
        source={{ html: htmlContent }}
        tagsStyles={tagsStyles}
        systemFonts={systemFonts}
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
    return 'https://via.placeholder.com/400x200/e5e7eb/9ca3af?text=Museum';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        if (!museum) return null;

        return (
          <View className="px-2">
            {/* Introduction - Always show, prioritize contentHomePage over description */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg shadow-sm mb-8">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center mr-3">
                    <Text className="text-white text-lg">🏛️</Text>
                  </View>
                  <Text className="text-lg font-semibold text-orange-900">Giới thiệu</Text>
                </View>
                {museum.metadata?.contentHomePage ? (
                  renderHtmlContent(museum.metadata.contentHomePage)
                ) : (
                  <Text className="text-orange-800 text-base leading-6">
                    {museum.description || 'Thông tin giới thiệu đang được cập nhật...'}
                  </Text>
                )}
              </CardContent>
            </Card>

            {/* Detailed Information */}
            {museum.metadata?.detail && (
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm mb-8">
                <CardContent className="p-4">
                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                      <Text className="text-white text-lg">📋</Text>
                    </View>
                    <Text className="text-lg font-semibold text-blue-900">Thông tin chi tiết</Text>
                  </View>
                  {renderHtmlContent(museum.metadata.detail)}
                </CardContent>
              </Card>
            )}

            {/* Museum Images */}

            {/* Categories */}
            {museum.categories && museum.categories.length > 0 && (
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg shadow-sm mb-6">
                <CardContent className="p-4">
                  <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 bg-purple-500 rounded-full items-center justify-center mr-3">
                      <Text className="text-white text-lg">🏷️</Text>
                    </View>
                    <Text className="text-lg font-semibold text-purple-900">Danh mục bảo tàng</Text>
                  </View>
                  <View className="flex-row flex-wrap gap-2">
                    {museum.categories.map((category) => (
                      <View
                        key={category.id}
                        className="px-3 py-2 bg-purple-100/70 rounded-lg border border-purple-300"
                      >
                        <Text className="text-sm text-purple-800 font-medium">{category.name}</Text>
                        {category.description && (
                          <Text className="text-xs text-purple-700 mt-1">{category.description}</Text>
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
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg shadow-sm mb-8">
                    <CardContent className="p-4">
                      <View className="flex-row items-center mb-3">
                        <View className="w-8 h-8 bg-amber-500 rounded-full items-center justify-center mr-3">
                          <Text className="text-white text-lg">📸</Text>
                        </View>
                        <Text className="text-lg font-semibold text-amber-900">Hình ảnh bảo tàng</Text>
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
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-lg font-semibold text-gray-900 mb-2">Đang tải hiện vật...</Text>
              </CardContent>
            </Card>
          );
        }

        if (artifactsError) {
          return (
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">⚠️</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải hiện vật</Text>
                <Text className="text-gray-600 text-center">
                  {artifactsError?.message || 'Không thể tải danh sách hiện vật'}
                </Text>
              </CardContent>
            </Card>
          );
        }

        const artifacts = (artifactsData as any)?.list || [];

        if (artifacts.length === 0) {
          return (
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">🏺</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">Chưa có hiện vật</Text>
                <Text className="text-gray-600 text-center">Bảo tàng này chưa có hiện vật nào được trưng bày</Text>
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
                <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                        <Text className="font-semibold text-base text-gray-900 mb-1" numberOfLines={2}>
                          {artifact.name}
                        </Text>
                        <Text className="text-gray-600 text-sm flex-1" numberOfLines={2}>
                          {artifact.description}
                        </Text>
                      </View>
                      <Text className="text-gray-500 text-xs mt-1">{artifact.historicalPeriod}</Text>
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
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-lg font-semibold text-gray-900 mb-2">Đang tải sự kiện...</Text>
              </CardContent>
            </Card>
          );
        }

        if (eventsError) {
          return (
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">⚠️</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải sự kiện</Text>
                <Text className="text-gray-600 text-center">
                  {eventsError?.message || 'Không thể tải danh sách sự kiện'}
                </Text>
              </CardContent>
            </Card>
          );
        }

        const events = (eventsData as any)?.list || [];

        if (events.length === 0) {
          return (
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">📅</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">Chưa có sự kiện</Text>
                <Text className="text-gray-600 text-center">Bảo tàng này chưa có sự kiện nào được tổ chức</Text>
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
                <Card className="bg-white border border-gray-200 rounded-lg">
                  <CardContent className="p-4">
                    <Text className="font-semibold text-base text-gray-900 mb-2" numberOfLines={2}>
                      {event.title}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-3 leading-5" numberOfLines={3}>
                      {event.description}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-500 text-xs">
                        {new Date(event.startTime).toLocaleDateString('vi-VN')}
                      </Text>
                      <View className="bg-blue-100 border border-blue-200 rounded px-2 py-1">
                        <Text className="text-xs text-blue-800">{event.eventType}</Text>
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
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-lg font-semibold text-gray-900 mb-2">Đang tải bài viết...</Text>
              </CardContent>
            </Card>
          );
        }

        if (articlesError) {
          return (
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">⚠️</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải bài viết</Text>
                <Text className="text-gray-600 text-center">
                  {articlesError?.message || 'Không thể tải danh sách bài viết'}
                </Text>
              </CardContent>
            </Card>
          );
        }

        const articles = (articlesData as any)?.list || [];

        if (articles.length === 0) {
          return (
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">📰</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">Chưa có bài viết</Text>
                <Text className="text-gray-600 text-center">Bảo tàng này chưa có bài viết nào được đăng tải</Text>
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
                <Card className="bg-white border border-gray-200 rounded-lg">
                  <CardContent className="p-4">
                    <Text className="font-semibold text-base text-gray-900 mb-1" numberOfLines={2}>
                      {article.title}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-2" numberOfLines={3}>
                      {article.content.replace(/<[^>]*>/g, '')}
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-500 text-xs">
                        {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                      </Text>
                      <View className="bg-orange-100 border border-orange-200 rounded px-2 py-1">
                        <Text className="text-xs text-orange-800">{article.status}</Text>
                      </View>
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
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-lg font-semibold text-gray-900 mb-2">Đang tải tour ảo...</Text>
              </CardContent>
            </Card>
          );
        }

        if (virtualToursError) {
          return (
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">⚠️</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải tour ảo</Text>
                <Text className="text-gray-600 text-center">
                  {virtualToursError?.message || 'Không thể tải danh sách tour ảo'}
                </Text>
              </CardContent>
            </Card>
          );
        }

        const virtualTours = (virtualToursData as any)?.list || [];

        if (virtualTours.length === 0) {
          return (
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-8 items-center">
                <Text className="text-4xl mb-3">🌐</Text>
                <Text className="text-lg font-semibold text-gray-900 mb-2">Chưa có tour ảo</Text>
                <Text className="text-gray-600 text-center">Bảo tàng này chưa có tour ảo nào được cung cấp</Text>
              </CardContent>
            </Card>
          );
        }

        return (
          <View className="px-2">
            {virtualTours.map((tour: any) => (
              <Card key={tour.id} className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden">
                <View className="flex-row">
                  <Image
                    source={{
                      uri: tour.thumbnail || 'https://via.placeholder.com/96x96/e5e7eb/9ca3af?text=Tour',
                    }}
                    className="w-24 h-24"
                    resizeMode="cover"
                  />
                  <View className="flex-1 p-4 justify-between">
                    <View className="flex-1">
                      <Text className="font-semibold text-base text-gray-900 mb-2" numberOfLines={2}>
                        {tour.title}
                      </Text>
                      <Text className="text-gray-600 text-sm leading-5" numberOfLines={3}>
                        {tour.description}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-gray-500 text-xs">
                        {tour.duration ? `${tour.duration} phút` : 'Thời lượng linh hoạt'}
                      </Text>
                      <View className="bg-purple-100 border border-purple-200 rounded px-2 py-1">
                        <Text className="text-xs text-purple-800">Tour 360°</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
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

      case 'reviews':
        const reviews = reviewsData?.data?.list || [];

        return (
          <View className="px-2">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id} className="bg-white border border-gray-200 rounded-lg mb-4">
                  <CardContent className="p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
                          <Text className="text-white text-sm font-semibold">
                            {review.createdByUser.fullName.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View>
                          <Text className="font-semibold text-gray-900">{review.createdByUser.fullName}</Text>
                          <Text className="text-gray-500 text-xs">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            color={i < review.rating ? '#fbbf24' : '#d1d5db'}
                            fill={i < review.rating ? '#fbbf24' : 'none'}
                          />
                        ))}
                      </View>
                    </View>
                    <Text className="text-gray-700 text-base leading-6">{review.comment}</Text>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-8 items-center">
                  <Text className="text-4xl mb-3">⭐</Text>
                  <Text className="text-lg font-semibold text-gray-900 mb-2">Chưa có đánh giá</Text>
                  <Text className="text-gray-600 text-center">Hãy là người đầu tiên đánh giá bảo tàng này!</Text>
                </CardContent>
              </Card>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Chi tiết bảo tàng</Text>
          <TouchableOpacity className="p-2">
            <Share2 size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Loading Content */}
        <ScrollView className="flex-1 px-4 py-4">
          <View className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
          <View className="w-3/4 h-6 bg-gray-200 rounded mb-2" />
          <View className="w-1/2 h-4 bg-gray-200 rounded mb-4" />
          <View className="w-full h-20 bg-gray-200 rounded" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || !museum) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Chi tiết bảo tàng</Text>
          <TouchableOpacity className="p-2">
            <Share2 size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Error Content */}
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-4xl mb-4">😞</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bảo tàng</Text>
          <Text className="text-gray-600 text-center mb-6">Bảo tàng này có thể đã bị xóa hoặc không tồn tại</Text>
          <Button onPress={() => router.back()} className="bg-blue-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-medium">Quay lại</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Chi tiết bảo tàng</Text>
        <TouchableOpacity className="p-2">
          <Share2 size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Museum Image */}
        <Image source={getMuseumImage()} className="w-full h-64" resizeMode="cover" />

        {/* Museum Info */}
        <View className="px-4 py-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">{museum.name}</Text>

          {/* Rating */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center">
              <Star size={16} color="#f97316" fill="#f97316" />
              <Text className="text-orange-600 text-base ml-1 font-medium">{museum.rating.toFixed(1)}</Text>
              <Text className="text-gray-600 text-base ml-1">Đánh giá</Text>
            </View>
          </View>

          {/* Info Cards Row - All Orange Theme */}
          <View className="flex-row space-x-3 mb-4">
            {/* Operating Hours */}
            <View className="flex-1 bg-orange-100 p-4 rounded-lg">
              <View className="flex-row items-center mb-2">
                <Text className="text-orange-600 text-lg mr-2">🕒</Text>
                <Text className="text-sm font-medium text-orange-800">08:00 - 17:00</Text>
              </View>
              <Text className="text-xs text-orange-600">Giờ mở cửa</Text>
            </View>

            {/* Address */}
            <View className="flex-1 bg-orange-100 p-4 rounded-lg">
              <View className="flex-row items-start mb-2">
                <Text className="text-orange-600 text-lg mr-2">📍</Text>
                <Text className="text-sm font-medium text-orange-800 leading-4 flex-1" numberOfLines={2}>
                  {museum.location}
                </Text>
              </View>
              <Text className="text-xs text-orange-600">Địa chỉ</Text>
            </View>
          </View>

          {/* Action Button - Full Width */}
          <View className="mb-4">
            {museum.contactPhone && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${museum.contactPhone}`)}
                className="w-full bg-orange-500 py-4 px-4 rounded-lg"
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-white text-lg mr-2">📞</Text>
                  <Text className="text-white font-medium text-sm">Đặt vé tham quan</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Contact Information - Orange Theme */}
          <View className="flex-row space-x-3 mb-6">
            {/* Phone Card */}
            {museum.contactPhone && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${museum.contactPhone}`)}
                className="flex-1 bg-orange-100 p-4 rounded-lg"
              >
                <Text className="text-orange-600 text-lg mb-1">📞</Text>
                <Text className="text-orange-800 text-sm font-medium">{museum.contactPhone}</Text>
              </TouchableOpacity>
            )}

            {/* Email Card */}
            {museum.contactEmail && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`mailto:${museum.contactEmail}`)}
                className="flex-1 bg-orange-100 p-4 rounded-lg"
              >
                <Text className="text-orange-600 text-lg mb-1">✉️</Text>
                <Text className="text-orange-800 text-sm font-medium" numberOfLines={1}>
                  {museum.contactEmail}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
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
                  className={`px-4 py-2 rounded-full border mr-6 ${
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

          {/* Tab Content */}
          {renderTabContent()}
        </View>

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
