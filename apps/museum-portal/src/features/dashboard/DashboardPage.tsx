import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@musetrip360/ui-core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArchiveIcon, CoinsIcon, CalendarDaysIcon, TicketsPlaneIcon } from 'lucide-react';
import {
  useMuseumStore,
  useGetMuseumAnalyticsOverview,
  useAdminWeeklyParticipantCounts,
} from '@musetrip360/museum-management';
import get from 'lodash/get';
import UpcomingEvent from '../event/UpcomingEvent';

const chartConfig = {
  participantCount: {
    label: 'Người tham gia',
    color: 'hsl(var(--chart-1))',
  },
};

const DashboardPage = () => {
  const { selectedMuseum } = useMuseumStore();

  const { data } = useGetMuseumAnalyticsOverview(selectedMuseum?.id || '');
  const { data: participantData, isLoading: isParticipantDataLoading } = useAdminWeeklyParticipantCounts(
    selectedMuseum?.id || '',
    {
      enabled: !!selectedMuseum?.id,
    }
  );

  // Transform participant data for chart
  const chartData =
    get(participantData, 'weeklyData', [])?.map((item: any) => ({
      weekLabel: item.weekLabel,
      participantCount: item.participantCount,
    })) || [];

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {/* Participant Chart */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Biểu đồ người tham gia theo tuần</CardTitle>
          </CardHeader>
          <CardContent>
            {isParticipantDataLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Đang tải dữ liệu...</div>
              </div>
            ) : chartData.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="weekLabel" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [value, ' Người tham gia']} />
                  <Line type="monotone" dataKey="participantCount" stroke="red" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Không có dữ liệu để hiển thị</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <div className="lg:col-span-2">
          <UpcomingEvent />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
