# Task Completion Checklist

## MANDATORY Steps After Every Coding Task

### 1. Code Quality Checks
```bash
pnpm lint                   # Fix any ESLint errors
pnpm format:check           # Ensure consistent formatting
```

### 2. Build Verification  
```bash
pnpm build                  # Verify all packages build successfully
```

### 3. Dependency Consistency
```bash
pnpm check-deps             # Check for package dependency issues
pnpm fix-deps               # Auto-fix dependency inconsistencies (if needed)
```

### 4. Type Safety
- TypeScript compilation must pass (included in build)
- No `any` types unless absolutely necessary
- Zod schemas for all external data validation

## Pre-commit Automation
- **Husky** runs pre-commit hooks automatically
- **lint-staged** runs formatters on staged files only
- Manual verification still required for complex changes

## Critical Reminders
- **NO COMMENTS** in code unless explicitly requested
- **Import specificity** for tree-shaking (`/api`, `/state`, `/ui` subpaths)
- **Package structure** must follow standardized domain layout
- **Brutal honesty** - call out architectural issues immediately