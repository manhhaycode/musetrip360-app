# MuseTrip360 Monorepo Architecture

## Directory Structure

```
musetrip360-app/
├── apps/                           # Applications
│   ├── visitor-portal/             # Next.js 15 public website
│   ├── museum-portal/              # Vite museum management
│   ├── admin-portal/               # Vite system administration
│   └── mobile/                     # React Native + Expo
├── packages/                       # Shared libraries
│   ├── ui-core/                    # 50+ UI components (Radix + Tailwind)
│   ├── auth-system/                # Authentication & authorization
│   ├── user-management/            # User profiles & roles
│   ├── museum-management/          # Museum data & exhibitions
│   ├── artifact-management/        # Artifact operations
│   ├── event-management/           # Cultural events planning
│   ├── rich-editor/                # Rich text editor (CURRENT WORK)
│   ├── query-foundation/           # TanStack Query setup
│   ├── infras/                     # Environment config & utilities
│   ├── eslint-config/              # Shared ESLint rules
│   └── tsconfig/                   # Shared TypeScript configs
└── docs/                           # Project documentation
```

## Dependency Flow

- **Apps** depend on domain packages (`auth-system`, `museum-management`, etc.)
- **Domain packages** depend on infrastructure (`ui-core`, `query-foundation`, `infras`)
- **No circular dependencies** (previous circular dep between user-management ↔ auth-system was FIXED)

## Package Management

- **PNPM Workspaces** with `workspace:*` protocol
- **Turborepo** for build orchestration and caching
- **@manypkg/cli** for dependency consistency checking
