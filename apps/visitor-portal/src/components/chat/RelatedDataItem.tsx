'use client';

import React from 'react';
import { Package, Landmark, Archive, CalendarRange, Globe } from 'lucide-react';
import { AIChatRelatedData } from '@musetrip360/ai-bot';
import { Card } from '@musetrip360/ui-core/card';
import { useRouter } from 'next/navigation';

// Utility to normalize API response fields (handles both capitalized and camelCase)
const normalizeRelatedDataItem = (item: any): AIChatRelatedData => {
  return {
    id: item.id || item.Id,
    type: item.type || item.Type,
    title: item.title || item.Title,
    description: item.description || item.Description,
    similarityScore: item.similarityScore || item.SimilarityScore || 0,
  };
};

interface RelatedDataItemProps {
  item: AIChatRelatedData;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Museum':
      return <Landmark className="h-4 w-4" />;
    case 'Event':
      return <CalendarRange className="h-4 w-4" />;
    case 'Artifact':
      return <Archive className="h-4 w-4" />;
    case 'TourOnline':
      return <Globe className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getRedirectLink = (item: AIChatRelatedData) => {
  switch (item.type) {
    case 'Museum':
      return `/museum/${item.id}`;
    case 'Event':
      return `/event/${item.id}`;
    case 'Artifact':
      return `/artifact/${item.id}`;
    case 'TourOnline':
      return `/tour/${item.id}`;
    default:
      return '#';
  }
};

export function RelatedDataItem({ item }: RelatedDataItemProps) {
  const router = useRouter();

  // Normalize the item to handle both capitalized and camelCase properties
  const normalizedItem = normalizeRelatedDataItem(item);

  const handleClick = () => {
    const link = getRedirectLink(normalizedItem);
    if (link && link !== '#') {
      router.push(link);
    }
  };

  return (
    <Card className="p-3 hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleClick}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          {getTypeIcon(normalizedItem.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium truncate line-clamp-2">{normalizedItem.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{normalizedItem.description}</p>
          {normalizedItem.similarityScore > 0 && (
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground">
                Relevance: {(normalizedItem.similarityScore * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
