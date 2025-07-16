'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Input } from '@musetrip360/ui-core/input';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { Button } from '@musetrip360/ui-core/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@musetrip360/ui-core/form';

import { loginSchema, type LoginFormData } from '@/validation';
import { AuthTypeEnum } from '@/types';
import { useAuthActionContext } from '@/state/context/auth-action/auth-action.context';
import { GrApple, GrGoogle } from 'react-icons/gr';
import { useLogin, useVerifyToken } from '@/api';
import { popupWindow } from '@/utils';

export function LoginForm() {
  const { onSubmit, isLoading: isLoadingAuthAction, error, setCurrentStep, modalControl } = useAuthActionContext();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [controller, setController] = React.useState<AbortController | null>(null);

  const loginWithGoogleMutation = useLogin({
    onSuccess: ({ data }) => {
      if ('redirectLink' in data) {
        handleLoginWithGoogle(data.redirectLink, data.token);
        setIsPopupOpen(true);
      }
    },
    onError: (error) => {
      console.error('Login with Google error:', error);
    },
  });

  const verifyTokenMutation = useVerifyToken({
    onSuccess: () => {
      modalControl?.close();
    },
    onError: (error) => {
      console.error('Verify token error:', error);
    },
  });

  const isLoading = React.useMemo(
    () => isLoadingAuthAction || isPopupOpen || loginWithGoogleMutation.isPending || verifyTokenMutation.isPending,
    [isLoadingAuthAction, isPopupOpen, loginWithGoogleMutation.isPending, verifyTokenMutation.isPending]
  );

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      authType: AuthTypeEnum.Email,
      rememberMe: false,
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

  const handleLoginWithGoogle = async (redirectUrl: string, token: string) => {
    if (controller) {
      controller.abort();
    }
    const newController = new AbortController();
    const handleMessage = (event: MessageEvent<any>) => {
      // check if the origin is the same
      if (event.origin !== window.location.origin || event.data !== 'GoogleOAuthSuccess') return;
      verifyTokenMutation.mutate(token);
      newController.abort();
    };

    const popup = popupWindow(redirectUrl, 'Google Auth', 500, 600);
    if (!popup) return;
    setIsPopupOpen(true);
    // when receive message from popup then verify token
    window.addEventListener('message', (event) => handleMessage(event), {
      signal: newController.signal,
    });
    setController(newController);
    // check if the popup is closed
    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        setIsPopupOpen(false);
        controller?.abort();
        clearInterval(checkPopup);
      }
    }, 100);
  };

  return (
    <div className="space-y-6 px-5">
      <div className="flex justify-center gap-2 mt-3">
        <Button
          variant="outline"
          size="lg"
          leftIcon={<GrGoogle />}
          onClick={() =>
            loginWithGoogleMutation.mutate({
              authType: AuthTypeEnum.Google,
              redirect: window.location.origin + '/auth/google/callback',
            })
          }
        >
          Đăng nhập với Google
        </Button>
        <Button
          variant="outline"
          size="lg"
          leftIcon={<GrApple className="size-5" />}
          onClick={() =>
            loginWithGoogleMutation.mutate({
              authType: AuthTypeEnum.Google,
              redirect: window.location.origin + '/auth/google/callback',
            })
          }
        >
          Đăng nhập với Apple
        </Button>
      </div>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">Hoặc tiếp tục với</span>
      </div>
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

            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto p-0 text-sm"
              onClick={setCurrentStep.bind(null, 'forgot-password')}
              disabled={isLoading}
            >
              Quên mật khẩu?
            </Button>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </Form>

      {/* Register Link */}
      <div className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{' '}
        <Button
          type="button"
          variant="link"
          size="sm"
          className="h-auto p-0 text-sm font-medium"
          onClick={setCurrentStep.bind(null, 'register')}
          disabled={isLoading}
        >
          Tạo tài khoản
        </Button>
      </div>
    </div>
  );
}
