# Testing Guide

This guide explains how to write and run tests in the Screaming Architecture starter.

> ℹ️ **Current implementation snapshot:** The repository includes comprehensive test coverage with **1000+ test files** across all modules. Tests are organized by domain and cover:
>
> - **App-level tests**: App composition, components (AppLayout, PageWrapper, ProtectedRoute, RightsLoader, SpeedInsightsLoader), pages (Error404, Error500), providers, and router
> - **Core module tests**: Extensive coverage for a11y, api, auth, config, constants, forms, hooks, http, i18n, lib, perf, providers, router, security, ui components, and utils
> - **Domain tests**: Landing domain pages and shared domain components
> - **Infrastructure tests**: Analytics, auth, logging, maps, and storage adapters
> - **Type tests**: Comprehensive type definition tests
> - **UI component tests**: 700+ test files covering all UI components with functionality, interactions, accessibility, and edge cases

## Overview

The project uses:

- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking
- **Playwright** - End-to-end testing
- **vitest-axe** - Accessibility testing

## Running Tests

**⚠️ Important**: On Windows, tests should be run using Docker to avoid fork runner timeout issues. See [Docker Setup](docker-setup.md) for details.

### Recommended: Using Docker (especially on Windows)

```bash
# Run all unit tests
pnpm run docker:test

# Run tests with coverage
pnpm run docker:test -- --coverage

# Run tests in watch mode
pnpm run docker:test:watch

# Run E2E tests
pnpm run docker:test:e2e
```

### Alternative: Native Execution (Mac/Linux)

If you're on Mac/Linux and Docker is not available:

```bash
# Run all unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with UI
pnpm run test:ui

# Run tests with coverage
pnpm run test:coverage

# Run E2E tests
pnpm run test:e2e

# Run E2E tests with UI
pnpm run test:e2e:ui
```

## Test Structure

Tests are organized to mirror the source code structure:

```
tests/
├── setupTests.ts          # Vitest setup and MSW configuration
├── vitest-env.d.ts        # Vitest type definitions
├── app/                   # App-level tests
│   ├── App.test.tsx       # App composition tests
│   ├── App.analytics.test.tsx  # Analytics integration tests
│   ├── App.providers.test.tsx   # Provider composition tests
│   ├── main.test.tsx      # Bootstrap tests
│   ├── router.test.tsx    # Router tests
│   ├── components/        # Component tests
│   │   ├── AppLayout.test.tsx
│   │   ├── PageWrapper.test.tsx
│   │   ├── ProtectedRoute.test.tsx
│   │   ├── ProtectedRoute.advanced.test.tsx
│   │   ├── ProtectedRoute.test.utils.tsx
│   │   ├── RightsLoader.test.tsx
│   │   └── SpeedInsightsLoader.test.tsx
│   ├── pages/             # Page tests
│   │   ├── Error404.test.tsx
│   │   └── Error500.test.tsx
│   └── providers/         # Provider tests
│       ├── DeferredMotionProvider.test.tsx
│       ├── I18nProvider.test.tsx
│       ├── QueryProvider.test.tsx
│       └── ThemeProvider.test.tsx
├── core/                  # Core module tests (extensive coverage)
│   ├── a11y/              # Accessibility utility tests
│   │   ├── focus/         # Focus management tests (16 files)
│   │   └── skipToContent.test.tsx
│   ├── api/               # API service factory tests (15+ files)
│   │   ├── createApiService.test.ts
│   │   ├── createApiService.error-handling.test.ts
│   │   ├── createApiService.type-safety.test.ts
│   │   ├── createApiService.validation.test.ts
│   │   └── ... (edge cases, request mapping, helpers, etc.)
│   ├── auth/              # Auth utility tests
│   ├── config/            # Configuration tests
│   ├── constants/         # Constants tests (including UI constants)
│   ├── forms/             # Form adapter tests (15+ files)
│   │   ├── formAdapter.core.test.ts
│   │   ├── formAdapter.advanced.test.ts
│   │   ├── controller.test.tsx
│   │   ├── useController.*.test.tsx (multiple files)
│   │   └── ...
│   ├── hooks/             # Hook tests (50+ files)
│   │   ├── async/         # useAsync tests
│   │   ├── debounce/      # useDebounce tests
│   │   ├── fetch/         # useFetch tests
│   │   ├── http/          # useHttpClientAuth tests
│   │   ├── interval/      # useInterval tests
│   │   ├── motion/        # Motion hook tests (8 files)
│   │   ├── scroll/        # useScrollPosition tests
│   │   ├── seo/           # useSEO tests
│   │   ├── storage/       # Storage hook tests
│   │   ├── throttle/      # useThrottle tests
│   │   └── ui/            # UI hook tests
│   ├── http/              # HTTP error adapter tests
│   ├── i18n/              # i18n system tests (21 files)
│   ├── lib/               # Framework-specific library tests (26 files)
│   │   ├── date/          # Date utility tests
│   │   └── http/          # HTTP client tests
│   ├── perf/              # Performance utility tests
│   ├── providers/         # Provider tests
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── http/
│   │   ├── logger/
│   │   ├── snackbar/
│   │   ├── storage/
│   │   └── toast/
│   ├── router/            # Router utility tests (7 files)
│   ├── security/          # Security utility tests (16 files)
│   ├── ui/                # UI component tests (700+ files)
│   │   ├── data-display/  # Data display component tests
│   │   ├── feedback/      # Feedback component tests
│   │   ├── forms/         # Form component tests (extensive)
│   │   ├── navigation/    # Navigation component tests
│   │   ├── overlays/      # Overlay component tests
│   │   ├── media/         # Media component tests
│   │   ├── utilities/     # Utility component tests
│   │   └── layout/        # Layout component tests
│   └── utils/             # Utility function tests (18 files)
├── domains/               # Domain tests
│   ├── landing/           # Landing domain tests
│   └── shared/            # Shared domain tests (14 files)
├── infrastructure/        # Infrastructure adapter tests (32 files)
│   ├── analytics/         # Analytics adapter tests (6 files)
│   ├── auth/              # Auth adapter tests (4 files)
│   ├── logging/           # Logging adapter tests (5 files)
│   ├── maps/              # Maps adapter tests (4 files)
│   └── storage/           # Storage adapter tests (13 files)
├── types/                 # Type definition tests (19 files)
│   ├── api/
│   └── ui/
├── shared/                # Shared component tests
├── factories/             # Test data factories
│   ├── apiFactories.ts
│   └── userFactories.ts
├── mocks/                 # MSW handlers and payloads
│   ├── handlers.ts        # MSW request handlers + helper functions (createNotFoundHandler, createErrorHandler)
│   ├── payloads.ts        # Pre-defined response payloads (defaultSlideshowResponse, emptySlideshowResponse, error payloads: notFoundError, internalServerError, unauthorizedError, forbiddenError, validationError)
│   └── server.ts          # MSW server setup helper
└── utils/                 # Test utilities
    ├── a11y.ts            # Accessibility testing helpers (expectA11y, getA11yViolations)
    ├── TestProviders.tsx  # Provider wrapper for tests
    ├── testUtils.tsx       # renderWithProviders helper + throwTestError utility
    ├── mocks/             # Mock adapters (5 files)
    │   ├── MockStorageAdapter.ts
    │   ├── MockLoggerAdapter.ts
    │   ├── MockHttpAdapter.ts
    │   ├── MockAuthAdapter.ts
    │   └── MockAnalyticsAdapter.ts
    └── polyfills/         # Test polyfills for jsdom (3 files)
        ├── DataTransfer.polyfill.ts  # DataTransfer API polyfill
        ├── DragEvent.polyfill.ts      # DragEvent API polyfill
        └── StorageEvent.polyfill.ts    # StorageEvent API polyfill
```

## Writing Component Tests

### Basic Component Test

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
	it('renders correctly', () => {
		render(<MyComponent />);
		expect(screen.getByText('Hello')).toBeInTheDocument();
	});
});
```

### Testing with Providers

Use `renderWithProviders` to render components with all providers:

```tsx
import { renderWithProviders, screen } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
	it('renders with providers', () => {
		renderWithProviders(<MyComponent />);
		expect(screen.getByText('Hello')).toBeInTheDocument();
	});
});
```

### Custom Provider Configuration

Override default providers for specific test scenarios:

```tsx
import { renderWithProviders } from '@tests/utils/testUtils';
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { MemoryRouter } from 'react-router-dom';

// Basic override
const authenticatedAuth = new MockAuthAdapter();
authenticatedAuth.setToken('test-token');

renderWithProviders(<MyComponent />, {
	auth: authenticatedAuth,
});

// Advanced configuration with multiple overrides
renderWithProviders(<MyComponent />, {
	auth: authenticatedAuth,
	storage: new MockStorageAdapter(),
	defaultTheme: 'dark',
	router: MemoryRouter,
	routerProps: { initialEntries: ['/custom-path'] },
	analyticsConfig: {
		writeKey: 'test-key',
		containerId: 'test-container',
	},
});
```

## Testing Hooks

### Testing Custom Hooks

```tsx
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMyHook } from './useMyHook';
import { renderWithProviders } from '@tests/utils/testUtils';

describe('useMyHook', () => {
	it('returns expected value', () => {
		const { result } = renderHook(() => useMyHook(), {
			wrapper: ({ children }) => renderWithProviders(children),
		});

		expect(result.current.value).toBe('expected');
	});
});
```

## Test Setup and Configuration

### Setup File (`tests/setupTests.ts`)

The test setup file configures:

- **Vitest extensions**: `@testing-library/jest-dom/vitest` for DOM matchers, `vitest-axe/extend-expect` for accessibility matchers
- **MSW server**: Automatically starts before all tests, resets handlers after each test, closes after all tests
- **i18n initialization**: Awaits `i18nInitPromise` before all tests run
- **Console suppression**: Suppresses expected warnings (i18next backend, React act() warnings, unrecognized DOM props)
- **DOM mocks**:
  - `HTMLDialogElement.showModal()` and `close()` for Modal component tests
  - `window.matchMedia` for ThemeProvider tests
- **jsdom polyfills**:
  - `DataTransfer` polyfill for drag-and-drop tests
  - `DragEvent` polyfill for drag event tests
  - `StorageEvent` polyfill for cross-tab storage sync tests

### MSW Configuration

MSW is configured in `tests/setupTests.ts`. Add handlers in `tests/mocks/handlers.ts`:

```ts
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
	http.get('/api/users/:id', ({ params }) => {
		const { id } = params;
		return HttpResponse.json({
			id,
			name: 'Test User',
			email: 'test@example.com',
		});
	}),
];
```

### Testing Services

```tsx
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@tests/utils/testUtils';
import { useHttp } from '@core/providers/http/useHttp';
import { createGetUserService } from './getUserService';

describe('getUserService', () => {
	it('fetches user data', async () => {
		const { result } = renderHook(() => useHttp(), {
			wrapper: ({ children }) => renderWithProviders(children),
		});

		const http = result.current;
		const service = createGetUserService(http);
		const serviceResult = await service.execute({ id: '123' });

		expect(serviceResult.success).toBe(true);
		if (serviceResult.success) {
			expect(serviceResult.data.name).toBe('Test User');
		}
	});
});
```

### Overriding MSW Handlers in Tests

Override handlers for specific test scenarios:

```tsx
import { http, HttpResponse } from 'msw';
import { server } from '@tests/setupTests';
import { createErrorHandler, createNotFoundHandler } from '@tests/mocks/handlers';

// Method 1: Direct handler override
it('handles API errors', async () => {
	server.use(
		http.get('/api/users/:id', () => {
			return HttpResponse.json({ error: 'Not found' }, { status: 404 });
		})
	);

	// Test error handling
});

// Method 2: Using helper functions
it('handles 404 errors', async () => {
	server.use(createNotFoundHandler('/api/users/:id', 'get'));

	// Test 404 handling
});

it('handles server errors', async () => {
	server.use(createErrorHandler('/api/users', 500, 'Internal Server Error', 'INTERNAL_ERROR'));

	// Test error handling
});

it('handles unauthorized errors', async () => {
	server.use(createErrorHandler('/api/protected', 401, 'Unauthorized', 'UNAUTHORIZED'));

	// Test authentication error handling
});
```

### MSW Handler Helpers

The `tests/mocks/handlers.ts` file provides helper functions:

- `createNotFoundHandler(path, method?)`: Creates a handler that returns 404 Not Found
- `createErrorHandler(path, status?, message?, code?, method?)`: Creates a handler that returns an error response

These helpers make it easy to test error scenarios without writing full handler functions.

## Testing Forms

### Testing Form Components

```tsx
import { renderWithProviders, screen } from '@tests/utils/testUtils';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import MyForm from './MyForm';

describe('MyForm', () => {
	it('submits form data', async () => {
		const user = userEvent.setup();
		const handleSubmit = vi.fn();

		renderWithProviders(<MyForm onSubmit={handleSubmit} />);

		await user.type(screen.getByLabelText('Name'), 'John Doe');
		await user.click(screen.getByRole('button', { name: 'Submit' }));

		expect(handleSubmit).toHaveBeenCalledWith({
			name: 'John Doe',
		});
	});
});
```

## Testing with Authentication

### Testing Authenticated Components

```tsx
import { renderWithProviders } from '@tests/utils/testUtils';
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';

const authenticatedAuth = new MockAuthAdapter();
authenticatedAuth.setToken('test-token');
authenticatedAuth.setUser({ id: '123', name: 'Test User' });

renderWithProviders(<ProtectedComponent />, {
	auth: authenticatedAuth,
});
```

### Testing Unauthenticated State

```tsx
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';

const unauthenticatedAuth = new MockAuthAdapter();
// Token is null by default

renderWithProviders(<LoginComponent />, {
	auth: unauthenticatedAuth,
});
```

## Testing with Storage

### Testing Storage-Dependent Components

```tsx
import { renderWithProviders } from '@tests/utils/testUtils';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';

const storage = new MockStorageAdapter();
storage.setItem('key', 'value');

renderWithProviders(<Component />, {
	storage,
});
```

## Testing Accessibility

### Using vitest-axe

```tsx
import { renderWithProviders } from '@tests/utils/testUtils';
import { expectA11y, getA11yViolations } from '@tests/utils/a11y';
import MyComponent from './MyComponent';

// Simple usage with expectA11y helper
it('has no accessibility violations', async () => {
	const { container } = renderWithProviders(<MyComponent />);
	await expectA11y(container);
});

// Custom assertions with getA11yViolations
it('has specific accessibility requirements', async () => {
	const { container } = renderWithProviders(<MyComponent />);
	const violations = await getA11yViolations(container);
	expect(violations.violations).toHaveLength(0);

	// Check for specific violations
	const colorContrastViolations = violations.violations.filter(v => v.id === 'color-contrast');
	expect(colorContrastViolations).toHaveLength(0);
});

// Custom axe configuration
it('checks accessibility with custom config', async () => {
	const { container } = renderWithProviders(<MyComponent />);
	await expectA11y(container, {
		rules: {
			'color-contrast': { enabled: true }, // Enable color contrast checks
		},
	});
});
```

## Test Data Factories

Use factories to create consistent test data:

```tsx
import { buildUser, buildUserList } from '@tests/factories/userFactories';

const user = buildUser({ name: 'John Doe' });
const users = buildUserList(5);
```

### Creating Factories

```ts
// tests/factories/userFactories.ts
export interface User {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export function buildUser(overrides: Partial<User> = {}): User {
	const now = new Date().toISOString();

	return {
		id: overrides.id ?? `user-${Math.random().toString(36).slice(2, 9)}`,
		name: overrides.name ?? 'John Doe',
		email: overrides.email ?? 'john.doe@example.com',
		createdAt: overrides.createdAt ?? now,
		updatedAt: overrides.updatedAt ?? now,
	};
}

export function buildUserList(count: number): User[] {
	return Array.from({ length: count }, (_, i) =>
		buildUser({ id: `user-${i + 1}`, name: `User ${i + 1}` })
	);
}
```

## Mock Adapters

Mock adapters are available for all ports:

- `MockStorageAdapter` - Storage port mock
- `MockLoggerAdapter` - Logger port mock
- `MockHttpAdapter` - HTTP port mock
- `MockAuthAdapter` - Auth port mock
- `MockAnalyticsAdapter` - Analytics port mock

### Using Mock Adapters

```tsx
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { MemoryRouter } from 'react-router-dom';

// Basic usage
const auth = new MockAuthAdapter();
auth.setToken('test-token');
auth.setUser({ id: '123', name: 'Test' });

renderWithProviders(<Component />, { auth });

// Advanced usage with multiple overrides
const storage = new MockStorageAdapter();
storage.setItem('key', 'value');

renderWithProviders(<Component />, {
	auth,
	storage,
	defaultTheme: 'dark',
	router: MemoryRouter,
	routerProps: { initialEntries: ['/custom-path'] },
	analyticsConfig: { writeKey: 'test-key', containerId: 'test-container' },
});
```

## E2E Testing with Playwright

### Writing E2E Tests

```ts
// e2e/example.spec.ts
import { expect, test } from '@playwright/test';
import { expectA11y } from './utils/a11y';

test.describe('Home Page', () => {
	test('should load the home page', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/./);
	});

	test('should navigate without errors', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await expect(page.locator('body')).toBeVisible();
	});

	test('should be accessible', async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
		await expectA11y(page);
	});
});
```

### Running E2E Tests

**Recommended: Using Docker**

```bash
# Run all E2E tests
pnpm run docker:test:e2e
```

**Alternative: Native Execution**

```bash
# Run all E2E tests
pnpm run test:e2e

# Run with UI
pnpm run test:e2e:ui

# Run specific test
pnpm run test:e2e tests/user-flow.spec.ts
```

## Test Coverage

The project maintains comprehensive test coverage across all modules:

### Coverage by Module

- **App Level**: 18 test files covering App composition, all components (AppLayout, PageWrapper, ProtectedRoute with advanced scenarios, RightsLoader, SpeedInsightsLoader), pages (Error404, Error500), providers (DeferredMotionProvider, I18nProvider, QueryProvider, ThemeProvider), router, and main bootstrap
- **Core Modules**:
  - **a11y**: 17 files (focus management, skip-to-content)
  - **api**: 15+ files (service creation, error handling, type safety, validation, edge cases, request mapping, helpers)
  - **auth**: Auth utility tests
  - **config**: Configuration tests (env, routes, runtime, feature flags, SEO)
  - **constants**: 20+ files (design tokens, UI constants, endpoints, env, aria, breakpoints, regex, timeouts)
  - **forms**: 15+ files (formAdapter core/advanced, controller, useController with multiple scenarios)
  - **hooks**: 50+ files (async, debounce, fetch, http, interval, motion, scroll, SEO, storage, throttle, UI hooks)
  - **http**: HTTP error adapter tests
  - **i18n**: 21 files (i18n system, resource loading, registry, hooks, types)
  - **lib**: 26 files (date utilities, HTTP client)
  - **perf**: 4 files (Web Vitals reporting)
  - **providers**: 7 files (analytics, auth, http, logger, snackbar, storage, toast)
  - **router**: 7 files (route generation, guards)
  - **security**: 16 files (sanitization, CSP, permissions)
  - **ui**: 700+ files (comprehensive component tests with functionality, interactions, accessibility, edge cases)
  - **utils**: 18 files (classNames, hookUtils, debounce/throttle, SEO DOM utils, theme customization)
- **Domains**: Landing domain pages, shared domain components (14 files)
- **Infrastructure**: 32 files (analytics 6, auth 4, logging 5, maps 4, storage 13)
- **Types**: 19 files (type definition tests for API, UI, and all type categories)

### Test Patterns

Tests follow consistent patterns:

- **Component tests**: Rendering, user interactions, controlled/uncontrolled modes, accessibility, edge cases
- **Hook tests**: State management, effects, cleanup, error handling
- **Utility tests**: Pure function testing, edge cases, type safety
- **Integration tests**: Provider composition, service integration, end-to-end flows
- **Accessibility tests**: ARIA attributes, keyboard navigation, screen reader compatibility (using vitest-axe)

## Best Practices

1. **Test Behavior, Not Implementation** - Test what users see and do, not internal implementation details

2. **Use MSW for API Mocking** - Never hit real APIs in unit tests

3. **Use Factories for Test Data** - Create consistent, maintainable test data (`apiFactories.ts`, `userFactories.ts`)

4. **Test Accessibility** - Use `vitest-axe` via `expectA11y` helper from `@tests/utils/a11y` for accessibility testing

5. **Keep Tests Fast** - Mock external dependencies, avoid real network calls

6. **Test Error Cases** - Don't just test happy paths; include error handling, edge cases, and boundary conditions

7. **Use Descriptive Test Names** - Test names should clearly describe what's being tested (e.g., `Rating - Rendering`, `TreeView - Interactions`, `ProtectedRoute - Advanced Scenarios`)

8. **Clean Up After Tests** - MSW handlers are reset automatically, but clean up any manual mocks

9. **Test Accessibility for All Components** - UI component tests include accessibility checks using `expectA11y`

10. **Organize Tests by Feature** - Group related tests using `describe` blocks (e.g., "Rendering", "Interactions", "Accessibility")

11. **Use Test Utilities** - Leverage `renderWithProviders`, `TestProviders`, and mock adapters for consistent test setup

12. **Test Both Controlled and Uncontrolled Modes** - For components that support both, test both patterns

## Common Patterns

### Testing Async Operations

```tsx
import { waitFor } from '@testing-library/react';

it('loads data asynchronously', async () => {
	renderWithProviders(<AsyncComponent />);

	await waitFor(() => {
		expect(screen.getByText('Loaded')).toBeInTheDocument();
	});
});
```

### Testing Error States

```tsx
import { createErrorHandler } from '@tests/mocks/handlers';
import { throwTestError } from '@tests/utils/testUtils';

it('displays error message on failure', async () => {
	server.use(createErrorHandler('/api/data', 500, 'Failed', 'SERVER_ERROR'));

	renderWithProviders(<Component />);

	await waitFor(() => {
		expect(screen.getByText('Failed to load')).toBeInTheDocument();
	});
});

// Testing error handling with throwTestError helper
it('handles non-Error exceptions', async () => {
	const loader = async () => {
		throwTestError('String error'); // Tests defensive error handling
	};

	// Test that component handles string errors gracefully
});
```

### Testing User Interactions

```tsx
import userEvent from '@testing-library/user-event';

it('handles user input', async () => {
	const user = userEvent.setup();
	renderWithProviders(<InputComponent />);

	const input = screen.getByLabelText('Name');
	await user.type(input, 'John');
	await user.clear(input);
	await user.type(input, 'Jane');

	expect(input).toHaveValue('Jane');
});
```

## See Also

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)
