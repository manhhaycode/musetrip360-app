/**
 * @fileoverview Event Bus for streaming coordination
 *
 * Decouples WebRTC and SignalR through event-driven communication
 */

export type StreamingEventType =
  // WebRTC Events
  | 'webrtc:ice-candidate'
  | 'webrtc:offer-created'
  | 'webrtc:answer-created'
  | 'webrtc:remote-stream'
  | 'webrtc:connection-state-change'
  | 'webrtc:error'
  // SignalR Events
  | 'signalr:offer-received'
  | 'signalr:answer-received'
  | 'signalr:ice-candidate-received'
  | 'signalr:peer-joined'
  | 'signalr:peer-disconnected'
  | 'signalr:connection-state-change'
  | 'signalr:error';

export interface StreamingEventPayload {
  // WebRTC Events
  'webrtc:ice-candidate': { candidate: RTCIceCandidateInit; isPub: boolean };
  'webrtc:offer-created': { offer: RTCSessionDescriptionInit };
  'webrtc:answer-created': { answer: RTCSessionDescriptionInit };
  'webrtc:remote-stream': { stream: MediaStream; peerId: string };
  'webrtc:connection-state-change': { state: RTCPeerConnectionState; isPub: boolean };
  'webrtc:error': { error: Error; context: string };

  // SignalR Events
  'signalr:offer-received': { offer: RTCSessionDescriptionInit; connectionId: string };
  'signalr:answer-received': { answer: RTCSessionDescriptionInit; connectionId: string };
  'signalr:ice-candidate-received': { candidate: RTCIceCandidateInit; isPub: boolean; connectionId: string };
  'signalr:peer-joined': { userId: string; peerId: string };
  'signalr:peer-disconnected': { userId: string; peerId: string; streamId: string };
  'signalr:connection-state-change': { state: 'connected' | 'disconnected' | 'connecting' | 'failed' };
  'signalr:error': { error: Error; context: string };
}

export type StreamingEventHandler<T extends StreamingEventType> = (
  payload: StreamingEventPayload[T]
) => void | Promise<void>;

class StreamingEventBus {
  private listeners = new Map<StreamingEventType, Set<StreamingEventHandler<any>>>();

  /**
   * Subscribe to streaming event
   */
  on<T extends StreamingEventType>(event: T, handler: StreamingEventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.listeners.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Emit streaming event
   */
  emit<T extends StreamingEventType>(event: T, payload: StreamingEventPayload[T]): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;

    handlers.forEach(async (handler) => {
      try {
        await handler(payload);
      } catch (error) {
        console.error(`Error in ${event} handler:`, error);
      }
    });
  }

  /**
   * Remove all listeners for an event type
   */
  off(event: StreamingEventType): void {
    this.listeners.delete(event);
  }

  /**
   * Remove all listeners
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Get current listener count for debugging
   */
  getListenerCount(event?: StreamingEventType): number {
    if (event) {
      return this.listeners.get(event)?.size || 0;
    }
    return Array.from(this.listeners.values()).reduce((total, handlers) => total + handlers.size, 0);
  }
}

// Global singleton instance
export const streamingEventBus = new StreamingEventBus();

/**
 * Hook for using event bus in React components
 */
import { useEffect, useRef } from 'react';

export function useStreamingEvents() {
  const unsubscribersRef = useRef<(() => void)[]>([]);

  const on = <T extends StreamingEventType>(
    event: T,
    handler: StreamingEventHandler<T>
  ): ReturnType<StreamingEventBus['on']> => {
    const unsubscribe = streamingEventBus.on(event, handler);
    unsubscribersRef.current.push(unsubscribe);
    return unsubscribe;
  };

  const emit = <T extends StreamingEventType>(event: T, payload: StreamingEventPayload[T]): void => {
    streamingEventBus.emit(event, payload);
  };

  // Cleanup on unmounting
  useEffect(() => {
    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub());
      unsubscribersRef.current = [];
    };
  }, []);

  return { on, emit };
}
