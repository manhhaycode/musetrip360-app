import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { toast } from '@musetrip360/ui-core/sonner';
import { FileText, Save, Send } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import React, { useState } from 'react';
import { z } from 'zod';
import {
  DataEntityType,
  Article,
  useCreateArticle,
  useUpdateArticle,
  ArticleStatusEnum,
  ArticleCreate,
} from '@musetrip360/museum-management';
import { useFileUpload, MediaType, DropZoneWithPreview } from '@musetrip360/shared';
import { PERMISSION_CONTENT_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@musetrip360/ui-core/sheet';

import { Card, CardContent } from '@musetrip360/ui-core/card';

const RichEditor = React.lazy(() =>
  import('@musetrip360/rich-editor').then((module) => ({
    default: module.RichEditor,
  }))
);

const articleFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(255, 'Tiêu đề phải có ít nhất 255 ký tự'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  imageUrl: z.string().optional(),
  mainImageUpload: z.any().optional(),
  previewContent: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

interface ArticleFormProps {
  article?: Article;
  museumId: string;
  onSuccess?: (article: Article) => void;
  onCancel?: () => void;
  className?: string;
}

const ArticleForm = ({ article, museumId, onSuccess, onCancel, className }: ArticleFormProps) => {
  const isEditing = !!article;
  const [openSheet, setOpenSheet] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const { hasPermission } = useRolebaseStore();

  // File upload mutation for images
  const uploadFileMutation = useFileUpload();

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: article?.title || '',
      content: article?.content || '',
      imageUrl: article?.metadata?.thumbnail || '',
      mainImageUpload: null,
    },
  });

  const mainImageUpload = useWatch({ control: form.control, name: 'mainImageUpload' });

  const { mutate: createArticle, isPending: isCreating } = useCreateArticle({
    onSuccess: (data) => {
      toast.success('Lưu bài viết thành công');
      onSuccess?.(data);
      form.reset();
    },
    onError: (error) => {
      toast.error('Lưu bài viết thất bại');
      console.error('Create article error:', error);
    },
  });

  const { mutate: updateArticle, isPending: isUpdating } = useUpdateArticle({
    onSuccess: (data) => {
      toast.success('Cập nhật bài viết thành công');
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error('Cập nhật bài viết thất bại');
      console.error('Update article error:', error);
    },
  });

  const onSubmit = async (data: ArticleFormData, status: ArticleStatusEnum) => {
    try {
      if (!hasPermission(museumId, PERMISSION_CONTENT_MANAGEMENT)) {
        toast.error('Bạn không có quyền thực hiện thao tác này.');
        return;
      }
      setIsUploadingImages(true);

      // Upload main image if provided via FormDropZone
      let finalImageUrl = data.imageUrl;
      if (data.mainImageUpload?.file && data.mainImageUpload.file instanceof File) {
        const mainImageResult = await uploadFileMutation.mutateAsync(data.mainImageUpload.file);
        finalImageUrl = mainImageResult.data.url;
      }

      const articleData: ArticleCreate | (Article & { id: string }) = {
        title: data.title,
        content: data.content,
        status,
        publishedAt: status === ArticleStatusEnum.Published ? new Date().toISOString() : '',
        museumId: museumId,
        dataEntityType: DataEntityType.Museum,
        entityId: museumId,
        metadata: {
          thumbnail: finalImageUrl,
        },
      };

      if (isEditing && article) {
        updateArticle({
          ...articleData,
          id: article.id,
        } as Article & { id: string });
      } else {
        createArticle(articleData as ArticleCreate);
      }
    } catch (error) {
      toast.error('Tải hình ảnh thất bại. Vui lòng thử lại.');
      console.error('Image upload error:', error);
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleSaveAsDraft = () => {
    form.handleSubmit((data) => onSubmit(data, ArticleStatusEnum.Draft))();
  };

  const handleSubmitForApproval = () => {
    form.handleSubmit((data) => onSubmit(data, ArticleStatusEnum.Pending))();
  };

  const isPending = isCreating || isUpdating || isUploadingImages;

  return (
    <div className={className}>
      <Form {...form}>
        <form className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Tiêu đề *</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề bài viết" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <Sheet open={openSheet}>
            <SheetTrigger asChild onClick={() => setOpenSheet(!openSheet)}>
              <Card className="bg-secondary/40 hover:bg-secondary/80! hover:cursor-pointer w-full">
                <CardContent className="flex gap-2 relative">
                  <FileText className="h-5 w-5 shrink-0 text-gray-400" />
                  {form.watch('content') ? (
                    <div className="flex justify-start flex-col gap-2">
                      <p className="font-semibold text-sm text-primary/80 text-start">Mô tả</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-sm text-primary/80">Thêm mô tả</span>
                      {form.formState.errors.content && (
                        <p className="text-red-500 text-xs">{form.formState.errors.content.message}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl" dir="right">
              <SheetHeader>
                <SheetTitle>Thêm mô tả</SheetTitle>
                <SheetDescription>
                  Mô tả chi tiết, bao gồm thông tin quan trọng, nội dung và các chi tiết khác.
                </SheetDescription>
              </SheetHeader>
              <React.Suspense fallback={<div className="w-full justify-center">Đang tải trình soạn thảo...</div>}>
                <RichEditor
                  value={form.watch('content')}
                  onSave={(content) => {
                    form.setValue('content', content);
                    setOpenSheet(false);
                  }}
                  toolbarConfig={{ showFontFamily: false }}
                  showToolbar
                  placeholder="Nhập nội dung..."
                />
              </React.Suspense>
            </SheetContent>
          </Sheet>

          {/* Thumbnail Upload */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Hình thu nhỏ</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {/* URL Input (for existing images or manual URLs) */}
                    <Input type="url" placeholder="https://example.com/image.jpg" disabled={isPending} {...field} />

                    {/* File Upload */}
                    <div className="text-sm text-gray-500">Hoặc tải lên file:</div>
                    <DropZoneWithPreview
                      uploadId="mainImageUpload"
                      autoRegister={true}
                      value={
                        mainImageUpload && mainImageUpload.file ? mainImageUpload.file : article?.metadata?.thumbnail
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
                      disabled={isPending}
                      manualUpload={true}
                      className="min-h-[100px]"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={isPending}
              className="flex-1 sm:flex-initial"
            >
              <Save className="mr-2 h-4 w-4" />
              Lưu nháp
            </Button>

            <Button
              type="button"
              onClick={handleSubmitForApproval}
              disabled={isPending}
              className="flex-1 sm:flex-initial"
            >
              <Send className="mr-2 h-4 w-4" />
              Gửi phê duyệt
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isPending}
                className="flex-1 sm:flex-initial"
              >
                Hủy
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ArticleForm;
