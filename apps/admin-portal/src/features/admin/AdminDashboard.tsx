import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { ArrowDownRight, ArrowUpRight, Building2, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useRef, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('3 tháng gần đây');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const donutRef = useRef<SVGSVGElement>(null);

  // Dữ liệu xu hướng được format lại cho Recharts
  const visitorTrends = {
    '7 ngày gần đây': [
      { period: 'T2', tourVirtual: 534, directVisit: 356, total: 890, date: 'T2' },
      { period: 'T3', tourVirtual: 672, directVisit: 448, total: 1120, date: 'T3' },
      { period: 'T4', tourVirtual: 588, directVisit: 392, total: 980, date: 'T4' },
      { period: 'T5', tourVirtual: 810, directVisit: 540, total: 1350, date: 'T5' },
      { period: 'T6', tourVirtual: 690, directVisit: 460, total: 1150, date: 'T6' },
      { period: 'T7', tourVirtual: 948, directVisit: 632, total: 1580, date: 'T7' },
      { period: 'CN', tourVirtual: 828, directVisit: 552, total: 1380, date: 'CN' },
    ],
    '30 ngày gần đây': [
      { period: 'Tuần 1', tourVirtual: 2520, directVisit: 1680, total: 4200, date: 'Tuần 1' },
      { period: 'Tuần 2', tourVirtual: 3060, directVisit: 2040, total: 5100, date: 'Tuần 2' },
      { period: 'Tuần 3', tourVirtual: 2880, directVisit: 1920, total: 4800, date: 'Tuần 3' },
      { period: 'Tuần 4', tourVirtual: 3720, directVisit: 2480, total: 6200, date: 'Tuần 4' },
      { period: 'Tuần 5', tourVirtual: 3480, directVisit: 2320, total: 5800, date: 'Tuần 5' },
      { period: 'Tuần 6', tourVirtual: 4260, directVisit: 2840, total: 7100, date: 'Tuần 6' },
      { period: 'Tuần 7', tourVirtual: 4080, directVisit: 2720, total: 6800, date: 'Tuần 7' },
    ],
    '3 tháng gần đây': [
      { period: 'T10', tourVirtual: 11100, directVisit: 7400, total: 18500, date: 'T10' },
      { period: 'T11-T1', tourVirtual: 13200, directVisit: 8800, total: 22000, date: 'T11-T1' },
      { period: 'T11-T2', tourVirtual: 15360, directVisit: 10240, total: 25600, date: 'T11-T2' },
      { period: 'T11-T3', tourVirtual: 14520, directVisit: 9680, total: 24200, date: 'T11-T3' },
      { period: 'T12-T1', tourVirtual: 17340, directVisit: 11560, total: 28900, date: 'T12-T1' },
      { period: 'T12-T2', tourVirtual: 16080, directVisit: 10720, total: 26800, date: 'T12-T2' },
      { period: 'T12-T3', tourVirtual: 18720, directVisit: 12480, total: 31200, date: 'T12-T3' },
      { period: 'T1-T1', tourVirtual: 17700, directVisit: 11800, total: 29500, date: 'T1-T1' },
      { period: 'T1-T2', tourVirtual: 20280, directVisit: 13520, total: 33800, date: 'T1-T2' },
    ],
  };

  const currentData = visitorTrends[selectedPeriod as keyof typeof visitorTrends];

  // Danh mục bảo tàng với màu sắc sunset
  const museumCategories = [
    { name: 'Lịch sử', count: 42, color: '#FF6B35', percentage: 35.0 },
    { name: 'Nghệ thuật', count: 35, color: '#F7931E', percentage: 29.2 },
    { name: 'Khoa học', count: 25, color: '#FFB570', percentage: 20.8 },
    { name: 'Dân tộc', count: 12, color: '#FFCC9A', percentage: 10.0 },
    { name: 'Khác', count: 6, color: '#FFE0CC', percentage: 5.0 },
  ];

  // Dữ liệu khu vực
  const regionData = [
    { label: 'Hà Nội', value: 142, color: '#FF6B35', gradient: 'from-orange-500 to-orange-400' },
    { label: 'TP.HCM', value: 118, color: '#F7931E', gradient: 'from-amber-500 to-amber-400' },
    { label: 'Đà Nẵng', value: 95, color: '#FFB570', gradient: 'from-orange-400 to-orange-300' },
    { label: 'Huế', value: 78, color: '#FFCC9A', gradient: 'from-amber-400 to-amber-300' },
    { label: 'Khác', value: 45, color: '#FFE0CC', gradient: 'from-orange-300 to-orange-200' },
  ];

  // Custom Tooltip cho AreaChart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-slate-800 text-white rounded-lg px-3 py-2 shadow-xl">
          <div className="text-center">
            <div className="text-xs opacity-80 mb-1">{label}</div>
            <div className="font-bold text-sm">🏛️ Tour ảo: {data?.tourVirtual?.toLocaleString()}</div>
            <div className="font-bold text-sm">👥 Trực tiếp: {data?.directVisit?.toLocaleString()}</div>
            <div className="text-xs mt-1 border-t border-white/20 pt-1">Tổng: {data?.total?.toLocaleString()}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Cải thiện biểu đồ donut với tương tác hover mạnh mẽ
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

      // Main arc
      const x1 = 100 + radius * Math.cos(startAngleRad);
      const y1 = 100 + radius * Math.sin(startAngleRad);
      const x2 = 100 + radius * Math.cos(endAngleRad);
      const y2 = 100 + radius * Math.sin(endAngleRad);

      const x3 = 100 + innerRadius * Math.cos(endAngleRad);
      const y3 = 100 + innerRadius * Math.sin(endAngleRad);
      const x4 = 100 + innerRadius * Math.cos(startAngleRad);
      const y4 = 100 + innerRadius * Math.sin(startAngleRad);

      const largeArc = endAngle - startAngle > 180 ? 1 : 0;

      // Hover path - slightly larger
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

  // Xử lý hover cho donut chart
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

  return (
    <div className="space-y-6">
      {/* Thẻ thống kê nhanh - Text màu đen */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900">Tổng Lượt Thăm</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">2.4M</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">+12.5%</span>
              <span className="text-sm ml-2 text-slate-600">tháng này</span>
            </div>
            <div className="mt-3 w-full bg-orange-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: '75%' }}
              ></div>
            </div>
            <p className="text-xs text-slate-600 mt-2">Lượt truy cập từ tất cả bảo tàng</p>
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
            <div className="text-2xl font-bold text-slate-900">142</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">+8.2%</span>
              <span className="text-sm ml-2 text-slate-600">so với tháng trước</span>
            </div>
            <div className="mt-3 w-full bg-amber-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: '85%' }}
              ></div>
            </div>
            <p className="text-xs text-slate-600 mt-2">Đang vận hành bình thường</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-900">Đã Phê Duyệt</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">23</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">+15.3%</span>
              <span className="text-sm ml-2 text-slate-600">tuần này</span>
            </div>
            <div className="mt-3 w-full bg-yellow-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: '60%' }}
              ></div>
            </div>
            <p className="text-xs text-slate-600 mt-2">Yêu cầu đăng ký mới</p>
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
            <div className="text-2xl font-bold text-slate-900">7</div>
            <div className="flex items-center mt-2">
              <ArrowDownRight className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">-23.1%</span>
              <span className="text-sm ml-2 text-slate-600">giảm so với tuần trước</span>
            </div>
            <div className="mt-3 w-full bg-orange-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: '30%' }}
              ></div>
            </div>
            <p className="text-xs text-slate-600 mt-2">Cần xem xét và phê duyệt</p>
          </CardContent>
        </Card>
      </div>

      {/* Lưới biểu đồ chính */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Biểu đồ Tổng Lượt Thăm với nhiều điểm nhấp nhô */}
        <Card className="lg:col-span-7 rounded-3xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-slate-900">Lượt Thăm Bảo Tàng</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Thống kê theo thời gian</p>
              </div>
              <div className="flex items-center gap-2">
                {['3 tháng gần đây', '30 ngày gần đây', '7 ngày gần đây'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                      selectedPeriod === period
                        ? 'bg-orange-100 text-orange-800 font-medium shadow-sm'
                        : 'text-slate-700 hover:bg-orange-50'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-2">
            <div className="space-y-4">
              <div className="relative w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tourVirtualGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="directVisitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFB570" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FFB570" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      dy={10}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {/* Direct Visit Area (bottom layer) */}
                    <Area
                      type="monotone"
                      dataKey="directVisit"
                      stackId="1"
                      stroke="#FFB570"
                      strokeWidth={2}
                      fill="url(#directVisitGradient)"
                    />

                    {/* Tour Virtual Area (top layer) */}
                    <Area
                      type="monotone"
                      dataKey="tourVirtual"
                      stackId="1"
                      stroke="#FF6B35"
                      strokeWidth={2}
                      fill="url(#tourVirtualGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Tour ảo</span>
                  <span className="text-sm font-medium text-gray-900">
                    {currentData[currentData.length - 1]?.tourVirtual?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
                  <span className="text-sm text-gray-600">Trực tiếp</span>
                  <span className="text-sm font-medium text-gray-900">
                    {currentData[currentData.length - 1]?.directVisit?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biểu đồ Donut với tương tác hover mạnh mẽ */}
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
                      <div className="text-3xl font-bold text-slate-900">142</div>
                      <div className="text-sm text-slate-600">Bảo tàng</div>
                    </div>
                  </div>

                  {/* Hover tooltip cho donut */}
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

        {/* Biểu đồ Cột Ngang */}
        <Card className="lg:col-span-12 rounded-3xl border bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-slate-900">Phân Bố Theo Khu Vực</CardTitle>
            <p className="text-sm text-slate-600">Số lượng bảo tàng tại các thành phố lớn</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                {regionData.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 text-sm text-slate-700 text-right font-medium">{item.label}</div>
                    <div className="flex-1 relative">
                      <div className="h-8 bg-orange-100 rounded-lg overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${item.gradient} rounded-lg transition-all duration-500 hover:brightness-110 cursor-pointer relative overflow-hidden`}
                          style={{
                            width: `${(item.value / Math.max(...regionData.map((d) => d.value))) * 100}%`,
                          }}
                          onMouseEnter={() => setHoveredBarIndex(index)}
                          onMouseLeave={() => setHoveredBarIndex(null)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full animate-pulse"></div>
                        </div>
                      </div>
                      {hoveredBarIndex === index && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-sm font-bold drop-shadow-md">
                          {item.value} bảo tàng
                        </div>
                      )}
                    </div>
                    <div className="w-12 text-sm text-slate-900 font-bold">{item.value}</div>
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
