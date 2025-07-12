import React from 'react';
import { AuthContext } from './auth.context';
import { authErrorHandler, useLogin, useRegister, useRequestOTP, useVerifyOTP } from '@/api';
import { LoginReq, RegisterReq, VerifyOTPChangePassword } from '@/types';
import { Lock, Mail } from 'lucide-react';
import { AuthController } from '../hooks/use-auth';

export const AuthProvider = ({
  children,
  authController,
}: {
  children: React.ReactNode;
  authController: AuthController;
}) => {
  // Local state for error handling and OTP flow
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [otpCooldown, setOtpCooldown] = React.useState(0);
  const [resetEmail, setResetEmail] = React.useState<string>('');
  const [resetPasswordEmail, setResetPasswordEmail] = React.useState<string>(resetEmail || '');
  const [isLoading, setIsLoading] = React.useState(false);

  const loginMutation = useLogin({
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      authController.modalController?.close();
    },
    onError: (error) => {
      const errorMessage = authErrorHandler.handleLoginError(error);
      setError(errorMessage);
    },
  });

  const registerMutation = useRegister({
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      authController.setCurrentStep('login');
    },
    onError: (error) => {
      const errorMessage = authErrorHandler.handleRegisterError(error);
      setError(errorMessage);
    },
  });

  const requestOTPMutation = useRequestOTP({
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: (data) => {
      setResetEmail(data.email);
      setSuccessMessage(`Mã xác thực đã được gửi đến ${data.email}`);
      authController.setCurrentStep('reset-password');
      setOtpCooldown(60); // Set cooldown to 60 seconds
    },
    onError: (error) => {
      const errorMessage = authErrorHandler.handleOTPRequestError(error);
      setError(errorMessage);
    },
  });

  const verifyOTPMutation = useVerifyOTP({
    onMutate: () => {
      setIsLoading(true);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setSuccessMessage('Mật khẩu đã được cập nhật thành công! Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.');
    },
    onError: (error) => {
      const errorMessage = authErrorHandler.handleOTPVerificationError(error);
      setError(errorMessage);
    },
  });

  const onSubmit = React.useCallback(
    (data: LoginReq | RegisterReq | VerifyOTPChangePassword | string) => {
      if (authController.currentStep === 'login') {
        loginMutation.mutate(data as LoginReq);
      } else if (authController.currentStep === 'register') {
        registerMutation.mutate(data as RegisterReq);
      } else if (authController.currentStep === 'reset-password') {
        verifyOTPMutation.mutate(data as VerifyOTPChangePassword);
      } else if (authController.currentStep === 'forgot-password') {
        requestOTPMutation.mutate(data as string);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authController.currentStep]
  );

  // Get step-specific title and description
  const stepTitle = React.useMemo((): string => {
    switch (authController.currentStep) {
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
  }, [authController.currentStep]);

  const stepDescription = React.useMemo((): string => {
    switch (authController.currentStep) {
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
  }, [authController.currentStep]);

  const stepIcon = React.useMemo((): React.ReactNode => {
    switch (authController.currentStep) {
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
  }, [authController.currentStep]);

  return (
    <AuthContext.Provider
      value={{
        onSubmit,
        currentStep: authController.currentStep,
        setCurrentStep: authController.setCurrentStep,
        modalControl: authController.modalController,
        error,
        successMessage,
        resetEmail,
        resetPasswordEmail,
        setResetPasswordEmail,
        otpCooldown,
        stepTitle,
        stepDescription,
        stepIcon,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
