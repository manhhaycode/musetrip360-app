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
import ProfilePage from '@/features/settings/pages/ProfilePage';
import ChangePasswordPage from '@/features/settings/pages/ChangePasswordPage';
import VirtualTourManagement from '@/features/virtual-tour/pages/VirtualTourManagement';
import VirtualTourInfo from '@/features/virtual-tour/pages/VirtualTourStudio';
import MuseumArticlePage from '@/features/museum/pages/MuseumArticlePage';
import { ArticleCreatePage, ArticleEditPage } from '@/features/article/pages';
import EventListPage from '@/features/event/pages/EventListPage';
import EventCreatePage from '@/features/event/pages/EventCreatePage';
import EventEditPage from '@/features/event/pages/EventEditPage';

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

        <Route path="/virtual-tour/studio/create" element={<VirtualTourInfo />} />
        <Route path="/virtual-tour/studio/:id" element={<VirtualTourInfo />} />

        <Route path="/" element={<DefaultLayout />}>
          {/* Default route for users with museums */}
          <Route index element={<DashboardPage />} />

          {/* Statistics */}
          <Route path="/statistics" element={<div>Statistics</div>} />
          <Route path="/statistics/overview" element={<DashboardPage />} />

          {/* Museum Management */}
          <Route path="/museum" element={<MuseumDetailPage />} />
          <Route path="/museum/home-page" element={<MuseumHomePage />} />
          <Route path="/museum/artifacts" element={<MuseumArtifactPage />} />
          <Route path="/museum/contract" element={<div>Hợp đồng</div>} />
          <Route path="/museum/policy" element={<MuseumPolicyPage />} />
          <Route path="/museum/articles" element={<MuseumArticlePage />} />
          <Route path="/museum/articles/create" element={<ArticleCreatePage />} />
          <Route path="/museum/articles/edit/:id" element={<ArticleEditPage />} />

          {/* Artifact Management */}
          <Route path="/artifact/create" element={<ArtifactCreatePage />} />
          <Route path="/artifact/edit/:id" element={<ArtifactEditPage />} />

          {/* Staff Management */}
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/tour-guides" element={<TourGuidePage />} />

          {/* Event Management */}
          <Route path="/event" element={<EventListPage />} />
          <Route path="/event/create" element={<EventCreatePage />} />
          <Route path="/event/edit/:id" element={<EventEditPage />} />
          <Route path="/event/evaluate" element={<div>Đánh giá sự kiện</div>} />

          {/* Schedule Management */}
          <Route path="/schedule" element={<div>Danh sách lịch trình</div>} />
          <Route path="/schedule/create" element={<div>Tạo lịch trình mới</div>} />

          {/* Event Ticket Management */}
          <Route path="/event-ticket" element={<div>Danh sách vé sự kiện</div>} />

          {/* 360 Tour Management */}
          <Route path="/virtual-tour" element={<VirtualTourManagement />} />

          {/* 360 Tour Settings */}
          <Route path="/virtual-tour/settings" element={<div>Cài đặt tour ảo 360</div>} />

          {/* Settings */}
          <Route path="/settings" element={<div>Cài đặt</div>} />
          <Route path="/settings/profile" element={<ProfilePage />} />
          <Route path="/settings/change-password" element={<ChangePasswordPage />} />

          {/* Logout */}
          <Route path="/logout" element={<div>Đăng xuất</div>} />
        </Route>
        <Route path="/auth/google/callback" element={<GoogleOAuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
