import { Home, Search } from 'lucide-react-native';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePathname, useRouter } from 'expo-router';
import { Text } from '../core/ui/text';

interface TabItem {
  name: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  href: string;
}

const tabs: TabItem[] = [
  {
    name: 'home',
    label: 'Trang chủ',
    icon: Home,
    href: '/',
  },
  {
    name: 'search',
    label: 'Tìm kiếm',
    icon: Search,
    href: '/search',
  },
];

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/';
    }
    return pathname.startsWith(href);
  };

  return (
    <View
      className="bg-white border-t border-gray-200"
      style={{
        paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
        paddingTop: 8,
      }}
    >
      <View className="flex-row items-center justify-around">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const Icon = tab.icon;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(tab.href as any)}
              className="flex-1 items-center py-2"
              activeOpacity={0.7}
            >
              <View className={`items-center justify-center ${active ? 'mb-1' : 'mb-2'}`}>
                <Icon size={24} color={active ? '#2563eb' : '#6b7280'} />
                {active && <View className="w-1 h-1 bg-blue-600 rounded-full mt-1" />}
              </View>
              <Text className={`text-sm font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
