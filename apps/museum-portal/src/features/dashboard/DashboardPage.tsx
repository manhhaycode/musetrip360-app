import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Button,
} from '@musetrip360/ui-core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArchiveIcon, CoinsIcon, CalendarDaysIcon, TicketsPlaneIcon } from 'lucide-react';
import { useMuseumStore, useGetMuseumAnalyticsOverview } from '@musetrip360/museum-management';
import get from 'lodash/get';
import UpcomingEvent from '../event/UpcomingEvent';

const revenueData = [
  { month: 'T1', revenue: 35000000, visitors: 850 },
  { month: 'T2', revenue: 42000000, visitors: 920 },
  { month: 'T3', revenue: 38000000, visitors: 880 },
  { month: 'T4', revenue: 51000000, visitors: 1100 },
  { month: 'T5', revenue: 48000000, visitors: 980 },
  { month: 'T6', revenue: 45780000, visitors: 1050 },
];

const chartConfig = {
  revenue: {
    label: 'Doanh thu (VND)',
    color: 'hsl(var(--chart-1))',
  },
  visitors: {
    label: 'Khách tham quan',
    color: 'hsl(var(--chart-2))',
  },
};

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const { selectedMuseum } = useMuseumStore();

  const { data } = useGetMuseumAnalyticsOverview(selectedMuseum?.id || '');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{selectedMuseum?.name || 'Bảng Điều Khiển Bảo Tàng'}</h1>
        <p className="text-muted-foreground">
          Trang quản lý tổng quan của bảo tàng. Tại đây bạn có thể xem các số liệu thống kê, sự kiện sắp tới và doanh
          thu hàng tháng.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">Hiện vật</CardTitle>
            <ArchiveIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{get(data, 'totalArtifacts', 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">Sự kiện</CardTitle>
            <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{get(data, 'totalEvents', 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">Tour ảo</CardTitle>
            <TicketsPlaneIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{get(data, 'totalTourOnlines', 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
            <CoinsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Biểu đồ doanh thu</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={timeRange === '6months' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('6months')}
              >
                6 tháng
              </Button>
              <Button
                variant={timeRange === '1year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('1year')}
              >
                1 năm
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                data={revenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(Number(value)) : value,
                    name === 'revenue' ? 'Doanh thu' : 'Khách tham quan',
                  ]}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <UpcomingEvent />
      </div>
    </div>
  );
};

export default DashboardPage;
