/**
 * @fileoverview User Store
 *
 * Zustand store for managing user state including CRUD operations,
 * pagination, filtering, and selection.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type { User } from '../../domain';
import type { UserState, UserStateSlice } from '../types';
import type { UserSearchFilters, PaginationParams } from '../../types';

/**
 * Initial state for user management
 */
const initialState: Omit<UserState, keyof UserStateActions> = {
  // Data
  users: [],
  currentUser: null,
  totalUsers: 0,

  // Pagination and filtering
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    role: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },

  // Selection
  selectedUsers: [],

  // Base state
  isLoading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Type for user state actions
 */
type UserStateActions = Pick<
  UserState,
  | 'setUsers'
  | 'addUser'
  | 'updateUser'
  | 'removeUser'
  | 'setCurrentUser'
  | 'setPagination'
  | 'setFilters'
  | 'selectUser'
  | 'deselectUser'
  | 'selectAllUsers'
  | 'clearSelection'
  | 'setLoading'
  | 'setError'
  | 'clearError'
  | 'reset'
>;

/**
 * Create user store slice
 */
const createUserSlice: UserStateSlice = (set) => ({
  ...initialState,

  // Data actions
  setUsers: (users: User[]) => {
    set((state) => {
      state.users = users;
      state.totalUsers = users.length;
      state.lastUpdated = new Date();
    });
  },

  addUser: (user: User) => {
    set((state) => {
      state.users.unshift(user);
      state.totalUsers += 1;
      state.lastUpdated = new Date();
    });
  },

  updateUser: (id: string, updates: Partial<User>) => {
    set((state) => {
      const index = state.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        const user = state.users[index];
        Object.keys(updates).forEach((key) => {
          const updateKey = key as keyof User;
          const value = updates[updateKey];
          if (value !== undefined) {
            (user as any)[updateKey] = value;
          }
        });
        state.lastUpdated = new Date();
      }

      // Update current user if it's the one being updated
      if (state.currentUser && state.currentUser.id === id) {
        Object.keys(updates).forEach((key) => {
          const updateKey = key as keyof User;
          const value = updates[updateKey];
          if (value !== undefined) {
            (state.currentUser as any)[updateKey] = value;
          }
        });
      }
    });
  },

  removeUser: (id: string) => {
    set((state) => {
      state.users = state.users.filter((user) => user.id !== id);
      state.totalUsers -= 1;
      state.selectedUsers = state.selectedUsers.filter((selectedId) => selectedId !== id);

      // Clear current user if it's the one being removed
      if (state.currentUser?.id === id) {
        state.currentUser = null;
      }

      state.lastUpdated = new Date();
    });
  },

  setCurrentUser: (user: User | null) => {
    set((state) => {
      state.currentUser = user;
    });
  },

  // Pagination actions
  setPagination: (pagination: Partial<PaginationParams>) => {
    set((state) => {
      state.pagination = { ...state.pagination, ...pagination };
    });
  },

  setFilters: (filters: Partial<UserSearchFilters>) => {
    set((state) => {
      state.filters = { ...state.filters, ...filters };
      // Reset pagination when filters change
      state.pagination.page = 1;
    });
  },

  // Selection actions
  selectUser: (id: string) => {
    set((state) => {
      if (!state.selectedUsers.includes(id)) {
        state.selectedUsers.push(id);
      }
    });
  },

  deselectUser: (id: string) => {
    set((state) => {
      state.selectedUsers = state.selectedUsers.filter((selectedId) => selectedId !== id);
    });
  },

  selectAllUsers: () => {
    set((state) => {
      state.selectedUsers = state.users.map((user) => user.id);
    });
  },

  clearSelection: () => {
    set((state) => {
      state.selectedUsers = [];
    });
  },

  // Loading and error actions
  setLoading: (loading: boolean) => {
    set((state) => {
      state.isLoading = loading;
      if (loading) {
        state.error = null;
      }
    });
  },

  setError: (error: string | null) => {
    set((state) => {
      state.error = error;
      state.isLoading = false;
    });
  },

  clearError: () => {
    set((state) => {
      state.error = null;
    });
  },

  // Reset
  reset: () => {
    set((state) => {
      Object.assign(state, initialState);
    });
  },
});

/**
 * User store with persistence and immer middleware
 */
export const useUserStore = create<UserState>()(
  persist(immer(createUserSlice), {
    name: 'musetrip360-user-store',
    // Only persist certain parts of the state
    partialize: (state) => ({
      pagination: state.pagination,
      filters: state.filters,
      selectedUsers: state.selectedUsers,
    }),
    // Skip hydration for SSR compatibility
    skipHydration: true,
  })
);

/**
 * Selector hooks for optimized access to user state
 */
export const useUsersState = () => useUserStore((state) => state.users);
export const useCurrentUserState = () => useUserStore((state) => state.currentUser);
export const usePaginationState = () => useUserStore((state) => state.pagination);
export const useFiltersState = () => useUserStore((state) => state.filters);
export const useSelectedUsersState = () => useUserStore((state) => state.selectedUsers);
export const useUserLoadingState = () => useUserStore((state) => state.isLoading);
export const useUserErrorState = () => useUserStore((state) => state.error);

/**
 * Combined selectors for common use cases
 */
export const useUserListState = () =>
  useUserStore((state) => ({
    users: state.users,
    pagination: state.pagination,
    filters: state.filters,
    isLoading: state.isLoading,
    error: state.error,
    totalUsers: state.totalUsers,
  }));

export const useUserSelectionState = () =>
  useUserStore((state) => ({
    selectedUsers: state.selectedUsers,
    hasSelection: state.selectedUsers.length > 0,
    selectedCount: state.selectedUsers.length,
    allSelected: state.selectedUsers.length === state.users.length,
  }));
