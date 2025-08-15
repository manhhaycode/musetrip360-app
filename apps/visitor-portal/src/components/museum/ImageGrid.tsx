import { cn } from '@musetrip360/ui-core/utils';
import { useState } from 'react';

interface ImageGridProps {
  images: string[];
  className?: string;
}

export function ImageGrid({ images, className }: ImageGridProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={cn('grid gap-2', className)}>
      {images.length === 1 && (
        <div className="col-span-full">
          <div className="w-full pt-[56.25%] relative rounded-lg overflow-hidden">
            <img src={images[0]} alt="Museum" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      )}

      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <div key={index} className="w-full pt-[56.25%] relative rounded-lg overflow-hidden">
              <img src={image} alt={`Museum ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {images.length === 3 && (
        <div className="grid grid-cols-2 gap-2">
          <div className="w-full pt-[56.25%] relative rounded-lg overflow-hidden">
            <img src={images[0]} alt="Museum 1" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="grid grid-rows-2 gap-2">
            {images.slice(1).map((image, index) => (
              <div key={index + 1} className="w-full pt-[56.25%] relative rounded-lg overflow-hidden">
                <img src={image} alt={`Museum ${index + 2}`} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length >= 4 && (
        <div className="grid grid-cols-2 gap-2">
          <div className="w-full pt-[56.25%] relative rounded-lg overflow-hidden">
            <img src={images[0]} alt="Museum 1" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="w-full pt-[56.25%] relative rounded-lg overflow-hidden">
              <img src={images[1]} alt="Museum 2" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="w-full pt-[56.25%] relative rounded-lg overflow-hidden">
                <img src={images[2]} alt="Museum 3" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="w-full pt-[56.25%] relative rounded-lg overflow-hidden group cursor-pointer">
                <img src={images[3]} alt="Museum 4" className="absolute inset-0 w-full h-full object-cover" />
                {images.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-lg">
                    +{images.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
