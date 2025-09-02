'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Save, X } from 'lucide-react';

import { useGetMuseumById, useMuseumStore, useUpdateMuseum } from '@musetrip360/museum-management';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Badge } from '@musetrip360/ui-core/badge';
import Divider from '@/components/Divider';
import { MuseumStatusBadge } from '../MuseumStatusBadge';
import { Category, FormDropZone, MediaType, useCategory, useFileUpload, ZodFileData } from '@musetrip360/shared';
import get from 'lodash.get';
import { PERMISSION_MUSEUM_DETAIL_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';

// Validation schema
const museumUpdateSchema = z.object({
  name: z.string().min(1, 'Tên bảo tàng là bắt buộc').min(3, 'Tên bảo tàng phải có ít nhất 3 ký tự'),
  description: z.string().min(1, 'Mô tả là bắt buộc').min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  location: z.string().min(1, 'Địa chỉ là bắt buộc').min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  contactEmail: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  contactPhone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      // Vietnamese phone number validation
      const phoneRegex = /^(\+?[1-9]\d{1,14}|0\d{8,14})$/;
      return phoneRegex.test(val);
    }, 'Số điện thoại không hợp lệ'),
  images: z.array(ZodFileData.nullable()).optional(),
  categoryIds: z.array(z.string()).optional(),
});

type MuseumUpdateFormData = z.infer<typeof museumUpdateSchema>;

const MuseumDetailPage = () => {
  const { hasPermission, userPrivileges } = useRolebaseStore();
  const { selectedMuseum } = useMuseumStore();
  const {
    data: museum,
    isLoading,
    error,
    refetch,
  } = useGetMuseumById(selectedMuseum?.id ?? '', {
    enabled: !!selectedMuseum?.id,
  });

  console.log('Uer', userPrivileges);

  const { data: categories } = useCategory();

  const { mutate: updateMuseum, isPending: isUpdating } = useUpdateMuseum({
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
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const uploadFileMutation = useFileUpload();

  const isPending = isUpdating || isUploadingImages;

  const form = useForm<MuseumUpdateFormData>({
    resolver: zodResolver(museumUpdateSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      contactEmail: '',
      contactPhone: '',
      images: [],
      categoryIds: [],
    },
  });

  const { control } = form;
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'images',
  });

  const watchedImages = useWatch({ control, name: 'images' });

  useEffect(() => {
    if (imageFields.length === 0) {
      appendImage(null);
    }
  }, [imageFields.length, appendImage]);

  // Auto-append new field if all are filled
  useEffect(() => {
    const allImagesHaveValue = watchedImages?.every((img) => !!img);
    if (imageFields.length > 0 && allImagesHaveValue) {
      appendImage(null);
    }
  }, [watchedImages, imageFields, appendImage]);

  // Update form values when museum data is loaded
  React.useEffect(() => {
    if (museum) {
      form.reset({
        name: museum.name,
        description: museum.description,
        location: museum.location,
        contactEmail: museum.contactEmail,
        contactPhone: museum.contactPhone,
        images:
          museum.metadata?.images?.map((img) => ({
            file: img,
            mediaType: MediaType.IMAGE,
            fileName: 'Ảnh bảo tàng',
          })) || [],
        categoryIds: get(museum, 'categories', []).map((cat: Category) => cat.id) || [],
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
      images:
        museum.metadata?.images?.map((img) => ({
          file: img,
          mediaType: MediaType.IMAGE,
          fileName: 'Ảnh bảo tàng',
        })) || [],
      categoryIds: get(museum, 'categories', []).map((cat: Category) => cat.id) || [],
    });
  };

  const handleSubmit = async (data: MuseumUpdateFormData) => {
    try {
      setUpdateError(null);
      setIsUploadingImages(true);

      const validImages = (data.images || []).filter(Boolean).map((img) => img!.file);
      const uploadedImageUrls: string[] = [];
      for (const img of validImages) {
        if (typeof img === 'object' && img !== null && 'name' in img && 'type' in img) {
          const result = await uploadFileMutation.mutateAsync(img as File);
          console.log('Uploaded image result:', result);
          uploadedImageUrls.push(result.data.url);
        } else if (typeof img === 'string') {
          uploadedImageUrls.push(img);
        }
      }

      updateMuseum({
        id: museum.id,
        name: data.name,
        description: data.description,
        location: data.location,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        metadata: {
          ...museum.metadata,
          images: uploadedImageUrls,
        },
        categoryIds: data.categoryIds || [],
      });
    } catch (error) {
      setUpdateError('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
      console.error('Update error:', error);
    } finally {
      setIsUploadingImages(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Thông tin cơ bản</h2>

        {!isEditing ? (
          <Button
            onClick={handleEdit}
            className="gap-2"
            disabled={!hasPermission(selectedMuseum.id, PERMISSION_MUSEUM_DETAIL_MANAGEMENT)}
          >
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
                disabled
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

            {/* Third Row - Categories */}
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => {
                const selectedCategories = (categories || []).filter((cat) => field.value?.includes(cat.id));
                const availableCategories = (categories || []).filter((cat) => !field.value?.includes(cat.id));

                return (
                  <FormItem>
                    <FormLabel className="text-gray-600">Danh mục</FormLabel>
                    <div className="space-y-2">
                      {/* Selected categories */}
                      {selectedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedCategories.map((category) => (
                            <Badge
                              key={category.id}
                              variant="secondary"
                              className="flex items-center gap-1"
                              onClick={() => {
                                if (!isEditing || isPending) return;
                                const newValue = field.value?.filter((id: string) => id !== category.id) || [];
                                field.onChange(newValue);
                              }}
                            >
                              {category.name}
                              {isEditing && !isPending && (
                                <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Add category select */}
                      {isEditing && availableCategories.length > 0 && (
                        <FormControl>
                          <Select
                            value=""
                            onValueChange={(categoryId) => {
                              if (categoryId) {
                                const newValue = [...(field.value || []), categoryId];
                                field.onChange(newValue);
                              }
                            }}
                            disabled={isPending}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn danh mục để thêm..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  <div className="flex flex-col">
                                    <span>{category.name}</span>
                                    {category.description && (
                                      <span className="text-xs text-muted-foreground">{category.description}</span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      )}

                      {/* Show message when no categories available */}
                      {!categories || categories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Không có danh mục khả dụng</p>
                      ) : isEditing && availableCategories.length === 0 && selectedCategories.length > 0 ? (
                        <p className="text-sm text-muted-foreground">Đã chọn tất cả danh mục khả dụng</p>
                      ) : null}
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Fourth Row - Description (Full Width) */}
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

            {/* Multiple Images Upload (Dynamic) */}
            {isEditing && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-gray-600">Hình ảnh bảo tàng</FormLabel>
                  <span className="text-sm text-muted-foreground">
                    Thêm nhiều hình ảnh, trường mới sẽ tự động xuất hiện
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-2 space-y-2 relative">
                      <FormDropZone
                        name={`images.${index}`}
                        control={control}
                        mediaType={MediaType.IMAGE}
                        label={''}
                        description={''}
                      />
                      {imageFields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeImage(index)}
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          disabled={isPending}
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>

      {/* Display existing images when not editing */}
      {!isEditing && museum.metadata?.images && museum.metadata.images.length > 0 && (
        <>
          <Divider />
          <div className="mt-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh bảo tàng</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {museum.metadata.images.map((imageUrl: string, index: number) => (
                <div key={index} className="border rounded-lg p-2">
                  <img
                    src={imageUrl}
                    alt={`Museum image ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

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
