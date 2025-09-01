'use client';

import { Card, CardContent, CardHeader } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { MapPin, Star, Heart, Share2, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Museum } from '@musetrip360/museum-management/types';
import React from 'react';

interface MuseumCardProps {
  museum: Museum;
  onFavorite?: (museumId: string) => void;
  onShare?: (museumId: string) => void;
  showActions?: boolean;
}

export function MuseumCard({ museum, onFavorite, onShare, showActions = true }: MuseumCardProps) {
  const router = useRouter();

  const handleCardClick = (event: React.MouseEvent) => {
    // Only navigate if the click is not on an interactive element
    const target = event.target as HTMLElement;
    if (!target.closest('button')) {
      router.push(`/museum/${museum.id}`);
    }
  };

  const handleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    onFavorite?.(museum.id);
  };

  const handleShare = (event: React.MouseEvent) => {
    event.stopPropagation();
    onShare?.(museum.id);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: { variant: 'default' as const, label: 'Hoạt động' },
      Inactive: { variant: 'secondary' as const, label: 'Tạm dừng' },
      Pending: { variant: 'outline' as const, label: 'Chờ duyệt' },
      Archived: { variant: 'destructive' as const, label: 'Lưu trữ' },
      NotVerified: { variant: 'outline' as const, label: 'Chưa xác thực' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleCardClick}>
      {/* Museum Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <Image
          src={museum.metadata?.images?.[0] || museum.metadata?.logoUrl || '/placeholder-museum.jpg'}
          alt={museum.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">{getStatusBadge(museum.status)}</div>

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
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {museum.name}
            </h3>
            {museum.rating > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{museum.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{museum.location}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{museum.description}</p>

        {/* Categories */}
        {museum.categories && museum.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {museum.categories.slice(0, 3).map((category) => (
              <Badge key={category.id} variant="outline" className="text-xs">
                {category.name}
              </Badge>
            ))}
            {museum.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{museum.categories.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Contact Info */}
        {(museum.contactEmail || museum.contactPhone) && (
          <div className="text-xs text-muted-foreground space-y-1">
            {museum.contactEmail && (
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {museum.contactEmail}
              </div>
            )}
            {museum.contactPhone && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {museum.contactPhone}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
