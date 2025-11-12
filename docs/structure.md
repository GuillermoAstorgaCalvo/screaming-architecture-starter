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
├── index.html                         # HTML entry point: SEO metadata, PWA config, icons, app bootstrap
├── package.json                       # Scripts, engines, packageManager (pnpm), workspace-ready
├── pnpm-lock.yaml                     # Locked deps for reproducible installs (pnpm preferred)
├── tsconfig.base.json                 # Base compiler options and path aliases (@app, @core, @domains, @infra, @shared, @styles, @tests)
├── tsconfig.json                     # Project references orchestrator (coordinates app, node, vitest configs)
├── tsconfig.app.json                 # Application source code config (extends base, used by Vite & IDE)
├── tsconfig.node.json                # Node/Vite configs & scripts (extends base, composite)
├── tsconfig.vitest.json              # Unit tests (Vitest + jsdom, extends base, composite)
├── tsconfig.build.json               # Build/CI only (emits type declarations, extends base, composite)
├── vite.config.ts                    # Vite config; environment-aware server/build/optimizeDeps/esbuild
├── vitest.config.ts                  # Vitest config (jsdom env, setupFiles, coverage, tsconfigPaths via tsconfig.vitest.json)
├── playwright.config.ts              # Playwright E2E config (browser projects, web server, env vars, dotenv loading)
├── tailwind.config.ts                # Tailwind CSS config (mirrors design tokens)
├── postcss.config.cjs                # PostCSS + Tailwind pipeline with @tailwindcss/postcss and autoprefixer
├── eslint.config.js                  # ESLint flat config (ESLint v9); boundaries, jsx-a11y, TypeScript
├── .prettierrc                       # Prettier config (singleQuote, semi, trailingComma es5, Tailwind plugin)
├── .editorconfig                     # Consistent editor defaults (tab, indent 2, lf, utf-8)
├── .gitattributes                    # Line endings normalization (text=auto eol=lf)
├── .gitignore                        # Node, build artifacts, env files, coverage
├── .env.example                      # Environment variable template with Vite server/build config
├── .cursorignore                     # Cursor AI ignore patterns for dependencies/build/coverage
├── pnpm-workspace.yaml               # PNPM workspace config (onlyBuiltDependencies)
├── .nvmrc                            # Node.js version pin (22.21.1) for nvm/nodenv compatibility
├── .npmrc                            # NPM/PNPM config (engine-strict, auto-install-peers, prefer-workspace-packages)
├── LICENSE                           # Project license
├── CODEOWNERS                        # Ownership for critical paths/domains
├── SECURITY.md                       # Responsible disclosure and support policy
└── README.md                         # High-level overview + quickstart
# Note: .github/ directory for CI workflows and templates is optional and not yet implemented

src/
│
├── app/                                  # Application-level entry point and providers
│   ├── App.tsx                           # ✅ Root React component
│   │   # Combines providers and routing
│   │   # Wraps content with:
│   │   #   - LoggerProvider (outermost)
│   │   #   - ErrorBoundaryWrapper (uses logger)
│   │   #   - HttpProvider (core port dependency injection for HTTP)
│   │   #   - StorageProvider (core port dependency injection)
│   │   #   - ThemeProvider (app-level theme context)
│   │   #   - I18nProvider (i18next instance for translations)
│   │   #   - QueryProvider (React Query context)
│   │   #   - BrowserRouter
│   │   # Composition order: LoggerProvider > ErrorBoundary > HttpProvider > StorageProvider > ThemeProvider > I18nProvider > QueryProvider > BrowserRouter > Router
│   │
│   ├── main.tsx                          # ✅ Application bootstrap
│   │   # Initializes config (await initConfig()) - loads runtime config and sets up httpClient
│   │   # Initializes i18n (await i18nInitPromise) - ensures translations are loaded
│   │   # Initializes Web Vitals tracking (reportWebVitals) - only runs in production
│   │   # Imports domain i18n registrations (@domains/landing/i18n)
│   │   # Imports global CSS (@styles/globals.css)
│   │   # Creates React root and renders <App /> into DOM wrapped in StrictMode
│   │   # Throws error if root element #root not found
│   │
│   ├── router.tsx                        # ✅ Centralized route definitions
│   │   # Imports lazy-loaded pages from domains
│   │   # Supports lazy-loading using React.Suspense
│   │   # Uses PageWrapper.withTheme() HOC to inject theme props
│   │   # Uses AppLayout wrapper for consistent layout
│   │
│   ├── components/                       # ✅ App-level components
│   │   ├── AppLayout.tsx                 # ✅ App-level layout wrapper
│   │   │   # Connects shared Layout component with app-level theme context
│   │   └── PageWrapper.tsx               # ✅ HOC utilities for dependency injection
│   │       # withTheme() - Injects theme props into page components
│   │       # Allows domains to receive theme via props (respects boundaries)
│   │
│   ├── pages/                            # ✅ App-level system pages
│   │   ├── Error404.tsx                  # ✅ Not Found page (404 error)
│   │   │   # Displays "404 - Page not found" with link to home using ROUTES.HOME
│   │   └── Error500.tsx                  # ✅ Internal Server Error page (500 error)
│   │       # Displays "500 - Internal server error" with link to home using ROUTES.HOME
│   │
│   └── providers/                        # ✅ Global context providers
│       ├── QueryProvider.tsx             # ✅ React Query / data fetching context
│       │   # Creates QueryClient with sensible defaults (retries, staleTime: 30s, gcTime: 5min)
│       │   # Uses @tanstack/react-query v5 API (gcTime instead of cacheTime)
│       ├── ThemeProvider.tsx             # ✅ Provides theme (light/dark/system)
│       │   # Syncs with system preference; persists user choice via storage adapter
│       │   # Theme accessed by domains via props injection (PageWrapper.withTheme)
│       ├── ThemeContext.tsx              # ✅ Theme context definition
│       ├── useTheme.ts                   # ✅ Hook to access theme context
│       └── I18nProvider.tsx              # ✅ Provides i18next instance for translations
│           # Wraps application with I18nextProvider from react-i18next
│           # Uses configured i18n instance from @core/i18n/i18n
│       # Note: Core port providers (StorageProvider, LoggerProvider, HttpProvider) live in @core/providers/
│       # AuthProvider, AnimationProvider, AnalyticsProvider - Optional, not yet implemented
│
├── core/                                 # Framework-agnostic, reusable, domain-independent code
│   ├── config/                           # ✅ App-wide configuration
│   │   ├── env.client.ts                 # ✅ Zod-validated import.meta.env surface (client-safe)
│   │   │   # Forbid raw import.meta.env usage outside this module
│   │   │   # Validates DEV, PROD, MODE with Zod schemas and defaults
│   │   ├── routes.ts                     # ✅ Global route path constants
│   │   │   # Central source of truth for path segments (currently: HOME)
│   │   ├── runtime.ts                    # ✅ Runtime configuration loader
│   │   │   # Loads configuration from public/runtime-config.json
│   │   │   # Validates with Zod schema, supports API_BASE_URL and ANALYTICS_WRITE_KEY
│   │   │   # Provides getRuntimeConfig(), getAppConfig(), getCachedRuntimeConfig()
│   │   └── init.ts                       # ✅ Configuration initialization
│   │       # Sets up runtime configuration and configures httpClient
│   │       # Should be called early in app lifecycle (main.tsx)
│   │   ├── featureFlags.ts               # ✅ Feature flag definitions with metadata and default values
│   │   │   # Central registry of all feature flags (FEATURE_FLAGS)
│   │   │   # Provides getFeatureFlagDefinition(), getAllFeatureFlagDefinitions(), validateFeatureFlags()
│   │   ├── features.ts                   # ✅ Feature flags runtime toggles
│   │   │   # Provides isFeatureEnabled(), isFeatureEnabledAsync(), getAllFeatureFlags(), getAllFeatureFlagsAsync()
│   │   │   # Supports runtime config overrides via runtime-config.json
│   │   └── seo.ts                        # ✅ SEO & Metadata configuration
│   │       # Centralized SEO defaults and helper functions (DEFAULT_SEO, mergeSEOConfig, buildPageTitle, buildAbsoluteUrl, etc.)
│   │       # Enables per-route metadata updates and improves sharing/discoverability
│   │
│   ├── lib/                              # ✅ Framework-specific utilities
│   │   ├── httpClient.ts                 # ✅ Generic HTTP client (fetch-based wrapper)
│   │   │   # Implements HttpPort interface
│   │   │   # Supports interceptors (request, response, error)
│   │   │   # Returns typed responses
│   │   │   # Do not call fetch directly in domains/components
│   │   ├── httpClientUrl.ts               # ✅ URL building utilities
│   │   ├── httpClientHeaders.ts          # ✅ Header manipulation and merging utilities
│   │   ├── httpClientBody.ts             # ✅ Request body serialization and preparation utilities
│   │   ├── httpClientResponseParsing.ts  # ✅ Response body parsing utilities
│   │   ├── httpClientResponse.ts         # ✅ Response processing utilities
│   │   ├── httpClientTimeout.ts          # ✅ Request timeout management utilities
│   │   ├── httpClientErrorCreation.ts    # ✅ HTTP error creation utilities
│   │   ├── httpClientErrorHandler.ts     # ✅ HTTP error handling utilities
│   │   ├── httpClientInterceptors.ts     # ✅ Interceptor utilities
│   │   │   # Request, response, and error interceptor execution
│   │   ├── httpClientConfig.ts           # ✅ HTTP client configuration management
│   │   ├── httpClientMethods.ts          # ✅ HTTP method factories (get, post, put, patch, delete, head, options)
│   │   ├── httpClientRequest.ts          # ✅ Request preparation and configuration utilities
│   │   ├── ErrorBoundary.tsx             # ✅ Global ErrorBoundary React component
│   │   │   # Production-ready error handling with user-friendly fallback
│   │   │   # Captures/reports errors via logger adapter
│   │   │   # Uses react-router-dom for navigation links
│   │   ├── ErrorBoundaryWrapper.tsx     # ✅ Wrapper that injects logger from context
│   │   │   # Bridges class component (ErrorBoundary) with React hooks (useLogger)
│   │   ├── date.ts                       # ✅ Date manipulation utilities
│   │   │   # Framework-agnostic date operations (isValidDate, toDate, addDays, addHours, etc.)
│   │   │   # SSR-safe with proper Date object validation
│   │   ├── formatDate.ts                 # ✅ Date formatting utilities (main export)
│   │   │   # Provides formatDate, formatRelativeTime, formatISO, formatTime, formatDateTime
│   │   │   # SSR-safe with Intl.DateTimeFormat fallbacks
│   │   ├── formatDate.types.ts            # ✅ Date formatting type definitions
│   │   ├── formatISO.ts                  # ✅ ISO date formatting utilities
│   │   ├── formatRelativeTime.ts         # ✅ Relative time formatting utilities
│   │   ├── formatTime.ts                 # ✅ Time formatting utilities
│   │   └── storeUtils.ts                 # ✅ Zustand store utilities and type helpers
│   │
│   ├── http/                             # ✅ HTTP error handling
│   │   └── errorAdapter.ts               # ✅ HTTP error adapter for normalizing HTTP errors
│   │       # Maps HTTP status codes to domain error types (network, timeout, validation, etc.)
│   │       # Provides adapt() method via HttpErrorAdapter class
│   │       # Exports DomainErrorType, DomainError, adaptError() function, errorAdapter singleton
│   │       # Includes helper methods: isType(), isClientError(), isServerError(), isRetryable()
│   │       # Supports field-level validation error extraction
│   │       # Related files:
│   │       #   - errorAdapter.constants.ts: Error adapter constants
│   │       #   - errorAdapter.handlers.ts: Error handling functions
│   │       #   - errorAdapter.helpers.ts: Helper functions (isType, isClientError, isServerError, isRetryable)
│   │       #   - errorAdapter.types.ts: Type definitions (DomainErrorType, DomainError, etc.)
│   │
│   ├── utils/                            # ✅ Framework-agnostic utilities
│   │   ├── debounce.ts                   # ✅ Debounce utility (non-React)
│   │   │   # Supports leading, trailing, maxWait options
│   │   │   # Returns debounced function with cancel and flush methods
│   │   │   # Imports helpers from debounceHelpers.ts
│   │   ├── debounceHelpers.ts           # ✅ Internal helper functions for debounce
│   │   │   # Exports DebounceState, clearTimers, createCancelHandler, createFlushHandler,
│   │   │   # createInvokeFunc, createLeadingEdge, createTrailingEdge, scheduleMaxWait, shouldInvoke
│   │   ├── throttle.ts                   # ✅ Throttle utility (non-React)
│   │   │   # Supports leading, trailing options
│   │   │   # Returns throttled function with cancel and flush methods
│   │   │   # Imports helpers from throttleHelpers.ts
│   │   ├── throttleHelpers.ts            # ✅ Internal helper functions for throttle
│   │   │   # Exports ThrottleState, clearTimer, invokeFunc, handleLeadingEdge, handleTrailingEdge,
│   │   │   # shouldInvoke, scheduleTrailingEdge, createCancelHandler, createFlushHandler, validateWait, validateThrottleOptions
│   │   ├── hookUtils.ts                  # ✅ Utility functions for React hooks
│   │   │   # Exports getDependenciesKey() for serializing dependencies arrays
│   │   │   # Used by hooks for dependency comparison (handles non-serializable values)
│   │   ├── classNames.ts                 # ✅ Class names helper
│   │   │   # Conditionally join class names (strings, arrays, objects)
│   │   ├── seoDomUtils.ts                # ✅ SEO DOM utilities (main orchestrator)
│   │   │   # Applies SEO metadata to document head (applySEOToDocument)
│   │   ├── seoDomUtils.basic.ts          # ✅ Basic SEO meta tags utilities
│   │   │   # Updates basic meta tags and canonical URL
│   │   ├── seoDomUtils.custom.ts         # ✅ Custom meta tags utilities
│   │   │   # Updates custom meta tags
│   │   ├── seoDomUtils.openGraph.ts      # ✅ Open Graph meta tags utilities
│   │   │   # Updates Open Graph meta tags
│   │   ├── seoDomUtils.twitter.ts        # ✅ Twitter Card meta tags utilities
│   │   │   # Updates Twitter Card meta tags
│   │   └── seoDomUtils.helpers.ts        # ✅ SEO DOM utilities helper functions
│   │       # Internal helper functions for SEO operations
│   │
│   ├── router/                        # ✅ Routing helpers and generated utilities
│   │   ├── routes.gen.ts              # ✅ Type-safe route builder helpers (buildRoute, ROUTE_KEYS, getRouteTemplate, isRouteKey)
│   │   │   # Generates strongly-typed utilities from @core/config/routes
│   │   └── index.ts                   # ✅ Placeholder file (kept empty to enforce direct imports)
│   # Optional directories not yet implemented:
│   # - analytics/ (analytics primitives, feature flags, metrics adapters)
│   #
│   ├── ports/                            # ✅ Hexagonal ports (framework-agnostic interfaces)
│   │   ├── LoggerPort.ts                 # ✅ Interface for logging operations
│   │   │   # Defines debug, info, warn, error methods with context support
│   │   ├── StoragePort.ts                # ✅ Interface for key/value storage access
│   │   │   # Defines getItem, setItem, removeItem, clear, getLength, key methods
│   │   ├── HttpPort.ts                    # ✅ Interface for making HTTP requests
│   │   │   # Defines request, get, post, put, patch, delete, head, options methods
│   │   │   # Infrastructure implements these ports via adapters; domains depend on ports only
│   │   └── AnalyticsPort.ts              # ✅ Interface for analytics tracking operations
│   │       # Defines initialize, trackPageView, trackEvent, identify, setUserProperties, reset methods
│   │       # Supports Google Analytics, Segment, and other analytics providers
│   │       # Infrastructure adapters implement this port; domains depend on port only
│   │   # WorkersPort - Optional, not yet implemented
│   │
│   ├── providers/                        # ✅ Core port providers (dependency injection)
│   │   ├── LoggerProvider.tsx            # ✅ Provides LoggerPort instance via React Context
│   │   │   # Logger adapter injected at app level
│   │   ├── LoggerContext.tsx             # ✅ Logger context definition
│   │   ├── useLogger.ts                  # ✅ Hook to access LoggerPort from context
│   │   ├── StorageProvider.tsx           # ✅ Provides StoragePort instance via React Context
│   │   │   # Allows domains to access storage via useStorage hook
│   │   │   # Storage adapter instance injected at app level
│   │   │   # Follows hexagonal architecture: domains depend on ports, not adapters
│   │   ├── StorageContext.tsx            # ✅ Storage context definition
│   │   ├── useStorage.ts                 # ✅ Hook to access StoragePort from context
│   │   │   # Throws error if used outside StorageProvider
│   │   │   # Domain hooks import from @core/providers/useStorage
│   │   ├── HttpProvider.tsx              # ✅ Provides HttpPort instance via React Context
│   │   │   # HTTP client instance injected at app level (httpClient from @core/lib/httpClient)
│   │   │   # Allows domains and hooks (e.g., useFetch) to access HTTP client via useHttp hook
│   │   │   # Follows hexagonal architecture: domains depend on ports, not adapters
│   │   ├── HttpContext.tsx                # ✅ HTTP context definition
│   │   └── useHttp.ts                    # ✅ Hook to access HttpPort from context
│   │       # Throws error if used outside HttpProvider
│   │       # Domain hooks and services import from @core/providers/useHttp
│   │
│   ├── hooks/                            # ✅ Generic reusable hooks
│   │   ├── useDebounce.ts                # ✅ Debounce a value or callback
│   │   │   # React hook wrapping debounce utility
│   │   │   # Supports debouncing values and callback functions
│   │   ├── useThrottle.ts                # ✅ Throttle a value or callback
│   │   │   # Exports two hooks: useThrottle<T>(value, delay) and useThrottledCallback<T>(callback, delay)
│   │   │   # useThrottle returns throttled value that updates at most once per delay period
│   │   │   # useThrottledCallback returns ThrottledFunction with cancel() and flush() methods
│   │   │   # Both hooks use core/utils/throttle internally
│   │   ├── useToggle.ts                  # ✅ Boolean toggle hook
│   │   │   # Returns [value, toggle, setTrue, setFalse]
│   │   ├── useLocalStorage.ts            # ✅ Reads/writes to localStorage via StoragePort
│   │   ├── useSessionStorage.ts          # ✅ Reads/writes to sessionStorage via StoragePort
│   │   │   # React-friendly interface with JSON serialization
│   │   │   # Syncs with storage events for cross-tab synchronization
│   │   │   # Uses useStorage() hook internally (dependency injection pattern)
│   │   ├── useFetch.ts                   # ✅ Hook for fetching data using httpClient
│   │   │   # Provides state management for loading, data, and error states
│   │   │   # Supports automatic fetching on mount with dependency array, manual fetch triggering
│   │   │   # Request cancellation via AbortController, automatic cleanup
│   │   │   # Returns { data, error, loading, fetch, reset }
│   │   ├── useAsync.ts                   # ✅ Generic async execution hook
│   │   │   # More flexible than useFetch, accepts any async function
│   │   │   # Provides state management for async operations
│   │   │   # Supports immediate execution, dependency-triggered re-execution, callbacks
│   │   │   # Returns { data, error, loading, execute, reset }
│   │   ├── useMediaQuery.ts              # ✅ Hook to track media query matches
│   │   │   # Monitors CSS media queries and returns whether they match
│   │   │   # SSR-safe with configurable initial state
│   │   │   # Supports defaultMatches option for initial render
│   │   ├── useWindowSize.ts              # ✅ Hook to track window dimensions
│   │   │   # Provides responsive window dimensions (width, height)
│   │   │   # Updates on window resize events
│   │   │   # SSR-safe with initial fallback values
│   │   ├── usePrevious.ts                # ✅ Hook that returns previous value of state/prop
│   │   │   # Useful for comparing current vs previous values or undo/redo functionality
│   │   └── useSEO.ts                     # ✅ Hook to update document head metadata (SEO)
│   │       # Updates title, meta tags, Open Graph, and Twitter Card tags
│   │       # Uses mergeSEOConfig from @core/config/seo
│   │       # Supports per-route metadata updates
│   │
│   ├── a11y/                             # ✅ Accessibility utilities
│   │   ├── focus.ts                      # ✅ Focus management utilities
│   │   │   # Framework-agnostic focus utilities for accessible components
│   │   │   # getFocusableElements, focusFirstElement, focusLastElement, isFocusable, handleTabNavigation, saveActiveElement
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
│   │   ├── sanitizeHtml.ts               # ✅ HTML sanitization utilities (XSS prevention)
│   │   │   # escapeHtml - Escape HTML entities (safest for untrusted content)
│   │   │   # sanitizeHtml - Sanitize HTML with configurable allowed tags/attributes
│   │   ├── csp.ts                        # ✅ Content Security Policy helpers
│   │   │   # generateNonce - Generate unique nonces per request/response
│   │   │   # generateHash - Generate SHA-256/384/512 hashes for inline content
│   │   │   # buildCSPPolicy - Build CSP policy string
│   │   └── permissions.ts                # ✅ Permission model helpers
│   │       # hasPermission, hasAnyPermission, hasAllPermissions, checkPermissions, mergePermissions
│   │       # Generic permission evaluation logic with least privilege and fail-secure principles
│   │
│   ├── i18n/                             # ✅ Internationalization system
│   │   ├── i18n.ts                        # ✅ Core i18next instance configuration
│   │   │   # Registers common translations, initializes i18next, sets up RTL support
│   │   │   # Exports configured i18n instance and initialization promise
│   │   ├── types.ts                       # ✅ TypeScript types for translation keys (type-safe access)
│   │   │   # Defines translation interfaces for each namespace (common, landing, etc.)
│   │   │   # Provides type-safe translation key access
│   │   ├── useTranslation.ts              # ✅ Custom hook wrapper with automatic resource loading
│   │   │   # Provides useTranslation hook that automatically loads resources on-demand
│   │   │   # Type-safe translation function with autocomplete
│   │   ├── useRtl.ts                      # ✅ Hook to check if current language is RTL
│   │   │   # Returns boolean indicating if current language requires RTL layout
│   │   │   # Automatically updates when language changes
│   │   ├── resourceLoader.ts              # ✅ Dynamic resource loading system
│   │   │   # Handles lazy loading of translation resources
│   │   │   # Caches loaded resources to prevent re-loading
│   │   ├── registry.ts                    # ✅ Domain translation registration system
│   │   │   # registerDomainTranslations() - Register domain translations
│   │   │   # registerCommonTranslations() - Register common translations
│   │   ├── constants.ts                   # ✅ Centralized i18n constants
│   │   │   # SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, RTL_LANGUAGES
│   │   │   # LANGUAGE_STORAGE_KEY, LANGUAGE_DETECTION_ORDER
│   │   │   # Helper functions: isSupportedLanguage, isRtlLanguage, normalizeLanguage
│   │   ├── errors.ts                      # ✅ Custom error classes for i18n resource loading
│   │   │   # ResourceLoaderNotFoundError, InvalidResourceFormatError
│   │   ├── useTranslationHelpers.ts       # ✅ Internal helper functions for resource loading state management
│   │   │   # isResourceLoadedInI18n, ensureResourceLoaded, handleInitialLoad, handleExistingLoad, updateLoadingState
│   │   ├── useTranslationLoader.ts        # ✅ Internal hook for managing resource loading effects
│   │   │   # useResourceLoader, useResourceLoadingEffects - handles loading effects and language changes
│   │   ├── useTranslationState.ts         # ✅ Internal hook for managing translation loading state
│   │   │   # useResourceLoadingState, useLoadingStateUpdater - manages loading state per namespace/language
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
│   │   # Each component is organized in its own folder with related files
│   │   ├── button/                        # ✅ Button component folder
│   │   │   └── Button.tsx                 # ✅ Main Button component with variants (primary, secondary, ghost) and sizes (uses getButtonVariantClasses from @core/ui/variants)
│   │   │       # Features: accessible, loading state support, dark mode support
│   │   ├── input/                         # ✅ Input component folder
│   │   │   ├── Input.tsx                 # ✅ Text input with label, error, helper text, and icon support (exports types from @src-types/ui)
│   │   │   ├── InputContent.tsx          # ✅ Input content component
│   │   │   ├── InputField.tsx            # ✅ Input field component
│   │   │   ├── InputHelpers.ts           # ✅ Helper functions for input handling (uses getInputVariantClasses from @core/ui/variants)
│   │   │   ├── InputIcon.tsx             # ✅ Input icon component
│   │   │   ├── InputLabel.tsx            # ✅ Input label component
│   │   │   ├── InputMessages.tsx         # ✅ Input error/helper text messages component
│   │   │   ├── InputTypes.ts             # ✅ Input type definitions
│   │   │   ├── InputWrapper.tsx          # ✅ Input wrapper component
│   │   │   └── useInput.ts               # ✅ Input hook for managing input state
│   │   ├── modal/                         # ✅ Modal component folder
│   │   │   ├── Modal.tsx                 # ✅ Main Modal dialog component with overlay and close functionality (exports types from @src-types/ui)
│   │   │   ├── ModalBody.tsx             # ✅ Modal body content component
│   │   │   ├── ModalDialog.tsx           # ✅ Modal dialog wrapper component
│   │   │   ├── ModalHelpers.ts           # ✅ Helper functions for modal operations
│   │   │   ├── ModalParts.tsx            # ✅ Modal sub-components (CloseButton, ModalHeader, ModalContent, ModalFooter)
│   │   │   ├── useModal.ts               # ✅ Modal-related React hooks (focus management, escape key handling)
│   │   │   └── useModalSetup.ts          # ✅ Modal setup hook for configuration (includes type interfaces)
│   │   ├── spinner/                       # ✅ Spinner component folder
│   │   │   ├── Spinner.tsx               # ✅ Loading indicator component with customizable size and color
│   │   │   │   # Accessible with proper ARIA labels, supports sm/md/lg sizes or custom numeric size
│   │   │   ├── SpinnerHelpers.ts         # ✅ Helper functions for spinner styling
│   │   │   │   # getSpinnerSvgProps() - Gets SVG props based on size
│   │   │   └── SpinnerParts.tsx          # ✅ Spinner sub-components
│   │   │       # SpinnerContent - Renders spinner SVG content (circle and path)
│   │   ├── error-text/                    # ✅ ErrorText component folder
│   │   │   └── ErrorText.tsx             # ✅ Error text display component
│   │   ├── helper-text/                   # ✅ HelperText component folder
│   │   │   └── HelperText.tsx            # ✅ Helper text display component
│   │   ├── icon-button/                   # ✅ IconButton component folder
│   │   │   └── IconButton.tsx            # ✅ Icon button component (uses getIconButtonVariantClasses from @core/ui/variants)
│   │   ├── label/                         # ✅ Label component folder
│   │   │   └── Label.tsx                  # ✅ Form label component
│   │   ├── textarea/                      # ✅ Textarea component folder
│   │   │   ├── Textarea.tsx               # ✅ Textarea component with label, error, helper text support
│   │   │   ├── TextareaContent.tsx        # ✅ Textarea content component
│   │   │   ├── TextareaField.tsx          # ✅ Textarea field component
│   │   │   ├── TextareaHelpers.ts         # ✅ Helper functions for textarea handling
│   │   │   ├── TextareaLabel.tsx          # ✅ Textarea label component
│   │   │   ├── TextareaMessages.tsx       # ✅ Textarea error/helper text messages component
│   │   │   ├── TextareaTypes.ts           # ✅ Textarea type definitions
│   │   │   ├── TextareaWrapper.tsx        # ✅ Textarea wrapper component
│   │   │   └── useTextarea.ts            # ✅ React hook for managing textarea state
│   │   ├── checkbox/                       # ✅ Checkbox component folder
│   │   │   ├── Checkbox.tsx               # ✅ Checkbox component with label, error, helper text support
│   │   │   │   # Features: accessible, size variants (sm, md, lg), controlled/uncontrolled modes, dark mode support
│   │   │   ├── CheckboxContent.tsx        # ✅ Checkbox content component
│   │   │   ├── CheckboxField.tsx          # ✅ Checkbox field component
│   │   │   ├── CheckboxHandlers.ts        # ✅ Checkbox event handlers
│   │   │   ├── CheckboxHelpers.ts         # ✅ Helper functions for checkbox handling
│   │   │   ├── CheckboxLabel.tsx          # ✅ Checkbox label component
│   │   │   ├── CheckboxMessages.tsx       # ✅ Checkbox error/helper text messages component
│   │   │   ├── CheckboxTypes.ts           # ✅ Checkbox type definitions
│   │   │   ├── CheckboxWrapper.tsx        # ✅ Checkbox wrapper component
│   │   │   └── useCheckbox.ts            # ✅ React hook for managing checkbox state
│   │   ├── switch/                         # ✅ Switch component folder
│   │   │   ├── Switch.tsx                 # ✅ Toggle switch component with label, error, helper text support
│   │   │   │   # Features: accessible, size variants (sm, md, lg), animated toggle transition, controlled/uncontrolled modes, dark mode support
│   │   │   ├── SwitchContainer.tsx      # ✅ Switch container component
│   │   │   ├── SwitchContent.tsx        # ✅ Switch content component
│   │   │   ├── SwitchField.tsx          # ✅ Switch field component
│   │   │   ├── SwitchInput.tsx          # ✅ Switch input component
│   │   │   ├── SwitchLabel.tsx          # ✅ Switch label component
│   │   │   ├── SwitchMessages.tsx      # ✅ Switch error/helper text messages component
│   │   │   ├── SwitchWrapper.tsx       # ✅ Switch wrapper component
│   │   │   ├── SwitchHelpers.ts        # ✅ Helper functions for switch handling
│   │   │   ├── SwitchHandlers.ts        # ✅ Switch event handlers
│   │   │   ├── SwitchTypes.ts          # ✅ Switch type definitions
│   │   │   ├── useSwitch.ts            # ✅ React hook for managing switch state
│   │   │   ├── useSwitchField.ts       # ✅ React hook for switch field management
│   │   │   └── useSwitchFieldState.ts  # ✅ React hook for switch field state management
│   │   ├── select/                         # ✅ Select component folder
│   │   │   ├── Select.tsx                # ✅ Select/dropdown component with label, error, helper text support
│   │   │   │   # Features: accessible, size variants (sm, md, lg), custom dropdown arrow icon, dark mode support
│   │   │   ├── SelectContent.tsx         # ✅ Select content component
│   │   │   ├── SelectField.tsx           # ✅ Select field component
│   │   │   ├── SelectHelpers.ts          # ✅ Helper functions for select handling
│   │   │   ├── SelectLabel.tsx           # ✅ Select label component
│   │   │   ├── SelectMessages.tsx        # ✅ Select error/helper text messages component
│   │   │   ├── SelectTypes.ts            # ✅ Select type definitions
│   │   │   ├── SelectWrapper.tsx         # ✅ Select wrapper component
│   │   │   └── useSelect.ts              # ✅ React hook for managing select state
│   │   ├── radio/                          # ✅ Radio component folder
│   │   │   ├── Radio.tsx                  # ✅ Radio button component with label, error, helper text support
│   │   │   │   # Features: accessible, size variants (sm, md, lg), controlled/uncontrolled modes, dark mode support
│   │   │   ├── RadioA11yHelpers.ts       # ✅ Accessibility helpers (ARIA, ID generation)
│   │   │   ├── RadioClassHelpers.ts      # ✅ Styling/class utilities
│   │   │   ├── RadioFieldPropsHelpers.ts # ✅ Field and content props building helpers
│   │   │   ├── RadioInputPropsHelpers.ts # ✅ Input props building helpers
│   │   │   ├── RadioHandlers.ts          # ✅ Radio event handlers
│   │   │   ├── RadioParts.tsx            # ✅ Radio sub-components and type interfaces
│   │   │   ├── RadioTypes.ts             # ✅ Radio type definitions
│   │   │   ├── useRadio.ts               # ✅ React hook for managing radio state
│   │   │   └── useRadioField.ts           # ✅ React hook for radio field management
│   │   ├── badge/                          # ✅ Badge component folder
│   │   │   └── Badge.tsx                 # ✅ Status/label display component
│   │   │       # Features: multiple variants (default, primary, success, warning, error, info), size variants (sm, md, lg), dark mode support
│   │   ├── chip/                           # ✅ Chip component folder
│   │   │   └── Chip.tsx                    # ✅ Removable tag/filter component
│   │   │       # Features: similar to Badge but with remove functionality, multiple variants (default, primary, success, warning, error, info), size variants (sm, md, lg), optional remove button with customizable aria-label, dark mode support, accessible focus states
│   │   ├── heading/                        # ✅ Heading component folder
│   │   │   └── Heading.tsx               # ✅ Reusable typography heading component (h1-h6)
│   │   │       # Features: accessible semantic heading elements, size variants, dark mode support
│   │   ├── text/                            # ✅ Text component folder
│   │   │   └── Text.tsx                  # ✅ Reusable typography paragraph component
│   │   │       # Features: accessible semantic paragraph element, size variants (sm, md, lg), dark mode support
│   │   ├── skeleton/                        # ✅ Skeleton component folder
│   │   │   └── Skeleton.tsx              # ✅ Loading state component with animated pulse effect
│   │   │       # Features: animated pulse effect, multiple variants (text, circular, rectangular), customizable width/height, dark mode support
│   │   ├── tooltip/                         # ✅ Tooltip component folder
│   │   │   ├── Tooltip.tsx                # ✅ Accessible tooltip component with positioning
│   │   │   │   # Features: multiple positions (top, bottom, left, right), configurable delay, keyboard accessible, screen reader support, dark mode support
│   │   │   ├── TooltipContent.tsx          # ✅ Tooltip content component
│   │   │   ├── TooltipWrapper.tsx          # ✅ Tooltip wrapper component
│   │   │   ├── tooltipUtils.ts            # ✅ Tooltip utility functions
│   │   │   └── useTooltip.ts             # ✅ React hook for managing tooltip state
│   │   ├── hover-card/                      # ✅ HoverCard component folder
│   │   │   ├── HoverCard.tsx               # ✅ Accessible hover card component that shows card content on hover
│   │   │   │   # Features: multiple positions (top, bottom, left, right), configurable show/hide delays, keyboard accessible, screen reader support, dark mode support, optional arrow pointing to trigger, rich card-style content
│   │   │   ├── HoverCardContent.tsx        # ✅ Hover card content component
│   │   │   ├── HoverCardWrapper.tsx        # ✅ Hover card wrapper component
│   │   │   ├── hoverCardUtils.ts          # ✅ Hover card utility functions
│   │   │   └── useHoverCard.ts            # ✅ React hook for managing hover card state
│   │   ├── popover/                         # ✅ Popover component folder
│   │   │   ├── Popover.tsx                # ✅ Flexible overlay component
│   │   │   │   # Features: accessible with proper ARIA attributes, flexible positioning (top, bottom, left, right with alignment), click outside to close, escape key to close, automatic positioning with viewport boundary detection, portal rendering, dark mode support
│   │   │   ├── PopoverContentSetup.tsx    # ✅ Popover content setup component
│   │   │   ├── PopoverHelpers.tsx         # ✅ Popover helper components
│   │   │   ├── PopoverParts.tsx           # ✅ Popover sub-components
│   │   │   ├── PopoverSetup.tsx           # ✅ Popover setup component
│   │   │   ├── PopoverHooks.ts            # ✅ Popover hook utilities
│   │   │   ├── popoverPosition.ts         # ✅ Popover position utilities
│   │   │   ├── usePopover.ts              # ✅ React hook for managing popover state
│   │   │   ├── usePopoverHelpers.ts       # ✅ Popover helper hooks
│   │   │   └── usePopoverPosition.ts      # ✅ Hook for popover positioning logic
│   │   ├── theme-toggle/                    # ✅ ThemeToggle component folder
│   │   │   └── ThemeToggle.tsx            # ✅ Theme toggle component
│   │   │       # Cycles through: light → dark → system → light
│   │   │       # Accessible: keyboard navigable, proper ARIA labels
│   │   │       # Presentational component (receives theme via props)
│   │   ├── theme/                           # ✅ Component token bridge
│   │   │   └── tokens.ts                    # ✅ Component token definitions derived from design tokens
│   │   │       # Bridges design tokens to component-specific values
│   │   │       # Exports: componentSpacing, componentRadius, componentColors,
│   │   │       #          componentShadows, componentFocusRing, componentTransitions, componentZIndex
│   │   ├── variants/                        # ✅ Component variants (using cva)
│   │   │   ├── button.ts                    # ✅ Button variants using class-variance-authority
│   │   │   │   # Exports buttonVariants, getButtonVariantClasses, ButtonVariants type
│   │   │   ├── iconButton.ts                # ✅ IconButton variants using class-variance-authority
│   │   │   │   # Exports iconButtonVariants, getIconButtonVariantClasses, IconButtonVariants type
│   │   │   ├── input.ts                     # ✅ Input variants using class-variance-authority
│   │   │   │   # Exports inputVariants, getInputVariantClasses, InputVariants type
│   │   │   ├── errorText.ts                 # ✅ ErrorText variants
│   │   │   │   # Exports errorTextVariants, getErrorTextVariantClasses, ErrorTextVariants type (size variants: sm, md, lg)
│   │   │   ├── helperText.ts                # ✅ HelperText variants
│   │   │   │   # Exports helperTextVariants, getHelperTextVariantClasses, HelperTextVariants type (size variants: sm, md, lg)
│   │   │   ├── label.ts                     # ✅ Label variants
│   │   │   │   # Exports labelVariants, getLabelVariantClasses, LabelVariants type (size variants: sm, md, lg)
│   │   │   ├── modal.ts                     # ✅ Modal variants
│   │   │   │   # Exports modalDialogVariants, modalBodyVariants, getModalDialogVariantClasses, getModalBodyVariantClasses
│   │   │   │   # ModalDialogVariants, ModalBodyVariants types (size variants: sm, md, lg, xl, full)
│   │   │   ├── spinner.ts                   # ✅ Spinner variants
│   │   │   │   # Exports spinnerVariants, getSpinnerVariantClasses, SpinnerVariants type (size variants: sm, md, lg)
│   │   │   ├── icon.ts                      # ✅ Icon variants
│   │   │   │   # Exports iconVariants, getIconVariantClasses, IconVariants type (size variants: sm, md, lg)
│   │   │   │   # Used by all icon components (CloseIcon, ClearIcon, HeartIcon, etc.)
│   │   │   ├── textarea.ts                  # ✅ Textarea variants
│   │   │   │   # Exports textareaVariants, getTextareaVariantClasses, TextareaVariants type
│   │   │   │   # Supports size variants (sm, md, lg) and state variants (normal, error)
│   │   │   ├── checkbox.ts                  # ✅ Checkbox variants
│   │   │   │   # Exports checkboxVariants, getCheckboxVariantClasses, CheckboxVariants type (size variants: sm, md, lg)
│   │   │   ├── chip.ts                       # ✅ Chip variants
│   │   │   │   # Exports chipVariants, getChipVariantClasses, ChipVariants type (size variants: sm, md, lg, variants: default, primary, success, warning, error, info)
│   │   │   ├── switch.ts                    # ✅ Switch variants
│   │   │   │   # Exports switchVariants, getSwitchVariantClasses, SwitchVariants type (size variants: sm, md, lg)
│   │   │   ├── select.ts                    # ✅ Select variants
│   │   │   │   # Exports selectVariants, getSelectVariantClasses, SelectVariants type (size variants: sm, md, lg)
│   │   │   ├── radio.ts                     # ✅ Radio variants
│   │   │   │   # Exports radioVariants, getRadioVariantClasses, RadioVariants type (size variants: sm, md, lg)
│   │   │   ├── badge.ts                     # ✅ Badge variants
│   │   │   │   # Exports badgeVariants, getBadgeVariantClasses, BadgeVariants type (size variants: sm, md, lg, variants: default, primary, success, warning, error, info)
│   │   │   ├── card.ts                      # ✅ Card variants
│   │   │   │   # Exports cardVariants, getCardVariantClasses, CardVariants type (variant: elevated, outlined, flat; padding: sm, md, lg)
│   │   │   ├── heading.ts                   # ✅ Heading variants
│   │   │   │   # Exports headingVariants, getHeadingVariantClasses, HeadingVariants type (size variants: sm, md, lg, xl, 2xl)
│   │   │   ├── link.ts                      # ✅ Link variants
│   │   │   │   # Exports linkVariants, getLinkVariantClasses, LinkVariants type (variant: default, subtle, muted; size: sm, md, lg)
│   │   │   ├── list.ts                      # ✅ List variants
│   │   │   │   # Exports listVariants, getListVariantClasses, getListItemSizeClasses, ListVariants type (variants: default, bordered, divided)
│   │   │   ├── skeleton.ts                  # ✅ Skeleton variants
│   │   │   │   # Exports skeletonVariants, getSkeletonVariantClasses, SkeletonVariants type (variants: text, circular, rectangular)
│   │   │   ├── stepper.ts                    # ✅ Stepper variants
│   │   │   │   # Exports stepperVariants, getStepperVariantClasses, getStepperStepSizeClasses, StepperVariants type (orientation: horizontal, vertical; size variants: sm, md, lg)
│   │   │   └── text.ts                      # ✅ Text variants
│   │   │       # Exports textVariants, getTextVariantClasses, TextVariants type (size variants: sm, md, lg)
│   │   ├── loadable.tsx                     # ✅ Code splitting wrapper around React.lazy and Suspense
│   │   │   # Provides Loadable function with customizable loading fallbacks (loading can be ReactNode or function)
│   │   │   # Exports: Loadable, LoadableProps, LoadableOptions
│   │   ├── loadableFallback.tsx             # ✅ Default loading fallback component
│   │   │   # Exports: DefaultLoadingFallback (accessible loading state with aria-live and aria-label)
│   │   └── loadableUtils.ts                # ✅ Utility functions for Loadable
│   │       # Exports: createLoadable() helper with default loading fallback
│   │   ├── accordion/                        # ✅ Accordion component folder
│   │   │   ├── Accordion.tsx                # ✅ Main Accordion component
│   │   │   ├── AccordionContent.tsx         # ✅ Accordion content component
│   │   │   ├── AccordionHeader.tsx          # ✅ Accordion header component
│   │   │   ├── AccordionIcon.tsx            # ✅ Accordion icon component
│   │   │   ├── AccordionItem.tsx            # ✅ Accordion item component
│   │   │   ├── AccordionHelpers.ts          # ✅ Helper functions for accordion
│   │   │   └── useAccordion.ts              # ✅ React hook for managing accordion state
│   │   ├── alert/                             # ✅ Alert component folder
│   │   │   └── Alert.tsx                    # ✅ Alert notification component
│   │   │       # Features: multiple intents (info, success, warning, error), dismissible, action button support, accessible with proper ARIA roles
│   │   ├── avatar/                           # ✅ Avatar component folder
│   │   │   └── Avatar.tsx                   # ✅ Avatar component for user profile images
│   │   ├── breadcrumbs/                      # ✅ Breadcrumbs component folder
│   │   │   ├── Breadcrumbs.tsx               # ✅ Main Breadcrumbs navigation component
│   │   │   └── BreadcrumbItem.tsx            # ✅ Breadcrumb item component
│   │   ├── card/                             # ✅ Card component folder
│   │   │   └── Card.tsx                     # ✅ Card container component
│   │   ├── drawer/                           # ✅ Drawer component folder
│   │   │   ├── Drawer.tsx                     # ✅ Main Drawer component (side panel)
│   │   │   ├── DrawerDialog.tsx              # ✅ Drawer dialog wrapper
│   │   │   ├── DrawerParts.tsx               # ✅ Drawer sub-components
│   │   │   ├── DrawerHelpers.ts              # ✅ Helper functions for drawer
│   │   │   ├── useDrawer.ts                  # ✅ React hook for managing drawer state
│   │   │   └── useDrawerSetup.ts             # ✅ Drawer setup hook for configuration
│   │   ├── resizable/                        # ✅ Resizable component folder
│   │   │   ├── Resizable.tsx                # ✅ Component for creating resizable panels/containers
│   │   │   │   # Features: multiple directions (horizontal, vertical, both), min/max size constraints, controlled and uncontrolled modes, accessible resize handles, dark mode support, smooth resize interactions
│   │   │   ├── ResizableContainer.tsx        # ✅ Resizable container component
│   │   │   └── useResizable.ts             # ✅ React hook for managing resizable state
│   │   ├── divider/                          # ✅ Divider component folder
│   │   │   └── Divider.tsx                  # ✅ Divider/separator component
│   │   ├── dropdown-menu/                     # ✅ DropdownMenu component folder
│   │   │   ├── DropdownMenu.tsx             # ✅ Main DropdownMenu component
│   │   │   │   # Features: accessible keyboard navigation, flexible positioning, menu items with icons/descriptions/shortcuts
│   │   │   ├── DropdownMenuRenderers.tsx    # ✅ DropdownMenu rendering utilities
│   │   │   ├── DropdownMenuHelpers.ts       # ✅ Helper functions for dropdown menu
│   │   │   ├── MenuItemButton.tsx           # ✅ Menu item button component
│   │   │   ├── useDropdownMenu.ts           # ✅ React hook for managing dropdown menu state
│   │   │   └── useDropdownMenuHooks.ts       # ✅ Internal hooks for dropdown menu functionality
│   │   ├── link/                             # ✅ Link component folder
│   │   │   └── Link.tsx                     # ✅ Link component (navigation link)
│   │   ├── list/                             # ✅ List component folder
│   │   │   ├── List.tsx                      # ✅ Main List component
│   │   │   │   # Features: multiple variants (default, bordered, divided), size variants (sm, md, lg), dark mode support, accessible semantic HTML
│   │   │   ├── ListContext.tsx               # ✅ List context provider
│   │   │   │   # Provides size context to ListItem components
│   │   │   ├── ListGroup.tsx                 # ✅ List group wrapper component
│   │   │   │   # Features: optional header and footer sections, dark mode support
│   │   │   ├── ListItem.tsx                  # ✅ List item component
│   │   │   │   # Features: optional leading and trailing elements, interactive button state, clickable items, selected state, size variants inherited from List context
│   │   │   └── useListContext.ts             # ✅ Hook to access List context
│   │   ├── pagination/                       # ✅ Pagination component folder
│   │   │   ├── Pagination.tsx                # ✅ Main Pagination component
│   │   │   ├── PaginationButton.tsx          # ✅ Pagination button component
│   │   │   ├── PaginationButtons.tsx         # ✅ Pagination buttons container
│   │   │   ├── FirstLastButtons.tsx          # ✅ First/Last page buttons
│   │   │   ├── PrevNextButtons.tsx           # ✅ Previous/Next page buttons
│   │   │   ├── PageNumberButtons.tsx         # ✅ Page number buttons
│   │   │   ├── PaginationHelpers.ts          # ✅ Helper functions for pagination
│   │   │   ├── PaginationHandlers.ts         # ✅ Pagination event handlers
│   │   │   └── usePagination.ts             # ✅ React hook for managing pagination state
│   │   ├── progress/                         # ✅ Progress component folder
│   │   │   └── Progress.tsx                 # ✅ Progress bar component
│   │   ├── table/                            # ✅ Table component folder
│   │   │   ├── Table.tsx                     # ✅ Main Table component
│   │   │   ├── TableElement.tsx              # ✅ Table element wrapper
│   │   │   ├── TableHeader.tsx               # ✅ Table header component
│   │   │   ├── TableBody.tsx                 # ✅ Table body component
│   │   │   ├── TableRow.tsx                  # ✅ Table row component
│   │   │   ├── TableCell.tsx                 # ✅ Table cell component
│   │   │   ├── TableEmptyState.tsx           # ✅ Table empty state component
│   │   │   └── TableHelpers.ts               # ✅ Helper functions for table
│   │   ├── tabs/                             # ✅ Tabs component folder
│   │   │   ├── Tabs.tsx                      # ✅ Main Tabs component
│   │   │   ├── TabsList.tsx                  # ✅ Tabs list container
│   │   │   ├── TabButton.tsx                 # ✅ Tab button component
│   │   │   ├── TabButtonContent.tsx          # ✅ Tab button content
│   │   │   ├── TabsPanel.tsx                 # ✅ Tabs panel component
│   │   │   ├── TabsHelpers.ts                # ✅ Helper functions for tabs
│   │   │   └── useTabs.ts                    # ✅ React hook for managing tabs state
│   │   ├── stepper/                           # ✅ Stepper component folder
│   │   │   └── Stepper.tsx                    # ✅ Step-by-step progress indicator component
│   │   │       # Features: horizontal and vertical orientations, size variants (sm, md, lg), step status (completed, active, pending, error), optional step numbers, clickable steps, accessible navigation structure
│   │   ├── toast/                             # ✅ Toast component folder
│   │   │   ├── Toast.tsx                     # ✅ Main Toast notification component
│   │   │   │   # Features: multiple intents (info, success, warning, error), auto-dismiss with pause on hover, dismissible, action button support, accessible with proper ARIA roles
│   │   │   ├── ToastParts.tsx                # ✅ Toast sub-components (ToastIcon, ToastContent, ToastDismissButton, ToastContainer, ToastBody)
│   │   │   ├── toast.helpers.ts              # ✅ Helper functions for toast configuration
│   │   │   ├── toast.types.ts                # ✅ Toast type definitions
│   │   │   ├── toast.utils.ts                # ✅ Toast utility functions
│   │   │   ├── toast.constants.ts            # ✅ Toast constants
│   │   │   └── useToastDismiss.ts            # ✅ React hook for toast dismiss functionality
│   │   ├── icons/                            # ✅ Icon components folder
│   │   │   ├── Icon.tsx                      # ✅ Generic Icon wrapper component (uses icon registry)
│   │   │   ├── iconRegistry.ts               # ✅ Icon registry (centralized icon management)
│   │   │   │   # Exports: iconRegistry, getIcon(), registerIcon(), hasIcon()
│   │   │   ├── clear-icon/                   # ✅ ClearIcon component
│   │   │   │   └── ClearIcon.tsx            # ✅ Clear icon SVG component
│   │   │   ├── close-icon/                   # ✅ CloseIcon component
│   │   │   │   └── CloseIcon.tsx            # ✅ Close icon SVG component
│   │   │   ├── heart-icon/                    # ✅ HeartIcon component
│   │   │   │   └── HeartIcon.tsx            # ✅ Heart/like icon SVG component
│   │   │   ├── search-icon/                   # ✅ SearchIcon component
│   │   │   │   └── SearchIcon.tsx           # ✅ Search icon SVG component
│   │   │   └── settings-icon/                 # ✅ SettingsIcon component
│   │   │       └── SettingsIcon.tsx           # ✅ Settings icon SVG component
│   │   ├── image/                            # ✅ Image component folder
│   │   │   ├── Image.tsx                     # ✅ Optimized image display component
│   │   │   │   # Features: lazy loading, fallback handling, placeholders, accessible alt text, loading states with skeleton support, error handling with fallback images
│   │   │   └── image.helpers.tsx              # ✅ Image helper functions
│   │   │       # Exports: getImageConfig, renderImage, UseImageLifecycleParams, ImageLifecycleState, ImageConfig
│   │   # Ensure a11y: focus states, aria labels, keyboard navigation
│   │   ├── command-palette/                  # ⚠️ Command palette component folder (placeholder, not yet implemented)
│   │   │   # Future: Command palette/search interface component
│   │   # Optional components not yet implemented:
│   │   # - animation/, atoms/, molecules/, organisms/
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
│       ├── store/                         # ✅ Domain state management (Zustand)
│       │   ├── landingStore.ts            # ✅ Counter example store with typed actions, selectors, initial state
│       │   │   # Demonstrates selectors (count, isLoading, error) and actions (increment, decrement, reset)
│       │   └── README.md                  # ✅ Store usage guidelines and best practices
│       └── i18n/                          # ✅ Domain translations
│           ├── index.ts                    # ✅ Registration file using registerDomainTranslations() with async IIFE pattern
│           ├── en.json                     # ✅ English translations
│           ├── es.json                     # ✅ Spanish translations
│           └── ar.json                     # ✅ Arabic translations (RTL)
│       # components/, hooks/, routes.ts, models/, services/, constants.ts - Optional, not yet implemented
│
│   └── shared/                              # ✅ Cross-domain shared features
│       └── forms/                            # ✅ Shared form components
│           └── components/                    # ✅ Form component implementations
│               ├── AutocompleteCombobox.tsx  # ✅ Autocomplete combobox component
│               │   # Features: accessible ARIA combobox pattern, keyboard navigation, search/filter, loading states, custom options rendering
│               ├── AutocompleteComboboxBody.tsx # ✅ Autocomplete combobox body component
│               ├── AutocompleteComboboxField.tsx # ✅ Autocomplete combobox field component
│               ├── AutocompleteComboboxHelpers.ts # ✅ Helper functions for autocomplete combobox
│               ├── AutocompleteComboboxParts.tsx # ✅ Autocomplete combobox sub-components (listbox, options)
│               ├── useAutocompleteCombobox.ts # ✅ React hook for managing autocomplete combobox state
│               ├── useAutocompleteComboboxHandlers.ts # ✅ Event handlers for autocomplete combobox
│               ├── useAutocompleteComboboxHandlers.helpers.ts # ✅ Helper functions for event handlers
│               ├── useAutocompleteComboboxIds.ts # ✅ ID generation utilities for autocomplete combobox
│               ├── useAutocompleteComboboxSetup.ts # ✅ Setup hook for autocomplete combobox configuration
│               ├── DatePicker.tsx            # ✅ Date picker component
│               │   # Features: date input with validation, ISO date format support, accessible date selection
│               ├── Slider.tsx                # ✅ Slider/range input component
│               │   # Features: accessible range input, customizable min/max/step, value display, marks support, helper text
│               ├── SliderView.tsx            # ✅ Slider view component
│               ├── slider.types.ts           # ✅ Slider type definitions
│               └── sliderModel.ts            # ✅ Slider model/business logic
│       # auth/, notifications/, analytics/ - Optional, not yet implemented
│
├── infrastructure/                        # Technical adapters & framework-specific code
│   ├── logging/                           # ✅ Logging adapter
│   │   └── loggerAdapter.ts               # ✅ Console-based logging implementation
│   │       # Implements LoggerPort interface
│   │       # SSR-safe with availability checks
│   │       # Supports debug, info, warn, error levels
│   │       # Can be extended/replaced with external services (Sentry, LogRocket)
│   │
│   └── storage/                           # ✅ Storage adapters
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
│       └── cookieStorageAdapter.ts         # ✅ Encapsulates cookie access
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
│       ├── analytics/                        # ✅ Analytics adapters
│       │   └── googleAnalyticsAdapter.ts     # ✅ Google Analytics (GA4) adapter implementation
│       │       # Implements AnalyticsPort interface
│       │       # Uses gtag.js for Google Analytics 4 tracking
│       │       # Supports page views, events, user identification, user properties, reset
│       │       # SSR-safe with browser environment checks
│       │       # Exports googleAnalyticsAdapter instance and noopAnalyticsAdapter for testing
│       │       # Can be extended/replaced with other analytics providers (Segment, Mixpanel, etc.)
│       # api/, auth/, observability/, security/, storage/indexeddb/ - Optional, not yet implemented
│
│   # Hexagonal Architecture: Adapters implement ports; domains depend on ports only
│   # Adapters are injected at app level via providers
│
├── shared/                                # ✅ Reusable composite components & helpers
│   └── components/                        # ✅ Shared components
│       ├── layout/                        # ✅ Layout components
│       │   ├── Layout.tsx                 # ✅ Main layout wrapper with Navbar
│       │   │   # Accepts theme config and children
│       │   │   # Includes SkipToContent component from @core/a11y/skipToContent
│       │   │   # Wraps content in <main id="main-content"> for accessibility
│       │   │   # Provides consistent page structure
│       │   └── Navbar.tsx                 # ✅ Main navigation component
│       │       # Includes navigation links
│       │       # Optional theme toggle (if theme prop provided)
│       │       # Domain-agnostic: uses routes from core/config/routes
│       │       # Note: ThemeToggle component is imported from @core/ui/theme-toggle/ThemeToggle
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
│   ├── ui/                                # ✅ UI component type definitions (organized by category)
│   │   ├── base.ts                        # ✅ Base UI types
│   │   ├── buttons.ts                     # ✅ Button and IconButton types
│   │   ├── data.ts                        # ✅ Table, Pagination, and Avatar types
│   │   ├── feedback.ts                    # ✅ Error, Helper, and feedback types
│   │   ├── forms.ts                       # ✅ Input, Textarea, and Select types
│   │   ├── icons.ts                        # ✅ Icon types
│   │   ├── layout.ts                       # ✅ Layout and navigation types
│   │   ├── navigation.ts                   # ✅ Navigation component types
│   │   ├── overlays.ts                    # ✅ Modal, Popover, Tooltip types
│   │   ├── theme.ts                       # ✅ Theme types
│   │   └── typography.ts                  # ✅ Heading, Text types
│   │   # All UI components reference types from this directory via @src-types/ui/*
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
# - scripts/, storybook/, seo/, workers/, assets/
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
# - Optional directories (workers/, assets/, types/, scripts/, storybook/, seo/) can be added when needed
# - The architecture follows Screaming Architecture and Hexagonal Architecture principles
# - All import boundaries are respected (domains → core/shared only, core → standard libs only)
# - Framework-agnostic utilities are in core/utils/, framework-specific code in core/lib/
```
