import React from 'react';
import type { AuthModalStep, LoginReq, RegisterReq, VerifyOTPChangePassword } from '@/types';

export interface AuthModalProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  currentStep?: AuthModalStep;
  setCurrentStep?: (step: AuthModalStep) => void;
  onLogin?: (data: LoginReq) => void;
  onRegister?: (data: RegisterReq) => void;
  onRequestPasswordReset?: (email: string) => void;
  onResetPassword?: (data: VerifyOTPChangePassword) => void;

  // Loading states
  isLoading?: boolean;

  // Error and success states
  error?: string | null;
  successMessage?: string | null;

  // OTP/Reset password specific props
  resetEmail?: string;
  otpCooldown?: number;

  // Event callbacks
  onAuthSuccess?: (step: AuthModalStep) => void;
  onStepChange?: (step: AuthModalStep) => void;

  // Modal customization
  title?: string;
  description?: string;
  showCloseButton?: boolean;

  // Form default values
  loginDefaults?: Partial<LoginReq>;
  registerDefaults?: Partial<RegisterReq>;
}

export interface AuthModalConnectorProps
  extends Omit<
    AuthModalProps,
    | 'onLogin'
    | 'onRegister'
    | 'onRequestPasswordReset'
    | 'onResetPassword'
    | 'onResendOTP'
    | 'isLoading'
    | 'isResending'
    | 'error'
  > {
  onLoginSuccess?: (user: any) => void;
  onRegisterSuccess?: (user: any) => void;
  onPasswordResetSuccess?: () => void;
  close?: () => void;
}

export type AuthController = {
  currentStep: AuthModalStep;
  setCurrentStep: (step: AuthModalStep) => void;
  modalController?: {
    isOpen: boolean;
    open: (step?: AuthModalStep) => void;
    close: () => void;
    onOpenChange?: (open: boolean) => void;
    showCloseButton?: boolean;
  };
};

export function useAuthController(state: { isAuthModal: boolean } = { isAuthModal: false }): AuthController {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<AuthModalStep>('login');

  const open = (step: AuthModalStep = 'login') => {
    setCurrentStep(step);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    currentStep,
    setCurrentStep,
    ...(state?.isAuthModal && {
      modalController: {
        isOpen,
        open,
        close,
        onOpenChange: (open: boolean) => {
          setIsOpen(open);
        },
        showCloseButton: true,
      },
    }),
  };
}
