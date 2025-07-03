export interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  colorDepth: number;
  pixelRatio: number;
  hardwareConcurrency: number;
  maxTouchPoints: number;
  plugins: string[];
  canvas?: string;
  webgl?: string;
  audio?: string;
}

export class DeviceFingerprint {
  private readonly _fingerprint: string;
  private readonly _deviceInfo: DeviceInfo;
  private readonly _createdAt: Date;

  constructor(deviceInfo: DeviceInfo) {
    this._deviceInfo = { ...deviceInfo };
    this._fingerprint = this.generateFingerprint(deviceInfo);
    this._createdAt = new Date();
  }

  get fingerprint(): string {
    return this._fingerprint;
  }

  get deviceInfo(): Readonly<DeviceInfo> {
    return this._deviceInfo;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  // Business methods
  private generateFingerprint(info: DeviceInfo): string {
    // Combine various device attributes to create a unique fingerprint
    const components = [
      info.userAgent,
      info.screenResolution,
      info.timezone,
      info.language,
      info.platform,
      info.cookiesEnabled.toString(),
      info.doNotTrack.toString(),
      info.colorDepth.toString(),
      info.pixelRatio.toString(),
      info.hardwareConcurrency.toString(),
      info.maxTouchPoints.toString(),
      info.plugins.join(','),
      info.canvas || '',
      info.webgl || '',
      info.audio || '',
    ];

    // Create a hash of the combined components
    return this.simpleHash(components.join('|'));
  }

  private simpleHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(16);
  }

  isMobile(): boolean {
    const mobileUserAgents = ['Mobile', 'Android', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'IEMobile'];
    return mobileUserAgents.some((agent) => this._deviceInfo.userAgent.includes(agent));
  }

  isTablet(): boolean {
    const tabletUserAgents = ['iPad', 'Android'];
    const isTabletUA = tabletUserAgents.some((agent) => this._deviceInfo.userAgent.includes(agent));

    // Additional heuristics for tablet detection
    const hasTouch = this._deviceInfo.maxTouchPoints > 0;
    const isLargeScreen = this.getScreenSize() > 1000000; // > 1MP

    return isTabletUA && hasTouch && isLargeScreen;
  }

  isDesktop(): boolean {
    return !this.isMobile() && !this.isTablet();
  }

  getBrowser(): string {
    const ua = this._deviceInfo.userAgent;

    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    if (ua.includes('Internet Explorer')) return 'Internet Explorer';

    return 'Unknown';
  }

  getOperatingSystem(): string {
    const ua = this._deviceInfo.userAgent;
    const platform = this._deviceInfo.platform;

    if (ua.includes('Windows') || platform.includes('Win')) return 'Windows';
    if (ua.includes('Mac') || platform.includes('Mac')) return 'macOS';
    if (ua.includes('Linux') || platform.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';

    return 'Unknown';
  }

  getScreenSize(): number {
    const resolution = this._deviceInfo.screenResolution;
    const parts = resolution.split('x');
    const width = parseInt(parts[0] || '0', 10);
    const height = parseInt(parts[1] || '0', 10);
    return width * height;
  }

  isHighDPI(): boolean {
    return this._deviceInfo.pixelRatio > 1;
  }

  supportsTouch(): boolean {
    return this._deviceInfo.maxTouchPoints > 0;
  }

  hasCanvas(): boolean {
    return !!this._deviceInfo.canvas;
  }

  hasWebGL(): boolean {
    return !!this._deviceInfo.webgl;
  }

  hasAudio(): boolean {
    return !!this._deviceInfo.audio;
  }

  isBot(): boolean {
    const botUserAgents = [
      'bot',
      'crawler',
      'spider',
      'scraper',
      'headless',
      'phantom',
      'selenium',
      'webdriver',
      'curl',
      'wget',
    ];

    const ua = this._deviceInfo.userAgent.toLowerCase();
    return botUserAgents.some((bot) => ua.includes(bot));
  }

  isSuspicious(): boolean {
    // Various heuristics to detect suspicious devices
    const checks = [
      this.isBot(),
      this._deviceInfo.plugins.length === 0, // No plugins could indicate headless browser
      this._deviceInfo.language === '', // Missing language
      !this._deviceInfo.canvas && !this._deviceInfo.webgl, // No graphics capabilities
      this._deviceInfo.hardwareConcurrency === 1, // Single core (unusual for modern devices)
    ];

    // Consider suspicious if multiple red flags
    return checks.filter(Boolean).length >= 2;
  }

  getDeviceCategory(): 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown' {
    if (this.isBot()) return 'bot';
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    if (this.isDesktop()) return 'desktop';
    return 'unknown';
  }

  getSimilarityScore(other: DeviceFingerprint): number {
    // Calculate similarity between two device fingerprints
    let score = 0;
    let totalChecks = 0;

    // Compare various attributes
    const comparisons = [
      { weight: 3, same: this.getBrowser() === other.getBrowser() },
      { weight: 3, same: this.getOperatingSystem() === other.getOperatingSystem() },
      { weight: 2, same: this._deviceInfo.screenResolution === other._deviceInfo.screenResolution },
      { weight: 2, same: this._deviceInfo.timezone === other._deviceInfo.timezone },
      { weight: 1, same: this._deviceInfo.language === other._deviceInfo.language },
      { weight: 1, same: this._deviceInfo.colorDepth === other._deviceInfo.colorDepth },
      { weight: 1, same: this._deviceInfo.pixelRatio === other._deviceInfo.pixelRatio },
      { weight: 1, same: this._deviceInfo.hardwareConcurrency === other._deviceInfo.hardwareConcurrency },
    ];

    for (const comparison of comparisons) {
      totalChecks += comparison.weight;
      if (comparison.same) {
        score += comparison.weight;
      }
    }

    return score / totalChecks;
  }

  // Equality
  equals(other: DeviceFingerprint): boolean {
    return this._fingerprint === other._fingerprint;
  }

  toString(): string {
    return this._fingerprint;
  }

  toJSON(): object {
    return {
      fingerprint: this._fingerprint,
      deviceInfo: this._deviceInfo,
      createdAt: this._createdAt,
      category: this.getDeviceCategory(),
      browser: this.getBrowser(),
      os: this.getOperatingSystem(),
    };
  }

  // Factory methods
  static fromBrowserAPI(): DeviceFingerprint {
    // This would be called in browser environment to collect device info
    const deviceInfo: DeviceInfo = {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === '1',
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      plugins: Array.from(navigator.plugins).map((p) => p.name),
      // Canvas, WebGL, and Audio fingerprinting would be more complex
      // and would need additional implementation
    };

    return new DeviceFingerprint(deviceInfo);
  }

  static fromServerRequest(headers: Record<string, string>): DeviceFingerprint {
    // Create device fingerprint from server-side request headers
    const deviceInfo: DeviceInfo = {
      userAgent: headers['user-agent'] || '',
      screenResolution: '0x0', // Not available server-side
      timezone: headers['x-timezone'] || 'UTC',
      language: headers['accept-language']?.split(',')[0] || 'en',
      platform: '', // Extract from user-agent if needed
      cookiesEnabled: true, // Assume true if cookies are present
      doNotTrack: headers['dnt'] === '1',
      colorDepth: 24, // Default assumption
      pixelRatio: 1, // Default assumption
      hardwareConcurrency: 1, // Default assumption
      maxTouchPoints: 0, // Default assumption
      plugins: [], // Not available server-side
    };

    return new DeviceFingerprint(deviceInfo);
  }

  static isValid(deviceInfo: DeviceInfo): boolean {
    // Validate that essential device info is present
    return !!(deviceInfo.userAgent && deviceInfo.language && deviceInfo.timezone);
  }
}
