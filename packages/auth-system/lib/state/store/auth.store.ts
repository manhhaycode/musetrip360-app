import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { AuthToken } from '@/domain';

export interface AuthStore {
  accessToken: AuthToken | null;
  refreshToken: AuthToken | null;
  isAuthenticated: boolean;

  setAccessToken: (accessToken: AuthToken | null) => void;
  setRefreshToken: (refreshToken: AuthToken | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;

  // Enhanced token management
  login: (tokens: { accessToken: AuthToken; refreshToken: AuthToken }) => void;
  logout: () => void;

  // Hydration support
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>()(
  // 1. subscribeWithSelector - for performance optimization
  subscribeWithSelector(
    // 2. persist - for SSR-safe persistence
    persist(
      // 3. immer - for clean state updates
      immer((set) => ({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,

        setAccessToken: (accessToken) =>
          set((state) => {
            state.accessToken = accessToken;
          }),

        setRefreshToken: (refreshToken) =>
          set((state) => {
            state.refreshToken = refreshToken;
          }),

        setIsAuthenticated: (isAuthenticated) =>
          set((state) => {
            state.isAuthenticated = isAuthenticated;
          }),

        // Enhanced login with automatic token validation
        login: (tokens) =>
          set((state) => {
            state.accessToken = tokens.accessToken;
            state.refreshToken = tokens.refreshToken;
            state.isAuthenticated = true;
          }),

        logout: () =>
          set((state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
          }),

        // SSR-safe hydration
        hydrate: () => {
          useAuthStore.persist.rehydrate();
        },
      })),
      {
        name: 'musetrip360-auth-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),

        version: 1,
        onRehydrateStorage: () => {
          return (state, error) => {
            console.log('Auth store rehydrated:', state);
            if (error) {
              console.error('Auth store hydration failed:', error);
            }
          };
        },
      }
    )
  )
);

// Selector hooks for optimized access to auth state
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
