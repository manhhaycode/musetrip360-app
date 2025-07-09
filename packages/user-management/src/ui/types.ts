/**
 * @fileoverview UI Component Types
 *
 * TypeScript definitions for UI components and their props
 */

import type { User, UserProfile, Role, Permission } from '../domain';
import type { UserCreateDto, UserUpdateDto, UpdateProfileReq, ChangePasswordReq } from '../types';

/**
 * Base component props
 */
export interface BaseComponentProps {
  className?: string;
  disabled?: boolean;
}

/**
 * User form component props
 */
export interface UserFormProps extends BaseComponentProps {
  user?: User;
  onSubmit: (data: UserCreateDto | UserUpdateDto) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Profile form component props
 */
export interface ProfileFormProps extends BaseComponentProps {
  profile?: UserProfile;
  onSubmit: (data: UpdateProfileReq) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Password change form props
 */
export interface PasswordChangeFormProps extends BaseComponentProps {
  onSubmit: (data: ChangePasswordReq) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Role assignment form props
 */
export interface RoleAssignmentFormProps extends BaseComponentProps {
  userId: string;
  currentRoles: Role[];
  availableRoles: Role[];
  onSubmit: (roles: Role[]) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * User table component props
 */
export interface UserTableProps extends BaseComponentProps {
  users: User[];
  onUserSelect?: (user: User) => void;
  onUserEdit?: (user: User) => void;
  onUserDelete?: (user: User) => void;
  onRoleAssign?: (user: User) => void;
  selectedUsers?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * User list component props
 */
export interface UserListProps extends BaseComponentProps {
  users: User[];
  onUserClick?: (user: User) => void;
  onUserEdit?: (user: User) => void;
  onUserDelete?: (user: User) => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * User card component props
 */
export interface UserCardProps extends BaseComponentProps {
  user: User;
  onClick?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onRoleAssign?: (user: User) => void;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
}

/**
 * Modal component props
 */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * User form modal props
 */
export interface UserFormModalProps extends Omit<ModalProps, 'children'> {
  user?: User;
  onSubmit: (data: UserCreateDto | UserUpdateDto) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Delete confirmation modal props
 */
export interface DeleteConfirmModalProps extends Omit<ModalProps, 'children'> {
  user: User;
  onConfirm: (user: User) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Role assignment modal props
 */
export interface RoleAssignModalProps extends Omit<ModalProps, 'children'> {
  user: User;
  currentRoles: Role[];
  availableRoles: Role[];
  onSubmit: (roles: Role[]) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Password change modal props
 */
export interface PasswordChangeModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: ChangePasswordReq) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Filter component props
 */
export interface FilterProps extends BaseComponentProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * User filters component props
 */
export interface UserFiltersProps extends BaseComponentProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  onClear: () => void;
  availableRoles?: Role[];
}

/**
 * User search component props
 */
export interface UserSearchProps extends BaseComponentProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

/**
 * User detail component props
 */
export interface UserDetailProps extends BaseComponentProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onRoleAssign?: (user: User) => void;
}

/**
 * User profile component props
 */
export interface UserProfileProps extends BaseComponentProps {
  profile: UserProfile;
  onEdit?: () => void;
  isEditable?: boolean;
}

/**
 * User roles component props
 */
export interface UserRolesProps extends BaseComponentProps {
  userId: string;
  roles: Role[];
  onRoleAdd?: (role: Role) => void;
  onRoleRemove?: (roleId: string) => void;
  isEditable?: boolean;
}

/**
 * User permissions component props
 */
export interface UserPermissionsProps extends BaseComponentProps {
  permissions: Permission[];
  groupByCategory?: boolean;
}

/**
 * Layout component props
 */
export interface UserManagementLayoutProps extends BaseComponentProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

/**
 * Dashboard component props
 */
export interface UserDashboardProps extends BaseComponentProps {
  onCreateUser?: () => void;
  onImportUsers?: () => void;
  onExportUsers?: () => void;
}

/**
 * Sidebar component props
 */
export interface UserSidebarProps extends BaseComponentProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

/**
 * Toast notification props
 */
export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

/**
 * Toast container props
 */
export interface ToastContainerProps extends BaseComponentProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Provider component props
 */
export interface UserManagementProviderProps {
  children: React.ReactNode;
  config?: {
    enableBulkOperations?: boolean;
    enableRoleManagement?: boolean;
    enableProfileManagement?: boolean;
    maxPageSize?: number;
  };
}

/**
 * UI hook return types
 */
export interface UseUserManagementUIReturn {
  // Modal states
  modals: {
    userForm: { isOpen: boolean; user?: User };
    deleteConfirm: { isOpen: boolean; user?: User };
    roleAssign: { isOpen: boolean; user?: User };
    passwordChange: { isOpen: boolean };
  };

  // Modal actions
  openUserFormModal: (user?: User) => void;
  closeUserFormModal: () => void;
  openDeleteConfirmModal: (user: User) => void;
  closeDeleteConfirmModal: () => void;
  openRoleAssignModal: (user: User) => void;
  closeRoleAssignModal: () => void;
  openPasswordChangeModal: () => void;
  closePasswordChangeModal: () => void;

  // View states
  currentView: 'table' | 'list' | 'grid';
  setCurrentView: (view: 'table' | 'list' | 'grid') => void;

  // Notification functions
  showToast: (type: ToastProps['type'], message: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}
