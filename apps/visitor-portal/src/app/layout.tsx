import type { Metadata } from 'next';
// import { Header } from '@/components/layout/Header';
import './globals.css';
// import Footer from '@/components/layout/Footter';
import { ScrollArea } from '@musetrip360/ui-core/scroll-area';
import React from 'react';

export const metadata: Metadata = {
  title: 'MuseTrip360 - Nền tảng bảo tàng số',
  description: 'Khám phá bảo tàng, tham gia sự kiện và trải nghiệm tour ảo 360° từ khắp nơi trên thế giới',
  keywords: 'bảo tàng, tour ảo, 360°, sự kiện văn hóa, giáo dục, VR, AR',
  authors: [{ name: 'MuseTrip360 Team' }],
  creator: 'MuseTrip360',
  publisher: 'MuseTrip360',
  robots: 'index, follow',
  openGraph: {
    title: 'MuseTrip360 - Nền tảng bảo tàng số',
    description: 'Khám phá bảo tàng, tham gia sự kiện và trải nghiệm tour ảo 360° từ khắp nơi trên thế giới',
    url: 'https://musetrip360.com',
    siteName: 'MuseTrip360',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MuseTrip360 - Nền tảng bảo tàng số',
    description: 'Khám phá bảo tàng, tham gia sự kiện và trải nghiệm tour ảo 360° từ khắp nơi trên thế giới',
    creator: '@musetrip360',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-background">
        <ScrollArea className="h-screen">
          {/* <Header /> */}
          <main>{children}</main>
          {/* <Footer /> */}
        </ScrollArea>
      </body>
    </html>
  );
}
