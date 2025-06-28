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
  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
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
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Biểu đồ Xu hướng</p>
                <p className="text-sm">Dữ liệu lượt thăm theo thời gian</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Museums */}
        <Card>
          <CardHeader>
            <CardTitle>Bảo tàng Phổ biến nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Bảo tàng Lịch sử VN', visitors: '245K', growth: '+15%' },
                { name: 'Bảo tàng Mỹ thuật HCM', visitors: '198K', growth: '+12%' },
                { name: 'Bảo tàng Dân tộc học', visitors: '167K', growth: '+8%' },
                { name: 'Bảo tàng Hồ Chí Minh', visitors: '134K', growth: '+5%' },
                { name: 'Bảo tàng Cách mạng', visitors: '112K', growth: '+3%' },
              ].map((museum, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{museum.name}</p>
                      <p className="text-xs text-muted-foreground">{museum.visitors} lượt thăm</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-green-600">{museum.growth}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hiệu suất theo Vùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { region: 'Miền Bắc', museums: 58, visitors: '1.2M', growth: '+14%' },
              { region: 'Miền Trung', museums: 34, visitors: '720K', growth: '+8%' },
              { region: 'Miền Nam', museums: 50, visitors: '980K', growth: '+11%' },
            ].map((region, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold text-lg mb-3">{region.region}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Bảo tàng</span>
                    <span className="font-medium">{region.museums}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Lượt thăm</span>
                    <span className="font-medium">{region.visitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tăng trưởng</span>
                    <span className="font-medium text-green-600">{region.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
