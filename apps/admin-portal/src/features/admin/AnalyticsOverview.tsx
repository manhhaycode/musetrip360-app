import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@musetrip360/ui-core';
import { ArrowDownRight, ArrowUpRight, BarChart3, Building2, Eye, TrendingUp, Users } from 'lucide-react';

export default function AnalyticsOverview() {
  // Sample chart data
  const visitorData = [
    { month: 'T1', value: 85 },
    { month: 'T2', value: 92 },
    { month: 'T3', value: 78 },
    { month: 'T4', value: 96 },
    { month: 'T5', value: 89 },
    { month: 'T6', value: 94 },
  ];

  const performanceData = [
    { category: 'Lượt thăm', value: 95, color: '#3b82f6' },
    { category: 'Tương tác', value: 68, color: '#ef4444' },
    { category: 'Đánh giá', value: 87, color: '#10b981' },
    { category: 'Chia sẻ', value: 72, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Phân tích Tổng quan</h1>
        <Select defaultValue="30d">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 ngày qua</SelectItem>
            <SelectItem value="30d">30 ngày qua</SelectItem>
            <SelectItem value="90d">3 tháng qua</SelectItem>
            <SelectItem value="1y">1 năm qua</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt thăm</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
              <span className="text-sm text-muted-foreground ml-2">so với tháng trước</span>
            </div>
            <Progress value={85} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bảo tàng hoạt động</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+3</span>
              <span className="text-sm text-muted-foreground ml-2">bảo tàng mới</span>
            </div>
            <Progress value={90} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2K</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+8.1%</span>
              <span className="text-sm text-muted-foreground ml-2">tăng trưởng</span>
            </div>
            <Progress value={75} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ tương tác</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.2%</div>
            <div className="flex items-center mt-2">
              <ArrowDownRight className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600 font-medium">-2.4%</span>
              <span className="text-sm text-muted-foreground ml-2">cần cải thiện</span>
            </div>
            <Progress value={68} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Visitor Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Xu hướng Lượt thăm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {/* Simple bar chart representation */}
              <div className="flex items-end justify-between h-48 mt-4">
                {visitorData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 mx-1">
                    <div className="w-full bg-primary rounded-t-sm mb-2" style={{ height: `${item.value}%` }} />
                    <span className="text-xs text-muted-foreground">{item.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Jan</span>
                <span>Jun</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất Hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Museums & Regional Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Museums */}
        <Card>
          <CardHeader>
            <CardTitle>Bảo tàng Phổ biến nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Bảo tàng Lịch sử VN', visitors: '245K', growth: '+15%', rating: 4.9 },
                { name: 'Bảo tàng Mỹ thuật HCM', visitors: '198K', growth: '+12%', rating: 4.7 },
                { name: 'Bảo tàng Dân tộc học', visitors: '167K', growth: '+8%', rating: 4.6 },
                { name: 'Bảo tàng Hồ Chí Minh', visitors: '134K', growth: '+5%', rating: 4.5 },
                { name: 'Bảo tàng Cách mạng', visitors: '112K', growth: '+3%', rating: 4.4 },
              ].map((museum, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{museum.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{museum.visitors} lượt thăm</span>
                        <span>•</span>
                        <span>⭐ {museum.rating}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">{museum.growth}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất theo Vùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: 'Miền Bắc', museums: 58, visitors: '1.2M', growth: '+14%', percentage: 85 },
                { region: 'Miền Trung', museums: 34, visitors: '720K', growth: '+8%', percentage: 65 },
                { region: 'Miền Nam', museums: 50, visitors: '980K', growth: '+11%', percentage: 75 },
              ].map((region, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{region.region}</h3>
                      <p className="text-sm text-muted-foreground">
                        {region.museums} bảo tàng • {region.visitors} lượt thăm
                      </p>
                    </div>
                    <span className="font-medium text-green-600">{region.growth}</span>
                  </div>
                  <Progress value={region.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tóm tắt Nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">142</div>
              <div className="text-sm text-muted-foreground">Tổng bảo tàng</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">2.4M</div>
              <div className="text-sm text-muted-foreground">Lượt thăm tháng</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">89.5K</div>
              <div className="text-sm text-muted-foreground">Tour ảo</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">4.7⭐</div>
              <div className="text-sm text-muted-foreground">Đánh giá TB</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
