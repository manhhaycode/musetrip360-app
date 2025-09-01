import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Text } from '@/components/core/ui/text';
import { useArtifactDetail } from '@/hooks/useArtifacts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, ClipboardList } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ArtifactHeaderProps = {
  router: ReturnType<typeof useRouter>;
};

function ArtifactHeader({ router }: ArtifactHeaderProps) {
  return (
    <View className="bg-background px-4 py-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#222" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Chi tiết hiện vật</Text>
        <View className="w-10" />
      </View>
    </View>
  );
}

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
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="dark" />
        <ArtifactHeader router={router} />
        <View className="flex-1 justify-center items-center">
          <Text className="text-muted-foreground">Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!artifact?.data) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="dark" />
        <ArtifactHeader router={router} />
        <View className="flex-1 justify-center items-center">
          <Text className="text-muted-foreground">Không tìm thấy hiện vật</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <ArtifactHeader router={router} />
      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="p-4">
          {/* Artifact Image */}
          <Card className="bg-card border border-border rounded-lg mb-8 overflow-hidden">
            <Image source={{ uri: artifact.data.imageUrl }} className="w-full h-64" resizeMode="cover" />
          </Card>

          {/* Artifact Header */}
          <Card className={`bg-card border border-border rounded-lg${artifact.data.description ? ' mb-8' : ''}`}>
            <CardContent className="p-4">
              <Text className="text-2xl font-bold text-foreground mb-2">{artifact.data.name}</Text>
              {artifact.data.description && (
                <Text className="text-muted-foreground leading-6">{artifact.data.description}</Text>
              )}
            </CardContent>
          </Card>

          {/* Artifact Details */}
          <Card className="bg-card border border-border rounded-lg mb-8">
            <CardContent className="p-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                  <ClipboardList size={20} color="#fff" />
                </View>
                <Text className="text-lg font-semibold text-primary">Thông tin chi tiết</Text>
              </View>

              {/* Historical Period */}
              <View className="flex-row items-start justify-between py-2 border-b border-border">
                <Text className="text-muted-foreground flex-shrink-0 w-1/3">Thời kỳ lịch sử:</Text>
                <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                  {artifact.data.historicalPeriod || 'Chưa xác định'}
                </Text>
              </View>

              {artifact.data.metadata?.type && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Loại hiện vật:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.type}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.ethnicGroup && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Dân tộc:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.ethnicGroup}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.locationInMuseum && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Vị trí:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.locationInMuseum}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.material && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Chất liệu:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.material}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.discoveryDate && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Năm phát hiện:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.discoveryDate}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.originalLocation && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Nơi phát hiện:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.originalLocation}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.discoveryLocation && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Địa điểm khai quật:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.discoveryLocation}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.artist && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Nghệ sĩ:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.artist}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.dimensions && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Kích thước:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.dimensions}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.award && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Giải thưởng:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.award}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.photographer && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Nhiếp ảnh gia:</Text>
                  <Text className="text-foreground font-medium flex-1 text-right" numberOfLines={2}>
                    {artifact.data.metadata.photographer}
                  </Text>
                </View>
              )}

              {artifact.data.metadata?.nationalTreasure && (
                <View className="flex-row items-start justify-between py-2 border-b border-border">
                  <Text className="text-muted-foreground flex-shrink-0 w-1/3">Bảo vật quốc gia:</Text>
                  <View className="flex-1 flex-row items-center justify-end">
                    <Text className="text-accent font-medium mr-1">✓</Text>
                    <Text className="text-accent font-medium">Có</Text>
                  </View>
                </View>
              )}

              <View className="flex-row items-start justify-between py-2">
                <Text className="text-muted-foreground flex-shrink-0 w-1/3">Trạng thái:</Text>
                <Text
                  className={`font-medium flex-1 text-right ${artifact.data.isActive ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {artifact.data.isActive ? 'Đang trưng bày' : 'Không trưng bày'}
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
