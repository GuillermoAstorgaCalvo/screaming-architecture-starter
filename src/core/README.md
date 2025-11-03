# src/core - Framework-Agnostic Core Utilities

This directory contains reusable, domain-independent code that forms the foundation of the application.

## Directory Structure

### `lib/` - Framework-Specific Libraries

**Purpose**: Contains React/framework-specific implementations and components that integrate with the framework ecosystem.

**Contents**:

- React components (e.g., `ErrorBoundary.tsx`) that may use React Router or other framework libraries
- HTTP client implementations that implement port interfaces
- Framework-aware utilities that integrate with React/DOM APIs

**Guidelines**:

- May depend on React, React Router, and other framework libraries
- Must still respect hexagonal architecture boundaries (no app/domains/infrastructure imports)
- Typically implements interfaces defined in `ports/`

**Examples**:

- `ErrorBoundary.tsx` - React component that uses `react-router-dom` for navigation
- `httpClient.ts` - HTTP client implementation that implements `HttpPort` interface

### `utils/` - Framework-Agnostic Utilities

**Purpose**: Contains pure, framework-agnostic utility functions that can be used in any JavaScript/TypeScript context.

**Contents**:

- Pure functions with no framework dependencies
- Cross-cutting helpers that work in Node.js, browser, or any JS runtime
- Utility functions that don't depend on React, DOM, or any specific framework

**Guidelines**:

- **Must be framework-agnostic** - no React, DOM, or framework-specific dependencies
- Should be pure functions when possible
- Can be used in tests, server-side code, or any JavaScript context

**Examples**:

- `classNames.ts` - Pure string concatenation utility
- `debounce.ts` - Generic debounce implementation
- `throttle.ts` - Generic throttle implementation

### `hooks/` - React Hooks

**Purpose**: Contains React hooks that provide reusable logic across components.

**Guidelines**:

- React-specific (hooks require React)
- Should use ports/providers for dependencies (not direct infrastructure imports)
- May use `utils/` for pure logic

**Contents**:

- `useDebounce.ts` - React hook wrapping debounce utility (supports values and callbacks)
- `useThrottle.ts` - React hook wrapping throttle utility (supports values and callbacks)
- `useToggle.ts` - Boolean toggle hook (returns [value, toggle, setTrue, setFalse])
- `useLocalStorage.ts` - React hook for storage access via StoragePort
- `useFetch.ts` - Hook for fetching data using httpClient with state management
- `useAsync.ts` - Generic async execution hook (more flexible than useFetch)
- `useMediaQuery.ts` - Hook to track media query matches (SSR-safe)
- `useWindowSize.ts` - Hook to track window dimensions (SSR-safe)
- `usePrevious.ts` - Hook that returns previous value of state/prop

### `ports/` - Hexagonal Architecture Ports

**Purpose**: Defines interfaces/contracts for external dependencies following hexagonal architecture.

**Guidelines**:

- Pure TypeScript interfaces
- No implementations, only contracts
- Infrastructure adapters implement these, domains depend on them

### `providers/` - React Context Providers

**Purpose**: React context providers that inject port implementations into the component tree.

**Guidelines**:

- React-specific
- Bridge between infrastructure adapters and domain code
- Allows dependency injection of port implementations

## Summary

| Directory    | Framework Dependencies       | Use Case                                            |
| ------------ | ---------------------------- | --------------------------------------------------- |
| `lib/`       | ✅ Yes (React, Router, etc.) | Framework-integrated components and implementations |
| `utils/`     | ❌ No                        | Pure, reusable utilities                            |
| `hooks/`     | ✅ Yes (React)               | React-specific hooks                                |
| `ports/`     | ❌ No                        | Pure TypeScript interfaces                          |
| `providers/` | ✅ Yes (React)               | React context providers                             |

## Decision Guide

**Use `lib/` when:**

- Building React components or framework-integrated utilities
- Implementing port interfaces with framework-specific code
- Creating components that use React Router, DOM APIs, etc.

**Use `utils/` when:**

- Creating pure functions with no framework dependencies
- Building utilities that could work in Node.js or browser
- Need framework-agnostic helpers
