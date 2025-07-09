'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';

import { AuthModalStep } from '@/types';
import { AuthModalProps } from '@/state/hooks/useAuthModal';
import { Lock, Mail } from 'lucide-react';

export function AuthModal({
  isOpen,
  onOpenChange,
  currentStep = 'login',
  onLogin,
  onRegister,
  onRequestPasswordReset,
  onResetPassword,
  isLoading = false,
  error,
  successMessage,
  resetEmail,
  otpCooldown = 0,
  setCurrentStep,
  title,
  description,
  showCloseButton = true,
  loginDefaults,
  registerDefaults,
}: AuthModalProps) {
  const [resetPasswordEmail, setResetPasswordEmail] = React.useState<string>(resetEmail || '');

  // Get step-specific title and description
  const getStepTitle = (step: AuthModalStep): string => {
    if (title) return title;

    switch (step) {
      case 'login':
        return 'Đăng Nhập';
      case 'register':
        return 'Tạo Tài Khoản';
      case 'forgot-password':
        return 'Đặt Lại Mật Khẩu';
      case 'reset-password':
        return 'Quên mật khẩu?';
      default:
        return 'Xác Thực';
    }
  };

  const getStepDescription = (step: AuthModalStep): string => {
    if (description) return description;

    switch (step) {
      case 'login':
        return 'Chào mừng bạn trở lại! Vui lòng đăng nhập vào tài khoản của bạn.';
      case 'register':
        return 'Tạo tài khoản mới để bắt đầu.';
      case 'forgot-password':
        return 'Đừng lo lắng! Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã để đặt lại mật khẩu.';
      case 'reset-password':
        return 'Nhập mã xác thực và mật khẩu mới của bạn.';
      default:
        return '';
    }
  };

  const getStepIcon = (step: AuthModalStep): React.ReactNode => {
    switch (step) {
      case 'forgot-password':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Mail className="h-6 w-6 text-muted-foreground" />
          </div>
        );
      case 'reset-password':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
        );
      default:
        return null;
    }
  };

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 'login':
        return (
          <LoginForm
            onSubmit={onLogin!}
            isLoading={isLoading}
            error={error}
            onForgotPassword={() => setCurrentStep?.('forgot-password')}
            onSwitchToRegister={() => setCurrentStep?.('register')}
            defaultValues={loginDefaults}
          />
        );

      case 'register':
        return (
          <RegisterForm
            onSubmit={onRegister!}
            isLoading={isLoading}
            error={error}
            onSwitchToLogin={() => setCurrentStep?.('login')}
            defaultValues={registerDefaults}
          />
        );

      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSubmit={(data) => onRequestPasswordReset?.(data.email)}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            onBackToLogin={() => setCurrentStep?.('login')}
            onOTPSent={(email) => {
              setResetPasswordEmail(email);
              setCurrentStep?.('reset-password');
            }}
          />
        );

      case 'reset-password':
        return (
          <ResetPasswordForm
            onSubmit={onResetPassword!}
            isLoading={isLoading}
            error={error}
            email={resetPasswordEmail}
            onBackToForgotPassword={() => setCurrentStep?.('forgot-password')}
            resendCooldown={otpCooldown}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full" showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-center">
            {getStepIcon(currentStep)}
            {getStepTitle(currentStep)}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm text-center">
            {getStepDescription(currentStep)}
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <ScrollArea className="-mx-5 py-2 max-h-[calc(95vh-10rem)]">{renderCurrentForm()}</ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
