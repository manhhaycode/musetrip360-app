/**
 * @fileoverview Streaming Demo App
 *
 * Example implementation matching the reference code
 */

import React from 'react';
import { StreamingProvider, StreamingRoom } from '../lib';
import './index.css';

// Configuration matching reference implementation
const streamingConfig = {
  serverUrl: 'https://api.musetrip360.site/signaling',
  turnServerUrl: 'turn:34.87.114.164:3478',
  turnCredentials: {
    username: 'webrtc',
    credential: 'supersecret',
  },
  accessToken: '', // This would come from auth system
  metadata: '', // Optional metadata
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">MuseTrip360 Streaming</h1>
          <p className="text-gray-600 dark:text-gray-400">WebRTC multi-user video calling demo</p>
        </div>

        <StreamingProvider config={streamingConfig} autoConnect={true} autoInitializeMedia={true}>
          <StreamingRoom className="max-w-7xl mx-auto" />
        </StreamingProvider>
      </div>
    </div>
  );
}

export default App;
