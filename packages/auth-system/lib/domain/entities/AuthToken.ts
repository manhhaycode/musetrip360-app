export class AuthToken {
  constructor(
    public readonly value: string,
    public readonly type: 'access' | 'refresh',
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly issuedAt: Date = new Date(),
    public readonly scope: string[] = [],
    public readonly deviceId?: string,
    public readonly isRevoked: boolean = false
  ) {}

  // Business methods
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isExpired() && !this.isRevoked;
  }

  isAccessToken(): boolean {
    return this.type === 'access';
  }

  isRefreshToken(): boolean {
    return this.type === 'refresh';
  }

  hasScope(scope: string): boolean {
    return this.scope.includes(scope);
  }

  hasAnyScope(scopes: string[]): boolean {
    return scopes.some((scope) => this.hasScope(scope));
  }

  timeToExpire(): number {
    return Math.max(0, this.expiresAt.getTime() - Date.now());
  }

  isNearExpiry(thresholdMinutes: number = 5): boolean {
    const thresholdMs = thresholdMinutes * 60 * 1000;
    return this.timeToExpire() <= thresholdMs;
  }

  // Factory methods
  static createAccessToken(
    value: string,
    userId: string,
    expiresAt: number,
    scope: string[] = [],
    deviceId?: string
  ): AuthToken {
    return new AuthToken(value, 'access', userId, new Date(expiresAt), new Date(), scope, deviceId);
  }

  static createRefreshToken(value: string, userId: string, expiresAt: number, deviceId?: string): AuthToken {
    return new AuthToken(value, 'refresh', userId, new Date(expiresAt), new Date(), [], deviceId);
  }

  // Update methods
  revoke(): AuthToken {
    return new AuthToken(
      this.value,
      this.type,
      this.userId,
      this.expiresAt,
      this.issuedAt,
      this.scope,
      this.deviceId,
      true // isRevoked
    );
  }

  refresh(newValue: string, newExpiresInSeconds: number): AuthToken {
    if (this.type !== 'refresh') {
      throw new Error('Only refresh tokens can be refreshed');
    }

    const newExpiresAt = new Date(Date.now() + newExpiresInSeconds * 1000);
    return new AuthToken(
      newValue,
      this.type,
      this.userId,
      newExpiresAt,
      new Date(), // new issuedAt
      this.scope,
      this.deviceId,
      false // reset revoked status
    );
  }
}
