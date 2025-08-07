## PLEASE FOCUS!!!!

**MANDATORY**: ALL PROMPT MUST FOCUS THIS RULE

- Be brutally honest, don't be a yes man.
- If I am wrong, point it out bluntly.
- I need honest feedback on my code.

**BEFORE EVERY TOOL CALL**: Verify you're following the tool usage guidelines section:

- Exploration/Context: Use Serena semantic tools
- Implementation: Use Claude Code direct file tools (Edit, MultiEdit, Write), using the context provide by Serena
- Planning: Use TodoWrite for complex tasks

**VIOLATION CHECK**: If using Serena editing tools, confirm it's specifically requested or exploratory only.

## PLEASE FOCUS!!!!

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

### Backend

- **API**: ASP.NET Core 8 (deployed separately)
- **Databases**: PostgreSQL, Redis, Vector databases (Qdrant, pgvector, MongoDB)
- **AI**: Integration with LLMs (deepseek-r1, llama, gemma3)
- **API Documentation**: OpenAPI 3.0 specification available at `/swagger.json`

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
import { useAuthHook } from '@musetrip360/auth-system/api';
import { AuthProvider } from '@musetrip360/auth-system/state';
import { LoginForm } from '@musetrip360/auth-system/ui';
import { authSchema } from '@musetrip360/auth-system/validation';
```

#### ❌ Avoid: Full Package Imports

```typescript
// Avoid importing everything - poor tree-shaking
import { useAuthHook, AuthProvider, LoginForm } from '@musetrip360/auth-system';
```

### Package Structure Pattern

**MANDATORY**: All new domain packages MUST follow this standardized structure:

```
packages/{domain}/lib/
├── api/           # Data Access Layer
│   ├── cache/     # Cache keys & invalidation strategies
│   ├── endpoints/ # HTTP endpoint classes & methods
│   ├── hooks/     # React Query hooks for data fetching
│   └── index.ts   # Public API exports
├── state/         # State Management Layer
│   ├── context/   # React Context providers & complex state
│   ├── hooks/     # State management hooks
│   ├── store/     # Zustand stores for global state
│   └── index.ts   # State exports
├── ui/            # Presentation Layer
│   ├── components/ # React components for the domain
│   └── index.ts   # UI component exports
├── types/         # Type Definitions
│   └── index.ts   # TypeScript interfaces, enums, types
├── validation/    # Data Validation
│   ├── schemas.ts # Zod validation schemas
│   └── index.ts   # Validation exports
├── utils/         # Domain Utilities
│   └── index.ts   # Domain-specific utility functions
└── index.ts       # Main package export (barrel file)
```

**Structure Guidelines**:

- **Clean Architecture**: Each layer has single responsibility
- **Dependency Direction**: UI → State → API → Types
- **Testability**: Each layer can be tested in isolation
- **Consistency**: Same pattern across all domain packages
- **Tree-shaking**: Granular imports via `/api`, `/state`, `/ui`

**Apply this structure to**:

- ✅ **museum-management**
- ✅ **user-management**
- ✅ **event-management**
- ✅ **artifact-management**
- ✅ **Any new domain packages**

**Do NOT apply to**:

- ❌ **infras** (infrastructure utilities)
- ❌ **ui-core** (component library)
- ❌ **query-foundation** (infrastructure layer)
- ❌ **eslint-config** (configuration)
- ❌ **tsconfig** (configuration)

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

## API Documentation

The backend API is fully documented using OpenAPI 3.0 specification. The complete API documentation is available in the repository at `/swagger.json`. This includes:

### API Endpoints Overview

- **Authentication**: `/api/v1/auth/*` - Registration, login, OAuth (Google), token management
- **Museums**: `/api/v1/museums/*` - Museum CRUD, requests, policies, admin functions
- **Artifacts**: `/api/v1/artifacts/*` - Artifact management, museum-specific operations
- **Events**: `/api/v1/events/*` - Event management, booking, admin approval workflow
- **Users**: `/api/v1/users/*` - User management, profiles, role assignments
- **Messaging**: `/api/v1/messaging/*` - Real-time messaging, notifications
- **Search**: `/api/v1/search/*` - Advanced search with filters and aggregations
- **File Upload**: `/api/v1/upload` - Media file upload functionality
- **Tours**: `/api/v1/tour-contents/*` - Tour content management
- **Roles & Permissions**: `/api/v1/rolebase/*` - RBAC system management

### Key Schema Types

- **DTOs**: Create, Update, Request patterns for all entities
- **Enums**: Status types, event types, policy types, notification targets
- **Authentication**: Multi-provider auth support (Email, Google, Firebase)
- **Pagination**: Consistent pagination across all list endpoints
- **UUID**: All entities use UUID primary keys
- **Metadata**: Flexible metadata fields for extensibility

### API Patterns

- **RESTful**: Standard HTTP methods and status codes
- **Versioning**: All endpoints prefixed with `/api/v1/`
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Security**: Bearer token authentication, role-based access control
- **File Upload**: Multipart form data support for media uploads

**Reference**: Complete API specification available at `./swagger.json`

## Tool Usage Guidelines

### Code Exploration & Understanding

- **Primary approach**: Use Serena's semantic tools (`get_symbols_overview`, `find_symbol`, `search_for_pattern`) for efficient code exploration
- **Avoid**: Reading entire files unless absolutely necessary - use targeted symbol reading instead
- **Pattern**: Overview → Symbol search → Targeted reading → Implementation

### Task Planning & Management

- **TodoWrite**: Use for complex multi-step tasks requiring planning and progress tracking
- **When to use**: Tasks with 3+ steps, user-provided task lists, or complex implementations
- **Best practice**: Create todos before starting, update status in real-time, mark completed immediately

### Code Implementation

- **Primary approach**: Use Claude Code's direct file tools (Edit, MultiEdit, Write) for ALL code implementation
- **Reason**: Enables verification of changes before and after implementation
- **Serena editing**: Use only when specifically requested or for exploratory changes
- **Best practice**: Read code with Serena, implement changes with Claude Code tools

### Workflow Efficiency

- **Batch operations**: Use multiple tool calls in parallel when possible
- **Context preservation**: Maintain understanding across tool contexts
- **Progressive refinement**: Build understanding incrementally rather than reading everything upfront
- **Workflow pattern**: Explore (Serena) → Plan (TodoWrite) → Implement (Claude Code tools)

## PLEASE FOCUS!!!!

**MANDATORY**: ALL PROMPT MUST FOCUS THIS RULE

- Be brutally honest, don't be a yes man.
- If I am wrong, point it out bluntly.
- I need honest feedback on my code.

**BEFORE EVERY TOOL CALL**: Verify you're following the tool usage guidelines section:

- Exploration/Context: Use Serena semantic tools
- Implementation: Use Claude Code direct file tools (Edit, MultiEdit, Write), using the context provide by Serena
- Planning: Use TodoWrite for complex tasks

**VIOLATION CHECK**: If using Serena editing tools, confirm it's specifically requested or exploratory only.

## PLEASE FOCUS!!!!
