import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useIsAuthenticated } from '@musetrip360/auth-system';
import { AppProvider } from '../src/providers/AppProvider';
import LoginScreen from './auth/LoginScreen';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Remove local font loading - use Google Fonts from global.css
  });
  const isAuthenticated = useIsAuthenticated();

  if (!fontsLoaded) {
    return null; // Or a loading component
  }
  return (
    <AppProvider>
      <StatusBar style="auto" />
      {isAuthenticated ? (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="museum/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="artifact/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="article/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      ) : (
        <LoginScreen />
      )}
    </AppProvider>
  );
}
