# Screaming Architecture Starter

A modern, scalable React application starter template built with TypeScript, Vite, and TailwindCSS. This template follows the **Screaming Architecture** pattern, where the directory structure reflects business domains first, frameworks second.

## 🎯 Purpose

Provide a frontend template where the architecture screams the domain. The directory names reflect business/domain concepts first, frameworks second.

### Key Architectural Principles

- **Domains-first**: `src/domains/*` encapsulates business logic, pages, components, services, and store per domain
- **Framework-agnostic core**: `src/core/*` holds generic utilities, hooks, config, i18n types, and UI atoms not tied to any domain
- **Infrastructure adapters**: `src/infrastructure/*` integrates frameworks and external services (API clients, storage, logging, analytics adapters)
- **Shared composites**: `src/shared/*` contains reusable composite components and helpers shared across domains
- **App composition**: `src/app/*` wires providers, routing, and error boundaries

## 🚀 Quick Start

### Prerequisites

- **Node.js**: `>=22.21.1` (see `.nvmrc`)
- **pnpm**: `10.22.0+sha512.bf049efe995b28f527fd2b41ae0474ce29186f7edcb3bf545087bd61fbbebb2bf75362d1307fda09c2d288e1e499787ac12d4fcb617a974718a6051f2eee741c` (see `package.json`)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The application will be available at `http://localhost:5173` (port configurable via `VITE_PORT`).

## 📜 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix ESLint issues automatically
- `pnpm run format` - Format code with Prettier
- `pnpm run typecheck` - Run TypeScript type checking
- `pnpm run test` - Run unit tests with Vitest (use Docker on Windows)
- `pnpm run test:watch` - Run unit tests in watch mode
- `pnpm run test:ui` - Run unit tests with Vitest UI
- `pnpm run test:coverage` - Run unit tests with coverage report
- `pnpm run test:e2e` - Run end-to-end tests with Playwright
- `pnpm run test:e2e:ui` - Run end-to-end tests with Playwright UI
- `pnpm run docker:test` - Run unit tests with Docker (recommended on Windows)
- `pnpm run docker:test:watch` - Run unit tests in watch mode with Docker
- `pnpm run docker:test:e2e` - Run E2E tests with Docker
- `pnpm run clean` - Clean build artifacts and dependencies

## 📁 Project Structure

```
src/
├── app/              # Application-level entry point and providers
├── core/             # Framework-agnostic, reusable utilities
├── domains/          # Self-contained business domains
├── infrastructure/   # Technical adapters & framework-specific code
├── shared/           # Reusable composite components & helpers
└── styles/           # Global styles and Tailwind configuration
```

See `docs/structure.md` for detailed structure documentation.

## 🛠️ Tech Stack

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.2** - Build tool and dev server
- **TailwindCSS 4.1.17** - Utility-first CSS framework
- **React Router 7.9.6** - Client-side routing
- **TanStack Query 5.90.8** - Server state management
- **Zustand 5.0.8** - Lightweight client-side state stores
- **i18next 25.6.2** - Internationalization
- **React Hook Form 7.66.0** - Form handling with Zod validation
- **Zod 4.1.12** - Schema validation
- **Web Vitals 5.1.0** - Performance monitoring
- **Lucide React 0.553.0** - Icon library
- **Sonner 2.0.7** - Toast notifications
- **Framer Motion 12.23.24** - Animation library
- **Playwright 1.56.1** - End-to-end testing
- **ESLint 9.39.1** - Code linting
- **Prettier 3.6.2** - Code formatting

## 📚 Documentation

### Getting Started

- [Folder Structure](docs/structure.md) - Detailed project structure
- [TypeScript Configuration](docs/tsconfig.md) - TSConfig documentation
- [Configuration Files](docs/config-files.md) - Configuration overview
- [Creating Domains](docs/creating-domains.md) - Step-by-step guide for creating new business domains

### Core Features

- [State Management](docs/state-management.md) - React Query and Zustand usage guide
- [Providers](docs/providers.md) - How to use provider hooks (Auth, HTTP, Storage, Toast, etc.)
- [Hooks](docs/hooks.md) - Custom React hooks reference and usage
- [Error Handling](docs/error-handling.md) - Result type pattern and error handling best practices
- [Internationalization](docs/internationalization.md) - i18n setup, usage, and domain translation guide
- [API Integration Guide](docs/api-integration.md) - Step-by-step API integration, error handling patterns, request/response patterns, and mocking
- [API Service Factory](src/core/api/README.md) - Type-safe API service creation guide
- [Route Protection](docs/routing-protection.md) - Guide for protecting routes with authentication and permissions

### UI & Testing

- [UI Customization Guide](docs/ui-customization-guide.md) - Complete guide for adapting the UI design system to different design systems
- [Testing Guide](docs/testing.md) - Guide for writing and running tests

### Troubleshooting

- [Troubleshooting Guide](docs/troubleshooting.md) - Common issues and solutions for build errors, dependencies, ports, TypeScript, and tests
- [Performance Guide](docs/performance.md) - Performance optimization, code splitting, bundle management, lazy loading, and Web Vitals monitoring

### DevOps & CI/CD

- [CI/CD Setup Guide](docs/ci-cd-setup.md) - Complete guide for understanding, setting up, and customizing CI/CD pipelines

## 🏗️ Architectural Goals

- **Separation of concerns**: Domain code does not depend on UI framework details or infrastructure specifics
- **Explicit boundaries**: Clear ownership and import rules between `domains`, `core`, `infrastructure`, and `shared`
- **Feature scalability**: New features are added by creating or extending domains, not scattering code
- **Performance & Observability**: Lazy-loaded pages/routes and atomic UI components; optional Web Vitals + error tracking adapters

## 🔒 Security

See [SECURITY.md](SECURITY.md) for security policy and vulnerability disclosure guidelines.

## 👥 Co-founders

This project is maintained by the co-founders of BrightHub S.L.:

- **Guillermo Astorga Calvo** - Co-founder & CTO (guillermo@brighthub.es)
- **Masa Jebril** - Co-founder & CEO (masaj@brighthub.es)

## 📝 License

See [LICENSE](LICENSE) for license information.

## 🤝 Contributing

This is a starter template. When contributing to your own project:

1. Follow the architectural boundaries
2. Keep domains self-contained
3. Use TypeScript for type safety
4. Follow the established code style (ESLint + Prettier)

## 📖 Additional Resources

- [Getting Started Guide](.cursor/rules/getting-started.mdc)
- [Architecture Overview](.cursor/rules/architecture/overview.mdc)
- [Folder Structure Rules](.cursor/rules/architecture/folder-structure.mdc)
- [Code Conventions](.cursor/rules/quality/conventions.mdc)
