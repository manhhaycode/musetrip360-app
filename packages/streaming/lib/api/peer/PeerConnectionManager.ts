/**
 * @fileoverview WebRTC PeerConnection Manager
 *
 * Manages publisher and subscriber PeerConnection instances
 */

import { PeerConnectionPair, RTCConfigurationExtended, StreamingError, StreamingErrorCode } from '../../types';

export class PeerConnectionManager {
  private config: RTCConfigurationExtended;
  private peerConnections: PeerConnectionPair = {
    publisher: null,
    subscriber: null,
  };
  private onIceCandidateCallback?: (candidate: RTCIceCandidate, isPub: boolean) => void;
  private onRemoteStreamCallback?: (stream: MediaStream) => void;

  constructor(turnServerUrl: string, turnCredentials: { username: string; credential: string }) {
    this.config = {
      iceServers: [
        {
          urls: [turnServerUrl],
          username: turnCredentials.username,
          credential: turnCredentials.credential,
        },
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    };
  }

  /**
   * Parse ICE candidate data
   */
  static parseCandidate(candidateData: string | any): RTCIceCandidateInit | null {
    try {
      const parsed = typeof candidateData === 'string' ? JSON.parse(candidateData) : candidateData;

      // Some SFU send in format: { candidate: { candidate: "candidate:..." } }
      if (parsed.candidate && typeof parsed.candidate === 'object') {
        return parsed.candidate;
      }

      return parsed.candidate || parsed;
    } catch (err) {
      console.error('❌ Failed to parse ICE candidate:', err);
      return null;
    }
  }

  /**
   * Create publisher peer connection and add local tracks
   */
  createPublisherConnection(localStream: MediaStream): RTCPeerConnection {
    if (this.peerConnections.publisher) {
      this.peerConnections.publisher.close();
    }

    const pc = new RTCPeerConnection(this.config);
    this.peerConnections.publisher = pc;

    // Add local tracks to publisher connection
    if (localStream) {
      console.log('📹 Adding local tracks to publisher peer connection...');
      localStream.getTracks().forEach((track) => {
        console.log(`Adding track: ${track.kind}`);
        pc.addTrack(track, localStream);
      });
    } else {
      console.warn('⚠️ localStream is null! Cannot add tracks');
    }

    // Setup publisher event handlers
    this.setupPublisherEventHandlers(pc);

    console.log('✅ Publisher peer connection created');
    return pc;
  }

  /**
   * Create subscriber peer connection for receiving remote tracks
   */
  createSubscriberConnection(): RTCPeerConnection {
    if (this.peerConnections.subscriber) {
      this.peerConnections.subscriber.close();
    }

    const pc = new RTCPeerConnection(this.config);
    this.peerConnections.subscriber = pc;

    // Setup subscriber event handlers
    this.setupSubscriberEventHandlers(pc);

    console.log('✅ Subscriber peer connection created');
    return pc;
  }

  /**
   * Handle offer from SFU
   */
  async handleOffer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnections.subscriber) {
      this.peerConnections.subscriber = this.createSubscriberConnection();
    }

    const pc = this.peerConnections.subscriber;

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('✅ Remote description set for subscriber');

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log('✅ Local description set for subscriber');

      return answer;
    } catch (error) {
      throw this.createError(StreamingErrorCode.PEER_CONNECTION_FAILED, 'Failed to handle offer from SFU', error);
    }
  }

  /**
   * Handle answer from SFU
   */
  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnections.publisher) {
      throw this.createError(StreamingErrorCode.PEER_CONNECTION_FAILED, 'Publisher connection not found');
    }

    try {
      const desc = new RTCSessionDescription(answer);
      await this.peerConnections.publisher.setRemoteDescription(desc);
      console.log('✅ Answer processed successfully for publisher');
    } catch (error) {
      throw this.createError(StreamingErrorCode.PEER_CONNECTION_FAILED, 'Failed to handle answer from SFU', error);
    }
  }

  /**
   * Handle ICE candidate from SFU
   */
  async handleIceCandidate(candidate: RTCIceCandidateInit, isPub: boolean): Promise<void> {
    try {
      const targetPc = isPub ? this.peerConnections.publisher : this.peerConnections.subscriber;

      if (!targetPc) {
        console.warn(`⚠️ ${isPub ? 'Publisher' : 'Subscriber'} connection not found for ICE candidate`);
        return;
      }

      await targetPc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log(`🧊 ${isPub ? 'Publisher' : 'Subscriber'} ICE candidate added`);
    } catch (error) {
      console.error('❌ Error adding ICE candidate:', error);
      throw this.createError(StreamingErrorCode.ICE_CANDIDATE_ERROR, 'Failed to add ICE candidate', error);
    }
  }

  /**
   * Create offer for joining room
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnections.publisher) {
      throw this.createError(StreamingErrorCode.PEER_CONNECTION_FAILED, 'Publisher connection not found');
    }

    try {
      const offer = await this.peerConnections.publisher.createOffer();
      await this.peerConnections.publisher.setLocalDescription(offer);
      console.log('📤 Offer created and set as local description');
      return offer;
    } catch (error) {
      throw this.createError(StreamingErrorCode.PEER_CONNECTION_FAILED, 'Failed to create offer', error);
    }
  }

  /**
   * Set ICE candidate callback
   */
  setOnIceCandidate(callback: (candidate: RTCIceCandidate, isPub: boolean) => void): void {
    this.onIceCandidateCallback = callback;
  }

  /**
   * Set remote stream callback
   */
  setOnRemoteStream(callback: (stream: MediaStream) => void): void {
    this.onRemoteStreamCallback = callback;
  }

  /**
   * Get current peer connections
   */
  getPeerConnections(): PeerConnectionPair {
    return this.peerConnections;
  }

  /**
   * Cleanup all peer connections
   */
  cleanup(): void {
    if (this.peerConnections.publisher) {
      this.peerConnections.publisher.close();
      this.peerConnections.publisher = null;
    }

    if (this.peerConnections.subscriber) {
      this.peerConnections.subscriber.close();
      this.peerConnections.subscriber = null;
    }

    console.log('🧹 All peer connections cleaned up');
  }

  /**
   * Setup event handlers for publisher connection
   */
  private setupPublisherEventHandlers(pc: RTCPeerConnection): void {
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending publisher ICE candidate');
        this.onIceCandidateCallback?.(event.candidate, true);
      } else {
        console.log('🧊 All publisher ICE candidates sent');
      }
    };

    pc.onsignalingstatechange = () => {
      console.log('📡 Publisher signaling state:', pc.signalingState);
    };

    pc.onconnectionstatechange = () => {
      console.log('🔗 Publisher connection state:', pc.connectionState);
    };

    pc.oniceconnectionstatechange = () => {
      console.log('🧊 Publisher ICE connection state:', pc.iceConnectionState);
    };

    pc.onicegatheringstatechange = () => {
      console.log('🧊 Publisher ICE gathering state:', pc.iceGatheringState);
    };
  }

  /**
   * Setup event handlers for subscriber connection
   */
  private setupSubscriberEventHandlers(pc: RTCPeerConnection): void {
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('🧊 Sending subscriber ICE candidate');
        this.onIceCandidateCallback?.(event.candidate, false);
      } else {
        console.log('🧊 All subscriber ICE candidates sent');
      }
    };

    pc.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      console.log(`📡 Received data channel from SFU: ${receiveChannel.label}`);
    };

    pc.ontrack = (event) => {
      console.log('🎬 Received remote track:', event.track.kind);
      const stream = event.streams[0];

      if (!stream) {
        console.warn('⚠️ No stream in track event');
        return;
      }

      console.log('📡 Remote stream received:', stream.id);
      this.onRemoteStreamCallback?.(stream);

      // Handle track mute/unmute events
      event.track.onunmute = () => {
        console.log('🔊 Track unmuted:', event.track.kind);
      };

      event.track.onmute = () => {
        console.log('🔇 Track muted:', event.track.kind);
      };
    };

    pc.onsignalingstatechange = () => {
      console.log('📡 Subscriber signaling state:', pc.signalingState);
    };

    pc.onconnectionstatechange = () => {
      console.log('🔗 Subscriber connection state:', pc.connectionState);
    };

    pc.oniceconnectionstatechange = () => {
      console.log('🧊 Subscriber ICE connection state:', pc.iceConnectionState);
    };

    pc.onicegatheringstatechange = () => {
      console.log('🧊 Subscriber ICE gathering state:', pc.iceGatheringState);
    };
  }

  /**
   * Create standardized error object
   */
  private createError(code: StreamingErrorCode, message: string, details?: any): StreamingError {
    return {
      code,
      message,
      details,
      timestamp: new Date(),
    };
  }
}
