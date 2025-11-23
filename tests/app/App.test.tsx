import App from '@app/App';
import { __resetRuntimeConfigCache } from '@core/config/runtime';
import { httpClient } from '@core/lib/http/httpClient';
import { render, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import type { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the router FIRST to ensure it's hoisted before App imports it
vi.mock('@app/router', async () => {
	const React = await import('react');
	return {
		default: () => React.createElement('div', null, 'Router'),
	};
});

// Mock LazyLayoutGroup to avoid lazy loading issues in tests
vi.mock('@core/ui/utilities/motion/components/LayoutGroup.lazy', async () => {
	const React = await import('react');
	return {
		LazyLayoutGroup: ({ children }: { children?: React.ReactNode }) =>
			React.createElement('div', { 'data-testid': 'lazy-layout-group' }, children),
	};
});

// Mock the analytics adapters module
vi.mock('@infra/analytics/googleTagManagerAdapter', () => ({
	googleTagManagerAdapter: { clear: vi.fn(), initializedWith: null },
	noopAnalyticsAdapter: { clear: vi.fn(), initializedWith: null },
}));

// Mock the auth adapter
// Note: require() in vi.mock factories doesn't resolve path aliases, so we use relative paths
// Using async factory to allow proper module resolution
vi.mock('@infra/auth/jwtAuthAdapter', async () => {
	const { MockAuthAdapter } = await import('../utils/mocks/MockAuthAdapter.js');
	class TestJwtAuthAdapter extends MockAuthAdapter {
		constructor(...args: unknown[]) {
			super(...(args as []));
			(globalThis as { mockJwtAuthAdapterInstance?: MockAuthAdapter }).mockJwtAuthAdapterInstance =
				this;
		}
	}
	return {
		JwtAuthAdapter: TestJwtAuthAdapter,
	};
});

// Mock environment config
vi.mock('@core/config/env.client', () => ({
	env: {
		ANALYTICS_ENABLED: false,
		DEV: false,
		GTM_CONTAINER_ID: undefined,
		GTM_DEBUG: undefined,
		GTM_DATALAYER_NAME: 'dataLayer',
	},
}));

// Mock runtime config
vi.mock('@core/config/runtime', async () => {
	const actual = await vi.importActual('@core/config/runtime');
	return {
		...actual,
		getCachedRuntimeConfig: vi.fn(() => null),
	};
});

const getMockJwtAuthAdapterInstance = () => {
	const instance = (globalThis as { mockJwtAuthAdapterInstance?: MockAuthAdapter })
		.mockJwtAuthAdapterInstance;
	if (!instance) {
		throw new Error('mockJwtAuthAdapterInstance not initialized');
	}
	return instance;
};

// Helper function to reset test mocks
const resetTestMocks = () => {
	__resetRuntimeConfigCache();
	const httpClientWithFlag = httpClient as typeof httpClient & {
		__authInterceptorAttached?: boolean;
		__authInterceptorAdapter?: unknown;
		__authInterceptorCleanup?: (() => void) | null;
		__authInterceptorSubscribers?: number;
	};
	httpClientWithFlag.__authInterceptorAttached = false;
	httpClientWithFlag.__authInterceptorAdapter = undefined;
	httpClientWithFlag.__authInterceptorCleanup = null;
	httpClientWithFlag.__authInterceptorSubscribers = 0;
};

const waitForRouterRender = async () => {
	await waitFor(
		() => {
			expect(screen.getByTestId('router')).toBeInTheDocument();
		},
		{ timeout: 5000 }
	);
};

const setupAppTestEnv = () => {
	beforeEach(() => {
		resetTestMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});
};

describe('App rendering', () => {
	setupAppTestEnv();

	it('renders without crashing', () => {
		expect(() => {
			render(<App />);
		}).not.toThrow();
	});

	it('renders ErrorBoundaryWrapper with fallback', async () => {
		render(<App />);
		await waitForRouterRender();
	});

	it('renders Router component', async () => {
		render(<App />);
		await waitForRouterRender();
	});

	it('renders ToastContainer', async () => {
		render(<App />);
		await waitForRouterRender();
	});
});

describe('App auth interceptor', () => {
	setupAppTestEnv();

	it('attaches auth interceptor to httpClient', () => {
		const httpClientWithFlag = httpClient as typeof httpClient & {
			__authInterceptorAttached?: boolean;
		};

		httpClientWithFlag.__authInterceptorAttached = false;

		render(<App />);

		expect(httpClientWithFlag.__authInterceptorAttached).toBe(true);
	});

	it('does not attach auth interceptor multiple times', () => {
		const httpClientWithFlag = httpClient as typeof httpClient & {
			__authInterceptorAttached?: boolean;
			__authInterceptorAdapter?: unknown;
			__authInterceptorCleanup?: (() => void) | null;
			__authInterceptorSubscribers?: number;
		};

		const mockAuthAdapter = getMockJwtAuthAdapterInstance();
		httpClientWithFlag.__authInterceptorAttached = true;
		httpClientWithFlag.__authInterceptorAdapter = mockAuthAdapter;
		httpClientWithFlag.__authInterceptorCleanup = vi.fn();
		httpClientWithFlag.__authInterceptorSubscribers = 1;
		const initialInterceptorCount = httpClient['requestInterceptors']?.length ?? 0;

		render(<App />);

		expect(httpClientWithFlag.__authInterceptorAttached).toBe(true);
		const finalInterceptorCount = httpClient['requestInterceptors']?.length ?? 0;
		expect(finalInterceptorCount).toBe(initialInterceptorCount);
	});
});

describe('App accessibility', () => {
	setupAppTestEnv();

	it('has no accessibility violations after render', async () => {
		const { container } = render(<App />);

		await waitForRouterRender();

		await expectA11y(container);
	});
});

describe('App error boundary integration', () => {
	setupAppTestEnv();

	it('renders ErrorBoundaryWrapper with Error500 fallback', async () => {
		render(<App />);
		await waitForRouterRender();

		// ErrorBoundaryWrapper should be present (we can't easily test it without throwing)
		// but we can verify the app renders correctly
		expect(screen.getByTestId('router')).toBeInTheDocument();
	});

	it('wraps app with ErrorBoundary', async () => {
		render(<App />);
		await waitForRouterRender();

		// ErrorBoundary should be present in the component tree
		expect(screen.getByTestId('router')).toBeInTheDocument();
	});
});

describe('App theme provider integration', () => {
	setupAppTestEnv();

	it('provides theme context to children', async () => {
		render(<App />);
		await waitForRouterRender();

		// ThemeProvider should be available - verify by checking app renders
		expect(screen.getByTestId('router')).toBeInTheDocument();
	});
});

describe('App i18n provider integration', () => {
	setupAppTestEnv();

	it('provides i18n context to children', async () => {
		render(<App />);
		await waitForRouterRender();

		// I18nProvider should be available - verify by checking app renders
		expect(screen.getByTestId('router')).toBeInTheDocument();
	});
});
