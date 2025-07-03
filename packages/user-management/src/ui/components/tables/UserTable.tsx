/**
 * @fileoverview User Table Component
 *
 * A comprehensive table component for displaying and managing users
 * with sorting, selection, and bulk operations.
 */

import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@musetrip360/ui-core';
import { Button, Checkbox, Badge, Avatar } from '@musetrip360/ui-core';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@musetrip360/ui-core';
import { MoreHorizontal, Edit, Trash2, Shield, Mail, Phone } from 'lucide-react';
import { clsx } from 'clsx';
import type { UserTableProps } from '../../types';
import type { User } from '../../../domain';

/**
 * Get status badge variant based on user status
 */
const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'default';
    case 'inactive':
      return 'secondary';
    case 'suspended':
      return 'destructive';
    case 'pending':
      return 'outline';
    default:
      return 'secondary';
  }
};

/**
 * Format user creation date
 */
const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * UserTable Component
 */
export const UserTable: React.FC<UserTableProps> = ({
  users,
  onUserSelect,
  onUserEdit,
  onUserDelete,
  onRoleAssign,
  selectedUsers = [],
  onSelectionChange,
  isLoading = false,
  error,
  className,
  disabled = false,
}) => {
  // Calculate selection state
  const isAllSelected = useMemo(() => {
    return users.length > 0 && selectedUsers.length === users.length;
  }, [users.length, selectedUsers.length]);

  // Handle select all
  const handleSelectAll = () => {
    if (onSelectionChange) {
      if (isAllSelected) {
        onSelectionChange([]);
      } else {
        onSelectionChange(users.map((user) => user.id));
      }
    }
  };

  // Handle individual selection
  const handleSelectUser = (userId: string, checked: boolean) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange([...selectedUsers, userId]);
      } else {
        onSelectionChange(selectedUsers.filter((id) => id !== userId));
      }
    }
  };

  // Handle row click
  const handleRowClick = (user: User, event: React.MouseEvent) => {
    // Don't trigger row click if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) {
      return;
    }

    onUserSelect?.(user);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        <p>Error loading users: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className={clsx('w-full', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {onSelectionChange && (
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  // indeterminate={isIndeterminate}
                  onCheckedChange={handleSelectAll}
                  disabled={disabled}
                  aria-label="Select all users"
                />
              </TableHead>
            )}
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelected = selectedUsers.includes(user.id);

            return (
              <TableRow
                key={user.id}
                className={clsx(
                  'cursor-pointer hover:bg-gray-50',
                  isSelected && 'bg-blue-50',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={(e) => handleRowClick(user, e)}
              >
                {onSelectionChange && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectUser(user.id, !!checked)}
                      disabled={disabled}
                      aria-label={`Select ${user.email}`}
                    />
                  </TableCell>
                )}

                <TableCell>
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src={user.avatar} alt={user.fullName} />
                    <AvatarFallback> */}
                    {user.displayName?.split(' ')[0]?.charAt(0)}
                    {user.displayName?.split(' ')[1]?.charAt(0)}
                    {/* </AvatarFallback> */}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <div className="font-medium">{user.displayName}</div>
                  <div className="text-sm text-gray-500">@{user.email}</div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {user.email}
                  </div>
                </TableCell>

                <TableCell>
                  {user.phoneNumber ? (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {user.phoneNumber}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.slice(0, 2).map((role) => (
                      <Badge key={role.id} variant="outline" className="text-xs">
                        {role.name}
                      </Badge>
                    ))}
                    {user.roles && user.roles.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.roles.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                </TableCell>

                <TableCell className="text-sm text-gray-500">
                  {user.lastLogin ? formatDate(user.lastLogin) : '-'}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" disabled={disabled}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onUserEdit && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onUserEdit(user);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                      )}
                      {onRoleAssign && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onRoleAssign(user);
                          }}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Manage Roles
                        </DropdownMenuItem>
                      )}
                      {onUserDelete && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onUserDelete(user);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
