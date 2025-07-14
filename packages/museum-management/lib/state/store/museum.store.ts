import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { MuseumStore } from '@/types';

export const useMuseumStore = create<MuseumStore>()(
  // 1. subscribeWithSelector - for performance optimization
  subscribeWithSelector(
    // 2. persist - for SSR-safe persistence
    persist(
      // 3. immer - for clean state updates
      immer((set) => ({
        museums: [],
        userMuseums: [],

        setMuseums: (museums) =>
          set((state) => {
            state.museums = museums;
          }),

        setUserMuseums: (museums) =>
          set((state) => {
            state.userMuseums = museums;
          }),

        // SSR-safe hydration
        hydrate: () => {
          useMuseumStore.persist.rehydrate();
        },
        resetStore: () =>
          set((state) => {
            state.museums = [];
          }),
      })),
      {
        name: 'musetrip360-museum-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          museums: state.museums,
          userMuseums: state.userMuseums,
        }),

        version: 1,
        onRehydrateStorage: () => {
          return (state, error) => {
            console.log('Museum store rehydrated:', state);
            if (error) {
              console.error('Museum store hydration failed:', error);
            }
          };
        },
      }
    )
  )
);
