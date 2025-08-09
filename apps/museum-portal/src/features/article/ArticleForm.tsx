import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { toast } from '@musetrip360/ui-core/sonner';
import { Save, Send } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';
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

const articleFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().optional(),
  mainImageUpload: z.any().optional(),
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
  const [isUploadingImages, setIsUploadingImages] = useState(false);

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
      toast.success('Article saved successfully');
      onSuccess?.(data);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to save article');
      console.error('Create article error:', error);
    },
  });

  const { mutate: updateArticle, isPending: isUpdating } = useUpdateArticle({
    onSuccess: (data) => {
      toast.success('Article updated successfully');
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error('Failed to update article');
      console.error('Update article error:', error);
    },
  });

  const onSubmit = async (data: ArticleFormData, status: ArticleStatusEnum) => {
    try {
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
      toast.error('Failed to upload image. Please try again.');
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
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter article title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content *</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter article content" className="min-h-[200px] resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thumbnail Upload */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {/* URL Input (for existing images or manual URLs) */}
                    <Input type="url" placeholder="https://example.com/image.jpg" disabled={isPending} {...field} />

                    {/* File Upload */}
                    <div className="text-sm text-gray-500">Or upload file:</div>
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
              Save as Draft
            </Button>

            <Button
              type="button"
              onClick={handleSubmitForApproval}
              disabled={isPending}
              className="flex-1 sm:flex-initial"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit for Approval
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isPending}
                className="flex-1 sm:flex-initial"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ArticleForm;
