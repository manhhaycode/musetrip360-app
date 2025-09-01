'use client';

import React from 'react';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader } from '@musetrip360/ui-core/card';
import { ArrowRight, Search } from 'lucide-react';
import { MuseumCard, ArtifactCard } from './cards';
import { useMuseums } from '@musetrip360/museum-management/api';
import { useSearchEvents } from '@musetrip360/event-management/api';
import { useArtifacts } from '@musetrip360/artifact-management/api';
import { useVirtualTours } from '@musetrip360/virtual-tour/api';
import type { Museum } from '@musetrip360/museum-management/types';
import { EventStatusEnum, type Event } from '@musetrip360/event-management/types';
import type { Artifact } from '@musetrip360/artifact-management/types';
import type { IVirtualTour } from '@musetrip360/virtual-tour/api';
import { EventCard } from '../event/EventCard';
import { VirtualTourCard } from '../card/VirtualTourCard';
import { useRouter } from 'next/navigation';

interface SearchResultsProps {
  searchQuery?: string;
  selectedType: 'All' | 'Museum' | 'Artifact' | 'Event' | 'TourOnline';
  page?: number;
  pageSize?: number;
  isLoading?: boolean;
  error?: string | null;
  onDataLoaded?: (data: { totalItems: number; currentPageItems: number; hasResults: boolean }) => void;
}

export function SearchResults({
  searchQuery = '',
  selectedType = 'All',
  page = 1,
  pageSize = 12,
  isLoading = false,
  error,
  onDataLoaded,
}: SearchResultsProps) {
  // API calls based on selected type
  const museumParams = {
    Page: page,
    PageSize: pageSize,
    Search: searchQuery,
    IsActive: true,
  };

  const eventParams = {
    Page: page,
    PageSize: pageSize,
    Search: searchQuery,
    Status: EventStatusEnum.Published,
  };

  const artifactParams = {
    Page: page,
    PageSize: pageSize,
    Search: searchQuery,
    IsActive: true,
  };

  const virtualTourParams = {
    Page: page,
    PageSize: pageSize,
    Search: searchQuery,
  };

  const router = useRouter();

  // Conditionally fetch data based on selected type
  const {
    data: museumData,
    isLoading: museumsLoading,
    error: museumsError,
  } = useMuseums(museumParams, {
    enabled: selectedType === 'All' || selectedType === 'Museum',
  });

  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = useSearchEvents(eventParams, {
    enabled: selectedType === 'All' || selectedType === 'Event',
  });

  const {
    data: artifactsData,
    isLoading: artifactsLoading,
    error: artifactsError,
  } = useArtifacts(artifactParams, {
    enabled: selectedType === 'All' || selectedType === 'Artifact',
  });

  const {
    data: virtualToursData,
    isLoading: virtualToursLoading,
    error: virtualToursError,
  } = useVirtualTours(virtualTourParams, {
    enabled: selectedType === 'All' || selectedType === 'TourOnline',
  });

  const handleShare = (itemId: string) => {
    // TODO: Implement share functionality
    console.log('Share item:', itemId);
  };

  const handleTourClick = (tour: IVirtualTour) => {
    // Navigate to virtual tour detail page
    router.push(`/virtual-tour/${tour.id}`);
  };

  // Determine loading state
  const isCurrentlyLoading =
    isLoading ||
    (selectedType === 'All' && (museumsLoading || eventsLoading || artifactsLoading || virtualToursLoading)) ||
    (selectedType === 'Museum' && museumsLoading) ||
    (selectedType === 'Event' && eventsLoading) ||
    (selectedType === 'Artifact' && artifactsLoading) ||
    (selectedType === 'TourOnline' && virtualToursLoading);

  // Determine error state
  const currentError =
    error ||
    (selectedType === 'Museum' && museumsError?.message) ||
    (selectedType === 'Event' && eventsError?.message) ||
    (selectedType === 'Artifact' && artifactsError?.message) ||
    (selectedType === 'TourOnline' && virtualToursError?.message);

  // Combine results based on selected type
  const getFilteredResults = () => {
    const results: {
      museums: Museum[];
      events: Event[];
      artifacts: Artifact[];
      virtualTours: IVirtualTour[];
    } = {
      museums: [],
      events: [],
      artifacts: [],
      virtualTours: [],
    };

    if (selectedType === 'All' || selectedType === 'Museum') {
      const museumList = museumData?.data;
      if (Array.isArray(museumList)) {
        results.museums = museumList;
      } else if (museumList && 'list' in museumList) {
        results.museums = museumList.list || [];
      } else {
        results.museums = [];
      }
    }
    if (selectedType === 'All' || selectedType === 'Event') {
      // Events API returns PaginatedResponse directly, check for both list and data properties
      const eventList = eventsData?.data || eventsData?.list;
      results.events = Array.isArray(eventList) ? eventList : [];
    }
    if (selectedType === 'All' || selectedType === 'Artifact') {
      const artifactList = artifactsData?.data;
      if (Array.isArray(artifactList)) {
        results.artifacts = artifactList;
      } else if (artifactList && 'list' in artifactList) {
        results.artifacts = artifactList.list || [];
      } else {
        results.artifacts = [];
      }
    }
    if (selectedType === 'All' || selectedType === 'TourOnline') {
      // Virtual tours API returns data directly, check for both list and data properties
      const virtualTourList = virtualToursData?.data || virtualToursData?.list;
      results.virtualTours = Array.isArray(virtualTourList) ? virtualTourList : [];
    }

    return results;
  };

  const results = getFilteredResults();
  const hasResults =
    results.museums.length > 0 ||
    results.events.length > 0 ||
    results.artifacts.length > 0 ||
    results.virtualTours.length > 0;

  // Calculate total items and notify parent component
  const getTotalItems = () => {
    let total = 0;
    if (selectedType === 'All') {
      total += museumData?.data?.total || 0;
      total += eventsData?.total || 0; // Events API returns PaginatedResponse directly
      total += artifactsData?.data?.total || 0;
      total += virtualToursData?.total || virtualToursData?.total || 0;
    } else if (selectedType === 'Museum') {
      total = museumData?.data?.total || 0;
    } else if (selectedType === 'Event') {
      total = eventsData?.total || 0; // Events API returns PaginatedResponse directly
    } else if (selectedType === 'Artifact') {
      total = artifactsData?.data?.total || 0;
    } else if (selectedType === 'TourOnline') {
      total = virtualToursData?.total || 0;
    }
    return total;
  };

  const totalItems = getTotalItems();
  const currentPageItems =
    results.museums.length + results.events.length + results.artifacts.length + results.virtualTours.length;

  // Notify parent component about data changes
  React.useEffect(() => {
    if (!isCurrentlyLoading && onDataLoaded) {
      onDataLoaded({
        totalItems,
        currentPageItems,
        hasResults,
      });
    }
  }, [totalItems, currentPageItems, hasResults, isCurrentlyLoading]);

  // Loading state
  if (isCurrentlyLoading) {
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
  if (currentError) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ArrowRight className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
          <p className="text-muted-foreground mb-4">{currentError}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h3>
          <p className="text-muted-foreground mb-4">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy nội dung bạn cần.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Gợi ý:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Kiểm tra chính tả từ khóa</li>
              <li>• Sử dụng từ khóa ngắn gọn hơn</li>
              <li>• Thử các từ khóa liên quan khác</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Results grid
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Render Museums */}
        {results.museums.map((museum) => (
          <MuseumCard key={`museum-${museum.id}`} museum={museum} onShare={handleShare} showActions={true} />
        ))}

        {/* Render Events */}
        {results.events.map((event) => (
          <EventCard key={`event-${event.id}`} event={event} className="flex-1" />
        ))}

        {/* Render Artifacts */}
        {results.artifacts.map((artifact) => (
          <ArtifactCard key={`artifact-${artifact.id}`} artifact={artifact} onShare={handleShare} showActions={true} />
        ))}

        {/* Render Virtual Tours */}
        {results.virtualTours.map((virtualTour) => (
          <VirtualTourCard
            key={`tour-${virtualTour.id}`}
            tour={virtualTour}
            onClick={() => handleTourClick(virtualTour)}
          />
        ))}
      </div>
    </div>
  );
}
