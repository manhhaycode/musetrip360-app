import Error from '@/components/common/Error';
import ScrollToTop from '@/components/ScrollToTop';
import { AdminDashboard, AnalyticsOverview, MuseumApproval, MuseumList, MuseumRequests } from '@/features/admin';
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
          <Route path="/museums/requests" element={<MuseumRequests />} />
          <Route path="/museums/approval" element={<MuseumApproval />} />
          <Route path="/analytics/overview" element={<AnalyticsOverview />} />
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}
