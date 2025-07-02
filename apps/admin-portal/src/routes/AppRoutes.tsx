import Error from '@/components/common/Error';
import ScrollToTop from '@/components/ScrollToTop';
import {
  AdminDashboard,
  AnalyticsOverview,
  MuseumList,
  Policies,
  SystemSettings,
  UserManagement,
} from '@/features/admin';
import MuseumApproval from '@/features/admin/MuseumRequests';
import DefaultLayout from '@/layouts/DefaultLayout';
import { Route, Routes } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="/museums" element={<MuseumList />} />
          <Route path="/museums/requests" element={<MuseumApproval />} />
          <Route path="/museums/approval" element={<MuseumApproval />} />
          <Route path="/analytics/overview" element={<AnalyticsOverview />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/settings" element={<SystemSettings />} />
          <Route path="/policies" element={<Policies />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}
