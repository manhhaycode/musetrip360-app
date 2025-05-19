'use client';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { MantineProvider } from '@mantine/core';
import { theme, cssVariablesResolver } from '@musetrip360/ui';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
