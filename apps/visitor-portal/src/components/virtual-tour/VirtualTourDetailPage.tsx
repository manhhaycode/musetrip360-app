'use client';

import { useCheckOrderExisted } from '@musetrip360/payment-management/api';
import { Alert, AlertDescription } from '@musetrip360/ui-core/alert';
import { Badge } from '@musetrip360/ui-core/badge';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@musetrip360/ui-core/card';
import { Separator } from '@musetrip360/ui-core/separator';
import { Skeleton } from '@musetrip360/ui-core/skeleton';
import { cn } from '@musetrip360/ui-core/utils';
import { IVirtualTourScene, useVirtualTourById } from '@musetrip360/virtual-tour';
import {
  AlertCircle,
  ArrowLeft,
  Brain,
  Calendar,
  Clock,
  Eye,
  Headphones,
  Image as ImageIcon,
  MapPin,
  Play,
  Share,
  Star,
  Volume2,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface VirtualTourDetailPageProps {
  tourId: string;
  className?: string;
}

// Scene Card Component
const SceneCard = ({
  scene,
  isMainScene = true,
  onSceneClick,
}: {
  scene: IVirtualTourScene;
  isMainScene?: boolean;
  onSceneClick: (scene: IVirtualTourScene) => void;
}) => {
  const hasAudio = scene.audio || scene.voiceAI;
  const hasAIVoice = scene.isUseVoiceAI && scene.voiceAI;
  const hasRichContent = scene.richDescription;
  const hasInteractive = scene.data;

  return (
    <Card
      className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer bg-card border border-border overflow-hidden"
      onClick={() => onSceneClick(scene)}
    >
      <div className="relative flex flex-1 flex-col">
        {/* Scene Thumbnail */}
        <div className="relative w-full h-40 bg-gradient-to-br from-muted/50 to-muted">
          {scene.thumbnail ? (
            <Image
              src={typeof scene.thumbnail === 'string' ? scene.thumbnail : ''}
              alt={scene.sceneName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-accent/20">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <p className="text-xs font-medium text-primary">Không gian 360°</p>
              </div>
            </div>
          )}

          {/* Feature Indicators */}
          <div className="absolute top-2 right-2">
            <div className="flex gap-1">
              {hasAIVoice && (
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                  <Brain className="h-3 w-3 text-primary" />
                </div>
              )}
              {hasAudio && (
                <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center">
                  <Volume2 className="h-3 w-3 text-accent-foreground" />
                </div>
              )}
              {hasInteractive && (
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
              )}
            </div>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="h-5 w-5 text-primary ml-0.5" />
            </div>
          </div>

          {/* Scene Type Badge */}
          <div className="absolute top-2 left-2">
            <Badge
              className={cn(
                'text-xs',
                isMainScene
                  ? 'bg-primary/20 text-primary border-primary/40'
                  : 'bg-secondary/20 text-secondary-foreground border-secondary/40'
              )}
            >
              <MapPin className="h-3 w-3 mr-1" />
              {isMainScene ? 'Chính' : 'Phụ'}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {scene.sceneName}
          </CardTitle>
          {scene.sceneDescription && (
            <CardDescription className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {scene.sceneDescription}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0 flex-1 flex flex-col justify-between">
          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-3">
            {hasRichContent && (
              <Badge variant="outline" className="text-xs">
                <ImageIcon className="h-3 w-3 mr-1" />
                Nội dung phong phú
              </Badge>
            )}
            {hasAudio && (
              <Badge variant="outline" className="text-xs">
                <Headphones className="h-3 w-3 mr-1" />
                Âm thanh
              </Badge>
            )}
            {hasInteractive && (
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Tương tác
              </Badge>
            )}
          </div>

          {/* Action Button */}
          <Button
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onSceneClick(scene);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Khám phá không gian
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDuration = (scenes: IVirtualTourScene[]) => {
  const mainScenes = scenes.filter((scene) => !scene.parentId).length;
  const subScenes = scenes.filter((scene) => scene.parentId).length;
  return Math.round(mainScenes * 2.5 + subScenes * 1.5); // Estimated minutes
};

export function VirtualTourDetailPage({ tourId, className }: VirtualTourDetailPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'scenes' | 'content'>('scenes');

  const { data: tour, isLoading, error } = useVirtualTourById(tourId);
  const { data: isOrderExisted } = useCheckOrderExisted(tourId);

  const handleStartTour = () => {
    // Navigate to virtual tour viewer page
    router.push(`/virtual-tour/${tourId}/viewer`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tour?.name,
          text: tour?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('container mx-auto px-4 py-8 max-w-6xl', className)}>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-24 bg-muted/30" />
            <Skeleton className="h-10 w-3/4 bg-muted/30" />
            <Skeleton className="h-6 w-full bg-muted/30" />
            <Skeleton className="h-6 w-2/3 bg-muted/30" />
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full bg-muted/30" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-48 bg-muted/30" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full bg-muted/30" />
              <Skeleton className="h-24 w-full bg-muted/30" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className={cn('container mx-auto px-4 py-8 max-w-6xl', className)}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Không thể tải thông tin tour ảo. Vui lòng thử lại sau.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const mainScenes = tour.metadata?.scenes?.filter((scene) => !scene.parentId) || [];
  const subScenes = tour.metadata?.scenes?.filter((scene) => scene.parentId) || [];
  const estimatedDuration = formatDuration(tour.metadata?.scenes || []);
  const totalScenes = tour.metadata?.scenes?.length || 0;

  return (
    <div className={cn('container mx-auto px-4 py-8 max-w-6xl', className)}>
      <div className="space-y-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Chia sẻ
          </Button>
        </div>

        {/* Tour Header */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Image */}
              <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                {tour.metadata?.images?.[0]?.file ? (
                  <Image
                    src={typeof tour.metadata.images[0].file === 'string' ? tour.metadata.images[0].file : ''}
                    alt={tour.name}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-accent/20">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                        <Eye className="h-10 w-10 text-primary" />
                      </div>
                      <p className="text-lg font-medium text-primary">Tour ảo 360°</p>
                    </div>
                  </div>
                )}

                {/* Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold mb-2">{tour.name}</h1>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{totalScenes} không gian</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>~{estimatedDuration} phút</span>
                          </div>
                          {tour.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-current text-yellow-400" />
                              <span>{tour.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {tour.price > 0 ? (
                          <div className="text-2xl font-bold text-accent">{tour.price.toLocaleString('vi-VN')} VNĐ</div>
                        ) : (
                          <div className="text-xl font-bold text-green-400">Miễn phí</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold text-foreground mb-3">Giới thiệu</h2>
                {tour.metadata?.richDescription ? (
                  <div
                    className="text-muted-foreground rich-content"
                    dangerouslySetInnerHTML={{ __html: tour.metadata.richDescription }}
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {tour.description || 'Khám phá không gian 360° với công nghệ thực tế ảo hiện đại'}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Thông tin tour</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Không gian chính</div>
                      <div className="font-semibold text-foreground">{mainScenes.length}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Khu vực phụ</div>
                      <div className="font-semibold text-foreground">{subScenes.length}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Thời lượng ước tính</div>
                      <div className="font-semibold text-foreground">~{estimatedDuration} phút</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Đánh giá</div>
                      <div className="font-semibold text-foreground">
                        {tour.rating > 0 ? `${tour.rating.toFixed(1)}/5` : 'Chưa có'}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Tính năng</h4>
                    <div className="flex flex-wrap gap-2">
                      {tour.metadata?.scenes?.some((scene) => scene.isUseVoiceAI && scene.voiceAI) && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Brain className="h-3 w-3 mr-1" />
                          AI Hướng dẫn
                        </Badge>
                      )}
                      {tour.metadata?.scenes?.some((scene) => scene.audio || scene.voiceAI) && (
                        <Badge className="bg-accent/10 text-accent-foreground border-accent/20">
                          <Volume2 className="h-3 w-3 mr-1" />
                          Âm thanh
                        </Badge>
                      )}
                      {tour.metadata?.scenes?.some((scene) => scene.data) && (
                        <Badge variant="secondary">
                          <Zap className="h-3 w-3 mr-1" />
                          Tương tác
                        </Badge>
                      )}
                      {tour.metadata?.scenes?.some((scene) => scene.richDescription) && (
                        <Badge variant="outline">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Nội dung phong phú
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Tour Dates */}
                  {(tour.createdAt || tour.updatedAt) && (
                    <>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        {tour.createdAt && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Tạo: {formatDate(tour.createdAt)}</span>
                          </div>
                        )}
                        {tour.updatedAt && tour.updatedAt !== tour.createdAt && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Cập nhật: {formatDate(tour.updatedAt)}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  {isOrderExisted ? (
                    <>
                      {/* Tour Access Button - User already purchased */}
                      <Button
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={handleStartTour}
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Tham quan tour ảo
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Bạn đã sở hữu tour này. Nhấn để bắt đầu trải nghiệm đầy đủ.
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Purchase/Start Tour Button */}
                      <Button
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => router.push(`/virtual-tour/${tourId}/checkout`)}
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Mua & Trải nghiệm tour ảo
                      </Button>

                      {/* Preview Button */}
                      <Button size="lg" variant="outline" className="w-full" onClick={handleStartTour}>
                        <Eye className="h-5 w-5 mr-2" />
                        Xem trước miễn phí
                      </Button>

                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Xem trước để khám phá một phần tour, hoặc mua để trải nghiệm đầy đủ
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Scenes Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Danh sách không gian</h2>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'scenes' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('scenes')}
                  size="sm"
                >
                  Không gian ({totalScenes})
                </Button>
                {tour.tourContent && tour.tourContent.length > 0 && (
                  <Button
                    variant={activeTab === 'content' ? 'default' : 'outline'}
                    onClick={() => setActiveTab('content')}
                    size="sm"
                  >
                    Nội dung ({tour.tourContent.length})
                  </Button>
                )}
              </div>
            </div>

            {activeTab === 'scenes' && (
              <div className="space-y-8">
                {/* Main Scenes */}
                {mainScenes.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-foreground">Không gian chính</h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        {mainScenes.length} không gian
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mainScenes.map((scene) => (
                        <SceneCard
                          key={scene.sceneId}
                          scene={scene}
                          isMainScene={true}
                          onSceneClick={handleStartTour}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub Scenes */}
                {subScenes.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-foreground">Khu vực phụ</h3>
                      <Badge className="bg-secondary/10 text-secondary-foreground border-secondary/20">
                        {subScenes.length} khu vực
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {subScenes.map((scene) => (
                        <SceneCard
                          key={scene.sceneId}
                          scene={scene}
                          isMainScene={false}
                          onSceneClick={handleStartTour}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {totalScenes === 0 && (
                  <Card className="p-12 text-center">
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Eye className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Chưa có không gian</h3>
                        <p className="text-muted-foreground">Tour ảo này chưa có không gian nào được thiết lập.</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'content' && tour.tourContent && tour.tourContent.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Nội dung bổ sung</h3>
                <div className="grid gap-4">
                  {tour.tourContent.map((content, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <p className="text-muted-foreground">{content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
