'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Save, X } from 'lucide-react';

import { useGetMuseumById, useMuseumStore, useUpdateMuseum } from '@musetrip360/museum-management';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import Divider from '@/components/Divider';
import { MuseumStatusBadge } from '../MuseumStatusBadge';

// Validation schema
const museumUpdateSchema = z.object({
  name: z.string().min(1, 'Tên bảo tàng là bắt buộc').min(3, 'Tên bảo tàng phải có ít nhất 3 ký tự'),
  description: z.string().min(1, 'Mô tả là bắt buộc').min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  location: z.string().min(1, 'Địa chỉ là bắt buộc').min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  contactEmail: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  contactPhone: z.string().min(1, 'Số điện thoại là bắt buộc').min(10, 'Số điện thoại phải có ít nhất 10 số'),
});

type MuseumUpdateFormData = z.infer<typeof museumUpdateSchema>;

const MuseumDetailPage = () => {
  const { selectedMuseum } = useMuseumStore();
  const {
    data: museum,
    isLoading,
    error,
    refetch,
  } = useGetMuseumById(selectedMuseum?.id ?? '', {
    enabled: !!selectedMuseum?.id,
  });

  const { mutate: updateMuseum, isPending } = useUpdateMuseum({
    onSuccess: () => {
      setSuccessMessage('Cập nhật thông tin bảo tàng thành công!');
      setIsEditing(false);
      refetch();
    },
    onError: () => {
      setUpdateError('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<MuseumUpdateFormData>({
    resolver: zodResolver(museumUpdateSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      contactEmail: '',
      contactPhone: '',
    },
  });

  // Update form values when museum data is loaded
  React.useEffect(() => {
    if (museum) {
      form.reset({
        name: museum.name,
        description: museum.description,
        location: museum.location,
        contactEmail: museum.contactEmail,
        contactPhone: museum.contactPhone,
      });
    }
  }, [museum, form]);

  if (!selectedMuseum?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Museum Selected</h2>
          <p className="text-gray-500">Please select a museum to manage.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !museum) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Museum</h2>
          <p className="text-gray-500">Failed to load museum details. Please try again.</p>
        </div>
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
      name: museum.name,
      description: museum.description,
      location: museum.location,
      contactEmail: museum.contactEmail,
      contactPhone: museum.contactPhone,
    });
  };

  const handleSubmit = async (data: MuseumUpdateFormData) => {
    try {
      setUpdateError(null);

      updateMuseum({
        id: museum.id,
        ...data,
      });
    } catch (error) {
      setUpdateError('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Thông tin cơ bản</h2>

        {!isEditing ? (
          <Button onClick={handleEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button type="submit" form="museum-form" disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isPending} className="gap-2">
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

        {/* Form */}
        <Form {...form}>
          <form id="museum-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* First Row - Name and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Tên bảo tàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên bảo tàng" disabled={!isEditing || isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ bảo tàng" disabled={!isEditing || isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Second Row - Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Email liên hệ</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Nhập email liên hệ"
                        disabled={!isEditing || isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        disabled={!isEditing || isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Third Row - Description (Full Width) */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-600">Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả về bảo tàng"
                      rows={4}
                      disabled={!isEditing || isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <Divider />
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin hệ thống</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">ID bảo tàng:</span>
            <span className="ml-2 font-mono text-sm text-muted-foreground">{museum.id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600 mr-2">Trạng thái:</span>
            <MuseumStatusBadge status={museum.status} />
          </div>
          <div>
            <span className="font-medium text-gray-600">Được tạo:</span>
            <span className="ml-2 text-gray-900">
              {new Date(museum.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Cập nhật lần cuối:</span>
            <span className="ml-2 text-gray-900">
              {new Date(museum.updatedAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseumDetailPage;
