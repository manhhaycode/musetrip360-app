'use client';

import { use, useEffect } from 'react';
import RoomSetup from '../components/RoomSetup';
import { useStreamingContext } from '@musetrip360/streaming/contexts';

interface RoomSetupPageProps {
  params: Promise<{ roomId: string }>;
}

export default function RoomSetupPage({ params }: RoomSetupPageProps) {
  const { roomId } = use(params);
  const { isInRoom, leaveRoom, initialize } = useStreamingContext();

  useEffect(() => {
    if (isInRoom) {
      leaveRoom()
        .then(() => {
          initialize().catch(console.error);
        })
        .catch(console.error);
    } else {
      initialize().catch(console.error);
    }
  }, []);

  return <RoomSetup roomId={roomId} />;
}
