'use client';

import { getQueryClient, QueryClientProvider } from '@musetrip360/query-foundation';
import {
  AuthActionProvider,
  AuthModal,
  AuthProvider,
  useAuthController,
  useIsAuthenticated,
} from '@musetrip360/auth-system';
import { UserProvider } from '@musetrip360/user-management';
import React, { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initConfigApp } from '@/config';

initConfigApp();

function AuthModalWrapper({ children }: { children: React.ReactNode }) {
  const authController = useAuthController({ isAuthModal: true });
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  // Handle post-login redirect
  useEffect(() => {
    if (isAuthenticated) {
      const postLoginRedirect = sessionStorage.getItem('postLoginRedirect');
      if (postLoginRedirect) {
        sessionStorage.removeItem('postLoginRedirect');
        router.push(postLoginRedirect);
      }
    }
  }, [isAuthenticated, router]);

  return (
    <AuthActionProvider authController={authController}>
      {children}
      <AuthModal />
    </AuthActionProvider>
  );
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <QueryClientProvider client={getQueryClient()}>
        <AuthProvider strictMode={false}>
          <AuthModalWrapper>
            <UserProvider strictMode={false}>{children}</UserProvider>
          </AuthModalWrapper>
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
