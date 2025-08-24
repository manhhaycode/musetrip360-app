import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Text } from '@/components/core/ui/text';
import { useArticleDetail } from '@/hooks/useArticles';

export default function ArticleDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

  const { data: article, isLoading, error, refetch } = useArticleDetail(id!);

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
        contentWidth={width - 32}
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Chi tiết bài viết</Text>
          <View className="w-10" />
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

  if (error || !article) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Chi tiết bài viết</Text>
          <View className="w-10" />
        </View>

        {/* Error Content */}
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-4xl mb-4">😞</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</Text>
          <Text className="text-gray-600 text-center mb-6">Bài viết này có thể đã bị xóa hoặc không tồn tại</Text>
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
        <Text className="text-lg font-semibold text-gray-900">Chi tiết bài viết</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Article Image */}
        {article.metadata?.thumbnail && (
          <Image
            source={{
              uri: article.metadata.thumbnail || 'https://via.placeholder.com/400x200/e5e7eb/9ca3af?text=Article',
            }}
            className="w-full h-64"
            resizeMode="cover"
          />
        )}

        {/* Article Info */}
        <View className="px-4 py-4">
          {/* Article Title */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 mb-4">{article.title}</Text>
          </View>

          {/* Article Content */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm mb-8">
            <CardContent className="p-4">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-lg">📰</Text>
                </View>
                <Text className="text-lg font-semibold text-blue-900">Nội dung bài viết</Text>
              </View>
              {article.content ? (
                renderHtmlContent(article.content)
              ) : (
                <Text className="text-blue-700 text-base italic">Nội dung bài viết đang được cập nhật...</Text>
              )}
            </CardContent>
          </Card>

          {/* Article Information Card */}
          <Card className="bg-white border border-gray-100 rounded-lg shadow-sm">
            <CardContent className="p-4">
              <Text className="text-lg font-bold text-gray-800 mb-3">Thông tin bài viết</Text>

              {/* Content Type */}
              <View className="flex-row items-center mb-3">
                <Text className="text-gray-600 text-sm">🔸 Loại bài viết:</Text>
                <Text className="text-gray-800 text-sm ml-2 font-medium">Hiện vật</Text>
              </View>

              {/* Publication Date */}
              <View className="flex-row items-center mb-3">
                <Text className="text-gray-600 text-sm">📅 Ngày xuất bản:</Text>
                <Text className="text-gray-800 text-sm ml-2 font-medium">
                  {new Date(article.publishedAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
              </View>

              {/* Museum */}
              {article.museum && (
                <View className="flex-row items-start mb-3">
                  <Text className="text-gray-600 text-sm">�️ Bảo tàng:</Text>
                  <TouchableOpacity
                    onPress={() => router.push(`/museum/${article.museum?.id}`)}
                    className="flex-1 ml-2"
                  >
                    <Text className="text-blue-600 text-sm font-medium underline">{article.museum.name}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Author */}
              <View className="flex-row items-center">
                <Text className="text-gray-600 text-sm">✍️ Tác giả:</Text>
                <Text className="text-gray-800 text-sm ml-2 font-medium">
                  {article.createdByUser?.fullName || 'Không xác định'}
                </Text>
              </View>

              {/* Explore Museum Button */}
              {article.museum && (
                <TouchableOpacity
                  onPress={() => router.push(`/museum/${article.museum?.id}`)}
                  className="mt-4 flex-row items-center justify-center bg-gray-100 p-3 rounded-lg border border-gray-200"
                >
                  <Text className="text-gray-700 text-sm mr-2">📖</Text>
                  <Text className="text-gray-700 text-sm font-medium">Khám phá thêm về Bảo tàng Lịch sử Quốc gia</Text>
                </TouchableOpacity>
              )}
            </CardContent>
          </Card>
        </View>

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
