'use client';

import { EventDetailPage } from '@/components/event/EventDetailPage';
import { use } from 'react';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const resolvedParams = use(params);

  return <EventDetailPage eventId={resolvedParams.id} />;
}
