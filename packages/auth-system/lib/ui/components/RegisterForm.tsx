'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';

import { Button } from '@musetrip360/ui-core/button';
import { Input } from '@musetrip360/ui-core/input';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { Progress } from '@musetrip360/ui-core/progress';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@musetrip360/ui-core/form';
import { registerSchema, type RegisterFormData, getPasswordStrength } from '@/lib/validation';

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  onSwitchToLogin?: () => void;
  defaultValues?: Partial<RegisterFormData>;
}

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const { score, feedback } = getPasswordStrength(password);

  const getStrengthText = (score: number) => {
    if (score <= 2) return 'Yếu';
    if (score <= 3) return 'Trung bình';
    return 'Mạnh';
  };

  if (!password) return null;

  return (
    <div className="transition-all duration-300 ease-in-out space-y-2">
      <div className="flex items-center gap-2">
        <Progress value={(score / 5) * 100} className="h-1.5 flex-1" />
        <span className="text-xs text-muted-foreground">{getStrengthText(score)}</span>
      </div>

      {feedback.length > 0 && (
        <div className="space-y-1">
          {feedback.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <X className="h-3 w-3 text-destructive" />
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      )}

      {score === 5 && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <Check className="h-3 w-3" />
          <span>Mật khẩu mạnh!</span>
        </div>
      )}
    </div>
  );
};

export function RegisterForm({
  onSubmit,
  isLoading = false,
  error,
  onSwitchToLogin,
  defaultValues,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phoneNumber: '',
      avatarUrl: '',
      agreeToTerms: false,
      subscribeToNewsletter: false,
      ...defaultValues,
    },
    mode: 'onBlur',
  });

  const password = form.watch('password');

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Registration submission error:', error);
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
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 px-1">
          {/* Full Name Field */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập họ và tên của bạn" autoComplete="name" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại (Tùy chọn)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+84 (912) 345-678"
                    autoComplete="tel"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Chúng tôi sẽ sử dụng số này để bảo mật tài khoản và gửi thông báo</FormDescription>
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
                      placeholder="Tạo mật khẩu mạnh"
                      autoComplete="new-password"
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
                <PasswordStrengthIndicator password={password} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Xác nhận mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Xác nhận mật khẩu của bạn"
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full w-10 hover:bg-muted/50 transition-colors duration-150"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms Agreement */}
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Tôi đồng ý với{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm font-medium underline"
                      onClick={() => window.open('/terms', '_blank')}
                    >
                      Điều khoản sử dụng
                    </Button>{' '}
                    và{' '}
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm font-medium underline"
                      onClick={() => window.open('/privacy', '_blank')}
                    >
                      Chính sách bảo mật
                    </Button>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Newsletter Subscription */}
          <FormField
            control={form.control}
            name="subscribeToNewsletter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    Đăng ký nhận bản tin để nhận cập nhật và ưu đãi đặc biệt
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </Button>
        </form>
      </Form>

      {/* Login Link */}
      {onSwitchToLogin && (
        <div className="text-center text-sm text-muted-foreground">
          Đã có tài khoản?{' '}
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-sm font-medium"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            Đăng nhập
          </Button>
        </div>
      )}
    </div>
  );
}
