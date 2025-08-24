import {
  AdminAnalyticsOverview,
  useAdminAnalyticsOverview,
  useAdminWeeklyEventCounts,
  WeeklyEventCount,
} from '@musetrip360/museum-management';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Building2, CheckCircle, Clock, Users } from 'lucide-react';
import { useRef, useState, useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import get from 'lodash/get';

export default function AdminDashboard() {
  const { data, isLoading } = useAdminAnalyticsOverview();
  const { data: weeklyEventData, isLoading: isLoadingEvents } = useAdminWeeklyEventCounts();

  const overviewData = data as AdminAnalyticsOverview | undefined;
  console.log('Admin Dashboard Data:', data);

  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const donutRef = useRef<SVGSVGElement>(null);

  // Format weekly event data for chart
  const chartData = useMemo(() => {
    return get(weeklyEventData, 'weeklyData', []).map((week: WeeklyEventCount) => ({
      weekLabel: week.weekLabel,
      eventCount: week.eventCount,
      formattedPeriod: week.weekLabel,
    })) as { weekLabel: string; eventCount: number; formattedPeriod: string }[];
  }, [weeklyEventData]);

  console.log('ChartData', chartData);

  // Process museum categories from API data
  const museumCategories = useMemo(() => {
    if (!overviewData?.museumsByCategory || overviewData.museumsByCategory.length === 0) {
      return [
        { name: 'Lịch sử', count: 0, color: '#FF6B35', percentage: 0 },
        { name: 'Nghệ thuật', count: 0, color: '#F7931E', percentage: 0 },
        { name: 'Khoa học', count: 0, color: '#FFB570', percentage: 0 },
        { name: 'Dân tộc', count: 0, color: '#FFCC9A', percentage: 0 },
        { name: 'Khác', count: 0, color: '#FFE0CC', percentage: 0 },
      ];
    }

    const colors = ['#FF6B35', '#F7931E', '#FFB570', '#FFCC9A', '#FFE0CC'];
    const totalMuseums = overviewData.totalMuseums || 0;
    const categorizedCount = overviewData.museumsByCategory.reduce((sum, item) => sum + item.count, 0);

    // Calculate "Khác" (Others) count
    const othersCount = Math.max(0, totalMuseums - categorizedCount);

    // Map API categories to display format
    const apiCategories = overviewData.museumsByCategory.map((item, index) => ({
      name: item.category,
      count: item.count,
      color: colors[index % colors.length] || '#FFE0CC',
      percentage: totalMuseums > 0 ? (item.count / totalMuseums) * 100 : 0,
    }));

    // Add "Khác" category if there are uncategorized museums
    const result = [...apiCategories];
    if (othersCount > 0) {
      result.push({
        name: 'Khác',
        count: othersCount,
        color: colors[apiCategories.length % colors.length] || '#FFE0CC',
        percentage: totalMuseums > 0 ? (othersCount / totalMuseums) * 100 : 0,
      });
    }

    return result;
  }, [overviewData?.museumsByCategory, overviewData?.totalMuseums]);

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Custom Tooltip for BarChart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-slate-800 text-white rounded-lg px-3 py-2 shadow-xl">
          <div className="text-center">
            <div className="text-xs opacity-80 mb-1">{label}</div>
            <div className="font-bold text-sm">📅 Sự kiện: {data?.eventCount?.toLocaleString()}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Generate donut chart paths
  const generateDonutPath = (data: typeof museumCategories) => {
    const radius = 85;
    const innerRadius = 60;
    let cumulativePercentage = 0;

    return data.map((item, index) => {
      const startAngle = (cumulativePercentage * 360) / 100 - 90;
      const endAngle = ((cumulativePercentage + item.percentage) * 360) / 100 - 90;
      cumulativePercentage += item.percentage;

      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = 100 + radius * Math.cos(startAngleRad);
      const y1 = 100 + radius * Math.sin(startAngleRad);
      const x2 = 100 + radius * Math.cos(endAngleRad);
      const y2 = 100 + radius * Math.sin(endAngleRad);

      const x3 = 100 + innerRadius * Math.cos(endAngleRad);
      const y3 = 100 + innerRadius * Math.sin(endAngleRad);
      const x4 = 100 + innerRadius * Math.cos(startAngleRad);
      const y4 = 100 + innerRadius * Math.sin(startAngleRad);

      const largeArc = endAngle - startAngle > 180 ? 1 : 0;

      const hoverRadius = 90;
      const hx1 = 100 + hoverRadius * Math.cos(startAngleRad);
      const hy1 = 100 + hoverRadius * Math.sin(startAngleRad);
      const hx2 = 100 + hoverRadius * Math.cos(endAngleRad);
      const hy2 = 100 + hoverRadius * Math.sin(endAngleRad);
      const hx3 = 100 + innerRadius * Math.cos(endAngleRad);
      const hy3 = 100 + innerRadius * Math.sin(endAngleRad);
      const hx4 = 100 + innerRadius * Math.cos(startAngleRad);
      const hy4 = 100 + innerRadius * Math.sin(startAngleRad);

      return {
        ...item,
        index,
        path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`,
        hoverPath: `M ${hx1} ${hy1} A ${hoverRadius} ${hoverRadius} 0 ${largeArc} 1 ${hx2} ${hy2} L ${hx3} ${hy3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${hx4} ${hy4} Z`,
        centerX: 100 + ((radius + innerRadius) / 2) * Math.cos((startAngleRad + endAngleRad) / 2),
        centerY: 100 + ((radius + innerRadius) / 2) * Math.sin((startAngleRad + endAngleRad) / 2),
      };
    });
  };

  const donutPaths = generateDonutPath(museumCategories);

  // Handle donut chart hover
  const handleDonutMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!donutRef.current) return;

    const rect = donutRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = event.clientX - rect.left - centerX;
    const y = event.clientY - rect.top - centerY;

    const angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    const normalizedAngle = angle < 0 ? angle + 360 : angle;

    let cumulativeAngle = 0;
    for (let i = 0; i < museumCategories.length; i++) {
      const segmentAngle = (museumCategories[i]!.percentage * 360) / 100;
      if (normalizedAngle >= cumulativeAngle && normalizedAngle <= cumulativeAngle + segmentAngle) {
        setHoveredSlice(i);
        return;
      }
      cumulativeAngle += segmentAngle;
    }
  };

  const handleMouseLeave = () => {
    setHoveredSlice(null);
  };

  if (isLoading || isLoadingEvents) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="rounded-2xl border bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards - Updated with real data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900">Tổng Người Dùng</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{formatNumber(overviewData?.totalUsers || 0)}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900">Bảo Tàng Hoạt Động</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{overviewData?.totalMuseums || 0}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900">Tour Ảo</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{overviewData?.totalTours || 0}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900">Chờ Xử Lý</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{overviewData?.totalPendingRequests || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Weekly Events Chart */}
        <Card className="lg:col-span-7 rounded-3xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">Sự Kiện Hàng Tuần</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Số lượng sự kiện theo tuần</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <div className="space-y-4">
              <div className="relative w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="weekLabel"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      dy={10}
                    />

                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={50} />

                    <Tooltip content={<CustomTooltip />} />

                    <Bar
                      dataKey="eventCount"
                      fill="url(#eventGradient)"
                      stroke="#FF6B35"
                      strokeWidth={1}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-6 m-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Sự kiện</span>
                  <span className="text-sm font-medium text-gray-900">
                    {chartData.length > 0
                      ? chartData.reduce((sum, item) => sum + item.eventCount, 0).toLocaleString()
                      : '0'}{' '}
                    tổng
                  </span>
                </div>
                {chartData.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Tuần gần nhất:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {chartData[chartData.length - 1]?.eventCount?.toLocaleString()} sự kiện
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Museum Categories Donut Chart - Updated with real data */}
        <Card className="lg:col-span-5 rounded-3xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-slate-900">Phân Loại Bảo Tàng</CardTitle>
            <p className="text-sm text-slate-600">Thống kê theo danh mục</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-center relative">
                <div className="relative">
                  <svg
                    ref={donutRef}
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    className="overflow-visible"
                    onMouseMove={handleDonutMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <defs>
                      <filter id="donutShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                      </filter>
                      <filter id="donutGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {donutPaths.map((item, index) => (
                      <g key={index}>
                        <path
                          d={hoveredSlice === index ? item.hoverPath : item.path}
                          fill={item.color}
                          className="transition-all duration-300 cursor-pointer"
                          stroke="white"
                          strokeWidth="3"
                          filter={hoveredSlice === index ? 'url(#donutGlow)' : 'url(#donutShadow)'}
                          style={{
                            opacity: hoveredSlice === null || hoveredSlice === index ? 1 : 0.6,
                            transform: hoveredSlice === index ? 'scale(1.02)' : 'scale(1)',
                            transformOrigin: '100px 100px',
                          }}
                        />
                      </g>
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-white rounded-full p-4 shadow-lg border">
                      <div className="text-3xl font-bold text-slate-900">{overviewData?.totalMuseums || 0}</div>
                      <div className="text-sm text-slate-600">Bảo tàng</div>
                    </div>
                  </div>

                  {hoveredSlice !== null && (
                    <div
                      className="absolute z-10 bg-slate-800 text-white rounded-lg px-3 py-2 pointer-events-none shadow-xl"
                      style={{
                        left: `${donutPaths[hoveredSlice]?.centerX}px`,
                        top: `${donutPaths[hoveredSlice]?.centerY}px`,
                        transform: 'translate(-50%, -100%)',
                        marginTop: '-8px',
                      }}
                    >
                      <div className="text-center">
                        <div className="font-bold text-sm">{museumCategories[hoveredSlice]?.name}</div>
                        <div className="text-xs opacity-80">
                          {museumCategories[hoveredSlice]?.count} bảo tàng ({museumCategories[hoveredSlice]?.percentage}
                          %)
                        </div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <div className="border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2">
                {museumCategories.map((category, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      hoveredSlice === index ? 'bg-orange-50' : 'hover:bg-orange-50'
                    }`}
                    onMouseEnter={() => setHoveredSlice(index)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-xs text-slate-700">{category.name}</span>
                    <span className="text-xs font-medium text-slate-900">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
