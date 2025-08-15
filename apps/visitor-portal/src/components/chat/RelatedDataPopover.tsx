'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { AIChatRelatedData } from '@musetrip360/ai-bot';
import { Button } from '@musetrip360/ui-core/button';
import { Popover, PopoverContent, PopoverTrigger } from '@musetrip360/ui-core/popover';
import { RelatedDataItem } from './RelatedDataItem';

interface RelatedDataPopoverProps {
  relatedData: AIChatRelatedData[];
}

export function RelatedDataPopover({ relatedData }: RelatedDataPopoverProps) {
  if (!relatedData || relatedData.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted/50 ml-2">
          <Info className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">Thông tin liên quan</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <div className="p-3 space-y-2">
            {relatedData.map((item, index) => (
              <RelatedDataItem key={`${item.id}-${index}`} item={item} />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
