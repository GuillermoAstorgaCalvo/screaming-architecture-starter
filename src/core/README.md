# src/core - Framework-Agnostic Core Utilities

This directory contains reusable, domain-independent code that forms the foundation of the application.

## Directory Structure

### `api/` - API Service Factory Utilities

**Purpose**: Type-safe API service factory for creating consistent API service implementations.

**Contents**:

- `createApiService.ts` - Main API service factory function
  - Creates type-safe API services with request/response mapping, error handling, and validation
- `createApiService.types.ts` - Type definitions (ApiService, ApiServiceConfig, ApiHttpMethod, etc.)
- `createApiService.helpers.ts` - Helper functions (error context, mapper context, response processing)
- `createApiService.request.ts` - Request preparation utilities

**Guidelines**:

- Used by domain services to create type-safe API service implementations
- Provides consistent error handling and response mapping across all API services

### `lib/` - Framework-Specific Libraries

**Purpose**: Contains React/framework-specific implementations and components that integrate with the framework ecosystem.

**Contents**:

- `http/` - Fetch-based HttpPort implementation broken into focused modules:
  - `httpClient.ts` - Main HttpClient class implementing HttpPort
  - `httpClientConfig.ts` - Default configuration and config utilities
  - `httpClientHeaders.ts` - Header management utilities
  - `httpClientBody.ts` - Request body serialization
  - `httpClientInterceptors.ts` - Interceptor types and management
  - `httpClientRequest.ts` - Request preparation and timeout handling
  - `httpClientResponse.ts` - Response parsing and processing
  - `httpClientResponseParsing.ts` - Response parsing utilities
  - `httpClientErrorCreation.ts` - Error creation utilities
  - `httpClientErrorHandler.ts` - Error handling utilities
  - `httpClientMethods.ts` - HTTP method helpers (GET, POST, PUT, DELETE, etc.)
  - `httpClientUrl.ts` - URL building utilities
  - `httpClientTimeout.ts` - Timeout handling utilities
  - `httpAuthInterceptor.ts` - Auth token interceptor that syncs AuthPort tokens
- `ErrorBoundary.tsx` / `ErrorBoundaryWrapper.tsx` - React error boundary components that integrate with `react-router-dom` and the LoggerPort context.
- `date/` - SSR-safe date primitives and formatting helpers (shared types + `formatDate`, `formatRelativeTime`, `formatISO`, `formatTime`).
- `storeUtils.ts` - Zustand helpers (`createSelector`, `StoreSelector` type, `StoreSlice`, `StoreActions`, `StoreWithActions`) for strongly-typed selectors and store patterns.
- `googleMapsLoader.ts` - Utility for lazily loading the Google Maps JS API (used by infrastructure/maps adapter).

**Guidelines**:

- May depend on React, React Router, or DOM APIs, but **never** import from `app/` or individual domains.
- Implement interfaces defined in `ports/` whenever exposing adapters that downstream layers should consume.

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

- `classNames.ts` - Deterministic class name joiner (string/object/array inputs)
- `debounce/` + `throttle/` - Implementations + helpers (cancel/flush/maxWait/validation)
- `hookUtils.ts` - Shared hook helpers (`getDependenciesKey`)
- `seo/seoDomUtils*.ts` - SEO DOM orchestration split into basic/custom/open-graph/twitter/helper modules
- `themeCustomization.ts` - Runtime CSS variable overrides + persistence helpers (used by theming docs)

### `hooks/` - React Hooks

**Purpose**: Contains React hooks that provide reusable logic across components.

**Guidelines**:

- React-specific (hooks require React)
- Should use ports/providers for dependencies (not direct infrastructure imports)
- May use `utils/` for pure logic

**Contents** (grouped by folder):

- `async/useAsync.ts` - Promise orchestration with `execute`, `data`, `error`, `loading`.
- `fetch/useFetch*.ts` - Declarative HTTP hook (effects, helpers, typed options).
- `debounce/useDebounce.ts` and `throttle/useThrottle.ts` - Value + callback rate-limiting.
- `storage/useLocalStorage.ts`, `storage/useSessionStorage.ts` - Hooks backed by StoragePort implementations.
- `http/useHttpClientAuth.ts` - Keeps HttpPort auth header interceptor aligned with AuthPort tokens.
- `interval/useInterval.ts` - SSR-safe interval hook with automatic cleanup.
- `motion/*` - Framer Motion friendly hooks (`useInView`, `useMotionValue`, `useMotionSpring`, `useScrollProgress`, etc.).
- `scroll/useScrollPosition.ts` - Scroll position tracking with throttling and SSR fallbacks.
- `ui/*` - UI convenience hooks (`useMediaQuery`, `useWindowSize`, `useToggle`, `usePrevious`).
- `seo/useSEO.ts` - Document head metadata helper built on `core/config/seo`.

### `a11y/` - Accessibility Utilities

**Purpose**: Framework-agnostic accessibility utilities for focus management and keyboard navigation.

**Contents**:

- `focus/` - Focus management utilities:
  - `constants.ts` - Focus-related constants (FOCUSABLE_SELECTOR, etc.)
  - `focus.ts` - Focus management functions (getFocusableElements, focusFirstElement, focusLastElement, isFocusable, handleTabNavigation, saveActiveElement)
  - `helpers.ts` - Internal helper functions for focus utilities
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

### `auth/` - Authentication helpers

**Purpose**: Shared utilities for working with authentication tokens regardless of adapter.

- `authTokenStorage.ts` - Wraps a `StoragePort` to persist access/refresh tokens, normalize expiration timestamps, and expose helper methods (`createAuthTokenStorage`, `normalizeExpiresAt`).

These helpers are consumed by infrastructure adapters (e.g., `JwtAuthAdapter`) and hooks (e.g., `useHttpClientAuth`) to avoid duplicating token persistence logic.

### `forms/` - Form Abstraction Layer

**Purpose**: Library-agnostic form handling to avoid coupling domain code to specific form implementations.

**Contents**:

- `formAdapter.ts` - Form abstraction layer over react-hook-form
- `controller.tsx` - Controller component for controlled components
- `useController.ts` - useController hook for controlled components

See `forms/README.md` for detailed documentation.

### `router/` - Routing Helpers

**Purpose**: Type-safe helpers built from the central `ROUTES` map and route guard utilities.

**Contents**:

- `routes.gen.ts` - Generated route utilities providing `buildRoute`, `getRouteTemplate`, `RouteParams`, `ROUTE_KEYS`, and `isRouteKey`
- `routes.guards.ts` - Route guard utilities for protected routes:
  - `evaluateRouteGuards` - Evaluates a list of route guards
  - `authenticatedGuard` - Guard that requires authentication
  - `guestGuard` - Guard for guest-only routes (redirects if already authenticated)
  - `createPermissionGuard` - Factory for creating permission-based guards
  - Types: `RouteGuard`, `RouteGuardResult`, `GuardEvaluationResult`, `RouteGuardContext`
  - Constants: `RouteGuardReason` (NotAuthenticated, AlreadyAuthenticated, MissingPermissions)

**Usage**:

```ts
import { buildRoute } from '@core/router/routes.gen';
import { authenticatedGuard, createPermissionGuard } from '@core/router/routes.guards';

const userDetailUrl = buildRoute('USER_DETAIL', { id: 42 });

// Use guards in ProtectedRoute component
const guards = [authenticatedGuard, createPermissionGuard(['user:read'], { requireAll: true })];
```

### `http/` - HTTP Error Handling

**Purpose**: HTTP error normalization and adaptation utilities.

**Contents**:

- `errorAdapter.ts` - HTTP error adapter for normalizing HTTP errors to typed domain errors. Maps HTTP status codes to domain error types. Provides `adapt()` method, helper methods (`isType()`, `isClientError()`, `isServerError()`, `isRetryable()`), and supports field-level validation error extraction.
- `errorAdapter.constants.ts` - Error adapter constants
- `errorAdapter.handlers.ts` - Error handling functions
- `errorAdapter.helpers.ts` - Helper functions (isType, isClientError, isServerError, isRetryable)
- `errorAdapter.schemas.ts` - Zod schemas for API error responses and validation errors
- `errorAdapter.types.ts` - Type definitions (DomainErrorType, DomainError, etc.)

### `i18n/` - Internationalization System

**Purpose**: Core i18n configuration using i18next with scalable, domain-driven architecture.

**Contents**:

- `i18n.ts` - Core i18next instance configuration
- `useTranslation.ts` - Custom hook wrapper with automatic resource loading
- `useRtl.ts` - Hook to check if current language is RTL
- `resourceLoader.ts` - Dynamic resource loading system (main export)
- `resourceLoader/` - Resource loading sub-modules:
  - `cache.ts` - Resource caching utilities
  - `i18n.ts` - i18next integration functions
  - `load.ts` - Resource loading functions
  - `registry.ts` - Resource loader registry
  - `types.ts` - Type definitions
  - `validation.ts` - Resource validation utilities
- `registry.ts` - Domain translation registration system
- `constants/` - Centralized i18n constants:
  - `constants.ts` - SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, RTL_LANGUAGES, helper functions
- `errors.ts` - Custom error classes for i18n resource loading
- `hooks/` - Internal hooks for resource loading state management:
  - `useTranslationHelpers.ts` - Helper functions for resource loading state management
  - `useTranslationLoader.ts` - Hook for managing resource loading effects
  - `useTranslationState.ts` - Hook for managing translation loading state
- `types/` - TypeScript types for translation keys:
  - `types.ts` - Type definitions for translation interfaces (type-safe access)
- `locales/` - Common/shared translations (en.json, es.json, ar.json)

See `i18n/README.md` for detailed documentation.

### `perf/` - Performance Utilities

**Purpose**: Performance monitoring and optimization utilities.

**Contents**:

- `reportWebVitals.ts` - Core Web Vitals performance monitoring. Tracks and reports Core Web Vitals metrics (LCP, INP, CLS, FCP, TTFB). Only runs in production mode. Uses logger adapter for reporting.

### `security/` - Security Utilities

**Purpose**: Framework-agnostic security utilities for HTML sanitization, CSP, and permission management.

**Contents**:

- `sanitize/` - HTML sanitization utilities (XSS prevention):
  - `sanitizeHtml.ts` - Main sanitization functions
  - `sanitizeHtmlEscape.ts` - HTML escaping utilities (escapeHtml function)
  - `sanitizeHtmlDOMPurify.ts` - DOMPurify integration (sanitizeHtmlWithDOMPurify function, isDOMPurifyAvailable)
  - `sanitizeHtmlConstants.ts` - Constants and default configuration
  - `sanitizeHtmlTypes.ts` - Type definitions (SanitizeConfig, DOMPurifyConfig, etc.)
  - `sanitizeHtmlHelpers.ts` - Internal helper functions
- `csp/` - Content Security Policy helpers organized into focused modules:
  - `types.ts` - Type definitions (HashAlgorithm, CSPDirectives)
  - `nonce.ts` - Nonce generation and validation
  - `hash.ts` - Hash generation for inline content
  - `policy.ts` - Policy building, parsing, and recommended CSP
  - `helpers.ts` - Internal helper functions for policy operations
  - `cryptoUtils.ts` - Shared crypto API utilities (internal)
- `permissions/` - Permission model helpers:
  - `permissionsTypes.ts` - Type definitions for the permission system
  - `permissionsCheck.ts` - Basic permission checking functions (hasPermission, hasAllPermissions, hasAnyPermission)
  - `permissionsValidate.ts` - Detailed permission validation with results (checkPermissions)
  - `permissionsRoles.ts` - Role-based permission management (getPermissionsFromRoles)
  - `permissionsManipulate.ts` - Permission manipulation utilities (mergePermissions, filterPermissions)
  - `permissionsPattern.ts` - Pattern matching with wildcards (matchesPattern, findPermissionsByPattern)

See `security/README.md` for detailed documentation.

### `ui/` - Atomic UI Components

**Purpose**: Domain-agnostic, accessible UI components organized by category for better navigation and scalability.

**Organization**: Components are organized into categories:

- **Root-level**: Cross-cutting building blocks (accordion, affix, button, calendar, collapsible, error-boundary, heading, icon-button, icons, split-button, text, theme, theme-toggle, variants)
- **Category folders**: data-display/, feedback/, forms/, navigation/, overlays/, media/, utilities/, layout/

**Root-Level Components**:

- `accordion/` - Accordion component with expandable/collapsible sections
- `affix/` - Affix primitives (sticky headers/sidebars, anchored interactions)
- `button/` - Button component with variants and sizes
- `calendar/` - Calendar/date grid components (date picker building blocks)
- `collapsible/` - Accessible collapsible panels with keyboard shortcuts
- `error-boundary/` - UI-level error boundary fallbacks
- `heading/` - Reusable typography heading component (h1-h6)
- `icon-button/` - Icon button component
- `icons/` - Icon components and registry (Icon, ClearIcon, CloseIcon, HeartIcon, SearchIcon, SettingsIcon)
- `split-button/` - Split button patterns (primary action + menu trigger)
- `text/` - Reusable typography paragraph component
- `theme/` - Component token bridge (tokens.ts - bridges design tokens to component values)
- `theme-toggle/` - Theme toggle component (light → dark → system → light)
- `language-selector/` - Language selector component (LanguageSelector, LanguageSelectorFlag)
  - Provides UI components for selecting language with flag icons
  - Includes helpers, hooks, constants, and utilities for language metadata
- `variants/` - Component variants using class-variance-authority (button, iconButton, input, textarea, checkbox, switch, select, radio, badge, card, heading, link, text, skeleton, modal, spinner, label, errorText, helperText, icon, list, stepper)

**Category: `data-display/`** - Data visualization and read-only displays:

- `avatar/` - Avatar component for user profile images
- `badge/` - Status/label display component with multiple variants
- `card/` - Card container component
- `chart/` - Chart components (AreaChart, BarChart, LineChart, PieChart)
- `code/` - Code display component
- `code-block/` - Code block component with syntax highlighting
- `data-table/` - Advanced data table with filtering, sorting, pagination, selection
- `description-list/` - Description list component
- `list/` - List component (variants: default, bordered, divided)
- `meter/` - Meter/progress indicator component
- `stat/` - Stat card component with trend indicators
- `status-indicator/` - Status indicator component
- `table/` - Table component for displaying tabular data
- `timeline/` - Timeline component (horizontal and vertical orientations)
- `tree-view/` - Tree view component for hierarchical data

**Category: `feedback/`** - User feedback and status messaging:

- `alert/` - Alert notification component (intents: info, success, warning, error)
- `alert-dialog/` - Alert dialog component
- `banner/` - Static banner component for announcements
- `empty-state/` - Empty state component
- `notification-bell/` - Notification bell component with badge
- `progress/` - Progress bar component
- `skeleton/` - Loading skeleton component (variants: text, circular, rectangular)
- `snackbar/` - Snackbar component for lightweight notifications
- `spinner/` - Loading spinner component (sizes: sm, md, lg)
- `toast/` - Toast notification component (Toast, ToastContainer, ToastParts)

**Category: `forms/`** - Form controls and input components:

- `autocomplete/` - Autocomplete input component
- `checkbox/` - Checkbox component with label, error, helper text support
- `chip/` - Chip component (removable tag/filter)
- `color-input/` - Color input component
- `color-picker/` - Color picker component
- `combobox/` - Combobox component
- `currency-input/` - Currency input component
- `date-picker/` - Date picker component
- `date-range-picker/` - Date range picker component
- `email-input/` - Email input component
- `error-text/` - Error text display component
- `fieldset/` - Fieldset component
- `file-upload/` - File upload component
- `form-actions/` - Form actions component
- `form-group/` - Form group component
- `form-wizard/` - Form wizard component (multi-step form)
- `helper-text/` - Helper text display component
- `inline-edit/` - Inline edit component
- `input/` - Text input component
- `label/` - Form label component
- `multi-select/` - Multi-select component
- `number-input/` - Number input component
- `otp-input/` - OTP (One-Time Password) input component
- `password-input/` - Password input component
- `phone-input/` - Phone input component
- `radio/` - Radio button component
- `range-slider/` - Range slider component
- `rating/` - Rating component
- `rich-text-editor/` - Rich text editor component (TipTap-based)
- `search-input/` - Search input component
- `segmented-control/` - Segmented control component
- `select/` - Select/dropdown component
- `slider/` - Slider component
- `switch/` - Toggle switch component
- `tag-input/` - Tag input component
- `textarea/` - Textarea component
- `time-picker/` - Time picker component
- `toggle/` - Toggle component
- `transfer/` - Transfer component (dual list box)
- `wizard/` - Wizard component (multi-step flow)

**Category: `navigation/`** - Navigation and routing components:

- `anchor/` - Anchor component
- `app-bar/` - App bar component
- `bottom-navigation/` - Bottom navigation component
- `breadcrumbs/` - Breadcrumbs navigation component
- `floating-action-button/` - Floating action button component
- `link/` - Link component (navigation link)
- `menubar/` - Menubar component
- `navigation-menu/` - Navigation menu component
- `pagination/` - Pagination component
- `sidebar/` - Sidebar component
- `stepper/` - Stepper component (step-by-step progress indicator)
- `tabs/` - Tabs component

**Category: `overlays/`** - Overlay and dialog components:

- `action-sheet/` - Action sheet component
- `backdrop/` - Backdrop component
- `command-palette/` - Command palette component (searchable command interface)
- `confirm-dialog/` - Confirm dialog component
- `context-menu/` - Context menu component
- `dialog/` - Dialog component
- `drawer/` - Drawer component (side panel)
- `dropdown-menu/` - Dropdown menu component
- `hover-card/` - Hover card component
- `modal/` - Modal dialog component
- `popconfirm/` - Popconfirm component
- `popover/` - Popover component
- `portal/` - Portal component
- `prompt-dialog/` - Prompt dialog component
- `sheet/` - Sheet component
- `tooltip/` - Tooltip component

**Category: `media/`** - Media and rich content components:

- `carousel/` - Carousel component
- `image/` - Optimized image component
- `lightbox/` - Lightbox component
- `map/` - Map component (Google Maps integration)
- `marquee/` - Marquee component
- `qrcode/` - QR code component
- `signature-pad/` - Signature pad component
- `video/` - Video component

**Category: `utilities/`** - Utility components and helpers:

- `copy-button/` - Copy button component
- `focus-trap/` - Focus trap component
- `infinite-scroll/` - Infinite scroll component
- `loadable/` - Code splitting wrapper (Loadable, loadableFallback, loadableUtils)
- `loading-wrapper/` - Loading wrapper component
- `motion/` - Motion/animation components (MotionProvider, LayoutGroup, AnimatePresence, MotionBox, and various motion variants)
- `pull-to-refresh/` - Pull to refresh component
- `resizable/` - Resizable component
- `scroll-area/` - Scroll area component
- `scroll-to-top/` - Scroll to top component
- `sortable-list/` - Sortable list component
- `splitter/` - Splitter component
- `swipeable/` - Swipeable component
- `virtualized-list/` - Virtualized list component

**Category: `layout/`** - Layout primitives:

- `aspect-ratio/` - Aspect ratio component
- `box/` - Box component
- `container/` - Container component
- `divider/` - Divider component
- `flex/` - Flex component
- `grid/` - Grid component
- `separator/` - Separator component
- `stack/` - Stack component

**Guidelines**:

- Components are domain-agnostic and accessible
- Components are organized by category for better navigation
- Each component is organized in its own folder with related files
- Uses design tokens from `core/constants/designTokens.ts`
- Types exported from `@src-types/ui`
- See `ui/README.md` for detailed category structure

### `ports/` - Hexagonal Architecture Ports

**Purpose**: Defines interfaces/contracts for external dependencies following hexagonal architecture.

**Key ports**:

- `LoggerPort` - Structured logging (`debug`, `info`, `warn`, `error`) with contextual metadata.
- `StoragePort` - Key/value persistence abstraction (`getItem`, `setItem`, `removeItem`, etc.).
- `HttpPort` - HTTP client abstraction (generic `request` + verb helpers + interceptors).
- `AnalyticsPort` - Analytics contract (`initialize`, `trackPageView`, `trackEvent`, `identify`, `reset`).
- `AuthPort` - Authentication token contract (get/set tokens, subscribe to token changes, decode, expiry checks).

**Guidelines**:

- Pure TypeScript interfaces (no implementations).
- Infrastructure adapters implement these ports; React providers inject adapters via context.
- Domains/hooks consume ports, never import adapters directly.

### `providers/` - React Context Providers

**Purpose**: React context providers that inject port implementations into the component tree.

**Structure**:

- `logger/` - `LoggerProvider`, `LoggerContext`, `useLogger`.
- `http/` - `HttpProvider`, `HttpContext`, `useHttp`.
- `auth/` - `AuthProvider`, `AuthContext`, `useAuth`.
- `storage/` - `StorageProvider`, `StorageContext`, `useStorage`.
- `analytics/` - `AnalyticsProvider`, `AnalyticsContext`, `useAnalytics`.
- `toast/` - `ToastProvider`, `ToastContext`, `useToast` (pairs with core/ui toast components).
- `snackbar/` - Snackbar context/provider for lighter-weight notifications.

**Guidelines**:

- React-specific (context + hooks)
- Bridge between infrastructure adapters and domain code by injecting concrete `Port` implementations
- Providers sit at the top of `app/App.tsx`; hooks throw if used outside matching provider

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
| `auth/`      | ❌ No                                             | Auth token helpers (port-agnostic)                  |
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
