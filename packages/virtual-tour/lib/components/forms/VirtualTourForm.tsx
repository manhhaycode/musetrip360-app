'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { IVirtualTour, useCreateMuseumVirtualTour, useUpdateVirtualTour } from '@/api';
import { useStudioStore } from '@/store';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input, NumberInput } from '@musetrip360/ui-core/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@musetrip360/ui-core/sheet';
import { toast } from '@musetrip360/ui-core/sonner';
import { FileText, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { FileData, FormDropZone, MediaType, useBulkUpload, ZodFileData } from '@musetrip360/shared';
import { PERMISSION_TOUR_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';

const RichEditor = React.lazy(() =>
  import('@musetrip360/rich-editor').then((module) => ({
    default: module.RichEditor,
  }))
);

// Form schema for virtual tour comprehensive information
export const virtualTourFormSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for updates
  name: z.string().nonempty('Tour name is required').max(100, 'Tour name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  price: z.number().min(0, 'Price must be at least 0').optional(),
  // Metadata fields
  metadata: z
    .object({
      richDescription: z.string().optional(),
      images: z.array(ZodFileData.nullable()).optional(),
    })
    .optional(),
});

export const virtualTourFormCreateSchema = z.object({
  name: z.string().nonempty('Tour name is required').max(100, 'Tour name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export type VirtualTourFormData = z.infer<typeof virtualTourFormSchema>;

export interface VirtualTourFormProps {
  defaultValues?: Partial<VirtualTourFormData>;
  mode?: 'create' | 'edit'; // Mode can be 'create' or 'edit'
  onSuccess?: (data: IVirtualTour) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  showCancelButton?: boolean;
  className?: string;
  museumId: string; // ID of the museum to create the virtual tour for
}

export function VirtualTourForm({
  mode = 'create',
  onSuccess,
  onCancel,
  museumId,
  submitLabel = 'Save',
  showCancelButton = false,
}: VirtualTourFormProps) {
  const { hasPermission } = useRolebaseStore();
  // Form state
  const [openSheet, setOpenSheet] = useState(false);
  const bulkUpload = useBulkUpload();

  const virtualTour = useStudioStore(useShallow((state) => state.virtualTour));
  const createVirtualTourMutation = useCreateMuseumVirtualTour(museumId, {
    onSuccess: (data) => {
      toast.success('Virtual tour created successfully!');
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create virtual tour');
    },
  });

  const updateVirtualTourMutation = useUpdateVirtualTour({
    onSuccess: () => {
      toast.success('Virtual tour updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update virtual tour');
    },
  });

  const form = useForm<VirtualTourFormData>({
    disabled: createVirtualTourMutation.isPending || !hasPermission(museumId, PERMISSION_TOUR_MANAGEMENT),
    resolver: (data, context, options) => {
      if (mode === 'edit') {
        return zodResolver(virtualTourFormSchema)(data, context, options);
      }
      return zodResolver(virtualTourFormCreateSchema)(data, context, options);
    },
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      metadata: {
        richDescription: '',
        images: [],
      },
    },
  });
  console.log('VirtualTourForm render with virtualTour:', virtualTour);

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'metadata.images',
  });

  useEffect(() => {
    if (fields.length === 0) {
      append(null);
    }
  }, [fields.length, append]);

  const watchedImages = useWatch({ control, name: 'metadata.images' });

  // Auto-append new field if all are filled
  useEffect(() => {
    const allHaveValue = watchedImages?.every((img) => !!img);
    if (fields.length > 0 && allHaveValue) {
      append(null);
    }
  }, [watchedImages, fields, append]);

  const handleSubmit = async (data: VirtualTourFormData) => {
    try {
      // Handle bulk upload like ArtifactForm
      if (bulkUpload && bulkUpload?.getPendingFiles()?.length > 0) {
        const isAccept = await bulkUpload?.openConfirmDialog();
        if (isAccept) {
          await bulkUpload?.uploadAll();
        }
      }

      const submitFunc = mode === 'create' ? createVirtualTourMutation.mutate : updateVirtualTourMutation.mutate;

      // Get the latest form values
      const formData = form.getValues();

      // Create the virtual tour with comprehensive settings
      const virtualTourData: Partial<IVirtualTour> = {
        ...virtualTour,
        id: data?.id || '',
        name: data.name,
        description: data.description || '',
        price: data.price || 0,
        metadata: {
          ...virtualTour?.metadata,
          richDescription: formData.metadata?.richDescription || data.description || '',
          images: formData.metadata?.images?.filter((img) => img !== null) as FileData[],
        },
      };
      submitFunc(virtualTourData as IVirtualTour);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleReset = () => {
    form.reset();
  };

  useEffect(() => {
    if (virtualTour) {
      form.reset(virtualTour);
    }
  }, [virtualTour, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-2 space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>

          {/* Tour Name and Price */}
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Tên tour ảo {fieldState.error && <span className="text-destructive">*</span>}</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên tour ảo..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Sheet
            open={openSheet}
            onOpenChange={(open) => {
              if (!open && form.formState.disabled) {
                setOpenSheet(false);
              }
            }}
          >
            <SheetTrigger onClick={() => setOpenSheet(true)} asChild>
              <Card className="bg-secondary/40 hover:bg-secondary/80 hover:cursor-pointer">
                <CardContent className="flex gap-2 relative">
                  <FileText className="h-5 w-5 shrink-0 text-gray-400" />
                  {form.watch('description') ? (
                    <div className="flex justify-start flex-col gap-2">
                      <p className="font-semibold text-sm text-primary/80 text-start">Mô tả tour ảo</p>
                      <p className="text-sm text-gray-500 text-start">{form.watch('description')}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-sm text-primary/80">Thêm mô tả</span>
                      {form.formState.errors.description && (
                        <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl" dir="right">
              <SheetHeader>
                <SheetTitle>Thêm mô tả tour ảo</SheetTitle>
                <SheetDescription>
                  Mô tả chi tiết về tour ảo, bao gồm thông tin quan trọng, nội dung và các chi tiết khác.
                </SheetDescription>
              </SheetHeader>
              <React.Suspense fallback={<div className="w-full justify-center">Đang tải trình soạn thảo...</div>}>
                <RichEditor
                  readOnly={form.formState.disabled}
                  value={form.watch('metadata.richDescription')}
                  onChange={(editorStateTextString) => {
                    form.setValue('description', editorStateTextString, {
                      shouldTouch: true,
                    });
                  }}
                  onSave={(content) => {
                    setOpenSheet(false);
                    setTimeout(() => form.setValue('metadata.richDescription', content), 100);
                  }}
                  toolbarConfig={{ showFontFamily: false }}
                  showToolbar
                  placeholder="Nhập nội dung mô tả tour ảo..."
                />
              </React.Suspense>
            </SheetContent>
          </Sheet>

          {/* Description with Rich Editor */}
          {mode === 'edit' && (
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá tour (VNĐ)</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="Nhập giá tour ảo" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Media Section */}
        {mode === 'edit' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hình ảnh tour ảo</h3>

            {/* Multiple Images Upload (Dynamic) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel className="text-gray-600">Hình ảnh mô tả</FormLabel>
                <span className="text-sm text-muted-foreground">
                  Thêm nhiều hình ảnh, trường mới sẽ tự động xuất hiện
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-2 relative">
                    <FormDropZone
                      name={`metadata.images.${index}`}
                      control={form.control}
                      mediaType={MediaType.IMAGE}
                      description=""
                      manualUpload={false}
                      withUrl={true}
                      urlPlaceholder="https://example.com/image.jpg"
                      className="min-h-[100px]"
                    />
                    {fields.length > 1 && (
                      <Button
                        disabled={form.formState.disabled}
                        type="button"
                        onClick={() => remove(index)}
                        variant="destructive"
                        size="sm"
                        className="absolute top-0 transform -translate-y-1/2 right-1"
                      >
                        Xóa
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {hasPermission(museumId, PERMISSION_TOUR_MANAGEMENT) && (
          <div className="flex gap-2 pt-6 border-t">
            {showCancelButton && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleReset();
                  onCancel?.();
                }}
                disabled={createVirtualTourMutation.isPending || updateVirtualTourMutation.isPending}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={createVirtualTourMutation.isPending || updateVirtualTourMutation.isPending}
              className="flex-1"
            >
              {(createVirtualTourMutation.isPending || updateVirtualTourMutation.isPending) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {submitLabel}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
