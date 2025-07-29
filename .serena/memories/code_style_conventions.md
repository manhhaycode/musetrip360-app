# MuseTrip360 Code Style & Conventions

## Code Formatting (Prettier)

- **Print Width**: 120 characters
- **Single Quotes**: Yes (except JSX uses double quotes)
- **Semicolons**: Required
- **Trailing Commas**: ES5 style
- **Tab Width**: 2 spaces (no tabs)
- **Arrow Parens**: Always use parentheses

## TypeScript Conventions

- **Strict Mode**: Enabled across all packages
- **Type Safety**: Full end-to-end TypeScript with Zod validation
- **No Comments**: NEVER add comments unless explicitly requested
- **Interface Naming**: Use PascalCase, prefer `interface` over `type`

## Import Patterns (CRITICAL)

### ✅ Preferred: Specific Domain Imports (Tree-shaking friendly)

```typescript
import { useAuthHook } from '@musetrip360/auth-system/api';
import { AuthProvider } from '@musetrip360/auth-system/state';
import { LoginForm } from '@musetrip360/auth-system/ui';
```

### ❌ Avoid: Full Package Imports

```typescript
import { useAuthHook, AuthProvider } from '@musetrip360/auth-system'; // BAD
```

## Package Structure (MANDATORY for domain packages)

```
lib/
├── api/           # Data access layer (hooks, endpoints, cache)
├── state/         # State management (context, hooks, stores)
├── ui/            # React components
├── types/         # TypeScript definitions
├── validation/    # Zod schemas
├── utils/         # Domain utilities
└── index.ts       # Main barrel export
```

## Language & Content Convention

- **Web Content Language**: All user-facing content MUST be in Vietnamese as the native language
- **Code Elements**: Keep functions, variables, types, interfaces in English for maintainability
- **UI Text**: All labels, messages, titles, descriptions displayed to users must be Vietnamese
- **API & Comments**: Follow English standards for technical consistency

## Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile`)
- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useAuth`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL`)
