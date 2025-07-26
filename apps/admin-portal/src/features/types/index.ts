// Base types và enums
export type EntityStatus = 'active' | 'inactive' | 'maintenance' | 'pending' | 'approved' | 'rejected' | 'draft';

export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

// Museum types
export type MuseumCategory =
  | 'history'
  | 'art'
  | 'science'
  | 'ethnology'
  | 'nature'
  | 'military'
  | 'other'
  | 'culture'
  | 'technology';
export type MuseumStatus = 'active' | 'inactive' | 'maintenance' | 'pending' | 'suspended';

export interface Museum extends BaseEntity {
  name: string;
  location: string;
  address?: string;
  category: MuseumCategory;
  status: MuseumStatus;
  visitors?: string; // "120K" format for display
  rating?: number;
  established?: string;
  description?: string;
  imageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  // Additional fields for comprehensive management
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  ticketPrice?: string;
  visitorsCount?: number;
}

// Museum Request/Approval types
export type MuseumRequestStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

export interface MuseumRequest extends BaseEntity {
  name: string;
  description?: string;
  location: string;
  address?: string;
  contact: string;
  email: string;
  phone: string;
  category: MuseumCategory;
  status: MuseumRequestStatus;
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: number; // User ID of reviewer
  rejectionReason?: string;
  documents?: string[]; // Document URLs
  website?: string;
}

// User types
export type UserRole = 'admin' | 'manager' | 'staff' | 'visitor' | 'museum_owner';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  joinDate: string;
  lastLogin: string;
  phoneNumber?: string;
  address?: string;
  museumId?: number; // For museum staff/owners
  permissions?: string[];
  // Additional fields for user management
  phone?: string; // Alias for phoneNumber for compatibility
  bio?: string;
  lastActive?: string; // Alias for lastLogin for compatibility
  museumCount?: number; // For statistics
}

// Role configuration type for dynamic role management
export interface RoleConfig {
  key: UserRole;
  label: string;
  permissions: string[];
  color: {
    bg: string;
    text: string;
    border: string;
  };
  icon?: string;
  priority: number; // For sorting/hierarchy
  className?: string; // For backward compatibility
}

// System Settings types
export type SettingCategory = 'billing' | 'limits' | 'notification' | 'approval' | 'security' | 'general';
export type SettingType = 'string' | 'number' | 'boolean' | 'email' | 'url' | 'json';
export type SettingStatus = 'active' | 'inactive' | 'deprecated';

export interface SystemSetting extends BaseEntity {
  name: string;
  key: string; // Unique identifier for API calls
  description: string;
  value: string;
  defaultValue: string;
  type: SettingType;
  unit?: string;
  category: SettingCategory;
  status: SettingStatus;
  lastModified: string;
  modifiedBy?: number; // User ID
  isRequired?: boolean;
  isEditable?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

// Policy types
export type PolicyType = 'privacy' | 'terms' | 'content' | 'refund' | 'security' | 'billing' | 'operational';
export type PolicyStatus = 'active' | 'draft' | 'archived' | 'review';

export interface Policy extends BaseEntity {
  title: string;
  description: string;
  content?: string; // Full policy content
  summary?: string; // Short summary of the policy
  type: PolicyType;
  status: PolicyStatus;
  version: string;
  lastUpdated: string;
  effectiveDate: string;
  expiryDate?: string;
  author?: number; // User ID
  approvedBy?: number; // User ID
  appliesTo?: ('visitors' | 'museum_owners' | 'staff')[];
  isRequired?: boolean; // Must be accepted by users
}

// Filter and sort types for tables
export interface TableFilter<T = any> {
  key: keyof T;
  value: string | string[];
  operator?: 'eq' | 'ne' | 'in' | 'nin' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte';
}

export interface TableSort<T = any> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export interface TablePagination {
  page: number;
  pageSize: number;
  total?: number;
}

export interface TableState<T = any> {
  filters: TableFilter<T>[];
  sorting: TableSort<T>[];
  pagination: TablePagination;
  globalFilter?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

// Dashboard analytics types
export interface VisitorTrend {
  period: string;
  visitors: number;
  tourVirtual: number;
  directVisit: number;
  x: number;
  y: number;
}

export interface MuseumCategoryStats {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

export interface RegionStats {
  label: string;
  value: number;
  color: string;
  gradient: string;
}

// Utility types for component props
export interface FilterOption<T = string> {
  label: string;
  value: T;
  count?: number;
  disabled?: boolean;
}

export interface ColumnConfig<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'select' | 'text' | 'date' | 'number';
  filterOptions?: FilterOption[];
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

// Constants for role and status configurations
export const USER_ROLES: Record<UserRole, RoleConfig> = {
  admin: {
    key: 'admin',
    label: 'Admin',
    permissions: ['*'],
    color: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    icon: 'Shield',
    priority: 1,
  },
  manager: {
    key: 'manager',
    label: 'Manager',
    permissions: ['manage_museums', 'manage_staff', 'view_analytics'],
    color: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    icon: 'UserCheck',
    priority: 2,
  },
  staff: {
    key: 'staff',
    label: 'Staff',
    permissions: ['manage_content', 'view_reports'],
    color: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    icon: 'Users',
    priority: 3,
  },
  museum_owner: {
    key: 'museum_owner',
    label: 'Museum Owner',
    permissions: ['manage_own_museum', 'view_own_analytics'],
    color: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    icon: 'Building2',
    priority: 4,
  },
  visitor: {
    key: 'visitor',
    label: 'Visitor',
    permissions: ['view_content'],
    color: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    icon: 'Eye',
    priority: 5,
  },
};

export const MUSEUM_CATEGORIES: Record<MuseumCategory, FilterOption<MuseumCategory>> = {
  history: { label: 'Lịch sử', value: 'history' },
  art: { label: 'Mỹ thuật', value: 'art' },
  science: { label: 'Khoa học', value: 'science' },
  ethnology: { label: 'Dân tộc học', value: 'ethnology' },
  nature: { label: 'Tự nhiên', value: 'nature' },
  military: { label: 'Quân sự', value: 'military' },
  other: { label: 'Khác', value: 'other' },
  culture: { label: 'Văn hóa', value: 'culture' },
  technology: { label: 'Công nghệ', value: 'technology' },
};

export const ENTITY_STATUSES: Record<EntityStatus, FilterOption<EntityStatus>> = {
  active: { label: 'Hoạt động', value: 'active' },
  inactive: { label: 'Không hoạt động', value: 'inactive' },
  maintenance: { label: 'Bảo trì', value: 'maintenance' },
  pending: { label: 'Chờ duyệt', value: 'pending' },
  approved: { label: 'Đã duyệt', value: 'approved' },
  rejected: { label: 'Từ chối', value: 'rejected' },
  draft: { label: 'Bản nháp', value: 'draft' },
};
