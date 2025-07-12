import ScrollToTop from '@/components/ScrollToTop';
import { Routes, Route, BrowserRouter } from 'react-router';
import DefaultLayout from '@/layouts/DefaultLayout';
import AuthPage from '@/features/auth/pages/AuthPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<DefaultLayout />}>
          {/* Statistics */}
          <Route path="/statistics" element={<div>Statistics</div>} />
          <Route path="/statistics/overview" element={<div>Báo cáo tổng quan</div>} />

          {/* Museum Management */}
          <Route path="/museum" element={<div>Thông tin bảo tàng</div>} />
          <Route path="/museum/basic-info" element={<div>Thông tin cơ bản</div>} />
          <Route path="/museum/home-page" element={<div>Trang chủ bảo tàng</div>} />
          <Route path="/museum/artifacts" element={<div>Danh sách hiện vật</div>} />
          <Route path="/museum/contract" element={<div>Hợp đồng</div>} />
          <Route path="/museum/policy" element={<div>Chính sách bảo tàng</div>} />

          {/* Staff Management */}
          <Route path="/staff" element={<div>Danh sách nhân viên</div>} />

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
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}
