### Project Folder Structure

```
---
description: 'Folder structure, boundaries, and scaling conventions'
globs: ['**/*']
alwaysApply: false
---

## Folder Structure and Boundaries

### Root Layout (repo-level)

.
├── .cursor/                         # Cursor AI rules + automation metadata
├── .docker/                         # Docker helper assets (entry scripts, compose fragments)
├── .github/                         # GitHub workflows, issue templates, CodeQL (CI already wired)
├── .gitattributes / .gitignore      # Git normalization + ignore rules
├── .editorconfig / .prettierrc      # Formatting baselines (tabs, LF, prettier settings)
├── .nvmrc / .npmrc                  # Engine + pnpm enforcement (Node 22.21.1, pnpm 10.22.0)
├── .env.example                     # Environment variable template (mirrors runtime-config.json surface)
├── .cursorignore                    # Keeps node_modules, dist, coverage, etc. out of AI context
├── package.json                     # Scripts, workspaces, engines, packageManager (pnpm via Corepack)
├── pnpm-lock.yaml                   # Locked deps for deterministic installs
├── pnpm-workspace.yaml              # Workspace settings (onlyBuiltDependencies, ignoredBuiltDependencies)
├── tsconfig*.json                   # Base + app/node/vitest/build project references
├── vite.config.ts / vitest.config.ts# Vite + Vitest configs (path aliases, env-aware server/build)
├── playwright.config.ts             # Playwright config (dotenv loading, pnpm dev server, retries)
├── eslint.config.js                 # ESLint flat config (boundaries, jsx-a11y, testing-library, unicorn, security)
├── tailwind.config.ts / postcss.config.cjs
│                                    # Tailwind v4 + PostCSS pipeline wired to design tokens
├── docs/                            # Markdown docs (structure, tsconfig, config-files, docker, UI guide, wizard utilities)
├── scripts/                         # Repo automation (`check-bundle-size.js`)
├── Dockerfile* / docker-compose*.yml# Local + production docker definitions
├── public/                          # Manifest, icons, runtime-config.json, SEO assets
├── src/                             # Application source (see below)
├── tests/ / e2e/                    # Vitest unit tests + Playwright specs/utilities
├── coverage/ / dist/ / test-results/# Generated artifacts (gitignored)
├── LICENSE / CODEOWNERS / SECURITY.md
│                                    # Governance + disclosure
└── README.md                        # High-level overview + quickstart (links back to docs index)
# Notes:
# - .lighthouserc.json keeps performance budgets for CI audits
# - .github already ships CI; adjust workflows instead of recreating

src/
│
├── app/                                  # Application-level entry point and providers
│   ├── App.tsx                           # ✅ Root React component
│   │   # Combines ports, adapters, UI providers, analytics, and routing
│   │   # useHttpClientAuth(authAdapter) wires JWT storage into the HTTP client
│   │   # Composition order:
│   │   #   1. LoggerProvider (outermost, supplies logger to ErrorBoundary)
│   │   #   2. ErrorBoundaryWrapper (renders Error500 fallback + logs errors)
│   │   #   3. HttpProvider (injects httpClient implementing HttpPort)
│   │   #   4. AuthProvider (injects JwtAuthAdapter implementing AuthPort)
│   │   #   5. StorageProvider (injects localStorage adapter implementing StoragePort)
│   │   #   6. ThemeProvider (light/dark/system + persisted choice)
│   │   #   7. I18nProvider (react-i18next context, preloaded core + domain namespaces)
│   │   #   8. QueryProvider (TanStack Query v5, gcTime/staleTime tuned)
│   │   #   9. AnalyticsProvider (Google Analytics adapter w/ runtime config fallback)
│   │   #  10. MotionProvider (wraps Framer Motion LayoutGroup / reduced-motion handling)
│   │   #  11. ToastProvider (queue + dismissal logic)
│   │   #  12. BrowserRouter (React Router v7)
│   │   #  13. LayoutGroup (Framer Motion route transition grouping, inside BrowserRouter)
│   │   #  14. Router (App routes + transitions, inside LayoutGroup)
│   │   #  15. ToastContainer (renders toast notifications, inside ToastProvider but outside BrowserRouter)
│   │   # AnalyticsProvider toggles between googleAnalyticsAdapter and noopAnalyticsAdapter based on env.ANALYTICS_ENABLED
│   │   # Analytics configuration is determined by getAnalyticsConfig() which checks runtime config (ANALYTICS_WRITE_KEY) and environment variables (GA_MEASUREMENT_ID, GA_DEBUG, GA_DATALAYER_NAME)
│   │   # ToastContainer is placed inside ToastProvider but outside BrowserRouter for proper context access
│   │   # useHttpClientAuth hook is called at App component level (before providers) to sync AuthPort tokens with HttpPort interceptor
│   │
│   ├── main.tsx                          # ✅ Application bootstrap
│   │   # Initializes config (await initConfig()) - loads runtime config and sets up httpClient
│   │   # Initializes i18n (await i18nInitPromise) - ensures translations are loaded
│   │   # Initializes Web Vitals tracking (reportWebVitals) - only runs in production
│   │   # Imports domain i18n registrations (@domains/landing/i18n)
│   │   # Imports global CSS (@styles/globals.css)
│   │   # Creates React root and renders <App /> into DOM wrapped in StrictMode
│   │   # Throws error if root element #root not found
│   │   # Uses createRoot from react-dom/client (React 19+ API)
│   │   # All initialization is async and awaited before rendering
│   │
│   ├── router.tsx                        # ✅ Centralized route definitions
│   │   # Imports lazy-loaded pages from domains
│   │   # Supports lazy-loading using React.Suspense with DefaultLoadingFallback
│   │   # Uses PageWrapper.withTheme() HOC to inject theme props
│   │   # Uses AppLayout wrapper for consistent layout
│   │   # Uses RouteTransition for route change animations
│   │   # Tracks page views via useAnalytics hook on route changes
│   │   # Uses buildRoute() from @core/router/routes.gen for type-safe routes
│   │   # Wraps routes in LayoutGroup for Framer Motion route transitions
│   │   # Uses React Router v7 Routes and Route components
│   │
│   ├── components/                       # ✅ App-level components
│   │   ├── AppLayout.tsx                 # ✅ App-level layout wrapper
│   │   │   # Connects shared Layout component with app-level theme context
│   │   │   # Uses useTheme hook to get theme config and passes it to Layout
│   │   ├── PageWrapper.tsx               # ✅ HOC utilities for dependency injection
│   │   │   # withTheme() - Injects theme props into page components
│   │   │   # Allows domains to receive theme via props (respects boundaries)
│   │   │   # Bridges app-level theme context → domain pages via props
│   │   └── ProtectedRoute.tsx            # ✅ Route protection component
│   │       # Provides authentication and permission-based route guards
│   │       # Uses route guard utilities from @core/router/routes.guards
│   │       # Uses useAuth hook from @core/providers/auth/useAuth
│   │
│   ├── pages/                            # ✅ App-level system pages
│   │   ├── Error404.tsx                  # ✅ Not Found page (404 error)
│   │   │   # Displays "404 - Page not found" with link to home using ROUTES.HOME
│   │   └── Error500.tsx                  # ✅ Internal Server Error page (500 error)
│   │       # Displays "500 - Internal server error" with link to home using ROUTES.HOME
│   │
│   └── providers/                        # ✅ App-level context providers
│       ├── QueryProvider.tsx             # ✅ React Query / data fetching context
│       │   # Creates QueryClient with sensible defaults (retries, staleTime: 30s, gcTime: 5min)
│       │   # Uses @tanstack/react-query v5 API (gcTime instead of cacheTime)
│       ├── ThemeProvider.tsx             # ✅ Provides theme (light/dark/system)
│       │   # Syncs with system preference; persists user choice via storage adapter
│       │   # Theme accessed by domains via props injection (PageWrapper.withTheme)
│       │   # Uses StoragePort via useStorage hook to respect hexagonal architecture boundaries
│       ├── ThemeContext.tsx              # ✅ Theme context definition
│       ├── useTheme.ts                   # ✅ Hook to access theme context
│       └── I18nProvider.tsx              # ✅ Provides i18next instance for translations
│           # Wraps application with I18nextProvider from react-i18next
│           # Uses configured i18n instance from @core/i18n/i18n
│       # Core providers (Logger, Http, Auth, Storage, Analytics, Toast, Snackbar) live in @core/providers/**
│       # App composes those adapters/providers directly rather than re-exporting them here
│
├── core/                                 # Framework-agnostic, reusable, domain-independent code
│   ├── config/                           # ✅ App-wide configuration
│   │   ├── env.client.ts                 # ✅ Zod-validated import.meta.env surface (client-safe)
│   │   │   # Forbid raw import.meta.env usage outside this module
│   │   │   # Validates DEV, PROD, MODE with Zod schemas and defaults
│   │   ├── routes.ts                     # ✅ Global route path constants
│   │   │   # Central source of truth for path segments (currently: HOME)
│   │   │   # Exports ROUTES constant and RouteKey type
│   │   ├── runtime.ts                    # ✅ Runtime configuration loader
│   │   │   # Loads configuration from public/runtime-config.json
│   │   │   # Validates with Zod schema, supports API_BASE_URL and ANALYTICS_WRITE_KEY
│   │   │   # Provides getRuntimeConfig(), getAppConfig(), getCachedRuntimeConfig()
│   │   ├── init.ts                       # ✅ Configuration initialization
│   │   │   # Sets up runtime configuration and configures httpClient
│   │   │   # Should be called early in app lifecycle (main.tsx)
│   │   ├── featureFlags.ts               # ✅ Feature flag definitions with metadata and default values
│   │   │   # Central registry of all feature flags (FEATURE_FLAGS)
│   │   │   # Provides getFeatureFlagDefinition(), getAllFeatureFlagDefinitions(), validateFeatureFlags()
│   │   │   # Each flag has key, description, and enabled property (enabled is source of truth)
│   │   ├── features.ts                   # ✅ Feature flags runtime toggles
│   │   │   # Provides isFeatureEnabled(), isFeatureEnabledAsync(), getAllFeatureFlags(), getAllFeatureFlagsAsync()
│   │   │   # Supports runtime config overrides via runtime-config.json
│   │   │   # Runtime flags take precedence over definition defaults
│   │   └── seo.ts                        # ✅ SEO & Metadata configuration
│   │       # Centralized SEO defaults and helper functions (DEFAULT_SEO, mergeSEOConfig, buildPageTitle, buildAbsoluteUrl, etc.)
│   │       # Enables per-route metadata updates and improves sharing/discoverability
│   │
│   ├── api/                              # ✅ API service factory utilities
│   │   ├── createApiService.ts          # ✅ Main API service factory function
│   │   │   # Creates type-safe API services with request/response mapping, error handling, and validation
│   │   ├── createApiService.types.ts    # ✅ Type definitions (ApiService, ApiServiceConfig, ApiHttpMethod, etc.)
│   │   ├── createApiService.helpers.ts  # ✅ Helper functions (error context, mapper context, response processing)
│   │   └── createApiService.request.ts  # ✅ Request preparation utilities
│   │
│   ├── lib/                              # ✅ Framework-specific utilities
│   │   ├── http/                         # ✅ Fetch-based HTTP client implementation (HttpPort)
│   │   │   # httpClient.ts - Main HttpClient class implementing HttpPort
│   │   │   # httpClientConfig.ts - Default configuration and config utilities
│   │   │   # httpClientHeaders.ts - Header management utilities
│   │   │   # httpClientBody.ts - Request body serialization
│   │   │   # httpClientInterceptors.ts - Interceptor types and management
│   │   │   # httpClientRequest.ts - Request preparation and timeout handling
│   │   │   # httpClientResponse.ts - Response parsing and processing
│   │   │   # httpClientResponseParsing.ts - Response parsing utilities
│   │   │   # httpClientErrorCreation.ts - Error creation utilities
│   │   │   # httpClientErrorHandler.ts - Error handling utilities
│   │   │   # httpClientMethods.ts - HTTP method helpers (GET, POST, PUT, DELETE, etc.)
│   │   │   # httpClientUrl.ts - URL building utilities
│   │   │   # httpClientTimeout.ts - Timeout handling utilities
│   │   │   # httpAuthInterceptor.ts - Auth token interceptor that syncs AuthPort tokens
│   │   ├── ErrorBoundary.tsx             # ✅ Production-ready error boundary (uses react-router + logger)
│   │   ├── ErrorBoundaryWrapper.tsx      # ✅ Hooks-friendly wrapper that injects LoggerPort
│   │   ├── date/                         # ✅ SSR-safe date primitives
│   │   │   ├── date.ts                   # ✅ Date manipulation utilities (isValidDate, toDate, addDays, etc.)
│   │   │   ├── formatDate.ts             # ✅ Main date formatting (formatDate, formatDateTime)
│   │   │   ├── formatDate.types.ts       # ✅ Date formatting type definitions
│   │   │   ├── formatISO.ts              # ✅ ISO date formatting utilities
│   │   │   ├── formatRelativeTime.ts     # ✅ Relative time formatting utilities
│   │   │   └── formatTime.ts             # ✅ Time formatting utilities
│   │   ├── storeUtils.ts                 # ✅ Zustand store helpers (createSelector, StoreSelector type, StoreSlice, StoreActions, StoreWithActions)
│   │   └── googleMapsLoader.ts           # ✅ Utility for lazy-loading Google Maps JS API (used by infrastructure/maps)
│   │
│   ├── http/                             # ✅ HTTP error handling
│   │   ├── errorAdapter.ts               # ✅ HTTP error adapter for normalizing HTTP errors
│   │   │   # Maps HTTP status codes to domain error types (network, timeout, validation, etc.)
│   │   │   # Provides adapt() method via HttpErrorAdapter class
│   │   │   # Exports DomainErrorType, DomainError, adaptError() function, errorAdapter singleton
│   │   │   # Includes helper methods: isType(), isClientError(), isServerError(), isRetryable()
│   │   │   # Supports field-level validation error extraction
│   │   ├── errorAdapter.constants.ts     # ✅ Error adapter constants
│   │   ├── errorAdapter.handlers.ts      # ✅ Error handling functions
│   │   ├── errorAdapter.helpers.ts       # ✅ Helper functions (isType, isClientError, isServerError, isRetryable)
│   │   ├── errorAdapter.schemas.ts       # ✅ Zod schemas for API error responses and validation errors
│   │   └── errorAdapter.types.ts         # ✅ Type definitions (DomainErrorType, DomainError, etc.)
│   │
│   ├── utils/                            # ✅ Framework-agnostic utilities
│   │   ├── classNames.ts                 # ✅ Deterministic classNames helper (no dependency on clsx)
│   │   ├── hookUtils.ts                  # ✅ Shared hook helpers (e.g., getDependenciesKey)
│   │   ├── debounce/                     # ✅ Debounce implementation + helpers (leading/trailing/maxWait)
│   │   ├── throttle/                     # ✅ Throttle implementation + helpers
│   │   ├── seo/                          # ✅ SEO DOM utilities split by concern (basic/custom/openGraph/twitter/helpers)
│   │   └── themeCustomization.ts         # ✅ Runtime CSS variable overrides, persistence, reset helpers
│   │
│   ├── router/                        # ✅ Routing helpers and generated utilities
│   │   ├── routes.gen.ts              # ✅ Type-safe route builder helpers (buildRoute, ROUTE_KEYS, getRouteTemplate, isRouteKey)
│   │   │   # Generates strongly-typed utilities from @core/config/routes
│   │   │   # Provides buildRoute() for building routes with params, getRouteTemplate() for raw templates
│   │   │   # Type-safe RouteParams based on route path parameters
│   │   └── routes.guards.ts           # ✅ Route guard utilities for protected routes
│   │       # evaluateRouteGuards, authenticatedGuard, guestGuard, createPermissionGuard
│   │       # RouteGuard, RouteGuardResult, GuardEvaluationResult, RouteGuardContext types
│   │       # RouteGuardReason constants (NotAuthenticated, AlreadyAuthenticated, MissingPermissions)
│   │       # Used by ProtectedRoute component in @app/components/ProtectedRoute
│   # Optional directories not yet implemented:
│   # - analytics/ (analytics primitives, feature flags, metrics adapters)
│   #
│   ├── ports/                            # ✅ Hexagonal ports (framework-agnostic interfaces)
│   │   ├── LoggerPort.ts                 # ✅ Logging contract (debug/info/warn/error with context)
│   │   ├── StoragePort.ts                # ✅ Key/value persistence contract (local, session, memory, cookies)
│   │   ├── HttpPort.ts                   # ✅ HTTP client contract (request + verb helpers)
│   │   ├── AnalyticsPort.ts              # ✅ Analytics contract (initialize, trackPageView/Event, identify, reset)
│   │   └── AuthPort.ts                   # ✅ Authentication contract (tokens, listeners, decode, expiration helpers)
│   │
│   ├── providers/                        # ✅ React contexts bridging ports/adapters
│   │   ├── logger/                       # LoggerProvider, context, hook
│   │   ├── http/                         # HttpProvider, context, hook
│   │   ├── auth/                         # AuthProvider exposes AuthPort to the tree
│   │   ├── storage/                      # StorageProvider + useStorage hook
│   │   ├── analytics/                    # AnalyticsProvider + useAnalytics hook (Google Analytics, Segment, etc.)
│   │   ├── toast/                        # ToastProvider, ToastContext, useToast hook (queue mgmt, matches UI toast components)
│   │   └── snackbar/                     # SnackbarProvider + hook (optional lightweight notifications)
│   │
│   ├── hooks/                            # ✅ Generic reusable hooks (grouped by concern)
│   │   ├── async/useAsync.ts             # Promise orchestration with loading/error state + imperative execute()
│   │   ├── fetch/useFetch*.ts            # Declarative fetch hook w/ AbortController, retries, helpers, typed config
│   │   ├── debounce/useDebounce.ts       # Value + callback debouncing built on core/utils/debounce
│   │   ├── throttle/useThrottle.ts       # Value throttling + throttled callback helpers
│   │   ├── storage/useLocalStorage.ts    # Syncs with StorageProvider (JSON serialization, cross-tab events)
│   │   ├── storage/useSessionStorage.ts  # SessionStorage-backed state (falls back gracefully during SSR)
│   │   ├── http/useHttpClientAuth.ts     # Keeps HttpPort auth interceptor aligned with AuthPort tokens
│   │   ├── interval/useInterval.ts       # SSR-safe setInterval wrapper with pause/resume
│   │   ├── motion/*                      # Framer-motion friendly hooks (useMotionValue, useMotionSpring, useInView, useScrollProgress, etc.)
│   │   ├── scroll/useScrollPosition.ts   # Scroll position tracking with throttling + SSR guards
│   │   ├── ui/useMediaQuery.ts           # Media query listener (respects prefers-reduced-motion)
│   │   ├── ui/useWindowSize.ts           # Window size tracking (debounced, SSR defaults)
│   │   ├── ui/useToggle.ts               # Boolean helper
│   │   ├── ui/usePrevious.ts             # Previous value ref helper
│   │   └── seo/useSEO.ts                 # Document head orchestration built on core/config/seo + seoDomUtils
│   │
│   ├── a11y/                             # ✅ Accessibility utilities
│   │   ├── focus/                        # ✅ Focus management utilities
│   │   │   ├── constants.ts              # ✅ Focus-related constants (FOCUSABLE_SELECTOR, etc.)
│   │   │   ├── focus.ts                  # ✅ Focus management functions
│   │   │   │   # Framework-agnostic focus utilities for accessible components
│   │   │   │   # getFocusableElements, focusFirstElement, focusLastElement, isFocusable, handleTabNavigation, saveActiveElement
│   │   │   └── helpers.ts                # ✅ Internal helper functions for focus utilities
│   │   └── skipToContent.tsx             # ✅ Skip link component for keyboard navigation
│   │       # Accessible skip-to-content link with visible-on-focus behavior
│   │       # Configurable targetId and label
│   │
│   ├── forms/                            # ✅ Form abstraction layer
│   │   ├── formAdapter.ts                # ✅ Form abstraction over react-hook-form
│   │   │   # Library-agnostic form handling interface
│   │   │   # useFormAdapter hook wraps useForm with consistent FormControls interface
│   │   ├── controller.tsx                 # ✅ Controller component for controlled components
│   │   │   # Exports Controller from react-hook-form through adapter layer
│   │   │   # For components that don't work with the register API
│   │   └── useController.ts              # ✅ useController hook for controlled components
│   │       # Exports useController from react-hook-form through adapter layer
│   │       # Provides programmatic control of form fields
│   │
│   ├── security/                         # ✅ Security utilities
│   │   ├── sanitize/                     # ✅ HTML sanitization utilities (XSS prevention)
│   │   │   ├── sanitizeHtml.ts          # ✅ Main sanitization functions
│   │   │   │   # escapeHtml - Escape HTML entities (safest for untrusted content)
│   │   │   │   # sanitizeHtml - Sanitize HTML with configurable allowed tags/attributes
│   │   │   ├── sanitizeHtmlEscape.ts    # ✅ HTML escaping utilities (escapeHtml function)
│   │   │   ├── sanitizeHtmlDOMPurify.ts # ✅ DOMPurify integration (sanitizeHtmlWithDOMPurify function, isDOMPurifyAvailable)
│   │   │   ├── sanitizeHtmlConstants.ts # ✅ Constants and default configuration
│   │   │   ├── sanitizeHtmlTypes.ts     # ✅ Type definitions (SanitizeConfig, DOMPurifyConfig, etc.)
│   │   │   └── sanitizeHtmlHelpers.ts   # ✅ Internal helper functions
│   │   ├── csp/                          # ✅ Content Security Policy helpers
│   │   │   ├── types.ts                  # ✅ Type definitions (HashAlgorithm, CSPDirectives)
│   │   │   ├── nonce.ts                  # ✅ Nonce generation and validation
│   │   │   ├── hash.ts                   # ✅ Hash generation for inline content (SHA-256/384/512)
│   │   │   ├── policy.ts                 # ✅ Policy building, parsing, and recommended CSP
│   │   │   ├── helpers.ts                # ✅ Internal helper functions for policy operations
│   │   │   └── cryptoUtils.ts            # ✅ Shared crypto API utilities (internal)
│   │   └── permissions/                  # ✅ Permission model helpers
│   │       ├── permissionsTypes.ts       # ✅ Type definitions for the permission system
│   │       ├── permissionsCheck.ts       # ✅ Basic permission checking functions (hasPermission, hasAllPermissions, hasAnyPermission)
│   │       ├── permissionsValidate.ts    # ✅ Detailed permission validation with results (checkPermissions)
│   │       ├── permissionsRoles.ts        # ✅ Role-based permission management (getPermissionsFromRoles)
│   │       ├── permissionsManipulate.ts   # ✅ Permission manipulation utilities (mergePermissions, filterPermissions)
│   │       └── permissionsPattern.ts     # ✅ Pattern matching with wildcards (matchesPattern, findPermissionsByPattern)
│   │
│   ├── i18n/                             # ✅ Internationalization system
│   │   ├── i18n.ts                        # ✅ Core i18next instance configuration
│   │   │   # Registers common translations, initializes i18next, sets up RTL support
│   │   │   # Exports configured i18n instance and initialization promise
│   │   ├── useTranslation.ts              # ✅ Custom hook wrapper with automatic resource loading
│   │   │   # Provides useTranslation hook that automatically loads resources on-demand
│   │   │   # Type-safe translation function with autocomplete
│   │   ├── useRtl.ts                      # ✅ Hook to check if current language is RTL
│   │   │   # Returns boolean indicating if current language requires RTL layout
│   │   │   # Automatically updates when language changes
│   │   ├── resourceLoader.ts              # ✅ Dynamic resource loading system (main export)
│   │   │   # Main entry point for resource loading, imports from sub-modules
│   │   ├── resourceLoader/                # ✅ Resource loading sub-modules
│   │   │   ├── cache.ts                   # ✅ Resource caching utilities (clearResourceCacheFor, isResourceCached, isResourceLoading)
│   │   │   ├── i18n.ts                    # ✅ i18next integration functions (addResourceToI18n, loadAndAddResource)
│   │   │   ├── load.ts                    # ✅ Resource loading functions (loadResource)
│   │   │   ├── registry.ts                # ✅ Resource loader registry (registerResourceLoader, getRegisteredNamespaces, clearResourceLoaders)
│   │   │   ├── types.ts                    # ✅ Type definitions (ResourceLoader, TranslationResource, AddResourceOptions, etc.)
│   │   │   └── validation.ts               # ✅ Resource validation utilities
│   │   ├── registry.ts                    # ✅ Domain translation registration system
│   │   │   # registerDomainTranslations() - Register domain translations
│   │   │   # registerCommonTranslations() - Register common translations
│   │   ├── constants/                     # ✅ Centralized i18n constants
│   │   │   └── constants.ts               # ✅ SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, RTL_LANGUAGES
│   │   │       # LANGUAGE_STORAGE_KEY, LANGUAGE_DETECTION_ORDER
│   │   │       # Helper functions: isSupportedLanguage, isRtlLanguage, normalizeLanguage
│   │   ├── errors.ts                      # ✅ Custom error classes for i18n resource loading
│   │   │   # ResourceLoaderNotFoundError, InvalidResourceFormatError
│   │   ├── hooks/                         # ✅ Internal hooks for resource loading state management
│   │   │   ├── useTranslationHelpers.ts   # ✅ Helper functions for resource loading state management
│   │   │   │   # isResourceLoadedInI18n, ensureResourceLoaded, handleInitialLoad, handleExistingLoad, updateLoadingState
│   │   │   ├── useTranslationLoader.ts    # ✅ Hook for managing resource loading effects
│   │   │   │   # useResourceLoader, useResourceLoadingEffects - handles loading effects and language changes
│   │   │   └── useTranslationState.ts      # ✅ Hook for managing translation loading state
│   │   │       # useResourceLoadingState, useLoadingStateUpdater - manages loading state per namespace/language
│   │   ├── types/                         # ✅ TypeScript types for translation keys
│   │   │   └── types.ts                    # ✅ Type definitions for translation interfaces (common, landing, etc.)
│   │   │       # Provides type-safe translation key access
│   │   └── locales/                       # ✅ Common/shared translations
│   │       ├── en.json                    # ✅ English translations
│   │       ├── es.json                    # ✅ Spanish translations
│   │       └── ar.json                    # ✅ Arabic translations (RTL)
│   │   # Domain translations are co-located with domains: domains/<domain>/i18n/
│   │
│   ├── perf/                               # ✅ Performance utilities
│   │   └── reportWebVitals.ts              # ✅ Core Web Vitals performance monitoring
│   │       # Tracks and reports Core Web Vitals metrics (LCP, INP, CLS, FCP, TTFB)
│   │       # Only runs in production mode
│   │       # Uses logger adapter for reporting (can be extended to analytics services)
│   │
│   #
│   ├── ui/                               # ✅ Atomic UI components
│   │   # Components are domain-agnostic and accessible
│   │   # Components are organized by category for better navigation and scalability
│   │   # Category structure: data-display/, feedback/, forms/, navigation/, overlays/, media/, utilities/, layout/
│   │   # Root-level components: accordion/, affix/, button/, calendar/, collapsible/, error-boundary/, heading/, icon-button/, icons/, split-button/, text/, theme/, theme-toggle/, variants/
│   │   # Root-level components (cross-cutting building blocks)
│   │   ├── accordion/                        # ✅ Accordion component (expandable/collapsible sections)
│   │   ├── affix/                            # ✅ Affix primitives (sticky headers/sidebars, anchored interactions)
│   │   ├── button/                           # ✅ Button component (primary, secondary, ghost variants)
│   │   ├── calendar/                         # ✅ Calendar/date grid components (date picker building blocks, range selection, keyboard support)
│   │   ├── collapsible/                      # ✅ Accessible collapsible panels with keyboard shortcuts
│   │   ├── error-boundary/                   # ✅ UI-level error boundary fallbacks (distinct from core/lib ErrorBoundary)
│   │   ├── heading/                          # ✅ Typography heading component (h1-h6)
│   │   ├── icon-button/                      # ✅ Icon button component
│   │   ├── icons/                            # ✅ Icon components and registry (Icon, ClearIcon, CloseIcon, HeartIcon, SearchIcon, SettingsIcon)
│   │   ├── split-button/                     # ✅ Split button patterns (primary action + menu trigger)
│   │   ├── text/                             # ✅ Typography paragraph component
│   │   ├── theme/                             # ✅ Component token bridge (tokens.ts - bridges design tokens to component values)
│   │   ├── theme-toggle/                     # ✅ Theme toggle component (light → dark → system → light)
│   │   ├── language-selector/                # ✅ Language selector component (LanguageSelector, LanguageSelectorFlag)
│   │   │   # Provides UI components for selecting language with flag icons
│   │   │   # Includes helpers, hooks, constants, and utilities for language metadata
│   │   ├── variants/                         # ✅ Component variants using class-variance-authority (button, iconButton, input, textarea, checkbox, switch, select, radio, badge, card, heading, link, text, skeleton, modal, spinner, label, errorText, helperText, icon, list, stepper)
│   │   │
│   │   # Category-based organization
│   │   ├── data-display/                     # ✅ Data visualization and read-only displays
│   │   │   ├── avatar/                       # ✅ Avatar component for user profile images
│   │   │   ├── badge/                        # ✅ Status/label display component (variants: default, primary, success, warning, error, info)
│   │   │   ├── card/                         # ✅ Card container component (variants: elevated, outlined, flat)
│   │   │   ├── chart/                        # ✅ Chart components (AreaChart, BarChart, LineChart, PieChart with shared components)
│   │   │   ├── code/                         # ✅ Code display component
│   │   │   ├── code-block/                   # ✅ Code block component with syntax highlighting
│   │   │   ├── data-table/                   # ✅ Advanced data table with filtering, sorting, pagination, selection
│   │   │   ├── description-list/              # ✅ Description list component
│   │   │   ├── list/                          # ✅ List component (variants: default, bordered, divided; with ListGroup, ListItem, ListContext)
│   │   │   ├── meter/                         # ✅ Meter/progress indicator component
│   │   │   ├── stat/                         # ✅ Stat card component with trend indicators
│   │   │   ├── status-indicator/              # ✅ Status indicator component
│   │   │   ├── table/                        # ✅ Table component (Table, TableHeader, TableBody, TableRow, TableCell, TableEmptyState)
│   │   │   ├── timeline/                      # ✅ Timeline component (horizontal and vertical orientations)
│   │   │   └── tree-view/                     # ✅ Tree view component for hierarchical data
│   │   │
│   │   ├── feedback/                         # ✅ User feedback and status messaging
│   │   │   ├── alert/                        # ✅ Alert notification component (intents: info, success, warning, error)
│   │   │   ├── alert-dialog/                 # ✅ Alert dialog component
│   │   │   ├── banner/                       # ✅ Static banner component for announcements
│   │   │   ├── empty-state/                  # ✅ Empty state component (EmptyState, EmptyStateIcon, EmptyStateContent, EmptyStateAction)
│   │   │   ├── notification-bell/            # ✅ Notification bell component with badge
│   │   │   ├── progress/                     # ✅ Progress bar component
│   │   │   ├── skeleton/                     # ✅ Loading skeleton component (variants: text, circular, rectangular)
│   │   │   ├── snackbar/                     # ✅ Snackbar component for lightweight notifications
│   │   │   ├── spinner/                      # ✅ Loading spinner component (sizes: sm, md, lg)
│   │   │   └── toast/                        # ✅ Toast notification component (Toast, ToastContainer, ToastParts)
│   │   │
│   │   ├── forms/                            # ✅ Form controls and input components
│   │   │   ├── autocomplete/                 # ✅ Autocomplete input component
│   │   │   ├── checkbox/                     # ✅ Checkbox component (moved from root)
│   │   │   ├── chip/                         # ✅ Chip component (removable tag/filter)
│   │   │   ├── color-input/                  # ✅ Color input component
│   │   │   ├── color-picker/                 # ✅ Color picker component
│   │   │   ├── combobox/                     # ✅ Combobox component
│   │   │   ├── currency-input/                # ✅ Currency input component
│   │   │   ├── date-picker/                  # ✅ Date picker component
│   │   │   ├── date-range-picker/            # ✅ Date range picker component
│   │   │   ├── email-input/                  # ✅ Email input component
│   │   │   ├── error-text/                   # ✅ Error text display component (moved from root)
│   │   │   ├── fieldset/                     # ✅ Fieldset component
│   │   │   ├── file-upload/                  # ✅ File upload component
│   │   │   ├── form-actions/                 # ✅ Form actions component
│   │   │   ├── form-group/                   # ✅ Form group component
│   │   │   ├── form-wizard/                  # ✅ Form wizard component (multi-step form)
│   │   │   ├── helper-text/                   # ✅ Helper text display component (moved from root)
│   │   │   ├── inline-edit/                  # ✅ Inline edit component
│   │   │   ├── input/                        # ✅ Text input component (moved from root; with InputContent, InputField, InputIcon, InputLabel, InputMessages, InputWrapper, useInput)
│   │   │   ├── label/                        # ✅ Form label component (moved from root)
│   │   │   ├── multi-select/                 # ✅ Multi-select component
│   │   │   ├── number-input/                  # ✅ Number input component
│   │   │   ├── otp-input/                    # ✅ OTP (One-Time Password) input component
│   │   │   ├── password-input/                # ✅ Password input component
│   │   │   ├── phone-input/                   # ✅ Phone input component
│   │   │   ├── radio/                        # ✅ Radio button component (moved from root)
│   │   │   ├── range-slider/                  # ✅ Range slider component
│   │   │   ├── rating/                       # ✅ Rating component
│   │   │   ├── rich-text-editor/             # ✅ Rich text editor component (TipTap-based)
│   │   │   ├── search-input/                  # ✅ Search input component
│   │   │   ├── segmented-control/             # ✅ Segmented control component
│   │   │   ├── select/                       # ✅ Select/dropdown component (moved from root)
│   │   │   ├── slider/                       # ✅ Slider component
│   │   │   ├── switch/                       # ✅ Toggle switch component (moved from root)
│   │   │   ├── tag-input/                    # ✅ Tag input component
│   │   │   ├── textarea/                     # ✅ Textarea component (moved from root)
│   │   │   ├── time-picker/                  # ✅ Time picker component
│   │   │   ├── toggle/                       # ✅ Toggle component
│   │   │   ├── transfer/                     # ✅ Transfer component (dual list box)
│   │   │   └── wizard/                       # ✅ Wizard component (multi-step flow)
│   │   │
│   │   ├── navigation/                       # ✅ Navigation and routing components
│   │   │   ├── anchor/                       # ✅ Anchor component
│   │   │   ├── app-bar/                      # ✅ App bar component
│   │   │   ├── bottom-navigation/            # ✅ Bottom navigation component
│   │   │   ├── breadcrumbs/                   # ✅ Breadcrumbs navigation component (moved from root)
│   │   │   ├── floating-action-button/        # ✅ Floating action button component
│   │   │   ├── link/                         # ✅ Link component (navigation link; moved from root)
│   │   │   ├── menubar/                      # ✅ Menubar component
│   │   │   ├── navigation-menu/               # ✅ Navigation menu component
│   │   │   ├── pagination/                   # ✅ Pagination component (moved from root; with PaginationButton, PaginationButtons, FirstLastButtons, PrevNextButtons, PageNumberButtons)
│   │   │   ├── sidebar/                      # ✅ Sidebar component
│   │   │   ├── stepper/                      # ✅ Stepper component (step-by-step progress indicator; moved from root)
│   │   │   └── tabs/                         # ✅ Tabs component (moved from root; with TabsList, TabButton, TabButtonContent, TabsPanel)
│   │   │
│   │   ├── overlays/                         # ✅ Overlay and dialog components
│   │   │   ├── action-sheet/                 # ✅ Action sheet component
│   │   │   ├── backdrop/                     # ✅ Backdrop component
│   │   │   ├── command-palette/               # ✅ Command palette component (searchable command interface)
│   │   │   ├── confirm-dialog/                # ✅ Confirm dialog component
│   │   │   ├── context-menu/                  # ✅ Context menu component
│   │   │   ├── dialog/                        # ✅ Dialog component
│   │   │   ├── drawer/                       # ✅ Drawer component (side panel; moved from root)
│   │   │   ├── dropdown-menu/                 # ✅ Dropdown menu component (moved from root)
│   │   │   ├── hover-card/                    # ✅ Hover card component (moved from root)
│   │   │   ├── modal/                        # ✅ Modal dialog component (moved from root)
│   │   │   ├── popconfirm/                    # ✅ Popconfirm component
│   │   │   ├── popover/                       # ✅ Popover component (moved from root)
│   │   │   ├── portal/                       # ✅ Portal component
│   │   │   ├── prompt-dialog/                 # ✅ Prompt dialog component
│   │   │   ├── sheet/                        # ✅ Sheet component
│   │   │   └── tooltip/                      # ✅ Tooltip component (moved from root)
│   │   │
│   │   ├── media/                            # ✅ Media and rich content components
│   │   │   ├── carousel/                     # ✅ Carousel component
│   │   │   ├── image/                        # ✅ Optimized image component (moved from root)
│   │   │   ├── lightbox/                     # ✅ Lightbox component
│   │   │   ├── map/                          # ✅ Map component (Google Maps integration)
│   │   │   ├── marquee/                      # ✅ Marquee component
│   │   │   ├── qrcode/                       # ✅ QR code component
│   │   │   ├── signature-pad/                # ✅ Signature pad component
│   │   │   └── video/                        # ✅ Video component
│   │   │
│   │   ├── utilities/                        # ✅ Utility components and helpers
│   │   │   ├── copy-button/                   # ✅ Copy button component
│   │   │   ├── focus-trap/                    # ✅ Focus trap component
│   │   │   ├── infinite-scroll/               # ✅ Infinite scroll component
│   │   │   ├── loadable/                      # ✅ Code splitting wrapper (Loadable, loadableFallback, loadableUtils; moved from root)
│   │   │   ├── loading-wrapper/               # ✅ Loading wrapper component
│   │   │   ├── motion/                        # ✅ Motion/animation components (MotionProvider, LayoutGroup, AnimatePresence, MotionBox, and various motion variants)
│   │   │   ├── pull-to-refresh/               # ✅ Pull to refresh component
│   │   │   ├── resizable/                     # ✅ Resizable component (moved from root)
│   │   │   ├── scroll-area/                   # ✅ Scroll area component
│   │   │   ├── scroll-to-top/                 # ✅ Scroll to top component
│   │   │   ├── sortable-list/                 # ✅ Sortable list component
│   │   │   ├── splitter/                     # ✅ Splitter component
│   │   │   ├── swipeable/                    # ✅ Swipeable component
│   │   │   └── virtualized-list/              # ✅ Virtualized list component
│   │   │
│   │   └── layout/                           # ✅ Layout primitives
│   │       ├── aspect-ratio/                  # ✅ Aspect ratio component
│   │       ├── box/                           # ✅ Box component
│   │       ├── container/                     # ✅ Container component
│   │       ├── divider/                      # ✅ Divider component (moved from root)
│   │       ├── flex/                          # ✅ Flex component
│   │       ├── grid/                          # ✅ Grid component
│   │       ├── separator/                     # ✅ Separator component
│   │       └── stack/                         # ✅ Stack component
│   │
│   ├── constants/                        # ✅ Core/global constants
│   │   ├── designTokens.ts               # ✅ Design tokens (colors, radius, spacing)
│   │   │   # Single source of truth for design system values
│   │   ├── theme.ts                      # ✅ Theme type definitions
│   │   │   # Defines Theme type ('light' | 'dark' | 'system') and THEMES constant
│   │   ├── ui.ts                         # ✅ UI component constants
│   │   │   # Size classes for icons, text, buttons, inputs, spinners, modals
│   │   │   # Uses types from @src-types/ui
│   │   ├── endpoints.ts                  # ✅ API endpoint constants
│   │   │   # Central source of truth for API endpoint paths (API_ENDPOINTS)
│   │   │   # Provides buildApiUrl() helper to combine with baseURL
│   │   ├── env.ts                        # ✅ Environment-derived constants
│   │   │   # Thin wrapper around env providing convenience accessors
│   │   │   # Exports IS_DEV, IS_PROD, ENV_MODE, isDevelopment(), isProduction(), getMode()
│   │   ├── aria.ts                       # ✅ ARIA roles and attribute constants
│   │   │   # Central source of truth for consistent ARIA usage
│   │   │   # Exports ARIA_ROLES, ARIA_LIVE, ARIA_BUSY, ARIA_EXPANDED, ARIA_CHECKED, etc.
│   │   │   # Provides createAriaLabel() helper function
│   │   ├── breakpoints.ts                 # ✅ Breakpoint constants for responsive design
│   │   │   # Defines standard responsive breakpoints (xs, sm, md, lg, xl, 2xl)
│   │   │   # Provides getBreakpoint(), createMinWidthQuery(), createMaxWidthQuery(), createRangeQuery()
│   │   ├── regex.ts                       # ✅ Regular expression patterns for validation
│   │   │   # Central source of truth for validation patterns (EMAIL, URL, PHONE, UUID, etc.)
│   │   │   # Provides testRegex() helper function
│   │   └── timeouts.ts                    # ✅ Timeout constants for network and UI operations
│   │       # Exports HTTP_TIMEOUTS, UI_TIMEOUTS, RETRY_TIMEOUTS
│   │       # All values in milliseconds with type-safe exports
│   │
│   └── README.md                         # ✅ Documentation explaining lib/ vs utils/ distinction
│
│   # All core directories are implemented
│
├── domains/                              # Self-contained business domains
│   └── landing/                          # ✅ Landing domain (minimal demonstration domain)
│       ├── pages/                         # ✅ Full-page components for routing
│       │   └── LandingPage.tsx             # ✅ Landing page component
│       │       # Receives theme via props (from PageWrapper.withTheme)
│       │       # Uses useTranslation hook for i18n
│       │       # Minimal implementation demonstrating domain structure
│       │       # Never imports from @app or @infra - respects boundaries
│       │
│       ├── services/                       # ✅ Domain services
│       │   └── api/                        # ✅ API service implementations
│       │       └── getDemoContentService.ts # ✅ Example API service using createApiService (exports createDemoContentService factory)
│       │
│       ├── store/                         # ✅ Domain state management (Zustand)
│       │   ├── landingStore.ts            # ✅ Counter example store with typed actions, selectors, initial state
│       │   │   # Demonstrates selectors (count, isLoading, error) and actions (increment, decrement, reset)
│       │   └── README.md                  # ✅ Store usage guidelines and best practices
│       └── i18n/                          # ✅ Domain translations
│           ├── index.ts                    # ✅ Registration file using registerDomainTranslations() with async IIFE pattern
│           ├── en.json                     # ✅ English translations
│           ├── es.json                     # ✅ Spanish translations
│           └── ar.json                     # ✅ Arabic translations (RTL)
│       # components/, hooks/, routes.ts, models/, constants.ts - Optional, not yet implemented
│
│   └── shared/                              # ✅ Cross-domain shared features
│       └── components/                      # ✅ Shared composite components
│           ├── autocomplete-combobox/       # Accessible combobox built on core/ui primitives
│           │   # Includes body/field/parts components + helpers + hooks (state, handlers, ids, setup)
│           ├── date-picker/                 # Date picker surface (ISO parsing, validation)
│           └── slider/                      # Slider widget (model, view, helpers, types)
│       # auth/, notifications/, analytics/ - Optional, not yet implemented
│
├── infrastructure/                        # Technical adapters & framework-specific code
│   ├── analytics/                        # ✅ Analytics adapters
│   │   └── googleAnalyticsAdapter.ts     # ✅ Google Analytics (GA4) adapter implementation
│   │       # Implements AnalyticsPort interface
│   │       # Uses gtag.js for Google Analytics 4 tracking
│   │       # Supports page views, events, user identification, user properties, reset
│   │       # SSR-safe with browser environment checks
│   │       # Exports googleAnalyticsAdapter instance and noopAnalyticsAdapter for testing
│   │       # Can be extended/replaced with other analytics providers (Segment, Mixpanel, etc.)
│   ├── auth/                             # ✅ Auth adapters
│   │   ├── jwtAuthAdapter.ts             # ✅ AuthPort implementation with JWT decode/persistence helpers
│   │   │   # Supports listeners, refresh token storage, expiration checks, storage injection
│   │   └── jwtUtils.ts                   # ✅ decodeJwt, extractNumericClaim helpers shared with adapter
│   ├── logging/                          # ✅ Logging adapter
│   │   └── loggerAdapter.ts              # ✅ Console-based logging implementation
│   │       # Implements LoggerPort interface
│   │       # SSR-safe with availability checks
│   │       # Supports debug, info, warn, error levels
│   │       # Can be extended/replaced with external services (Sentry, LogRocket)
│   ├── maps/                             # ✅ Google Maps adapter (script loader + helpers)
│   │   └── googleMapsAdapter.ts          # ✅ Dynamically loads Maps JS API w/ optional libraries + marker support
│   └── storage/                          # ✅ Storage adapters
│       ├── localStorageAdapter.ts         # ✅ Encapsulates localStorage access
│       │   # Implements StoragePort interface
│       │   # SSR-safe with availability checks
│       │   # Handles private browsing mode and quota exceeded errors
│       │   # Domains access via useStorage() hook (not direct import)
│       │
│       ├── sessionStorageAdapter.ts       # ✅ Encapsulates sessionStorage access
│       │   # Implements StoragePort interface
│       │   # SSR-safe with availability checks
│       │   # Handles private browsing mode and quota exceeded errors
│       │   # Tab-specific storage (doesn't persist across browser sessions)
│       │   # Access via useSessionStorage() hook (direct adapter import)
│       │
│       ├── memoryStorageAdapter.ts        # ✅ In-memory storage implementation
│       │   # Implements StoragePort interface
│       │   # Useful for SSR environments and testing
│       │   # Temporary storage that doesn't persist across page reloads
│       │
│       └── cookieStorageAdapter.ts        # ✅ Encapsulates cookie access
│           # Implements StoragePort interface
│           # SSR-safe cookie handling
│           # Supports cookie options (expires, path, sameSite, secure, domain)
│           # Uses setItemWithOptions() for advanced cookie configuration
│           # Domains access via useStorage() hook (not direct import)
│           # Related files:
│           #   - cookieStorageAdapter.constants.ts: Constants (DEFAULT_COOKIE_EXPIRATION_DAYS, isCookieStorageAvailable)
│           #   - cookieStorageAdapter.logging.ts: Logging utilities (logCookieWarn)
│           #   - cookieStorageAdapter.parsing.ts: Cookie parsing utilities (parseCookies)
│           #   - cookieStorageAdapter.serialization.ts: Cookie serialization utilities (serializeCookieOptions)
│   # api/, observability/, security/, storage/indexeddb/ - Optional, not yet implemented
│
│   # Hexagonal Architecture: Adapters implement ports; domains depend on ports only
│   # Adapters are injected at app level via providers
│
├── shared/                                # ✅ Reusable composite components & helpers
│   └── components/                        # ✅ Shared components
│       └── layout/                        # ✅ Layout components
│           ├── Layout.tsx                 # ✅ Main layout wrapper with Navbar
│           │   # Accepts theme config and children
│           # Includes SkipToContent component from @core/a11y/skipToContent
│           │   # Wraps content in <main id="main-content"> for accessibility
│           │   # Provides consistent page structure
│           └── Navbar.tsx                 # ✅ Main navigation component
│               # Includes navigation links
│               # Optional theme toggle (if theme prop provided)
│               # Domain-agnostic: uses routes from core/config/routes
│               # Note: ThemeToggle component is imported from @core/ui/theme-toggle/ThemeToggle
│       # navigation/, data-display/, feedback/, animated/, hooks/, utils/ - Optional, not yet implemented
│
├── styles/                                # ✅ Global styles
│   └── globals.css                        # ✅ Global CSS with Tailwind directives
│       # Includes @tailwind base, components, utilities
│       # Tailwind config is at root level (tailwind.config.ts)
│   # base/, utilities/, theme/, lib/ - Optional, not yet implemented
│
├── vite-env.d.ts                          # ✅ Vite type definitions
│
├── types/                                 # ✅ Cross-cutting type definitions
│   ├── ui/                                # ✅ UI component type definitions
│   │   ├── base.ts                        # Shared props (children, className, data-testid, etc.)
│   │   ├── buttons.ts / controls.ts       # Button/IconButton + checkbox/radio/switch props
│   │   ├── data.ts                        # Table, pagination, avatar, stat cards
│   │   ├── display/                       # Badge, card, divider, list, progress, skeleton, stepper, timeline, typography
│   │   ├── forms.ts                       # Input/Textarea/Select prop contracts
│   │   ├── icons.ts                        # Icon registry + props
│   │   ├── layout.ts / navigation.ts      # Layout + nav primitives
│   │   ├── overlays.ts                    # Modal/Popover/Tooltip props
│   │   ├── rating.ts                      # Rating/star components
│   │   ├── shared.ts                      # Shared tokens/common tokens bridging types
│   │   ├── theme.ts                       # Theme + token mapping
│   │   └── typography.ts                  # Heading/Text props
│   │   # All UI components import from @src-types/ui/<category>
│   ├── common.ts                          # ✅ Common utility types
│   │   # Exports Optional, Required, DeepPartial, DeepRequired, ValueOf, KeysOfType
│   │   # VoidFunction, NoArgFunction, UnaryFunction, BinaryFunction, NonEmptyArray
│   │   # Primitive, StringRecord, NumberRecord, Nullable, Maybe, MaybeNull
│   │   # Brand, Timestamp, ID, UUID
│   ├── callbacks.ts                       # ✅ Callback function types
│   │   # Exports DebouncedFunction, ThrottledFunction, AsyncCallback, SyncCallback, etc.
│   │   # Import callback types directly from core utils
│   ├── config.ts                          # ✅ Configuration types
│   │   # Import Env, AppConfig, RuntimeConfig directly from core config
│   │   # Exports FeatureFlag, FeatureFlagsConfig types
│   ├── datetime.ts                        # ✅ Date and time types
│   │   # Exports DateLike, DateFormat, DateRange, TimeRange, Duration, RelativeTime, etc.
│   ├── errors.ts                          # ✅ Error types
│   │   # Exports AppError, ValidationError, ApiError, NetworkError, TimeoutError, etc.
│   │   # Provides type-safe error handling structures
│   ├── http.ts                            # ✅ HTTP-related types
│   │   # Types for HttpClientResponse, HttpClientError, and HTTP client utilities
│   │   # Import HTTP types directly from @core/ports/HttpPort
│   ├── hooks.ts                           # ✅ Hook-related types
│   │   # Types for custom hooks and hook utilities
│   │   # Import hook return types directly from core hooks
│   ├── forms.ts                           # ✅ Form-related types
│   │   # Types for form handling and validation
│   │   # Import form types directly from @core/forms/formAdapter
│   ├── pagination.ts                      # ✅ Pagination types
│   │   # Types for paginated data and pagination utilities
│   ├── result.ts                          # ✅ Result/Either utilities
│   │   # Result type for error handling patterns
│   ├── enums.ts                           # ✅ Common enums
│   │   # Shared enum definitions
│   ├── layout.ts                          # ✅ Layout types
│   │   # Types for layout components and structures (BreakpointSize, LayoutConfig, etc.)
│   ├── ports.ts                           # ✅ Port type utilities
│   │   # Type utilities related to hexagonal architecture ports
│   │   # Import port types directly from @core/ports/
│   ├── react.ts                           # ✅ React-related types
│   │   # React event handler types (MouseEventHandler, KeyboardEventHandler, etc.)
│   │   # Component utility types and common component prop interfaces
│   ├── router.ts                          # ✅ Router and navigation types
│   │   # Exports RouteParams, QueryParams, RouteMetadata, NavigationOptions, etc.
│   ├── api/                               # ✅ API-related types
│   │   ├── index.ts                       # ✅ API types index
│   │   │   # Exports ApiResponse, ApiErrorResponse, ApiResponseWithMeta, ApiError
│   │   │   # ApiEndpoint, ApiRequestOptions, ApiService
│   │   │   # Import types directly from specific files, not from this index
│   │   └── auth.ts                        # ✅ Auth API types
│   │       # Authentication-related API types
│   ├── domains/                           # ✅ Domain-related types
│   │   └── index.ts                       # ✅ Domain types index
│   │       # Exports BaseDomainEntity, SoftDeletableEntity, DomainService
│   │       # Import types directly from specific files, not from this index
│   ├── index.ts                           # ✅ Types index (deprecated - use direct imports)
│   │   # Always import types directly from their specific files, never from this index
│   └── README.md                          # ✅ Types module documentation
│       # Describes type organization principles, usage patterns, and best practices
│       # Documents all type categories (API, callbacks, common, config, datetime, errors, forms, hooks, http, layout, pagination, ports, react, result, router, ui)
│   # generated/, zod/, branding.ts, events.ts - Optional, not yet implemented
│
├── tests/                                 # ✅ Unit testing infrastructure and example specs
│   ├── setupTests.ts                      # ✅ Vitest setup file
│   ├── vitest-env.d.ts                    # ✅ Vitest type definitions
│   ├── core/                              # ✅ Core-specific tests
│   │   └── router/
│   │       └── routes.gen.test.ts         # ✅ buildRoute/getRouteTemplate/isRouteKey tests with mocked routes
│   ├── shared/                            # ✅ Shared component tests
│   │   └── components/
│   │       └── layout/
│   │           ├── Layout.test.tsx        # ✅ Layout component rendering and provider integration tests
│   │           └── Navbar.test.tsx        # ✅ Navbar accessibility and routing behaviour tests
│   ├── factories/                         # ✅ Test data factories
│   │   ├── apiFactories.ts                # ✅ API response factories (buildApiResponse)
│   │   └── userFactories.ts               # ✅ User factories (buildUser, buildUserList)
│   ├── mocks/                             # ✅ MSW mocks
│   │   ├── handlers.ts                    # ✅ MSW request handlers (includes /api/demo and /api/slideshow handlers)
│   │   ├── payloads.ts                   # ✅ MSW payload helpers (defaultSlideshowResponse, etc.)
│   │   └── server.ts                      # ✅ MSW server setup helper (setupMSWServer, getMSWSetupInstructions)
│   └── utils/                              # ✅ Test utilities
│       ├── testUtils.tsx                  # ✅ Custom render with providers (renderWithProviders)
│       │   # Includes MockStorageAdapter, MockLoggerAdapter, and MockHttpAdapter exports
│       ├── TestProviders.tsx             # ✅ React component composing all providers for testing
│       └── mocks/
│           ├── MockStorageAdapter.ts      # ✅ Mock StoragePort implementation
│           ├── MockLoggerAdapter.ts       # ✅ Mock LoggerPort implementation
│           └── MockHttpAdapter.ts         # ✅ Mock HttpPort implementation
│
├── e2e/                                   # ✅ End-to-end tests
│   └── example.spec.ts                    # ✅ Example Playwright spec
│   # Domain-specific specs - Can be organized as domains grow
│
# Optional directories not yet implemented:
# - storybook/, seo/, workers/, assets/
# These can be added when needed as the application grows
# Note: types/ directory exists with ui/ subdirectory for organized UI types; additional type files can be added as needed
│
├── public/
│ ├── manifest.json                    # PWA manifest with app metadata, icons, display config
│ ├── favicon.ico                      # Default favicon (48x48 fallback)
│ ├── icon-96.png                      # 96x96 icon
│ ├── icon-180.png                     # 180x180 icon (Apple touch icon)
│ ├── icon-192.png                     # 192x192 icon (minimum PWA requirement)
│ ├── icon-384.png                     # 384x384 icon
│ ├── icon-512.png                     # 512x512 icon (splash screens, install prompts)
│ ├── icon-192-maskable.png            # 192x192 maskable icon (Android adaptive icon)
│ ├── icon-384-maskable.png            # 384x384 maskable icon
│ ├── icon-512-maskable.png            # 512x512 maskable icon
│ ├── safari-pinned-tab.svg            # Safari pinned tab icon
│ ├── og-image.png                     # Open Graph/Twitter Card image (1200x630)
│ ├── robots.txt                       # Robots.txt for search engine crawler directives
│ └── runtime-config.json               # Runtime configuration (API_BASE_URL, ANALYTICS_WRITE_KEY)
│ # Static assets served by Vite; place large media under assets/ and import as needed
│ # Icons: Provide multiple sizes (96-512px) for different contexts (favicon, PWA, install prompts)
│ # Maskable icons: Essential for Android home screen; follow 80% safe zone guidelines
│
# Notes:
# - This structure reflects the ACTUAL implementation
# - Optional directories (workers/, assets/, storybook/, seo/) can be added when needed
# - The architecture follows Screaming Architecture and Hexagonal Architecture principles
# - All import boundaries are respected (domains → core/shared only, core → standard libs only)
# - Framework-agnostic utilities are in core/utils/, framework-specific code in core/lib/
```
