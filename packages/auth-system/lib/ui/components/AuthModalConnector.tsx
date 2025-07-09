'use client';

import * as React from 'react';
import { AuthModal } from './AuthModal';
import { useLogin, useRegister, useRequestOTP, useVerifyOTP } from '@/api/hooks/useAuth';
import { authErrorHandler } from '@/api/endpoints/auth';
import { AuthTypeEnum, LoginReq, RegisterReq, AuthModalStep, VerifyOTPChangePassword } from '@/types';
import { AuthModalConnectorProps } from '@/state/hooks/useAuthModal';

export function AuthModalConnector({
  onLoginSuccess,
  onRegisterSuccess,
  onPasswordResetSuccess,
  onAuthSuccess,
  setCurrentStep,
  close,
  ...modalProps
}: AuthModalConnectorProps) {
  // Auth hooks
  const loginMutation = useLogin({
    onSuccess: (data) => {
      onLoginSuccess?.(data);
      onAuthSuccess?.('login');
      close?.();
    },
    onError: (error) => {
      const errorMessage = authErrorHandler.handleLoginError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    },
  });

  const registerMutation = useRegister({
    onSuccess: (data) => {
      onRegisterSuccess?.(data);
      onAuthSuccess?.('register');
      close?.();
    },
    onError: (error) => {
      const errorMessage = authErrorHandler.handleRegisterError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    },
  });

  const requestOTPMutation = useRequestOTP({
    onSuccess: (data) => {
      setResetEmail(data.email);
      setSuccessMessage(`Mã xác thực đã được gửi đến ${data.email}`);
      setOtpCooldown(60); // Set cooldown to 60 seconds
    },
    onError: (error) => {
      const errorMessage = authErrorHandler.handleOTPRequestError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    },
  });

  const verifyOTPMutation = useVerifyOTP({
    onSuccess: () => {
      setSuccessMessage('Mật khẩu đã được cập nhật thành công! Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.');
      onPasswordResetSuccess?.();
      onAuthSuccess?.('reset-password');
    },
    onError: (error) => {
      const errorMessage = authErrorHandler.handleOTPVerificationError(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    },
  });

  // Local state for error handling and OTP flow
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [otpCooldown, setOtpCooldown] = React.useState(0);
  const [resetEmail, setResetEmail] = React.useState<string>('');

  // Clear errors when modal closes
  React.useEffect(() => {
    if (!modalProps.isOpen) {
      setError(null);
      setSuccessMessage(null);
      setOtpCooldown(0);
      setResetEmail('');
    }
  }, [modalProps.isOpen]);

  // OTP cooldown timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCooldown > 0) {
      timer = setTimeout(() => {
        setOtpCooldown(otpCooldown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [otpCooldown]);

  const handleLogin = async (data: LoginReq) => {
    setError(null);

    const loginData = {
      email: data.email,
      password: data.password,
      authType: data.authType || AuthTypeEnum.Email,
      redirect: data.redirect,
      firebaseToken: data.firebaseToken,
    };
    loginMutation.mutate(loginData);
  };

  const handleRegister = async (data: RegisterReq) => {
    setError(null);

    const registerData = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber || undefined,
      avatarUrl: data.avatarUrl || undefined,
    };

    registerMutation.mutate(registerData);
  };

  const handleRequestPasswordReset = async (email: string) => {
    setError(null);

    requestOTPMutation.mutate(email);
  };

  const handleResetPassword = async (data: VerifyOTPChangePassword) => {
    setError(null);

    verifyOTPMutation.mutate(data);
  };

  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen) {
      close?.();
    }
    modalProps.onOpenChange?.(isOpen);
  };

  const handleAuthSuccess = (step: AuthModalStep) => {
    // Handle specific success actions based on step
    switch (step) {
      case 'login':
        setSuccessMessage('Đăng nhập thành công!');
        break;
      case 'register':
        setSuccessMessage('Tài khoản đã được tạo thành công!');
        break;
      case 'reset-password':
        setSuccessMessage('Đặt lại mật khẩu thành công!');
        break;
    }

    onAuthSuccess?.(step);
  };

  // Determine loading state
  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <AuthModal
      {...modalProps}
      onOpenChange={handleModalClose}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onRequestPasswordReset={handleRequestPasswordReset}
      onResetPassword={handleResetPassword}
      onAuthSuccess={handleAuthSuccess}
      isLoading={isLoading}
      error={error}
      successMessage={successMessage}
      resetEmail={resetEmail}
      otpCooldown={otpCooldown}
      setCurrentStep={setCurrentStep}
    />
  );
}
