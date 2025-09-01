import { Ionicons } from '@expo/vector-icons';
import { AIChatRelatedData } from '@musetrip360/ai-bot';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// Utility to normalize API response fields (handles both capitalized and camelCase)
const normalizeRelatedDataItem = (item: any): AIChatRelatedData => {
  return {
    id: item.id || item.Id,
    type: item.type || item.Type,
    title: item.title || item.Title,
    description: item.description || item.Description,
    similarityScore: item.similarityScore || item.SimilarityScore || 0,
  };
};

interface RelatedDataItemProps {
  item: AIChatRelatedData;
  onPress?: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Museum':
      return 'library-outline';
    case 'Event':
      return 'calendar-outline';
    case 'Artifact':
      return 'archive-outline';
    case 'TourOnline':
      return 'globe-outline';
    default:
      return 'cube-outline';
  }
};

const getRedirectLink = (item: AIChatRelatedData) => {
  switch (item.type) {
    case 'Museum':
      return `/museum/${item.id}`;
    case 'Event':
      return `/event/${item.id}`;
    case 'Artifact':
      return `/artifact/${item.id}`;
    case 'TourOnline':
      return `/virtual-tour/${item.id}`;
    default:
      return null;
  }
};

export function RelatedDataItem({ item, onPress }: RelatedDataItemProps) {
  // Normalize the item to handle both capitalized and camelCase properties
  const normalizedItem = normalizeRelatedDataItem(item);

  const handlePress = () => {
    onPress?.(); // Close modal if provided

    const link = getRedirectLink(normalizedItem);
    if (link) {
      router.push(link as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-2xl p-4 mb-3 border border-[#f5f5f4] active:bg-[#f5f5f4]"
      activeOpacity={0.8}
    >
      <View className="flex-row items-start space-x-3">
        <View className="w-10 h-10 rounded-full bg-[#f5f5f4] items-center justify-center flex-shrink-0">
          <Ionicons name={getTypeIcon(normalizedItem.type) as any} size={20} color="#ff914d" />
        </View>

        <View className="flex-1 min-w-0">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-sm font-medium text-[#2d1f13] flex-1" numberOfLines={2}>
              {normalizedItem.title}
            </Text>
          </View>

          <Text className="text-xs text-[#737373] mb-2" numberOfLines={2}>
            {normalizedItem.description}
          </Text>

          {normalizedItem.similarityScore > 0 && (
            <View className="flex-row items-center">
              <Text className="text-xs text-[#737373]">
                Độ liên quan: {(normalizedItem.similarityScore * 100).toFixed(0)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
