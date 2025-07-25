# MuseTrip360 Development Guidelines

## Architecture Principles
- **Clean Architecture**: UI → State → API → Types dependency flow
- **Domain-Driven Design**: Each business domain has its own package
- **Tree-shaking Optimization**: Granular imports via `/api`, `/state`, `/ui` subpaths
- **Type Safety**: End-to-end TypeScript with Zod validation

## Current Development Focus
- **Branch**: `packages/rich-editor` 
- **Active Work**: Rich text editor implementation for museum content management
- **Recent Changes**: Removed circular dependencies, restructured packages

## Key Design Patterns
- **Provider Pattern**: React Context for domain-specific state
- **Hook Pattern**: Custom hooks for business logic encapsulation  
- **Compound Components**: Complex UI components with sub-components
- **Render Props**: Flexible component composition

## Security Best Practices
- **Never commit secrets** or API keys
- **Sanitize user inputs** with Zod validation
- **RBAC implementation** via auth-system package
- **JWT token management** with refresh rotation

## Performance Optimization
- **Code splitting** with lazy loading
- **TanStack Query** for intelligent caching
- **Bundle analysis** for tree-shaking verification
- **Image optimization** via Next.js Image component

## Testing Strategy
- **Unit Tests**: Vitest for package-level testing
- **Integration Tests**: TanStack Query testing utilities
- **Type Tests**: TypeScript compiler validation
- **E2E Tests**: Planned (not currently implemented)