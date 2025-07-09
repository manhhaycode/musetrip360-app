/**
 * @fileoverview API Validation Utilities
 *
 * Comprehensive validation utilities for user management API operations.
 * Provides client-side validation before API calls and response validation.
 */

import type {
  UserCreateDto,
  UserUpdateDto,
  UpdateProfileReq,
  ChangePasswordReq,
  UserRoleFormDto,
  UserSearchParams,
  UserAdminSearchParams,
} from '../../types';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * User creation validation
 */
export function validateUserCreate(data: UserCreateDto): ValidationResult {
  const errors: ValidationError[] = [];

  // Email validation
  if (!data.email) {
    errors.push({
      field: 'email',
      message: 'Email is required',
      code: 'REQUIRED',
    });
  } else if (!isValidEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email format',
      code: 'INVALID_FORMAT',
    });
  }

  // Full name validation
  if (!data.fullName) {
    errors.push({
      field: 'fullName',
      message: 'Full name is required',
      code: 'REQUIRED',
    });
  } else if (data.fullName.trim().length < 2) {
    errors.push({
      field: 'fullName',
      message: 'Full name must be at least 2 characters long',
      code: 'MIN_LENGTH',
    });
  } else if (data.fullName.trim().length > 100) {
    errors.push({
      field: 'fullName',
      message: 'Full name must be less than 100 characters',
      code: 'MAX_LENGTH',
    });
  }

  // Phone number validation (optional)
  if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
    errors.push({
      field: 'phoneNumber',
      message: 'Invalid phone number format',
      code: 'INVALID_FORMAT',
    });
  }

  // Status validation
  if (data.status && !isValidUserStatus(data.status)) {
    errors.push({
      field: 'status',
      message: 'Invalid user status',
      code: 'INVALID_VALUE',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * User update validation
 */
export function validateUserUpdate(data: UserUpdateDto): ValidationResult {
  const errors: ValidationError[] = [];

  // Email validation (if provided)
  if (data.email !== undefined) {
    if (data.email && !isValidEmail(data.email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
        code: 'INVALID_FORMAT',
      });
    }
  }

  // Full name validation (if provided)
  if (data.fullName !== undefined) {
    if (data.fullName && data.fullName.trim().length < 2) {
      errors.push({
        field: 'fullName',
        message: 'Full name must be at least 2 characters long',
        code: 'MIN_LENGTH',
      });
    } else if (data.fullName && data.fullName.trim().length > 100) {
      errors.push({
        field: 'fullName',
        message: 'Full name must be less than 100 characters',
        code: 'MAX_LENGTH',
      });
    }
  }

  // Phone number validation (if provided)
  if (data.phoneNumber !== undefined && data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
    errors.push({
      field: 'phoneNumber',
      message: 'Invalid phone number format',
      code: 'INVALID_FORMAT',
    });
  }

  // Avatar URL validation (if provided)
  if (data.avatarUrl !== undefined && data.avatarUrl && !isValidURL(data.avatarUrl)) {
    errors.push({
      field: 'avatarUrl',
      message: 'Invalid avatar URL format',
      code: 'INVALID_FORMAT',
    });
  }

  // Birth date validation (if provided)
  if (data.birthDate !== undefined && data.birthDate && !isValidBirthDate(data.birthDate)) {
    errors.push({
      field: 'birthDate',
      message: 'Invalid birth date',
      code: 'INVALID_DATE',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Profile update validation
 */
export function validateProfileUpdate(data: UpdateProfileReq): ValidationResult {
  const errors: ValidationError[] = [];

  // Full name validation (if provided)
  if (data.fullName !== undefined) {
    if (data.fullName && data.fullName.trim().length < 2) {
      errors.push({
        field: 'fullName',
        message: 'Full name must be at least 2 characters long',
        code: 'MIN_LENGTH',
      });
    } else if (data.fullName && data.fullName.trim().length > 100) {
      errors.push({
        field: 'fullName',
        message: 'Full name must be less than 100 characters',
        code: 'MAX_LENGTH',
      });
    }
  }

  // Phone number validation (if provided)
  if (data.phoneNumber !== undefined && data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
    errors.push({
      field: 'phoneNumber',
      message: 'Invalid phone number format',
      code: 'INVALID_FORMAT',
    });
  }

  // Avatar URL validation (if provided)
  if (data.avatarUrl !== undefined && data.avatarUrl && !isValidURL(data.avatarUrl)) {
    errors.push({
      field: 'avatarUrl',
      message: 'Invalid avatar URL format',
      code: 'INVALID_FORMAT',
    });
  }

  // Birth date validation (if provided)
  if (data.birthDate !== undefined && data.birthDate && !isValidBirthDate(data.birthDate)) {
    errors.push({
      field: 'birthDate',
      message: 'Invalid birth date',
      code: 'INVALID_DATE',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Password change validation
 */
export function validatePasswordChange(data: ChangePasswordReq): ValidationResult {
  const errors: ValidationError[] = [];

  // Old password validation
  if (!data.oldPassword) {
    errors.push({
      field: 'oldPassword',
      message: 'Current password is required',
      code: 'REQUIRED',
    });
  }

  // New password validation
  if (!data.newPassword) {
    errors.push({
      field: 'newPassword',
      message: 'New password is required',
      code: 'REQUIRED',
    });
  } else {
    const passwordValidation = validatePasswordStrength(data.newPassword);
    if (!passwordValidation.isValid) {
      errors.push(
        ...passwordValidation.errors.map((error) => ({
          ...error,
          field: 'newPassword',
        }))
      );
    }
  }

  // Check if new password is different from old password
  if (data.oldPassword && data.newPassword && data.oldPassword === data.newPassword) {
    errors.push({
      field: 'newPassword',
      message: 'New password must be different from current password',
      code: 'SAME_AS_OLD',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * User role form validation
 */
export function validateUserRoleForm(data: UserRoleFormDto): ValidationResult {
  const errors: ValidationError[] = [];

  // User ID validation
  if (!data.userId) {
    errors.push({
      field: 'userId',
      message: 'User ID is required',
      code: 'REQUIRED',
    });
  } else if (!isValidUUID(data.userId)) {
    errors.push({
      field: 'userId',
      message: 'Invalid user ID format',
      code: 'INVALID_FORMAT',
    });
  }

  // Role ID validation
  if (!data.roleId) {
    errors.push({
      field: 'roleId',
      message: 'Role ID is required',
      code: 'REQUIRED',
    });
  } else if (!isValidUUID(data.roleId)) {
    errors.push({
      field: 'roleId',
      message: 'Invalid role ID format',
      code: 'INVALID_FORMAT',
    });
  }

  // Museum ID validation (optional)
  if (data.museumId && !isValidUUID(data.museumId)) {
    errors.push({
      field: 'museumId',
      message: 'Invalid museum ID format',
      code: 'INVALID_FORMAT',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Search parameters validation
 */
export function validateSearchParams(data: UserSearchParams): ValidationResult {
  const errors: ValidationError[] = [];

  // Page validation
  if (data.page !== undefined && (data.page < 1 || !Number.isInteger(data.page))) {
    errors.push({
      field: 'page',
      message: 'Page must be a positive integer',
      code: 'INVALID_VALUE',
    });
  }

  // Page size validation
  if (data.pageSize !== undefined) {
    if (data.pageSize < 1 || data.pageSize > 100 || !Number.isInteger(data.pageSize)) {
      errors.push({
        field: 'pageSize',
        message: 'Page size must be between 1 and 100',
        code: 'INVALID_RANGE',
      });
    }
  }

  // Search term validation
  if (data.search !== undefined && data.search.length > 100) {
    errors.push({
      field: 'search',
      message: 'Search term must be less than 100 characters',
      code: 'MAX_LENGTH',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Admin search parameters validation
 */
export function validateAdminSearchParams(data: UserAdminSearchParams): ValidationResult {
  const baseValidation = validateSearchParams(data);

  // No additional validation needed for admin search params currently
  return baseValidation;
}

/**
 * Password strength validation
 */
export function validatePasswordStrength(password: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters long',
      code: 'MIN_LENGTH',
    });
  }

  if (password.length > 128) {
    errors.push({
      field: 'password',
      message: 'Password must be less than 128 characters',
      code: 'MAX_LENGTH',
    });
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one lowercase letter',
      code: 'MISSING_LOWERCASE',
    });
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one uppercase letter',
      code: 'MISSING_UPPERCASE',
    });
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push({
      field: 'password',
      message: 'Password must contain at least one number',
      code: 'MISSING_NUMBER',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Helper validation functions

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function isValidPhoneNumber(phone: string): boolean {
  // Basic international phone number validation
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(cleanPhone);
}

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidBirthDate(dateString: string): boolean {
  const date = new Date(dateString);
  const currentDate = new Date();
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(currentDate.getFullYear() - 100);

  return !isNaN(date.getTime()) && date <= currentDate && date >= hundredYearsAgo;
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

function isValidUserStatus(status: string): boolean {
  const validStatuses = ['active', 'inactive', 'pending', 'suspended', 'banned'];
  return validStatuses.includes(status);
}

/**
 * Batch validation utilities
 */
export const batchValidators = {
  /**
   * Validate multiple user creation requests
   */
  validateBatchUserCreate: (
    data: UserCreateDto[]
  ): {
    isValid: boolean;
    results: ValidationResult[];
    hasErrors: boolean;
  } => {
    const results = data.map(validateUserCreate);
    const hasErrors = results.some((result) => !result.isValid);

    return {
      isValid: !hasErrors,
      results,
      hasErrors,
    };
  },

  /**
   * Validate multiple role assignments
   */
  validateBatchRoleAssignment: (
    data: UserRoleFormDto[]
  ): {
    isValid: boolean;
    results: ValidationResult[];
    hasErrors: boolean;
  } => {
    const results = data.map(validateUserRoleForm);
    const hasErrors = results.some((result) => !result.isValid);

    return {
      isValid: !hasErrors,
      results,
      hasErrors,
    };
  },
};
