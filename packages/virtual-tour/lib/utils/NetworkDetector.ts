/**
 * NetworkDetector
 *
 * Detects network bandwidth and quality for adaptive cubemap loading.
 * Uses Navigator Connection API with fallback bandwidth testing.
 */

import { NetworkQuality, NetworkInfo, NetworkTestConfig, classifyNetworkQuality, NETWORK_THRESHOLDS } from '../types';

export interface NetworkDetectorOptions {
  /** Test configuration */
  testConfig?: Partial<NetworkTestConfig>;
  /** Auto-retry interval in milliseconds */
  retryInterval?: number;
  /** Maximum test attempts */
  maxAttempts?: number;
  /** Enable console logging */
  enableLogging?: boolean;
}

export class NetworkDetector {
  private options: Required<NetworkDetectorOptions>;
  private currentInfo: NetworkInfo;
  private testHistory: number[] = [];
  private lastTestTime = 0;
  private retryTimeoutId?: number;

  // Default test configuration
  private readonly defaultTestConfig: NetworkTestConfig = {
    testImageUrl:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=', // 1x1 JPEG
    testImageSize: 631, // Size of the base64 image above
    timeout: 10000, // 10 seconds
    attempts: 3,
    testInterval: 60000, // 1 minute
  };

  constructor(options: NetworkDetectorOptions = {}) {
    this.options = {
      testConfig: {},
      retryInterval: 300000, // 5 minutes
      maxAttempts: 3,
      enableLogging: false,
      ...options,
    };

    // Merge test config with defaults
    this.options.testConfig = {
      ...this.defaultTestConfig,
      ...this.options.testConfig,
    };

    // Initialize with default values
    this.currentInfo = {
      quality: 'medium',
      bandwidth: 5.0,
      lastTested: new Date(),
    };

    // Start initial detection
    this.detectNetwork();
  }

  /**
   * Get current network information
   */
  getCurrentNetworkInfo(): NetworkInfo {
    return { ...this.currentInfo };
  }

  /**
   * Force a new network quality test
   */
  async testNetworkQuality(): Promise<NetworkInfo> {
    const now = Date.now();

    // Prevent too frequent testing
    if (now - this.lastTestTime < (this.options.testConfig.testInterval || 60000)) {
      return this.currentInfo;
    }

    this.lastTestTime = now;

    try {
      // Try Navigator Connection API first
      const connectionInfo = this.getConnectionAPIInfo();
      if (connectionInfo.bandwidth !== undefined) {
        this.updateNetworkInfo(connectionInfo);
        return this.currentInfo;
      }

      // Fallback to bandwidth test
      const bandwidth = await this.performBandwidthTest();
      if (bandwidth > 0) {
        const quality = classifyNetworkQuality(bandwidth);
        this.updateNetworkInfo({
          quality,
          bandwidth,
          lastTested: new Date(),
        });
      }
    } catch (error) {
      if (this.options.enableLogging) {
        console.warn('Network test failed:', error);
      }

      // Use conservative defaults on error
      this.updateNetworkInfo({
        quality: 'slow',
        bandwidth: 1.0,
        lastTested: new Date(),
      });
    }

    return this.currentInfo;
  }

  /**
   * Get network info from Navigator Connection API
   */
  private getConnectionAPIInfo(): Partial<NetworkInfo> {
    const connection =
      (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    if (!connection) {
      return {};
    }

    const info: Partial<NetworkInfo> = {
      connectionType: connection.type,
      effectiveType: connection.effectiveType,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };

    // Estimate bandwidth from effective type
    if (connection.effectiveType) {
      switch (connection.effectiveType) {
        case 'slow-2g':
          info.bandwidth = 0.5;
          info.quality = 'slow';
          break;
        case '2g':
          info.bandwidth = 1.0;
          info.quality = 'slow';
          break;
        case '3g':
          info.bandwidth = 3.0;
          info.quality = 'medium';
          break;
        case '4g':
          info.bandwidth = 15.0;
          info.quality = 'fast';
          break;
        default:
          info.bandwidth = 5.0;
          info.quality = 'medium';
      }
    }

    // Use downlink if available (Chrome)
    if (connection.downlink !== undefined) {
      info.bandwidth = connection.downlink;
      info.quality = classifyNetworkQuality(connection.downlink);
    }

    if (info.bandwidth !== undefined) {
      info.lastTested = new Date();
    }

    return info;
  }

  /**
   * Perform bandwidth test using image download
   */
  private async performBandwidthTest(): Promise<number> {
    const config = this.options.testConfig;
    let totalBandwidth = 0;
    let successfulTests = 0;

    for (let attempt = 0; attempt < (config.attempts || 3); attempt++) {
      try {
        const bandwidth = await this.singleBandwidthTest();
        if (bandwidth > 0) {
          totalBandwidth += bandwidth;
          successfulTests++;
          this.testHistory.push(bandwidth);

          // Keep only last 10 results
          if (this.testHistory.length > 10) {
            this.testHistory.shift();
          }
        }
      } catch (error) {
        if (this.options.enableLogging) {
          console.warn(`Bandwidth test attempt ${attempt + 1} failed:`, error);
        }
      }

      // Wait between attempts
      if (attempt < (config.attempts || 3) - 1) {
        await this.sleep(1000);
      }
    }

    if (successfulTests === 0) {
      throw new Error('All bandwidth tests failed');
    }

    // Return average of successful tests
    return totalBandwidth / successfulTests;
  }

  /**
   * Perform single bandwidth test
   */
  private async singleBandwidthTest(): Promise<number> {
    const config = this.options.testConfig;
    const testUrl = config.testImageUrl || this.defaultTestConfig.testImageUrl!;
    const imageSize = config.testImageSize || this.defaultTestConfig.testImageSize!;
    const timeout = config.timeout || this.defaultTestConfig.timeout!;

    return new Promise((resolve, reject) => {
      const startTime = performance.now();
      const img = new Image();

      // eslint-disable-next-line prefer-const
      let timeoutId: number | undefined;

      img.onload = () => {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // Convert to seconds
        const bandwidthMbps = (imageSize * 8) / (duration * 1024 * 1024); // Convert to Mbps

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (this.options.enableLogging) {
          console.log(`Bandwidth test: ${bandwidthMbps.toFixed(2)} Mbps (${duration.toFixed(3)}s)`);
        }

        resolve(bandwidthMbps);
      };

      img.onerror = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        reject(new Error('Image load failed'));
      };

      // Set timeout
      timeoutId = window.setTimeout(() => {
        reject(new Error('Bandwidth test timeout'));
      }, timeout);

      // Add cache buster to prevent caching
      const cacheBuster = `?t=${Date.now()}&r=${Math.random()}`;
      img.src = testUrl + cacheBuster;
    });
  }

  /**
   * Update network information and notify
   */
  private updateNetworkInfo(updates: Partial<NetworkInfo>): void {
    this.currentInfo = {
      ...this.currentInfo,
      ...updates,
    };

    if (this.options.enableLogging) {
      console.log('Network info updated:', this.currentInfo);
    }

    // Schedule next test
    this.scheduleNextTest();
  }

  /**
   * Schedule next automatic test
   */
  private scheduleNextTest(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.retryTimeoutId = window.setTimeout(() => {
      this.detectNetwork();
    }, this.options.retryInterval);
  }

  /**
   * Initial network detection
   */
  private async detectNetwork(): Promise<void> {
    try {
      await this.testNetworkQuality();
    } catch (error) {
      if (this.options.enableLogging) {
        console.warn('Initial network detection failed:', error);
      }
    }
  }

  /**
   * Get average bandwidth from test history
   */
  getAverageBandwidth(): number {
    if (this.testHistory.length === 0) {
      return this.currentInfo.bandwidth || 5.0;
    }

    const sum = this.testHistory.reduce((a, b) => a + b, 0);
    return sum / this.testHistory.length;
  }

  /**
   * Check if network is sufficient for given quality
   */
  isNetworkSufficient(requiredQuality: NetworkQuality): boolean {
    const currentBandwidth = this.currentInfo.bandwidth || 0;
    const threshold = NETWORK_THRESHOLDS[requiredQuality];

    return currentBandwidth >= threshold.min;
  }

  /**
   * Get recommended quality for current network
   */
  getRecommendedQuality(): NetworkQuality {
    return this.currentInfo.quality;
  }

  /**
   * Utility sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = undefined;
    }
  }
}
