'use client';
import { StreamingProvider } from '@musetrip360/streaming/contexts';
import { useAuthStore } from '@musetrip360/auth-system/state';
import React from 'react';
import { envConfig } from '@/config';

export default function StreamLayout({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return null;
  }

  if (!envConfig.TURN_SERVER_URL || !envConfig.SIGNALING_SERVER_URL) {
    throw new Error('Config streaming is not defined in the environment configuration.');
  }

  return (
    <StreamingProvider
      config={{
        serverUrl: envConfig.SIGNALING_SERVER_URL,
        turnCredentials: {
          username: 'webrtc',
          credential: 'supersecret',
        },
        turnServerUrl: envConfig.TURN_SERVER_URL,
        accessToken: accessToken.token,
      }}
    >
      <div className="h-screen bg-background">{children}</div>
    </StreamingProvider>
  );
}
