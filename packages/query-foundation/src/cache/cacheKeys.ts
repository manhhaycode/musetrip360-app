import type { QueryKey } from '@tanstack/react-query';
import type { CacheKeyFactory } from '../types/query-types';

/**
 * Base cache key factory implementation
 */
abstract class BaseCacheKeyFactory implements CacheKeyFactory {
  protected prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  get all(): QueryKey {
    return [this.prefix];
  }

  lists(): QueryKey {
    return [this.prefix, 'lists'];
  }

  list(filters?: Record<string, any>): QueryKey {
    return filters ? [this.prefix, 'lists', filters] : [this.prefix, 'lists'];
  }

  details(): QueryKey {
    return [this.prefix, 'details'];
  }

  detail(id: string | number): QueryKey {
    return [this.prefix, 'details', id];
  }

  search(query: string, filters?: Record<string, any>): QueryKey {
    return filters ? [this.prefix, 'search', query, filters] : [this.prefix, 'search', query];
  }

  infinite(filters?: Record<string, any>): QueryKey {
    return filters ? [this.prefix, 'infinite', filters] : [this.prefix, 'infinite'];
  }
}

/**
 * Museum cache keys
 */
export class MuseumCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('museums');
  }

  // Museum-specific keys
  featured(): QueryKey {
    return [this.prefix, 'featured'];
  }

  nearby(latitude: number, longitude: number, radius: number = 10): QueryKey {
    return [this.prefix, 'nearby', { latitude, longitude, radius }];
  }

  byCategory(category: string): QueryKey {
    return [this.prefix, 'category', category];
  }

  artifacts(museumId: string | number): QueryKey {
    return [this.prefix, 'details', museumId, 'artifacts'];
  }

  virtualTours(museumId: string | number): QueryKey {
    return [this.prefix, 'details', museumId, 'virtual-tours'];
  }

  events(museumId: string | number): QueryKey {
    return [this.prefix, 'details', museumId, 'events'];
  }

  stats(museumId: string | number): QueryKey {
    return [this.prefix, 'details', museumId, 'stats'];
  }
}

/**
 * Event cache keys
 */
export class EventCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('events');
  }

  // Event-specific keys
  upcoming(): QueryKey {
    return [this.prefix, 'upcoming'];
  }

  featured(): QueryKey {
    return [this.prefix, 'featured'];
  }

  byDate(date: string): QueryKey {
    return [this.prefix, 'date', date];
  }

  byMuseum(museumId: string | number): QueryKey {
    return [this.prefix, 'museum', museumId];
  }

  byCategory(category: string): QueryKey {
    return [this.prefix, 'category', category];
  }

  tickets(eventId: string | number): QueryKey {
    return [this.prefix, 'details', eventId, 'tickets'];
  }

  attendance(eventId: string | number): QueryKey {
    return [this.prefix, 'details', eventId, 'attendance'];
  }

  calendar(year: number, month: number): QueryKey {
    return [this.prefix, 'calendar', year, month];
  }
}

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
}

/**
 * Authentication cache keys
 */
export class AuthCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('auth');
  }

  // Auth-specific keys
  currentUser(): QueryKey {
    return [this.prefix, 'current-user'];
  }

  permissions(): QueryKey {
    return [this.prefix, 'permissions'];
  }

  session(): QueryKey {
    return [this.prefix, 'session'];
  }

  refreshToken(): QueryKey {
    return [this.prefix, 'refresh-token'];
  }
}

/**
 * Artifact cache keys
 */
export class ArtifactCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('artifacts');
  }

  // Artifact-specific keys
  featured(): QueryKey {
    return [this.prefix, 'featured'];
  }

  byMuseum(museumId: string | number): QueryKey {
    return [this.prefix, 'museum', museumId];
  }

  byCollection(collectionId: string | number): QueryKey {
    return [this.prefix, 'collection', collectionId];
  }

  byCategory(category: string): QueryKey {
    return [this.prefix, 'category', category];
  }

  relatedTo(artifactId: string | number): QueryKey {
    return [this.prefix, 'related', artifactId];
  }

  media(artifactId: string | number): QueryKey {
    return [this.prefix, 'details', artifactId, 'media'];
  }

  models3D(artifactId: string | number): QueryKey {
    return [this.prefix, 'details', artifactId, '3d-models'];
  }
}

/**
 * Virtual tour cache keys
 */
export class VirtualTourCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('virtual-tours');
  }

  // Virtual tour-specific keys
  featured(): QueryKey {
    return [this.prefix, 'featured'];
  }

  byMuseum(museumId: string | number): QueryKey {
    return [this.prefix, 'museum', museumId];
  }

  nodes(tourId: string | number): QueryKey {
    return [this.prefix, 'details', tourId, 'nodes'];
  }

  assets(tourId: string | number): QueryKey {
    return [this.prefix, 'details', tourId, 'assets'];
  }

  analytics(tourId: string | number): QueryKey {
    return [this.prefix, 'details', tourId, 'analytics'];
  }

  progress(tourId: string | number, userId?: string | number): QueryKey {
    return userId ? [this.prefix, 'progress', tourId, userId] : [this.prefix, 'progress', tourId];
  }
}

/**
 * Search cache keys
 */
export class SearchCacheKeys extends BaseCacheKeyFactory {
  constructor() {
    super('search');
  }

  // Search-specific keys
  suggestions(query: string): QueryKey {
    return [this.prefix, 'suggestions', query];
  }

  global(query: string, filters?: Record<string, any>): QueryKey {
    return filters ? [this.prefix, 'global', query, filters] : [this.prefix, 'global', query];
  }

  museums(query: string, filters?: Record<string, any>): QueryKey {
    return filters ? [this.prefix, 'museums', query, filters] : [this.prefix, 'museums', query];
  }

  events(query: string, filters?: Record<string, any>): QueryKey {
    return filters ? [this.prefix, 'events', query, filters] : [this.prefix, 'events', query];
  }

  artifacts(query: string, filters?: Record<string, any>): QueryKey {
    return filters ? [this.prefix, 'artifacts', query, filters] : [this.prefix, 'artifacts', query];
  }

  recentSearches(): QueryKey {
    return [this.prefix, 'recent'];
  }

  popularSearches(): QueryKey {
    return [this.prefix, 'popular'];
  }
}

/**
 * Centralized cache key instances
 */
export const cacheKeys = {
  museums: new MuseumCacheKeys(),
  events: new EventCacheKeys(),
  users: new UserCacheKeys(),
  auth: new AuthCacheKeys(),
  artifacts: new ArtifactCacheKeys(),
  virtualTours: new VirtualTourCacheKeys(),
  search: new SearchCacheKeys(),
} as const;

/**
 * Utility function to get all cache keys for invalidation
 */
export function getAllCacheKeys(): QueryKey[] {
  return Object.values(cacheKeys).map((factory) => factory.all);
}

/**
 * Utility function to create custom cache keys
 */
export function createCacheKey(prefix: string, ...parts: (string | number | object)[]): QueryKey {
  return [prefix, ...parts];
}
