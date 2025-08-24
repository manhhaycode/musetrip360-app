import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import '../global.css';

import { AppProvider } from '../src/providers/AppProvider';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Remove local font loading - use Google Fonts from global.css
  });

  if (!fontsLoaded) {
    return null; // Or a loading component
  }

  return (
    <AppProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="museum/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="artifact/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AppProvider>
  );
}
