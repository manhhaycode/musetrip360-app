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
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data for visitor trends chart
  const visitorTrends = [
    { period: 'T1', visitors: 450000, growth: 12, x: 0, y: 45 },
    { period: 'T2', visitors: 520000, growth: 15, x: 1, y: 52 },
    { period: 'T3', visitors: 480000, growth: -8, x: 2, y: 48 },
    { period: 'T4', visitors: 610000, growth: 27, x: 3, y: 61 },
    { period: 'T5', visitors: 580000, growth: -5, x: 4, y: 58 },
    { period: 'T6', visitors: 720000, growth: 24, x: 5, y: 72 },
  ];

  // Generate SVG path for wave chart
  const generatePath = (data: typeof visitorTrends) => {
    const width = 300;
    const height = 100;
    const points = data.map((d, i) => `${(i * width) / (data.length - 1)},${height - (d.y * height) / 100}`);
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="space-y-4">
      {/* Quick Stats Cards */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Tổng số bảo tàng */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Bảo tàng</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
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
              <Button variant="secondary" size="sm" className="h-6 text-xs">
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
      <div className="grid gap-4 lg:grid-cols-7">
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
                          : undefined
                    }
                  >
                    {item.status === 'pending' ? 'Chờ duyệt' : item.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                  </Badge>
                  {item.status === 'pending' && (
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t">
              <Button variant="secondary" className="w-full justify-center">
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
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
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

      {/* Enhanced Analytics Section */}
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
          <button
            className={`flex-1 py-2 px-4 text-sm tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Tổng quan
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm tab-button ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            Xu hướng Lượt thăm
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm tab-button ${activeTab === 'museums' ? 'active' : ''}`}
            onClick={() => setActiveTab('museums')}
          >
            Bảo tàng
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm tab-button ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Hiệu suất
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Thống kê Tổng quan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {/* Wave Chart */}
                <div className="relative w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                  <svg viewBox="0 0 300 100" className="w-full h-full">
                    {/* Grid lines */}
                    <defs>
                      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    {/* Wave line */}
                    <path
                      d={generatePath(visitorTrends)}
                      stroke="#3b82f6"
                      strokeWidth="2"
                      fill="none"
                      className="drop-shadow-sm"
                    />

                    {/* Area under curve */}
                    <path d={`${generatePath(visitorTrends)} L 300,100 L 0,100 Z`} fill="url(#waveGradient)" />

                    {/* Data points */}
                    {visitorTrends.map((item, index) => (
                      <circle
                        key={index}
                        cx={(index * 300) / (visitorTrends.length - 1)}
                        cy={100 - (item.y * 100) / 100}
                        r="4"
                        fill="#3b82f6"
                        className="drop-shadow-sm"
                      />
                    ))}
                  </svg>

                  {/* Period labels */}
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    {visitorTrends.map((item) => (
                      <span key={item.period}>{item.period}</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'trends' && (
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng Chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitorTrends.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="font-medium">{item.period}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold">{item.visitors.toLocaleString()}</span>
                      <span className={`text-sm font-medium ${item.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.growth > 0 ? '+' : ''}
                        {item.growth}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'museums' && (
          <Card>
            <CardHeader>
              <CardTitle>Bảo tàng Nổi bật</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Bảo tàng Lịch sử VN', rating: 4.9, visitors: '245K' },
                  { name: 'Bảo tàng Mỹ thuật HCM', rating: 4.7, visitors: '198K' },
                  { name: 'Bảo tàng Dân tộc học', rating: 4.6, visitors: '167K' },
                ].map((museum, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{museum.name}</p>
                        <p className="text-xs text-muted-foreground">{museum.visitors} lượt thăm</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{museum.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'performance' && (
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất Hệ thống</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { metric: 'Uptime', value: '99.9%', color: 'bg-green-500' },
                  { metric: 'Response Time', value: '120ms', color: 'bg-blue-500' },
                  { metric: 'CPU Usage', value: '45%', color: 'bg-yellow-500' },
                  { metric: 'Memory Usage', value: '68%', color: 'bg-purple-500' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="font-medium">{item.metric}</span>
                    </div>
                    <span className="text-lg font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Statistics */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích Lượt thăm Chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { metric: 'Lượt thăm Web', value: '1.8M', change: '+15%' },
                  { metric: 'Lượt thăm Mobile', value: '600K', change: '+25%' },
                  { metric: 'Tour ảo', value: '340K', change: '+40%' },
                  { metric: 'Tương tác trực tiếp', value: '89K', change: '+8%' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      <span className="font-medium">{item.metric}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{item.value}</span>
                      <span className="text-sm text-green-600 font-medium">{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Địa điểm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { location: 'Hà Nội', percentage: 35, visitors: '840K' },
                  { location: 'TP.HCM', percentage: 28, visitors: '672K' },
                  { location: 'Đà Nẵng', percentage: 15, visitors: '360K' },
                  { location: 'Huế', percentage: 12, visitors: '288K' },
                  { location: 'Khác', percentage: 10, visitors: '240K' },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.location}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.visitors} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
