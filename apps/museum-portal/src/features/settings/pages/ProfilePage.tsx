'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Save, X, User } from 'lucide-react';

import { useCurrentProfile, useUpdateProfile } from '@musetrip360/user-management';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Avatar, AvatarFallback, AvatarImage } from '@musetrip360/ui-core/avatar';
import { Badge } from '@musetrip360/ui-core/badge';
import Divider from '@/components/Divider';
import { IUser } from '@musetrip360/auth-system';
import { useFileUpload } from '@musetrip360/shared';

// Validation schema for profile update
const profileUpdateSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên không được để trống'),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      // Vietnamese phone number validation
      const phoneRegex = /^(\+?[1-9]\d{1,14}|0\d{8,14})$/;
      return phoneRegex.test(val);
    }, 'Số điện thoại không hợp lệ'),
  birthDate: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare only dates
      return selectedDate <= today;
    }, 'Ngày sinh không thể là ngày trong tương lai'),
});

type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// Helper function to format date for input[type="date"]
const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0] as string; // Format as YYYY-MM-DD
  } catch {
    return '';
  }
};

const ProfilePage = () => {
  const { data, refetch } = useCurrentProfile();
  const user = data as IUser;
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutateAsync: uploadFile } = useFileUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      birthDate: '',
    },
  });

  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        birthDate: formatDateForInput(user.birthDate),
      });
    }
  }, [user, form]);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
      }
    };
  }, [previewAvatar]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateError(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdateError(null);
    setSuccessMessage(null);
    // Reset form to original values
    form.reset({
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      birthDate: formatDateForInput(user.birthDate),
    });
    // Reset avatar upload states
    setAvatarFile(null);
    setPreviewAvatar(null);
  };

  const handleSubmit = async (data: ProfileUpdateFormData) => {
    try {
      setUpdateError(null);
      setIsUploadingAvatar(true);

      let finalAvatarUrl = user.avatarUrl;

      // Upload avatar if a new file was selected
      if (avatarFile) {
        const uploadResult = await uploadFile(avatarFile);
        finalAvatarUrl = uploadResult.data.url;
      }

      await updateProfile({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || undefined,
        avatarUrl: finalAvatarUrl || undefined,
        birthDate: data.birthDate || undefined,
      });

      setSuccessMessage('Cập nhật thông tin cá nhân thành công!');
      setIsEditing(false);
      // Reset avatar upload states
      setAvatarFile(null);
      setPreviewAvatar(null);
    } catch (error) {
      setUpdateError('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
      console.error('Profile update error:', error);
    } finally {
      setIsUploadingAvatar(false);
      // Refetch user data to ensure form is updated with latest values
      await refetch();
    }
  };

  const handleAvatarClick = () => {
    if (!isEditing) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setAvatarFile(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreviewAvatar(previewUrl);
      }
    };
    input.click();
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Hoạt động
          </Badge>
        );
      case 'Inactive':
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-500">
            Không hoạt động
          </Badge>
        );
      case 'Suspended':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Tạm khóa
          </Badge>
        );
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  // Get today's date in YYYY-MM-DD format for max attribute
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <User className="h-6 w-6 text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
        </div>

        {!isEditing ? (
          <Button onClick={handleEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button type="submit" form="profile-form" disabled={isUpdating || isUploadingAvatar} className="gap-2">
              {isUpdating || isUploadingAvatar ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isUpdating || isUploadingAvatar ? 'Đang lưu...' : 'Lưu'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating || isUploadingAvatar}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Hủy
            </Button>
          </div>
        )}
      </div>

      <Divider />

      <div className="my-8">
        {/* Success Message */}
        {successMessage && (
          <div className="animate-in slide-in-from-bottom-1 duration-200 rounded-md bg-green-50 p-3 text-sm text-green-800 border border-green-200 mb-4">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {updateError && (
          <div className="animate-in slide-in-from-top-1 duration-200 rounded-md bg-destructive/15 p-3 text-sm text-destructive mb-4">
            {updateError}
          </div>
        )}

        {/* Profile Avatar Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <Avatar
              className={`h-20 w-20 ${isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
              onClick={handleAvatarClick}
            >
              <AvatarImage src={previewAvatar || user.avatarUrl || ''} alt={user.fullName || user.email} />
              <AvatarFallback className="text-lg font-semibold">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleAvatarClick}
              >
                <span className="text-white text-xs font-medium">Thay đổi</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.fullName || user.email}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">{getStatusBadge(user.status)}</div>
            {isEditing && avatarFile && (
              <p className="text-xs text-blue-600 mt-1">Đã chọn ảnh mới: {avatarFile.name}</p>
            )}
            {isEditing && <p className="text-xs text-gray-500 mt-1">Click vào ảnh đại diện để thay đổi</p>}
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form id="profile-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* First Row - Email and Full Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormLabel className="text-gray-600 mb-2">Email</FormLabel>
                <Input type="email" value={user.email} disabled className="bg-gray-50 text-gray-600" />
              </div>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Họ và tên</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập họ và tên"
                        disabled={!isEditing || isUpdating || isUploadingAvatar}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Second Row - Phone Number and Birth Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Ví dụ: 0901234567, +84901234567"
                        disabled={!isEditing || isUpdating || isUploadingAvatar}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">Định dạng hợp lệ: 0901234567, +84901234567</p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Ngày sinh</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={getTodayDate()}
                        disabled={!isEditing || isUpdating || isUploadingAvatar}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-1">Ngày sinh không thể là ngày trong tương lai</p>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      <Divider />

      {/* Account Information */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">ID tài khoản:</span>
            <span className="ml-2 font-mono text-sm text-muted-foreground">{user.id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Tên người dùng:</span>
            <span className="ml-2 text-gray-900">{user.username}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Loại xác thực:</span>
            <span className="ml-2 text-gray-900">{user.authType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600">Trạng thái:</span>
            {getStatusBadge(user.status)}
          </div>
          <div>
            <span className="font-medium text-gray-600">Ngày sinh:</span>
            <span className="ml-2 text-gray-900">
              {user.birthDate
                ? new Date(user.birthDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Chưa cập nhật'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Đăng nhập lần cuối:</span>
            <span className="ml-2 text-gray-900">
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Không xác định'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
