'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VirtualTourViewer } from '@musetrip360/virtual-tour/components';
import { useVirtualTourById } from '@musetrip360/virtual-tour';
import { useCheckOrderExisted } from '@musetrip360/payment-management/api';
import { Button } from '@musetrip360/ui-core/button';
import { Card, CardContent, CardHeader } from '@musetrip360/ui-core/card';
import { ArrowLeft, Lock, Loader2, Minimize, Maximize } from 'lucide-react';
import { useFullscreen } from '@/contexts/FullscreenContext';

export default function VirtualTourViewerPage() {
  const params = useParams();
  const router = useRouter();
  const virtualTourId = params['virtual-tour-id'] as string;

  // Fetch virtual tour data
  const { data: virtualTour, isLoading, error } = useVirtualTourById(virtualTourId);

  // Check if user has purchased this tour
  const { data: hasPurchasedTour, isLoading: isOrderLoading } = useCheckOrderExisted(virtualTourId);

  // Use global fullscreen context instead of local state
  const { isFullscreen } = useFullscreen();

  const handleBackToTourDetail = () => {
    // Exit fullscreen before navigating if in fullscreen mode
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    router.push(`/virtual-tour/${virtualTourId}`);
  };

  // Fullscreen functionality
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.warn('Failed to enter fullscreen:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Failed to exit fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      // User manually exiting fullscreen
      setHasUserExitedFullscreen(true);
      await exitFullscreen();
    } else {
      // User manually entering fullscreen - reset the flag
      setHasUserExitedFullscreen(false);
      await enterFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  // Handle fullscreen change events for manual exit detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;

      // If user exits fullscreen via ESC key, mark as manually exited
      if (!isCurrentlyFullscreen && isFullscreen) {
        setHasUserExitedFullscreen(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Track if user has manually exited fullscreen to prevent auto re-entry
  const [hasUserExitedFullscreen, setHasUserExitedFullscreen] = useState(false);

  // Auto-enter fullscreen when component mounts and user has purchased tour
  useEffect(() => {
    if (hasPurchasedTour && virtualTour && !isFullscreen && !hasUserExitedFullscreen) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        enterFullscreen();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [hasPurchasedTour, virtualTour, isFullscreen, hasUserExitedFullscreen, enterFullscreen]);

  // Loading state
  if (isLoading || isOrderLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Đang tải virtual tour...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !virtualTour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Lỗi tải dữ liệu</h1>
            <p className="text-muted-foreground mt-2">Không thể tải virtual tour. Vui lòng thử lại sau.</p>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBackToTourDetail} className="w-full" variant="default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Trở về trang chi tiết tour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasPurchasedTour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Truy cập bị hạn chế</h1>
              <p className="text-muted-foreground mt-2">
                Bạn chưa mua tour này. Vui lòng mua tour để có thể trải nghiệm virtual tour 360°.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleBackToTourDetail} className="w-full" variant="default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Trở về trang chi tiết tour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <VirtualTourViewer virtualTour={virtualTour} enableUserControls={true} useHamburgerMenu={true} />

      {/* Fullscreen Controls - Only show when NOT in fullscreen */}
      {!isFullscreen && (
        <div className="absolute top-4 right-4 z-30 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-black/75 hover:bg-black/90 text-white border-0"
          >
            <Maximize className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBackToTourDetail}
            className="bg-black/75 hover:bg-black/90 text-white border-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Thoát
          </Button>
        </div>
      )}

      {/* Fullscreen Exit Controls - Only show when IN fullscreen */}
      {isFullscreen && (
        <div className="absolute top-4 right-4 z-30">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-black/75 hover:bg-black/90 text-white border-0"
          >
            <Minimize className="w-4 h-4 mr-2" />
            Thoát fullscreen
          </Button>
        </div>
      )}
    </div>
  );
}
