/**
 * @fileoverview Authentication Cache Keys
 *
 * Cache key definitions for authentication-related React Query operations.
 * Follows the same pattern as user-management for consistency.
 */

import { BaseCacheKeyFactory, QueryKey } from '@musetrip360/query-foundation';

/**
 * Authentication cache keys
 */
export class AuthCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('auth');
  }

  currentUser(): QueryKey {
    return [this.prefix, 'currentUser'];
  }

  // Token management keys
  tokens(): QueryKey {
    return [this.prefix, 'tokens'];
  }

  refreshToken(): QueryKey {
    return [this.prefix, 'refreshToken'];
  }

  // Authentication state keys
  authState(): QueryKey {
    return [this.prefix, 'authState'];
  }

  permissions(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'permissions', userId] : [this.prefix, 'permissions'];
  }

  // OTP and verification keys
  otpStatus(email: string): QueryKey {
    return [this.prefix, 'otp', 'status', email];
  }

  verificationStatus(type: string, identifier: string): QueryKey {
    return [this.prefix, 'verification', type, identifier];
  }

  // Authentication history
  loginHistory(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'loginHistory', userId] : [this.prefix, 'loginHistory'];
  }

  // Device management
  devices(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'devices', userId] : [this.prefix, 'devices'];
  }

  // Security-related keys
  securityEvents(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'securityEvents', userId] : [this.prefix, 'securityEvents'];
  }

  // OAuth and external auth
  oauthProviders(): QueryKey {
    return [this.prefix, 'oauth', 'providers'];
  }

  oauthConnection(provider: string, userId?: string | number): QueryKey {
    return userId
      ? [this.prefix, 'oauth', 'connection', provider, userId]
      : [this.prefix, 'oauth', 'connection', provider];
  }
}

export const authCacheKeys = new AuthCacheKeys();
