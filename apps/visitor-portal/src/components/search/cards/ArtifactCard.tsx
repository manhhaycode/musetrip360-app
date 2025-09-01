'use client';

import { Card, CardContent, CardHeader } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Star, Heart, Share2, Volume2, BoxesIcon, Eye, Images, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Artifact } from '@musetrip360/artifact-management/types';
import React from 'react';

interface ArtifactCardProps {
  artifact: Artifact;
  onFavorite?: (artifactId: string) => void;
  onShare?: (artifactId: string) => void;
  showActions?: boolean;
}

export function ArtifactCard({ artifact, onFavorite, onShare, showActions = true }: ArtifactCardProps) {
  const router = useRouter();

  const handleCardClick = (event: React.MouseEvent) => {
    // Only navigate if the click is not on an interactive element
    const target = event.target as HTMLElement;
    if (!target.closest('button')) {
      router.push(`/artifact/${artifact.id}`);
    }
  };

  const handleFavorite = (event: React.MouseEvent) => {
    event.stopPropagation();
    onFavorite?.(artifact.id);
  };

  const handleShare = (event: React.MouseEvent) => {
    event.stopPropagation();
    onShare?.(artifact.id);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? <Badge variant="default">Hoạt động</Badge> : <Badge variant="secondary">Tạm dừng</Badge>;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={handleCardClick}>
      {/* Artifact Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        <Image
          src={artifact.imageUrl || '/placeholder-artifact.jpg'}
          alt={artifact.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">{getStatusBadge(artifact.isActive)}</div>

        {/* Features Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {artifact.model3DUrl && (
            <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <BoxesIcon className="h-3 w-3" />
              3D
            </div>
          )}
          {artifact.metadata?.isUseVoiceAI && (
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              AI
            </div>
          )}
          {artifact.metadata?.audio && (
            <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              Audio
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            {artifact.model3DUrl && (
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Open 3D viewer
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {artifact.name}
            </h3>
            {artifact.rating > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{artifact.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Historical Period */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {artifact.historicalPeriod}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{artifact.description}</p>

        {/* Metadata Information */}
        <div className="space-y-2 text-xs text-muted-foreground">
          {artifact.metadata?.type && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Loại:</span>
              <span>{artifact.metadata.type}</span>
            </div>
          )}

          {artifact.metadata?.material && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Chất liệu:</span>
              <span>{artifact.metadata.material}</span>
            </div>
          )}

          {artifact.metadata?.discoveryLocation && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Nơi phát hiện:</span>
              <span className="line-clamp-1">{artifact.metadata.discoveryLocation}</span>
            </div>
          )}
        </div>

        {/* Additional Images Count */}
        {artifact.metadata?.images && artifact.metadata.images.length > 0 && (
          <div className="mt-3">
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Images className="h-3 w-3" />
              {artifact.metadata.images.length} hình ảnh khác
            </Badge>
          </div>
        )}

        {/* Created Date */}
        {artifact.createdAt && (
          <div className="mt-3 text-xs text-muted-foreground">
            Cập nhật:{' '}
            {new Intl.DateTimeFormat('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            }).format(new Date(artifact.updatedAt))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
