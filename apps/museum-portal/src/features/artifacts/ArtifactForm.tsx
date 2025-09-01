'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, FileText, Loader2, Plus, Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { string, z } from 'zod';

import Divider from '@/components/Divider';
import {
  Artifact,
  ArtifactCreateDto,
  ArtifactUpdateDto,
  useCreateArtifact,
  useUpdateArtifact,
} from '@musetrip360/artifact-management';
import { useMuseumStore } from '@musetrip360/museum-management';
import { PERMISSION_ARTIFACT_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';
import {
  FileData,
  FormDropZone,
  getFileName,
  HistoricalPeriod,
  MediaType,
  useBulkUpload,
  useHistoricalPeriod,
  ZodFileData,
} from '@musetrip360/shared';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@musetrip360/ui-core/sheet';
import { toast } from '@musetrip360/ui-core/sonner';
import { Switch } from '@musetrip360/ui-core/switch';
import { GLTFViewer } from '@musetrip360/virtual-tour/canvas';
import { useAudioAIGenerate } from '@musetrip360/ai-bot/api';

const RichEditor = React.lazy(() =>
  import('@musetrip360/rich-editor').then((module) => ({
    default: module.RichEditor,
  }))
);

// Validation schema for artifact form
const artifactSchema = z.object({
  name: z.string().min(1, 'Tên hiện vật là bắt buộc').min(3, 'Tên hiện vật phải có ít nhất 3 ký tự'),
  description: z.string().min(1, 'Mô tả là bắt buộc').min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  historicalPeriod: z.string().min(1, 'Thời kỳ lịch sử là bắt buộc'),
  image: ZodFileData.nullable(),
  model3D: ZodFileData.nullable(),
  isActive: z.boolean(),
  // Metadata fields
  type: z.string(),
  material: z.string(),
  discoveryLocation: z.string(),
  metadata: z.object({
    richDescription: string().optional(),
    audio: ZodFileData.nullable().optional(),
    isUseVoiceAI: z.boolean().optional(),
    voiceAI: ZodFileData.nullable().optional(),
    images: z.array(ZodFileData.nullable()).optional(),
  }),
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
  const { hasPermission } = useRolebaseStore();

  const { data: historicalPeriods } = useHistoricalPeriod();
  const bulkUpload = useBulkUpload();

  console.log('Historical Periods:', historicalPeriods);

  // Form state
  const [isEditing, setIsEditing] = useState(mode === 'create');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredPeriods, setFilteredPeriods] = useState<HistoricalPeriod[]>([]);
  const [isPreviewArtifact, setIsPreviewArtifact] = useState(false);

  const [openSheet, setOpenSheet] = useState(false);

  // Use defaultValues if provided, no need to fetch from API
  const artifact = defaultValues;

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

  const { mutateAsync: generateAIVoice } = useAudioAIGenerate();

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
        image: artifact.imageUrl
          ? {
              file: artifact.imageUrl,
              mediaType: MediaType.IMAGE,
              fileName: artifact.metadata.imageName || 'Image',
            }
          : null,
        model3D: artifact.model3DUrl
          ? {
              file: artifact.model3DUrl,
              mediaType: MediaType.MODEL3D,
              fileName: artifact.metadata.model3DName,
            }
          : null,
        isActive: artifact.isActive,
        type: artifact.metadata?.type || '',
        material: artifact.metadata?.material || '',
        discoveryLocation: artifact.metadata?.discoveryLocation || '',
        metadata: {
          audio: artifact.metadata?.audio,
          images: artifact.metadata?.images || [],
          richDescription: artifact.metadata?.richDescription || artifact.description || '',
          isUseVoiceAI: artifact.metadata?.isUseVoiceAI || false,
          voiceAI: artifact.metadata?.voiceAI || null,
        },
      };
    }

    // Default empty values for create mode
    return {
      name: '',
      description: '',
      historicalPeriod: '',
      image: null,
      model3D: null,
      isActive: true,
      type: '',
      material: '',
      discoveryLocation: '',
      metadata: {
        images: [],
      },
    };
  };

  const form = useForm<ArtifactFormData>({
    disabled: !isEditing || isPending,
    resolver: zodResolver(artifactSchema),
    defaultValues: getFormDefaultValues(),
  });

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
        form.reset(getFormDefaultValues());
      }
    }
  };

  const onSubmit = async (data: ArtifactFormData) => {
    try {
      if (!hasPermission(selectedMuseum.id, PERMISSION_ARTIFACT_MANAGEMENT)) {
        toast.error('Bạn không có quyền thực hiện thao tác này.');
        return;
      }

      setError(null);
      setIsUploadingImages(true);

      // Handle bulk upload like EventBasicInfoForm
      if (bulkUpload && bulkUpload?.getPendingFiles()?.length > 0) {
        const isAccept = await bulkUpload?.openConfirmDialog();
        if (isAccept) {
          await bulkUpload?.uploadAll();
        }
      }

      const formData = form.getValues();

      // Prepare the payload
      const payload: Partial<Artifact> = {
        name: data.name,
        description: data.description,
        historicalPeriod: data.historicalPeriod,
        imageUrl: (formData.image?.file as string) || '',
        model3DUrl: (formData.model3D?.file as string) || '',
        isActive: data.isActive,
        metadata: {
          type: data.type,
          material: data.material,
          discoveryLocation: data.discoveryLocation,
          isUseVoiceAI: formData.metadata.isUseVoiceAI || false,
          voiceAI: formData.metadata.voiceAI,
          audio: formData.metadata.audio || null,
          images: formData.metadata.images?.filter((img) => img !== null) as FileData[],
          imageName: formData.image?.fileName || '',
          model3DName: formData.model3D?.fileName || '',
          richDescription: formData.metadata.richDescription || data.description || '',
        },
      };

      if (
        formData.metadata.isUseVoiceAI &&
        (artifact?.description !== payload.description ||
          (artifact?.metadata.isUseVoiceAI !== payload.metadata?.isUseVoiceAI && !artifact?.metadata.voiceAI))
      ) {
        toast.loading('Tạo file voice AI...', { id: 'generate-voice' });
        payload.metadata!['voiceAI'] = {
          file: (await generateAIVoice(payload.description || '')).audioUrl,
          fileName: `voice-ai-${data.name}.mp3`,
          mediaType: MediaType.AUDIO,
        };
        toast.success('Tạo file voice AI thành công!', { id: 'generate-voice' });
      }

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
          <form
            style={{ ...(isPreviewArtifact && { display: 'none' }) }}
            id="artifact-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col"
          >
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
                    <FormItem className="relative">
                      <FormLabel className="text-gray-600">Thời kỳ lịch sử</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Nhập thời kỳ lịch sử"
                            disabled={(mode === 'edit' && !isEditing) || isPending}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);

                              if (value.length > 0 && historicalPeriods) {
                                const filtered = historicalPeriods.filter(
                                  (period: HistoricalPeriod) =>
                                    period.name.toLowerCase().includes(value.toLowerCase()) ||
                                    period.description?.toLowerCase().includes(value.toLowerCase())
                                );
                                setFilteredPeriods(filtered);
                                setShowSuggestions(filtered.length > 0);
                              } else {
                                setShowSuggestions(false);
                              }
                            }}
                            onFocus={() => {
                              if (field.value && historicalPeriods) {
                                const filtered = historicalPeriods.filter(
                                  (period: HistoricalPeriod) =>
                                    period.name.toLowerCase().includes(field.value.toLowerCase()) ||
                                    period.description?.toLowerCase().includes(field.value.toLowerCase())
                                );
                                setFilteredPeriods(filtered);
                                setShowSuggestions(filtered.length > 0);
                              }
                            }}
                            onBlur={() => {
                              // Delay hiding suggestions to allow clicking on them
                              setTimeout(() => setShowSuggestions(false), 150);
                            }}
                          />

                          {showSuggestions && filteredPeriods.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                              {filteredPeriods.map((period: HistoricalPeriod) => (
                                <div
                                  key={period.id}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                  onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent onBlur from firing
                                    field.onChange(period.name);
                                    setShowSuggestions(false);
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{period.name}</span>
                                    {period.description && (
                                      <span className="text-xs text-gray-500">{period.description}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
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
              <Sheet
                open={openSheet}
                onOpenChange={(open) => {
                  if (!open && form.formState.disabled) {
                    setOpenSheet(false);
                  }
                }}
              >
                <SheetTrigger onClick={() => setOpenSheet(true)} asChild>
                  <Card className="bg-secondary/40 hover:bg-secondary/80! hover:cursor-pointer flex-1">
                    <CardContent className="flex gap-2 relative">
                      <FileText className="h-5 w-5 shrink-0 text-gray-400" />
                      {form.watch('description') ? (
                        <div className="flex justify-start flex-col gap-2">
                          <p className="font-semibold text-sm text-primary/80 text-start">Mô tả hiện vật</p>
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
                    <SheetTitle>Thêm mô tả hiện vật</SheetTitle>
                    <SheetDescription>
                      Mô tả chi tiết về hiện vật, bao gồm thông tin quan trọng, nội dung và các chi tiết khác.
                    </SheetDescription>
                  </SheetHeader>
                  <React.Suspense fallback={<div className="w-full justify-center">Đang tải trình soạn thảo...</div>}>
                    <RichEditor
                      readOnly={form.formState.disabled}
                      value={form.watch('metadata.richDescription')}
                      onChange={(editorStateTextString) => {
                        console.log(editorStateTextString === artifact?.description);
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
                      placeholder="Nhập nội dung..."
                    />
                  </React.Suspense>
                </SheetContent>
              </Sheet>

              <div className="grid grid-cols-2 gap-4">
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
                <FormField
                  control={form.control}
                  name="metadata.isUseVoiceAI"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 rounded-lg border p-3 shadow-sm">
                      <div className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel className="text-gray-600">Giọng nói AI</FormLabel>
                          <p className="text-sm text-gray-500">Hiện vật có dùng giọng nói AI không?</p>
                        </div>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={(mode === 'edit' && !isEditing) || isPending}
                        />
                      </div>
                      {form.watch('metadata.isUseVoiceAI') && form.watch('metadata.voiceAI')?.file && (
                        <div className="flex flex-col mt-2 items-center w-full">
                          <audio src={form.watch('metadata.voiceAI')!.file as string} className="w-full" controls />
                          <div className="mt-2 text-center">
                            <p className="text-sm font-medium">
                              {getFileName(form.watch('metadata.voiceAI') as FileData)}
                            </p>
                            <p className="text-xs text-muted-foreground">Audio file</p>
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Active Status Toggle */}

              {/* Fourth Row - Main Image Upload and 3D Model URL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <FormDropZone
                  name="image"
                  control={form.control}
                  mediaType={MediaType.IMAGE}
                  label="Thumbnail"
                  description=""
                  manualUpload={false}
                  withUrl={true}
                  urlPlaceholder="https://example.com/image.jpg"
                  className="min-h-[100px]"
                />

                <FormDropZone
                  name="model3D"
                  control={form.control}
                  mediaType={MediaType.MODEL3D}
                  onInteract={() => {
                    setIsPreviewArtifact(true);
                  }}
                  label="Mô hình 3D"
                  description=""
                  manualUpload={false}
                  withUrl={true}
                  urlPlaceholder="https://example.com/model.glb"
                  className="min-h-[100px]"
                />
                <FormDropZone
                  name="metadata.audio"
                  control={form.control}
                  mediaType={MediaType.AUDIO}
                  label="Thuyết minh về hiện vật"
                  description=""
                  manualUpload={false}
                  withUrl={true}
                  urlPlaceholder="https://example.com/audio.mp3"
                  className="min-h-[100px]"
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          </form>
        </Form>
        {isPreviewArtifact && (
          <div className="absolute inset-0 z-50 bg-black">
            <Button
              onClick={() => setIsPreviewArtifact(false)}
              variant="ghost"
              size="sm"
              className="absolute top-4 left-4 z-50 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 hover:text-white transition-all duration-200 group p-2 h-auto w-auto"
              aria-label="Đóng"
            >
              <X className="size-10 group-hover:scale-110 transition-transform" />
            </Button>
            {/* 3D Model Viewer */}
            <div className="absolute inset-0">
              <GLTFViewer
                modelUrl={form.watch('model3D')?.file as string}
                autoRotate={false}
                environmentPreset="studio"
                showShadows={true}
                cameraPosition={[50, 0, 50]}
                animations={{ autoPlay: true, loop: true }}
                className="w-full h-full"
              />
            </div>
          </div>
        )}
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
