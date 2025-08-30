# Tour Sync Integration Guide

This guide explains how to integrate the streaming package's tour synchronization features with the virtual-tour package.

## Overview

The tour sync system enables real-time synchronization of virtual tour actions between a tour guide and attendees:

- **Tour Guide Mode**: User actions (camera movements, scene changes, artifact interactions) are broadcasted to all attendees
- **Attendee Mode**: Receives and applies controlled actions from the tour guide

## Quick Start

### Basic Usage

```tsx
import { SyncedVirtualTourViewer } from '@musetrip360/streaming/ui/components';
import { StreamingProvider } from '@musetrip360/streaming/contexts';

function MyTourApp() {
  const [tourMode, setTourMode] = useState<'guide' | 'attendee'>('guide');

  return (
    <StreamingProvider config={signalRConfig}>
      <SyncedVirtualTourViewer 
        virtualTour={myVirtualTourData}
        mode={tourMode}
        onModeChange={setTourMode}
      />
    </StreamingProvider>
  );
}
```

### Advanced Usage with Custom Props

```tsx
import { SyncedVirtualTourViewer } from '@musetrip360/streaming/ui/components';

function AdvancedTourApp() {
  return (
    <SyncedVirtualTourViewer 
      virtualTour={virtualTourData}
      mode="guide"
      virtualTourProps={{
        // Override any VirtualTourViewer props
        enableRotate: true,
        onClick: customClickHandler,
      }}
    />
  );
}
```

### Using the Hook for Custom Integration

```tsx
import { useTourSyncIntegration } from '@musetrip360/streaming/ui/components';
import { VirtualTourViewer } from '@musetrip360/virtual-tour/components';

function CustomTourComponent() {
  const { syncedProps, isConnected } = useTourSyncIntegration(
    virtualTourData, 
    'guide'
  );

  return (
    <div>
      {!isConnected && <div>⚠️ Tour sync unavailable</div>}
      <VirtualTourViewer 
        virtualTour={virtualTourData}
        {...syncedProps}
      />
    </div>
  );
}
```

## Tour Actions

### Automatic Actions (Guide Mode)
When in guide mode, these user actions are automatically synchronized:

- **Camera Changes**: Mouse drag, wheel zoom, touch gestures
- **Scene Navigation**: Clicking scene navigation buttons  
- **Artifact Interactions**: Clicking polygons to preview artifacts

### Manual Actions (Programmatic)
You can also send tour actions programmatically:

```tsx
import { useSyncedVirtualTour } from '@musetrip360/streaming/ui/components';

function TourControls() {
  const { guideModeUtils } = useSyncedVirtualTour();

  const handleSceneChange = () => {
    guideModeUtils.sendSceneChange('scene-2');
  };

  const handleCameraReset = () => {
    guideModeUtils.sendCameraChange({ 
      theta: 0, 
      phi: Math.PI / 2, 
      fov: 75 
    });
  };

  return (
    <div>
      <button onClick={handleSceneChange}>Go to Scene 2</button>
      <button onClick={handleCameraReset}>Reset Camera</button>
    </div>
  );
}
```

## Architecture

### Data Flow

```
Tour Guide Actions → TourActionService → SignalR → Backend → Other Participants
                                                              ↓
Attendee VirtualTourViewer ← useTourActionReceiver ← SignalR Events
```

### Components Hierarchy

```
SyncedVirtualTourViewer
├── useTourActionState (guide mode)
├── useTourActionReceiver (attendee mode)
└── VirtualTourViewer (with controlled/event props)
```

## Tour Action Types

### Camera Change
```typescript
{
  ActionType: 'camera_change',
  ActionData: {
    CameraPosition: {
      theta: number,  // Horizontal angle (radians)
      phi: number,    // Vertical angle (radians)  
      fov: number     // Field of view (degrees)
    }
  }
}
```

### Scene Change
```typescript
{
  ActionType: 'scene_change',
  ActionData: {
    SceneId: string
  }
}
```

### Artifact Preview
```typescript
{
  ActionType: 'artifact_preview',
  ActionData: {
    ArtifactId: string
  }
}
```

### Artifact Close
```typescript
{
  ActionType: 'artifact_close',
  ActionData: {}
}
```

## State Management

### Guide Mode State
```typescript
const { guideModeUtils } = useSyncedVirtualTour();

// Check if can send actions
guideModeUtils.canSendActions; // boolean

// Send actions
await guideModeUtils.sendCameraChange(position);
await guideModeUtils.sendSceneChange(sceneId);
await guideModeUtils.sendArtifactPreview(artifactId);
await guideModeUtils.sendArtifactClose();
```

### Attendee Mode State
```typescript
const { attendeeModeUtils } = useSyncedVirtualTour();

// Get controlled props for VirtualTourViewer
attendeeModeUtils.controlledSceneId;        // string | undefined
attendeeModeUtils.controlledCameraPosition; // { theta, phi, fov } | undefined
attendeeModeUtils.controlledArtifactId;     // string | null

// Clear controlled state
attendeeModeUtils.clearControlledState();
```

## Connection Management

### Connection Info
```typescript
const { connectionInfo } = useSyncedVirtualTour();

connectionInfo.isConnected;      // boolean
connectionInfo.connectionStatus; // string  
connectionInfo.roomId;          // string | null
connectionInfo.currentUserId;   // string | null
```

### Setup Requirements

1. **StreamingProvider**: Must wrap your app with streaming context
```tsx
<StreamingProvider config={signalRConfig}>
  <YourTourApp />
</StreamingProvider>
```

2. **SignalR Configuration**: Provide valid SignalR connection config
```typescript
const signalRConfig = {
  serverUrl: 'https://your-signalr-hub.com/streamingHub',
  accessToken: userAccessToken,
};
```

3. **Room Joining**: User must join a streaming room for tour sync to work
```typescript
const { joinRoom } = useStreamingContext();
await joinRoom('tour-room-id');
```

## Error Handling

### Connection Errors
```tsx
const { connectionInfo } = useSyncedVirtualTour();

if (!connectionInfo.isConnected) {
  return <div>⚠️ Tour synchronization unavailable</div>;
}
```

### Send Action Errors
Tour action methods return promises and can throw errors:

```tsx
try {
  await guideModeUtils.sendSceneChange('scene-1');
} catch (error) {
  console.error('Failed to send scene change:', error);
  // Handle error (show toast, retry, etc.)
}
```

## Development & Testing

### Debug Mode
Use the example component with debug info:

```tsx
import { TourSyncExample } from '@musetrip360/streaming/ui/components';

<TourSyncExample 
  virtualTour={tourData}
  showDebugInfo={true}
  initialMode="guide"
/>
```

### Mode Switching
In development, you can switch between guide and attendee modes:

```tsx
<SyncedVirtualTourViewer 
  virtualTour={tourData}
  mode={currentMode}
  onModeChange={setMode} // Only works in development
/>
```

## Performance Considerations

1. **Debouncing**: Camera changes are debounced to avoid spamming SignalR
2. **Selective Updates**: Only significant camera changes trigger sync events  
3. **Connection Management**: Automatic reconnection and error handling
4. **Memory Management**: Event listeners are properly cleaned up

## Troubleshooting

### Tour Actions Not Syncing
1. Check SignalR connection status
2. Verify user is in guide mode and has permissions
3. Ensure both users are in the same room
4. Check browser console for errors

### Performance Issues
1. Check network connection quality
2. Monitor SignalR connection stability  
3. Reduce camera change sensitivity
4. Check for JavaScript errors blocking event handlers

### Integration Issues
1. Verify virtual-tour package version compatibility
2. Check that StreamingProvider wraps the component tree
3. Ensure proper TypeScript types are imported
4. Validate virtual tour data structure