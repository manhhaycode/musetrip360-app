import React from 'react';
import { ScrollView, View, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MapPin, Star, Users, Calendar, ArrowRight, Search, Heart } from 'lucide-react-native';

import { Text } from '@/components/core/ui/text';
import { Card, CardContent } from '@/components/core/ui/card';
import { Badge } from '@/components/core/ui/badge';
import { Image } from '@/components/core/ui/image';
import { Input } from '@/components/core/ui/input';
import { featuredMuseums, upcomingEvents, museumCategories } from '@/lib/mockData';

const { width } = Dimensions.get('window');

export default function HomePage() {
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleSearch = () => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-2xl font-bold text-foreground">Khám phá bảo tàng</Text>
          <Text className="text-muted-foreground text-sm mt-1">Hơn 50+ bảo tàng và di tích lịch sử</Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 mb-6">
          <View className="relative">
            <Input
              placeholder="Tìm kiếm bảo tàng, hiện vật..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              className="pl-10 h-12 bg-card border-border"
            />
            <TouchableOpacity onPress={handleSearch} className="absolute left-3 top-3">
              <Search size={18} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-lg font-semibold text-foreground">Danh mục</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {museumCategories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => router.push(`/search?category=${category.id}`)}
                className="mr-3"
              >
                <Card className="w-20 h-20">
                  <CardContent className="p-3 items-center justify-center">
                    <Text className="text-2xl mb-1">{category.icon}</Text>
                    <Text className="text-xs text-center text-foreground font-medium">{category.label}</Text>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Museums */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-4 mb-4">
            <Text className="text-lg font-semibold text-foreground">Bảo tàng nổi bật</Text>
            <TouchableOpacity onPress={() => router.push('/search')} className="flex-row items-center">
              <Text className="text-primary font-medium mr-1">Xem tất cả</Text>
              <ArrowRight size={16} color="#c49a3e" />
            </TouchableOpacity>
          </View>

          {featuredMuseums.slice(0, 5).map((museum) => (
            <TouchableOpacity key={museum.id} onPress={() => router.push(`/museum/${museum.id}`)} className="mx-4 mb-4">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <View className="flex-row">
                    <Image source={museum.image} className="w-24 h-24" resizeMode="cover" />
                    <View className="flex-1 p-3">
                      <View className="flex-row items-start justify-between mb-2">
                        <Text className="font-bold text-sm text-foreground flex-1 mr-2" numberOfLines={2}>
                          {museum.name}
                        </Text>
                        <TouchableOpacity className="p-1">
                          <Heart size={16} color="#6b7280" />
                        </TouchableOpacity>
                      </View>

                      <View className="flex-row items-center mb-2">
                        <MapPin size={12} color="#6b7280" />
                        <Text className="text-muted-foreground text-xs ml-1 flex-1" numberOfLines={1}>
                          {museum.location}
                        </Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Star size={12} color="#fbbf24" fill="#fbbf24" />
                          <Text className="text-foreground text-xs ml-1 font-medium">{museum.rating}</Text>
                          <Text className="text-muted-foreground text-xs ml-1">({museum.reviewCount})</Text>
                        </View>
                        <Badge variant="outline">
                          <Text className="text-xs">{museum.price}</Text>
                        </Badge>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Events */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between px-4 mb-4">
            <Text className="text-lg font-semibold text-foreground">Sự kiện sắp diễn ra</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-primary font-medium mr-1">Xem tất cả</Text>
              <ArrowRight size={16} color="#c49a3e" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {upcomingEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => router.push(`/museum/${event.museumId}?tab=events`)}
                className="mr-4"
                style={{ width: width * 0.7 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <Image source={event.image} className="w-full h-32" resizeMode="cover" />
                    <View className="p-3">
                      <Text className="font-bold text-sm text-foreground mb-2" numberOfLines={2}>
                        {event.title}
                      </Text>

                      <View className="flex-row items-center mb-1">
                        <Calendar size={12} color="#6b7280" />
                        <Text className="text-muted-foreground text-xs ml-1">
                          {new Date(event.date).toLocaleDateString('vi-VN')} • {event.time}
                        </Text>
                      </View>

                      <View className="flex-row items-center mb-2">
                        <MapPin size={12} color="#6b7280" />
                        <Text className="text-muted-foreground text-xs ml-1 flex-1" numberOfLines={1}>
                          {event.museumName}
                        </Text>
                      </View>

                      <Badge className="self-start">
                        <Text className="text-xs text-primary-foreground">{event.price}</Text>
                      </Badge>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing for tab bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
