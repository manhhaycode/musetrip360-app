import { MuseTrip360Logo } from '@/assets/svg';
import { useAuthStore } from '@musetrip360/auth-system';
import { useMuseumStore } from '@musetrip360/museum-management';
import { useUserStore } from '@musetrip360/user-management';
import { Button } from '@musetrip360/ui-core/button';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router';

const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <MuseTrip360Logo className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">MuseTrip360</span>
          </div>
          <div className="h-6 w-px bg-gray-300"></div>
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
              <Home className="h-4 w-4" />
              Trang chủ
            </Button>
            <span>/</span>
            <span className="font-medium text-gray-900">Chào mừng</span>
          </nav>
        </div>
        <div className="flex gap-2 items-center flex-end">
          <Button
            variant={'default'}
            onClick={() => {
              useAuthStore.getState().resetStore();
              useMuseumStore.getState().resetStore();
              useUserStore.getState().resetStore();
              navigate('/');
            }}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicHeader;
