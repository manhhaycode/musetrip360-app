import { Bell, Menu, Search, User } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { Text } from '../core/ui/text';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showSearch?: boolean;
  showNotification?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function Header({
  title,
  showBackButton = false,
  showSearch = true,
  showNotification = true,
  showProfile = true,
  onMenuPress,
  onSearchPress,
  onNotificationPress,
  onProfilePress,
}: HeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Mock auth state for now
  const isAuthenticated = false;

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      router.push('/search');
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      if (isAuthenticated) {
        router.push('/profile');
      } else {
        router.push('/auth/login');
      }
    }
  };

  return (
    <View className="bg-card border-b border-border" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between h-14 px-4">
        {/* Left Section */}
        <View className="flex-row items-center flex-1">
          {showBackButton ? (
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 touch-target">
              <Menu size={24} color="#1f2937" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onMenuPress} className="p-2 -ml-2 touch-target">
              <Menu size={24} color="#1f2937" />
            </TouchableOpacity>
          )}

          {/* Logo and Title */}
          <View className="flex-row items-center ml-2">
            <View className="w-8 h-8 bg-primary rounded-lg items-center justify-center mr-2">
              <Text className="text-primary-foreground text-mobile-lg font-bold">M</Text>
            </View>
            <View>
              <Text className="text-mobile-base font-bold text-foreground">{title || 'MuseTrip360'}</Text>
              {!title && <Text className="text-mobile-xs text-muted-foreground">Digital Museum</Text>}
            </View>
          </View>
        </View>

        {/* Right Section */}
        <View className="flex-row items-center">
          {showSearch && (
            <TouchableOpacity onPress={handleSearchPress} className="p-2 touch-target mr-1">
              <Search size={22} color="#6b7280" />
            </TouchableOpacity>
          )}

          {showNotification && (
            <TouchableOpacity onPress={onNotificationPress} className="p-2 touch-target mr-1">
              <Bell size={22} color="#6b7280" />
            </TouchableOpacity>
          )}

          {showProfile && (
            <TouchableOpacity onPress={handleProfilePress} className="p-2 touch-target">
              <User size={22} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
