/**
 * @fileoverview Streaming Types
 *
 * TypeScript types for WebRTC streaming functionality
 */

import { SignalRClient } from '@/api';
import { EventParticipant } from '@musetrip360/event-management';
import { z } from 'zod';

// SignalR Connection Types
export interface SignalRConnectionConfig {
  serverUrl: string;
  turnServerUrl: string;
  turnCredentials: {
    username: string;
    credential: string;
  };
  accessToken?: string;
  metadata?: string;
}

export interface SignalREvents {
  ReceiveConnectionId: (connectionId: string) => void;
  PeerJoined: (userId: string, peerId: string) => void;
  PeerDisconnected: (userId: string, peerId: string, streamId: string) => void;
  ReceiveOffer: (connectionId: string, offerData: string) => void;
  ReceiveAnswer: (connectionId: string, answerData: string) => void;
  ReceiveIceCandidate: (connectionId: string, candidateData: string, isPub: boolean) => void;
  ReceiveRoomState: (roomState: RoomState) => void;
  ReceiveChatMessage: (message: string) => void; // New dedicated chat message event
  ReceiveTourAction: (actionJson: string) => void; // New tour action sync event
}

// WebRTC Types
export interface RTCConfigurationExtended extends RTCConfiguration {
  iceServers: RTCIceServer[];
}

export interface PeerConnectionPair {
  publisher: RTCPeerConnection | null;
  subscriber: RTCPeerConnection | null;
}

// Room Metadata Structure for Messages + Tour Actions
export interface RoomMetadata {
  CurrentTourState?: {
    CurrentScene: string | null;
    CurrentArtifact: string | null;
    currentHostedId: string | null;
    IsLive: boolean;
  };
}

export interface TourActions {
  Id: string;
  ActionType: 'camera_change' | 'scene_change' | 'artifact_preview' | 'artifact_close';
  ActionData: {
    // Scene navigation
    SceneId?: string;

    // Artifact interaction
    ArtifactId?: string;

    // Camera position (spherical coordinates for panorama)
    CameraPosition?: {
      theta: number; // Horizontal angle in radians
      phi: number; // Vertical angle in radians
      fov: number; // Field of view in degrees
    };
  };
  PerformedBy: string;
  Timestamp: number;
}

// Chat message type alias for easier usage
export type ChatMessage = {
  Id: string;
  SenderId: string;
  SenderName: string;
  Message: string;
  Timestamp: number;
  MessageType: 'text' | 'system';
};

// Room and Peer Management - Match .NET Backend Response
export interface RoomState {
  Id: string;
  Name: string;
  Description?: string;
  Status: number;
  EventId?: string;
  Metadata?: RoomMetadata;
  CreatedAt: Date;
  UpdatedAt: Date;
  IsActive: boolean;
}

export interface Participant {
  id: string;
  peerId: string;
  streamId: string;
  userId: string;
  connectionId: string;
  metadata?: Record<string, any>;
  isLocalUser: boolean;
  mediaState: MediaState;
  joinedAt: Date;
  participantInfo?: EventParticipant;
}

export interface MediaState {
  video: boolean;
  audio: boolean;
  screen?: boolean;
}

// Stream Management
export interface MediaStreamInfo {
  streamId: string;
  peerId: string;
  stream: MediaStream;
  type: 'local' | 'remote';
  mediaState: MediaState;
}

export interface StreamConstraints {
  video: boolean | MediaTrackConstraints;
  audio: boolean | MediaTrackConstraints;
}

// Connection States
export enum ConnectionState {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Reconnecting = 'reconnecting',
  Failed = 'failed',
}

export enum PeerConnectionState {
  New = 'new',
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnected = 'disconnected',
  Failed = 'failed',
  Closed = 'closed',
}

// Error Types
export interface StreamingError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export enum StreamingErrorCode {
  SIGNALR_CONNECTION_FAILED = 'SIGNALR_CONNECTION_FAILED',
  PEER_CONNECTION_FAILED = 'PEER_CONNECTION_FAILED',
  MEDIA_ACCESS_DENIED = 'MEDIA_ACCESS_DENIED',
  ROOM_JOIN_FAILED = 'ROOM_JOIN_FAILED',
  INVALID_ROOM_ID = 'INVALID_ROOM_ID',
  TURN_SERVER_ERROR = 'TURN_SERVER_ERROR',
  ICE_CANDIDATE_ERROR = 'ICE_CANDIDATE_ERROR',
}

// Validation Schemas
export const roomIdSchema = z.string().min(3).max(50);
export const participantMetadataSchema = z.record(z.any()).optional();
export const streamConstraintsSchema = z.object({
  video: z.union([z.boolean(), z.record(z.any())]),
  audio: z.union([z.boolean(), z.record(z.any())]),
});

// Hook Return Types
export interface UseSignalRReturn {
  connection: any; // SignalR HubConnection
  connectionState: ConnectionState;
  connectionId: string | null;
  isConnected: boolean;
  connect: (config: SignalRConnectionConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  joinRoom: (roomId: string, offer?: RTCSessionDescriptionInit) => Promise<void>;
  leaveRoom: () => Promise<void>;
  updateRoomState: (metadata: Record<string, any>) => Promise<void>;
  getClient: () => SignalRClient | null; // SignalRClient | null
  error: StreamingError | null;
}

export interface UseWebRTCReturn {
  peerConnections: PeerConnectionPair;
  createPublisherConnection: (localStream: MediaStream) => RTCPeerConnection;
  createSubscriberConnection: () => RTCPeerConnection;
  handleOffer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
  handleAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>;
  handleIceCandidate: (candidate: RTCIceCandidateInit, isPub: boolean) => Promise<void>;
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  cleanup: () => void;
  getStats: () => Promise<{ publisher: RTCStatsReport | null; subscriber: RTCStatsReport | null }>;
  error: StreamingError | null;
}

export interface UseMediaStreamReturn {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStreamInfo>;
  mediaState: MediaState;
  isInitialized: boolean;
  isInitializingMedia: boolean;
  initializeMedia: (constraints?: StreamConstraints) => Promise<MediaStream>;
  toggleVideo: () => void;
  toggleAudio: () => boolean;
  stopStream: () => void;
  startScreenShare: () => Promise<MediaStream>;
  stopScreenShare: () => void;
  addRemoteStream: (streamInfo: MediaStreamInfo) => void;
  removeRemoteStream: (streamId: string) => void;
  getMediaDevices: () => Promise<{ hasCamera: boolean; hasMicrophone: boolean; devices: MediaDeviceInfo[] }>;
  getStreamStats: () => {
    localStreamId: string | null;
    remoteStreamCount: number;
    totalTracks: number;
    activeTracks: number;
  };
  checkMediaSupport: () => Promise<{
    getUserMedia: boolean;
    getDisplayMedia: boolean;
    supportedConstraints: MediaTrackSupportedConstraints;
  }>;
  error: StreamingError | null;
}

// Context Types
export interface StreamingContextValue {
  // Connection State
  signalR: UseSignalRReturn;
  webRTC: UseWebRTCReturn;
  mediaStream: UseMediaStreamReturn;

  // Room State
  roomState: RoomState | null;
  participants: Map<string, Participant>;
  localParticipant: Participant | null;
  currentRoomId: string | null;
  isInRoom: boolean;
  initialize: () => Promise<void>;

  // Actions
  joinRoom: (roomId: string, metadata?: Record<string, any>) => Promise<void>;
  createRoom: (metadata?: Record<string, any>) => Promise<string>;
  leaveRoom: () => Promise<void>;

  // Media Controls
  toggleVideo: () => void;
  toggleAudio: () => void;

  // Error State
  errors: StreamingError[];
  clearErrors: () => void;
}

// Component Props Types
export interface VideoComponentProps {
  stream?: MediaStream;
  audioState?: boolean;
  autoPlay?: boolean;
  playsInline?: boolean;
  className?: string;
  onError?: (error: Error) => void;
}

export interface LocalVideoProps extends VideoComponentProps {
  showControls?: boolean;
}

export interface RemoteVideoProps extends VideoComponentProps {
  participant: Participant;
  showUserInfo?: boolean;
}

export interface VideoGridProps {
  participants: Participant[];
  localStream?: MediaStream;
  className?: string;
  maxVideosPerRow?: number;
}

export interface MediaControlsProps {
  mediaState: MediaState;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onLeaveRoom: () => void;
  disabled?: boolean;
  className?: string;
}

export interface RoomControlsProps {
  currentRoomId?: string;
  onJoinRoom: (roomId: string) => Promise<void>;
  onCreateRoom: () => Promise<void>;
  onLeaveRoom: () => Promise<void>;
  isConnecting?: boolean;
  className?: string;
}
