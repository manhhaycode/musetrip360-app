/**
 * @fileoverview Streaming Package Main Export
 *
 * Main entry point for the streaming package
 */

// Core API
export * from './api';

// State Management
export * from './state';

// React Hooks
export * from './hooks';

// UI Components
export * from './ui';

// Context Provider
export * from './contexts';

// Types
export * from './types';

// Utilities
export * from './utils';

// Main Context Provider (for convenience)
export { StreamingProvider, useStreamingContext } from './contexts/StreamingContext';

// Main Components (for convenience)
export { StreamingRoom } from './ui/components/Room/StreamingRoom';
export { LocalVideo, RemoteVideo, VideoGrid } from './ui/components/Video';
export { MediaControls, RoomControls } from './ui/components/Controls';
