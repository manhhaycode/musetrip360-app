/**
 * @fileoverview User State Management Hooks
 *
 * Combined hooks that integrate API operations with state management
 * for seamless user data handling.
 */

import { useCallback } from 'react';
import { useUserStore } from '../stores/userStore';
import { useUsers, useCreateUser, useUpdateUser } from '../../api/hooks/useUsers';
import { User } from '../../domain';
import type { UserCreateDto, UserUpdateDto, UserSearchFilters } from '../../types';

/**
 * Combined hook for user management with API integration
 */
export const useUserManagement = () => {
  const store = useUserStore();

  // API hooks
  const usersQuery = useUsers({
    page: store.pagination.page,
    pageSize: store.pagination.limit,
    ...store.filters,
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Sync API data with store
  const syncUsers = useCallback(
    (users: User[], total: number) => {
      store.setUsers(users);
      store.setPagination({
        ...store.pagination,
        total,
        totalPages: Math.ceil(total / store.pagination.limit),
      });
    },
    [store]
  );

  // Combined operations
  const createUser = useCallback(
    async (userData: UserCreateDto) => {
      try {
        store.setLoading(true);
        const newUser = await createUserMutation.mutateAsync(userData);
        store.addUser(User.fromAPI(newUser));
        store.setError(null);
        return newUser;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
        store.setError(errorMessage);
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store, createUserMutation]
  );

  const updateUser = useCallback(
    async (id: string, updates: UserUpdateDto) => {
      try {
        store.setLoading(true);
        const updatedUser = await updateUserMutation.mutateAsync({ id, userData: updates });
        store.updateUser(id, User.fromAPI(updatedUser));
        store.setError(null);
        return updatedUser;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
        store.setError(errorMessage);
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [store, updateUserMutation]
  );

  const searchUsers = useCallback(
    async (filters: UserSearchFilters) => {
      store.setFilters(filters);
      // The search query will automatically refetch due to dependency on filters
    },
    [store]
  );

  const refetch = useCallback(() => {
    usersQuery.refetch();
  }, [usersQuery]);

  return {
    // State
    users: store.users,
    currentUser: store.currentUser,
    pagination: store.pagination,
    filters: store.filters,
    selectedUsers: store.selectedUsers,
    isLoading: store.isLoading || usersQuery.isLoading,
    error: store.error || usersQuery.error?.message,

    // Actions
    createUser,
    updateUser,
    searchUsers,
    refetch,

    // Store actions
    setCurrentUser: store.setCurrentUser,
    setPagination: store.setPagination,
    setFilters: store.setFilters,
    selectUser: store.selectUser,
    deselectUser: store.deselectUser,
    selectAllUsers: store.selectAllUsers,
    clearSelection: store.clearSelection,
    clearError: store.clearError,
    reset: store.reset,

    // Utilities
    syncUsers,
    hasSelection: store.selectedUsers.length > 0,
    selectedCount: store.selectedUsers.length,
    allSelected: store.selectedUsers.length === store.users.length,
  };
};

/**
 * Hook for user list operations
 */
export const useUserList = () => {
  const { users, pagination, filters, isLoading, error, setPagination, setFilters, refetch } = useUserManagement();

  const goToPage = useCallback(
    (page: number) => {
      setPagination({ page });
    },
    [setPagination]
  );

  const changePageSize = useCallback(
    (limit: number) => {
      setPagination({ limit, page: 1 });
    },
    [setPagination]
  );

  const applyFilters = useCallback(
    (newFilters: Partial<UserSearchFilters>) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      role: '',
      status: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [setFilters]);

  return {
    users,
    pagination,
    filters,
    isLoading,
    error,
    goToPage,
    changePageSize,
    applyFilters,
    clearFilters,
    refetch,
  };
};

/**
 * Hook for user selection operations
 */
export const useUserSelection = () => {
  const { selectedUsers, users, selectUser, deselectUser, selectAllUsers, clearSelection } = useUserManagement();

  const isSelected = useCallback(
    (userId: string) => {
      return selectedUsers.includes(userId);
    },
    [selectedUsers]
  );

  const toggleSelection = useCallback(
    (userId: string) => {
      if (isSelected(userId)) {
        deselectUser(userId);
      } else {
        selectUser(userId);
      }
    },
    [isSelected, selectUser, deselectUser]
  );

  const toggleSelectAll = useCallback(() => {
    if (selectedUsers.length === users.length) {
      clearSelection();
    } else {
      selectAllUsers();
    }
  }, [selectedUsers.length, users.length, clearSelection, selectAllUsers]);

  return {
    selectedUsers,
    hasSelection: selectedUsers.length > 0,
    selectedCount: selectedUsers.length,
    allSelected: selectedUsers.length === users.length,
    isSelected,
    selectUser,
    deselectUser,
    toggleSelection,
    selectAllUsers,
    clearSelection,
    toggleSelectAll,
  };
};
