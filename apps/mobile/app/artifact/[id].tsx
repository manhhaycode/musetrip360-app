import { ModelViewer } from '@/components/3d/ModelViewer';
import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Text } from '@/components/core/ui/text';
import { useArtifactDetail } from '@/hooks/useArtifacts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, ClipboardList, ExternalLink, Eye } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, FlatList, Modal, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ArtifactHeaderProps = {
  router: ReturnType<typeof useRouter>;
  museumId?: string;
};

function ArtifactHeader({ router, museumId }: ArtifactHeaderProps) {
  const handleBackPress = () => {
    if (museumId) {
      // Navigate to museum detail page with source parameter
      router.push(`/museum/${museumId}?from=artifact` as any);
    } else {
      // Fallback to normal back behavior
      router.back();
    }
  };

  return (
    <View className="bg-background px-4 py-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={handleBackPress} className="p-2">
          <ArrowLeft size={24} color="#2d1f13" />
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
  const [imageGalleryVisible, setImageGalleryVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [show3DModel, setShow3DModel] = useState(false);

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
        <ArtifactHeader router={router} museumId={artifact?.data?.museumId} />
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
        <ArtifactHeader router={router} museumId={artifact?.data?.museumId} />
        <View className="flex-1 justify-center items-center">
          <Text className="text-muted-foreground">Không tìm thấy hiện vật</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Prepare image gallery - main image + additional images from metadata
  const allImages = [
    { url: artifact.data.imageUrl, alt: artifact.data.name, isMain: true },
    ...(artifact.data.metadata?.images?.map((img: any, index: number) => ({
      url: img.file as string,
      alt: `${artifact.data.name} - Ảnh ${index + 2}`,
      isMain: false,
    })) || []),
  ].filter((img) => img.url);

  const openImageGallery = (index: number = 0) => {
    setSelectedImageIndex(index);
    setImageGalleryVisible(true);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <ArtifactHeader router={router} museumId={artifact.data.museumId} />
      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="p-4">
          {/* Artifact Image Gallery */}
          <Card className="bg-card rounded-lg mb-8 overflow-hidden">
            <TouchableOpacity onPress={() => openImageGallery(0)}>
              <Image source={{ uri: artifact.data.imageUrl }} className="w-full h-64" resizeMode="cover" />
              {/* Image Count Badge */}
              {allImages.length > 1 && (
                <View className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1">
                  <Text className="text-white text-xs font-medium">{allImages.length} ảnh</Text>
                </View>
              )}
              {/* Gallery Icon */}
              <View className="absolute bottom-2 right-2 bg-black/70 rounded-full p-2">
                <Eye size={16} color="#ffffff" />
              </View>
            </TouchableOpacity>

            {/* Additional Images Preview (if any) */}
            {allImages.length > 1 && (
              <ScrollView horizontal className="p-2" showsHorizontalScrollIndicator={false}>
                {allImages.slice(1, 4).map((image: any, index: number) => (
                  <TouchableOpacity key={index} onPress={() => openImageGallery(index + 1)} className="mr-2">
                    <Image source={{ uri: image.url }} className="w-16 h-16 rounded-lg" resizeMode="cover" />
                  </TouchableOpacity>
                ))}
                {allImages.length > 4 && (
                  <TouchableOpacity
                    onPress={() => openImageGallery(4)}
                    className="w-16 h-16 rounded-lg bg-black/80 items-center justify-center"
                  >
                    <Text className="text-white text-xs font-medium">+{allImages.length - 4}</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </Card>

          {/* Artifact Header */}
          <Card className={`bg-card rounded-lg${artifact.data.description ? ' mb-8' : ''}`}>
            <CardContent className="p-4">
              <Text className="text-2xl font-bold text-foreground mb-2">{artifact.data.name}</Text>
              {artifact.data.description && (
                <Text className="text-muted-foreground leading-6">{artifact.data.description}</Text>
              )}
            </CardContent>
          </Card>

          {/* Artifact Details */}
          <Card className="bg-card rounded-lg mb-8">
            <CardContent className="p-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-3">
                  <ClipboardList size={20} color="#fff6ed" />
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

          {/* 3D Model Button */}
          {artifact.data.model3DUrl && (
            <View className="mb-4">
              <Button
                onPress={() => setShow3DModel(true)}
                className="flex-row items-center justify-center bg-primary rounded-lg py-3"
              >
                <ExternalLink size={20} color="#ffffff" />
                <Text className="text-white font-medium ml-2">Xem mô hình 3D</Text>
              </Button>
            </View>
          )}
        </View>

        {/* Image Gallery Modal */}
        <Modal
          visible={imageGalleryVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImageGalleryVisible(false)}
        >
          <View className="flex-1 bg-background">
            {/* Header */}
            <View className="absolute top-0 left-0 right-0 z-10 bg-background/90 pt-12 pb-4 px-4">
              <View className="flex-row items-center justify-between">
                <TouchableOpacity onPress={() => setImageGalleryVisible(false)} className="p-2">
                  <ArrowLeft size={24} color="#2d1f13" />
                </TouchableOpacity>
                <Text className="text-foreground font-medium">
                  {selectedImageIndex + 1} / {allImages.length}
                </Text>
                <View className="w-10" />
              </View>
            </View>

            {/* Image Gallery */}
            <View className="flex-1 pt-20 bg-background">
              <FlatList
                data={allImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={selectedImageIndex}
                getItemLayout={(_, index) => ({
                  length: screenWidth,
                  offset: screenWidth * index,
                  index,
                })}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                  setSelectedImageIndex(index);
                }}
                renderItem={({ item }: { item: any }) => (
                  <View className="flex-1 items-center justify-center bg-background p-4" style={{ width: screenWidth }}>
                    <Image source={{ uri: item.url }} className="w-full h-full rounded-lg" resizeMode="contain" />
                  </View>
                )}
                keyExtractor={(_, index) => index.toString()}
              />
            </View>
          </View>
        </Modal>

        {/* 3D Model Modal */}
        {artifact.data.model3DUrl && (
          <Modal
            visible={show3DModel}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShow3DModel(false)}
          >
            <View className="flex-1 bg-background">
              {/* Header */}
              <View className="absolute top-0 left-0 right-0 z-10 bg-background/90 pt-12 pb-4 px-4">
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity onPress={() => setShow3DModel(false)} className="p-2">
                    <ArrowLeft size={24} color="#2d1f13" />
                  </TouchableOpacity>
                  <Text className="text-foreground font-medium">Mô hình 3D</Text>
                  <View className="w-10" />
                </View>
              </View>

              {/* 3D Model Viewer */}
              <View className="flex-1 pt-20 bg-background">
                <ModelViewer modelUrl={artifact.data.model3DUrl} className="flex-1" />
              </View>
            </View>
          </Modal>
        )}

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
