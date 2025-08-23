'use client';

import { Eye, EyeOff, MapPin, Search, Star } from 'lucide-react';
import * as React from 'react';

import { Event } from '@/types';
import { useAddEventTourOnlines, useRemoveEventTourOnlines } from '@/api';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent } from '@musetrip360/ui-core/card';
import { Checkbox } from '@musetrip360/ui-core/checkbox';
import { Input } from '@musetrip360/ui-core/input';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { toast } from '@musetrip360/ui-core/sonner';
import { cn } from '@musetrip360/ui-core/utils';
import { IVirtualTour, useVirtualTourByMuseum } from '@musetrip360/virtual-tour/api';
import { VirtualTourViewer } from '@musetrip360/virtual-tour/components';
export interface EventTourOnlineFormProps {
  event: Event;
  className?: string;
  onUpdated?: () => void;
}

interface TourSelectionPanelProps {
  tours: IVirtualTour[];
  selectedTourIds: string[];
  onSelectionChange: (tourIds: string[]) => void;
  onPreviewTour: (tour: IVirtualTour) => void;
  isLoading: boolean;
  isUpdating?: boolean;
}

function TourSelectionPanel({
  tours,
  selectedTourIds,
  onSelectionChange,
  onPreviewTour,
  isLoading,
  isUpdating = false,
}: TourSelectionPanelProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredTours = React.useMemo(() => {
    if (!debouncedQuery.trim()) return tours;

    const query = debouncedQuery.toLowerCase();
    return tours.filter(
      (tour) => tour.name.toLowerCase().includes(query) || tour.description.toLowerCase().includes(query)
    );
  }, [tours, debouncedQuery]);

  const handleTourToggle = React.useCallback(
    (tourId: string) => {
      const tour = tours.find((t) => t.id === tourId);
      if (!tour) return;

      const isCurrentlySelected = selectedTourIds.includes(tourId);

      // Allow deselecting any tour (active or inactive)
      // Only prevent selecting inactive tours
      if (!tour.isActive && !isCurrentlySelected) {
        return; // Don't allow selecting inactive tours
      }

      const newSelection = isCurrentlySelected
        ? selectedTourIds.filter((id) => id !== tourId)
        : [...selectedTourIds, tourId];

      onSelectionChange(newSelection);
    },
    [selectedTourIds, onSelectionChange, tours]
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={cn('h-4 w-4', index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4 flex flex-1 flex-col gap-3 relative', isUpdating && 'pointer-events-none')}>
      {/* Updating overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center pt-4">
          <div className="bg-white border rounded-lg px-3 py-2 shadow-sm flex items-center gap-2 relative">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-gray-600">Đang cập nhật...</span>
          </div>
        </div>
      )}

      {/* Header with search and counter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800">Danh sách Tour Ảo</h4>
          <Badge variant={selectedTourIds.length > 0 ? 'default' : 'secondary'} className="text-xs">
            Đã chọn: {selectedTourIds.length} / {tours.filter((tour) => tour.isActive).length}
          </Badge>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm tour ảo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tour list */}
      <ScrollArea style={{ flex: '1 0 0' }} className="flex min-h-0 overflow-auto gap-8 relative -mr-3">
        <div className="space-y-2 pr-2">
          {filteredTours.length === 0 ? (
            <div className="p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                {debouncedQuery.trim() ? 'Không tìm thấy tour nào' : 'Chưa có tour ảo nào'}
              </p>
            </div>
          ) : (
            filteredTours.map((tour) => {
              const firstSceneThumbnail = tour.metadata.scenes?.[0]?.thumbnail;
              const isInactive = !tour.isActive;

              return (
                <div
                  key={tour.id}
                  className={cn(
                    'group flex items-start gap-3 p-3 rounded-lg border transition-all',
                    isInactive && !selectedTourIds.includes(tour.id)
                      ? 'cursor-default bg-gray-50 border-gray-200 opacity-75'
                      : 'cursor-pointer hover:border-primary/30 hover:bg-primary/5',
                    selectedTourIds.includes(tour.id) ? 'border-primary bg-primary/10' : 'border-gray-200'
                  )}
                  onClick={() => {
                    // Allow clicking if tour is active OR if it's currently selected (for deselection)
                    if (tour.isActive || selectedTourIds.includes(tour.id)) {
                      handleTourToggle(tour.id);
                    }
                  }}
                >
                  {/* Show checkbox for active tours or selected inactive tours */}
                  {(tour.isActive || selectedTourIds.includes(tour.id)) && (
                    <Checkbox
                      id={`tour-${tour.id}`}
                      checked={selectedTourIds.includes(tour.id)}
                      onCheckedChange={() => handleTourToggle(tour.id)}
                      className="mt-1"
                    />
                  )}

                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {firstSceneThumbnail ? (
                      <img src={firstSceneThumbnail as string} alt={tour.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h5
                          className={cn(
                            'font-medium transition-colors line-clamp-1',
                            isInactive ? 'text-gray-500' : 'text-gray-800 group-hover:text-primary'
                          )}
                        >
                          {tour.name}
                        </h5>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(tour.rating)}
                          <span className="text-xs text-gray-500 ml-1">({tour.rating}/5)</span>
                          <Badge variant={tour.isActive ? 'outline' : 'secondary'} className="text-xs ml-2">
                            {tour.isActive ? 'Hoạt động' : 'Không hoạt động'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewTour(tour);
                        }}
                        className="text-primary hover:text-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className={cn('text-sm mt-1 line-clamp-1', isInactive ? 'text-gray-500' : 'text-gray-600')}>
                      {tour.description}
                    </p>
                    {isInactive && (
                      <p className="text-xs text-gray-500 mt-1 italic">Chỉ có thể xem trước, không thể chọn</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {tour.metadata.scenes && (
                        <Badge variant="secondary" className="text-xs">
                          {tour.metadata.scenes.length} cảnh
                        </Badge>
                      )}
                      {tour.tourContent && tour.tourContent.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {tour.tourContent.length} nội dung
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export function EventTourOnlineForm({ event, className, onUpdated }: EventTourOnlineFormProps) {
  const [previewTour, setPreviewTour] = React.useState<IVirtualTour | null>(null);
  const [selectedTourIds, setSelectedTourIds] = React.useState<string[]>(
    event.tourOnlines?.map((tour) => tour.id) || []
  );

  // Sync local state with event data when event changes
  React.useEffect(() => {
    setSelectedTourIds(event.tourOnlines?.map((tour) => tour.id) || []);
  }, [event.tourOnlines]);

  const {
    data: virtualTours,
    isLoading,
    error,
  } = useVirtualTourByMuseum({
    museumId: event.museumId,
    Page: 1,
    PageSize: 50,
  });

  // Mutations for updating event tours with rollback functionality
  const addToursMutation = useAddEventTourOnlines({
    onSuccess: () => {
      onUpdated?.();
      toast.success('Đã thêm tour vào sự kiện thành công!');
      // State will be updated through the event prop change
    },
    onError: (error, variables) => {
      toast.error('Không thể thêm tour vào sự kiện. Vui lòng thử lại!');
      console.error('Add tours error:', error);
      // Rollback: Remove the failed tour IDs from local state
      setSelectedTourIds((prev) => prev.filter((id) => !variables.tourOnlineIds.includes(id)));
    },
  });

  const removeToursMutation = useRemoveEventTourOnlines({
    onSuccess: () => {
      onUpdated?.();
      toast.success('Đã xóa tour khỏi sự kiện thành công!');
      // State will be updated through the event prop change
    },
    onError: (error, variables) => {
      toast.error('Không thể xóa tour khỏi sự kiện. Vui lòng thử lại!');
      console.error('Remove tours error:', error);
      // Rollback: Add back the failed tour IDs to local state
      setSelectedTourIds((prev) => [...prev, ...variables.tourOnlineIds]);
    },
  });

  const isUpdating =
    (addToursMutation as any).isLoading ||
    (addToursMutation as any).isPending ||
    (removeToursMutation as any).isLoading ||
    (removeToursMutation as any).isPending;

  const handlePreviewTour = React.useCallback((tour: IVirtualTour) => {
    setPreviewTour(tour);
  }, []);

  const handleClosePreview = React.useCallback(() => {
    setPreviewTour(null);
  }, []);

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">Lỗi khi tải danh sách tour ảo</div>
          <p className="text-gray-500 text-sm">Vui lòng thử lại sau hoặc liên hệ quản trị viên</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card className="flex flex-1">
        <CardContent className="flex flex-1 gap-6">
          {/* Left Panel - Tour Selection (40%) */}
          <div className="basis-1/3 flex border-r pr-6">
            <TourSelectionPanel
              tours={virtualTours?.list || []}
              selectedTourIds={selectedTourIds}
              onSelectionChange={(newTourIds: string[]) => {
                // Optimistically update local state immediately
                setSelectedTourIds(newTourIds);

                const currentTourIds = event.tourOnlines?.map((tour) => tour.id) || [];
                const toursToAdd = newTourIds.filter((id) => !currentTourIds.includes(id));
                const toursToRemove = currentTourIds.filter((id) => !newTourIds.includes(id));

                // Make API calls for actual changes
                if (toursToAdd.length > 0) {
                  addToursMutation.mutate({ eventId: event.id, tourOnlineIds: toursToAdd });
                }

                if (toursToRemove.length > 0) {
                  removeToursMutation.mutate({ eventId: event.id, tourOnlineIds: toursToRemove });
                }
              }}
              onPreviewTour={handlePreviewTour}
              isLoading={isLoading}
              isUpdating={isUpdating}
            />
          </div>

          {/* Right Panel - Live Preview (60%) */}
          <div className="flex-1 flex flex-col">
            {previewTour ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">Xem trước tour</h4>
                  <Button variant="ghost" size="sm" onClick={handleClosePreview}>
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 relative">
                  {/* 3D Viewer - Full Size */}
                  <div className="absolute inset-0 border rounded-lg overflow-hidden bg-gray-100">
                    <React.Suspense
                      fallback={
                        <div className="h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      }
                    >
                      <VirtualTourViewer virtualTour={previewTour} />
                    </React.Suspense>
                  </div>

                  {/* Info Panel Overlay - Compact Bottom */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-lg p-2 text-white w-fit">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-sm">{previewTour.name}</h5>
                        <div className="flex items-center gap-1 text-xs">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={cn(
                                  'h-2 w-2',
                                  index < previewTour.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-gray-200">{previewTour.rating}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-300">{previewTour.metadata.scenes?.length || 0} cảnh</span>
                          <Badge variant={previewTour.isActive ? 'default' : 'secondary'} className="text-xs ml-1">
                            {previewTour.isActive ? '🟢' : '🔴'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Eye className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">Chọn tour để xem trước</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
