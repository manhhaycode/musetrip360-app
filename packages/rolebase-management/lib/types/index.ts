/**
 * @fileoverview Rolebase Management Types
 *
 * Type definitions for rolebase management operations,
 * exhibitions, and devices.
 */

export type Role = {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  permissions?: Permission[];
};

export type CreateRole = Omit<Role, 'id' | 'isActive'>;
export type UpdateRole = Partial<CreateRole> & { id: string };

export type Permission = {
  id: string;
  name: string;
  description?: string;
  resourceGroup: string;
  isActive: boolean;
};

export type CreatePermission = Omit<Permission, 'id' | 'isActive'>;
export type UpdatePermission = Partial<CreatePermission> & { id: string };

export type UpdateRolePermissions = {
  addList: string[];
  removeList: string[];
};

export type UserPrivilege = {
  [key: string]: boolean;
};
