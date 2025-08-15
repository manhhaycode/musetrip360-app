import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { House } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7357b6', // Primary color from our theme
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <House color={color} />,
        }}
      />
    </Tabs>
  );
}
