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
├── .github/                          # CI workflows and templates (optional but recommended)
│   ├── workflows/
│   │   ├── ci.yml                   # typecheck, lint, unit tests, build (PRs to protected branches)
│   │   └── nightly.yml (optional)   # e2e + Lighthouse on main/nightly
│   ├── ISSUE_TEMPLATE/              # Bug/feature templates
│   └── PULL_REQUEST_TEMPLATE.md
└── README.md                         # High-level overview + quickstart

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
│   │   #   - QueryProvider (React Query context)
│   │   #   - BrowserRouter
│   │   # Composition order: LoggerProvider > ErrorBoundary > HttpProvider > StorageProvider > ThemeProvider > QueryProvider > BrowserRouter > Router
│   │
│   ├── main.tsx                          # ✅ Application bootstrap
│   │   # Creates React root and renders <App /> into DOM wrapped in StrictMode
│   │   # Imports global CSS (@styles/globals.css)
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
│       └── useTheme.ts                   # ✅ Hook to access theme context
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
│   │   # features.ts, seo.ts, featureFlags.ts - Optional, not yet implemented
│   │
│   ├── lib/                              # ✅ Framework-specific utilities
│   │   ├── httpClient.ts                 # ✅ Generic HTTP client (fetch-based wrapper)
│   │   │   # Implements HttpPort interface
│   │   │   # Supports interceptors (request, response, error)
│   │   │   # Returns typed responses
│   │   │   # Do not call fetch directly in domains/components
│   │   ├── httpClientHelpers.ts          # ✅ Helper functions for httpClient
│   │   │   # URL building, header merging, body serialization, response parsing
│   │   ├── httpClientInterceptors.ts     # ✅ Interceptor utilities
│   │   │   # Request, response, and error interceptor execution
│   │   ├── ErrorBoundary.tsx             # ✅ Global ErrorBoundary React component
│   │   │   # Production-ready error handling with user-friendly fallback
│   │   │   # Captures/reports errors via logger adapter
│   │   │   # Uses react-router-dom for navigation links
│   │   └── ErrorBoundaryWrapper.tsx      # ✅ Wrapper that injects logger from context
│   │       # Bridges class component (ErrorBoundary) with React hooks (useLogger)
│   │   # formatDate.ts, date.ts - Optional, not yet implemented
│   │
│   ├── utils/                            # ✅ Framework-agnostic utilities
│   │   ├── debounce.ts                   # ✅ Debounce utility (non-React)
│   │   │   # Supports leading, trailing, maxWait options
│   │   │   # Returns debounced function with cancel and flush methods
│   │   ├── throttle.ts                   # ✅ Throttle utility (non-React)
│   │   │   # Supports leading, trailing options
│   │   │   # Returns throttled function with cancel and flush methods
│   │   └── classNames.ts                 # ✅ Class names helper
│   │       # Conditionally join class names (strings, arrays, objects)
│   │
│   # Optional directories not yet implemented:
│   # - router/ (routing helpers, generated constants)
│   # - http/ (HTTP error adapters)
│   # - analytics/ (analytics primitives, feature flags, metrics adapters)
│   #
│   ├── ports/                            # ✅ Hexagonal ports (framework-agnostic interfaces)
│   │   ├── LoggerPort.ts                 # ✅ Interface for logging operations
│   │   │   # Defines debug, info, warn, error methods with context support
│   │   ├── StoragePort.ts                # ✅ Interface for key/value storage access
│   │   │   # Defines getItem, setItem, removeItem, clear, getLength, key methods
│   │   └── HttpPort.ts                   # ✅ Interface for making HTTP requests
│   │       # Defines request, get, post, put, patch, delete methods
│   │       # Infrastructure implements these ports via adapters; domains depend on ports only
│   │   # AnalyticsPort, WorkersPort - Optional, not yet implemented
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
│   │   │   # React hook wrapping throttle utility
│   │   │   # Supports throttling values and callback functions
│   │   │   # Returns throttled value or throttled callback with cancel and flush methods
│   │   ├── useToggle.ts                  # ✅ Boolean toggle hook
│   │   │   # Returns [value, toggle, setTrue, setFalse]
│   │   ├── useLocalStorage.ts            # ✅ Reads/writes to localStorage via StoragePort
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
│   │   └── usePrevious.ts                # ✅ Hook that returns previous value of state/prop
│   │       # Useful for comparing current vs previous values or undo/redo functionality
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
│   │   └── zodResolver.ts                # ✅ Zod validation resolver integration
│   │       # Re-exports zodResolver from @hookform/resolvers/zod
│   │       # Consistent API through form adapter layer
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
│   # Optional directories not yet implemented:
│   # - i18n/ (Internationalization: i18n.ts, types.ts)
│   # - perf/ (Performance utilities: reportWebVitals.ts)
│   #
│   ├── ui/                               # ✅ Atomic UI components
│   │   # Components are domain-agnostic and accessible
│   │   # Each component is organized in its own folder with related files
│   │   ├── button/                        # ✅ Button component folder
│   │   │   └── Button.tsx                 # ✅ Main Button component with variants (primary, secondary, ghost) and sizes (uses getButtonVariantClasses from @core/ui/variants)
│   │   │       # Features: accessible, loading state support, dark mode support
│   │   ├── input/                         # ✅ Input component folder
│   │   │   ├── Input.tsx                 # ✅ Text input with label, error, helper text, and icon support (exports types from @src-types/ui)
│   │   │   ├── InputHelpers.ts           # ✅ Helper functions for input handling (uses getInputVariantClasses from @core/ui/variants)
│   │   │   ├── InputParts.tsx            # ✅ Input sub-components (Label, ErrorText, HelperText) and type interfaces
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
│   │   └── icons/                         # ✅ Icon components folder
│   │       ├── clear-icon/                # ✅ ClearIcon component
│   │       │   └── ClearIcon.tsx          # ✅ Clear icon SVG component
│   │       ├── close-icon/                # ✅ CloseIcon component
│   │       │   └── CloseIcon.tsx          # ✅ Close icon SVG component
│   │       ├── heart-icon/                 # ✅ HeartIcon component
│   │       │   └── HeartIcon.tsx          # ✅ Heart/like icon SVG component
│   │       ├── search-icon/                # ✅ SearchIcon component
│   │       │   └── SearchIcon.tsx        # ✅ Search icon SVG component
│   │       └── settings-icon/              # ✅ SettingsIcon component
│   │           └── SettingsIcon.tsx        # ✅ Settings icon SVG component
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
│   │   │   └── icon.ts                      # ✅ Icon variants
│   │   │       # Exports iconVariants, getIconVariantClasses, IconVariants type (size variants: sm, md, lg)
│   │   │       # Used by all icon components (CloseIcon, ClearIcon, HeartIcon, etc.)
│   │   # Ensure a11y: focus states, aria labels, keyboard navigation
│   │   # Optional components not yet implemented:
│   │   # - loadable.ts, animation/, atoms/, molecules/, organisms/
│   │   # - Textarea.tsx, Select.tsx, Checkbox.tsx, Radio.tsx, Switch.tsx
│   │   # - Tooltip.tsx, Popover.tsx, Drawer.tsx, Tabs.tsx, Accordion.tsx
│   │   # - Table.tsx, Pagination.tsx, Skeleton.tsx, Badge.tsx, Avatar.tsx
│   │   # - Text.tsx, Heading.tsx, Icon.tsx, icons/registry.ts
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
│   │   └── env.ts                        # ✅ Environment-derived constants
│   │       # Thin wrapper around env providing convenience accessors
│   │       # Exports IS_DEV, IS_PROD, ENV_MODE, isDevelopment(), isProduction(), getMode()
│   │   # appConstants.ts, breakpoints.ts, timeouts.ts, regex.ts, aria.ts - Optional, not yet implemented
│   │
│   └── README.md                         # ✅ Documentation explaining lib/ vs utils/ distinction
│
│   # Optional directories not yet implemented:
│   # - router/, http/, analytics/
│
├── domains/                              # Self-contained business domains
│   └── landing/                          # ✅ Landing domain (demonstration domain)
│       ├── pages/                         # ✅ Full-page components for routing
│       │   └── LandingPage.tsx             # ✅ Landing page component
│       │       # Receives theme via props (from PageWrapper.withTheme)
│       │       # Uses domain hooks (useLandingStorage)
│       │       # Orchestrates domain components
│       │       # Never imports from @app or @infra - respects boundaries
│       │
│       ├── components/                    # ✅ Domain-specific UI components
│       │   ├── ApiDemoSection.tsx         # ✅ Demonstrates httpClient usage
│       │   ├── ButtonSection.tsx          # ✅ Demonstrates Button component
│       │   ├── CloseIconSection.tsx       # ✅ Demonstrates CloseIcon component
│       │   ├── FormsSection.tsx           # ✅ Demonstrates form adapter and Controller/useController usage
│       │   ├── HooksDemoSection/          # ✅ HooksDemoSection subdirectory
│       │   │   ├── HooksDemoSection.tsx   # ✅ Main section component that demonstrates core hooks
│       │   │   ├── UseAsyncDemo.tsx       # ✅ Demonstrates useAsync hook
│       │   │   ├── UseFetchDemo.tsx       # ✅ Demonstrates useFetch hook
│       │   │   ├── UseLocalStorageDemo.tsx # ✅ Demonstrates useLocalStorage hook
│       │   │   ├── UseMediaQueryDemo.tsx   # ✅ Demonstrates useMediaQuery hook
│       │   │   ├── UsePreviousDemo.tsx     # ✅ Demonstrates usePrevious hook
│       │   │   ├── UseThrottleDemo.tsx     # ✅ Demonstrates useThrottle hook
│       │   │   └── UseWindowSizeDemo.tsx   # ✅ Demonstrates useWindowSize hook
│       │   ├── IconButtonSection.tsx      # ✅ Demonstrates IconButton component
│       │   ├── InputSection.tsx           # ✅ Demonstrates Input component
│       │   ├── InputSection/              # ✅ InputSection subdirectory for parts
│       │   │   └── InputSectionParts.tsx  # ✅ InputSection sub-components
│       │   ├── LabelSection.tsx           # ✅ Demonstrates Label component
│       │   ├── ModalSection.tsx           # ✅ Demonstrates Modal component
│       │   ├── ModalSection/              # ✅ ModalSection subdirectory for parts
│       │   │   └── ModalSectionModals.tsx # ✅ ModalSection sub-components
│       │   ├── SearchSection.tsx          # ✅ Demonstrates useDebounce hook
│       │   ├── SpinnerSection.tsx         # ✅ Demonstrates Spinner component
│       │   ├── StorageSection.tsx         # ✅ Demonstrates storage integration
│       │   ├── TextComponentsSection.tsx  # ✅ Demonstrates ErrorText, HelperText components
│       │   ├── ThemeSection.tsx           # ✅ Demonstrates theme integration
│       │   ├── ToggleSection.tsx          # ✅ Demonstrates useToggle and classNames
│       │   └── UserNameForm.tsx           # ✅ Form component for user name
│       │   # Components are presentational and accept data via props
│       │
│       └── hooks/                         # ✅ Domain-specific hooks
│           └── useLandingStorage.ts       # ✅ Landing page storage operations
│               # Composes core hooks (useStorage, useLogger) into domain API
│               # Manages visit count and user name persistence
│               # Uses StoragePort via dependency injection (useStorage hook)
│               # Never imports infrastructure adapters directly
│       # routes.ts, i18n/, models/, services/, store/, constants.ts - Optional, not yet implemented
│
│   # domains/shared/ - Optional cross-domain shared features (auth, notifications, analytics)
│   # Not yet implemented
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
│       └── cookieStorageAdapter.ts         # ✅ Encapsulates cookie access
│           # Implements StoragePort interface
│           # SSR-safe cookie handling
│           # Supports cookie options (expires, path, sameSite, secure, domain)
│           # Uses setItemWithOptions() for advanced cookie configuration
│           # Domains access via useStorage() hook (not direct import)
│       # api/, auth/, analytics/, observability/, security/, storage/indexeddb/ - Optional, not yet implemented
│
│   # Hexagonal Architecture: Adapters implement ports; domains depend on ports only
│   # Adapters are injected at app level via providers
│
├── shared/                                # ✅ Reusable composite components & helpers
│   └── components/                        # ✅ Shared components
│       ├── layout/                        # ✅ Layout components
│       │   ├── Layout.tsx                 # ✅ Main layout wrapper with Navbar
│       │   │   # Accepts theme config and children
│       │   │   # Provides consistent page structure
│       │   └── Navbar.tsx                 # ✅ Main navigation component
│       │       # Includes navigation links
│       │       # Optional theme toggle (if theme prop provided)
│       │       # Domain-agnostic: uses routes from core/config/routes
│       │
│       └── ui/                            # ✅ UI components
│           └── ThemeToggle.tsx            # ✅ Theme toggle component
│               # Cycles through: light → dark → system → light
│               # Accessible: keyboard navigable, proper ARIA labels
│               # Presentational component (receives theme via props)
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
│   └── ui.ts                              # ✅ UI component type definitions
│       # Exports StandardSize, ModalSize, ButtonVariant, IconButtonVariant
│       # BaseIconProps, ButtonProps, IconButtonProps, InputProps, LabelProps
│       # BaseTextMessageProps, ErrorTextProps, HelperTextProps, SpinnerProps, ModalProps
│       # All UI components reference types from this file via @src-types/ui
│   # api/, domains/, generated/, zod/, result.ts, etc. - Optional, not yet implemented
│
├── tests/                                 # ✅ Test files
│   ├── setupTests.ts                      # ✅ Vitest setup file
│   ├── vitest-env.d.ts                    # ✅ Vitest type definitions
│   ├── utils/
│   │   ├── testUtils.tsx                  # ✅ Custom render with providers (renderWithProviders)
│   │   │   # Includes MockStorageAdapter, MockLoggerAdapter, and MockHttpAdapter re-exports
│   │   ├── TestProviders.tsx             # ✅ React component composing all providers for testing
│   │   └── mocks/
│   │       ├── MockStorageAdapter.ts      # ✅ Mock StoragePort implementation
│   │       ├── MockLoggerAdapter.ts       # ✅ Mock LoggerPort implementation
│   │       └── MockHttpAdapter.ts         # ✅ Mock HttpPort implementation
│   └── domains/
│       └── landing/
│           └── pages/                     # ✅ Domain tests directory structure
│   # factories/, mocks/ - Optional, not yet implemented
│
├── e2e/                                   # ✅ End-to-end tests
│   └── example.spec.ts                    # ✅ Example Playwright spec
│   # Domain-specific specs - Can be organized as domains grow
│
# Optional directories not yet implemented:
# - scripts/, storybook/, seo/, workers/, assets/
# These can be added when needed as the application grows
# Note: types/ directory exists with ui.ts; additional type files can be added as needed
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
│ └── og-image.png                     # Open Graph/Twitter Card image (1200x630)
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
