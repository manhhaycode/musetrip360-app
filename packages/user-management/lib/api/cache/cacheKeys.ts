import { BaseCacheKeyFactory } from '@musetrip360/query-foundation';
import { QueryKey } from '@tanstack/react-query';

/**
 * User cache keys
 */
export class UserCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('users');
  }

  // User-specific keys
  profile(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'profile', userId] : [this.prefix, 'profile'];
  }

  favorites(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'favorites', userId] : [this.prefix, 'favorites'];
  }

  bookings(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'bookings', userId] : [this.prefix, 'bookings'];
  }

  tickets(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'tickets', userId] : [this.prefix, 'tickets'];
  }

  preferences(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'preferences', userId] : [this.prefix, 'preferences'];
  }

  history(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'history', userId] : [this.prefix, 'history'];
  }

  privileges(): QueryKey {
    return [this.prefix, 'privileges'];
  }

  roles(userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'roles', userId] : [this.prefix, 'roles'];
  }

  museumUsers(museumId: string): QueryKey {
    return [this.prefix, 'museumUsers', museumId];
  }
}

export const userCacheKeys = new UserCacheKeys();
