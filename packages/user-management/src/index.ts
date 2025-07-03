/**
 * @fileoverview MuseTrip360 User Management Package
 *
 * A comprehensive user management solution for the MuseTrip360 museum platform.
 * Provides domain logic, API integration, state management, and UI components
 * for user operations across all platform applications.
 *
 * @version 0.1.0
 * @author MuseTrip360 Team
 */

// Domain Layer - Core business logic
export * from './domain';

// API Layer - React Query integration with backend
export * from './api';

// State Layer - Zustand state management
export * from './state';

// UI Layer - React components for user interfaces
export * from './ui';

// Types - Shared TypeScript definitions
export * from './types';

// Package version and metadata
export const userManagementVersion = '0.1.0';

/**
 * Package feature flags and configuration
 */
export const USER_MANAGEMENT_FEATURES = {
  PROFILE_MANAGEMENT: true,
  ROLE_BASED_ACCESS: true,
  PERMISSION_SYSTEM: true,
  USER_SEARCH: true,
  BULK_OPERATIONS: true,
  AUDIT_LOGGING: true,
} as const;

/**
 * Default configuration for user management operations
 */
export const DEFAULT_USER_CONFIG = {
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  validation: {
    enablePasswordComplexity: true,
    enableEmailVerification: true,
    enablePhoneVerification: false,
  },
  ui: {
    theme: 'default',
    enableDarkMode: true,
    enableAnimations: true,
  },
} as const;
