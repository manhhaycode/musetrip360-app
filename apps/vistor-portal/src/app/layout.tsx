import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '@musetrip360/design-system/styles';
import { ThemeProvider } from './theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MuseTrip360 - Explore Museums Like Never Before',
  description:
    'Discover world-class museums, join exclusive events, and experience immersive 360° virtual tours. Your gateway to cultural experiences from anywhere in the world.',
  keywords: ['museums', 'virtual tours', '360 tours', 'cultural events', 'art', 'history', 'science museums'],
  authors: [{ name: 'MuseTrip360 Team' }],
  openGraph: {
    title: 'MuseTrip360 - Explore Museums Like Never Before',
    description: 'Discover world-class museums, join exclusive events, and experience immersive 360° virtual tours.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
