import { AuthModalStep, LoginReq, RegisterReq, VerifyOTPChangePassword } from '@/types';
import React, { createContext } from 'react';
import { AuthController } from '../../hooks';

export interface AuthContextType {
  onSubmit: (data: LoginReq | RegisterReq | VerifyOTPChangePassword | string) => void;
  onSuccess?: (step: AuthModalStep, data: any) => void;
  currentStep: AuthModalStep;
  setCurrentStep: (step: AuthModalStep) => void;
  resetPasswordEmail: string;
  setResetPasswordEmail: (email: string) => void;
  modalControl?: AuthController['modalController'];
  setIsLoading: (isLoading: boolean) => void;
  // Error and success states
  isLoading?: boolean;
  error?: string | null;
  successMessage?: string | null;

  // OTP/Reset password specific props
  resetEmail?: string;
  otpCooldown?: number;

  stepTitle: string;
  stepDescription: string;
  stepIcon: React.ReactNode;
}

export const AuthActionContext = createContext<AuthContextType | null>(null);

export const useAuthActionContext = () => {
  const context = React.useContext(AuthActionContext);
  if (!context) {
    throw new Error('useAuthActionContext must be used within an AuthActionProvider');
  }
  return context;
};
