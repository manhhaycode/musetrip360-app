import { Tabs } from 'expo-router';
import { House, Search } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#c49a3e', // Primary color from visitor portal
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {
            paddingBottom: 4,
            paddingTop: 4,
            height: 60,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <House color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color }) => <Search color={color} />,
        }}
      />
    </Tabs>
  );
}
