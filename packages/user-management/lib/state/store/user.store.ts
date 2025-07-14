import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { UserStore } from '@/types';

export const useUserStore = create<UserStore>()(
  // 1. subscribeWithSelector - for performance optimization
  subscribeWithSelector(
    // 2. persist - for SSR-safe persistence
    persist(
      // 3. immer - for clean state updates
      immer((set) => ({
        user: null,

        setUser: (user) =>
          set((state) => {
            state.user = user;
          }),

        // SSR-safe hydration
        hydrate: async () => {
          await useUserStore.persist.rehydrate();
          return true;
        },
        resetStore: () =>
          set((state) => {
            state.user = null;
          }),
      })),
      {
        name: 'musetrip360-user-management-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
        }),
        skipHydration: true,
        version: 1,
        onRehydrateStorage: () => {
          return (state, error) => {
            console.log('User store rehydrated:', state);
            if (error) {
              console.error('User store hydration failed:', error);
            }
          };
        },
      }
    )
  )
);
