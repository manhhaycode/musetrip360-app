import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Progress } from '@musetrip360/ui-core';
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Star,
  TrendingUp,
  XCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Tổng số bảo tàng */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Bảo tàng</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+8.2%</span>
              <span className="text-sm text-muted-foreground ml-2">so với tháng trước</span>
            </div>
            <Progress value={75} className="mt-3" />
          </CardContent>
        </Card>

        {/* Yêu cầu chờ duyệt */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yêu cầu Chờ duyệt</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600 font-medium">+5</span>
              <span className="text-sm text-muted-foreground ml-2">yêu cầu mới hôm nay</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Cần xử lý
              </Badge>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                Xem tất cả
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Đã duyệt tuần này */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt Tuần này</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+20%</span>
              <span className="text-sm text-muted-foreground ml-2">so với tuần trước</span>
            </div>
            <Progress value={60} className="mt-3" />
          </CardContent>
        </Card>

        {/* Từ chối tháng này */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Từ chối Tháng này</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="flex items-center mt-2">
              <ArrowDownRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">-30%</span>
              <span className="text-sm text-muted-foreground ml-2">so với tháng trước</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">Tỷ lệ từ chối thấp hơn</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Requests */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Yêu cầu Mới nhất</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                name: 'Bảo tàng Lịch sử Hà Nội',
                time: '2 phút trước',
                status: 'pending',
                location: 'Hà Nội',
              },
              {
                name: 'Bảo tàng Dân tộc học TP.HCM',
                time: '1 giờ trước',
                status: 'pending',
                location: 'TP. Hồ Chí Minh',
              },
              {
                name: 'Bảo tàng Mỹ thuật Đà Nẵng',
                time: '3 giờ trước',
                status: 'approved',
                location: 'Đà Nẵng',
              },
              {
                name: 'Bảo tàng Cách mạng Huế',
                time: '1 ngày trước',
                status: 'rejected',
                location: 'Thừa Thiên Huế',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      item.status === 'pending'
                        ? 'bg-yellow-100'
                        : item.status === 'approved'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                    }`}
                  >
                    <Building2
                      className={`h-5 w-5 ${
                        item.status === 'pending'
                          ? 'text-yellow-600'
                          : item.status === 'approved'
                            ? 'text-green-600'
                            : 'text-red-600'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.location}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      item.status === 'pending' ? 'secondary' : item.status === 'approved' ? 'default' : 'destructive'
                    }
                    className={
                      item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : item.status === 'approved'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                    }
                  >
                    {item.status === 'pending' ? 'Chờ duyệt' : item.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                  </Badge>
                  {item.status === 'pending' && (
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t">
              <Button variant="ghost" className="w-full justify-center">
                Xem tất cả yêu cầu
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Activity */}
        <div className="lg:col-span-3 space-y-6">
          {/* Monthly Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê Theo tháng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { month: 'Tháng 1', count: 15, progress: 60 },
                { month: 'Tháng 2', count: 18, progress: 72 },
                { month: 'Tháng 3', count: 22, progress: 88 },
                { month: 'Tháng này', count: 8, progress: 32, current: true },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm ${item.current ? 'font-semibold text-primary' : 'text-muted-foreground'}`}
                    >
                      {item.month}
                    </span>
                    <span className={`text-sm font-medium ${item.current ? 'text-primary' : ''}`}>
                      {item.count} bảo tàng
                    </span>
                  </div>
                  <Progress value={item.progress} className={`h-2 ${item.current ? 'bg-primary/20' : ''}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Bảo tàng Nổi bật</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Bảo tàng Lịch sử VN', rating: 4.9, visitors: '12K' },
                { name: 'Bảo tàng Mỹ thuật', rating: 4.8, visitors: '8.5K' },
                { name: 'Bảo tàng Dân tộc học', rating: 4.7, visitors: '6.2K' },
              ].map((museum, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{museum.name}</p>
                      <p className="text-xs text-muted-foreground">{museum.visitors} lượt thăm</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{museum.rating}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
