import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogOut, User, UserCheck } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/core/ui/button';
import { Card, CardContent } from '@/components/core/ui/card';
import { Text } from '@/components/core/ui/text';
import { Header } from '@/components/layout/Header';

// Mock auth state for development
const mockUser = {
  isAuthenticated: false,
  user: null as { fullName?: string; email?: string } | null,
};

export default function ProfilePage() {
  const router = useRouter();
  const isAuthenticated = mockUser.isAuthenticated;
  const user = mockUser.user;

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          // Mock logout
          console.log('Logged out');
        },
      },
    ]);
  };

  const profileMenuItems = [
    {
      id: 'favorites',
      title: 'Bảo tàng yêu thích',
      description: 'Danh sách bảo tàng đã lưu',
      icon: '❤️',
      onPress: () => {
        // TODO: Navigate to favorites
        Alert.alert('Tính năng sắp có', 'Tính năng này sẽ được cập nhật trong phiên bản tiếp theo!');
      },
    },
    {
      id: 'bookings',
      title: 'Đặt chỗ của tôi',
      description: 'Lịch sử đặt chỗ và sự kiện',
      icon: '📅',
      onPress: () => {
        // TODO: Navigate to bookings
        Alert.alert('Tính năng sắp có', 'Tính năng này sẽ được cập nhật trong phiên bản tiếp theo!');
      },
    },
    {
      id: 'settings',
      title: 'Cài đặt',
      description: 'Thông báo và tùy chọn',
      icon: '⚙️',
      onPress: () => {
        // TODO: Navigate to settings
        Alert.alert('Tính năng sắp có', 'Tính năng này sẽ được cập nhật trong phiên bản tiếp theo!');
      },
    },
    {
      id: 'help',
      title: 'Trợ giúp',
      description: 'Hỗ trợ và liên hệ',
      icon: '❓',
      onPress: () => {
        // TODO: Navigate to help
        Alert.alert('Tính năng sắp có', 'Tính năng này sẽ được cập nhật trong phiên bản tiếp theo!');
      },
    },
  ];

  const getInitials = (fullName?: string) => {
    return (
      fullName
        ?.split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .toUpperCase() || 'U'
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />

      <Header title="Hồ sơ" showSearch={false} showNotification={isAuthenticated} showProfile={false} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isAuthenticated ? (
          // Authenticated UI
          <>
            {/* User Info Card */}
            <View className="mobile-container mobile-section">
              <Card className="mobile-card-shadow">
                <CardContent className="p-6">
                  <View className="flex-row items-center">
                    <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mr-4">
                      <Text className="text-primary-foreground text-mobile-lg font-bold">
                        {getInitials(user?.fullName)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-mobile-lg font-bold text-foreground">{user?.fullName || 'Người dùng'}</Text>
                      <Text className="text-muted-foreground text-mobile-sm">{user?.email}</Text>
                      <View className="flex-row items-center mt-2">
                        <UserCheck size={12} color="#10b981" />
                        <Text className="text-success text-mobile-xs ml-1">Đã xác thực</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={handleLogout} className="p-2 touch-target">
                      <LogOut size={22} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </CardContent>
              </Card>
            </View>

            {/* Profile Stats */}
            <View className="mobile-container mobile-section">
              <View className="flex-row space-x-3">
                <Card className="flex-1 mobile-card-shadow">
                  <CardContent className="p-4 items-center">
                    <Text className="text-mobile-2xl font-bold text-primary">0</Text>
                    <Text className="text-mobile-xs text-muted-foreground text-center">Bảo tàng đã thăm</Text>
                  </CardContent>
                </Card>
                <Card className="flex-1 mobile-card-shadow">
                  <CardContent className="p-4 items-center">
                    <Text className="text-mobile-2xl font-bold text-primary">0</Text>
                    <Text className="text-mobile-xs text-muted-foreground text-center">Sự kiện tham gia</Text>
                  </CardContent>
                </Card>
                <Card className="flex-1 mobile-card-shadow">
                  <CardContent className="p-4 items-center">
                    <Text className="text-mobile-2xl font-bold text-primary">0</Text>
                    <Text className="text-mobile-xs text-muted-foreground text-center">Yêu thích</Text>
                  </CardContent>
                </Card>
              </View>
            </View>

            {/* Profile Menu */}
            <View className="mobile-container">
              <Text className="text-mobile-lg font-semibold text-foreground mb-4">Menu cá nhân</Text>
              {profileMenuItems.map((item) => (
                <TouchableOpacity key={item.id} onPress={item.onPress} className="mb-3">
                  <Card className="mobile-card-shadow">
                    <CardContent className="p-4">
                      <View className="flex-row items-center">
                        <Text className="text-2xl mr-4">{item.icon}</Text>
                        <View className="flex-1">
                          <Text className="font-semibold text-foreground text-mobile-base">{item.title}</Text>
                          <Text className="text-muted-foreground text-mobile-sm">{item.description}</Text>
                        </View>
                        <Text className="text-muted-foreground text-mobile-lg">›</Text>
                      </View>
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          // Unauthenticated UI
          <View className="mobile-container">
            {/* Login/Register Prompt */}
            <Card className="mobile-section mobile-card-shadow">
              <CardContent className="p-6 items-center">
                <View className="w-20 h-20 bg-muted rounded-full items-center justify-center mb-4">
                  <User size={40} color="#6b7280" />
                </View>
                <Text className="text-mobile-xl font-bold text-foreground mb-2 text-center">Chưa đăng nhập</Text>
                <Text className="text-muted-foreground text-mobile-base text-center mb-6 leading-6">
                  Đăng nhập để lưu bảo tàng yêu thích, đặt chỗ sự kiện và trải nghiệm đầy đủ tính năng
                </Text>

                <View className="w-full space-y-4">
                  <Button onPress={handleLogin} className="w-full h-12">
                    <Text className="text-primary-foreground font-medium text-mobile-base">Đăng nhập</Text>
                  </Button>
                  <Button variant="outline" onPress={handleRegister} className="w-full h-12">
                    <Text className="text-foreground font-medium text-mobile-base">Đăng ký</Text>
                  </Button>
                </View>
              </CardContent>
            </Card>

            {/* Guest Features */}
            <Text className="text-mobile-lg font-semibold text-foreground mb-4">Tính năng khách</Text>
            <TouchableOpacity className="mb-3" onPress={() => router.push('/search')}>
              <Card className="mobile-card-shadow">
                <CardContent className="p-4">
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-4">🔍</Text>
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground text-mobile-base">Tìm kiếm bảo tàng</Text>
                      <Text className="text-muted-foreground text-mobile-sm">Khám phá hàng trăm bảo tàng</Text>
                    </View>
                    <Text className="text-muted-foreground text-mobile-lg">›</Text>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity className="mb-3" onPress={() => router.push('/')}>
              <Card className="mobile-card-shadow">
                <CardContent className="p-4">
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-4">🏛️</Text>
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground text-mobile-base">Xem thông tin</Text>
                      <Text className="text-muted-foreground text-mobile-sm">Chi tiết bảo tàng và hiện vật</Text>
                    </View>
                    <Text className="text-muted-foreground text-mobile-lg">›</Text>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom spacing for bottom navigation */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
