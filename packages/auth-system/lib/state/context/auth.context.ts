import { AuthModalStep, LoginReq, RegisterReq, VerifyOTPChangePassword } from '@/types';
import React, { createContext } from 'react';
import { AuthController } from '../hooks';

export interface AuthContextType {
  onSubmit: (data: LoginReq | RegisterReq | VerifyOTPChangePassword | string) => void;
  onSuccess?: (step: AuthModalStep, data: any) => void;
  currentStep: AuthModalStep;
  setCurrentStep: (step: AuthModalStep) => void;
  resetPasswordEmail: string;
  setResetPasswordEmail: (email: string) => void;
  modalControl?: AuthController['modalController'];
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

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
