import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card } from '@musetrip360/ui-core/card';
import { Input } from '@musetrip360/ui-core/input';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { cn } from '@musetrip360/ui-core/utils';
import { IVirtualTour, useVirtualTourByMuseum } from '@musetrip360/virtual-tour';
import { AlertCircle, Eye, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { VirtualTourCard } from '../card/VirtualTourCard';

interface MuseumVirtualToursTabProps {
  museumId: string;
  className?: string;
}

export function MuseumVirtualToursTab({ museumId, className }: MuseumVirtualToursTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const {
    data: virtualToursData,
    isLoading,
    error,
  } = useVirtualTourByMuseum({
    museumId,
    Page: 1,
    PageSize: 50,
  });

  const allTours = (virtualToursData as any)?.list || [];

  // Frontend filtering and sorting
  const filteredTours = useMemo(() => {
    // Filter only active tours first
    let filtered = allTours.filter((tour: IVirtualTour) => tour.isActive);

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (tour: IVirtualTour) =>
          tour.name.toLowerCase().includes(query) ||
          tour.description.toLowerCase().includes(query) ||
          tour.metadata?.scenes?.some(
            (scene) =>
              scene.sceneName.toLowerCase().includes(query) || scene.sceneDescription?.toLowerCase().includes(query)
          )
      );
    }

    // Sort by rating first, then by update date
    return filtered.sort((a: IVirtualTour, b: IVirtualTour) => {
      // Sort by rating (highest first)
      if (a.rating !== b.rating) return b.rating - a.rating;

      // Then by update date (most recent first)
      if (a.updatedAt && b.updatedAt) {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      return 0;
    });
  }, [allTours, searchQuery]);

  // Calculate statistics (only for active tours)
  const tourStats = useMemo(() => {
    const activeTours = allTours.filter((tour: IVirtualTour) => tour.isActive);
    const totalScenes = activeTours.reduce(
      (acc: number, tour: IVirtualTour) => acc + (tour.metadata?.scenes?.length || 0),
      0
    );
    const averageRating =
      activeTours.length > 0
        ? activeTours.reduce((acc: number, tour: IVirtualTour) => acc + tour.rating, 0) / activeTours.length
        : 0;

    return { active: activeTours.length, totalScenes, averageRating };
  }, [allTours]);

  const handleTourClick = (tour: IVirtualTour) => {
    // Navigate to virtual tour detail page
    router.push(`/virtual-tour/${tour.id}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải danh sách tour ảo. Vui lòng thử lại sau.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Search */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Tour ảo 360°</h2>
            <p className="text-muted-foreground mt-1">Khám phá không gian bảo tàng qua công nghệ thực tế ảo</p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{tourStats.active}</div>
              <div className="text-xs text-muted-foreground">Tour ảo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-foreground">{tourStats.totalScenes}</div>
              <div className="text-xs text-muted-foreground">Không gian</div>
            </div>
            {tourStats.averageRating > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-foreground">{tourStats.averageRating.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">Đánh giá TB</div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tour ảo, không gian..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={clearSearch}
            >
              ✕
            </Button>
          )}
        </div>

        {/* Filter Summary */}
        {searchQuery && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              🔍 "{searchQuery}" - {filteredTours.length} kết quả
            </Badge>
            <Button variant="outline" size="sm" onClick={clearSearch}>
              Xóa tìm kiếm
            </Button>
          </div>
        )}
      </div>

      {/* Tours Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48 bg-muted/30" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-muted/30" />
                  <Skeleton className="h-4 w-full bg-muted/30" />
                  <Skeleton className="h-4 w-2/3 bg-muted/30" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-20 bg-muted/30" />
                    <Skeleton className="h-6 w-16 bg-muted/30" />
                  </div>
                  <Skeleton className="h-10 w-full bg-muted/30" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredTours.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Eye className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery ? 'Không tìm thấy tour ảo' : 'Chưa có tour ảo'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? `Không có tour ảo nào phù hợp với "${searchQuery}"`
                    : 'Bảo tàng chưa có tour ảo 360°. Hãy quay lại sau để trải nghiệm!'}
                </p>
                {searchQuery && (
                  <Button variant="outline" className="mt-4" onClick={clearSearch}>
                    Xem tất cả tour ảo
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Results Summary */}
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="font-semibold text-foreground">
                  {filteredTours.length} tour ảo
                  {searchQuery && <span className="text-primary ml-2">cho "{searchQuery}"</span>}
                </h3>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-primary/10 text-primary">{tourStats.active} tour ảo</Badge>
              </div>
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTours.map((tour: IVirtualTour) => (
                <VirtualTourCard key={tour.id} tour={tour} onClick={() => handleTourClick(tour)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
