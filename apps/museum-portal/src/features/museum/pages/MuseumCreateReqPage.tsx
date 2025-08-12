'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, RotateCcw, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import Divider from '@/components/Divider';
import PublicHeader from '@/layouts/components/Header/PublicHeader';
import { useCreateMuseumRequest } from '@musetrip360/museum-management';
import { FormDropZone, MediaType, useFileUpload } from '@musetrip360/shared';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';

// Validation schema for museum request creation
const museumRequestSchema = z.object({
  museumName: z.string().min(1, 'Tên bảo tàng là bắt buộc').min(3, 'Tên bảo tàng phải có ít nhất 3 ký tự'),
  museumDescription: z.string().min(1, 'Mô tả là bắt buộc').min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  location: z.string().min(1, 'Địa chỉ là bắt buộc').min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  contactEmail: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  contactPhone: z.string().min(1, 'Số điện thoại là bắt buộc').min(10, 'Số điện thoại phải có ít nhất 10 số'),
  documents: z.array(z.union([z.string(), z.any()])).optional(),
  images: z.array(z.union([z.string(), z.any()])).optional(),
});

type MuseumRequestFormData = z.infer<typeof museumRequestSchema>;

const MuseumCreateReqPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);

  const uploadFileMutation = useFileUpload();

  const { mutate: createMuseumRequest, isPending: isCreating } = useCreateMuseumRequest({
    onSuccess: () => {
      setSuccessMessage(
        'Yêu cầu tạo bảo tàng đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.'
      );
      setSubmitError(null);
      form.reset();
    },
    onError: (error) => {
      setSubmitError('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
      console.error('Create museum request error:', error);
    },
  });

  const form = useForm<MuseumRequestFormData>({
    resolver: zodResolver(museumRequestSchema),
    defaultValues: {
      museumName: '',
      museumDescription: '',
      location: '',
      contactEmail: '',
      contactPhone: '',
      documents: [],
      images: [],
    },
  });

  const { control } = form;
  const {
    fields: documentFields,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({
    control,
    name: 'documents',
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: 'images',
  });

  const watchedDocuments = useWatch({ control, name: 'documents' });
  const watchedImages = useWatch({ control, name: 'images' });

  useEffect(() => {
    if (documentFields.length === 0) {
      appendDocument('');
    }
    if (imageFields.length === 0) {
      appendImage('');
    }
  }, [documentFields.length, appendDocument, imageFields.length, appendImage]);

  // Auto-append new field if all are filled
  useEffect(() => {
    const allDocumentsHaveValue = watchedDocuments?.every((doc) => !!doc);
    if (documentFields.length > 0 && allDocumentsHaveValue) {
      appendDocument('');
    }

    const allImagesHaveValue = watchedImages?.every((img) => !!img);
    if (imageFields.length > 0 && allImagesHaveValue) {
      appendImage('');
    }
  }, [watchedDocuments, documentFields, appendDocument, watchedImages, imageFields, appendImage]);

  const isPending = isCreating || isUploadingDocs;

  const handleSubmit = async (data: MuseumRequestFormData) => {
    try {
      setSubmitError(null);
      setSuccessMessage(null);
      setIsUploadingDocs(true);

      const validDocs = (data.documents || []).filter(Boolean).map((doc) => doc.file);
      const validImages = (data.images || []).filter(Boolean).map((img) => img.file);

      const uploadedDocUrls: string[] = [];
      for (const doc of validDocs) {
        if (typeof doc === 'object' && doc !== null && 'name' in doc && 'type' in doc) {
          const result = await uploadFileMutation.mutateAsync(doc as File);
          console.log('Uploaded document result:', result);
          uploadedDocUrls.push(result.data.url);
        } else if (typeof doc === 'string') {
          uploadedDocUrls.push(doc);
        }
      }

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

      createMuseumRequest({
        museumName: data.museumName,
        museumDescription: data.museumDescription,
        location: data.location,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        submittedAt: new Date().toISOString(),
        createdBy: '', // This will be set on the backend based on authenticated user
        categories: [], // Empty categories initially
        createdByUser: {
          id: '',
          username: '',
          fullName: '',
          email: '',
          authType: '',
          status: '',
          lastLogin: '',
        }, // This will be populated on the backend
        metadata: {
          documents: uploadedDocUrls,
          images: uploadedImageUrls,
        },
      });
    } catch (error) {
      setSubmitError('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
      console.error('Submit error:', error);
    } finally {
      setIsUploadingDocs(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setSuccessMessage(null);
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Header */}
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký bảo tàng mới</h1>
          <p className="text-gray-600 mb-4">
            Vui lòng điền đầy đủ thông tin để đăng ký bảo tàng của bạn vào hệ thống MuseTrip360.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
                <span>Yêu cầu đăng ký sẽ được xem xét trong vòng 3-5 ngày làm việc.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
                <span>Bạn sẽ nhận được email thông báo kết quả xét duyệt.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
                <span>Sau khi được phê duyệt, bạn có thể bắt đầu quản lý bảo tàng trên hệ thống.</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 mr-3"></span>
                <span>Mọi thông tin cần được điền chính xác và đầy đủ để tránh bị từ chối.</span>
              </li>
            </ul>
          </div>
        </div>

        <Divider margin={8} />

        <div className="">
          {/* Success Message */}
          {successMessage && (
            <div className="animate-in slide-in-from-bottom-1 duration-200 rounded-md bg-green-50 p-4 text-sm text-green-800 border border-green-200 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="animate-in slide-in-from-top-1 duration-200 rounded-md bg-destructive/15 p-4 text-sm text-destructive border border-destructive/20 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* First Row - Museum Name and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="museumName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600">
                        Tên bảo tàng <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên bảo tàng" disabled={isPending} {...field} />
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
                      <FormLabel className="text-gray-600">
                        Địa chỉ <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ bảo tàng" disabled={isPending} {...field} />
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
                      <FormLabel className="text-gray-600">
                        Email liên hệ <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Nhập email liên hệ" disabled={isPending} {...field} />
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
                      <FormLabel className="text-gray-600">
                        Số điện thoại <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Nhập số điện thoại" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Third Row - Description (Full Width) */}
              <FormField
                control={form.control}
                name="museumDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-600">
                      Mô tả bảo tàng <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả chi tiết về bảo tàng, bao gồm lịch sử, hoạt động chính, và những gì đặc biệt của bảo tàng..."
                        rows={6}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Multiple Images Upload (Dynamic) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-gray-600">Hình ảnh bảo tàng</FormLabel>
                  <span className="text-sm text-muted-foreground">
                    Thêm nhiều hình ảnh, trường mới sẽ tự động xuất hiện
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                        >
                          Xóa
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Multiple Documents Upload (Dynamic) */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-gray-600">
                    Thêm các tài liệu cần thiết để quy trình duyệt nhanh chóng minh bạch
                  </FormLabel>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {documentFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-2 space-y-2 relative">
                      <FormDropZone
                        name={`documents.${index}`}
                        control={control}
                        mediaType={MediaType.DOCUMENT}
                        label={''}
                        description={''}
                      />
                      {documentFields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeDocument(index)}
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button type="submit" disabled={isPending} className="gap-2 flex-1 sm:flex-none">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isPending ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu đăng ký'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isPending}
                  className="gap-2 flex-1 sm:flex-none"
                >
                  <RotateCcw className="h-4 w-4" />
                  Đặt lại form
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MuseumCreateReqPage;
