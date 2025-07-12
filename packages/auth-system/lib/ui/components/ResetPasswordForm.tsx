'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, RefreshCw } from 'lucide-react';
import * as React from 'react';
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

import { getPasswordStrength, resetPasswordSchema, type ResetPasswordFormData } from '@/validation';
import { useAuthContext } from '@/state/context/auth.context';

export interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  email: string;
  onBackToForgotPassword?: () => void;
  resendCooldown?: number; // seconds remaining until can resend
  defaultValues?: Partial<ResetPasswordFormData>;
}

const OTPInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d?$/.test(inputValue)) return;

    const newValue = value.split('');
    newValue[index] = inputValue;
    const updatedValue = newValue.join('');

    onChange(updatedValue);

    // Auto-focus next input
    if (inputValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    onChange(digits);
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: 6 }, (_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-12 text-center text-lg font-semibold"
          autoComplete="off"
        />
      ))}
    </div>
  );
};

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const { score, feedback } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              score <= 2 ? 'bg-destructive' : score <= 3 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{score <= 2 ? 'Weak' : score <= 3 ? 'Medium' : 'Strong'}</span>
      </div>

      {feedback.length > 0 && <div className="text-xs text-muted-foreground">Thiếu: {feedback.join(', ')}</div>}
    </div>
  );
};

export function ResetPasswordForm() {
  const { onSubmit, isLoading = false, error, resetPasswordEmail, otpCooldown = 60, setCurrentStep } = useAuthContext();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [cooldownTimer, setCooldownTimer] = React.useState(otpCooldown);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: resetPasswordEmail || '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const password = form.watch('newPassword');

  // Cooldown timer effect
  React.useEffect(() => {
    if (cooldownTimer > 0) {
      const timer = setTimeout(() => {
        setCooldownTimer(cooldownTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTimer]);

  React.useEffect(() => {
    setCooldownTimer(otpCooldown);
  }, [otpCooldown]);

  const handleSubmit = async (data: ResetPasswordFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Reset password submission error:', error);
    }
  };

  const handleResendOTP = async () => {
    setCooldownTimer(60); // Reset cooldown to 60 seconds
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
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 max-h-[65vh] px-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
        >
          {/* OTP Input */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center block">Mã xác thực</FormLabel>
                <FormControl>
                  <OTPInput value={field.value} onChange={field.onChange} disabled={isLoading} />
                </FormControl>
                <FormDescription className="text-center">Nhập mã 6 chữ số được gửi đến email của bạn</FormDescription>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          {/* Resend OTP */}
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResendOTP}
              disabled={cooldownTimer > 0}
              className="gap-2"
            >
              {cooldownTimer > 0 ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {cooldownTimer > 0 ? `Gửi lại mã sau ${cooldownTimer}s` : 'Gửi lại mã'}
            </Button>
          </div>

          {/* New Password Field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu mới</FormLabel>
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
                <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Xác nhận mật khẩu mới của bạn"
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

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Đang cập nhật mật khẩu...' : 'Cập nhật mật khẩu'}
          </Button>
        </form>
      </Form>

      {/* Back to Forgot Password */}
      <div className="text-center">
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={setCurrentStep.bind(null, 'forgot-password')}
          disabled={isLoading}
        >
          Sử dụng địa chỉ email khác
        </Button>
      </div>
    </div>
  );
}
