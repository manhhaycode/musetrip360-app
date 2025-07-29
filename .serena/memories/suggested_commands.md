# MuseTrip360 Development Commands

## Essential Development Commands

### Starting Development

```bash
pnpm dev                    # Start all applications in parallel
pnpm --filter=visitor-portal dev     # Start specific app (visitor portal)
pnpm --filter=museum-portal dev      # Start museum portal
pnpm watch-packages         # Watch only packages (not apps)
```

### Building & Production

```bash
pnpm build                  # Build all packages and applications
pnpm start                  # Build and start production servers
```

### Code Quality & Linting

```bash
pnpm lint                   # Run ESLint across all packages
pnpm format                 # Format code with Prettier
pnpm format:check           # Check formatting without changes
```

### Package Management

```bash
pnpm check-deps             # Check for dependency inconsistencies
pnpm fix-deps               # Fix dependency inconsistencies with @manypkg/cli
pnpm clean                  # Clean all build outputs and node_modules
```

### Testing

```bash
pnpm test                   # Run tests across all packages
```

## Task Completion Commands

**MANDATORY**: Always run these after completing any coding task:

1. `pnpm lint` - Check for linting errors
2. `pnpm format:check` - Verify code formatting
3. `pnpm build` - Ensure everything builds successfully
4. `pnpm check-deps` - Verify dependency consistency
