import { create } from 'zustand';
import { AuthToken } from '@/types';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AuthEndpoints } from '@/api';

export interface AuthStore {
  accessToken: AuthToken | null;
  refreshToken: AuthToken | null;
  userId: string | null;
  setAccessToken: (accessToken: AuthToken | null) => void;
  setRefreshToken: (refreshToken: AuthToken | null) => void;
  login: (tokens: { accessToken: AuthToken; refreshToken: AuthToken }, userId: string) => void;
  resetStore: () => void;
  hydrate: () => Promise<boolean>;
  isExpired: () => 'none' | 'access' | 'refresh' | 'both';
  checkExpired: () => void;
}

export const useAuthStore = create<AuthStore>()(
  // 1. subscribeWithSelector - for performance optimization
  subscribeWithSelector(
    // 2. persist - for SSR-safe persistence
    persist(
      // 3. immer - for clean state updates
      immer((set, get) => ({
        accessToken: null,
        refreshToken: null,
        userId: null,

        setAccessToken: (accessToken) =>
          set((state) => {
            state.accessToken = accessToken;
            AuthEndpoints.setAuthToken(accessToken?.token || '');
          }),

        setRefreshToken: (refreshToken) =>
          set((state) => {
            state.refreshToken = refreshToken;
          }),

        // Enhanced login with automatic token validation
        login: (tokens, userId) =>
          set((state) => {
            state.accessToken = tokens.accessToken;
            state.refreshToken = tokens.refreshToken;
            state.userId = userId;
            AuthEndpoints.setAuthToken(tokens.accessToken?.token || '');
          }),

        resetStore: () =>
          set((state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.userId = null;
            AuthEndpoints.setAuthToken('');
          }),

        // SSR-safe hydration
        hydrate: async () => {
          await useAuthStore.persist.rehydrate();
          AuthEndpoints.setAuthToken(useAuthStore.getState().accessToken?.token || '');

          return true;
        },
        isExpired: (): 'none' | 'access' | 'refresh' | 'both' => {
          const isAccessTokenExpired = get().accessToken && get().accessToken!.expiresAt < Date.now();
          const isRefreshTokenExpired = get().refreshToken && get().refreshToken!.expiresAt < Date.now();

          if (isAccessTokenExpired && isRefreshTokenExpired) {
            return 'both';
          }
          if (isAccessTokenExpired) {
            return 'access';
          }
          if (isRefreshTokenExpired) {
            return 'refresh';
          }
          return 'none';
        },

        checkExpired: () => {
          const isExpired = get().isExpired();
          if (isExpired === 'both') {
            useAuthStore.getState().resetStore();
          } else if (isExpired === 'access') {
            set((state) => {
              state.accessToken = null;
            });
          } else if (isExpired === 'refresh') {
            set((state) => {
              state.refreshToken = null;
            });
          }
        },
      })),
      {
        name: 'musetrip360-auth-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          userId: state.userId,
        }),
        skipHydration: true,
        version: 1,
        onRehydrateStorage: () => {
          return (state, error) => {
            if (error) {
              console.error('Auth store hydration failed:', error);
            } else if (state) {
              const isExpired = state.isExpired();
              if (isExpired === 'both') {
                useAuthStore.getState().resetStore();
              }
              if (isExpired === 'access') {
                useAuthStore.getState().setAccessToken(null);
              }
              if (isExpired === 'refresh') {
                useAuthStore.getState().setRefreshToken(null);
              }
              AuthEndpoints.setAuthToken(state.accessToken?.token || '');
              console.log('Auth store rehydrated:', state);
            }
          };
        },
      }
    )
  )
);

// Selector hooks for optimized access to auth state
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.accessToken !== null || state.refreshToken !== null);
