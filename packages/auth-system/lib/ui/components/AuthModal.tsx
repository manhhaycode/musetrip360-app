'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@musetrip360/ui-core/dialog';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';

import { useAuthContext } from '@/state/context/auth.context';

export function AuthModal() {
  const { modalControl, currentStep, stepIcon, stepTitle, stepDescription } = useAuthContext();
  return (
    <Dialog open={modalControl!.isOpen} onOpenChange={modalControl!.onOpenChange}>
      <DialogContent className="sm:max-w-xl w-full" showCloseButton={modalControl!.showCloseButton}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-center">
            {stepIcon}
            {stepTitle}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm text-center">{stepDescription}</DialogDescription>
        </DialogHeader>
        {/* Conditional rendering based on current step */}
        {currentStep === 'login' && <LoginForm />}
        {currentStep === 'register' && <RegisterForm />}
        {currentStep === 'forgot-password' && <ForgotPasswordForm />}
        {currentStep === 'reset-password' && <ResetPasswordForm />}
        <ScrollArea className="-mx-5 py-2 max-h-[calc(95vh-10rem)]"></ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
