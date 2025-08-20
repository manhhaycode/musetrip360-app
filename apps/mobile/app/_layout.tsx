import { QueryClient, QueryClientProvider } from '@musetrip360/query-foundation';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import '../global.css';

import { initConfigApp } from '../config';

// Initialize config on module load
try {
  initConfigApp();
} catch (error) {
  console.warn('Failed to initialize config:', error);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 3,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Remove local font loading - use Google Fonts from global.css
  });

  if (!fontsLoaded) {
    return null; // Or a loading component
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="museum/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/google/callback" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </QueryClientProvider>
  );
}
