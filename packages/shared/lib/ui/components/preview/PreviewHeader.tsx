'use client';

import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import { PreviewHeaderProps } from './PreviewModal.types';

export function PreviewHeader({ title, showBackButton = true, showCloseButton = false, onClose }: PreviewHeaderProps) {
  if (!title && !showBackButton && !showCloseButton) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-6 border-b border bg-white rounded-t-xl">
      {showBackButton && (
        <Button variant="outline" size="sm" onClick={onClose} className="flex items-center gap-2  transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      {title && <h2 className="font-semibold text-xl text-gray-800 flex-1">{title}</h2>}

      {showCloseButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-auto  transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
