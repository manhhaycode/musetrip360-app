/**
 * @fileoverview Data Transformers
 *
 * Utilities for transforming data between domain entities and API DTOs.
 * Handles conversion between internal domain models and external API formats.
 */

import { User } from '../../domain/entities/User';
import type {
  UserViewModel,
  UserCreateDto,
  UserUpdateDto,
  UpdateProfileReq,
  PaginatedResponse,
  UserPermissions,
} from '../../types';
import { Permission, Role } from '../../domain';

/**
 * Transform User domain entity to UserViewModel for UI display
 */
export function transformUserToViewModel(user: User): UserViewModel {
  const userData = user.toJSON();

  return {
    id: userData.id,
    email: userData.email,
    fullName: userData.fullName,
    username: userData.username,
    phoneNumber: userData.phoneNumber,
    avatarUrl: userData.avatarUrl,
    birthDate: userData.birthDate,
    status: userData.status,
    authType: userData.authType,
    lastLogin: userData.lastLogin,
  };
}

/**
 * Transform array of User entities to UserViewModel array
 */
export function transformUsersToViewModels(users: User[]): UserViewModel[] {
  return users.map(transformUserToViewModel);
}

/**
 * Transform API response data to User domain entity
 */
export function transformApiDataToUser(apiData: any): User {
  return new User(
    apiData.id,
    apiData.username,
    apiData.fullName,
    apiData.email,
    apiData.phoneNumber,
    apiData.avatarUrl,
    apiData.birthDate ? new Date(apiData.birthDate) : null,
    apiData.authType,
    apiData.status,
    apiData.lastLogin ? new Date(apiData.lastLogin) : null
  );
}

/**
 * Transform UserCreateDto to domain-compatible data
 */
export function transformCreateDtoToUserData(dto: UserCreateDto): {
  email: string;
  fullName: string;
  phoneNumber?: string;
  status?: User['status'];
} {
  return {
    email: dto.email || '',
    fullName: dto.fullName || '',
    phoneNumber: dto.phoneNumber || undefined,
    status: (dto.status as User['status']) || 'active',
  };
}

/**
 * Transform UserUpdateDto to partial user data for updates
 */
export function transformUpdateDtoToUserData(dto: UserUpdateDto): Partial<{
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  birthDate: Date;
  metadata: Record<string, any>;
}> {
  const result: any = {};

  if (dto.fullName !== undefined) result.fullName = dto.fullName;
  if (dto.email !== undefined) result.email = dto.email;
  if (dto.phoneNumber !== undefined) result.phoneNumber = dto.phoneNumber;
  if (dto.avatarUrl !== undefined) result.avatarUrl = dto.avatarUrl;
  if (dto.birthDate !== undefined) result.birthDate = dto.birthDate ? new Date(dto.birthDate) : undefined;
  if (dto.metadata !== undefined) result.metadata = dto.metadata;

  return result;
}

/**
 * Transform UpdateProfileReq to UserProfile data
 */
export function transformProfileReqToProfileData(req: UpdateProfileReq): Partial<{
  fullName: string;
  phoneNumber: string;
  avatarUrl: string;
  birthDate: Date;
  metadata: Record<string, any>;
}> {
  const result: any = {};

  if (req.fullName !== undefined) result.fullName = req.fullName;
  if (req.phoneNumber !== undefined) result.phoneNumber = req.phoneNumber;
  if (req.avatarUrl !== undefined) result.avatarUrl = req.avatarUrl;
  if (req.birthDate !== undefined) result.birthDate = req.birthDate ? new Date(req.birthDate) : undefined;
  if (req.metadata !== undefined) result.metadata = req.metadata;

  return result;
}

/**
 * Transform domain User to API response format
 */
export function transformUserToApiResponse(user: User): any {
  const userData = user.toJSON();

  return {
    id: userData.id,
    email: userData.email,
    fullName: userData.fullName,
    phoneNumber: userData.phoneNumber,
    avatarUrl: userData.avatarUrl,
    birthDate: userData.birthDate,
    status: userData.status,
    isEmailVerified: userData.isEmailVerified,
    isPhoneVerified: userData.isPhoneVerified,
    metadata: userData.metadata,
    roles: userData.roles,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
  };
}

/**
 * Transform paginated API response
 */
export function transformPaginatedResponse<T, U>(
  apiResponse: any,
  transformItem: (item: T) => U
): PaginatedResponse<U> {
  return {
    data: apiResponse.data?.map(transformItem) || [],
    page: apiResponse.page || 1,
    pageSize: apiResponse.pageSize || 20,
    totalCount: apiResponse.totalCount || 0,
    totalPages: apiResponse.totalPages || 0,
  };
}

/**
 * Transform role data from API to Role interface
 */
export function transformApiRoleToRole(apiRole: any): Role {
  return new Role(
    apiRole.id,
    apiRole.name,
    apiRole.description,
    apiRole.isActive,
    apiRole.permissions?.map((p: any) => new Permission(p.id, p.name, p.description, p.resourceGroup, p.isActive)) || []
  );
}

/**
 * Transform user permissions from API to UserPermissions interface
 */
export function transformApiPermissionsToUserPermissions(apiPermissions: any): UserPermissions {
  return {
    roles: apiPermissions.roles?.map(transformApiRoleToRole) || [],
    permissions: apiPermissions.permissions || [],
    canAccessAdmin: apiPermissions.canAccessAdmin || false,
    canManageMuseum: apiPermissions.canManageMuseum || false,
    canManageEvents: apiPermissions.canManageEvents || false,
    canManageUsers: apiPermissions.canManageUsers || false,
  };
}

/**
 * Convert Date object to API-compatible ISO string
 */
export function dateToApiString(date: Date | undefined | null): string | null {
  if (!date) return null;
  return date.toISOString();
}

/**
 * Convert API date string to Date object
 */
export function apiStringToDate(dateString: string | undefined | null): Date | undefined {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? undefined : date;
}

/**
 * Safely transform metadata
 */
export function transformMetadata(metadata: any): Record<string, any> | undefined {
  if (!metadata || typeof metadata !== 'object') return undefined;

  try {
    // Ensure metadata is a plain object and doesn't contain circular references
    return JSON.parse(JSON.stringify(metadata));
  } catch {
    return undefined;
  }
}

/**
 * Transform search/filter parameters for API
 */
export function transformSearchParams(params: {
  search?: string;
  page?: number;
  pageSize?: number;
  [key: string]: any;
}): Record<string, string | number> {
  const apiParams: Record<string, string | number> = {};

  if (params.search) apiParams.Search = params.search;
  if (params.page) apiParams.Page = params.page;
  if (params.pageSize) apiParams.PageSize = params.pageSize;

  // Transform any additional parameters
  Object.entries(params).forEach(([key, value]) => {
    if (key !== 'search' && key !== 'page' && key !== 'pageSize' && value !== undefined) {
      // Convert camelCase to PascalCase for API
      const apiKey = key.charAt(0).toUpperCase() + key.slice(1);
      apiParams[apiKey] = value;
    }
  });

  return apiParams;
}

/**
 * Validation helpers for transformed data
 */
export const transformValidators = {
  /**
   * Validate that required fields are present after transformation
   */
  validateRequiredFields: <T extends Record<string, any>>(
    data: T,
    requiredFields: (keyof T)[]
  ): { isValid: boolean; missingFields: string[] } => {
    const missingFields = requiredFields.filter(
      (field) => data[field] === undefined || data[field] === null || data[field] === ''
    );

    return {
      isValid: missingFields.length === 0,
      missingFields: missingFields.map(String),
    };
  },

  /**
   * Validate email format after transformation
   */
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate UUID format
   */
  validateUUID: (uuid: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  },
};
