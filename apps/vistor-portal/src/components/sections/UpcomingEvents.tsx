'use client';

import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Progress } from '@musetrip360/ui-core/progress';
import { Calendar, MapPin, Users, Clock, ArrowRight, Star, Eye, Headset, Monitor, Wifi, Zap } from 'lucide-react';
import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';

const events = [
  {
    id: 1,
    title: 'Triển lãm "Leonardo da Vinci: Thiên tài Phục hưng"',
    description: 'Khám phá cuộc đời và tác phẩm của Leonardo da Vinci qua công nghệ thực tế ảo tiên tiến',
    museum: 'Bảo tàng Louvre',
    location: 'Paris, Pháp',
    date: '2024-02-15',
    time: '19:00 - 21:00',
    type: 'online',
    category: 'Triển lãm',
    price: 'Miễn phí',
    capacity: { current: 850, max: 1000 },
    rating: 4.8,
    image: 'bg-gradient-to-br from-blue-500 to-purple-600',
    speaker: 'Dr. Marie Dubois',
    highlights: ['Thực tế ảo', 'Q&A trực tiếp', 'Tài liệu độc quyền'],
    featured: true,
  },
  {
    id: 2,
    title: 'Workshop: "Khảo cổ học hiện đại"',
    description: 'Tìm hiểu các phương pháp khảo cổ học hiện đại và công nghệ trong nghiên cứu lịch sử',
    museum: 'Bảo tàng Lịch sử Việt Nam',
    location: 'Hà Nội, Việt Nam',
    date: '2024-02-18',
    time: '14:00 - 17:00',
    type: 'offline',
    category: 'Workshop',
    price: '200,000đ',
    capacity: { current: 45, max: 50 },
    rating: 4.9,
    image: 'bg-gradient-to-br from-amber-500 to-orange-600',
    speaker: 'GS. Nguyễn Văn Minh',
    highlights: ['Thực hành trực tiếp', 'Công cụ chuyên nghiệp', 'Chứng chỉ'],
    featured: false,
  },
  {
    id: 3,
    title: 'Hội thảo: "Công nghệ VR trong Bảo tàng"',
    description: 'Thảo luận về ứng dụng công nghệ thực tế ảo trong việc trưng bày và bảo tồn di sản',
    museum: 'Bảo tàng Khoa học London',
    location: 'London, Anh',
    date: '2024-02-20',
    time: '10:00 - 12:00',
    type: 'hybrid',
    category: 'Hội thảo',
    price: '150,000đ',
    capacity: { current: 280, max: 300 },
    rating: 4.7,
    image: 'bg-gradient-to-br from-green-500 to-teal-600',
    speaker: 'Prof. James Mitchell',
    highlights: ['Công nghệ mới nhất', 'Demo trực tiếp', 'Networking'],
    featured: false,
  },
  {
    id: 4,
    title: 'Tour ảo: "Ai Cập cổ đại"',
    description: 'Hành trình khám phá các kim tự tháp và lăng mộ Ai Cập cổ đại với công nghệ 360°',
    museum: 'Bảo tàng Ai Cập',
    location: 'Cairo, Ai Cập',
    date: '2024-02-22',
    time: '20:00 - 21:30',
    type: 'vr',
    category: 'Tour ảo',
    price: '100,000đ',
    capacity: { current: 1500, max: 2000 },
    rating: 4.9,
    image: 'bg-gradient-to-br from-yellow-500 to-red-600',
    speaker: 'Dr. Ahmed Hassan',
    highlights: ['VR 360°', 'Âm thanh 3D', 'Tương tác thời gian thực'],
    featured: false,
  },
  {
    id: 5,
    title: 'Masterclass: "Nhiếp ảnh Di sản"',
    description: 'Học cách chụp ảnh các di tích lịch sử và hiện vật bảo tàng một cách chuyên nghiệp',
    museum: 'Metropolitan Museum',
    location: 'New York, Mỹ',
    date: '2024-02-25',
    time: '16:00 - 18:00',
    type: 'online',
    category: 'Masterclass',
    price: '300,000đ',
    capacity: { current: 120, max: 150 },
    rating: 4.8,
    image: 'bg-gradient-to-br from-purple-500 to-pink-600',
    speaker: 'Sarah Williams',
    highlights: ['Kỹ thuật chuyên nghiệp', 'Editing tips', 'Portfolio review'],
    featured: false,
  },
  {
    id: 6,
    title: 'Sự kiện gia đình: "Khoa học vui"',
    description: 'Hoạt động khoa học thú vị dành cho gia đình với các thí nghiệm tương tác',
    museum: 'Bảo tàng Khoa học Tự nhiên',
    location: 'Tokyo, Nhật Bản',
    date: '2024-02-28',
    time: '13:00 - 16:00',
    type: 'hybrid',
    category: 'Gia đình',
    price: '50,000đ',
    capacity: { current: 200, max: 250 },
    rating: 4.6,
    image: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    speaker: 'Dr. Yuki Tanaka',
    highlights: ['Thí nghiệm tương tác', 'Quà tặng', 'Hoạt động nhóm'],
    featured: false,
  },
];

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'online':
      return Monitor;
    case 'offline':
      return MapPin;
    case 'hybrid':
      return Wifi;
    case 'vr':
      return Headset;
    default:
      return Calendar;
  }
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'online':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'offline':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'hybrid':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
    case 'vr':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export function UpcomingEvents() {
  const { ref, visibleItems } = useStaggeredAnimation(events.length, 150);

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-screen-2xl px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-lg font-medium rounded-xl p-2">
            📅 Sự kiện sắp diễn ra
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight mb-4 lg:text-4xl">
            Tham gia{' '}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
              sự kiện hấp dẫn
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Đăng ký tham gia các triển lãm, workshop và sự kiện văn hóa độc đáo từ khắp nơi trên thế giới.
          </p>
        </div>

        {/* Events Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {events.map((event, index) => {
            const TypeIcon = getEventTypeIcon(event.type);
            const isVisible = visibleItems.includes(index);
            const capacityPercentage = (event.capacity.current / event.capacity.max) * 100;

            return (
              <Card
                key={event.id}
                className={`group cursor-pointer hover:shadow-xl transition-all duration-500 ${
                  isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'
                } ${event.featured ? 'ring-2 ring-primary/20' : ''}`}
              >
                <CardContent className="p-0">
                  {/* Event Image/Preview */}
                  <div className={`relative h-48 ${event.image} overflow-hidden`}>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Featured Badge */}
                    {event.featured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <Star className="mr-1 h-3 w-3 fill-current" />
                          Nổi bật
                        </Badge>
                      </div>
                    )}

                    {/* Event Type Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className={getEventTypeColor(event.type)}>
                        <TypeIcon className="mr-1 h-3 w-3" />
                        {event.type === 'online' && 'Trực tuyến'}
                        {event.type === 'offline' && 'Tại chỗ'}
                        {event.type === 'hybrid' && 'Kết hợp'}
                        {event.type === 'vr' && 'VR'}
                      </Badge>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-4 left-4">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-gray-900 dark:bg-gray-900/90 dark:text-gray-100"
                      >
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(event.date)}
                      </Badge>
                    </div>

                    {/* Quick Action Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="rounded-full bg-white/90 text-gray-900 hover:bg-white hover:scale-110 transition-all duration-300"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="p-6 space-y-4">
                    {/* Category */}
                    <Badge variant="outline" className="text-xs">
                      {event.category}
                    </Badge>

                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.description}</p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-3 w-3" />
                        <span>{event.museum}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 h-3 w-3" />
                        <span>Diễn giả: {event.speaker}</span>
                      </div>
                    </div>

                    {/* Capacity Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Đã đăng ký</span>
                        <span className="font-medium">
                          {event.capacity.current}/{event.capacity.max}
                        </span>
                      </div>
                      <Progress value={capacityPercentage} className="h-2" />
                      {capacityPercentage > 80 && (
                        <p className="text-xs text-orange-600 dark:text-orange-400">
                          <Zap className="inline h-3 w-3 mr-1" />
                          Sắp hết chỗ!
                        </p>
                      )}
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1">
                      {event.highlights.map((highlight, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>

                    {/* Price and Rating */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-primary">{event.price}</span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs ml-1">{event.rating}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Đăng ký
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="group">
            Xem tất cả sự kiện
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
