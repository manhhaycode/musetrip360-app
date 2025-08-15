'use client';

import { use } from 'react';
import RoomSetup from '../components/RoomSetup';

interface RoomSetupPageProps {
  params: Promise<{ roomId: string }>;
}

export default function RoomSetupPage({ params }: RoomSetupPageProps) {
  const { roomId } = use(params);

  return <RoomSetup roomId={roomId} />;
}
