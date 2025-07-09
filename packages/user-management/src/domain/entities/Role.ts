/**
 * @fileoverview Role Entity
 *
 * Domain entity representing a user role with permissions and metadata.
 * Implements core business logic for role management.
 */

import { Permission, PermissionData, ResourceGroup } from '../value-objects/Permission';

export interface RoleData {
  id: string;
  name: string;
  description: string;
  permissions: PermissionData[];
  isActive: boolean;
}

/**
 * Role entity representing a collection of permissions that can be assigned to users
 */
export class Role {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string = '',
    public readonly isActive: boolean,
    public readonly permissions: Permission[] = []
  ) {
    this.validateRole();
  }

  /**
   * Validate role data
   */
  private validateRole(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('Role ID is required');
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Role name is required');
    }

    if (this.name.length > 100) {
      throw new Error('Role name cannot exceed 100 characters');
    }

    if (this.description.length > 500) {
      throw new Error('Role description cannot exceed 500 characters');
    }
  }

  /**
   * Check if role has a specific permission
   */
  public hasPermission(permission: string): boolean {
    return this.permissions.some((p) => p.name === permission);
  }

  /**
   * Check if role has permission for a specific resource and action
   */
  public hasResourcePermission(resourceGroup: ResourceGroup): boolean {
    return this.permissions.some((p) => p.resourceGroup === resourceGroup);
  }

  /**
   * Get all permission names
   */
  public getPermissionNames(): string[] {
    return this.permissions.map((p) => p.name);
  }

  /**
   * Create a new role with updated permissions
   */
  public withPermissions(permissions: Permission[]): Role {
    return new Role(this.id, this.name, this.description, this.isActive, permissions);
  }

  /**
   * Create a new role with updated name
   */
  public withName(name: string): Role {
    return new Role(this.id, name, this.description, this.isActive, this.permissions);
  }

  /**
   * Create a new role with updated description
   */
  public withDescription(description: string): Role {
    return new Role(this.id, this.name, description, this.isActive, this.permissions);
  }

  /**
   * Convert to plain object for serialization
   */
  public toObject(): {
    id: string;
    name: string;
    description: string;
    permissions: Array<{
      id: string;
      name: string;
      description: string;
      resourceGroup: ResourceGroup;
    }>;
    isActive: boolean;
  } {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      permissions: this.permissions.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? '',
        resourceGroup: p.resourceGroup,
      })),
      isActive: this.isActive,
    };
  }

  /**
   * Create Role from plain object
   */
  public static fromObject(obj: {
    id: string;
    name: string;
    description?: string;
    permissions?: Array<{
      id: string;
      name: string;
      description?: string;
      resourceGroup: ResourceGroup;
    }>;
    isActive: boolean;
  }): Role {
    const permissions =
      obj.permissions?.map((p) => new Permission(p.id, p.name, p.description ?? '', p.resourceGroup)) || [];

    return new Role(obj.id, obj.name, obj.description || '', obj.isActive, permissions);
  }

  /**
   * Compare two roles for equality
   */
  public equals(other: Role): boolean {
    return this.id === other.id;
  }

  /**
   * Get role display name
   */
  public getDisplayName(): string {
    return this.name;
  }

  /**
   * Get role summary
   */
  public getSummary(): string {
    return `${this.name} (${this.permissions.length} permission${this.permissions.length !== 1 ? 's' : ''})`;
  }
}
