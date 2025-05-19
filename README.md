# MuseTrip360

![MuseTrip360 Logo](https://via.placeholder.com/200x100?text=MuseTrip360)

A comprehensive platform for museums and exhibitions, enabling virtual tours, exhibition management, and intelligent visitor interactions.

## Project Overview

MuseTrip360 is a digital platform for historical museums to create virtual exhibitions, manage cultural events, and provide intelligent visitor interactions. It supports multiple museums with shared infrastructure through a suite of applications:

- **Visitor App**: Browse exhibitions, view 3D artifacts, book tickets, and manage profiles
- **Manager App**: Manage exhibitions, artifacts, and museum content
- **Staff App**: Handle day-to-day operations and visitor assistance
- **Event Organizer App**: Plan and manage cultural events
- **Admin App**: System-wide administration and user management
- **RESTful API Backend**: Powers all applications with user management, exhibitions, ticketing, events, and AI chatbot functionality

## Technology Stack

### Frontend

- **Web Applications**: Next.js 15+, React 19+
- **Mobile Application**: React Native with Expo
- **3D Visualization**: Three.js
- **Styling**: TailwindCSS 4

### Backend (Planned)

- **API**: ASP.NET Core 8
- **Databases**:
  - PostgreSQL for relational data
  - Redis for caching
  - Vector databases (Qdrant, pgvector, MongoDB) for advanced queries

### AI Features

- Integration with Large Language Models (deepseek-r1, llama, gemma3)

### DevOps & Infrastructure

- **Monorepo Management**: Turborepo
- **Package Management**: PNPM
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (web applications)

## Project Structure

```
musetrip360-app/
├── apps/                      # Application packages
│   ├── docs/                  # Documentation site
│   ├── mobile/                # React Native mobile app
│   └── web/                   # Next.js web application
├── packages/                  # Shared packages
│   ├── eslint-config/         # Shared ESLint configurations
│   └── tsconfig/              # Shared TypeScript configurations
├── docs/                      # Project documentation
├── .github/                   # GitHub workflows and templates
└── ...
```

## Getting Started

### Prerequisites

- Node.js 18+
- PNPM 10.10.0+

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/manhhaycode/musetrip360-app.git
   cd musetrip360-app
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start development servers:

   ```bash
   # Start all applications in parallel
   pnpm dev

   # Or start a specific application
   pnpm --filter=web dev
   pnpm --filter=mobile dev
   pnpm --filter=docs dev
   ```

## Available Scripts

- `pnpm build`: Build all packages and applications
- `pnpm dev`: Start all development servers
- `pnpm lint`: Run linting on all packages
- `pnpm format`: Format all code with Prettier
- `pnpm check-deps`: Check for dependency inconsistencies
- `pnpm fix-deps`: Fix dependency inconsistencies
- `pnpm clean`: Clean all build outputs and node_modules

## Development Guidelines

### Code Style

The project uses ESLint and Prettier for code formatting and linting. Configuration is shared across packages through the `@musetrip360/eslint-config` package.

### TypeScript Configuration

TypeScript configurations are shared through the `@musetrip360/tsconfig` package, with specific configurations for:

- Base TypeScript projects
- Next.js applications
- React applications
- React Native applications

### Dependency Management

1. We strive to maintain consistent dependency versions across all packages
2. Some dependencies may have different versions when necessary (e.g., platform-specific libraries)
3. We use `@manypkg/cli` to automatically check and fix dependency inconsistencies

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration:

1. **Dependency Installation**: Sets up Node.js, PNPM, and installs dependencies
2. **Linting**: Runs ESLint on all packages
3. **Building**: Builds all packages and applications
4. **Dependency Checking**: Ensures consistent dependencies across packages

## Contributing

Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting pull requests.

## License

This project is proprietary and confidential. All rights reserved.

## Contact

For questions or support, please contact the project maintainers.
