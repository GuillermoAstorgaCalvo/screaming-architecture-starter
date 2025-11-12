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

- `ErrorBoundary.tsx` - React ErrorBoundary class component that uses `react-router-dom` for navigation
- `ErrorBoundaryWrapper.tsx` - Wrapper component that injects logger from context into ErrorBoundary
- `httpClient.ts` - HTTP client implementation that implements `HttpPort` interface
- `httpClientConfig.ts` - HTTP client configuration management (default config, config merging)
- `httpClientUrl.ts` - URL building utilities
- `httpClientHeaders.ts` - Header manipulation and merging utilities
- `httpClientBody.ts` - Request body serialization and preparation utilities
- `httpClientResponseParsing.ts` - Response body parsing utilities
- `httpClientResponse.ts` - Response processing utilities
- `httpClientTimeout.ts` - Request timeout management utilities
- `httpClientErrorCreation.ts` - HTTP error creation utilities
- `httpClientErrorHandler.ts` - HTTP error handling and transformation
- `httpClientInterceptors.ts` - Interceptor utilities (request, response, and error interceptor execution)
- `httpClientMethods.ts` - HTTP method factories (GET, POST, PUT, PATCH, DELETE)
- `httpClientRequest.ts` - Request preparation and configuration utilities
- `date.ts` - Date manipulation utilities (framework-agnostic, SSR-safe)
- `formatDate.ts` - Date formatting utilities with `formatDate()` and `formatDateTime()` (SSR-safe with Intl.DateTimeFormat fallbacks)
- `formatDate.types.ts` - Shared types for date formatting utilities
- `formatISO.ts` - ISO date formatting utilities (`formatISO()`)
- `formatRelativeTime.ts` - Relative time formatting utilities (`formatRelativeTime()`)
- `formatTime.ts` - Time formatting utilities (`formatTime()`)
- `storeUtils.ts` - Zustand store utilities and type helpers

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

- `classNames.ts` - Conditionally join class names together (strings, arrays, objects)
- `seoDomUtils.ts` - SEO DOM utilities (main orchestrator) - applies SEO metadata to document head
- `seoDomUtils.basic.ts` - Basic SEO meta tags utilities
- `seoDomUtils.custom.ts` - Custom meta tags utilities
- `seoDomUtils.openGraph.ts` - Open Graph meta tags utilities
- `seoDomUtils.twitter.ts` - Twitter Card meta tags utilities
- `seoDomUtils.helpers.ts` - SEO DOM utilities helper functions
- `debounce.ts` - Debounce function implementation (returns debounced function with cancel and flush methods, supports leading, trailing, maxWait options)
- `debounceHelpers.ts` - Internal helper functions for debounce implementation
- `throttle.ts` - Throttle function implementation (returns throttled function with cancel and flush methods, supports leading, trailing options)
- `throttleHelpers.ts` - Internal helper functions for throttle implementation
- `hookUtils.ts` - Utility functions for React hooks (getDependenciesKey for serializing dependencies arrays)

### `hooks/` - React Hooks

**Purpose**: Contains React hooks that provide reusable logic across components.

**Guidelines**:

- React-specific (hooks require React)
- Should use ports/providers for dependencies (not direct infrastructure imports)
- May use `utils/` for pure logic

**Contents**:

- `useDebounce.ts` - React hook wrapping debounce utility (supports values and callbacks)
- `useThrottle.ts` - React hook wrapping throttle utility. Exports two hooks: `useThrottle<T>(value, delay)` for throttling values and `useThrottledCallback<T>(callback, delay)` for throttling callback functions
- `useToggle.ts` - Boolean toggle hook (returns [value, toggle, setTrue, setFalse])
- `useLocalStorage.ts` - React hook for localStorage access via StoragePort (uses context storage)
- `useSessionStorage.ts` - React hook for sessionStorage access via StoragePort (direct adapter import)
- `useFetch.ts` - Hook for fetching data using httpClient with state management
- `useAsync.ts` - Generic async execution hook (more flexible than useFetch)
- `useMediaQuery.ts` - Hook to track media query matches (SSR-safe)
- `useWindowSize.ts` - Hook to track window dimensions (SSR-safe)
- `usePrevious.ts` - Hook that returns previous value of state/prop
- `useSEO.ts` - Hook to update document head metadata (SEO) - updates title, meta tags, Open Graph, and Twitter Card tags

### `a11y/` - Accessibility Utilities

**Purpose**: Framework-agnostic accessibility utilities for focus management and keyboard navigation.

**Contents**:

- `focus.ts` - Focus management utilities (getFocusableElements, focusFirstElement, focusLastElement, isFocusable, handleTabNavigation, saveActiveElement)
- `skipToContent.tsx` - Skip link component for keyboard navigation (accessible skip-to-content link with visible-on-focus behavior)

**Guidelines**:

- Framework-agnostic, works with any DOM elements
- No React dependencies (except for React components like `skipToContent.tsx`)

### `config/` - Configuration Management

**Purpose**: Centralized configuration management for the application.

**Contents**:

- `env.client.ts` - Build-time environment variables (Vite `import.meta.env`) with Zod validation
- `routes.ts` - Global route path constants (`ROUTES`)
- `runtime.ts` - Runtime configuration loader from `public/runtime-config.json`
- `init.ts` - Configuration initialization that sets up global services

See `config/README.md` for detailed documentation.

### `constants/` - Core Constants

**Purpose**: Centralized constants used across the application.

**Contents**:

- `designTokens.ts` - Design tokens (colors, radius, spacing) - single source of truth
- `theme.ts` - Theme type definitions (`'light' | 'dark' | 'system'`)
- `ui/` - UI component constants organized by component category:
  - `buttons.ts` - Button and IconButton constants
  - `controls.ts` - Checkbox, Switch, and Radio constants
  - `data.ts` - Table, Pagination, and Avatar constants
  - `display.ts` - Skeleton, Badge, Heading, Text, Card, Link, Progress, and Divider constants
  - `forms.ts` - Input, Textarea, and Select constants
  - `navigation.ts` - Breadcrumbs, Drawer, Tabs, and Accordion constants
  - `overlays.ts` - Modal and Spinner constants
  - `shared.ts` - Shared constants used across multiple components
- `endpoints.ts` - API endpoint constants with `buildApiUrl()` helper
- `env.ts` - Environment-derived constants (IS_DEV, IS_PROD, ENV_MODE, helper functions)
- `aria.ts` - ARIA roles and attribute constants with `createAriaLabel()` helper
- `breakpoints.ts` - Breakpoint constants for responsive design
- `regex.ts` - Regular expression patterns for validation
- `timeouts.ts` - Timeout constants for network and UI operations

### `forms/` - Form Abstraction Layer

**Purpose**: Library-agnostic form handling to avoid coupling domain code to specific form implementations.

**Contents**:

- `formAdapter.ts` - Form abstraction layer over react-hook-form
- `controller.tsx` - Controller component for controlled components
- `useController.ts` - useController hook for controlled components

See `forms/README.md` for detailed documentation.

### `router/` - Routing Helpers

**Purpose**: Type-safe helpers built from the central `ROUTES` map.

**Contents**:

- `routes.gen.ts` - Generated route utilities providing `buildRoute`, `getRouteTemplate`, `RouteParams`, `ROUTE_KEYS`, and `isRouteKey`
- `index.ts` - Intentionally empty placeholder to enforce direct imports (explicit imports required)

**Usage**:

```ts
import { buildRoute } from '@core/router/routes.gen';

const userDetailUrl = buildRoute('USER_DETAIL', { id: 42 });
```

### `http/` - HTTP Error Handling

**Purpose**: HTTP error normalization and adaptation utilities.

**Contents**:

- `errorAdapter.ts` - HTTP error adapter for normalizing HTTP errors to typed domain errors. Maps HTTP status codes to domain error types. Provides `adapt()` method, helper methods (`isType()`, `isClientError()`, `isServerError()`, `isRetryable()`), and supports field-level validation error extraction.
- `errorAdapter.constants.ts` - Error adapter constants
- `errorAdapter.handlers.ts` - Error handling functions
- `errorAdapter.helpers.ts` - Helper functions (isType, isClientError, isServerError, isRetryable)
- `errorAdapter.types.ts` - Type definitions (DomainErrorType, DomainError, etc.)

### `i18n/` - Internationalization System

**Purpose**: Core i18n configuration using i18next with scalable, domain-driven architecture.

**Contents**:

- `i18n.ts` - Core i18next instance configuration
- `types.ts` - TypeScript types for translation keys (type-safe access)
- `useTranslation.ts` - Custom hook wrapper with automatic resource loading
- `useRtl.ts` - Hook to check if current language is RTL
- `resourceLoader.ts` - Dynamic resource loading system
- `registry.ts` - Domain translation registration system
- `constants.ts` - Centralized i18n constants
- `errors.ts` - Custom error classes for i18n resource loading
- `useTranslationHelpers.ts` - Internal helper functions for resource loading state management
- `useTranslationLoader.ts` - Internal hook for managing resource loading effects
- `useTranslationState.ts` - Internal hook for managing translation loading state
- `locales/` - Common/shared translations (en.json, es.json, ar.json)

See `i18n/README.md` for detailed documentation.

### `perf/` - Performance Utilities

**Purpose**: Performance monitoring and optimization utilities.

**Contents**:

- `reportWebVitals.ts` - Core Web Vitals performance monitoring. Tracks and reports Core Web Vitals metrics (LCP, INP, CLS, FCP, TTFB). Only runs in production mode. Uses logger adapter for reporting.

### `security/` - Security Utilities

**Purpose**: Framework-agnostic security utilities for HTML sanitization, CSP, and permission management.

**Contents**:

- `csp/` - Content Security Policy helpers organized into focused modules:
  - `types.ts` - Type definitions (HashAlgorithm, CSPDirectives)
  - `nonce.ts` - Nonce generation and validation
  - `hash.ts` - Hash generation for inline content
  - `policy.ts` - Policy building, parsing, and recommended CSP
  - `helpers.ts` - Internal helper functions for policy operations
- `sanitizeHtml.ts` - HTML sanitization utilities (XSS prevention)
- `sanitizeHtmlEscape.ts` - HTML escaping utilities (escapeHtml function)
- `sanitizeHtmlDOMPurify.ts` - DOMPurify integration (sanitizeHtmlWithDOMPurify function, isDOMPurifyAvailable)
- `sanitizeHtmlConstants.ts` - Constants and default configuration
- `sanitizeHtmlTypes.ts` - Type definitions (SanitizeConfig, DOMPurifyConfig, etc.)
- `sanitizeHtmlHelpers.ts` - Internal helper functions
- `permissionsTypes.ts` - Type definitions for the permission system
- `permissionsCheck.ts` - Basic permission checking functions (hasPermission, hasAllPermissions, hasAnyPermission)
- `permissionsValidate.ts` - Detailed permission validation with results (checkPermissions)
- `permissionsRoles.ts` - Role-based permission management (getPermissionsFromRoles)
- `permissionsManipulate.ts` - Permission manipulation utilities (mergePermissions, filterPermissions)
- `permissionsPattern.ts` - Pattern matching with wildcards (matchesPattern, findPermissionsByPattern)

See `security/README.md` for detailed documentation.

### `ui/` - Atomic UI Components

**Purpose**: Domain-agnostic, accessible UI components organized by component.

**Contents**:

- `accordion/` - Accordion component with expandable/collapsible sections
- `avatar/` - Avatar component for user profile images
- `badge/` - Status/label display component with multiple variants
- `breadcrumbs/` - Breadcrumbs navigation component
- `button/` - Button component with variants and sizes
- `card/` - Card container component
- `checkbox/` - Checkbox component with label, error, helper text support
  - `Checkbox.tsx` - Main Checkbox component
  - `CheckboxContent.tsx` - Checkbox content component
  - `CheckboxField.tsx` - Checkbox field component
  - `CheckboxHandlers.ts` - Checkbox event handlers
  - `CheckboxHelpers.ts` - Helper functions
  - `CheckboxLabel.tsx` - Checkbox label component
  - `CheckboxMessages.tsx` - Checkbox error/helper text messages component
  - `CheckboxTypes.ts` - Checkbox type definitions
  - `CheckboxWrapper.tsx` - Checkbox wrapper component
  - `useCheckbox.ts` - Checkbox hook
- `divider/` - Divider/separator component
- `drawer/` - Drawer component (side panel)
- `error-text/` - Error text display component
- `heading/` - Reusable typography heading component (h1-h6)
- `helper-text/` - Helper text display component
- `icon-button/` - Icon button component
- `icons/` - Icon components and registry
  - `Icon.tsx` - Generic Icon wrapper component (uses icon registry)
  - `iconRegistry.ts` - Icon registry (centralized icon management)
  - `clear-icon/` - ClearIcon component
  - `close-icon/` - CloseIcon component
  - `heart-icon/` - HeartIcon component
  - `search-icon/` - SearchIcon component
  - `settings-icon/` - SettingsIcon component
- `input/` - Text input with label, error, helper text, icon support
  - `Input.tsx` - Main Input component
  - `InputContent.tsx` - Input content component
  - `InputField.tsx` - Input field component
  - `InputHelpers.ts` - Helper functions
  - `InputIcon.tsx` - Input icon component
  - `InputLabel.tsx` - Input label component
  - `InputMessages.tsx` - Input error/helper text messages component
  - `InputTypes.ts` - Input type definitions
  - `InputWrapper.tsx` - Input wrapper component
  - `useInput.ts` - Input hook
- `label/` - Form label component
- `link/` - Link component (navigation link)
- `loadable.tsx` - Code splitting wrapper around React.lazy and Suspense (provides `Loadable` function with customizable loading fallbacks)
- `loadableFallback.tsx` - Default loading fallback component (`DefaultLoadingFallback`) with accessible loading state (aria-live and aria-label)
- `loadableUtils.ts` - Utility functions for Loadable (provides `createLoadable()` helper with default loading fallback)
- `modal/` - Modal dialog component with overlay and close functionality
- `pagination/` - Pagination component for navigating through pages
- `popover/` - Flexible overlay component with positioning and portal rendering
- `progress/` - Progress bar component
- `radio/` - Radio button component with label, error, helper text support
- `select/` - Select/dropdown component with label, error, helper text support
- `skeleton/` - Loading state component with animated pulse effect
- `spinner/` - Loading indicator component
- `switch/` - Toggle switch component with label, error, helper text support
- `table/` - Table component for displaying tabular data
- `tabs/` - Tabs component for organizing content into tabs
- `text/` - Reusable typography paragraph component
- `textarea/` - Textarea component with label, error, helper text support
  - `Textarea.tsx` - Main Textarea component
  - `TextareaContent.tsx` - Textarea content component
  - `TextareaField.tsx` - Textarea field component
  - `TextareaHelpers.ts` - Helper functions
  - `TextareaLabel.tsx` - Textarea label component
  - `TextareaMessages.tsx` - Textarea error/helper text messages component
  - `TextareaTypes.ts` - Textarea type definitions
  - `TextareaWrapper.tsx` - Textarea wrapper component
  - `useTextarea.ts` - Textarea hook
- `theme-toggle/` - Theme toggle component (cycles through light → dark → system → light)
- `theme/tokens.ts` - Component token definitions derived from design tokens
- `tooltip/` - Accessible tooltip component with positioning
  - `Tooltip.tsx` - Main Tooltip component
  - `TooltipContent.tsx` - Tooltip content component
  - `TooltipWrapper.tsx` - Tooltip wrapper component
  - `tooltipUtils.ts` - Tooltip utility functions
  - `useTooltip.ts` - Tooltip hook
- `variants/` - Component variants using class-variance-authority (button, iconButton, input, textarea, checkbox, switch, select, radio, badge, card, heading, link, text, skeleton, modal, spinner, label, errorText, helperText, icon)

**Guidelines**:

- Components are domain-agnostic and accessible
- Each component is organized in its own folder with related files
- Uses design tokens from `core/constants/designTokens.ts`
- Types exported from `@src-types/ui`

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

| Directory    | Framework Dependencies                            | Use Case                                            |
| ------------ | ------------------------------------------------- | --------------------------------------------------- |
| `lib/`       | ✅ Yes (React, Router, etc.)                      | Framework-integrated components and implementations |
| `utils/`     | ❌ No                                             | Pure, reusable utilities                            |
| `hooks/`     | ✅ Yes (React)                                    | React-specific hooks                                |
| `ports/`     | ❌ No                                             | Pure TypeScript interfaces                          |
| `providers/` | ✅ Yes (React)                                    | React context providers                             |
| `a11y/`      | ⚠️ Mixed (focus.ts: no, skipToContent.tsx: React) | Accessibility utilities                             |
| `config/`    | ❌ No                                             | Configuration management                            |
| `constants/` | ❌ No                                             | Core/global constants                               |
| `forms/`     | ✅ Yes (React)                                    | Form abstraction layer                              |
| `router/`    | ❌ No                                             | Route helpers generated from `ROUTES`               |
| `http/`      | ❌ No                                             | HTTP error handling                                 |
| `i18n/`      | ✅ Yes (React)                                    | Internationalization system                         |
| `perf/`      | ❌ No                                             | Performance utilities                               |
| `security/`  | ❌ No                                             | Security utilities                                  |
| `ui/`        | ✅ Yes (React)                                    | Atomic UI components                                |

## Decision Guide

**Use `lib/` when:**

- Building React components or framework-integrated utilities
- Implementing port interfaces with framework-specific code
- Creating components that use React Router, DOM APIs, etc.

**Use `utils/` when:**

- Creating pure functions with no framework dependencies
- Building utilities that could work in Node.js or browser
- Need framework-agnostic helpers
