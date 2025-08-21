import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, MapPin, Share2, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/core/ui/badge';
import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Text } from '@/components/core/ui/text';
import { useArticles } from '@/hooks/useArticles';
import { useArtifacts } from '@/hooks/useArtifacts';
import { useEvents } from '@/hooks/useEvents';
import { useMuseum } from '@/hooks/useMuseums';
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

  const { data: museum, isLoading, error, refetch } = useMuseum(id!);

  // Fetch artifacts and events for this museum
  const {
    data: artifactsData,
    isLoading: artifactsLoading,
    error: artifactsError,
  } = useArtifacts({ museumId: id!, Page: 1, PageSize: 10 });

  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEvents({ museumId: id!, Page: 1, PageSize: 10 });

  const {
    data: virtualToursData,
    isLoading: virtualToursLoading,
    error: virtualToursError,
  } = useVirtualTours({ museumId: id!, Page: 1, PageSize: 10 });

  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: articlesError,
  } = useArticles({ museumId: id!, Page: 1, PageSize: 10 });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  // Function to clean text content by removing URLs
  const cleanTextContent = (text: string) => {
    if (!text) return '';

    console.log('Original text:', text.substring(0, 100) + '...');

    // Remove URLs (http/https links) and extra whitespace
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    const cleanedText = text
      .replace(urlRegex, '') // Remove URLs
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing whitespace

    console.log('Cleaned text:', cleanedText.substring(0, 100) + '...');
    return cleanedText;
  };

  // Function to get the best available image
  const getMuseumImage = () => {
    // Debug logging
    console.log('Museum metadata:', museum?.metadata);
    console.log('Cover image URL:', museum?.metadata?.coverImageUrl);
    console.log('Images array:', museum?.metadata?.images);

    // Try cover image first
    if (museum?.metadata?.coverImageUrl) {
      console.log('Using cover image:', museum.metadata.coverImageUrl);
      return museum.metadata.coverImageUrl;
    }

    // Try first image from images array
    if (museum?.metadata?.images && museum.metadata.images.length > 0) {
      console.log('Using first image from array:', museum.metadata.images[0]);
      return museum.metadata.images[0];
    }

    // Fallback image
    console.log('Using fallback image');
    return 'https://images.unsplash.com/photo-1554757387-ea8f60cde1f0?w=400';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        if (!museum) return null;

        return (
          <View className="space-y-4">
            {/* Introduction */}
            {museum.metadata?.contentHomePage && (
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-4">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">Giới thiệu</Text>
                  <Text className="text-gray-700 text-base leading-6">
                    {cleanTextContent(museum.metadata.contentHomePage)}
                  </Text>
                </CardContent>
              </Card>
            )}

            {/* Detailed Information */}
            {museum.metadata?.detail && (
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-4">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">Thông tin chi tiết</Text>
                  <Text className="text-gray-700 text-base leading-6">{cleanTextContent(museum.metadata.detail)}</Text>
                </CardContent>
              </Card>
            )}

            {/* Basic Description - Only show if no detailed info */}
            {!museum.metadata?.detail && !museum.metadata?.contentHomePage && (
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-4">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">Mô tả</Text>
                  <Text className="text-gray-700 text-base leading-6">
                    {museum.description || 'Thông tin mô tả đang được cập nhật...'}
                  </Text>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="bg-white border border-gray-200 rounded-lg">
              <CardContent className="p-4">
                <Text className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</Text>

                <View className="space-y-3">
                  {/* Address */}
                  <View className="flex-row items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={20} color="#6b7280" className="mt-0.5" />
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-900">Địa chỉ</Text>
                      <Text className="text-sm text-gray-600 mt-1">{museum.location}</Text>
                    </View>
                  </View>

                  {/* Phone */}
                  {museum.contactPhone && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(`tel:${museum.contactPhone}`)}
                      className="flex-row items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <View className="w-5 h-5 items-center justify-center">
                        <Text className="text-gray-500">📞</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-900">Số điện thoại</Text>
                        <Text className="text-sm text-blue-600 mt-1">{museum.contactPhone}</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Email */}
                  {museum.contactEmail && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(`mailto:${museum.contactEmail}`)}
                      className="flex-row items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <View className="w-5 h-5 items-center justify-center">
                        <Text className="text-gray-500">✉️</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-900">Email</Text>
                        <Text className="text-sm text-blue-600 mt-1">{museum.contactEmail}</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Website */}
                  {museum.metadata?.socialLinks?.website && (
                    <TouchableOpacity
                      onPress={() => {
                        const website = museum.metadata?.socialLinks?.website;
                        if (website) {
                          Linking.openURL(website);
                        }
                      }}
                      className="flex-row items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <View className="w-5 h-5 items-center justify-center">
                        <Text className="text-gray-500">🌐</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-medium text-gray-900">Website</Text>
                        <Text className="text-sm text-blue-600 mt-1">{museum.metadata.socialLinks.website}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </CardContent>
            </Card>

            {/* Categories */}
            {museum.categories && museum.categories.length > 0 && (
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-4">
                  <Text className="text-lg font-semibold text-gray-900 mb-3">Danh mục bảo tàng</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {museum.categories.map((category) => (
                      <View key={category.id} className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                        <Text className="text-sm text-blue-800 font-medium">{category.name}</Text>
                        {category.description && (
                          <Text className="text-xs text-blue-600 mt-1">{category.description}</Text>
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
                  <Card className="bg-white border border-gray-200 rounded-lg">
                    <CardContent className="p-4">
                      <Text className="text-lg font-semibold text-gray-900 mb-3">Hình ảnh bảo tàng</Text>
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

        const artifacts = artifactsData?.data || [];

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
          <View className="space-y-4">
            {artifacts.map((artifact: any) => (
              <Card key={artifact.id} className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-0">
                  <View className="flex-row">
                    <Image
                      source={artifact.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'}
                      className="w-24 h-24"
                      resizeMode="cover"
                    />
                    <View className="flex-1 p-4">
                      <Text className="font-semibold text-base text-gray-900 mb-1" numberOfLines={2}>
                        {artifact.name}
                      </Text>
                      <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                        {artifact.description}
                      </Text>
                      <Text className="text-gray-500 text-xs">{artifact.historicalPeriod}</Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
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

        const events = eventsData?.data?.list || [];

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
          <View className="space-y-4">
            {events.map((event: any) => (
              <Card key={event.id} className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-4">
                  <Text className="font-semibold text-base text-gray-900 mb-1" numberOfLines={2}>
                    {event.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                    {event.description}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-500 text-xs">
                      {new Date(event.startTime).toLocaleDateString('vi-VN')}
                    </Text>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <Text className="text-xs">{event.eventType}</Text>
                    </Badge>
                  </View>
                </CardContent>
              </Card>
            ))}
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

        const articles = articlesData?.data?.list || [];

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
          <View className="space-y-4">
            {articles.map((article: any) => (
              <Card key={article.id} className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-4">
                  <Text className="font-semibold text-base text-gray-900 mb-1" numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mb-2" numberOfLines={3}>
                    {article.content.replace(/<[^>]*>/g, '')} {/* Remove HTML tags */}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-500 text-xs">
                      {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                    </Text>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      <Text className="text-xs">{article.status}</Text>
                    </Badge>
                  </View>
                </CardContent>
              </Card>
            ))}
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

        const virtualTours = virtualToursData?.data || [];

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
          <View className="space-y-4">
            {virtualTours.map((tour: any) => (
              <Card key={tour.id} className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-0">
                  <View className="flex-row">
                    <Image
                      source={tour.thumbnail || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400'}
                      className="w-24 h-24"
                      resizeMode="cover"
                    />
                    <View className="flex-1 p-4">
                      <Text className="font-semibold text-base text-gray-900 mb-1" numberOfLines={2}>
                        {tour.title}
                      </Text>
                      <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                        {tour.description}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-500 text-xs">
                          {tour.duration ? `${tour.duration} phút` : 'Thời lượng linh hoạt'}
                        </Text>
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          <Text className="text-xs">Tour 360°</Text>
                        </Badge>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        );

      case 'reviews':
        return (
          <Card className="bg-white border border-gray-200 rounded-lg">
            <CardContent className="p-8 items-center">
              <Text className="text-4xl mb-3">⭐</Text>
              <Text className="text-lg font-semibold text-gray-900 mb-2">Đánh giá đang cập nhật</Text>
              <Text className="text-gray-600 text-center">Các đánh giá của khách tham quan đang được cập nhật...</Text>
            </CardContent>
          </Card>
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

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-gray-900 text-base ml-1 font-medium">{museum.rating.toFixed(1)}</Text>
              <Text className="text-gray-500 text-base ml-1">(0 đánh giá)</Text>
            </View>

            <Badge
              className={`${
                museum.status === 'Active'
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-yellow-100 text-yellow-800 border-yellow-200'
              }`}
            >
              <Text className="text-sm">{museum.status === 'Active' ? 'Hoạt động' : 'Tạm ngưng'}</Text>
            </Badge>
          </View>

          <View className="flex-row items-center mb-4">
            <MapPin size={16} color="#6b7280" />
            <Text className="text-gray-600 text-base ml-2 flex-1">{museum.location}</Text>
          </View>

          {/* Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row space-x-2">
              {MUSEUM_TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
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

          {/* Tab Content */}
          {renderTabContent()}
        </View>

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
