import React, { Suspense } from 'react';
import { FullscreenProvider } from '@/contexts/FullscreenContext';
import { MainLayoutClient } from '@/components/layout/MainLayoutClient';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <FullscreenProvider>
      <MainLayoutClient>{children}</MainLayoutClient>
    </FullscreenProvider>
  );
}
