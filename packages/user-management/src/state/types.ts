/**
 * @fileoverview State Management Types
 *
 * TypeScript definitions for Zustand store states and actions
 */

import type { StateCreator } from 'zustand';
import type { Permission, Role, User, UserProfile } from '../domain';
import { PaginationParams, UserSearchFilters } from '../types';

/**
 * Base state interface with common loading and error handling
 */
export interface BaseState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * User management state
 */
export interface UserState extends BaseState {
  // Data
  users: User[];
  currentUser: User | null;
  totalUsers: number;

  // Pagination and filtering
  pagination: PaginationParams;
  filters: UserSearchFilters;

  // Selection state
  selectedUsers: string[];

  // Actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
  setCurrentUser: (user: User | null) => void;

  // Pagination actions
  setPagination: (pagination: Partial<PaginationParams>) => void;
  setFilters: (filters: Partial<UserSearchFilters>) => void;

  // Selection actions
  selectUser: (id: string) => void;
  deselectUser: (id: string) => void;
  selectAllUsers: () => void;
  clearSelection: () => void;

  // Loading and error actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  reset: () => void;
}

/**
 * Profile management state
 */
export interface ProfileState extends BaseState {
  // Data
  profile: UserProfile | null;

  // Form state
  isEditing: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Form actions
  setEditing: (editing: boolean) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;
  discardChanges: () => void;

  // Loading and error actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  reset: () => void;
}

/**
 * Role management state
 */
export interface RoleState extends BaseState {
  // Data
  roles: Role[];
  permissions: Permission[];
  userRoles: Record<string, Role[]>; // userId -> roles

  // Actions
  setRoles: (roles: Role[]) => void;
  addRole: (role: Role) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  removeRole: (id: string) => void;

  setPermissions: (permissions: Permission[]) => void;

  setUserRoles: (userId: string, roles: Role[]) => void;
  addUserRole: (userId: string, role: Role) => void;
  removeUserRole: (userId: string, roleId: string) => void;

  // Loading and error actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  reset: () => void;
}

/**
 * Combined state type
 */
export interface UserManagementState {
  user: UserState;
  profile: ProfileState;
  role: RoleState;
}

/**
 * Store slice types for better organization
 */
export type UserStateSlice = StateCreator<UserState, [['zustand/persist', unknown], ['zustand/immer', never]], []>;

export type ProfileStateSlice = StateCreator<
  ProfileState,
  [['zustand/persist', unknown], ['zustand/immer', never]],
  []
>;

export type RoleStateSlice = StateCreator<RoleState, [['zustand/persist', unknown], ['zustand/immer', never]], []>;
