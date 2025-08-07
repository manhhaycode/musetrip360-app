'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, X, UserPlus, Loader2 } from 'lucide-react';

import { useMuseumStore } from '@musetrip360/museum-management';
import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Avatar, AvatarFallback, AvatarImage, toast } from '@musetrip360/ui-core';
import { useCreateTourGuide, TourGuideCreateDto, useMuseumUsers, UserWithRole } from '@musetrip360/user-management';
import get from 'lodash.get';
import { IUser } from '@musetrip360/auth-system';

const addTourGuideSchema = z.object({
  userId: z.string().min(1, 'Vui lòng chọn người dùng'),
  name: z.string().min(1, 'Tên hướng dẫn viên là bắt buộc').max(100, 'Tên phải ít hơn 100 ký tự'),
  bio: z.string().max(1000, 'Giới thiệu phải ít hơn 1000 ký tự').optional(),
  specializations: z.string().max(500, 'Chuyên ngành phải ít hơn 500 ký tự').optional(),
  languages: z.string().max(200, 'Ngôn ngữ phải ít hơn 200 ký tự').optional(),
  experience: z.string().max(500, 'Kinh nghiệm phải ít hơn 500 ký tự').optional(),
});

type AddTourGuideFormData = z.infer<typeof addTourGuideSchema>;

interface AddTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddTourGuide: React.FC<AddTourGuideProps> = ({ isOpen, onClose, onSuccess }) => {
  const { selectedMuseum } = useMuseumStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const {
    data: users,
    isLoading: isSearching,
    refetch,
  } = useMuseumUsers(
    {
      search: searchQuery,
      page: 1,
      pageSize: 10,
    },
    selectedMuseum?.id || ''
  );

  const { mutate: createTourGuide, isPending: isSubmitting } = useCreateTourGuide({
    onSuccess: () => {
      setSelectedUser(null);
      setSearchQuery('');
      form.reset();
      toast.success('Thêm hướng dẫn viên thành công');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Thêm hướng dẫn viên thất bại');
    },
  });

  const form = useForm<AddTourGuideFormData>({
    resolver: zodResolver(addTourGuideSchema),
    defaultValues: {
      userId: '',
      name: '',
      bio: '',
      specializations: '',
      languages: '',
      experience: '',
    },
  });

  const handleUserSelect = useCallback(
    (user: IUser) => {
      setSelectedUser(user);
      form.setValue('userId', user.id);
      if (!form.getValues('name')) {
        form.setValue('name', user.fullName || '');
      }
      setSearchQuery('');
    },
    [form]
  );

  const handleSubmit = useCallback(
    async (data: AddTourGuideFormData) => {
      if (!selectedMuseum?.id) {
        toast.error('Vui lòng chọn bảo tàng trước');
        return;
      }

      const tourGuideData: TourGuideCreateDto = {
        userId: data.userId,
        museumId: selectedMuseum.id,
        name: data.name,
        bio: data.bio || '',
        metadata: {
          specializations: data.specializations || '',
          languages: data.languages || '',
          experience: data.experience || '',
        },
      };

      createTourGuide(tourGuideData);
    },
    [selectedMuseum?.id, createTourGuide]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, refetch]);

  const handleClose = useCallback(() => {
    setSelectedUser(null);
    setSearchQuery('');
    form.reset();
    onClose();
  }, [form, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Thêm hướng dẫn viên</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>

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

            {!selectedUser && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>
            )}

            {!selectedUser && get(users, 'data.total', 0) > 0 && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                {(get(users, 'data.data', []) as UserWithRole[]).map((user: UserWithRole) => (
                  <button
                    key={user.userId + user.roleId}
                    type="button"
                    onClick={() => handleUserSelect(user.user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user.avatarUrl ?? ''} />
                      <AvatarFallback>{user.user.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{user.user.fullName}</div>
                      <div className="text-xs text-gray-500">{user.user.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!selectedUser && searchQuery && get(users, 'data.total', 0) === 0 && !isSearching && (
              <div className="text-center py-4 text-sm text-gray-500">
                Không tìm được người dùng với từ khoá "{searchQuery}"
              </div>
            )}

            {form.formState.errors.userId && (
              <p className="text-sm text-red-600">{form.formState.errors.userId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên hoặc nickname *</label>
              <Input {...form.register('name')} placeholder="Tên hiển thị của hướng dẫn viên" className="w-full" />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ngôn ngữ</label>
              <Input
                {...form.register('languages')}
                placeholder="Ví dụ: Tiếng Việt, Tiếng Anh, Tiếng Pháp"
                className="w-full"
              />
              {form.formState.errors.languages && (
                <p className="text-sm text-red-600">{form.formState.errors.languages.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Giới thiệu</label>
            <Textarea
              {...form.register('bio')}
              placeholder="Tiểu sử và nền tảng của hướng dẫn viên"
              rows={4}
              className="w-full resize-none"
            />
            {form.formState.errors.bio && <p className="text-sm text-red-600">{form.formState.errors.bio.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Chuyên ngành</label>
            <Textarea
              {...form.register('specializations')}
              placeholder="Lĩnh vực chuyên môn, kiến thức đặc biệt hoặc chủ đề tour"
              rows={3}
              className="w-full resize-none"
            />
            {form.formState.errors.specializations && (
              <p className="text-sm text-red-600">{form.formState.errors.specializations.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Kinh nghiệm</label>
            <Textarea
              {...form.register('experience')}
              placeholder="Số năm kinh nghiệm, thành tích nổi bật hoặc chứng chỉ"
              rows={3}
              className="w-full resize-none"
            />
            {form.formState.errors.experience && (
              <p className="text-sm text-red-600">{form.formState.errors.experience.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Huỷ
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedUser} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Lưu
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTourGuide;
