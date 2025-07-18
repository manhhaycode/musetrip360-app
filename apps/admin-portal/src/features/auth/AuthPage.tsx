import { AuthActionProvider, AuthModal, useAuthController, useIsAuthenticated } from '@musetrip360/auth-system';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigator = useNavigate();
  const authController = useAuthController({ isAuthModal: true });
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    authController.modalController?.open('login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigator('/'); // Redirect to admin dashboard if authenticated
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-orange-50 to-rose-50">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">MuseTrip360 Admin</h1>
          <p className="text-slate-600">Đăng nhập để quản lý hệ thống</p>
        </div>
        <AuthActionProvider authController={authController}>
          <AuthModal />
        </AuthActionProvider>
      </div>
    </div>
  );
}
