'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@musetrip360/ui-core/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@musetrip360/ui-core/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@musetrip360/ui-core/command';
import { Label } from '@musetrip360/ui-core/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Avatar, AvatarFallback, AvatarImage } from '@musetrip360/ui-core/avatar';
import { Badge } from '@musetrip360/ui-core/badge';
import { Loader2, Check, User as UserIcon, X } from 'lucide-react';
import { toast } from '@musetrip360/ui-core/sonner';
import { useUserSearch } from '@musetrip360/user-management/api';
import type { IUser } from '@musetrip360/user-management/types';
import { useCreateEventParticipant } from '../api/hooks/useEventParticipant';
import { ParticipantRoleEnum } from '../types';

interface AddParticipantDialogProps {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddParticipantDialog({ eventId, open, onOpenChange, onSuccess }: AddParticipantDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [selectedRole, setSelectedRole] = useState<ParticipantRoleEnum>(ParticipantRoleEnum.Attendee);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);

  // Search users with debounced term
  const { data: searchResponse, isLoading: isSearching } = useUserSearch(searchTerm, 300);

  // Create participant mutation
  const { mutate: createParticipant, isPending: isCreating } = useCreateEventParticipant({
    onSuccess: () => {
      // Success handling is done in handleSubmit for multiple users
    },
    onError: (error: any) => {
      toast.error('Thêm người tham gia thất bại: ' + (error.response?.data?.message || error.message));
    },
  });

  // Handle click outside to close command list
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setIsCommandOpen(false);
      }
    };

    if (isCommandOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCommandOpen]);

  // Reset selected users when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
      setSearchTerm('');
      setIsCommandOpen(false);
    }
  }, [open]);

  const handleClose = () => {
    setSearchTerm('');
    setSelectedUsers([]);
    setSelectedRole(ParticipantRoleEnum.Attendee);
    setIsCommandOpen(false);
    onOpenChange(false);
  };

  const handleUserSelect = (user: IUser) => {
    setSelectedUsers((prev) => {
      const isAlreadySelected = prev.some((u) => u.id === user.id);
      if (isAlreadySelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Vui lòng chọn ít nhất một người dùng');
      return;
    }

    try {
      // Create participants for all selected users sequentially to avoid race conditions
      for (const user of selectedUsers) {
        await new Promise<void>((resolve, reject) => {
          createParticipant(
            {
              eventId,
              userId: user.id,
              role: selectedRole,
            },
            {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            }
          );
        });
      }

      // All participants created successfully
      toast.success(`Thêm ${selectedUsers.length} người tham gia thành công`);
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error creating multiple participants:', error);
      // Individual error toasts are already shown by the mutation
    }
  };

  const filteredUsers = useMemo(() => {
    const users = searchResponse?.data?.data || [];
    if (!searchTerm.trim()) return [];
    return users.filter(
      (user: IUser) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchResponse?.data?.data, searchTerm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm người tham gia</DialogTitle>
          <DialogDescription>Tìm kiếm và chọn người dùng để thêm vào sự kiện</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Selected Users Display */}
          {selectedUsers.length > 0 && (
            <div className="grid gap-2">
              <Label>Đã chọn ({selectedUsers.length} người)</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-muted/20 max-h-24 overflow-y-auto">
                {selectedUsers.map((user) => (
                  <Badge key={user.id} variant="secondary" className="flex items-center gap-2 pl-2 pr-1 py-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {user.fullName?.charAt(0)?.toUpperCase() || <UserIcon className="h-3 w-3" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs truncate max-w-20">{user.fullName}</span>
                    <button
                      type="button"
                      onClick={() => handleUserRemove(user.id)}
                      className="hover:bg-destructive/10 rounded-sm p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* User Search */}
          <div className="grid gap-2">
            <Label htmlFor="user-search">Tìm kiếm người dùng</Label>
            <Command ref={commandRef} className="border border-input">
              <CommandInput
                placeholder="Tìm theo tên, email hoặc username..."
                value={searchTerm}
                onValueChange={(value) => {
                  setSearchTerm(value);
                  setIsCommandOpen(!!value.trim());
                }}
                onFocus={() => searchTerm.trim() && setIsCommandOpen(true)}
              />
              {isCommandOpen && (
                <CommandList className="max-h-[200px]">
                  {isSearching && searchTerm.trim() && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm text-muted-foreground">Đang tìm kiếm...</span>
                    </div>
                  )}

                  {!isSearching && searchTerm.trim() && filteredUsers.length === 0 && (
                    <CommandEmpty>Không tìm thấy người dùng nào</CommandEmpty>
                  )}

                  {filteredUsers.length > 0 && (
                    <CommandGroup>
                      {filteredUsers.map((user: IUser) => (
                        <CommandItem
                          key={user.id}
                          value={`${user.fullName} ${user.email} ${user.username}`}
                          onSelect={() => handleUserSelect(user)}
                          className="flex items-center justify-between p-2"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatarUrl || undefined} />
                              <AvatarFallback>
                                {user.fullName?.charAt(0)?.toUpperCase() || <UserIcon className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{user.fullName}</div>
                              <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                              <div className="text-xs text-muted-foreground">@{user.username}</div>
                            </div>
                          </div>
                          {selectedUsers.some((u) => u.id === user.id) && <Check className="h-4 w-4 text-primary" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              )}
            </Command>
          </div>

          {/* Role Selection */}
          <div className="grid gap-2">
            <Label htmlFor="role">Vai trò</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as ParticipantRoleEnum)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ParticipantRoleEnum.Attendee}>
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <span>Attendee - Người tham dự</span>
                  </div>
                </SelectItem>
                <SelectItem value={ParticipantRoleEnum.Guest}>
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-4 w-4" />
                    <span>Guest - Khách mời</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={selectedUsers.length === 0 || isCreating}>
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Thêm người tham gia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
