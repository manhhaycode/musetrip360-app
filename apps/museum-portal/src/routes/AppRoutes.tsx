import ScrollToTop from '@/components/ScrollToTop';
import { Routes, Route, BrowserRouter } from 'react-router';
import DefaultLayout from '@/layouts/DefaultLayout';
import AuthPage from '@/features/auth/pages/AuthPage';
import { GoogleOAuthCallback } from '@musetrip360/auth-system';
import MuseumArtifactPage from '@/features/museum/pages/MuseumArtifactPage';
import MuseumDetailPage from '@/features/museum/pages/MuseumDetailPage';
import MuseumHomePage from '@/features/museum/pages/MuseumHomePage';
import MuseumPolicyPage from '@/features/museum/pages/MuseumPolicyPage';
import NotFound from '@/features/exception/NotFound';
import ArtifactCreatePage from '@/features/artifacts/pages/ArtifactCreatePage';
import ArtifactEditPage from '@/features/artifacts/pages/ArtifactEditPage';
import StaffPage from '@/features/staff/pages/StaffPage';
import MuseumCreateReqPage from '@/features/museum/pages/MuseumCreateReqPage';
import MuseumAccessPage from '@/features/museum/pages/MuseumAccessPage';
import SimpleLayout from '@/layouts/SimpleLayout';
import DashboardPage from '@/features/dashboard/DashboardPage';
import TourGuidePage from '@/features/staff/pages/TourGuidePage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/welcome" element={<MuseumAccessPage />} />
        <Route
          path="/museums/request"
          element={
            <SimpleLayout>
              <MuseumCreateReqPage />
            </SimpleLayout>
          }
        />

        <Route path="/" element={<DefaultLayout />}>
          {/* Default route for users with museums */}
          <Route index element={<DashboardPage />} />

          {/* Statistics */}
          <Route path="/statistics" element={<div>Statistics</div>} />
          <Route path="/statistics/overview" element={<div>Báo cáo tổng quan</div>} />

          {/* Museum Management */}
          <Route path="/museum" element={<MuseumDetailPage />} />
          <Route path="/museum/home-page" element={<MuseumHomePage />} />
          <Route path="/museum/artifacts" element={<MuseumArtifactPage />} />
          <Route path="/museum/contract" element={<div>Hợp đồng</div>} />
          <Route path="/museum/policy" element={<MuseumPolicyPage />} />

          {/* Artifact Management */}
          <Route path="/artifact/create" element={<ArtifactCreatePage />} />
          <Route path="/artifact/edit/:id" element={<ArtifactEditPage />} />

          {/* Staff Management */}
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/tour-guides" element={<TourGuidePage />} />

          {/* Event Management */}
          <Route path="/event" element={<div>Danh sách sự kiện</div>} />
          <Route path="/event/create" element={<div>Tạo sự kiện mới</div>} />
          <Route path="/event/evaluate" element={<div>Đánh giá sự kiện</div>} />

          {/* Schedule Management */}
          <Route path="/schedule" element={<div>Danh sách lịch trình</div>} />
          <Route path="/schedule/create" element={<div>Tạo lịch trình mới</div>} />

          {/* Event Ticket Management */}
          <Route path="/event-ticket" element={<div>Danh sách vé sự kiện</div>} />

          {/* 360 Tour Management */}
          <Route path="/360-tour" element={<div>Danh sách tour ảo 360</div>} />
          <Route path="/360-tour/create" element={<div>Tạo tour ảo 360 mới</div>} />

          {/* 360 Tour Settings */}
          <Route path="/360-tour/settings" element={<div>Cài đặt tour ảo 360</div>} />

          {/* Settings */}
          <Route path="/settings" element={<div>Cài đặt</div>} />

          {/* Logout */}
          <Route path="/logout" element={<div>Đăng xuất</div>} />
        </Route>
        <Route path="/auth/google/callback" element={<GoogleOAuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
