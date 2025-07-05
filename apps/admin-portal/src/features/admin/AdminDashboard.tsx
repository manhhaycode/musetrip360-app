import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@musetrip360/ui-core';
import { ArrowDownRight, ArrowUpRight, Building2, CheckCircle, Clock, MapPin, TrendingUp, XCircle } from 'lucide-react';
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

  // Recent requests data
  const recentRequests = [
    {
      id: 1,
      name: 'Bảo tàng Lịch sử Hà Nội',
      time: '2 phút trước',
      status: 'pending',
      location: 'Hà Nội',
    },
    {
      id: 2,
      name: 'Bảo tàng Dân tộc học TP.HCM',
      time: '1 giờ trước',
      status: 'pending',
      location: 'TP. Hồ Chí Minh',
    },
    {
      id: 3,
      name: 'Bảo tàng Mỹ thuật Đà Nẵng',
      time: '3 giờ trước',
      status: 'approved',
      location: 'Đà Nẵng',
    },
    {
      id: 4,
      name: 'Bảo tàng Cách mạng Huế',
      time: '1 ngày trước',
      status: 'rejected',
      location: 'Thừa Thiên Huế',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Tổng số bảo tàng */}
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số Bảo tàng</CardTitle>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#feb47b' }}>
              <Building2 className="h-4 w-4" style={{ color: '#ff7e5f' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">+8.2%</span>
              <span className="text-sm ml-2 text-muted-foreground">so với tháng trước</span>
            </div>
            <Progress value={75} className="mt-3" />
          </CardContent>
        </Card>

        {/* Yêu cầu chờ duyệt */}
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Yêu cầu Chờ duyệt</CardTitle>
            <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ffd93d' }}>
              <Clock className="h-4 w-4" style={{ color: '#ff9500' }} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">+5</span>
              <span className="text-sm ml-2 text-muted-foreground">yêu cầu mới hôm nay</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <Badge
                variant="secondary"
                style={{ backgroundColor: '#ffd93d', color: '#3d3436', border: '1px solid #ffe0d6' }}
              >
                Cần xử lý
              </Badge>
              <Button variant="ghost" size="sm" className="h-6 text-xs hover:bg-muted/50">
                Xem tất cả
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Đã duyệt tuần này */}
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã duyệt Tuần này</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">+20%</span>
              <span className="text-sm ml-2 text-muted-foreground">so với tuần trước</span>
            </div>
            <Progress value={60} className="mt-3" />
          </CardContent>
        </Card>

        {/* Từ chối tháng này */}
        <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Từ chối Tháng này</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="flex items-center mt-2">
              <ArrowDownRight className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">-30%</span>
              <span className="text-sm ml-2 text-muted-foreground">so với tháng trước</span>
            </div>
            <div className="text-xs mt-2 text-muted-foreground">Tỷ lệ từ chối thấp hơn</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Requests Table */}
        <Card
          className="lg:col-span-4 rounded-xl border-0 shadow-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        >
          <CardHeader>
            <CardTitle>Yêu cầu Mới nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-muted/50">
                  <TableHead className="text-muted-foreground">Bảo tàng</TableHead>
                  <TableHead className="text-muted-foreground">Vị trí</TableHead>
                  <TableHead className="text-muted-foreground">Thời gian</TableHead>
                  <TableHead className="text-muted-foreground">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((request) => (
                  <TableRow key={request.id} className="border-muted/50 hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor:
                              request.status === 'pending'
                                ? '#ffd93d'
                                : request.status === 'approved'
                                  ? '#d1fae5'
                                  : '#fecaca',
                          }}
                        >
                          <Building2
                            className="h-4 w-4"
                            style={{
                              color:
                                request.status === 'pending'
                                  ? '#ff9500'
                                  : request.status === 'approved'
                                    ? '#22c55e'
                                    : '#ef4444',
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{request.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{request.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{request.time}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === 'pending'
                            ? 'secondary'
                            : request.status === 'approved'
                              ? 'default'
                              : 'destructive'
                        }
                        style={{
                          backgroundColor:
                            request.status === 'pending'
                              ? '#ffd93d'
                              : request.status === 'approved'
                                ? '#d1fae5'
                                : '#fecaca',
                          color:
                            request.status === 'pending'
                              ? '#3d3436'
                              : request.status === 'approved'
                                ? '#22c55e'
                                : '#ef4444',
                          border: '1px solid transparent',
                        }}
                      >
                        {request.status === 'pending'
                          ? 'Chờ duyệt'
                          : request.status === 'approved'
                            ? 'Đã duyệt'
                            : 'Từ chối'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Visitor Trends Chart */}
        <Card
          className="lg:col-span-3 rounded-xl border-0 shadow-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        >
          <CardHeader>
            <CardTitle>Xu hướng Khách thăm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">580K</p>
                  <p className="text-sm text-muted-foreground">Tháng này</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+24%</span>
                </div>
              </div>

              <div className="h-24 w-full">
                <svg width="100%" height="100%" viewBox="0 0 300 100" className="overflow-visible">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#ff7e5f', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: '#ff7e5f', stopOpacity: 0.1 }} />
                    </linearGradient>
                  </defs>
                  <path d={`${generatePath(visitorTrends)} L 300,100 L 0,100 Z`} fill="url(#gradient)" stroke="none" />
                  <path
                    d={generatePath(visitorTrends)}
                    fill="none"
                    stroke="#ff7e5f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {visitorTrends.map((point, index) => (
                    <circle
                      key={index}
                      cx={(index * 300) / (visitorTrends.length - 1)}
                      cy={100 - (point.y * 100) / 100}
                      r="3"
                      fill="#ff7e5f"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              </div>

              <div className="grid grid-cols-6 gap-2 text-center">
                {visitorTrends.map((trend, index) => (
                  <div key={index} className="text-xs">
                    <div className="text-muted-foreground">{trend.period}</div>
                    <div className={`font-medium ${trend.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trend.growth > 0 ? '+' : ''}
                      {trend.growth}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="mt-6">
        <div className="flex space-x-1 rounded-xl p-1 bg-muted/30">
          {[
            { id: 'overview', label: 'Tổng quan' },
            { id: 'museums', label: 'Bảo tàng' },
            { id: 'analytics', label: 'Phân tích' },
            { id: 'reports', label: 'Báo cáo' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'overview' && (
            <Card className="rounded-xl border-0 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
              <CardHeader>
                <CardTitle>Tổng quan Hệ thống</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold">98.5%</div>
                    <div className="text-sm text-muted-foreground">Thời gian hoạt động</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold">2.3M</div>
                    <div className="text-sm text-muted-foreground">Tổng lượt truy cập</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold">145ms</div>
                    <div className="text-sm text-muted-foreground">Thời gian phản hồi</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
