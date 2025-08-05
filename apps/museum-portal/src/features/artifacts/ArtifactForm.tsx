'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Edit, Save, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

import {
  Artifact,
  ArtifactCreateDto,
  ArtifactUpdateDto,
  useCreateArtifact,
  useUpdateArtifact,
} from '@musetrip360/artifact-management';
import { useMuseumStore } from '@musetrip360/museum-management';
import { useFileUpload, MediaType, FormDropZone, DropZoneWithPreview } from '@musetrip360/shared';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Switch } from '@musetrip360/ui-core/switch';
import Divider from '@/components/Divider';

// Validation schema for artifact form
const artifactSchema = z.object({
  name: z.string().min(1, 'Tên hiện vật là bắt buộc').min(3, 'Tên hiện vật phải có ít nhất 3 ký tự'),
  description: z.string().min(1, 'Mô tả là bắt buộc').min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  historicalPeriod: z.string().min(1, 'Thời kỳ lịch sử là bắt buộc'),
  imageUrl: z.string(),
  model3DUrl: z.string(),
  isActive: z.boolean(),
  // Metadata fields
  type: z.string(),
  material: z.string(),
  discoveryLocation: z.string(),
  images: z.array(z.union([z.string(), z.any()])).optional(),
  mainImageUpload: z.any().optional(),
});

type ArtifactFormData = z.infer<typeof artifactSchema>;

interface ArtifactFormProps {
  mode: 'create' | 'edit';
  artifactId?: string;
  defaultValues?: Artifact;
  onSuccess?: () => void;
}

const ArtifactForm: React.FC<ArtifactFormProps> = ({ mode, artifactId, defaultValues, onSuccess }) => {
  const navigate = useNavigate();
  const { selectedMuseum } = useMuseumStore();

  // Form state
  const [isEditing, setIsEditing] = useState(mode === 'create');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // Use defaultValues if provided, no need to fetch from API
  const artifact = defaultValues;

  // File upload mutation for images
  const uploadFileMutation = useFileUpload();

  // Mutations
  const { mutate: createArtifact, isPending: isCreating } = useCreateArtifact({
    onSuccess: () => {
      setSuccessMessage('Tạo hiện vật thành công!');
      setError(null);
      onSuccess?.();
      // Navigate back to artifacts list or reset form
      setTimeout(() => {
        navigate('/museum/artifacts');
      }, 2000);
    },
    onError: () => {
      setError('Có lỗi xảy ra khi tạo hiện vật. Vui lòng thử lại.');
    },
  });

  const { mutate: updateArtifact, isPending: isUpdating } = useUpdateArtifact({
    onSuccess: () => {
      setSuccessMessage('Cập nhật hiện vật thành công!');
      setIsEditing(false);
      setError(null);
      onSuccess?.();
      setTimeout(() => {
        navigate('/museum/artifacts');
      }, 2000);
    },
    onError: () => {
      setError('Có lỗi xảy ra khi cập nhật hiện vật. Vui lòng thử lại.');
    },
  });

  const isPending = isCreating || isUpdating || isUploadingImages;

  // Form setup with default values
  const getFormDefaultValues = (): ArtifactFormData => {
    if (mode === 'edit' && artifact) {
      return {
        name: artifact.name,
        description: artifact.description,
        historicalPeriod: artifact.historicalPeriod,
        imageUrl: artifact.imageUrl,
        model3DUrl: artifact.model3DUrl,
        isActive: artifact.isActive,
        type: artifact.metadata?.type || '',
        material: artifact.metadata?.material || '',
        discoveryLocation: artifact.metadata?.discoveryLocation || '',
        images: artifact.metadata?.images || [],
        mainImageUpload: null,
      };
    }

    // Default empty values for create mode
    return {
      name: '',
      description: '',
      historicalPeriod: '',
      imageUrl: '',
      model3DUrl: '',
      isActive: true,
      type: '',
      material: '',
      discoveryLocation: '',
      images: [],
      mainImageUpload: null,
    };
  };

  const form = useForm<ArtifactFormData>({
    resolver: zodResolver(artifactSchema),
    defaultValues: getFormDefaultValues(),
  });

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });
  const watchedImages = useWatch({ control, name: 'images' });
  const mainImageUpload = useWatch({ control, name: 'mainImageUpload' });

  useEffect(() => {
    if (fields.length === 0) {
      append('');
    }
  }, [fields.length, append]);

  // Auto-append new field if all are filled
  useEffect(() => {
    const allHaveValue = watchedImages?.every((img) => !!img);
    if (fields.length > 0 && allHaveValue) {
      append('');
    }
  }, [watchedImages, fields, append]);

  // Check if museum is selected
  if (!selectedMuseum?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Chưa chọn bảo tàng</h2>
          <p className="text-gray-500">Vui lòng chọn một bảo tàng để quản lý hiện vật.</p>
        </div>
      </div>
    );
  }

  // Error state for edit mode - check if artifact data is missing when required
  if (mode === 'edit' && !artifact) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Thiếu dữ liệu hiện vật</h2>
          <p className="text-gray-500">Vui lòng cung cấp dữ liệu hiện vật để chỉnh sửa.</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    if (mode === 'create') {
      navigate('/museum/artifacts');
    } else {
      setIsEditing(false);
      setError(null);
      setSuccessMessage(null);
      // Reset form to original values
      if (artifact) {
        form.reset({
          name: artifact.name,
          description: artifact.description,
          historicalPeriod: artifact.historicalPeriod,
          imageUrl: artifact.imageUrl,
          model3DUrl: artifact.model3DUrl,
          isActive: artifact.isActive,
          type: artifact.metadata?.type || '',
          material: artifact.metadata?.material || '',
          discoveryLocation: artifact.metadata?.discoveryLocation || '',
          images: artifact.metadata?.images || [],
          mainImageUpload: null,
        });
      }
    }
  };

  const onSubmit = async (data: ArtifactFormData) => {
    try {
      setError(null);
      setIsUploadingImages(true);

      // Upload main image if provided via FormDropZone
      let finalImageUrl = data.imageUrl;
      if (data.mainImageUpload?.file && data.mainImageUpload.file instanceof File) {
        const mainImageResult = await uploadFileMutation.mutateAsync(data.mainImageUpload.file);
        finalImageUrl = mainImageResult.data.url;
      }

      // Handle multiple images: filter out empty fields, upload files, and collect URLs
      const validImages = (data.images || []).filter(Boolean).map((img) => img.file);
      console.log('Valid images:', validImages);
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

      // Prepare the payload
      const payload = {
        name: data.name,
        description: data.description,
        historicalPeriod: data.historicalPeriod,
        imageUrl: finalImageUrl,
        model3DUrl: data.model3DUrl,
        isActive: data.isActive,
        metadata: {
          type: data.type,
          material: data.material,
          discoveryLocation: data.discoveryLocation,
          images: uploadedImageUrls,
        },
      };

      if (mode === 'create') {
        createArtifact({
          museumId: selectedMuseum.id,
          data: payload as ArtifactCreateDto,
        });
      } else if (artifactId) {
        updateArtifact({
          id: artifactId,
          data: payload as ArtifactUpdateDto,
        });
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Form submission error:', error);
    } finally {
      setIsUploadingImages(false);
    }
  };

  const pageTitle = mode === 'create' ? 'Tạo hiện vật mới' : 'Thông tin hiện vật';
  const submitButtonText = mode === 'create' ? 'Tạo hiện vật' : 'Lưu thay đổi';

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>

        {mode === 'edit' && !isEditing && (
          <Button onClick={handleEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        )}
      </div>

      <Divider />

      {/* Messages */}
      <div className="my-4">
        {/* Success Message */}
        {successMessage && (
          <div className="animate-in slide-in-from-bottom-1 duration-200 rounded-md bg-green-50 p-3 text-sm text-green-800 border border-green-200 mb-4">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="animate-in slide-in-from-top-1 duration-200 rounded-md bg-destructive/15 p-3 text-sm text-destructive mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Form - Expanded to fill remaining space */}
      <div className="flex-1 flex flex-col">
        <Form {...form}>
          <form id="artifact-form" onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
            <div className="flex-1 space-y-6">
              {/* First Row - Name and Historical Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Tên hiện vật</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên hiện vật"
                          disabled={(mode === 'edit' && !isEditing) || isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="historicalPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Thời kỳ lịch sử</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập thời kỳ lịch sử"
                          disabled={(mode === 'edit' && !isEditing) || isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Second Row - Type and Material */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Loại hiện vật</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập loại hiện vật"
                          disabled={(mode === 'edit' && !isEditing) || isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Chất liệu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập chất liệu"
                          disabled={(mode === 'edit' && !isEditing) || isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Third Row - Discovery Location (Full Width) */}
              <FormField
                control={form.control}
                name="discoveryLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Nơi phát hiện</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập nơi phát hiện hiện vật"
                        disabled={(mode === 'edit' && !isEditing) || isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fourth Row - Active Switch */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả chi tiết về hiện vật"
                        rows={4}
                        disabled={(mode === 'edit' && !isEditing) || isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status Toggle */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-gray-600">Trạng thái</FormLabel>
                      <p className="text-sm text-gray-500">Hiện vật có hoạt động không?</p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={(mode === 'edit' && !isEditing) || isPending}
                    />
                  </FormItem>
                )}
              />

              {/* Fourth Row - Main Image Upload and 3D Model URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">Thumbnail</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {/* URL Input (for existing images or manual URLs) */}
                          <Input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            disabled={(mode === 'edit' && !isEditing) || isPending}
                            {...field}
                          />

                          {/* File Upload */}
                          <div className="text-sm text-gray-500">Hoặc tải lên file:</div>
                          {/* <FormDropZone
                            name="mainImageUpload"
                            control={form.control}
                            mediaType={MediaType.IMAGE}
                            label=""
                            description=""
                            manualUpload={true}
                            className="min-h-[100px]"
                          /> */}
                          <DropZoneWithPreview
                            uploadId="mainImageUpload"
                            autoRegister={true}
                            value={
                              mainImageUpload && mainImageUpload.file ? mainImageUpload.file : defaultValues?.imageUrl
                            }
                            onChange={(newValue) => {
                              if (!newValue) {
                                form.setValue('mainImageUpload', null);
                                return;
                              }
                              form.setValue('mainImageUpload', {
                                file: newValue,
                                mediaType: MediaType.IMAGE,
                                fileName: newValue instanceof File ? newValue.name : '',
                              });
                            }}
                            onRemove={() => form.setValue('mainImageUpload', null)}
                            mediaType={MediaType.IMAGE}
                            disabled={(mode === 'edit' && !isEditing) || isPending}
                            manualUpload={true}
                            className="min-h-[100px]"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model3DUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">URL mô hình 3D</FormLabel>
                      <FormControl>
                        <div className="space-y-3 h-full">
                          <Input
                            type="url"
                            placeholder="https://example.com/model.glb"
                            disabled={(mode === 'edit' && !isEditing) || isPending}
                            {...field}
                          />
                          <div className="text-sm text-gray-500">Preview</div>
                          <div className="w-full h-auto bg-gray-100 rounded-md"></div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Multiple Images Upload (Dynamic) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-gray-600">Hình ảnh bổ sung</FormLabel>
                  <span className="text-sm text-muted-foreground">
                    Thêm nhiều hình ảnh, trường mới sẽ tự động xuất hiện
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-2 space-y-2 relative">
                      <FormDropZone
                        name={`images.${index}`}
                        control={control}
                        mediaType={MediaType.IMAGE}
                        label={''}
                        description={''}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="mt-6 pt-4 border-t">
        {(mode === 'create' || (mode === 'edit' && isEditing)) && (
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleCancel} disabled={isPending} className="gap-2">
              <X className="h-4 w-4" />
              Hủy
            </Button>
            <Button type="submit" form="artifact-form" disabled={isPending} className="gap-2">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === 'create' ? (
                <Plus className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isPending ? 'Đang xử lý...' : submitButtonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtifactForm;
