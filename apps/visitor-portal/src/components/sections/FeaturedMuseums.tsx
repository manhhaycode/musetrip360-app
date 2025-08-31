'use client';

import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { useMuseums } from '@musetrip360/museum-management/api';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { ArrowRight, Eye, History, MapPin, Microscope, Palette, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

const museums = [
  {
    id: 1,
    name: 'Bảo tàng Louvre',
    location: 'Paris, Pháp',
    category: 'Nghệ thuật',
    categoryIcon: Palette,
    rating: 4.9,
    visitors: '12.5K',
    openTime: '9:00 - 18:00',
    price: 'Miễn phí',
    image: 'bg-gradient-to-br from-amber-400 to-orange-500',
    features: ['360° VR', 'AR Ready'],
    description: 'Bảo tàng nghệ thuật lớn nhất thế giới với hơn 35,000 tác phẩm nghệ thuật',
  },
  {
    id: 2,
    name: 'Bảo tàng Khoa học London',
    location: 'London, Anh',
    category: 'Khoa học',
    categoryIcon: Microscope,
    rating: 4.8,
    visitors: '8.2K',
    openTime: '10:00 - 17:00',
    price: '150,000đ',
    image: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    features: ['360° VR', 'Interactive'],
    description: 'Khám phá lịch sử khoa học và công nghệ qua các triển lãm tương tác',
  },
  {
    id: 3,
    name: 'Bảo tàng Lịch sử Việt Nam',
    location: 'Hà Nội, Việt Nam',
    category: 'Lịch sử',
    categoryIcon: History,
    rating: 4.7,
    visitors: '15.3K',
    openTime: '8:00 - 17:00',
    price: '50,000đ',
    image: 'bg-gradient-to-br from-red-400 to-pink-500',
    features: ['360° VR', 'Guided Tour'],
    description: 'Hành trình qua lịch sử dân tộc Việt Nam từ thời nguyên thủy đến hiện đại',
  },
  {
    id: 4,
    name: 'Metropolitan Museum',
    location: 'New York, Mỹ',
    category: 'Nghệ thuật',
    categoryIcon: Palette,
    rating: 4.9,
    visitors: '22.1K',
    openTime: '10:00 - 17:00',
    price: '250,000đ',
    image: 'bg-gradient-to-br from-purple-400 to-indigo-500',
    features: ['360° VR', 'AR Ready', 'AI Guide'],
    description: 'Một trong những bảo tàng nghệ thuật lớn nhất và có ảnh hưởng nhất thế giới',
  },
  {
    id: 5,
    name: 'Bảo tàng Guggenheim',
    location: 'Bilbao, Tây Ban Nha',
    category: 'Nghệ thuật',
    categoryIcon: Palette,
    rating: 4.8,
    visitors: '9.8K',
    openTime: '10:00 - 20:00',
    price: '200,000đ',
    image: 'bg-gradient-to-br from-green-400 to-teal-500',
    features: ['360° VR', 'Architecture Tour'],
    description: 'Kiến trúc độc đáo và bộ sưu tập nghệ thuật đương đại ấn tượng',
  },
  {
    id: 6,
    name: 'Bảo tàng Khoa học Tự nhiên',
    location: 'Tokyo, Nhật Bản',
    category: 'Khoa học',
    categoryIcon: Microscope,
    rating: 4.6,
    visitors: '6.7K',
    openTime: '9:00 - 17:00',
    price: '100,000đ',
    image: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    features: ['360° VR', 'Interactive', 'Hologram'],
    description: 'Khám phá thế giới tự nhiên qua công nghệ hiện đại và triển lãm tương tác',
  },
];

export function FeaturedMuseums() {
  const router = useRouter();

  // Fetch real museums data
  const { data: museumsData, isLoading } = useMuseums({
    Page: 1,
    PageSize: 6,
    Status: 'Active', // Only show active museums
  });

  // Use real data if available, fallback to fake data for layout preservation
  const displayMuseums =
    museumsData?.data && museumsData.data.list.length
      ? museumsData.data.list.map((museum, index) => ({
          id: museum.id,
          name: museum.name,
          location: museum.location || 'Địa chỉ chưa cập nhật',
          category: museum.categories?.[0]?.name || 'Bảo tàng',
          categoryIcon:
            museum.categories?.[0]?.name === 'Art'
              ? Palette
              : museum.categories?.[0]?.name === 'Science'
                ? Microscope
                : museum.categories?.[0]?.name === 'History'
                  ? History
                  : Palette,
          rating: museum.rating || 4.5,
          image: museums[index % museums.length]?.image || 'bg-gradient-to-br from-gray-400 to-gray-500',
          description: museum.description || museum.name,
        }))
      : museums;

  const { ref, visibleItems } = useStaggeredAnimation(displayMuseums.length, 150);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Nghệ thuật':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'Khoa học':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'Lịch sử':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getFeatureBadgeColor = (feature: string) => {
    switch (feature) {
      case '360° VR':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'AR Ready':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'Interactive':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Guided Tour':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'AI Guide':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'Architecture Tour':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300';
      case 'Hologram':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-screen-2xl px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-lg font-medium rounded-xl p-2">
            🏛️ Bảo tàng nổi bật
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight mb-4 lg:text-4xl">
            Khám phá những{' '}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
              bảo tàng tuyệt vời
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hành trình qua những bảo tàng nổi tiếng nhất thế giới với công nghệ thực tế ảo 360° và trải nghiệm tương
            tác.
          </p>
        </div>

        {/* Museums Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : displayMuseums.map((museum, index) => {
                const CategoryIcon = museum.categoryIcon;
                const isVisible = visibleItems.includes(index);

                return (
                  <Card
                    key={museum.id}
                    className={`group cursor-pointer hover:shadow-xl transition-all duration-500 ${
                      isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      transitionDelay: isVisible ? `${index * 150}ms` : '0ms',
                    }}
                  >
                    <CardContent className="p-0">
                      {/* Museum Image/Preview */}
                      <div className={`relative h-48 ${museum.image} overflow-hidden`}>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className={getCategoryColor(museum.category)}>
                            <CategoryIcon className="mr-1 h-3 w-3" />
                            {museum.category}
                          </Badge>
                        </div>

                        {/* Rating */}
                        <div className="absolute top-4 right-4 flex items-center bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded-full shadow-sm">
                          <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                          <span className="text-xs font-medium">{museum.rating}</span>
                        </div>

                        {/* Feature Badges */}
                        {/* <div className="absolute bottom-4 left-4 flex flex-wrap gap-1">
                          {museum.features.map((feature) => (
                            <Badge
                              key={feature}
                              variant="secondary"
                              className={`${getFeatureBadgeColor(feature)} text-sm`}
                            >
                              {feature === '360° VR' && <Eye className="mr-1 h-2 w-2" />}
                              {feature === 'AR Ready' && <Camera className="mr-1 h-2 w-2" />}
                              {feature === 'Interactive' && <Users className="mr-1 h-2 w-2" />}
                              {feature}
                            </Badge>
                          ))}
                        </div> */}

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="sm"
                            className="rounded-full bg-white/90 text-gray-900 hover:bg-white hover:scale-110 transition-all duration-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Museum Info */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                            {museum.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="mr-1 h-3 w-3" />
                            {museum.location}
                          </p>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{museum.description}</p>

                        {/* Stats Grid */}
                        {/* <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {museum.openTime}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-3 w-3" />
                            {museum.visitors} đã xem
                          </div>
                        </div> */}

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between pt-2">
                          {/* <div>
                            <span className="text-lg font-semibold text-primary">{museum.price}</span>
                            <span className="text-sm text-muted-foreground ml-1">/ tour</span>
                          </div> */}
                          <Button
                            size="sm"
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            onClick={() => router.push(`/museum/${museum.id}`)}
                          >
                            Xem tour
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
            Xem tất cả bảo tàng
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
