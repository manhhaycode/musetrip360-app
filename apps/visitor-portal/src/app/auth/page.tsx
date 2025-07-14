'use client';

import { AuthActionProvider, AuthModal, AuthProvider, useAuthController } from '@musetrip360/auth-system';
import { getQueryClient, QueryClientProvider } from '@musetrip360/query-foundation';
import { useEffect } from 'react';

export default function AuthPage() {
  const authController = useAuthController({ isAuthModal: true });
  useEffect(() => {
    authController.modalController?.open('login');
  }, []);
  return (
    <QueryClientProvider client={getQueryClient()}>
      <AuthActionProvider authController={authController}>
        <AuthModal />
      </AuthActionProvider>
    </QueryClientProvider>
  );
}
