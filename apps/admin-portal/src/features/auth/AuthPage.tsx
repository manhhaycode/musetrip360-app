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
      navigator('/'); // Redirect to home if authenticated
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <AuthActionProvider authController={authController}>
        <AuthModal />
      </AuthActionProvider>
    </div>
  );
}
