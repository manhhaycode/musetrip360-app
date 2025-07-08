import React from 'react';
import type { AuthModalStep, LoginReq, RegisterReq, VerifyOTPChangePassword } from '@/lib/types';

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

export function useAuthModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<AuthModalStep>('login');
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const open = (step: AuthModalStep = 'login') => {
    setCurrentStep(step);
    setIsOpen(true);
    setError(null);
    setSuccessMessage(null);
  };

  const close = () => {
    setIsOpen(false);
    setError(null);
    setSuccessMessage(null);
    setIsLoading(false);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const showError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccessMessage(null);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setError(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    isOpen,
    currentStep,
    error,
    successMessage,
    isLoading,
    open,
    close,
    setCurrentStep,
    setLoading,
    showError,
    showSuccess,
    clearMessages,
  };
}
