import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core';
import { Crown, MoreHorizontal, Plus, Shield, User, Users } from 'lucide-react';

export default function UserManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý Người dùng</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng người dùng</p>
                <p className="text-3xl font-bold">1,247</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quản trị viên</p>
                <p className="text-3xl font-bold text-red-600">8</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <Crown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nhân viên</p>
                <p className="text-3xl font-bold text-blue-600">45</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Khách thăm</p>
                <p className="text-3xl font-bold text-green-600">1,194</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <User className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Nguyễn Văn An',
                email: 'admin@musetrip360.com',
                role: 'admin',
                status: 'active',
                lastLogin: '2 phút trước',
              },
              {
                name: 'Trần Thị Bình',
                email: 'manager@musetrip360.com',
                role: 'manager',
                status: 'active',
                lastLogin: '1 giờ trước',
              },
              {
                name: 'Lê Hoàng Cường',
                email: 'staff@musetrip360.com',
                role: 'staff',
                status: 'active',
                lastLogin: '3 giờ trước',
              },
              {
                name: 'Phạm Thị Dung',
                email: 'user@example.com',
                role: 'user',
                status: 'inactive',
                lastLogin: '2 ngày trước',
              },
            ].map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      user.role === 'admin'
                        ? 'bg-red-100'
                        : user.role === 'manager'
                          ? 'bg-blue-100'
                          : user.role === 'staff'
                            ? 'bg-purple-100'
                            : 'bg-green-100'
                    }`}
                  >
                    {user.role === 'admin' ? (
                      <Crown className="h-6 w-6 text-red-600" />
                    ) : user.role === 'manager' ? (
                      <Shield className="h-6 w-6 text-blue-600" />
                    ) : user.role === 'staff' ? (
                      <Shield className="h-6 w-6 text-purple-600" />
                    ) : (
                      <User className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Đăng nhập: {user.lastLogin}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant={
                      user.role === 'admin'
                        ? 'destructive'
                        : user.role === 'manager'
                          ? 'default'
                          : user.role === 'staff'
                            ? 'secondary'
                            : 'outline'
                    }
                  >
                    {user.role === 'admin'
                      ? 'Quản trị'
                      : user.role === 'manager'
                        ? 'Quản lý'
                        : user.role === 'staff'
                          ? 'Nhân viên'
                          : 'Khách thăm'}
                  </Badge>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </div>
                  <Button size="sm" variant="secondary">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
