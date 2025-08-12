'use client';

import React from 'react';
import { Package, Landmark, Archive, CalendarRange, Globe } from 'lucide-react';
import { AIChatRelatedData } from '@musetrip360/ai-bot';
import { Card } from '@musetrip360/ui-core/card';
import { useRouter } from 'next/navigation';

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
      return `/museums/${item.id}`;
    case 'Event':
      return `/events/${item.id}`;
    case 'Artifact':
      return `/artifacts/${item.id}`;
    case 'TourOnline':
      return `/tours/${item.id}`;
    default:
      return '#';
  }
};

export function RelatedDataItem({ item }: RelatedDataItemProps) {
  const router = useRouter();
  const handleClick = () => {
    const link = getRedirectLink(item);
    if (link) {
      router.push(link);
    }
  };

  return (
    <Card className="p-3 hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleClick}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          {getTypeIcon(item.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium truncate line-clamp-2">{item.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
        </div>
      </div>
    </Card>
  );
}
