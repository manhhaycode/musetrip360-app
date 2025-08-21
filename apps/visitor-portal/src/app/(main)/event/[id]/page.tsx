'use client';

import { EventDetailPage } from '@/components/event/EventDetailPage';
import { notFound } from 'next/navigation';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return <EventDetailPage eventId={id} />;
}
