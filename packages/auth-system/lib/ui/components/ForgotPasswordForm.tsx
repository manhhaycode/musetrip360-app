'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@musetrip360/ui-core/button';
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

import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../validation';
import { useAuthActionContext } from '@/state/context/auth-action/auth-action.context';

export function ForgotPasswordForm() {
  const { onSubmit, isLoading, error, successMessage, setCurrentStep } = useAuthActionContext();
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    try {
      onSubmit(data.email);
    } catch (error) {
      console.error('Forgot password submission error:', error);
    }
  };

  return (
    <div className="space-y-6 px-5">
      {/* Success Message */}
      {successMessage && (
        <div className="animate-in slide-in-from-bottom-1 duration-200 rounded-md bg-green-50 p-3 text-sm text-green-800 border border-green-200">
          {successMessage}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="animate-in slide-in-from-top-1 duration-200 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 max-h-[70vh] px-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Nhập địa chỉ email của bạn"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Chúng tôi sẽ gửi mã xác thực 6 chữ số đến địa chỉ email này.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Đang gửi mã...' : 'Gửi mã xác thực'}
          </Button>
        </form>
      </Form>

      {/* Back to Login */}
      <div className="flex items-center justify-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setCurrentStep.bind(null, 'login')}
          disabled={isLoading}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Button>
      </div>

      {/* Instructions */}
      <div className="rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
        <p className="font-medium mb-2">Điều gì sẽ xảy ra tiếp theo?</p>
        <ol className="space-y-1 list-decimal list-inside">
          <li>Kiểm tra email của bạn để nhận mã xác thực 6 chữ số</li>
          <li>Nhập mã cùng với mật khẩu mới của bạn</li>
          <li>Mật khẩu của bạn sẽ được cập nhật và bạn có thể đăng nhập</li>
        </ol>
        <p className="mt-3 text-xs">Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau vài phút.</p>
      </div>
    </div>
  );
}
