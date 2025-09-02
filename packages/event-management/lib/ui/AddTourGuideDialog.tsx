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
import { Avatar, AvatarFallback, AvatarImage } from '@musetrip360/ui-core/avatar';
import { Badge } from '@musetrip360/ui-core/badge';
import { Loader2, Check, User as UserIcon, X } from 'lucide-react';
import { toast } from '@musetrip360/ui-core/sonner';
import { useTourGuides } from '@musetrip360/user-management/api';
import type { TourGuide } from '@musetrip360/user-management/types';
import { useCreateEventParticipant } from '../api/hooks/useEventParticipant';
import { ParticipantRoleEnum } from '../types';

interface AddTourGuideDialogProps {
  eventId: string;
  museumId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddTourGuideDialog({ eventId, museumId, open, onOpenChange, onSuccess }: AddTourGuideDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTourGuides, setSelectedTourGuides] = useState<TourGuide[]>([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);

  // Get tour guides for the museum
  const { data: tourGuidesResponse, isLoading: isLoadingTourGuides } = useTourGuides(museumId, {
    Page: 1,
    PageSize: 100, // Get all tour guides for the museum
  });

  // Create participant mutation
  const { mutate: createParticipant, isPending: isCreating } = useCreateEventParticipant({
    onSuccess: () => {
      // Success handling is done in handleSubmit for multiple tour guides
    },
    onError: (error: any) => {
      toast.error('Thêm hướng dẫn viên thất bại: ' + (error.response?.data?.message || error.message));
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

  // Reset selected tour guides when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedTourGuides([]);
      setSearchTerm('');
      setIsCommandOpen(false);
    }
  }, [open]);

  const handleClose = () => {
    setSearchTerm('');
    setSelectedTourGuides([]);
    setIsCommandOpen(false);
    onOpenChange(false);
  };

  const handleTourGuideSelect = (tourGuide: TourGuide) => {
    setSelectedTourGuides((prev) => {
      const isAlreadySelected = prev.some((tg) => tg.id === tourGuide.id);
      if (isAlreadySelected) {
        return prev.filter((tg) => tg.id !== tourGuide.id);
      } else {
        return [...prev, tourGuide];
      }
    });
  };

  const handleTourGuideRemove = (tourGuideId: string) => {
    setSelectedTourGuides((prev) => prev.filter((tg) => tg.id !== tourGuideId));
  };

  const handleSubmit = async () => {
    if (selectedTourGuides.length === 0) {
      toast.error('Vui lòng chọn ít nhất một hướng dẫn viên');
      return;
    }

    try {
      // Create participants for all selected tour guides sequentially to avoid race conditions
      for (const tourGuide of selectedTourGuides) {
        await new Promise<void>((resolve, reject) => {
          createParticipant(
            {
              eventId,
              userId: tourGuide.userId, // Use the userId from the tour guide
              role: ParticipantRoleEnum.TourGuide,
            },
            {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            }
          );
        });
      }

      // All participants created successfully
      toast.success(`Thêm ${selectedTourGuides.length} hướng dẫn viên thành công`);
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Error creating multiple tour guide participants:', error);
      // Individual error toasts are already shown by the mutation
    }
  };

  const filteredTourGuides = useMemo(() => {
    const tourGuides = (tourGuidesResponse as any).data.list || [];
    if (!searchTerm.trim()) return tourGuides;

    return tourGuides.filter((tourGuide: TourGuide) => {
      const user = tourGuide.user;
      const name = tourGuide.name || user?.fullName || '';
      const email = user?.email || '';
      const username = user?.username || '';

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [tourGuidesResponse, searchTerm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm hướng dẫn viên</DialogTitle>
          <DialogDescription>Tìm kiếm và chọn hướng dẫn viên để thêm vào sự kiện</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Selected Tour Guides Display */}
          {selectedTourGuides.length > 0 && (
            <div className="grid gap-2">
              <Label>Đã chọn ({selectedTourGuides.length} hướng dẫn viên)</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-muted/20 max-h-24 overflow-y-auto">
                {selectedTourGuides.map((tourGuide) => (
                  <Badge key={tourGuide.id} variant="secondary" className="flex items-center gap-2 pl-2 pr-1 py-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={tourGuide.user?.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {tourGuide.name?.charAt(0)?.toUpperCase() ||
                          tourGuide.user?.fullName?.charAt(0)?.toUpperCase() || <UserIcon className="h-3 w-3" />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs truncate max-w-20">{tourGuide.name || tourGuide.user?.fullName}</span>
                    <button
                      type="button"
                      onClick={() => handleTourGuideRemove(tourGuide.id)}
                      className="hover:bg-destructive/10 rounded-sm p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tour Guide Search */}
          <div className="grid gap-2">
            <Label htmlFor="tourguide-search">Tìm kiếm hướng dẫn viên</Label>
            <Command ref={commandRef} className="border border-input">
              <CommandInput
                placeholder="Tìm theo tên, email hoặc username..."
                value={searchTerm}
                onValueChange={(value) => {
                  setSearchTerm(value);
                  setIsCommandOpen(true); // Always show list when typing
                }}
                onFocus={() => setIsCommandOpen(true)}
              />
              {isCommandOpen && (
                <CommandList className="max-h-[200px]">
                  {isLoadingTourGuides && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
                    </div>
                  )}

                  {!isLoadingTourGuides && filteredTourGuides.length === 0 && (
                    <CommandEmpty>Không tìm thấy hướng dẫn viên nào</CommandEmpty>
                  )}

                  {filteredTourGuides.length > 0 && (
                    <CommandGroup>
                      {filteredTourGuides.map((tourGuide: TourGuide) => (
                        <CommandItem
                          key={tourGuide.id}
                          value={`${tourGuide.name} ${tourGuide.user?.email} ${tourGuide.user?.username}`}
                          onSelect={() => handleTourGuideSelect(tourGuide)}
                          className="flex items-center justify-between p-2"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={tourGuide.user?.avatarUrl || undefined} />
                              <AvatarFallback>
                                {tourGuide.name?.charAt(0)?.toUpperCase() ||
                                  tourGuide.user?.fullName?.charAt(0)?.toUpperCase() || (
                                    <UserIcon className="h-4 w-4" />
                                  )}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{tourGuide.name || tourGuide.user?.fullName}</div>
                              <div className="text-sm text-muted-foreground truncate">{tourGuide.user?.email}</div>
                              <div className="text-xs text-muted-foreground">
                                @{tourGuide.user?.username}
                                {tourGuide.bio && ` • ${tourGuide.bio}`}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={tourGuide.isAvailable ? 'default' : 'secondary'} className="text-xs">
                                  {tourGuide.isAvailable ? 'Có sẵn' : 'Bận'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {selectedTourGuides.some((tg) => tg.id === tourGuide.id) && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              )}
            </Command>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isCreating}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={selectedTourGuides.length === 0 || isCreating}>
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Thêm hướng dẫn viên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
