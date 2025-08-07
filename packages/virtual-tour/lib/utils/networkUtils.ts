/**
 * Network quality detection and bandwidth measurement utilities
 */

export interface NetworkQuality {
  bandwidth: number; // Mbps
  latency: number; // milliseconds
  quality: 'slow' | 'medium' | 'fast' | 'ultra';
  timestamp: number;
}

export interface NetworkTestConfig {
  testImageSize: number; // Test image size in bytes
  testTimeout: number; // Timeout in milliseconds
  sampleCount: number; // Number of samples to average
  testImageUrl?: string; // Custom test image URL
}

/**
 * Network quality detector with bandwidth measurement
 */
export class NetworkQualityDetector {
  private samples: NetworkQuality[] = [];
  private config: NetworkTestConfig;
  private testInProgress = false;

  constructor(config: Partial<NetworkTestConfig> = {}) {
    this.config = {
      testImageSize: 50 * 1024, // 50KB default test image
      testTimeout: 10000, // 10 second timeout
      sampleCount: 3, // Average of 3 samples
      ...config,
    };
  }

  /**
   * Measure current network bandwidth
   */
  async measureBandwidth(): Promise<NetworkQuality> {
    if (this.testInProgress) {
      // Return last known quality if test is in progress
      return this.getLastKnownQuality();
    }

    this.testInProgress = true;

    try {
      // Use Navigator Connection API if available
      const connectionInfo = this.getConnectionInfo();
      if (connectionInfo) {
        const quality = this.createQualityFromConnection(connectionInfo);
        this.addSample(quality);
        return quality;
      }

      // Fallback to image download test
      const quality = await this.performDownloadTest();
      this.addSample(quality);
      return quality;
    } catch (error) {
      console.warn('Network quality test failed:', error);
      return this.getLastKnownQuality() || this.createDefaultQuality();
    } finally {
      this.testInProgress = false;
    }
  }

  /**
   * Get network info from Navigator Connection API (if available)
   */
  private getConnectionInfo(): any {
    const nav = navigator as any;
    return nav.connection || nav.mozConnection || nav.webkitConnection;
  }

  /**
   * Create quality object from Connection API
   */
  private createQualityFromConnection(connection: any): NetworkQuality {
    const effectiveType = connection.effectiveType || 'unknown';
    const downlink = connection.downlink || 0;

    let bandwidth = downlink;
    let quality: NetworkQuality['quality'] = 'medium';

    // Map connection types to bandwidth estimates
    switch (effectiveType) {
      case 'slow-2g':
        bandwidth = Math.max(bandwidth, 0.05);
        quality = 'slow';
        break;
      case '2g':
        bandwidth = Math.max(bandwidth, 0.25);
        quality = 'slow';
        break;
      case '3g':
        bandwidth = Math.max(bandwidth, 1.5);
        quality = 'medium';
        break;
      case '4g':
        bandwidth = Math.max(bandwidth, 10);
        quality = 'fast';
        break;
      default:
        bandwidth = Math.max(bandwidth, 5);
        quality = 'medium';
    }

    return {
      bandwidth,
      latency: connection.rtt || 100,
      quality,
      timestamp: Date.now(),
    };
  }

  /**
   * Perform download test to measure bandwidth
   */
  private async performDownloadTest(): Promise<NetworkQuality> {
    const testUrl = this.generateTestImageUrl();
    const startTime = performance.now();
    const startBytes = await this.getCurrentBytes();

    try {
      await this.downloadTestImage(testUrl);
      const endTime = performance.now();
      const endBytes = await this.getCurrentBytes();

      const duration = endTime - startTime; // milliseconds
      const bytesTransferred = Math.max(endBytes - startBytes, this.config.testImageSize);
      const bandwidth = (bytesTransferred * 8) / (duration * 1000); // Convert to Mbps

      return {
        bandwidth: Math.max(bandwidth, 0.1), // Minimum 0.1 Mbps
        latency: Math.min(duration, 1000), // Cap latency at 1 second
        quality: this.bandwidthToQuality(bandwidth),
        timestamp: Date.now(),
      };
    } catch (error) {
      // If test fails, estimate based on timeout
      const duration = performance.now() - startTime;
      const estimatedBandwidth = duration > 5000 ? 0.5 : 2; // Very rough estimate

      return {
        bandwidth: estimatedBandwidth,
        latency: duration,
        quality: 'slow',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Generate test image URL with cache busting
   */
  private generateTestImageUrl(): string {
    if (this.config.testImageUrl) {
      const separator = this.config.testImageUrl.includes('?') ? '&' : '?';
      return `${this.config.testImageUrl}${separator}t=${Date.now()}`;
    }

    // Generate a simple test image (1x1 pixel with specific size)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 1, 1);

    return canvas.toDataURL();
  }

  /**
   * Download test image
   */
  private downloadTestImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        reject(new Error('Download test timeout'));
      }, this.config.testTimeout);

      img.onload = () => {
        clearTimeout(timeout);
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Download test failed'));
      };

      img.src = url;
    });
  }

  /**
   * Get current network bytes (if available)
   */
  private async getCurrentBytes(): Promise<number> {
    const connection = this.getConnectionInfo();
    if (connection && typeof connection.getBytesReceived === 'function') {
      return connection.getBytesReceived();
    }
    return 0; // Fallback if not available
  }

  /**
   * Convert bandwidth to quality category
   */
  private bandwidthToQuality(bandwidth: number): NetworkQuality['quality'] {
    if (bandwidth >= 20) return 'ultra';
    if (bandwidth >= 5) return 'fast';
    if (bandwidth >= 1) return 'medium';
    return 'slow';
  }

  /**
   * Add sample to history
   */
  private addSample(quality: NetworkQuality): void {
    this.samples.push(quality);

    // Keep only recent samples
    const maxAge = 5 * 60 * 1000; // 5 minutes
    const cutoff = Date.now() - maxAge;
    this.samples = this.samples.filter((sample) => sample.timestamp > cutoff);

    // Limit sample count
    if (this.samples.length > this.config.sampleCount * 2) {
      this.samples = this.samples.slice(-this.config.sampleCount);
    }
  }

  /**
   * Get averaged network quality from recent samples
   */
  getAverageQuality(): NetworkQuality {
    if (this.samples.length === 0) {
      return this.createDefaultQuality();
    }

    const recentSamples = this.samples.slice(-this.config.sampleCount);
    const avgBandwidth = recentSamples.reduce((sum, sample) => sum + sample.bandwidth, 0) / recentSamples.length;
    const avgLatency = recentSamples.reduce((sum, sample) => sum + sample.latency, 0) / recentSamples.length;

    return {
      bandwidth: avgBandwidth,
      latency: avgLatency,
      quality: this.bandwidthToQuality(avgBandwidth),
      timestamp: Date.now(),
    };
  }

  /**
   * Get last known quality
   */
  getLastKnownQuality(): NetworkQuality {
    return this.samples.length > 0 ? this.samples[this.samples.length - 1]! : this.createDefaultQuality();
  }

  /**
   * Create default quality for fallback
   */
  private createDefaultQuality(): NetworkQuality {
    return {
      bandwidth: 5, // Assume medium bandwidth
      latency: 100,
      quality: 'medium',
      timestamp: Date.now(),
    };
  }

  /**
   * Check if we should re-test network quality
   */
  shouldRetest(maxAge = 60000): boolean {
    const lastSample = this.getLastKnownQuality();
    return Date.now() - lastSample.timestamp > maxAge;
  }

  /**
   * Clear all samples
   */
  clearSamples(): void {
    this.samples = [];
  }
}

/**
 * Singleton network detector for global use
 */
export const networkDetector = new NetworkQualityDetector();

/**
 * Utility function to get current network quality
 */
export const getCurrentNetworkQuality = async (): Promise<NetworkQuality> => {
  return networkDetector.measureBandwidth();
};

/**
 * Utility function to check if network is fast enough for quality level
 */
export const isNetworkSufficient = (networkQuality: NetworkQuality, requiredBandwidth: number): boolean => {
  return networkQuality.bandwidth >= requiredBandwidth * 0.8; // 20% buffer
};
