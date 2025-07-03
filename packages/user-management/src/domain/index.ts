/**
 * @fileoverview Domain Layer Exports
 *
 * Exports all domain entities, value objects, and services for user management.
 * This layer contains the core business logic and rules.
 */

// Entities
export { User, type UserMetadata, type UserRole, type UserPermission, type UserPrivileges } from './entities/User';
export { Role } from './entities/Role';

// Value Objects
export * from './value-objects';
