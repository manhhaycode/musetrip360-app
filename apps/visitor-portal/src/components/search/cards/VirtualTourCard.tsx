'use client';

import { Card, CardContent, CardHeader } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Star, Heart, Share2, Play, DollarSign, Eye, Globe, Images } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { IVirtualTour } from '@musetrip360/virtual-tour/api';
import React from 'react';

interface VirtualTourCardProps {
  virtualTour: IVirtualTour;
  onFavorite?: (tourId: string) => void;
  onShare?: (tourId: string) => void;
  showActions?: boolean;
}

export function VirtualTourCard({ virtualTour, onFavorite, onShare, showActions = true }: VirtualTourCardProps) {
  const router = useRouter();

  const handleCardClick = (event: React.MouseEvent) => {
    // Only navigate if the click is not on an interactive element
    const target = event.target as HTMLElement;
    if (!target.closest('button')) {
      router.push(`/virtual-tour/${virtualTour.id}`);
    }
  };

  const handleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    onFavorite?.(virtualTour.id);
  };

  const handleShare = (event: React.MouseEvent) => {
    event.stopPropagation();
    onShare?.(virtualTour.id);
  };

  const handlePreview = (event: React.MouseEvent) => {
    event.stopPropagation();
    // TODO: Open preview modal or navigate to preview
    router.push(`/virtual-tour/${virtualTour.id}/preview`);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? <Badge variant="default">Hoạt động</Badge> : <Badge variant="secondary">Tạm dừng</Badge>;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getThumbnailImage = () => {
    // Try to get thumbnail from metadata images or scenes
    if (virtualTour.metadata?.images && virtualTour.metadata.images.length > 0) {
      return virtualTour.metadata.images[0]?.file as string;
    }

    if (virtualTour.metadata?.scenes && virtualTour.metadata.scenes.length > 0) {
      const firstScene = virtualTour.metadata.scenes[0];
      if (!firstScene) return '';
      if (typeof firstScene.thumbnail === 'string') {
        return firstScene.thumbnail;
      }
    }

    return '/placeholder-virtual-tour.jpg';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleCardClick}>
      {/* Virtual Tour Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <Image
          src={getThumbnailImage()}
          alt={virtualTour.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">{getStatusBadge(virtualTour.isActive)}</div>

        {/* Virtual Tour Icon */}
        <div className="absolute top-3 left-3 mt-10">
          <Badge variant="secondary" className="bg-white/90 text-blue-700">
            <Globe className="h-3 w-3 mr-1" />
            Tour ảo
          </Badge>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="bg-white/90 hover:bg-white rounded-full p-3 transition-colors">
            <Play className="h-6 w-6 text-primary fill-primary ml-1" />
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleFavorite}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {virtualTour.name}
            </h3>
            {virtualTour.rating > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{virtualTour.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{virtualTour.description}</p>

        {/* Tour Details */}
        <div className="space-y-3">
          {/* Price */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-green-600">{formatPrice(virtualTour.price)}</span>
          </div>

          {/* Scenes Count */}
          {virtualTour.metadata?.scenes && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>{virtualTour.metadata.scenes.length} cảnh</span>
            </div>
          )}

          {/* Tour Contents */}
          {virtualTour.tourContent && virtualTour.tourContent.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Nội dung tour:</div>
              <div className="flex flex-wrap gap-1">
                {virtualTour.tourContent.slice(0, 3).map((content, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {content}
                  </Badge>
                ))}
                {virtualTour.tourContent.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{virtualTour.tourContent.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Additional Images Count */}
          {virtualTour.metadata?.images && virtualTour.metadata.images.length > 1 && (
            <div>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Images className="h-3 w-3" />
                {virtualTour.metadata.images.length} hình ảnh
              </Badge>
            </div>
          )}
        </div>

        {/* Created/Updated Date */}
        {virtualTour.updatedAt && (
          <div className="mt-4 text-xs text-muted-foreground">
            Cập nhật:{' '}
            {new Intl.DateTimeFormat('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(new Date(virtualTour.updatedAt))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
