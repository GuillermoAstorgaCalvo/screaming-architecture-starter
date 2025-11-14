# Testing Guide

This guide explains how to write and run tests in the Screaming Architecture starter.

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

Tests are organized as follows:

```
tests/
├── setupTests.ts          # Vitest setup and MSW configuration
├── utils/                 # Test utilities
│   ├── testUtils.tsx     # renderWithProviders helper
│   ├── TestProviders.tsx # Provider wrapper for tests
│   └── mocks/            # Mock adapters
├── factories/            # Test data factories
├── mocks/                 # MSW handlers and payloads
└── [domain]/             # Domain-specific tests
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

const authenticatedAuth = new MockAuthAdapter();
authenticatedAuth.setToken('test-token');

renderWithProviders(<MyComponent />, {
	auth: authenticatedAuth,
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

## Testing API Services

### Mocking API Calls with MSW

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

it('handles API errors', async () => {
	server.use(
		http.get('/api/users/:id', () => {
			return HttpResponse.json({ error: 'Not found' }, { status: 404 });
		})
	);

	// Test error handling
});
```

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
import { expect } from 'vitest';
import MyComponent from './MyComponent';

it('has no accessibility violations', async () => {
	const { container } = renderWithProviders(<MyComponent />);
	const results = await expect(container).toBeAccessible();
	expect(results).toHaveNoViolations();
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
import type { User } from '@domains/users/types';

export function buildUser(overrides?: Partial<User>): User {
	return {
		id: '1',
		name: 'Test User',
		email: 'test@example.com',
		...overrides,
	};
}

export function buildUserList(count: number): User[] {
	return Array.from({ length: count }, (_, i) =>
		buildUser({ id: String(i + 1), name: `User ${i + 1}` })
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

const auth = new MockAuthAdapter();
auth.setToken('test-token');
auth.setUser({ id: '123', name: 'Test' });

renderWithProviders(<Component />, { auth });
```

## E2E Testing with Playwright

### Writing E2E Tests

```ts
// e2e/user-flow.spec.ts
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
	await page.goto('/');
	await page.click('text=Login');
	await page.fill('[name="email"]', 'test@example.com');
	await page.fill('[name="password"]', 'password123');
	await page.click('button[type="submit"]');
	await expect(page).toHaveURL('/dashboard');
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

## Best Practices

1. **Test Behavior, Not Implementation** - Test what users see and do, not internal implementation details

2. **Use MSW for API Mocking** - Never hit real APIs in unit tests

3. **Use Factories for Test Data** - Create consistent, maintainable test data

4. **Test Accessibility** - Use `vitest-axe` for accessibility testing

5. **Keep Tests Fast** - Mock external dependencies, avoid real network calls

6. **Test Error Cases** - Don't just test happy paths

7. **Use Descriptive Test Names** - Test names should clearly describe what's being tested

8. **Clean Up After Tests** - MSW handlers are reset automatically, but clean up any manual mocks

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
it('displays error message on failure', async () => {
	server.use(
		http.get('/api/data', () => {
			return HttpResponse.json({ error: 'Failed' }, { status: 500 });
		})
	);

	renderWithProviders(<Component />);

	await waitFor(() => {
		expect(screen.getByText('Failed to load')).toBeInTheDocument();
	});
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
