# Structure Completion Tracking

This document tracks the completion of the project folder structure compared to `docs/structure.md`.

**Last Updated:** 2025-01-27 (Updated to match actual implementations)

---

## Root Layout (repo-level)

- [x] `index.html` - HTML entry point
- [x] `package.json` - Scripts, engines, packageManager
- [x] `pnpm-lock.yaml` - Locked deps
- [x] `tsconfig.base.json` - Base compiler options and path aliases
- [x] `tsconfig.json` - Project references orchestrator
- [x] `tsconfig.app.json` - Application source code config
- [x] `tsconfig.node.json` - Node/Vite configs
- [x] `tsconfig.vitest.json` - Unit tests config
- [x] `tsconfig.build.json` - Build/CI config
- [x] `vite.config.ts` - Vite config
- [x] `vitest.config.ts` - Vitest config
- [x] `playwright.config.ts` - Playwright E2E config
- [x] `tailwind.config.ts` - Tailwind CSS config
- [x] `postcss.config.cjs` - PostCSS + Tailwind pipeline
- [x] `eslint.config.js` - ESLint flat config
- [x] `.prettierrc` - Prettier config
- [x] `.editorconfig` - Consistent editor defaults
- [x] `.gitattributes` - Line endings normalization
- [x] `.gitignore` - Node, build artifacts, env files
- [x] `.env.example` - Environment variable template
- [x] `.cursorignore` - Cursor AI ignore patterns
- [x] `pnpm-workspace.yaml` - PNPM workspace config
- [x] `.nvmrc` - Node.js version pin
- [x] `.npmrc` - NPM/PNPM config
- [x] `LICENSE` - Project license
- [x] `CODEOWNERS` - Ownership for critical paths
- [x] `SECURITY.md` - Responsible disclosure policy
- [ ] `.github/` - CI workflows and templates (optional)
  - [ ] `.github/workflows/`
    - [ ] `.github/workflows/ci.yml` - typecheck, lint, unit tests, build
    - [ ] `.github/workflows/nightly.yml` - e2e + Lighthouse (optional)
  - [ ] `.github/ISSUE_TEMPLATE/` - Bug/feature templates
  - [ ] `.github/PULL_REQUEST_TEMPLATE.md`
- [x] `README.md` - High-level overview + quickstart

---

## src/

### src/app/ - Application-level entry point and providers

- [x] `app/App.tsx` - Root React component
- [x] `app/main.tsx` - Application bootstrap
- [x] `app/router.tsx` - Centralized route definitions
- [x] `app/pages/` - App-level system pages
  - [x] `app/pages/Error404.tsx` - Not Found page
  - [x] `app/pages/Error500.tsx` - Fallback error page
- [ ] `app/routes.guards.ts` - Auth/feature flag guards (optional)
- [ ] `app/pwa/` - Progressive Web App shell (optional)
  - [ ] `app/pwa/registerSW.ts` - PWA registration
  - [ ] `app/pwa/serviceWorker.ts` - Service worker entry
- [x] `app/providers/` - Global context providers
  - [ ] `app/providers/AuthProvider.tsx` - Handles user authentication state (optional)
  - [x] `app/providers/QueryProvider.tsx` - React Query / data fetching context
  - [x] `app/providers/ThemeProvider.tsx` - Provides theme (light/dark/system) and design tokens
  - [x] `app/providers/ThemeContext.tsx` - Theme context definition
  - [x] `app/providers/useTheme.ts` - Hook to access theme context
  - [ ] `app/providers/AnimationProvider.tsx` - Framer Motion LazyMotion/AnimatePresence config (optional)
  - [ ] `app/providers/AnalyticsProvider.tsx` - Tracks user events & interactions (optional)

### src/core/ - Framework-agnostic, reusable, domain-independent code

- [x] `core/config/` - App-wide configuration
  - [x] `core/config/env.client.ts` - Zod-validated import.meta.env surface
  - [x] `core/config/routes.ts` - Global route path constants
  - [x] `core/config/runtime.ts` - Runtime configuration loader from public/runtime-config.json
  - [x] `core/config/init.ts` - Configuration initialization that sets up runtime config and httpClient
  - [ ] `core/config/features.ts` - Feature flags or toggles (optional)
  - [ ] `core/config/seo.ts` - App-wide SEO defaults (optional)
  - [ ] `core/config/featureFlags.ts` - Centralized definition of feature flags (optional)
- [x] `core/lib/` - Framework-specific utilities
  - [x] `core/lib/httpClient.ts` - Generic HTTP client (fetch-based wrapper)
  - [x] `core/lib/httpClientHelpers.ts` - Helper functions for httpClient
  - [x] `core/lib/httpClientInterceptors.ts` - Interceptor utilities
  - [x] `core/lib/ErrorBoundary.tsx` - Global ErrorBoundary React component
  - [x] `core/lib/ErrorBoundaryWrapper.tsx` - Wrapper that injects logger from context
  - [ ] `core/lib/formatDate.ts` - Date formatting utility (optional)
  - [ ] `core/lib/date.ts` - Other date utilities (optional)
- [x] `core/utils/` - Framework-agnostic utilities
  - [x] `core/utils/debounce.ts` - Debounce utility
  - [x] `core/utils/throttle.ts` - Throttle utility
  - [x] `core/utils/classNames.ts` - Class names helper
- [ ] `core/router/` - Routing helpers (generated constants)
  - [ ] `core/router/routes.gen.ts` - Generated; do not edit by hand
- [ ] `core/http/` - HTTP helpers
  - [ ] `core/http/errorAdapter.ts` - Normalizes provider errors → typed domain errors
- [ ] `core/analytics/` - Analytics primitives (optional)
  - [ ] `core/analytics/featureFlags/` - Exposure tracking helpers
  - [ ] `core/analytics/metricsAdapter.ts` - Performance/metrics adapter interface
- [x] `core/ports/` - Hexagonal ports (framework-agnostic interfaces)
  - [x] `core/ports/LoggerPort.ts` - Interface consumed by core/domain for logging
  - [x] `core/ports/StoragePort.ts` - Interface for key/value storage access
  - [x] `core/ports/HttpPort.ts` - Interface for making HTTP requests
  - [ ] `core/ports/AnalyticsPort.ts` - Interface for tracking events (optional)
  - [ ] `core/ports/WorkersPort.ts` - Interface for scheduling/worker messaging (optional)
- [x] `core/providers/` - Core port providers (dependency injection)
  - [x] `core/providers/LoggerProvider.tsx` - Provides LoggerPort instance via React Context
  - [x] `core/providers/LoggerContext.tsx` - Logger context definition
  - [x] `core/providers/useLogger.ts` - Hook to access LoggerPort from context
  - [x] `core/providers/StorageProvider.tsx` - Provides StoragePort instance via React Context
  - [x] `core/providers/StorageContext.tsx` - Storage context definition
  - [x] `core/providers/useStorage.ts` - Hook to access StoragePort from context
  - [x] `core/providers/HttpProvider.tsx` - Provides HttpPort instance via React Context
  - [x] `core/providers/HttpContext.tsx` - HTTP context definition
  - [x] `core/providers/useHttp.ts` - Hook to access HttpPort from context
- [x] `core/hooks/` - Generic reusable hooks
  - [x] `core/hooks/useDebounce.ts` - Debounce a value or callback
  - [x] `core/hooks/useThrottle.ts` - Throttle a value or callback
  - [x] `core/hooks/useToggle.ts` - Boolean toggle hook
  - [x] `core/hooks/useLocalStorage.ts` - Reads/writes to localStorage via StoragePort
  - [x] `core/hooks/useFetch.ts` - Generic data fetching hook
  - [x] `core/hooks/useAsync.ts` - Generic async execution hook
  - [x] `core/hooks/useMediaQuery.ts` - Hook to track media query matches
  - [x] `core/hooks/useWindowSize.ts` - Hook to track window dimensions
  - [x] `core/hooks/usePrevious.ts` - Returns previous state/value
- [ ] `core/i18n/` - Internationalization (translations)
  - [ ] `core/i18n/i18n.ts` - Core i18n instance
  - [ ] `core/i18n/types.ts` - TypeScript types for translations keys
- [x] `core/a11y/` - Accessibility helpers and primitives (optional)
  - [x] `core/a11y/focus.ts` - Focus management utilities
  - [x] `core/a11y/skipToContent.tsx` - Skip link component
- [x] `core/forms/` - Form abstraction layer (optional, library-agnostic)
  - [x] `core/forms/formAdapter.ts` - Adapter interface over chosen form lib
  - [x] `core/forms/zodResolver.ts` - Zod resolver for validation
  - [x] `core/forms/controller.tsx` - Controller component for controlled components
  - [x] `core/forms/useController.ts` - useController hook and related types
- [ ] `core/perf/` - Performance utilities (optional)
  - [ ] `core/perf/reportWebVitals.ts` - Web Vitals reporting entry
- [x] `core/security/` - Security helpers
  - [x] `core/security/sanitizeHtml.ts` - DOM sanitization utilities
  - [x] `core/security/csp.ts` - CSP recommendations and helpers
  - [x] `core/security/permissions.ts` - Permission model helpers
- [x] `core/ui/` - Atomic UI components
  - [ ] `core/ui/loadable.ts` - Thin wrapper around React.lazy/Suspense (optional)
  - [ ] `core/ui/animation/` - Framer Motion integration surface (optional)
    - [ ] `core/ui/animation/motion.ts` - Re-exports configured motion, LazyMotion, AnimatePresence
    - [ ] `core/ui/animation/variants.ts` - Shared, parameterized variant factories
    - [ ] `core/ui/animation/transitions.ts` - Timing and easing defaults
  - [ ] `core/ui/atoms/` - Atomic Design (optional when scaling)
  - [ ] `core/ui/molecules/`
  - [ ] `core/ui/organisms/`
  - [x] `core/ui/theme/` - Component token bridge (design tokens)
    - [x] `core/ui/theme/tokens.ts` - Component token definitions derived from design tokens
  - [x] `core/ui/variants/` - Component variants (e.g., with cva) (optional)
    - [x] `core/ui/variants/button.ts` - Button variants using cva
    - [x] `core/ui/variants/iconButton.ts` - IconButton variants using cva
    - [x] `core/ui/variants/input.ts` - Input variants using cva
    - [x] `core/ui/variants/errorText.ts` - ErrorText variants
    - [x] `core/ui/variants/helperText.ts` - HelperText variants
    - [x] `core/ui/variants/label.ts` - Label variants
    - [x] `core/ui/variants/modal.ts` - Modal variants
    - [x] `core/ui/variants/spinner.ts` - Spinner variants
    - [x] `core/ui/variants/icon.ts` - Icon variants
  - [x] `core/ui/button/` - Button component folder
    - [x] `core/ui/button/Button.tsx` - Main Button component
  - [x] `core/ui/input/` - Input component folder
    - [x] `core/ui/input/Input.tsx` - Main Input component (exports types from @src-types/ui)
    - [x] `core/ui/input/InputHelpers.ts` - Helper functions
    - [x] `core/ui/input/InputParts.tsx` - Sub-components and type interfaces
    - [x] `core/ui/input/useInput.ts` - Input hook
  - [x] `core/ui/modal/` - Modal component folder
    - [x] `core/ui/modal/Modal.tsx` - Main Modal component (exports types from @src-types/ui)
    - [x] `core/ui/modal/ModalBody.tsx` - Modal body component
    - [x] `core/ui/modal/ModalDialog.tsx` - Modal dialog wrapper
    - [x] `core/ui/modal/ModalHelpers.ts` - Helper functions
    - [x] `core/ui/modal/ModalParts.tsx` - Sub-components
    - [x] `core/ui/modal/useModal.ts` - Modal hooks (focus management, escape key)
    - [x] `core/ui/modal/useModalSetup.ts` - Modal setup hook (includes type interfaces)
  - [x] `core/ui/spinner/` - Spinner component folder
    - [x] `core/ui/spinner/Spinner.tsx` - Main Spinner component
    - [x] `core/ui/spinner/SpinnerHelpers.ts` - Helper functions
    - [x] `core/ui/spinner/SpinnerParts.tsx` - Sub-components
  - [x] `core/ui/icons/` - Icon components folder
    - [x] `core/ui/icons/clear-icon/ClearIcon.tsx` - Clear icon component
    - [x] `core/ui/icons/close-icon/CloseIcon.tsx` - Close icon component
    - [x] `core/ui/icons/heart-icon/HeartIcon.tsx` - Heart icon component
    - [x] `core/ui/icons/search-icon/SearchIcon.tsx` - Search icon component
    - [x] `core/ui/icons/settings-icon/SettingsIcon.tsx` - Settings icon component
  - [x] `core/ui/error-text/` - ErrorText component folder
    - [x] `core/ui/error-text/ErrorText.tsx` - Error text component
  - [x] `core/ui/helper-text/` - HelperText component folder
    - [x] `core/ui/helper-text/HelperText.tsx` - Helper text component
  - [x] `core/ui/icon-button/` - IconButton component folder
    - [x] `core/ui/icon-button/IconButton.tsx` - Icon button component
  - [x] `core/ui/label/` - Label component folder
    - [x] `core/ui/label/Label.tsx` - Label component
  - [ ] `core/ui/Textarea.tsx` - Multi-line input (optional)
  - [ ] `core/ui/Select.tsx` - Select/dropdown (optional)
  - [ ] `core/ui/Checkbox.tsx` - Checkbox (optional)
  - [ ] `core/ui/Radio.tsx` - Radio button (optional)
  - [ ] `core/ui/Switch.tsx` - Toggle switch (optional)
  - [ ] `core/ui/Tooltip.tsx` - Tooltip primitive (optional)
  - [ ] `core/ui/Popover.tsx` - Popover primitive (optional)
  - [ ] `core/ui/Drawer.tsx` - Drawer/side panel (optional)
  - [ ] `core/ui/Tabs.tsx` - Tabs (optional)
  - [ ] `core/ui/Accordion.tsx` - Accordion (optional)
  - [ ] `core/ui/Table.tsx` - Simple table (optional)
  - [ ] `core/ui/Pagination.tsx` - Pagination controls (optional)
  - [ ] `core/ui/Skeleton.tsx` - Loading skeleton (optional)
  - [ ] `core/ui/Badge.tsx` - Badge/label (optional)
  - [ ] `core/ui/Avatar.tsx` - Avatar/image (optional)
  - [ ] `core/ui/Text.tsx` - Typography paragraph component (optional)
  - [ ] `core/ui/Heading.tsx` - Typography heading component (h1-h6) (optional)
  - [ ] `core/ui/Icon.tsx` - Generic icon wrapper (optional)
  - [ ] `core/ui/icons/` - Icon registry (optional)
    - [ ] `core/ui/icons/registry.ts` - Central icon registry
- [x] `core/constants/` - Core/global constants
  - [x] `core/constants/designTokens.ts` - Tailwind tokens or design system values
  - [x] `core/constants/theme.ts` - Theme type definitions ('light' | 'dark' | 'system')
  - [x] `core/constants/ui.ts` - UI component constants (size classes, variant classes)
  - [x] `core/constants/endpoints.ts` - API endpoint constants (API_ENDPOINTS, buildApiUrl helper)
  - [x] `core/constants/env.ts` - Environment-derived constants (IS_DEV, IS_PROD, etc.)
  - [ ] `core/constants/appConstants.ts` - App-wide constants (optional)
  - [ ] `core/constants/breakpoints.ts` - Consistent media query breakpoints (optional)
  - [ ] `core/constants/timeouts.ts` - Network/UI timeouts and retry delays (optional)
  - [ ] `core/constants/regex.ts` - Shared regular expressions (optional)
  - [ ] `core/constants/aria.ts` - ARIA roles/names for a11y consistency (optional)
- [x] `core/README.md` - Documentation explaining lib/ vs utils/ distinction

### src/domains/ - Self-contained business domains

- [x] `domains/landing/` - Landing domain (demonstration domain)
  - [x] `domains/landing/pages/` - Full-page components for routing
    - [x] `domains/landing/pages/LandingPage.tsx` - Landing page component
  - [x] `domains/landing/components/` - Domain-specific UI components
    - [x] `domains/landing/components/ApiDemoSection.tsx` - Demonstrates httpClient usage
    - [x] `domains/landing/components/ButtonSection.tsx` - Demonstrates Button component
    - [x] `domains/landing/components/CloseIconSection.tsx` - Demonstrates CloseIcon component
    - [x] `domains/landing/components/FormsSection.tsx` - Demonstrates form adapter and Controller/useController usage
    - [x] `domains/landing/components/HooksDemoSection/` - HooksDemoSection subdirectory
      - [x] `domains/landing/components/HooksDemoSection/HooksDemoSection.tsx` - Main section component
      - [x] `domains/landing/components/HooksDemoSection/UseAsyncDemo.tsx` - Demonstrates useAsync hook
      - [x] `domains/landing/components/HooksDemoSection/UseFetchDemo.tsx` - Demonstrates useFetch hook
      - [x] `domains/landing/components/HooksDemoSection/UseLocalStorageDemo.tsx` - Demonstrates useLocalStorage hook
      - [x] `domains/landing/components/HooksDemoSection/UseMediaQueryDemo.tsx` - Demonstrates useMediaQuery hook
      - [x] `domains/landing/components/HooksDemoSection/UsePreviousDemo.tsx` - Demonstrates usePrevious hook
      - [x] `domains/landing/components/HooksDemoSection/UseThrottleDemo.tsx` - Demonstrates useThrottle hook
      - [x] `domains/landing/components/HooksDemoSection/UseWindowSizeDemo.tsx` - Demonstrates useWindowSize hook
    - [x] `domains/landing/components/IconButtonSection.tsx` - Demonstrates IconButton component
    - [x] `domains/landing/components/InputSection/` - InputSection subdirectory
      - [x] `domains/landing/components/InputSection/InputSectionParts.tsx` - InputSection sub-components
    - [x] `domains/landing/components/InputSection.tsx` - Demonstrates Input component
    - [x] `domains/landing/components/LabelSection.tsx` - Demonstrates Label component
    - [x] `domains/landing/components/ModalSection/` - ModalSection subdirectory
      - [x] `domains/landing/components/ModalSection/ModalSectionModals.tsx` - ModalSection sub-components
    - [x] `domains/landing/components/ModalSection.tsx` - Demonstrates Modal component
    - [x] `domains/landing/components/SearchSection.tsx` - Demonstrates useDebounce hook
    - [x] `domains/landing/components/SpinnerSection.tsx` - Demonstrates Spinner component
    - [x] `domains/landing/components/StorageSection.tsx` - Demonstrates storage integration
    - [x] `domains/landing/components/TextComponentsSection.tsx` - Demonstrates ErrorText, HelperText components
    - [x] `domains/landing/components/ThemeSection.tsx` - Demonstrates theme integration
    - [x] `domains/landing/components/ToggleSection.tsx` - Demonstrates useToggle and classNames
    - [x] `domains/landing/components/UserNameForm.tsx` - Form component for user name
  - [x] `domains/landing/hooks/` - Domain-specific hooks
    - [x] `domains/landing/hooks/useLandingStorage.ts` - Landing page storage operations
  - [ ] `domains/landing/routes.ts` - Domain-level routes aggregation (optional)
  - [ ] `domains/landing/i18n/` - Domain-specific translations (optional)
  - [ ] `domains/landing/models/` - Domain-specific TypeScript interfaces/types (optional)
  - [ ] `domains/landing/services/` - API/services specific to the domain (optional)
  - [ ] `domains/landing/store/` - Zustand store for domain (optional)
  - [ ] `domains/landing/constants.ts` - Domain-specific constants and enums (optional)
- [ ] `domains/shared/` - Cross-domain shared features
  - [ ] `domains/shared/auth/` - Authentication system
    - [ ] `domains/shared/auth/pages/` - Optional: login, signup pages
    - [ ] `domains/shared/auth/components/`
    - [ ] `domains/shared/auth/hooks/`
    - [ ] `domains/shared/auth/services/`
    - [ ] `domains/shared/auth/store/`
  - [ ] `domains/shared/notifications/` - Alerts, banners, toasts
    - [ ] `domains/shared/notifications/components/`
      - [ ] `domains/shared/notifications/components/Alert.tsx`
      - [ ] `domains/shared/notifications/components/Banner.tsx`
      - [ ] `domains/shared/notifications/components/Toast.tsx`
    - [ ] `domains/shared/notifications/hooks/`
      - [ ] `domains/shared/notifications/hooks/useNotifications.ts`
      - [ ] `domains/shared/notifications/hooks/useToastQueue.ts`
    - [ ] `domains/shared/notifications/models/`
      - [ ] `domains/shared/notifications/models/notification.ts`
    - [ ] `domains/shared/notifications/store/`
      - [ ] `domains/shared/notifications/store/notificationStore.ts`
    - [ ] `domains/shared/notifications/services/`
      - [ ] `domains/shared/notifications/services/notificationService.ts`
    - [ ] `domains/shared/notifications/constants.ts`
  - [ ] `domains/shared/analytics/` - Event tracking and metrics
    - [ ] `domains/shared/analytics/hooks/`
      - [ ] `domains/shared/analytics/hooks/useAnalytics.ts`
    - [ ] `domains/shared/analytics/models/`
      - [ ] `domains/shared/analytics/models/analytics.ts`
    - [ ] `domains/shared/analytics/services/`
      - [ ] `domains/shared/analytics/services/analyticsService.ts`
    - [ ] `domains/shared/analytics/adapters/`
      - [ ] `domains/shared/analytics/adapters/googleAnalyticsAdapter.ts`
      - [ ] `domains/shared/analytics/adapters/customAdapter.ts`

### src/infrastructure/ - Technical adapters & framework-specific code

- [ ] `infrastructure/api/`
  - [ ] `infrastructure/api/axiosInstance.ts` - Configured Axios instance
  - [ ] `infrastructure/api/interceptors.ts` - Request/response interceptors
- [ ] `infrastructure/auth/`
  - [ ] `infrastructure/auth/jwtAdapter.ts` - JWT handling for authentication
- [x] `infrastructure/logging/`
  - [x] `infrastructure/logging/loggerAdapter.ts` - Console-based logging implementation
    # Implements LoggerPort interface, SSR-safe
- [x] `infrastructure/storage/`
  - [x] `infrastructure/storage/localStorageAdapter.ts` - Encapsulates localStorage access
    # Implements StoragePort interface, SSR-safe with availability checks
  - [x] `infrastructure/storage/cookieStorageAdapter.ts` - Encapsulates cookie access
    # Implements StoragePort interface, SSR-safe cookie handling with options
- [ ] `infrastructure/api/` - API adapters (optional)
- [ ] `infrastructure/auth/` - Auth adapters (optional)
- [ ] `infrastructure/analytics/` - Analytics adapters (optional)
- [ ] `infrastructure/observability/` - Telemetry adapters (optional)
- [ ] `infrastructure/security/` - Security adapters (optional)
- [ ] `infrastructure/storage/indexeddb/` - IndexedDB adapter (optional)

### src/workers/ - Web workers & background tasks (optional)

- [ ] `workers/imageOptimizer.worker.ts` - Example worker entry
- [ ] `workers/dataProcessor.worker.ts` - Long-running CPU-bound tasks
- [ ] `workers/messaging.ts` - Type-safe postMessage helpers

### src/shared/ - Reusable composite components & helpers

- [x] `shared/components/` - Shared components
  - [x] `shared/components/layout/`
    - [x] `shared/components/layout/Layout.tsx` - Main layout wrapper with Navbar
    - [x] `shared/components/layout/Navbar.tsx` - Main navigation component
  - [x] `shared/components/ui/`
    - [x] `shared/components/ui/ThemeToggle.tsx` - Theme toggle component
- [ ] `shared/components/navigation/` - Navigation components (optional)
- [ ] `shared/components/data-display/` - Data display components (optional)
- [ ] `shared/components/feedback/` - Feedback components (optional)
- [ ] `shared/components/animated/` - Animated composites (optional)
- [ ] `shared/hooks/` - Shared hooks (optional)
- [ ] `shared/utils/` - Shared utilities (optional)

### src/assets/ - Static assets

- [ ] `assets/images/`
- [ ] `assets/icons/`
  - [ ] `assets/icons/svg/` - Raw SVG sources
- [ ] `assets/fonts/`
- [ ] `assets/animations/`
- [ ] `assets/media/` - Videos, large media files

### src/styles/ - Global styles

- [x] `styles/globals.css` - Global styles
- [ ] `styles/base/` - Global resets
- [ ] `styles/utilities/`
- [ ] `styles/theme/`
- [ ] `styles/lib/`
  - [ ] `styles/lib/animations/`
  - [ ] `styles/lib/mixins/`

### src/types/ - Centralized TypeScript types

- [ ] `types/api/`
  - [ ] `types/api/index.ts`
  - [ ] `types/api/auth.ts`
- [ ] `types/domains/`
  - [ ] `types/domains/landing.ts` (optional)
- [ ] `types/generated/` - Codegen output (do not edit)
- [ ] `types/zod/` - Cross-cutting schemas and inferred types
  - [ ] `types/zod/pagination.ts`
- [ ] `types/result.ts` - Result/Either utilities
- [ ] `types/branding.ts` - Branded/nominal types
- [ ] `types/pagination.ts` - Page/pagination types
- [ ] `types/hooks.ts`
- [ ] `types/enums.ts`
- [ ] `types/events.ts`
- [ ] `types/forms.ts`
- [ ] `types/layout.ts`
- [ ] `types/common.ts`

### tests/ - Test files

- [x] `tests/setupTests.ts` - Vitest setup
- [x] `tests/vitest-env.d.ts` - TypeScript environment declarations for Vitest
- [x] `tests/utils/testUtils.tsx` - Custom render with providers (`renderWithProviders`)
- [x] `tests/utils/TestProviders.tsx` - React component that composes all providers for testing
- [x] `tests/utils/mocks/` - Mock adapters
  - [x] `tests/utils/mocks/MockStorageAdapter.ts` - Mock StoragePort implementation
  - [x] `tests/utils/mocks/MockLoggerAdapter.ts` - Mock LoggerPort implementation
  - [x] `tests/utils/mocks/MockHttpAdapter.ts` - Mock HttpPort implementation
- [ ] `tests/factories/` - Test data builders (optional)
- [ ] `tests/mocks/` - MSW handlers and payloads (optional)
- [x] `tests/domains/landing/`
  - [x] `tests/domains/landing/pages/` - Domain test directory structure
  - [ ] `tests/domains/landing/hooks/useLandingStorage.test.ts` (optional)
  - [ ] `tests/domains/landing/store/landingStore.test.ts` (optional, store not yet implemented)
- [ ] `tests/shared/` - Shared composites tests (optional)
  - [ ] `tests/shared/utils/formatCurrency.test.ts` (optional)

### e2e/ - End-to-end tests

- [x] `e2e/example.spec.ts` - Example Playwright spec
- [ ] `e2e/landing/` - Landing domain E2E tests (optional)
  - [ ] `e2e/landing/landingPage.spec.ts` (optional)
- [ ] `e2e/auth/`
  - [ ] `e2e/auth/loginFlow.spec.ts`

### scripts/ - Build and development scripts

- [ ] `scripts/codegen.ts` - Codegen for APIs/types
- [ ] `scripts/generate.ts` - Scaffold new domain/pages/components/tests (optional)
- [ ] `scripts/sync-design-tokens.ts` - Sync tokens -> Tailwind config bridge (optional)
- [ ] `scripts/mockServer.ts` - Mock server for local dev and CI

### storybook/ - Storybook configuration

- [ ] `storybook/main.ts`
- [ ] `storybook/stories/`
  - [ ] `storybook/stories/Button.stories.tsx`
  - [ ] `storybook/stories/Card.stories.tsx`
  - [ ] `storybook/stories/Input.stories.tsx`
  - [ ] `storybook/stories/Modal.stories.tsx`
  - [ ] `storybook/stories/Layout.stories.tsx`

### public/ - Static assets served by Vite

- [x] `public/manifest.json` - PWA manifest
- [x] `public/favicon.ico` - Default favicon
- [x] `public/icon-96.png` - 96x96 icon
- [x] `public/icon-180.png` - 180x180 icon (Apple touch icon)
- [x] `public/icon-192.png` - 192x192 icon
- [x] `public/icon-384.png` - 384x384 icon
- [x] `public/icon-512.png` - 512x512 icon
- [x] `public/icon-192-maskable.png` - 192x192 maskable icon
- [x] `public/icon-384-maskable.png` - 384x384 maskable icon
- [x] `public/icon-512-maskable.png` - 512x512 maskable icon
- [x] `public/safari-pinned-tab.svg` - Safari pinned tab icon
- [x] `public/og-image.png` - Open Graph/Twitter Card image

### seo/ - SEO helpers

- [ ] `seo/seo.ts` - Centralized metadata helpers
- [ ] `seo/meta.tsx` - Metadata components
- [ ] `seo/jsonld/` - JSON-LD helpers
  - [ ] `seo/jsonld/product.ts`
  - [ ] `seo/jsonld/article.ts`
  - [ ] `seo/jsonld/event.ts`

---

## Notes

### Known Differences

**Note**: As of 2025-01-27, `docs/structure.md` has been updated to reflect the ACTUAL implementation:

- ✅ Domain is correctly documented as `landing` (not `landingTemplate`)
- ✅ All implemented files are marked with ✅ in structure.md
- ✅ Optional files are clearly marked as "(optional)" in structure.md
- ✅ The structure.md now serves as both template guidance AND current state documentation

### Completion Summary

- **Root files**: All configuration files are in place ✅
- **src/app**: ✅ Complete structure with providers, router, components, and pages
  - ✅ QueryProvider, ThemeProvider, ThemeContext, useTheme implemented
  - ✅ AppLayout, PageWrapper components implemented
  - ✅ Error404 page implemented
  - ⚪ AuthProvider, AnimationProvider, AnalyticsProvider - Optional, not needed yet
- **src/core**: ✅ Well-structured core with all essential pieces
  - ✅ Config (env.client.ts, routes.ts, runtime.ts, init.ts)
  - ✅ Lib (httpClient with helpers/interceptors, ErrorBoundary)
  - ✅ Utils (debounce, throttle, classNames - all framework-agnostic)
  - ✅ Hooks (useDebounce, useThrottle, useToggle, useLocalStorage, useFetch, useAsync, useMediaQuery, useWindowSize, usePrevious)
  - ✅ Ports (LoggerPort, StoragePort, HttpPort - all implemented)
  - ✅ Providers (LoggerProvider/Context/useLogger, StorageProvider/Context/useStorage, HttpProvider/Context/useHttp)
  - ✅ Constants (designTokens.ts, theme.ts, ui.ts, endpoints.ts, env.ts)
  - ✅ Config (env.client.ts, routes.ts, runtime.ts, init.ts)
  - ✅ README.md documenting lib/ vs utils/ distinction
  - ✅ UI Components (Button, Input, Modal, Spinner, CloseIcon, ErrorText, HelperText, IconButton, Label - 9 core components + 4 icon components implemented, organized in folders)
  - ✅ Security module implemented (sanitizeHtml, csp, permissions)
  - ✅ Forms module implemented (formAdapter, zodResolver, controller, useController)
  - ✅ All hooks implemented (useDebounce, useThrottle, useToggle, useLocalStorage, useFetch, useAsync, useMediaQuery, useWindowSize, usePrevious)
  - ✅ A11y module implemented (focus.ts, skipToContent.tsx)
  - ⚪ Optional: router/, http/, analytics/, i18n/, perf/
- **src/domains**: ✅ Landing domain fully implemented
  - ✅ LandingPage component
  - ✅ 17+ demonstration components (ApiDemoSection, ButtonSection, CloseIconSection, FormsSection, HooksDemoSection with 7 sub-demos, IconButtonSection, InputSection, LabelSection, ModalSection, SearchSection, SpinnerSection, StorageSection, TextComponentsSection, ThemeSection, ToggleSection, UserNameForm)
  - ✅ useLandingStorage hook
  - ⚪ Optional: routes.ts, i18n/, models/, services/, store/, constants.ts
- **src/infrastructure**: ✅ Core adapters implemented
  - ✅ loggerAdapter.ts (implements LoggerPort, SSR-safe)
  - ✅ localStorageAdapter.ts (implements StoragePort, SSR-safe)
  - ✅ cookieStorageAdapter.ts (implements StoragePort, SSR-safe with options)
  - ⚪ Optional: api/, auth/, analytics/, observability/, security/, storage/indexeddb/
- **src/shared**: ✅ Shared components implemented
  - ✅ Layout and Navbar components
  - ✅ ThemeToggle component
  - ⚪ Optional: navigation/, data-display/, feedback/, animated/, hooks/, utils/
- **src/styles**: ✅ Global styles implemented
  - ✅ globals.css with Tailwind directives
- **tests**: ✅ Basic structure exists
  - ✅ setupTests.ts, vitest-env.d.ts
  - ✅ testUtils.tsx with renderWithProviders function
  - ✅ TestProviders.tsx component for provider composition
  - ✅ Mock adapters (MockStorageAdapter, MockLoggerAdapter)
  - ✅ Domain test directory structure
  - ⚪ Optional: factories/, mocks/ (MSW handlers)
- **e2e**: ✅ Basic example exists
  - ✅ example.spec.ts
  - ⚪ Can be organized by domain as needed
- **public**: ✅ All icons and manifest present ✅
- **src/workers**: ⚪ Optional, not yet created
- **src/assets**: ⚪ Optional, not yet created
- **src/types**: ⚪ Optional, not yet created
- **scripts**: ⚪ Optional, not yet created
- **storybook**: ⚪ Optional, not yet created
- **seo**: ⚪ Optional, not yet created

---

## How to Use

1. Check off items as they are implemented
2. Update "Last Updated" date when making changes
3. Add notes about any deviations from the documented structure
4. Use this to track progress toward full structure compliance
