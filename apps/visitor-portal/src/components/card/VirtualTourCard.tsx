import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { cn } from '@musetrip360/ui-core/utils';
import { IVirtualTour } from '@musetrip360/virtual-tour';
import {
  Brain,
  Calendar,
  Clock,
  Eye,
  Headphones,
  Image as ImageIcon,
  Layers3,
  MapPin,
  Play,
  Star,
  Users,
  Volume2,
  Zap,
} from 'lucide-react';
import Image from 'next/image';

// Utility functions
export const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'short',
  });
};

// Virtual Tour Card Component
export const VirtualTourCard = ({ tour, onClick }: { tour: IVirtualTour; onClick: () => void }) => {
  const sceneCount = tour.metadata?.scenes?.length || 0;
  const hasMainScenes = tour.metadata?.scenes?.filter((scene) => !scene.parentId).length || 0;
  const hasSubScenes = sceneCount - hasMainScenes;

  // Calculate enhanced stats
  const audioScenes = tour.metadata?.scenes?.filter((scene) => scene.audio || scene.voiceAI).length || 0;
  const aiVoiceScenes = tour.metadata?.scenes?.filter((scene) => scene.isUseVoiceAI && scene.voiceAI).length || 0;
  const richContentScenes = tour.metadata?.scenes?.filter((scene) => scene.richDescription).length || 0;
  const mediaThumbnails = tour.metadata?.scenes?.filter((scene) => scene.thumbnail).slice(0, 3) || [];
  const interactiveScenes = tour.metadata?.scenes?.filter((scene) => scene.data).length || 0;
  const totalContentItems = tour.tourContent?.length || 0;

  // Estimated duration (rough calculation: 2-3 min per main scene + 1 min per sub scene + content time)
  const baseTime = hasMainScenes * 2.5 + hasSubScenes * 1;
  const contentTime = totalContentItems * 0.5; // 30 seconds per content item
  const estimatedDuration = baseTime + contentTime;

  // Tour features
  const hasAudioGuide = audioScenes > 0;
  const hasAIGuide = aiVoiceScenes > 0;
  const hasRichContent = richContentScenes > 0;
  const hasInteractiveContent = interactiveScenes > 0;

  // Get tour complexity level
  const getComplexityLevel = () => {
    const complexity = hasMainScenes + hasSubScenes + (hasAIGuide ? 2 : 0) + (hasRichContent ? 1 : 0);
    if (complexity >= 8) return { level: 'Nâng cao', color: 'bg-red-100 text-red-700' };
    if (complexity >= 5) return { level: 'Trung bình', color: 'bg-yellow-100 text-yellow-700' };
    return { level: 'Cơ bản', color: 'bg-green-100 text-green-700' };
  };

  const complexity = getComplexityLevel();

  // Calculate last activity
  const getLastActivity = () => {
    const date = tour.updatedAt || tour.createdAt;
    if (!date) return null;
    const diffDays = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return formatDateShort(date);
  };

  return (
    <Card
      className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white border border-gray-100 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative flex flex-1 flex-col">
        {/* Tour Thumbnail/Preview */}
        <div className="relative w-full h-48 bg-gradient-to-br from-muted/50 to-muted">
          {tour.metadata?.images?.[0] ? (
            <Image
              src={typeof tour.metadata.images[0].file === 'string' ? tour.metadata.images[0].file : ''}
              alt={tour.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-accent/20">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-primary">Tour ảo 360°</p>
              </div>
            </div>
          )}

          {/* Feature Badges */}
          <div className="absolute top-3 left-3">
            <div className="flex flex-col gap-1">
              {tour.rating > 0 && (
                <Badge className="bg-accent/20 text-accent-foreground border-accent/40 text-xs">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {tour.rating.toFixed(1)}
                </Badge>
              )}
              {hasAIGuide && (
                <Badge className="bg-primary/20 text-primary border-primary/40 text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Guide
                </Badge>
              )}
              <Badge className={cn('text-xs', complexity.color)}>{complexity.level}</Badge>
            </div>
          </div>

          {/* Content Type Indicators */}
          <div className="absolute top-3 right-3">
            <div className="flex gap-1">
              {hasAudioGuide && (
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <Volume2 className="h-3 w-3 text-primary" />
                </div>
              )}
              {hasRichContent && (
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
                  <Layers3 className="h-3 w-3 text-accent-foreground" />
                </div>
              )}
              {hasInteractiveContent && (
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
              )}
              {mediaThumbnails.length > 0 && (
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                  <ImageIcon className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110">
              <Play className="h-6 w-6 text-primary ml-1" />
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {tour.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {tour.description || 'Khám phá không gian 360° với công nghệ thực tế ảo hiện đại'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex-1">
          <div className="space-y-4 h-full flex flex-col flex-1 justify-between">
            {/* Tour Statistics */}
            <div className="space-y-3">
              {/* Primary Stats Row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{hasMainScenes} không gian</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>~{Math.round(estimatedDuration)} phút</span>
                  </div>
                  {tour.price > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-primary font-semibold">{tour.price.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                  )}
                  {totalContentItems > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{totalContentItems} nội dung</span>
                    </div>
                  )}
                </div>
                {getLastActivity() && (
                  <div className="flex items-center gap-1 text-muted-foreground/80">
                    <Calendar className="h-3 w-3" />
                    <span>{getLastActivity()}</span>
                  </div>
                )}
              </div>

              {/* Feature Indicators Row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {hasAudioGuide && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full text-primary">
                      <Headphones className="h-3 w-3" />
                      <span>{audioScenes} âm thanh</span>
                    </div>
                  )}
                  {hasInteractiveContent && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 rounded-full text-accent-foreground">
                      <Zap className="h-3 w-3" />
                      <span>{interactiveScenes} tương tác</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>Xem: {Math.floor(Math.random() * 1000) + 100}</span>
                </div>
              </div>
            </div>

            {/* Scene Names as Badges */}
            {tour.metadata?.scenes && tour.metadata.scenes.filter((scene) => !scene.parentId).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-foreground/80">Không gian chính:</h4>
                <div className="flex flex-wrap gap-1">
                  {tour.metadata.scenes
                    .filter((scene) => !scene.parentId)
                    .slice(0, 6)
                    .map((scene, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {scene.sceneName}
                      </Badge>
                    ))}
                  {tour.metadata.scenes.filter((scene) => !scene.parentId).length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{tour.metadata.scenes.filter((scene) => !scene.parentId).length - 6} khác
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Special Features */}
            {(hasAIGuide || hasAudioGuide || hasInteractiveContent) && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-foreground/80">Tính năng đặc biệt:</h4>
                <div className="flex flex-wrap gap-1">
                  {hasAIGuide && (
                    <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Hướng dẫn ({aiVoiceScenes})
                    </Badge>
                  )}
                  {hasAudioGuide && (
                    <Badge className="text-xs bg-accent/10 text-accent-foreground border-accent/20">
                      <Volume2 className="h-3 w-3 mr-1" />
                      Âm thanh ({audioScenes})
                    </Badge>
                  )}
                  {hasInteractiveContent && (
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Tương tác ({interactiveScenes})
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Tour Dates */}
            {(tour.createdAt || tour.updatedAt) && (
              <div className="flex items-center justify-between text-xs text-muted-foreground/80 pt-2 border-t border-border">
                {tour.createdAt && <span>Tạo: {formatDateShort(tour.createdAt)}</span>}
                {tour.updatedAt && tour.updatedAt !== tour.createdAt && (
                  <span>Cập nhật: {formatDateShort(tour.updatedAt)}</span>
                )}
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Bắt đầu tour ảo
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
