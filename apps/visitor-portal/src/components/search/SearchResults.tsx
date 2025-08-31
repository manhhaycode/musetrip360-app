'use client';

import { SearchResultItem, TYPE_OPTIONS } from '../../types/search';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader } from '@musetrip360/ui-core/card';
import { ArrowRight, Heart, MapPin, Share2, Users, Clock, Star, Calendar, Eye } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface SearchResultsProps {
  results: SearchResultItem[];
  isLoading?: boolean;
  error?: string | null;
}

export function SearchResults({ results, isLoading = false, error }: SearchResultsProps) {
  const router = useRouter();

  const handleFavorite = (itemId: string) => {
    // TODO: Implement favorite functionality
    console.log('Toggle favorite for item:', itemId);
  };

  const handleShare = (itemId: string) => {
    // TODO: Implement share functionality
    console.log('Share item:', itemId);
  };

  const handleNavigateToDetail = (item: SearchResultItem) => {
    if (item.type === 'Museum') {
      router.push(`/museum/${item.id}`);
    }
    if (item.type === 'Artifact') {
      router.push(`/artifact/${item.id}`);
    }
    if (item.type === 'Event') {
      router.push(`/event/${item.id}`);
    }
    if (item.type === 'TourOnline') {
      router.push(`/virtual-tour/${item.id}`);
    }
    // TODO: Add navigation for other types when their detail pages are ready
  };

  const handleCardClick = (item: SearchResultItem, event: React.MouseEvent) => {
    // Only navigate if the click is not on an interactive element
    const target = event.target as HTMLElement;
    if (!target.closest('button')) {
      handleNavigateToDetail(item);
    }
  };

  const getTypeIcon = (type: string) => {
    return TYPE_OPTIONS.find((t) => t.value === type)?.icon || '📄';
  };

  const getTypeLabel = (type: string) => {
    return TYPE_OPTIONS.find((t) => t.value === type)?.label || type;
  };

  const getLocationAddress = (item: SearchResultItem) => {
    // Mock addresses based on item type - in real app, this would come from API
    const mockAddresses = {
      Museum: [
        '97A Phó Đức Chính, Quận 1, TP.HCM',
        'Số 25 Lý Tự Trọng, Quận 1, TP.HCM',
        '2 Nguyễn Bỉnh Khiêm, Quận 1, TP.HCM',
        'Rue de Rivoli, 75001 Paris, France',
        'Số 4 Trần Phú, TP. Vũng Tàu',
      ],
      Artifact: [
        'Bảo tàng Lịch sử Việt Nam, Hà Nội',
        'Bảo tàng Dân tộc học, Hà Nội',
        'Bảo tàng Mỹ thuật TP.HCM',
        'Bảo tàng Chăm Đà Nẵng',
      ],
      Event: [
        'Nhà hát Thành phố, Quận 1, TP.HCM',
        'Trung tâm triển lãm Gem Center, TP.HCM',
        'Nhà văn hóa thanh niên, Hà Nội',
        'Trung tâm Hội nghị Quốc gia, Hà Nội',
      ],
      TourOnline: ['Tour ảo - Khả dụng mọi nơi', 'Trải nghiệm online', 'Tour ảo 360°', 'Tham quan từ xa'],
    };

    const addresses = mockAddresses[item.type] || ['Chưa có thông tin địa chỉ'];
    const randomIndex = Math.abs(item.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % addresses.length;
    return addresses[randomIndex];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <CardHeader className="pb-3">
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ArrowRight className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả nào</h3>
          <p className="text-muted-foreground mb-4">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn</p>
          <Button variant="outline">Xóa bộ lọc</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={(e) => handleCardClick(item, e)}
          >
            <div className="relative">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail.trim()}
                  alt={item.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-6xl">{getTypeIcon(item.type)}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(item.id);
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(item.id);
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Type Badge */}
              <Badge variant="secondary" className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm">
                <span className="mr-1">{getTypeIcon(item.type)}</span>
                {getTypeLabel(item.type)}
              </Badge>
            </div>

            <CardHeader className="pb-3">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                  {item.title}
                </h3>

                {/* Location Address */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 font-medium">{item.location || getLocationAddress(item)}</p>
                    </div>
                  </div>
                </div>

                {/* Type-specific Info */}
                {item.type === 'Museum' && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Mở cửa hàng ngày</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>4.5 (125 đánh giá)</span>
                    </div>
                  </div>
                )}

                {item.type === 'Event' && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Sự kiện sắp tới</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>50 người tham gia</span>
                    </div>
                  </div>
                )}

                {item.type === 'Artifact' && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Thế kỷ 18-19</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>Hiện vật quý hiếm</span>
                    </div>
                  </div>
                )}

                {item.type === 'TourOnline' && (
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>45 phút</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>1.2k lượt xem</span>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{item.description}</p>

                {/* Features/Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.type === 'Museum' && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        🎨 Nghệ thuật
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        🏛️ Lịch sử
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ♿ Tiếp cận dễ dàng
                      </Badge>
                    </>
                  )}

                  {item.type === 'Event' && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        🎪 Triển lãm
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        📅 Cuối tuần
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        🎫 Miễn phí
                      </Badge>
                    </>
                  )}

                  {item.type === 'Artifact' && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        🏺 Gốm sứ
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        🇻🇳 Việt Nam
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ⭐ Nổi bật
                      </Badge>
                    </>
                  )}

                  {item.type === 'TourOnline' && (
                    <>
                      <Badge variant="outline" className="text-xs">
                        🌐 360°
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        🎧 Có âm thanh
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        📱 Mobile
                      </Badge>
                    </>
                  )}
                </div>

                {/* Additional Info Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {item.type === 'Museum' && (
                      <>
                        <span>💰 Từ 50,000đ</span>
                        <span>⏰ 8:00-17:00</span>
                        <span>🎫 Vé có sẵn</span>
                      </>
                    )}

                    {item.type === 'Event' && (
                      <>
                        <span>📅 15/03/2024</span>
                        <span>👥 25/50 chỗ</span>
                        <span>💰 Miễn phí</span>
                      </>
                    )}

                    {item.type === 'Artifact' && (
                      <>
                        <span>📐 45cm x 30cm</span>
                        <span>⚖️ 2.3kg</span>
                        <span>🏛️ Đang trưng bày</span>
                      </>
                    )}

                    {item.type === 'TourOnline' && (
                      <>
                        <span>🎬 12 cảnh</span>
                        <span>📊 4.8/5</span>
                        <span>🌍 Đa ngôn ngữ</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {item.type === 'Museum' && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Heart className="h-4 w-4 mr-2" />
                        Yêu thích
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToDetail(item);
                        }}
                      >
                        Xem chi tiết
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </>
                  )}

                  {item.type === 'Event' && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        Đặt chỗ
                      </Button>
                      <Button size="sm" className="flex-1">
                        Chi tiết
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </>
                  )}

                  {item.type === 'Artifact' && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem 3D
                      </Button>
                      <Button size="sm" className="flex-1">
                        Tìm hiểu
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </>
                  )}

                  {item.type === 'TourOnline' && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Users className="h-4 w-4 mr-2" />
                        Xem tour
                      </Button>
                      <Button size="sm" className="flex-1">
                        Bắt đầu
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
