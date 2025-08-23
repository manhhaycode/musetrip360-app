import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { BottomNavigation } from '@/components/layout/BottomNavigation';

export default function TabLayout() {
  return (
    <View className="flex-1 bg-white">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
      </Stack>
      <BottomNavigation />
    </View>
  );
}
