import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@musetrip360/ui-core';
import { Building2 } from 'lucide-react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { MUSEUM_CATEGORIES } from '../types';
import { MuseumFormData, museumFormSchema } from './schemas';
import { FormModalProps } from './types';

interface MuseumFormProps extends FormModalProps<MuseumFormData> {
  mode: 'add' | 'edit';
}

export default function MuseumForm({
  open,
  onClose,
  title,
  onSubmit,
  defaultValues,
  isLoading = false,
  mode,
}: MuseumFormProps) {
  const form = useForm<MuseumFormData>({
    resolver: zodResolver(museumFormSchema),
    defaultValues: defaultValues || {
      name: '',
      description: '',
      category: 'history',
      location: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      openingHours: '',
      ticketPrice: '',
      status: 'active',
    },
  });

  const handleSubmit = (data: MuseumFormData) => {
    onSubmit(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Thêm thông tin bảo tàng mới vào hệ thống' : 'Cập nhật thông tin bảo tàng'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Thông tin cơ bản</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'name'> }) => (
                    <FormItem>
                      <FormLabel>Tên bảo tàng *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên bảo tàng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'category'> }) => (
                    <FormItem>
                      <FormLabel>Danh mục *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'description'> }) => (
                  <FormItem>
                    <FormLabel>Mô tả *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Mô tả về bảo tàng" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Thông tin địa điểm</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'location'> }) => (
                    <FormItem>
                      <FormLabel>Thành phố *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: Hà Nội" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'status'> }) => (
                    <FormItem>
                      <FormLabel>Trạng thái *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Hoạt động</SelectItem>
                          <SelectItem value="inactive">Không hoạt động</SelectItem>
                          <SelectItem value="pending">Chờ duyệt</SelectItem>
                          <SelectItem value="suspended">Tạm khóa</SelectItem>
                          <SelectItem value="maintenance">Bảo trì</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'address'> }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ chi tiết *</FormLabel>
                    <FormControl>
                      <Input placeholder="Số nhà, tên đường, quận/huyện" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Thông tin liên hệ</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'phone'> }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại *</FormLabel>
                      <FormControl>
                        <Input placeholder="0xx-xxxx-xxxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'email'> }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="info@museum.vn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'website'> }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://museum.vn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Operational Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Thông tin vận hành</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="openingHours"
                  render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'openingHours'> }) => (
                    <FormItem>
                      <FormLabel>Giờ mở cửa *</FormLabel>
                      <FormControl>
                        <Input placeholder="8:00 - 17:00 (Thứ 2 - Chủ nhật)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ticketPrice"
                  render={({ field }: { field: ControllerRenderProps<MuseumFormData, 'ticketPrice'> }) => (
                    <FormItem>
                      <FormLabel>Giá vé *</FormLabel>
                      <FormControl>
                        <Input placeholder="50,000 VND" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
                {isLoading ? 'Đang xử lý...' : mode === 'add' ? 'Thêm bảo tàng' : 'Cập nhật'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
