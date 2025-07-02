import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core';
import { Calendar, Edit, Eye, FileText, Plus, Shield, Trash2 } from 'lucide-react';

export default function Policies() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Chính sách & Quy định</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo chính sách
        </Button>
      </div>

      {/* Policy Categories */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chính sách hoạt động</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quy định bảo mật</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Điều khoản sử dụng</p>
                <p className="text-3xl font-bold">5</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policies List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Chính sách</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: 'Chính sách Bảo mật Dữ liệu',
                category: 'Bảo mật',
                status: 'active',
                lastUpdated: '2 ngày trước',
                version: 'v2.1',
              },
              {
                title: 'Quy định Đăng ký Bảo tàng',
                category: 'Hoạt động',
                status: 'active',
                lastUpdated: '1 tuần trước',
                version: 'v1.5',
              },
              {
                title: 'Điều khoản Sử dụng Dịch vụ',
                category: 'Pháp lý',
                status: 'draft',
                lastUpdated: '3 ngày trước',
                version: 'v3.0-draft',
              },
              {
                title: 'Chính sách Quyền riêng tư',
                category: 'Bảo mật',
                status: 'active',
                lastUpdated: '2 tuần trước',
                version: 'v1.8',
              },
              {
                title: 'Quy trình Xét duyệt Nội dung',
                category: 'Hoạt động',
                status: 'review',
                lastUpdated: '5 ngày trước',
                version: 'v2.0-review',
              },
            ].map((policy, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      policy.category === 'Bảo mật'
                        ? 'bg-red-100'
                        : policy.category === 'Hoạt động'
                          ? 'bg-blue-100'
                          : 'bg-green-100'
                    }`}
                  >
                    {policy.category === 'Bảo mật' ? (
                      <Shield className="h-6 w-6 text-red-600" />
                    ) : policy.category === 'Hoạt động' ? (
                      <FileText className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Calendar className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{policy.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-muted-foreground">{policy.category}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{policy.version}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{policy.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      policy.status === 'active' ? 'default' : policy.status === 'draft' ? 'secondary' : 'outline'
                    }
                    className={
                      policy.status === 'active'
                        ? 'bg-green-100 text-green-800 border-green-200'
                        : policy.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                    }
                  >
                    {policy.status === 'active'
                      ? 'Đang áp dụng'
                      : policy.status === 'draft'
                        ? 'Bản nháp'
                        : 'Đang xem xét'}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mẫu Chính sách</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Mẫu Chính sách Bảo mật
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Mẫu Quy định Hoạt động
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Mẫu Điều khoản Dịch vụ
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Đang áp dụng</span>
              <span className="font-medium">18 chính sách</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Đang xem xét</span>
              <span className="font-medium">3 chính sách</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Bản nháp</span>
              <span className="font-medium">4 chính sách</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
