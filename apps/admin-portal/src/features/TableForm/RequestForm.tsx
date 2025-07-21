import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@musetrip360/ui-core/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@musetrip360/ui-core/select';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { FileText } from 'lucide-react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { MUSEUM_CATEGORIES } from '../types';
import { MuseumRequestFormData, museumRequestFormSchema } from './schemas';
import { FormModalProps } from './types';

interface RequestFormProps extends FormModalProps<MuseumRequestFormData> {
  mode: 'add' | 'edit' | 'review';
}

export default function RequestForm({
  open,
  onClose,
  title,
  onSubmit,
  defaultValues,
  isLoading = false,
  mode,
}: RequestFormProps) {
  const form = useForm<MuseumRequestFormData>({
    resolver: zodResolver(museumRequestFormSchema),
    defaultValues: defaultValues || {
      name: '',
      description: '',
      category: 'history',
      location: '',
      address: '',
      contact: '',
      phone: '',
      email: '',
      website: '',
      status: 'pending',
      rejectionReason: '',
    },
  });

  const handleSubmit = (data: MuseumRequestFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isReviewMode = mode === 'review';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' && 'Thêm yêu cầu đăng ký bảo tàng mới'}
            {mode === 'edit' && 'Cập nhật thông tin yêu cầu đăng ký'}
            {mode === 'review' && 'Xem xét và phê duyệt yêu cầu đăng ký bảo tàng'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-slate-900">Thông tin bảo tàng</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'name'> }) => (
                    <FormItem>
                      <FormLabel>Tên bảo tàng *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên bảo tàng" disabled={isReviewMode} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'category'> }) => (
                    <FormItem>
                      <FormLabel>Danh mục *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isReviewMode}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(MUSEUM_CATEGORIES).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'description'> }) => (
                  <FormItem>
                    <FormLabel>Mô tả *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả về bảo tàng"
                        className="min-h-[100px]"
                        disabled={isReviewMode}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-slate-900">Thông tin địa điểm</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'location'> }) => (
                    <FormItem>
                      <FormLabel>Thành phố *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: Hà Nội" disabled={isReviewMode} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'website'> }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://museum.vn" disabled={isReviewMode} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'address'> }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ chi tiết *</FormLabel>
                    <FormControl>
                      <Input placeholder="Số nhà, tên đường, quận/huyện" disabled={isReviewMode} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-slate-900">Thông tin liên hệ</h3>

              <FormField
                control={form.control}
                name="contact"
                render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'contact'> }) => (
                  <FormItem>
                    <FormLabel>Tên người liên hệ *</FormLabel>
                    <FormControl>
                      <Input placeholder="Họ và tên người đại diện" disabled={isReviewMode} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'phone'> }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại *</FormLabel>
                      <FormControl>
                        <Input placeholder="0xx-xxxx-xxxx" disabled={isReviewMode} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'email'> }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="info@museum.vn" disabled={isReviewMode} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Review Section - Only for review mode */}
            {isReviewMode && (
              <div className="space-y-4">
                <h3 className="text-base font-medium text-slate-900">Kết quả xét duyệt</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'status'> }) => (
                      <FormItem>
                        <FormLabel>Trạng thái *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                            <SelectItem value="under_review">Đang xem xét</SelectItem>
                            <SelectItem value="approved">Phê duyệt</SelectItem>
                            <SelectItem value="rejected">Từ chối</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Show rejection reason field if status is rejected */}
                {form.watch('status') === 'rejected' && (
                  <FormField
                    control={form.control}
                    name="rejectionReason"
                    render={({ field }: { field: ControllerRenderProps<MuseumRequestFormData, 'rejectionReason'> }) => (
                      <FormItem>
                        <FormLabel>Lý do từ chối</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Nhập lý do từ chối yêu cầu" className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
                {isLoading && 'Đang xử lý...'}
                {!isLoading && mode === 'add' && 'Thêm yêu cầu'}
                {!isLoading && mode === 'edit' && 'Cập nhật'}
                {!isLoading && mode === 'review' && 'Xác nhận'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
