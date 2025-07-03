/**
 * @fileoverview Profile Store
 *
 * Zustand store for managing user profile state including editing,
 * form management, and profile updates.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../../domain';
import type { ProfileState, ProfileStateSlice } from '../types';

/**
 * Initial state for profile management
 */
const initialState: Omit<ProfileState, keyof ProfileStateActions> = {
  // Data
  profile: null,

  // Form state
  isEditing: false,
  hasUnsavedChanges: false,

  // Base state
  isLoading: false,
  error: null,
  lastUpdated: null,
};

/**
 * Type for profile state actions
 */
type ProfileStateActions = Pick<
  ProfileState,
  | 'setProfile'
  | 'updateProfile'
  | 'setEditing'
  | 'setUnsavedChanges'
  | 'discardChanges'
  | 'setLoading'
  | 'setError'
  | 'clearError'
  | 'reset'
>;

/**
 * Create profile store slice
 */
const createProfileSlice: ProfileStateSlice = (set) => ({
  ...initialState,

  // Data actions
  setProfile: (profile: UserProfile | null) => {
    set((state) => {
      state.profile = profile;
      state.lastUpdated = new Date();
      state.hasUnsavedChanges = false;
      return state;
    });
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    set((state) => {
      if (state.profile) {
        state.profile = state.profile.updateProfile(updates);
        state.hasUnsavedChanges = true;
        state.lastUpdated = new Date();
      }
      return state;
    });
  },

  // Form actions
  setEditing: (editing: boolean) => {
    set((state) => {
      state.isEditing = editing;
      if (!editing) {
        state.hasUnsavedChanges = false;
      }
      return state;
    });
  },

  setUnsavedChanges: (hasChanges: boolean) => {
    set((state) => {
      state.hasUnsavedChanges = hasChanges;
      return state;
    });
  },

  discardChanges: () => {
    set((state) => {
      state.hasUnsavedChanges = false;
      state.isEditing = false;
      return state;
    });
  },

  // Loading and error actions
  setLoading: (loading: boolean) => {
    set((state) => {
      state.isLoading = loading;
      if (loading) {
        state.error = null;
      }
      return state;
    });
  },

  setError: (error: string | null) => {
    set((state) => {
      state.error = error;
      state.isLoading = false;
      return state;
    });
  },

  clearError: () => {
    set((state) => {
      state.error = null;
      return state;
    });
  },

  // Reset
  reset: () => {
    set((state) => {
      Object.assign(state, initialState);
      return state;
    });
  },
});

/**
 * Profile store with persistence and immer middleware
 */
export const useProfileStore = create<ProfileState>()(
  persist(immer(createProfileSlice), {
    name: 'musetrip360-profile-store',
    // Only persist non-sensitive profile data
    partialize: (state) => ({
      isEditing: state.isEditing,
      hasUnsavedChanges: state.hasUnsavedChanges,
    }),
    skipHydration: true,
  })
);

/**
 * Selector hooks for optimized access to profile state
 */
export const useIsEditingState = () => useProfileStore((state) => state.isEditing);
export const useHasUnsavedChangesState = () => useProfileStore((state) => state.hasUnsavedChanges);
export const useProfileLoadingState = () => useProfileStore((state) => state.isLoading);
export const useProfileError = () => useProfileStore((state) => state.error);

/**
 * Combined selectors for common use cases
 */
export const useProfileState = () =>
  useProfileStore((state) => ({
    profile: state.profile,
    isEditing: state.isEditing,
    hasUnsavedChanges: state.hasUnsavedChanges,
    isLoading: state.isLoading,
    error: state.error,
  }));

export const useProfileFormState = () =>
  useProfileStore((state) => ({
    isEditing: state.isEditing,
    hasUnsavedChanges: state.hasUnsavedChanges,
    canSave: state.hasUnsavedChanges && !state.error,
  }));
