# @musetrip360/streaming

WebRTC streaming package for multi-user video calls in MuseTrip360 system.

## Features

- **Multi-user video calling** with WebRTC SFU architecture
- **SignalR integration** with .NET backend
- **React components** using `@musetrip360/ui-core`
- **State management** with Zustand stores
- **TypeScript support** with comprehensive types
- **Simple API** matching reference implementation

## Installation

```bash
pnpm add @musetrip360/streaming
```

## Quick Start

### 1. Setup Provider

```tsx
import { StreamingProvider } from '@musetrip360/streaming';

const config = {
  serverUrl: 'https://api.musetrip360.site/signaling',
  turnServerUrl: 'turn:34.87.114.164:3478',
  turnCredentials: {
    username: 'webrtc',
    credential: 'supersecret',
  },
  accessToken: '', // From auth system
};

function App() {
  return <StreamingProvider config={config}>{/* Your app */}</StreamingProvider>;
}
```

### 2. Use Components

```tsx
import { StreamingRoom, useStreamingContext } from '@musetrip360/streaming';

function VideoCall() {
  const { joinRoom, createRoom, toggleVideo } = useStreamingContext();

  return <StreamingRoom />;
}
```

## API Reference

### Components

- **`StreamingRoom`** - Complete room interface
- **`LocalVideo`** - Local video display
- **`RemoteVideo`** - Remote participant video
- **`VideoGrid`** - Grid layout for multiple videos
- **`MediaControls`** - Camera/mic/leave controls
- **`RoomControls`** - Join/create room interface

### Hooks

- **`useStreamingContext()`** - Access streaming state
- **`useSignalR()`** - SignalR connection management
- **`useWebRTC()`** - WebRTC peer connections
- **`useMediaStream()`** - Media stream management

### Configuration

```typescript
interface SignalRConnectionConfig {
  serverUrl: string; // SignalR hub URL
  turnServerUrl: string; // TURN server URL
  turnCredentials: {
    username: string;
    credential: string;
  };
  accessToken?: string; // Auth token
  metadata?: string; // Optional metadata
}
```

## Architecture

```
StreamingProvider
├── SignalR Client         # WebSocket connection to .NET server
├── WebRTC Manager         # Publisher/Subscriber peer connections
├── Media Stream Manager   # getUserMedia, track management
├── State Stores          # Zustand stores for state
└── React Components      # UI components using ui-core
```

## Backend Integration

Requires MuseTrip360 .NET SignalR hub with these methods:

- `Join(roomId, offer)` - Join room with WebRTC offer
- `Answer(sdp)` - Send WebRTC answer
- `Trickle(candidate)` - Send ICE candidate
- `SetStreamPeerId(streamId)` - Track stream mapping
- `UpdateRoomState(metadata)` - Update room metadata

## Usage Example

```tsx
import { StreamingProvider, useStreamingContext, LocalVideo, RemoteVideo } from '@musetrip360/streaming';

function MyVideoCall() {
  const {
    mediaStream: { localStream },
    participants,
    joinRoom,
    toggleVideo,
    toggleAudio,
  } = useStreamingContext();

  return (
    <div>
      {localStream && <LocalVideo stream={localStream} />}

      {Array.from(participants.values()).map(
        (participant) =>
          !participant.isLocalUser && (
            <RemoteVideo
              key={participant.id}
              participant={participant}
              stream={/* get stream by participant.streamId */}
            />
          )
      )}

      <button onClick={() => joinRoom('room123')}>Join Room</button>
      <button onClick={toggleVideo}>Toggle Video</button>
      <button onClick={toggleAudio}>Toggle Audio</button>
    </div>
  );
}
```

## Development

```bash
# Start dev server
pnpm dev

# Build package
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint
```

## License

MIT
