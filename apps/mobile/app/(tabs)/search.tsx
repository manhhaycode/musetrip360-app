import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Calendar, MapPin, Play, Search, Star, Users } from 'lucide-react-native';
import React from 'react';
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/core/ui/badge';
import { Card, CardContent } from '@/components/core/ui/card';
import { Image } from '@/components/core/ui/image';
import { Input } from '@/components/core/ui/input';
import { Text } from '@/components/core/ui/text';
import { searchData } from '@/lib/mockData';

const { width } = Dimensions.get('window');

export default function SearchPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = React.useState((params.q as string) || '');
  const [selectedType, setSelectedType] = React.useState('all');

  const searchTypes = [
    { id: 'all', label: 'Tất cả', icon: '🔍' },
    { id: 'museums', label: 'Bảo tàng', icon: '🏛️' },
    { id: 'artifacts', label: 'Hiện vật', icon: '🏺' },
    { id: 'tours', label: 'Tour VR', icon: '🎧' },
    { id: 'events', label: 'Sự kiện', icon: '📅' },
  ];

  const searchResults = React.useMemo(() => {
    return searchData(searchQuery, selectedType);
  }, [searchQuery, selectedType]);

  const renderSearchResult = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'museum':
        return (
          <TouchableOpacity onPress={() => router.push(`/museum/${item.id}`)} className="mx-4 mb-3">
            <Card>
              <CardContent className="p-0">
                <View className="flex-row">
                  <Image source={item.image} className="w-20 h-20 rounded-l-lg" />
                  <View className="flex-1 p-3">
                    <View className="flex-row items-start justify-between mb-1">
                      <Text className="font-bold text-sm text-foreground flex-1 mr-2" numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Badge variant="secondary">
                        <Text className="text-xs">
                          {item.categoryIcon} {item.category}
                        </Text>
                      </Badge>
                    </View>

                    <View className="flex-row items-center mb-2">
                      <MapPin size={10} color="#6b7280" />
                      <Text className="text-muted-foreground text-xs ml-1 flex-1" numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Star size={10} color="#fbbf24" fill="#fbbf24" />
                        <Text className="text-foreground text-xs ml-1">{item.rating}</Text>
                        <Text className="text-muted-foreground text-xs ml-1">({item.reviewCount})</Text>
                      </View>
                      <Badge variant="outline">
                        <Text className="text-xs">{item.price}</Text>
                      </Badge>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        );

      case 'artifact':
        return (
          <TouchableOpacity onPress={() => router.push(`/museum/${item.museumId}?tab=artifacts`)} className="mx-4 mb-3">
            <Card>
              <CardContent className="p-0">
                <View className="flex-row">
                  <Image source={item.image} className="w-20 h-20 rounded-l-lg" />
                  <View className="flex-1 p-3">
                    <View className="flex-row items-start justify-between mb-1">
                      <Text className="font-bold text-sm text-foreground flex-1 mr-2" numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Badge variant="secondary">
                        <Text className="text-xs">🏺 Hiện vật</Text>
                      </Badge>
                    </View>

                    <Text className="text-muted-foreground text-xs mb-1" numberOfLines={2}>
                      {item.period} • {item.category}
                    </Text>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Text className="text-muted-foreground text-xs">{item.museumName}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Star size={10} color="#fbbf24" fill="#fbbf24" />
                        <Text className="text-foreground text-xs ml-1">{item.rating}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        );

      case 'tour':
        return (
          <TouchableOpacity onPress={() => router.push(`/museum/${item.museumId}?tab=tours`)} className="mx-4 mb-3">
            <Card>
              <CardContent className="p-0">
                <View className="flex-row">
                  <View className="relative">
                    <Image source={item.thumbnail} className="w-20 h-20 rounded-l-lg" />
                    <View className="absolute inset-0 bg-black/30 rounded-l-lg items-center justify-center">
                      <Play size={16} color="white" fill="white" />
                    </View>
                  </View>
                  <View className="flex-1 p-3">
                    <View className="flex-row items-start justify-between mb-1">
                      <Text className="font-bold text-sm text-foreground flex-1 mr-2" numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Badge variant="secondary">
                        <Text className="text-xs">🎧 Tour VR</Text>
                      </Badge>
                    </View>

                    <View className="flex-row items-center mb-1">
                      <Text className="text-muted-foreground text-xs">{item.duration}</Text>
                      <Text className="text-muted-foreground text-xs mx-1">•</Text>
                      <Users size={10} color="#6b7280" />
                      <Text className="text-muted-foreground text-xs ml-1">{item.viewCount.toLocaleString()}</Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground text-xs">{item.museumName}</Text>
                      <Badge variant="outline">
                        <Text className="text-xs">{item.price}</Text>
                      </Badge>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        );

      case 'event':
        return (
          <TouchableOpacity onPress={() => router.push(`/museum/${item.museumId}?tab=events`)} className="mx-4 mb-3">
            <Card>
              <CardContent className="p-0">
                <View className="flex-row">
                  <Image source={item.image} className="w-20 h-20 rounded-l-lg" />
                  <View className="flex-1 p-3">
                    <View className="flex-row items-start justify-between mb-1">
                      <Text className="font-bold text-sm text-foreground flex-1 mr-2" numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Badge variant="secondary">
                        <Text className="text-xs">📅 Sự kiện</Text>
                      </Badge>
                    </View>

                    <View className="flex-row items-center mb-1">
                      <Calendar size={10} color="#6b7280" />
                      <Text className="text-muted-foreground text-xs ml-1">
                        {new Date(item.date).toLocaleDateString('vi-VN')} • {item.time}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-muted-foreground text-xs">{item.museumName}</Text>
                      <Badge variant="outline">
                        <Text className="text-xs">{item.price}</Text>
                      </Badge>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-4 pt-4 pb-4 bg-card border-b border-border">
        <Text className="text-xl font-bold text-foreground mb-4">Tìm kiếm</Text>

        {/* Search Input */}
        <View className="relative mb-4">
          <Input
            placeholder="Tìm kiếm bảo tàng, hiện vật, tour online..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="pl-10 h-12 bg-background border-border"
          />
          <Search size={18} color="#6b7280" className="absolute left-3 top-3" />
        </View>

        {/* Search Type Toggle */}
        <View className="flex-row bg-muted rounded-lg p-1">
          {searchTypes.slice(0, 3).map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              className={`flex-1 py-2 rounded-md ${selectedType === type.id ? 'bg-card shadow-sm' : ''}`}
            >
              <View className="flex-row items-center justify-center">
                <Text className="mr-1 text-sm">{type.icon}</Text>
                <Text
                  className={`font-medium text-sm ${
                    selectedType === type.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {type.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Extended Types */}
        <View className="flex-row mt-2 space-x-2">
          {searchTypes.slice(3).map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              className={`px-3 py-1 rounded-md mr-2 ${selectedType === type.id ? 'bg-primary' : 'bg-muted'}`}
            >
              <View className="flex-row items-center">
                <Text className="mr-1 text-xs">{type.icon}</Text>
                <Text
                  className={`text-xs ${
                    selectedType === type.id ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {type.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results Count */}
      <View className="px-4 py-2 bg-muted border-b border-border">
        <Text className="text-muted-foreground text-sm">{searchResults.length} kết quả</Text>
      </View>

      {/* Search Results */}
      <View className="flex-1">
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: 80,
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center py-16">
            <Text className="text-4xl mb-4">🔍</Text>
            <Text className="text-lg font-bold text-foreground mb-2">Không tìm thấy kết quả</Text>
            <Text className="text-muted-foreground text-center px-8 text-sm">
              {searchQuery ? `Không tìm thấy kết quả cho "${searchQuery}"` : `Hãy thử tìm kiếm với từ khóa khác`}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
