import { zodResolver } from '@hookform/resolvers/zod';
import {
  Article,
  ArticleCreate,
  ArticleStatusEnum,
  DataEntityType,
  useCreateArticle,
  useUpdateArticle,
} from '@musetrip360/museum-management';
import { PERMISSION_CONTENT_MANAGEMENT, useRolebaseStore } from '@musetrip360/rolebase-management';
import { FormDropZone, MediaType, useBulkUpload, useFileUpload, ZodFileData } from '@musetrip360/shared';
import { Button } from '@musetrip360/ui-core/button';
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
import { FileText, Save, Send } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card, CardContent } from '@musetrip360/ui-core/card';

const RichEditor = React.lazy(() =>
  import('@musetrip360/rich-editor').then((module) => ({
    default: module.RichEditor,
  }))
);

const articleFormSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(255, 'Tiêu đề phải có ít nhất 255 ký tự'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  previewContent: z.string().optional(),
  metadata: z
    .object({
      thumbnail: ZodFileData.nullable().optional(),
    })
    .optional(),
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
  const bulkUpload = useBulkUpload();

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: article?.title || '',
      content: article?.content || '',
      metadata: {
        thumbnail: {
          file: article?.metadata?.thumbnail || null,
          mediaType: MediaType.IMAGE,
        },
      },
    },
  });

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

      // Handle bulk upload like EventBasicInfoForm
      if (bulkUpload && bulkUpload?.getPendingFiles()?.length > 0) {
        const isAccept = await bulkUpload?.openConfirmDialog();
        if (isAccept) {
          await bulkUpload?.uploadAll();
        }
      }

      const formData = form.getValues();

      const articleData: ArticleCreate | (Article & { id: string }) = {
        title: formData.title,
        content: formData.content,
        status,
        publishedAt: status === ArticleStatusEnum.Published ? new Date().toISOString() : '',
        museumId: museumId,
        dataEntityType: DataEntityType.Museum,
        entityId: museumId,
        metadata: {
          thumbnail: (formData.metadata?.thumbnail?.file as string) || '',
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
          <FormDropZone
            label="Thumbnail"
            description=""
            manualUpload={false}
            withUrl={true}
            urlPlaceholder="https://example.com/image.jpg"
            className="min-h-[100px]"
            name="metadata.thumbnail"
            control={form.control}
            mediaType={MediaType.IMAGE}
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
