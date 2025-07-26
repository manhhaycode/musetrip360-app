'use client';

import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { MuseTrip360Logo } from '@/assets/svg';
import { Building2, Plus, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router';
import PublicHeader from '@/layouts/components/Header/PublicHeader';

const MuseumAccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <PublicHeader />

      <div className="flex items-center justify-center p-4 pt-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <MuseTrip360Logo className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng đến với MuseTrip360</h1>
            <p className="text-gray-600 text-lg">
              Để bắt đầu sử dụng hệ thống, bạn cần được cấp quyền truy cập bảo tàng
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Request Admin Access Card */}
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-blue-900">Yêu cầu quyền truy cập</CardTitle>
                <CardDescription className="text-gray-600">
                  Liên hệ với quản trị viên để được thêm vào bảo tàng hiện có
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Nhanh chóng và đơn giản</p>
                  <p>• Phù hợp khi bảo tàng đã tồn tại trong hệ thống</p>
                  <p>• Được cấp quyền ngay sau khi phê duyệt</p>
                </div>
              </CardContent>
            </Card>

            {/* Create New Museum Card */}
            <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-900">Đăng ký bảo tàng mới</CardTitle>
                <CardDescription className="text-gray-600">
                  Tạo yêu cầu đăng ký bảo tàng mới vào hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Dành cho bảo tàng chưa có trong hệ thống</p>
                  <p>• Quy trình xét duyệt 3-5 ngày làm việc</p>
                  <p>• Cần cung cấp đầy đủ thông tin chi tiết</p>
                </div>
                <Button className="w-full gap-2" onClick={() => navigate('/museums/request')}>
                  <Building2 className="h-4 w-4" />
                  Đăng ký bảo tàng
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-yellow-200 flex items-center justify-center">
                  <span className="text-yellow-800 text-sm font-bold">!</span>
                </div>
                Thông tin quan trọng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
                <div className="space-y-2">
                  <h4 className="font-semibold">Yêu cầu quyền truy cập:</h4>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700">
                    <li>Cung cấp thông tin cá nhân và vị trí công việc</li>
                    <li>Xác nhận từ quản lý bảo tàng hiện tại</li>
                    <li>Thời gian xử lý: 1-2 ngày làm việc</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Đăng ký bảo tàng mới:</h4>
                  <ul className="list-disc list-inside space-y-1 text-yellow-700">
                    <li>Cần có giấy phép hoạt động hợp lệ</li>
                    <li>Thông tin chi tiết về bảo tàng và hoạt động</li>
                    <li>Thời gian xử lý: 3-5 ngày làm việc</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              Cần hỗ trợ thêm? Liên hệ với chúng tôi qua{' '}
              <a href="mailto:support@musetrip360.com" className="text-blue-600 hover:text-blue-800 font-medium">
                support@musetrip360.com
              </a>{' '}
              hoặc gọi{' '}
              <a href="tel:+84123456789" className="text-blue-600 hover:text-blue-800 font-medium">
                +84 123 456 789
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseumAccessPage;
