'use client';

import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, UserCheck, Loader2 } from 'lucide-react';

import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Avatar, AvatarFallback, AvatarImage, toast } from '@musetrip360/ui-core';
import { useUpdateTourGuide, TourGuideUpdateDto, TourGuide } from '@musetrip360/user-management';

const editTourGuideSchema = z.object({
  name: z.string().min(1, 'Tên hướng dẫn viên là bắt buộc').max(100, 'Tên phải ít hơn 100 ký tự'),
  bio: z.string().max(1000, 'Giới thiệu phải ít hơn 1000 ký tự').optional(),
  specializations: z.string().max(500, 'Chuyên ngành phải ít hơn 500 ký tự').optional(),
  languages: z.string().max(200, 'Ngôn ngữ phải ít hơn 200 ký tự').optional(),
  experience: z.string().max(500, 'Kinh nghiệm phải ít hơn 500 ký tự').optional(),
});

type EditTourGuideFormData = z.infer<typeof editTourGuideSchema>;

interface EditTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  tourGuide: TourGuide;
}

const EditTourGuide: React.FC<EditTourGuideProps> = ({ isOpen, onClose, onSuccess, tourGuide }) => {
  const { mutate: updateTourGuide, isPending: isSubmitting } = useUpdateTourGuide({
    onSuccess: () => {
      form.reset();
      toast.success('Cập nhật hướng dẫn viên thành công');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Cập nhật hướng dẫn viên thất bại');
    },
  });

  const form = useForm<EditTourGuideFormData>({
    resolver: zodResolver(editTourGuideSchema),
    defaultValues: {
      name: '',
      bio: '',
      specializations: '',
      languages: '',
      experience: '',
    },
  });

  // Populate form with current tour guide data
  useEffect(() => {
    if (isOpen && tourGuide) {
      form.reset({
        name: tourGuide.name || '',
        bio: tourGuide.bio || '',
        specializations: tourGuide.metadata?.specializations || '',
        languages: tourGuide.metadata?.languages || '',
        experience: tourGuide.metadata?.experience || '',
      });
    }
  }, [isOpen, tourGuide, form]);

  const handleSubmit = useCallback(
    async (data: EditTourGuideFormData) => {
      const tourGuideData: TourGuideUpdateDto = {
        id: tourGuide.id,
        name: data.name,
        bio: data.bio || '',
        metadata: {
          ...tourGuide.metadata,
          specializations: data.specializations || '',
          languages: data.languages || '',
          experience: data.experience || '',
        },
      };

      updateTourGuide(tourGuideData);
    },
    [tourGuide, updateTourGuide]
  );

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Chỉnh sửa hướng dẫn viên</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Display current user info */}
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src={tourGuide.user.avatarUrl ?? ''} />
            <AvatarFallback>{tourGuide.user.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-sm">{tourGuide.user.fullName}</div>
            <div className="text-xs text-gray-500">{tourGuide.user.email}</div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên hoặc nickname *</label>
              <Input {...form.register('name')} placeholder="Tên hiển thị của hướng dẫn viên" className="w-full" />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ngôn ngữ</label>
              <Input
                {...form.register('languages')}
                placeholder="Ví dụ: Tiếng Việt, Tiếng Anh, Tiếng Pháp"
                className="w-full"
              />
              {form.formState.errors.languages && (
                <p className="text-sm text-red-600">{form.formState.errors.languages.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Giới thiệu</label>
            <Textarea
              {...form.register('bio')}
              placeholder="Tiểu sử và nền tảng của hướng dẫn viên"
              rows={4}
              className="w-full resize-none"
            />
            {form.formState.errors.bio && <p className="text-sm text-red-600">{form.formState.errors.bio.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Chuyên ngành</label>
            <Textarea
              {...form.register('specializations')}
              placeholder="Lĩnh vực chuyên môn, kiến thức đặc biệt hoặc chủ đề tour"
              rows={3}
              className="w-full resize-none"
            />
            {form.formState.errors.specializations && (
              <p className="text-sm text-red-600">{form.formState.errors.specializations.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Kinh nghiệm</label>
            <Textarea
              {...form.register('experience')}
              placeholder="Số năm kinh nghiệm, thành tích nổi bật hoặc chứng chỉ"
              rows={3}
              className="w-full resize-none"
            />
            {form.formState.errors.experience && (
              <p className="text-sm text-red-600">{form.formState.errors.experience.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Huỷ
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Cập nhật
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTourGuide;
