import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core';
import { Building2, Calendar, Check, CheckCircle, Clock, MapPin, X, XCircle } from 'lucide-react';

export default function MuseumApproval() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Xét duyệt Bảo tàng</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng yêu cầu</p>
                <p className="text-3xl font-bold">47</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
                <p className="text-3xl font-bold text-yellow-600">23</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã duyệt</p>
                <p className="text-3xl font-bold text-green-600">17</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Từ chối</p>
                <p className="text-3xl font-bold text-red-600">7</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Hàng đợi Xét duyệt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Bảo tàng Lịch sử Cần Thơ',
                location: 'Cần Thơ',
                submittedDate: '2 ngày trước',
                status: 'pending',
                priority: 'high',
              },
              {
                name: 'Bảo tàng Hùng Vương Phú Thọ',
                location: 'Phú Thọ',
                submittedDate: '5 ngày trước',
                status: 'pending',
                priority: 'medium',
              },
              {
                name: 'Bảo tàng Quang Trung Bình Định',
                location: 'Bình Định',
                submittedDate: '1 tuần trước',
                status: 'pending',
                priority: 'low',
              },
              {
                name: 'Bảo tàng Dân gian Hội An',
                location: 'Quảng Nam',
                submittedDate: '3 ngày trước',
                status: 'approved',
                priority: 'medium',
              },
              {
                name: 'Bảo tàng Cổ vật Thăng Long',
                location: 'Hà Nội',
                submittedDate: '1 tuần trước',
                status: 'rejected',
                priority: 'low',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      item.status === 'pending'
                        ? 'bg-yellow-100'
                        : item.status === 'approved'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                    }`}
                  >
                    <Building2
                      className={`h-6 w-6 ${
                        item.status === 'pending'
                          ? 'text-yellow-600'
                          : item.status === 'approved'
                            ? 'text-green-600'
                            : 'text-red-600'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.location}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{item.submittedDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      item.status === 'pending' ? 'secondary' : item.status === 'approved' ? 'default' : 'destructive'
                    }
                    className={
                      item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : item.status === 'approved'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : undefined
                    }
                  >
                    {item.status === 'pending' ? 'Chờ duyệt' : item.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                  </Badge>
                  {item.priority !== 'low' && (
                    <Badge
                      variant="outline"
                      className={
                        item.priority === 'high' ? 'border-red-200 text-red-700' : 'border-blue-200 text-blue-700'
                      }
                    >
                      {item.priority === 'high' ? 'Ưu tiên cao' : 'Ưu tiên vừa'}
                    </Badge>
                  )}
                  {item.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="secondary">
                        <X className="h-4 w-4 mr-1" />
                        Từ chối
                      </Button>
                      <Button size="sm">
                        <Check className="h-4 w-4 mr-1" />
                        Duyệt
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state for no pending requests */}
          <div className="text-center py-12 text-muted-foreground border-t mt-6">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Tất cả yêu cầu đã được xử lý</h3>
            <p className="text-sm">Các yêu cầu mới sẽ xuất hiện ở đây</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
