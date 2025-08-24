import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@musetrip360/ui-core/form';
import { Input } from '@musetrip360/ui-core/input';
import { Textarea } from '@musetrip360/ui-core/textarea';
import { Switch } from '@musetrip360/ui-core/switch';
import { Button } from '@musetrip360/ui-core/button';
import { useCreatePlan } from '@musetrip360/payment-management/api';
import { PlanCreate } from '@musetrip360/payment-management';

const planCreateSchema = z.object({
  name: z.string().min(1, 'Tên gói là bắt buộc').max(100, 'Tên gói không được quá 100 ký tự'),
  description: z.string(),
  price: z.number().min(1000, 'Giá phải lớn hơn hoặc bằng 0'),
  durationDays: z.number().min(1, 'Thời hạn phải ít nhất 1 ngày').max(3650, 'Thời hạn không được quá 10 năm'),
  maxEvents: z.number().min(1, 'Số sự kiện tối đa phải ít nhất 1'),
  discountPercent: z.number().min(0, 'Giảm giá không được âm').max(100, 'Giảm giá không được quá 100%'),
  isActive: z.boolean(),
});

type PlanCreateFormData = z.infer<typeof planCreateSchema>;

interface PlanCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const PlanCreateForm = ({ open, onOpenChange, onSuccess }: PlanCreateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PlanCreateFormData>({
    resolver: zodResolver(planCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      durationDays: 30,
      maxEvents: 10,
      discountPercent: 0,
      isActive: true,
    },
  });

  const createPlan = useCreatePlan({
    onSuccess: () => {
      form.reset();
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Failed to create plan:', error);
    },
  });

  const onSubmit = async (data: PlanCreateFormData) => {
    setIsSubmitting(true);
    try {
      const planData: PlanCreate = {
        ...data,
        // Convert empty maxEvents to undefined for unlimited
        maxEvents: data.maxEvents,
        discountPercent: data.discountPercent,
      };
      await createPlan.mutateAsync(planData);
    } catch (error) {
      console.error('Create plan error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo gói đăng ký mới</DialogTitle>
          <DialogDescription>
            Tạo một gói đăng ký mới cho các bảo tàng. Điền thông tin chi tiết bên dưới.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên gói *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Gói Premium" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá (vnđ) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả chi tiết về gói đăng ký..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="durationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời hạn (ngày) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="3650"
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>1-3650 ngày</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxEvents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số sự kiện tối đa</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Ít nhất 1</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giảm giá (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>0-100%</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái hoạt động</FormLabel>
                    <FormDescription>Gói đăng ký sẽ hiển thị và có thể được mua khi được kích hoạt</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang tạo...' : 'Tạo gói'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanCreateForm;
