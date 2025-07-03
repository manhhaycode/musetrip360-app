# @musetrip360/auth-management

Frontend authentication management package for MuseTrip360 platform.

## Features

- **Frontend-focused**: Designed for client-side authentication workflows
- **Type-safe**: Full TypeScript support with comprehensive type definitions
- **API Integration**: Clean abstraction for backend authentication APIs
- **Multiple Auth Types**: Email, Google, Facebook, Firebase, Phone authentication
- **Token Management**: Secure token storage and automatic refresh
- **Session Handling**: Device fingerprinting and session management
- **Validation**: Client-side validation for emails, passwords, phone numbers
- **Modular Design**: Import only what you need to minimize bundle size

## Installation

```bash
pnpm add @musetrip360/auth-management
```

## Basic Usage

### Authentication Service

```typescript
import { AuthService, AuthEndpoints, LocalStorageTokenStorage, TokenService } from '@musetrip360/auth-management';

// Set up API client
const authAPI = new AuthEndpoints({
  baseURL: 'https://api.musetrip360.com',
  timeout: 10000,
});

// Set up token storage
const tokenStorage = new LocalStorageTokenStorage();
const tokenService = new TokenService(tokenStorage);

// Create auth service
const authService = new AuthService(authAPI);

// Register with email
try {
  const result = await authService.registerWithEmail('user@example.com', 'securePassword123', 'John Doe');

  // Store tokens
  tokenService.setTokens(result.accessToken, result.refreshToken, result.expiresIn);

  console.log('User registered:', result.user);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Login with email
try {
  const result = await authService.loginWithEmail('user@example.com', 'securePassword123');

  tokenService.setTokens(result.accessToken, result.refreshToken, result.expiresIn);

  console.log('User logged in:', result.user);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Client-side Validation

```typescript
import { AuthService } from '@musetrip360/auth-management';

const authService = new AuthService(authAPI);

// Validate email
const emailValidation = authService.validateEmail('user@example.com');
if (!emailValidation.isValid) {
  console.log('Email errors:', emailValidation.errors);
}

// Validate password
const passwordValidation = authService.validatePassword('myPassword123');
if (!passwordValidation.isValid) {
  console.log('Password errors:', passwordValidation.errors);
  console.log('Password strength:', passwordValidation.strength);
}

// Validate phone number
const phoneValidation = authService.validatePhoneNumber('+1234567890');
if (phoneValidation.isValid) {
  console.log('Formatted phone:', phoneValidation.formatted);
}
```

### Token Management

```typescript
import { TokenService, LocalStorageTokenStorage } from '@musetrip360/auth-management';

const tokenStorage = new LocalStorageTokenStorage();
const tokenService = new TokenService(tokenStorage);

// Check token validity
if (tokenService.hasValidToken()) {
  console.log('User is authenticated');

  // Get user info from token
  const userId = tokenService.getUserIdFromToken();
  const roles = tokenService.getUserRolesFromToken();
  const permissions = tokenService.getUserPermissionsFromToken();

  console.log('User ID:', userId);
  console.log('Roles:', roles);
  console.log('Permissions:', permissions);
}

// Set up automatic token refresh
const cleanup = tokenService.scheduleTokenRefresh(async () => {
  const refreshToken = tokenService.getRefreshToken();
  const userId = tokenService.getUserIdFromToken();

  if (refreshToken && userId) {
    const result = await authService.refreshToken(refreshToken, userId);
    tokenService.setTokens(result.accessToken, result.refreshToken, result.expiresIn);
  }
});

// Clean up when component unmounts
// cleanup();
```

### Session Management

```typescript
import { SessionService, LocalStorageSessionStorage } from '@musetrip360/auth-management';

const sessionStorage = new LocalStorageSessionStorage();
const sessionService = new SessionService(sessionStorage);

// Create session after login
const deviceFingerprint = sessionService.generateDeviceFingerprint();
const session = sessionService.createSession('user123', deviceFingerprint.fingerprint, {
  rememberMe: true,
  sessionTimeout: 24 * 60 * 60, // 24 hours
  checkActivity: true,
});

// Monitor session
const sessionInfo = sessionService.getSessionInfo();
console.log('Session valid:', sessionInfo.isValid);
console.log('Time until expiry:', sessionInfo.timeUntilExpiry);

// Handle session timeout
const unsubscribe = sessionService.onSessionTimeout(() => {
  console.log('Session expired, redirecting to login...');
  // Redirect to login page
});
```

## Subpath Imports

To minimize bundle size, import only what you need:

```typescript
// Import specific modules
import { User } from '@musetrip360/auth-management/domain';
import { AuthEndpoints } from '@musetrip360/auth-management/api';
import { AuthTypeEnum } from '@musetrip360/auth-management/types';

// Or import from main entry
import { AuthService, TokenService, SessionService } from '@musetrip360/auth-management';
```

## API Configuration

Configure the API client for different environments:

```typescript
import { createAuthEndpoints, defaultConfigs } from '@musetrip360/auth-management/api';

// Use default configurations
const authAPI = createAuthEndpoints(defaultConfigs.production);

// Or create custom configuration
const authAPI = createAuthEndpoints({
  baseURL: 'https://my-api.com/api',
  timeout: 15000,
  headers: {
    'X-API-Version': 'v1',
  },
});
```

## OAuth Integration

```typescript
// Get OAuth URLs
const googleUrl = authService.getGoogleAuthUrl('https://myapp.com/auth/callback', 'random-state-string');

const facebookUrl = authService.getFacebookAuthUrl('https://myapp.com/auth/callback', 'random-state-string');

// Handle OAuth callback
const result = await authService.loginWithGoogle('auth-code-from-callback', 'state-string');
```

## Error Handling

The package provides detailed error messages:

```typescript
try {
  await authService.loginWithEmail('invalid-email', 'weak-password');
} catch (error) {
  // Error messages are user-friendly and detailed
  console.error(error.message);
  // Example: "Password is too weak: Add uppercase letters, Add numbers"
}
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import type {
  User,
  AuthResult,
  LoginOptions,
  RegisterOptions,
  AuthResponse,
  LoginReq,
  RegisterReq,
} from '@musetrip360/auth-management';
```

## Security Features

- **Device Fingerprinting**: Detect suspicious login attempts
- **Password Strength Validation**: Comprehensive password security checks
- **Token Security**: Automatic token refresh and secure storage options
- **Session Management**: Track device sessions and detect anomalies
- **Input Validation**: Prevent injection attacks and validate all inputs

## Contributing

This package is part of the MuseTrip360 monorepo. Please follow the established patterns and coding standards.

## License

MIT
