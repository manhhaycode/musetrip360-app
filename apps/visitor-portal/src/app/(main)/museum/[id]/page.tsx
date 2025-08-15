'use client';

import { use } from 'react';
import { MuseumHomePage } from '@/components/museum';

interface MuseumPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MuseumPage({ params }: MuseumPageProps) {
  const { id } = use(params);
  return <MuseumHomePage museumId={id} />;
}
