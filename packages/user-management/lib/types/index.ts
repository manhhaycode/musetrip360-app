/**
 * @fileoverview Shared Type Definitions
 *
 * Common TypeScript types used across the user management package
 */

// API Types - Data Transfer Objects matching the swagger specification
export interface UserCreateDto {
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  status?: string | null;
}

export interface UserUpdateDto {
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  birthDate?: string | null; // ISO date string
  metadata?: any | null;
  isActive?: boolean;
}

export interface UpdateProfileReq {
  fullName?: string | null;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  birthDate?: string | null; // ISO date string
  metadata?: any | null;
}

export interface ChangePasswordReq {
  oldPassword?: string | null;
  newPassword?: string | null;
}

export interface UserRoleFormDto {
  userId: string; // UUID
  roleId: string; // UUID
  museumId?: string | null;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Query Parameters
export interface UserSearchParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface UserAdminSearchParams extends UserSearchParams {
  isActive?: boolean;
}

// UI Component Props Types
export interface UserCardProps {
  user: IUser;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  onViewDetails?: (userId: string) => void;
  className?: string;
}

export interface UserFormProps {
  initialData?: Partial<UserUpdateDto>;
  onSubmit: (data: UserUpdateDto) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export interface IUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  birthDate: string | null;
  authType: 'Email';
  status: 'Active';
  lastLogin: '2025-06-29T04:01:28.673817Z';
}

export type UserWithRole = {
  userId: string;
  roleId: string;
  museumId: string;
  user: IUser;
  role: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
  };
};

// Configuration Types
export interface UserManagementConfig {
  enableEmailVerification: boolean;
  enablePhoneVerification: boolean;
  enablePasswordComplexity: boolean;
  defaultPageSize: number;
  maxPageSize: number;
  allowSelfRegistration: boolean;
  requireAdminApproval: boolean;
}

// Error Types
export interface UserError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

// Utility Types
export type UserAuthType = 'Email' | 'Phone' | 'Google' | 'Facebook' | 'Apple';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Pending';
export type SortDirection = 'asc' | 'desc';
export type UserSortField = 'fullName' | 'email' | 'createdAt' | 'status';

// Additional search and filter types
export interface UserSearchFilters {
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserStore {
  user: IUser | null;

  // Enhanced token management
  setUser: (user: IUser) => void;
  resetStore: () => void;

  // Hydration support
  hydrate: () => Promise<boolean>;
}
