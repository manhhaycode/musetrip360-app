import { AuthProvider } from '@musetrip360/auth-system/state';
import { QueryClient, QueryClientProvider } from '@musetrip360/query-foundation';
import React from 'react';
import { initConfigApp } from '../../config';

// Initialize app configuration
initConfigApp();

// Simple QueryClient for mobile - avoiding web-specific features
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: false, // Disable for mobile
      networkMode: 'online', // Only fetch when online
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
});

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthProvider>
  );
}
