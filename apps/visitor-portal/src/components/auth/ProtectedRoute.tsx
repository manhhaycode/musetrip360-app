'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthActionContext, useIsAuthenticated } from '@musetrip360/auth-system/state';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Lock } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

function AuthRequiredScreen({ redirectTo }: { redirectTo?: string }) {
  const { modalControl: authController } = useAuthActionContext();

  useEffect(() => {
    if (redirectTo) {
      sessionStorage.setItem('postLoginRedirect', redirectTo);
    }
    // Auto-trigger login modal
    authController?.open('login');
  }, [redirectTo]);

  const handleLogin = () => {
    authController?.open('login');
  };

  return (
    <div className="flex-1 bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-foreground">Cần đăng nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">
            Trang này yêu cầu xác thực. Cửa sổ đăng nhập đang được mở...
          </p>
          <p className="text-muted-foreground text-center text-sm mt-2">
            Nếu không thấy cửa sổ đăng nhập, vui lòng kiểm tra trình duyệt của bạn.
          </p>
          <Button onClick={handleLogin} className="mt-4 w-full">
            Đăng nhập
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ProtectedRoute({ children, fallback, redirectTo, requireAuth = true }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const [isClient, setIsClient] = useState(false);

  // Handle hydration to prevent SSR mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show nothing during hydration to prevent flash
  if (!isClient) {
    return null;
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If not authenticated, show fallback or default auth screen
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <AuthRequiredScreen redirectTo={redirectTo} />;
  }

  // User is authenticated, render-protected content
  return <>{children}</>;
}

// Convenience hook for protected pages
export function useProtectedRoute(options?: { redirectTo?: string }) {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && options?.redirectTo) {
      router.push(options.redirectTo);
    }
  }, [isAuthenticated, router, options?.redirectTo]);

  return { isAuthenticated };
}

export default ProtectedRoute;
