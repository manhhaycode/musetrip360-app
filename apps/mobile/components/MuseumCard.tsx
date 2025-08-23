import { Ionicons } from '@expo/vector-icons';
import { Museum } from '@musetrip360/museum-management';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface MuseumCardProps {
  museum: Museum;
}

export function MuseumCard({ museum }: MuseumCardProps) {
  const handlePress = () => {
    router.push(`/museum/${museum.id}`);
  };

  const getImageUrl = () => {
    // Try cover image first
    if (museum.metadata?.coverImageUrl) {
      return museum.metadata.coverImageUrl;
    }

    // Try first image from images array
    if (museum.metadata?.images && museum.metadata.images.length > 0) {
      return museum.metadata.images[0];
    }

    // Fallback image
    return 'https://images.unsplash.com/photo-1554757387-ea8f60cde1f0?w=400';
  };

  const formatRating = (rating: number) => {
    return rating > 0 ? rating.toFixed(1) : 'N/A';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-600';
      case 'Inactive':
        return 'text-red-600';
      case 'Pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Active':
        return 'Hoạt động';
      case 'Inactive':
        return 'Tạm ngưng';
      case 'Pending':
        return 'Chờ duyệt';
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden"
      activeOpacity={0.7}
    >
      {/* Image */}
      <View className="relative">
        <Image source={{ uri: getImageUrl() }} className="w-full h-48" resizeMode="cover" />

        {/* Rating Badge */}
        <View className="absolute top-3 right-3 bg-black/70 rounded-full px-2 py-1 flex-row items-center">
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text className="text-white text-xs font-medium ml-1">{formatRating(museum.rating)}</Text>
        </View>

        {/* Status Badge */}
        <View className="absolute top-3 left-3 bg-white/90 rounded-full px-2 py-1">
          <Text className={`text-xs font-medium ${getStatusColor(museum.status)}`}>{getStatusText(museum.status)}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Title and Location */}
        <Text className="text-lg font-semibold text-gray-900 mb-1" numberOfLines={2}>
          {museum.name}
        </Text>
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1 flex-1" numberOfLines={1}>
            {museum.location}
          </Text>
        </View>

        {/* Description */}
        <Text className="text-sm text-gray-600 leading-5 mb-3" numberOfLines={2}>
          {museum.description}
        </Text>

        {/* Categories */}
        {museum.categories && museum.categories.length > 0 && (
          <View className="flex-row flex-wrap gap-1 mb-3">
            {museum.categories.slice(0, 2).map((category) => (
              <View key={category.id} className="px-2 py-1 bg-blue-50 rounded-md">
                <Text className="text-xs text-blue-700 font-medium">{category.name}</Text>
              </View>
            ))}
            {museum.categories.length > 2 && (
              <View className="px-2 py-1 bg-gray-50 rounded-md">
                <Text className="text-xs text-gray-600">+{museum.categories.length - 2}</Text>
              </View>
            )}
          </View>
        )}

        {/* Contact Info */}
        <View className="flex-row items-center justify-between">
          {museum.contactPhone && (
            <View className="flex-row items-center flex-1">
              <Ionicons name="call-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600 ml-1" numberOfLines={1}>
                {museum.contactPhone}
              </Text>
            </View>
          )}

          {museum.contactEmail && (
            <View className="flex-row items-center flex-1">
              <Ionicons name="mail-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600 ml-1" numberOfLines={1}>
                {museum.contactEmail}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
