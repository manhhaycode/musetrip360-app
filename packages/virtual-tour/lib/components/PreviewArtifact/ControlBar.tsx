'use client';

import { X, Info, Image } from 'lucide-react';
import { Button } from '@musetrip360/ui-core/button';
import { cn } from '@musetrip360/ui-core/utils';

export interface ControlBarProps {
  onClose: () => void;
  onToggleInfo: () => void;
  onToggleImages: () => void;
  showInfo: boolean;
  showImages: boolean;
}

export function ControlBar({ onClose, onToggleInfo, onToggleImages, showInfo, showImages }: ControlBarProps) {
  return (
    <>
      {/* Close button - Top left */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-50 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 hover:text-white transition-all duration-200 group p-2 h-auto w-auto"
        aria-label="Đóng"
      >
        <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </Button>

      {/* Action buttons - Top right */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button
          onClick={onToggleInfo}
          variant="ghost"
          size="sm"
          className={cn(
            'backdrop-blur-sm text-white text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-white',
            showInfo ? 'bg-primary/90 shadow-lg shadow-primary/25 hover:bg-primary/80' : 'bg-black/20 hover:bg-black/40'
          )}
          leftIcon={<Info className="w-4 h-4" />}
        >
          Thông tin
        </Button>

        <Button
          onClick={onToggleImages}
          variant="ghost"
          size="sm"
          className={cn(
            'backdrop-blur-sm text-white text-sm font-medium transition-all duration-200 hover:scale-105 hover:text-white',
            showImages
              ? 'bg-primary/90 shadow-lg shadow-primary/25 hover:bg-primary/80'
              : 'bg-black/20 hover:bg-black/40'
          )}
          leftIcon={<Image className="w-4 h-4" />}
        >
          Hình ảnh
        </Button>
      </div>
    </>
  );
}
