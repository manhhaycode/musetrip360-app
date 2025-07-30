'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, X, Check, ChevronsUpDown, UserPlus, Loader2 } from 'lucide-react';

import { useMuseumStore } from '@musetrip360/museum-management';
import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { Badge } from '@musetrip360/ui-core/badge';
import { Avatar, AvatarFallback, AvatarImage, toast } from '@musetrip360/ui-core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@musetrip360/ui-core/dropdown-menu';
import { Role, useAddUserRole, useRoles, useUserSearch } from '@musetrip360/user-management';
import get from 'lodash.get';
import { IUser } from '@musetrip360/auth-system';

// Form validation schema
const addStaffSchema = z.object({
  userId: z.string().min(1, 'Please select a user'),
  roleId: z.string().min(1, 'Please select a role'),
});

type AddStaffFormData = z.infer<typeof addStaffSchema>;

interface AddStaffMemberProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddStaffMember: React.FC<AddStaffMemberProps> = ({ isOpen, onClose, onSuccess }) => {
  const { selectedMuseum } = useMuseumStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const { data: roles } = useRoles({
    page: 1,
    pageSize: 1000,
  });

  const { data: users, isLoading: isSearching } = useUserSearch(searchQuery);

  const { mutate: addUserRole, isPending: isSubmitting } = useAddUserRole({
    onSuccess: () => {
      // Reset form
      setSelectedUser(null);
      setSelectedRole(null);
      setSearchQuery('');
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to add staff member');
    },
  });

  const form = useForm<AddStaffFormData>({
    resolver: zodResolver(addStaffSchema),
    defaultValues: {
      userId: '',
      roleId: '',
    },
  });

  const handleUserSelect = useCallback(
    (user: IUser) => {
      setSelectedUser(user);
      form.setValue('userId', user.id);
      setSearchQuery('');
    },
    [form]
  );

  const handleRoleSelect = useCallback(
    (role: Role) => {
      setSelectedRole(role);
      form.setValue('roleId', role.id);
    },
    [form]
  );

  const handleSubmit = useCallback(
    async (data: AddStaffFormData) => {
      if (!selectedMuseum?.id) return;

      addUserRole({
        userId: data.userId,
        roleId: data.roleId,
        museumId: selectedMuseum.id,
      });
    },
    [selectedMuseum?.id, addUserRole]
  );

  const handleClose = useCallback(() => {
    setSelectedUser(null);
    setSelectedRole(null);
    setSearchQuery('');
    form.reset();
    onClose();
  }, [form, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Add Staff Member</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* User Search Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Search and Select User</label>

            {/* Selected User Display */}
            {selectedUser && (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedUser.avatarUrl ?? ''} />
                  <AvatarFallback>{selectedUser.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm">{selectedUser.fullName}</div>
                  <div className="text-xs text-gray-500">{selectedUser.email}</div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(null);
                    form.setValue('userId', '');
                  }}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Search Input */}
            {!selectedUser && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>
            )}

            {/* Search Results */}
            {!selectedUser && searchQuery && get(users, 'data.total', 0) > 0 && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {get(users, 'data.data', []).map((user: IUser) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleUserSelect(user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl ?? ''} />
                      <AvatarFallback>{user.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{user.fullName}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {!selectedUser && searchQuery && get(users, 'data.total', 0) === 0 && !isSearching && (
              <div className="text-center py-4 text-sm text-gray-500">No users found matching "{searchQuery}"</div>
            )}

            {/* Form error for user */}
            {form.formState.errors.userId && (
              <p className="text-sm text-red-600">{form.formState.errors.userId.message}</p>
            )}
          </div>

          {/* Role Selection Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Select Role</label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedRole ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{selectedRole.name}</Badge>
                    </div>
                  ) : (
                    'Select a role...'
                  )}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[400px]">
                {(get(roles, 'data.data', []) as Role[]).map((role: Role) => (
                  <DropdownMenuItem
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{role.name}</div>
                      {role.description && <div className="text-xs text-gray-500">{role.description}</div>}
                    </div>
                    {selectedRole?.id === role.id && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Form error for role */}
            {form.formState.errors.roleId && (
              <p className="text-sm text-red-600">{form.formState.errors.roleId.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedUser || !selectedRole} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Staff
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffMember;
