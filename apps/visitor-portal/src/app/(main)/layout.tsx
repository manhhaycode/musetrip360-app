import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import { Header } from '@/components/layout/Header';
import React from 'react';
import Footer from '@/components/layout/Footter';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className="h-screen *:data-[slot=scroll-area-viewport]:!pr-0">
      <Header />
      <main className="min-h-[calc(100vh-458px)]">{children}</main>
      <Footer />
    </ScrollArea>
  );
}
