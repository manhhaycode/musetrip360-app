import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Switch } from '@musetrip360/ui-core';
import {
  Bell,
  Database,
  FileText,
  Globe,
  Key,
  Mail,
  MessageSquare,
  Monitor,
  Save,
  Settings,
  Shield,
} from 'lucide-react';

export default function SystemSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Cài đặt Hệ thống</h1>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Cài đặt Chung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Chế độ bảo trì</p>
                <p className="text-sm text-muted-foreground">Tạm thời tắt hệ thống để bảo trì</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Đăng ký mới</p>
                <p className="text-sm text-muted-foreground">Cho phép bảo tàng mới đăng ký</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tự động phê duyệt</p>
                <p className="text-sm text-muted-foreground">Tự động duyệt yêu cầu đăng ký</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Bảo mật
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Xác thực 2 bước</p>
                <p className="text-sm text-muted-foreground">Bắt buộc xác thực 2 bước cho admin</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Phiên đăng nhập</p>
                <p className="text-sm text-muted-foreground">Thời gian hết hạn phiên: 8 giờ</p>
              </div>
              <Button variant="outline" size="sm">
                Cấu hình
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nhật ký bảo mật</p>
                <p className="text-sm text-muted-foreground">Lưu trữ 90 ngày</p>
              </div>
              <Badge variant="secondary">Đang hoạt động</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Thông báo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email thông báo</p>
                <p className="text-sm text-muted-foreground">Gửi email khi có yêu cầu mới</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS cảnh báo</p>
                <p className="text-sm text-muted-foreground">SMS cho các sự cố quan trọng</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Báo cáo hàng tuần</p>
                <p className="text-sm text-muted-foreground">Gửi báo cáo hoạt động</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Tích hợp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Email Service</p>
                  <p className="text-sm text-muted-foreground">SMTP cấu hình</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                Kết nối
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">SMS Gateway</p>
                  <p className="text-sm text-muted-foreground">API tin nhắn</p>
                </div>
              </div>
              <Badge variant="secondary">Chưa cấu hình</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Database className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Backup Storage</p>
                  <p className="text-sm text-muted-foreground">Lưu trữ đám mây</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                Hoạt động
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="mr-2 h-5 w-5" />
            Thông tin Hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Phiên bản</p>
              <p className="text-lg font-semibold">v2.1.4</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Cập nhật cuối</p>
              <p className="text-lg font-semibold">15/01/2024</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Uptime</p>
              <p className="text-lg font-semibold">15 ngày 8 giờ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác Nhanh</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <Database className="mr-2 h-4 w-4" />
            Backup dữ liệu
          </Button>
          <Button variant="outline" className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            Export báo cáo
          </Button>
          <Button variant="outline" className="flex-1">
            <Key className="mr-2 h-4 w-4" />
            Reset API Keys
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
