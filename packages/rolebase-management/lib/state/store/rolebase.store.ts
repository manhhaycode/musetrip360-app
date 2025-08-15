import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { UserPrivilege } from '@/types';

interface RolebaseStore {
  userPrivileges: UserPrivilege;
  isPrivilegesLoaded: boolean;

  setUserPrivileges: (privileges: UserPrivilege) => void;
  hasPermission: (museumId: string, permission: string) => boolean;
  hasAllPermissions: (museumId: string, permissions: string[]) => boolean;
  hasAnyPermission: (museumId: string, permissions: string[]) => boolean;
  hydrate: () => Promise<boolean>;
  resetStore: () => void;
}

export const useRolebaseStore = create<RolebaseStore>()(
  // 1. subscribeWithSelector - for performance optimization
  subscribeWithSelector(
    // 2. persist - for SSR-safe persistence
    persist(
      // 3. immer - for clean state updates
      immer((set, get) => ({
        userPrivileges: {},
        isPrivilegesLoaded: false,

        setUserPrivileges: (privileges) =>
          set((state) => {
            state.userPrivileges = privileges;
            state.isPrivilegesLoaded = true;
          }),

        hasPermission: (museumId, permission) => {
          const state = get();
          return state.userPrivileges[`${museumId}.${permission}`] === true;
        },

        hasAllPermissions: (museumId, permissions) => {
          const state = get();
          return permissions.every((permission) => state.userPrivileges[`${museumId}.${permission}`] === true);
        },

        hasAnyPermission: (museumId, permissions) => {
          const state = get();
          return permissions.some((permission) => state.userPrivileges[`${museumId}.${permission}`] === true);
        },

        // SSR-safe hydration
        hydrate: async () => {
          await useRolebaseStore.persist.rehydrate();
          return true;
        },

        resetStore: () =>
          set((state) => {
            state.userPrivileges = {};
            state.isPrivilegesLoaded = false;
          }),
      })),
      {
        name: 'musetrip360-rolebase-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          userPrivileges: state.userPrivileges,
          isPrivilegesLoaded: state.isPrivilegesLoaded,
        }),
        skipHydration: true,
        version: 1,
        onRehydrateStorage: () => {
          return (state, error) => {
            console.log('Rolebase store rehydrated:', state);
            if (error) {
              console.error('Rolebase store hydration failed:', error);
            }
          };
        },
      }
    )
  )
);
