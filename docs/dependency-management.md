# Dependency Management in MuseTrip360

This document outlines our approach to managing dependencies across the MuseTrip360 monorepo.

## General Principles

1. **Consistency First**: We strive to maintain consistent dependency versions across all packages to prevent conflicts and ensure smooth integration.

2. **Controlled Exceptions**: Some dependencies may have different versions in different packages when necessary (e.g., platform-specific libraries).

3. **Automated Checks**: We use `@manypkg/cli` to automatically check and fix dependency inconsistencies.

## Tools

- **@manypkg/cli**: Checks and fixes dependency inconsistencies
- **pnpm**: Our package manager of choice
- **Turborepo**: Manages our monorepo build system

## Commands

- `pnpm check-deps`: Check for dependency inconsistencies
- `pnpm fix-deps`: Automatically fix dependency inconsistencies

## Exceptions

We allow different versions for the following dependencies:

- `react-native`: Different between web and mobile
- `react-native-web`: Different between web and mobile
- `expo`: Different between web and mobile
- `three`: May have different versions for web and mobile implementations

## Adding New Dependencies

When adding a new dependency:

1. Check if it's already used elsewhere in the monorepo with `pnpm check-deps`
2. If it is, use the same version
3. If you need a different version, add it to the `ignoredDependencies` list in `.manypkg.json`

## Updating Dependencies

When updating dependencies:

1. Try to update them consistently across all packages
2. Run `pnpm check-deps` after updates to ensure consistency
3. Document any exceptions in pull requests

## Version Conflicts

If you encounter version conflicts:

1. Try to align versions if possible
2. If alignment isn't possible, add the dependency to the `ignoredDependencies` list
3. Document the reason for the exception
