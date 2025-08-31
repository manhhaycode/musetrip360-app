'use client';

import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { Header } from '@/components/layout/Header';
import React from 'react';
import Footer from '@/components/layout/Footter';
import { useFullscreen } from '@/contexts/FullscreenContext';

export function MainLayoutClient({ children }: { children: React.ReactNode }) {
  const { isFullscreen } = useFullscreen();

  return (
    <ScrollArea className="h-screen *:data-[slot=scroll-area-viewport]:!pr-0">
      {/* Header - Hide when fullscreen */}
      {!isFullscreen && <Header />}

      {/* Main content - Adjust min-height based on fullscreen state */}
      <main className={isFullscreen ? 'h-screen' : 'min-h-[calc(100vh-458px)]'}>{children}</main>

      {/* Footer - Hide when fullscreen */}
      {!isFullscreen && <Footer />}
    </ScrollArea>
  );
}
