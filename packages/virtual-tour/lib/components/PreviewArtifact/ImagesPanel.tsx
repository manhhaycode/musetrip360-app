'use client';

import { ChevronLeft, ChevronRight, Image, ZoomIn } from 'lucide-react';
import type { Artifact } from '@musetrip360/artifact-management';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { useState } from 'react';

export interface ImagesPanelProps {
  artifact: Artifact;
  isOpen: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  hasMultiple?: boolean;
}

export function ImagesPanel({ artifact, isOpen, onPrevious, onNext, hasMultiple }: ImagesPanelProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const allImages = [...(artifact.imageUrl ? [artifact.imageUrl] : []), ...(artifact.metadata?.images || [])];

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="absolute top-0 right-0 h-full w-full sm:w-96 bg-background/95 backdrop-blur-md border-l z-40 transform transition-transform duration-300 ease-out">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Navigation arrows */}
            {hasMultiple && (
              <div className="flex justify-between items-center">
                <Button
                  onClick={onPrevious}
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-muted/50"
                  aria-label="Artifact trước"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={onNext}
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-muted/50"
                  aria-label="Artifact tiếp theo"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}

            {/* Images Panel */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Image className="w-6 h-6" />
                  Hình ảnh
                </CardTitle>
                <p className="text-muted-foreground">{artifact.name}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {allImages.length > 0 ? (
                  <>
                    {/* Main image */}
                    {artifact.imageUrl && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">Hình ảnh chính</h3>
                        <div
                          className="relative group overflow-hidden rounded-lg border border-border/50 hover:border-border cursor-pointer transition-colors"
                          onClick={() => handleImageClick(artifact.imageUrl!)}
                        >
                          <img
                            src={artifact.imageUrl}
                            alt={artifact.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional images */}
                    {artifact.metadata?.images && artifact.metadata.images.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold">Hình ảnh bổ sung ({artifact.metadata.images.length})</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {artifact.metadata.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative group overflow-hidden rounded-lg border border-border/50 hover:border-border cursor-pointer transition-colors"
                              onClick={() => handleImageClick(image.file as string)}
                            >
                              <img
                                src={image.file as string}
                                alt={`${artifact.name} - Ảnh ${index + 1}`}
                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Không có hình ảnh nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>

      {/* Full-screen image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Hình ảnh phóng to"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={handleCloseModal}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
              aria-label="Đóng"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
