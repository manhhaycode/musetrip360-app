export interface NetworkQuality {
  bandwidth: number;
  latency: number;
  quality: 'slow' | 'medium' | 'fast' | 'ultra';
  timestamp: number;
}

export class NetworkQualityDetector {
  async measureBandwidth(): Promise<NetworkQuality> {
    // Trả về giá trị mặc định cho mobile
    return {
      bandwidth: 5,
      latency: 100,
      quality: 'medium',
      timestamp: Date.now(),
    };
  }
  getAverageQuality(): NetworkQuality {
    return {
      bandwidth: 5,
      latency: 100,
      quality: 'medium',
      timestamp: Date.now(),
    };
  }
  getLastKnownQuality(): NetworkQuality {
    return {
      bandwidth: 5,
      latency: 100,
      quality: 'medium',
      timestamp: Date.now(),
    };
  }
  shouldRetest() {
    return false;
  }
  clearSamples() {}
}

export const networkDetector = new NetworkQualityDetector();

export const getCurrentNetworkQuality = async (): Promise<NetworkQuality> => {
  return networkDetector.measureBandwidth();
};

export const isNetworkSufficient = (networkQuality: NetworkQuality, requiredBandwidth: number): boolean => {
  return networkQuality.bandwidth >= requiredBandwidth * 0.8;
};
