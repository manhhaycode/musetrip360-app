import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Text } from '@/components/core/ui/text';
import { useArtifactDetail } from '@/hooks/useArtifacts';

export default function ArtifactDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);

  const { data: artifact, isLoading, refetch } = useArtifactDetail(id as string);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!artifact?.data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Không tìm thấy hiện vật</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2 -ml-2">
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900 flex-1">Chi tiết hiện vật</Text>
        </View>
      </View>

      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="p-4">
          {/* Artifact Image */}
          <Card className="bg-white border border-gray-200 rounded-lg mb-8 overflow-hidden">
            <Image source={{ uri: artifact.data.imageUrl }} className="w-full h-64" resizeMode="cover" />
          </Card>

          {/* Artifact Header */}
          <Card className="bg-white border border-gray-200 rounded-lg mb-8">
            <CardContent className="p-4">
              <Text className="text-2xl font-bold text-gray-900 mb-2">{artifact.data.name}</Text>

              {artifact.data.description && (
                <Text className="text-gray-700 leading-6">{artifact.data.description}</Text>
              )}
            </CardContent>
          </Card>

          {/* Artifact Details */}
          <Card className="bg-white border border-gray-200 rounded-lg mb-8">
            <CardContent className="p-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-purple-600 font-semibold">ℹ️</Text>
                </View>
                <Text className="text-lg font-semibold text-gray-900">Thông tin chi tiết</Text>
              </View>

              {/* Historical Period */}
              <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-600 flex-shrink-0 w-1/3">Thời kỳ lịch sử:</Text>
                <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                  {artifact.data.historicalPeriod || 'Chưa xác định'}
                </Text>
              </View>

              {artifact.data.metadata?.type && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Loại hiện vật:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.type}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.ethnicGroup && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Dân tộc:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.ethnicGroup}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.locationInMuseum && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Vị trí:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.locationInMuseum}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.material && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Chất liệu:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.material}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.discoveryDate && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Năm phát hiện:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.discoveryDate}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.originalLocation && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Nơi phát hiện:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.originalLocation}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.discoveryLocation && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Địa điểm khai quật:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.discoveryLocation}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.artist && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Nghệ sĩ:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.artist}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.dimensions && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Kích thước:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.dimensions}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.award && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Giải thưởng:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.award}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.photographer && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Nhiếp ảnh gia:</Text>
                  <Text className="text-gray-900 font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.photographer}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.nationalTreasure && (
                <View className="flex-row items-start justify-between py-2 border-b border-gray-100">
                  <Text className="text-gray-600 flex-shrink-0 w-1/3">Bảo vật quốc gia:</Text>
                  <View className="flex-1 flex-row items-center justify-end">
                    <Text className="text-red-600 font-medium mr-1">✓</Text>
                    <Text className="text-red-600 font-medium">Có</Text>
                  </View>
                </View>
              )}

              <View className="flex-row items-start justify-between py-2">
                <Text className="text-gray-600 flex-shrink-0 w-1/3">Trạng thái:</Text>
                <Text
                  className={`font-medium flex-1 text-right ${artifact.data.isActive ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {artifact.data.isActive ? 'Đang trưng bày' : 'Không trưng bày'}
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* Museum Information */}
          {artifact.data.museum && (
            <Card className="bg-white border border-gray-200 rounded-lg mb-8">
              <CardContent className="p-4">
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-blue-600 font-semibold">🏛️</Text>
                  </View>
                  <Text className="text-lg font-semibold text-gray-900">Thông tin bảo tàng</Text>
                </View>

                <TouchableOpacity
                  className="border border-blue-200 rounded-lg p-3 bg-blue-50"
                  onPress={() => {
                    router.push(`/museum/${artifact.data.museum.id}`);
                  }}
                >
                  <View className="flex-row items-center">
                    <Image
                      source={{
                        uri:
                          artifact.data.museum.imageUrl ||
                          'https://via.placeholder.com/48x48/e5e7eb/9ca3af?text=Museum',
                      }}
                      className="w-12 h-12 rounded-lg mr-3"
                    />
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold text-base">{artifact.data.museum.name}</Text>
                      {artifact.data.museum.address && (
                        <Text className="text-gray-600 text-sm mt-1">📍 {artifact.data.museum.address}</Text>
                      )}
                    </View>
                    <Text className="text-blue-600 text-lg">›</Text>
                  </View>
                </TouchableOpacity>
              </CardContent>
            </Card>
          )}
        </View>

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
