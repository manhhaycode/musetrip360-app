import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Text } from '@/components/core/ui/text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Clock, Globe2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVirtualTourDetail } from '../../hooks/useVirtualTours';

export default function VirtualTourDetailPage() {
  // Hàm kiểm tra url ảnh hợp lệ
  const isValidImageUrl = (url?: unknown): url is string => typeof url === 'string' && url.startsWith('http');

  // Hằng số tiền tệ
  const CURRENCY_SYMBOL = '₫';

  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const { data: tour, isLoading, error, refetch } = useVirtualTourDetail(id!);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="dark" />
        <View className="flex-row items-center justify-between px-4 py-4 bg-background">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Chi tiết tour ảo</Text>
          <View className="w-10" />
        </View>
        <ScrollView className="flex-1 px-4 py-4">
          <View className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
          <View className="w-3/4 h-6 bg-gray-200 rounded mb-2" />
          <View className="w-1/2 h-4 bg-gray-200 rounded mb-4" />
          <View className="w-full h-20 bg-gray-200 rounded" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error || !tour) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="dark" />
        <View className="flex-row items-center justify-between px-4 py-4 bg-background">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Chi tiết tour ảo</Text>
          <View className="w-10" />
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-4xl mb-4">😞</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy tour ảo</Text>
          <Text className="text-gray-600 text-center mb-6">Tour này có thể đã bị xóa hoặc không tồn tại</Text>
          <Button onPress={() => router.back()} className="bg-blue-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-medium">Quay lại</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <View className="flex-row items-center justify-between px-4 py-4 bg-background">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Chi tiết tour ảo</Text>
        <View className="w-10" />
      </View>
      <ScrollView
        className="flex-1 bg-background"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hiển thị ảnh theo thứ tự ưu tiên: ảnh đại diện tour trước, nếu không có thì hiển thị thumbnail cảnh đầu tiên */}
        {isValidImageUrl(tour.metadata?.images?.[0]?.file) ? (
          <Image
            source={{ uri: tour.metadata.images?.[0]?.file as string }}
            className="w-full h-64"
            resizeMode="cover"
          />
        ) : isValidImageUrl(tour.metadata?.scenes?.[0]?.thumbnail) ? (
          <Image
            source={{ uri: tour.metadata.scenes?.[0]?.thumbnail as string }}
            className="w-full h-64"
            resizeMode="cover"
          />
        ) : null}
        <View className="px-4 py-4 space-y-6">
          {/* Thông tin tour */}
          <View className="pb-2">
            <Text className="text-2xl font-bold text-foreground mb-1">{tour.name}</Text>
            <View className="flex-row items-center mb-1">
              <Globe2 size={18} color="#0ea5e9" />
              <Text className="ml-2 text-md text-[#0ea5e9]">Tour 360°</Text>
            </View>
            {/* Giá tour: chỉ hiển thị nếu có giá trị */}
            {typeof tour.price === 'number' && (
              <View className="flex-row items-center mb-1">
                <Text className="text-muted-foreground text-md ml-2">
                  Giá: {tour.price === 0 ? 'Miễn phí' : tour.price.toLocaleString('vi-VN') + CURRENCY_SYMBOL}
                </Text>
              </View>
            )}
            <View className="flex-row items-center mb-1">
              <Clock size={16} color="#9ca3af" />
              <Text className="text-muted-foreground text-md ml-2">
                {tour.metadata?.scenes?.length ? `${tour.metadata.scenes.length} cảnh` : 'Chưa có cảnh'}
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Text className="text-muted-foreground text-md ml-2">
                Tạo ngày: {tour.createdAt ? new Date(tour.createdAt).toLocaleDateString('vi-VN') : '---'}
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Text className="text-muted-foreground text-md ml-2">
                {tour.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
              </Text>
            </View>
            {/* Ngày cập nhật */}
            {tour.updatedAt && (
              <View className="flex-row items-center mt-1">
                <Text className="text-muted-foreground text-md ml-2">
                  Cập nhật: {new Date(tour.updatedAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>
            )}
          </View>

          {/* Mô tả */}
          <Card className="bg-card border border-border rounded-lg shadow-sm mb-5">
            <CardContent className="px-3 py-2">
              <Text className="text-lg font-semibold text-primary mb-2">Mô tả tour ảo</Text>
              <Text className="text-foreground text-base leading-6">
                {tour.description || 'Thông tin mô tả đang được cập nhật...'}
              </Text>
            </CardContent>
          </Card>

          {/* Danh sách cảnh */}
          {tour.metadata?.scenes && tour.metadata.scenes.length > 0 && (
            <Card className="bg-card border border-border rounded-lg shadow-sm mb-5">
              <CardContent className="p-4">
                <Text className="text-lg font-semibold text-primary mb-2">Danh sách cảnh</Text>
                <View className="space-y-2">
                  {tour.metadata.scenes.map((scene: any) => (
                    <View key={scene.sceneId} className="flex-row items-center mb-2">
                      {scene.thumbnail && typeof scene.thumbnail === 'string' ? (
                        <Image source={{ uri: scene.thumbnail }} className="w-12 h-12 rounded mr-3" />
                      ) : (
                        <View className="w-12 h-12 bg-gray-200 rounded mr-3 items-center justify-center">
                          <Globe2 size={20} color="#a67c52" />
                        </View>
                      )}
                      <View>
                        <Text className="font-medium text-foreground">{scene.sceneName}</Text>
                        <Text className="text-xs text-muted-foreground">{scene.sceneDescription || ''}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}
        </View>
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
