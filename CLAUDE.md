# MuseTrip360 Project Analysis

## Project Overview
MuseTrip360 is a comprehensive digital platform for historical museums that enables virtual exhibitions, 3D artifact viewing, and intelligent visitor interactions. It's a multi-app ecosystem built with modern web technologies.

## Architecture & Technology Stack

### Frontend
- **Framework**: Next.js 15+ (visitor-portal), React 19+ with Vite (museum-portal, admin-portal)
- **Mobile**: React Native with Expo
- **Styling**: TailwindCSS 4
- **3D Visualization**: Three.js (planned)
- **State Management**: Zustand, TanStack Query
- **Build System**: Turborepo (monorepo), PNPM

### Backend (Planned)
- **API**: ASP.NET Core 8
- **Databases**: PostgreSQL, Redis, Vector databases (Qdrant, pgvector, MongoDB)
- **AI**: Integration with LLMs (deepseek-r1, llama, gemma3)

## Applications (`apps/`)

### 1. visitor-portal (Next.js)
- **Purpose**: Public-facing website for museum visitors
- **Tech**: Next.js 15, React 19, TailwindCSS 4
- **Features**: Browse exhibitions, search museums, authentication, user profiles
- **Dependencies**: auth-system, user-management, ui-core, query-foundation, infras

### 2. museum-portal (Vite + React)
- **Purpose**: Museum staff management application
- **Tech**: React 19, Vite, React Router 7
- **Features**: Museum management, exhibition creation, content management
- **Dependencies**: museum-management, auth-system, user-management, ui-core, query-foundation, infras

### 3. admin-portal (Vite + React)
- **Purpose**: System administration interface
- **Tech**: React 19, Vite
- **Features**: System-wide administration, user management
- **Dependencies**: ui-core, infras (minimal dependencies for admin functions)

### 4. mobile (React Native + Expo)
- **Purpose**: Mobile application for visitors
- **Tech**: React Native 0.79, Expo 53, React 19
- **Features**: Mobile museum experience, AR/VR capabilities
- **Dependencies**: Shared eslint-config and tsconfig only

## Shared Packages (`packages/`)

### Core Infrastructure
1. **infras**: Environment configuration, types, utilities
2. **query-foundation**: TanStack Query setup, API client, caching, offline functionality
3. **ui-core**: Comprehensive UI component library (50+ components) based on Radix UI + TailwindCSS

### Domain Packages
4. **auth-system**: Complete authentication system (login, register, OAuth, state management)
5. **user-management**: User profiles, roles, permissions management
6. **museum-management**: Museum data, exhibitions, artifacts management
7. **artifact-management**: Artifact-specific operations and management
8. **event-management**: Cultural events planning and management

### Configuration
9. **eslint-config**: Shared ESLint configurations for different environments
10. **tsconfig**: Shared TypeScript configurations for different project types

## Code Conventions & Import Rules

### Package Import Strategy for Tree-Shaking
Based on the auth-system package structure, follow these import patterns:

#### ✅ Preferred: Specific Domain Imports
```typescript
// Import specific domains for better tree-shaking
import { useAuthHook } from '@musetrip360/auth-system/api'
import { AuthProvider } from '@musetrip360/auth-system/state'
import { LoginForm } from '@musetrip360/auth-system/ui'
import { authSchema } from '@musetrip360/auth-system/validation'
```

#### ❌ Avoid: Full Package Imports
```typescript
// Avoid importing everything - poor tree-shaking
import { useAuthHook, AuthProvider, LoginForm } from '@musetrip360/auth-system'
```

### Package Structure Pattern
Each domain package should follow this modular structure:
```
packages/{domain}/lib/
├── api/           # API endpoints, hooks, cache keys
├── state/         # Context providers, stores, hooks
├── ui/           # React components
├── types/        # TypeScript type definitions
├── validation/   # Zod schemas
└── utils/        # Domain-specific utilities
```

### Export Strategy
- **Domain-level exports**: Each folder exports through `index.ts`
- **Specific imports**: Packages should support `/api`, `/state`, `/ui` sub-imports
- **Tree-shaking friendly**: Avoid barrel exports when possible

## Key Features & Patterns

### Monorepo Structure
- **Build System**: Turborepo for parallel builds and caching
- **Package Manager**: PNPM with workspace protocol
- **Dependency Management**: Consistent versions across packages

### State Management
- **Global State**: Zustand stores in domain packages
- **Server State**: TanStack Query with offline persistence
- **Context Providers**: React Context for specific domains

### UI Architecture
- **Design System**: Comprehensive component library with variants
- **Theme Support**: Dark/light mode with next-themes
- **Responsive Design**: Mobile-first TailwindCSS implementation
- **Accessibility**: Radix UI primitives for a11y compliance

### API Integration
- **HTTP Client**: Axios with interceptors
- **Caching**: TanStack Query with IDB persistence
- **Offline Support**: Automatic retry and background sync
- **Type Safety**: Zod schemas for validation

### Authentication Flow
- **Multi-provider**: Email/password, OAuth (Google)
- **Token Management**: JWT with refresh token rotation
- **Protected Routes**: Role-based access control
- **Session Persistence**: Cookies and local storage

## Development Workflow

### Scripts
- `pnpm dev`: Start all applications in parallel
- `pnpm build`: Build all packages and applications
- `pnpm lint`: Run linting across all packages
- `pnpm test`: Run tests across all packages

### Code Quality
- **Linting**: ESLint 9 with shared configurations
- **Formatting**: Prettier for consistent code style
- **Type Safety**: TypeScript 5 with strict mode
- **Pre-commit**: Husky + lint-staged for quality gates

### Testing Strategy
- **Unit Tests**: Vitest for package testing
- **Integration**: TanStack Query testing utilities
- **Type Testing**: TypeScript compiler checks

## Current Branch: feat/museum-portal-manage-museum
Working on museum portal management features, specifically museum management functionality.

## Key Architectural Decisions

1. **Package Isolation**: Each domain has its own package with clear boundaries
2. **Dependency Injection**: Core infrastructure shared via workspace dependencies
3. **Type Safety**: End-to-end TypeScript with Zod validation
4. **Performance**: Code splitting, lazy loading, and efficient caching
5. **Scalability**: Modular architecture supporting multiple museum tenants
6. **Developer Experience**: Hot reloading, type checking, and comprehensive tooling

## Build Commands
- **Lint**: `pnpm lint` - Run ESLint across all packages
- **Type Check**: `pnpm build` includes TypeScript compilation
- **Test**: `pnpm test` - Run Vitest across packages