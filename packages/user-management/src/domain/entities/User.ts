import { UserAuthType, UserStatus, UserViewModel } from '@/types';
import { Role } from './Role';

export interface UserMetadata {
  lastLoginAt?: Date;
  loginCount?: number;
  preferredLanguage?: string;
  timezone?: string;
  avatarVersion?: number;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  [key: string]: any;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  museumId?: string;
  permissions: UserPermission[];
}

export interface UserPermission {
  id: string;
  name: string;
  description?: string;
  resourceGroup?: string;
  isActive: boolean;
}

export interface UserPrivileges {
  roles: UserRole[];
  permissions: string[];
  canAccessAdmin: boolean;
  canManageMuseum: boolean;
  canManageEvents: boolean;
  canManageUsers: boolean;
  [key: string]: any;
}

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public fullName: string,
    public readonly email: string,
    public phoneNumber: string | null,
    public avatarUrl: string | null,
    public birthDate: Date | null,
    public authType: UserAuthType,
    public status: UserStatus,
    public lastLogin: Date | null,
    public roles: Role[] = [],
    public isEmailVerified: boolean = false
  ) {}

  get displayName(): string {
    return this.fullName || this.email?.split('@')[0] || 'Unknown User';
  }

  get isActive(): boolean {
    return this.status === 'Active';
  }

  get hasAvatar(): boolean {
    return !!this.avatarUrl;
  }

  get age(): number | null {
    if (!this.birthDate) return null;
    const today = new Date();
    const age = today.getFullYear() - this.birthDate.getFullYear();
    const monthDiff = today.getMonth() - this.birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
      return age - 1;
    }
    return age;
  }

  /**
   * Get all permissions as a flat array of strings
   * Compatible with auth-management expectations
   */
  get permissions(): string[] {
    const allPermissions = new Set<string>();

    this.roles.forEach((role) => {
      if (role.isActive) {
        role.permissions.forEach((permission) => {
          if (permission.isActive) {
            allPermissions.add(permission.name);
          }
        });
      }
    });

    return Array.from(allPermissions);
  }

  hasRole(roleName: string): boolean {
    return this.roles.some((role) => role.name === roleName && role.isActive);
  }

  hasPermission(permissionName: string): boolean {
    return this.roles.some(
      (role) =>
        role.isActive &&
        role.permissions.some((permission) => permission.name === permissionName && permission.isActive)
    );
  }

  updateProfile(
    updates: Partial<{
      fullName: string;
      phoneNumber: string;
      avatarUrl: string;
      birthDate: Date;
      metadata: UserMetadata;
    }>
  ): User {
    return new User(
      this.id,
      this.username,
      updates.fullName ?? this.fullName,
      this.email,
      updates.phoneNumber ?? this.phoneNumber,
      updates.avatarUrl ?? this.avatarUrl,
      updates.birthDate ?? this.birthDate,
      this.authType,
      this.status,
      this.lastLogin,
      this.roles,
      this.isEmailVerified
    );
  }

  updateStatus(status: User['status']): User {
    return new User(
      this.id,
      this.username,
      this.fullName,
      this.email,
      this.phoneNumber,
      this.avatarUrl,
      this.birthDate,
      this.authType,
      status,
      this.lastLogin,
      this.roles,
      this.isEmailVerified
    );
  }

  updateEmailVerification(isVerified: boolean): User {
    return new User(
      this.id,
      this.username,
      this.fullName,
      this.email,
      this.phoneNumber,
      this.avatarUrl,
      this.birthDate,
      this.authType,
      this.status,
      this.lastLogin,
      this.roles,
      isVerified
    );
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      avatarUrl: this.avatarUrl,
      birthDate: this.birthDate?.toISOString(),
      authType: this.authType,
      status: this.status,
      lastLogin: this.lastLogin?.toISOString(),
      isEmailVerified: this.isEmailVerified,
      roles: this.roles.map((role) => role.name),
      permissions: this.permissions,
    };
  }

  static fromAPI(data: UserViewModel): User {
    return new User(
      data.id,
      data.username,
      data.fullName,
      data.email,
      data.phoneNumber ?? null,
      data.avatarUrl ?? null,
      data.birthDate ? new Date(data.birthDate) : null,
      data.authType as UserAuthType,
      data.status as UserStatus,
      data.lastLogin ? new Date(data.lastLogin) : null,
      [], // roles would need to be populated separately
      false // isEmailVerified would need to be set separately
    );
  }
}
