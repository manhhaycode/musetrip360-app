'use client';

import { useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { useMuseums } from '@musetrip360/museum-management/api';
import type { Museum } from '@musetrip360/museum-management/types';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  Eye,
  History,
  Mail,
  MapPin,
  Microscope,
  Palette,
  Phone,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function FeaturedMuseums() {
  const router = useRouter();

  // Fetch real museums data
  const { data: museumsData, isLoading } = useMuseums({
    Page: 1,
    PageSize: 6,
    Status: 'Active', // Only show active museums
  });

  // Gradient backgrounds for fallback
  const fallbackGradients = [
    'bg-gradient-to-br from-amber-400 to-orange-500',
    'bg-gradient-to-br from-blue-400 to-cyan-500',
    'bg-gradient-to-br from-red-400 to-pink-500',
    'bg-gradient-to-br from-purple-400 to-indigo-500',
    'bg-gradient-to-br from-green-400 to-teal-500',
    'bg-gradient-to-br from-yellow-400 to-orange-500',
  ];

  // Process museum data with proper typing
  const displayMuseums: (Museum & {
    categoryIcon: any;
    image: string;
  })[] =
    museumsData?.data?.list?.map((museum, index) => ({
      ...museum,
      location: museum.location || 'Địa chỉ chưa cập nhật',
      categoryIcon:
        museum.categories?.[0]?.name === 'Art' || museum.categories?.[0]?.name === 'Nghệ thuật'
          ? Palette
          : museum.categories?.[0]?.name === 'Science' || museum.categories?.[0]?.name === 'Khoa học'
            ? Microscope
            : museum.categories?.[0]?.name === 'History' || museum.categories?.[0]?.name === 'Lịch sử'
              ? History
              : Palette,
      rating: museum.rating ?? 4.5,
      image:
        museum.metadata?.images?.[0] ||
        fallbackGradients[index % fallbackGradients.length] ||
        'bg-gradient-to-br from-gray-400 to-gray-500',
    })) || [];

  const { ref, visibleItems } = useStaggeredAnimation(displayMuseums.length, 150);

  const getCategoryColor = (category: string) => {
    // Normalize category name - remove "Bảo tàng" prefix and convert to lowercase
    const normalizedCategory = category
      ?.toLowerCase()
      .replace(/^bảo\s+tàng\s+/i, '') // Remove "Bảo tàng" prefix (case insensitive)
      .trim();

    switch (normalizedCategory) {
      case 'nghệ thuật':
      case 'art':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-0';
      case 'khoa học':
      case 'science':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg border-0';
      case 'lịch sử':
      case 'history':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-0';
      case 'văn hóa':
      case 'culture':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg border-0';
      case 'tự nhiên':
      case 'nature':
        return 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg border-0';
      case 'công nghệ':
      case 'technology':
        return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg border-0';
      case 'âm nhạc':
      case 'music':
        return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg border-0';
      case 'quân sự':
      case 'military':
        return 'bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow-lg border-0';
      case 'tôn giáo':
      case 'religion':
        return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg border-0';
      case 'thể thao':
      case 'sports':
        return 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg border-0';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg border-0';
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
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="animate-pulse overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-56 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="space-y-2 pt-4 border-t">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    </div>
                    <div className="flex justify-between pt-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : displayMuseums.length > 0 ? (
            displayMuseums.map((museum, index) => {
              const CategoryIcon = museum.categoryIcon;
              const isVisible = visibleItems.includes(index);
              const categoryName = museum.categories?.[0]?.name || 'Bảo tàng';

              return (
                <Card
                  key={museum.id}
                  className={`group cursor-pointer hover:shadow-xl transition-all duration-500 overflow-hidden ${
                    isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${index * 150}ms` : '0ms',
                  }}
                >
                  <CardContent className="p-0">
                    {/* Museum Image/Preview */}
                    <div
                      className={`relative h-56 overflow-hidden ${!museum.metadata?.images?.[0] ? museum.image : ''}`}
                    >
                      {/* Museum Image */}
                      {museum.metadata?.images?.[0] && (
                        <Image
                          src={museum.metadata.images[0]}
                          alt={museum.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index < 3} // Prioritize first 3 images
                        />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/40 transition-colors duration-300 z-10" />

                      {/* Top badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                        <div className="flex flex-col gap-2">
                          <Badge className={getCategoryColor(categoryName)}>
                            <CategoryIcon className="mr-1 h-3 w-3" />
                            {categoryName}
                          </Badge>
                        </div>

                        <div className="flex items-center bg-white/90 dark:bg-gray-900/90 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1.5" />
                          <span className="text-sm font-semibold">{museum.rating}</span>
                        </div>
                      </div>

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <Button
                          size="lg"
                          className="rounded-full bg-white/95 text-gray-900 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                          <Eye className="h-5 w-5 mr-2" />
                          Xem 360°
                        </Button>
                      </div>

                      {/* Bottom info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
                        <h3 className="font-bold text-xl mb-1 group-hover:text-accent transition-colors">
                          {museum.name}
                        </h3>
                        <p className="text-sm flex items-center opacity-90">
                          <MapPin className="mr-1.5 h-4 w-4" />
                          {museum.location}
                        </p>
                      </div>
                    </div>

                    {/* Museum Details */}
                    <div className="p-6 space-y-4">
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{museum.description}</p>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 gap-3 py-3 border-t border-border">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-2 h-4 w-4 text-primary" />
                          <span>{museum.contactPhone}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="mr-2 h-4 w-4 text-primary" />
                          <span>{museum.contactEmail}</span>
                        </div>
                      </div>

                      {/* Social Links */}
                      {museum.metadata?.socialLinks && (
                        <div className="flex gap-2 py-2">
                          {museum.metadata.socialLinks.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={museum.metadata.socialLinks.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Website
                              </a>
                            </Button>
                          )}
                          {museum.metadata.socialLinks.facebook && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={museum.metadata.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                Facebook
                              </a>
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="mr-1.5 h-4 w-4" />
                          <span>Mở cửa hôm nay</span>
                        </div>
                        <Button
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={() => router.push(`/museum/${museum.id}`)}
                        >
                          Khám phá
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            // Empty state
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-lg font-semibold mb-2">Không có bảo tàng nào</h3>
              <p className="text-muted-foreground">Hiện tại chưa có bảo tàng nào hoạt động trong hệ thống.</p>
            </div>
          )}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link href={'/search?type=Museum'}>
            <Button size="lg" variant="outline" className="group">
              Xem tất cả bảo tàng
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
