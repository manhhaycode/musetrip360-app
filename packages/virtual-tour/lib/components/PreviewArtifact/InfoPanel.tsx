'use client';

import { ChevronLeft, ChevronRight, Calendar, MapPin, Palette, Star } from 'lucide-react';
import type { Artifact } from '@musetrip360/artifact-management';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Badge } from '@musetrip360/ui-core/badge';
import { Separator } from '@musetrip360/ui-core/separator';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';

export interface InfoPanelProps {
  artifact: Artifact;
  isOpen: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  hasMultiple?: boolean;
}

export function InfoPanel({ artifact, isOpen, onPrevious, onNext, hasMultiple }: InfoPanelProps) {
  if (!isOpen) return null;

  return (
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

          {/* Artifact info */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">{artifact.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {artifact.rating}/5
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Historical period */}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-blue-400">Thời kỳ lịch sử</h3>
                  <p className="text-muted-foreground">{artifact.historicalPeriod}</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Description */}
              <div className="space-y-2">
                <h3 className="font-semibold">Mô tả</h3>
                <p className="text-muted-foreground leading-relaxed">{artifact.description}</p>
              </div>

              {/* Metadata */}
              {artifact.metadata && (
                <>
                  <Separator className="bg-border/50" />
                  <div className="space-y-4">
                    {artifact.metadata.material && (
                      <div className="flex items-start gap-3">
                        <Palette className="w-5 h-5 mt-0.5 text-green-400 flex-shrink-0" />
                        <div className="space-y-1">
                          <h3 className="font-semibold text-green-400">Chất liệu</h3>
                          <Badge variant="outline" className="border-green-400/30 text-green-400">
                            {artifact.metadata.material}
                          </Badge>
                        </div>
                      </div>
                    )}

                    {artifact.metadata.discoveryLocation && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-0.5 text-red-400 flex-shrink-0" />
                        <div className="space-y-1">
                          <h3 className="font-semibold text-red-400">Nơi phát hiện</h3>
                          <p className="text-muted-foreground">{artifact.metadata.discoveryLocation}</p>
                        </div>
                      </div>
                    )}

                    {artifact.metadata.type && (
                      <div className="space-y-2">
                        <h3 className="font-semibold">Loại hình</h3>
                        <Badge variant="secondary">{artifact.metadata.type}</Badge>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Additional images */}
              {artifact.metadata?.images && artifact.metadata.images.length > 0 && (
                <>
                  <Separator className="bg-border/50" />
                  <div className="space-y-3">
                    <h3 className="font-semibold">Hình ảnh bổ sung</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {artifact.metadata.images.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="relative group overflow-hidden rounded-lg border border-border/50 hover:border-border cursor-pointer transition-colors"
                          onClick={() => {
                            // TODO: Open image in full screen
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt={`${artifact.name} - Ảnh ${index + 1}`}
                            className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator className="bg-border/50" />

              {/* Timestamps */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Tạo: {new Date(artifact.createdAt).toLocaleDateString('vi-VN')}</p>
                <p>Cập nhật: {new Date(artifact.updatedAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
