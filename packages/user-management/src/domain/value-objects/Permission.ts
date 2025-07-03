export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'view' | 'admin';
export type ResourceGroup = 'museum' | 'artifact' | 'event' | 'user' | 'tour' | 'role' | 'system';

export interface PermissionData {
  id: string;
  name: string;
  description: string | null;
  resourceGroup: ResourceGroup;
  isActive: boolean;
}

export class Permission {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly resourceGroup: ResourceGroup,
    public readonly isActive: boolean = true
  ) {
    if (!id?.trim()) {
      throw new Error('Permission ID is required');
    }
    if (!name?.trim()) {
      throw new Error('Permission name is required');
    }
  }

  toJSON(): PermissionData {
    return {
      id: this.id,
      name: this.name,
      description: this.description ?? '',
      resourceGroup: this.resourceGroup,
      isActive: this.isActive,
    };
  }

  static fromData(data: PermissionData): Permission {
    return new Permission(data.id, data.name, data.description, data.resourceGroup, data.isActive);
  }

  static createStandardPermissions(): Permission[] {
    const permissions: Permission[] = [];
    const resources: ResourceGroup[] = ['museum', 'artifact', 'event', 'user', 'tour', 'role'];
    const actions: PermissionAction[] = ['create', 'read', 'update', 'delete', 'manage', 'admin'];

    for (const resource of resources) {
      for (const action of actions) {
        permissions.push(
          new Permission(
            `${resource}_${action}`,
            `${resource.charAt(0).toUpperCase() + resource.slice(1)} ${action.charAt(0).toUpperCase() + action.slice(1)}`,
            `${action.charAt(0).toUpperCase() + action.slice(1)} permission for ${resource}`,
            resource,
            true
          )
        );
      }
    }

    return permissions;
  }
}
