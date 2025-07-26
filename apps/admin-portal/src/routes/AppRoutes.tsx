import Error from '@/components/common';
import ScrollToTop from '@/components/ScrollToTop';
import { AdminDashboard, MuseumList, MuseumRequests, Policies, SystemSettings, UserManagement } from '@/features/admin';
import AuthPage from '@/features/auth/AuthPage';
import DefaultLayout from '@/layouts/DefaultLayout';
import { GoogleOAuthCallback } from '@musetrip360/auth-system';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<AdminDashboard />} />

          {/* Museum Management */}
          <Route path="museums" element={<MuseumList />} />
          <Route path="museums/requests" element={<MuseumRequests />} />

          {/* System Management */}
          <Route path="users" element={<UserManagement />} />
          <Route path="policies" element={<Policies />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>
        <Route path="/auth/google/callback" element={<GoogleOAuthCallback />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}
