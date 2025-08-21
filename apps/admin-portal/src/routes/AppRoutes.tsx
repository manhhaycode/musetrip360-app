import Error from '@/components/common';
import ScrollToTop from '@/components/ScrollToTop';
import { AdminDashboard } from '@/features/admin';
import AuthPage from '@/features/auth/AuthPage';
import { MuseumDetailPage, MuseumRequestDetailPage, MuseumRequestsPage, MuseumsPage } from '@/features/museum';
import OrderListPage from '@/features/payment/OrderListPage';
import PermissionPage from '@/features/rolebase/PermissionPage';
import RolePage from '@/features/rolebase/RolePage';
import RolePermissionsPage from '@/features/rolebase/RolePermissionsPage';
import { UsersPage } from '@/features/users';
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
          <Route path="museums/admin" element={<MuseumsPage />} />
          <Route path="museums/admin/:id" element={<MuseumDetailPage />} />

          {/* Museum Request Management */}
          <Route path="museums/requests" element={<MuseumRequestsPage />} />
          <Route path="museums/requests/:id" element={<MuseumRequestDetailPage />} />

          {/* User Management */}
          <Route path="users" element={<UsersPage />} />
          <Route path="rolebase/roles" element={<RolePage />} />
          <Route path="rolebase/roles/:roleId/permissions" element={<RolePermissionsPage />} />
          <Route path="rolebase/permissions" element={<PermissionPage />} />

          {/* Payment Management */}
          <Route path="payments/orders" element={<OrderListPage />} />
        </Route>
        <Route path="/auth/google/callback" element={<GoogleOAuthCallback />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}
