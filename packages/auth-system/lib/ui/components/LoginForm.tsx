'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Input } from '@musetrip360/ui-core/input';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';

import { loginSchema, type LoginFormData } from '@/lib/validation';
import { AuthTypeEnum } from '@/lib/types';

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  onForgotPassword?: () => void;
  onSwitchToRegister?: () => void;
  defaultValues?: Partial<LoginFormData>;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
  onForgotPassword,
  onSwitchToRegister,
  defaultValues,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      authType: AuthTypeEnum.Email,
      rememberMe: false,
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error handling is managed by parent component
      console.error('Login submission error:', error);
    }
  };

  return (
    <div className="space-y-6 px-5">
      {/* Error Display */}
      {error && (
        <div className="animate-in slide-in-from-top-1 duration-200 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-1 ">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu của bạn"
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 hover:bg-muted/50 transition-colors duration-150"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">Ghi nhớ đăng nhập</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {onForgotPassword && (
              <Button
                type="button"
                variant="link"
                size="sm"
                className="h-auto p-0 text-sm"
                onClick={onForgotPassword}
                disabled={isLoading}
              >
                Quên mật khẩu?
              </Button>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </Form>

      {/* Register Link */}
      {onSwitchToRegister && (
        <div className="text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{' '}
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-sm font-medium"
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            Tạo tài khoản
          </Button>
        </div>
      )}
    </div>
  );
}
