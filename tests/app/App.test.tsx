import App from '@app/App';
import { __resetRuntimeConfigCache } from '@core/config/runtime';
import { httpClient } from '@core/lib/http/httpClient';
import { render, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import type { MockAnalyticsAdapter } from '@tests/utils/mocks/MockAnalyticsAdapter';
import type { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

interface TestGlobalState {
	mockGoogleTagManagerAdapter?: MockAnalyticsAdapter;
	mockNoopAnalyticsAdapter?: MockAnalyticsAdapter;
	mockEnv?: {
		ANALYTICS_ENABLED: boolean;
		DEV: boolean;
		GTM_CONTAINER_ID?: string | undefined;
		GTM_DEBUG?: boolean | undefined;
		GTM_DATALAYER_NAME: string;
	};
	mockGetCachedRuntimeConfig?: ReturnType<typeof vi.fn>;
	mockJwtAuthAdapterInstance?: MockAuthAdapter;
}

const getTestGlobals = () => globalThis as typeof globalThis & TestGlobalState;

const { MockAnalyticsAdapter: MockAnalyticsAdapterClass } = await import(
	'../utils/mocks/MockAnalyticsAdapter.js'
);
const mockGoogleTagManagerAdapter = new MockAnalyticsAdapterClass();
const mockNoopAnalyticsAdapter = new MockAnalyticsAdapterClass();
const initialGlobals = getTestGlobals();
initialGlobals.mockGoogleTagManagerAdapter = mockGoogleTagManagerAdapter;
initialGlobals.mockNoopAnalyticsAdapter = mockNoopAnalyticsAdapter;

// Mock the router FIRST to ensure it's hoisted before App imports it
vi.mock('@app/router', async () => {
	const React = await import('react');
	return {
		default: () => React.createElement('div', null, 'Router'),
	};
});

// Mock runtime config type
type RuntimeConfig = {
	ANALYTICS_WRITE_KEY?: string;
	API_BASE_URL?: string;
	GOOGLE_MAPS_API_KEY?: string;
	FEATURE_FLAGS?: unknown;
	[key: string]: unknown;
} | null;

// Mock the analytics adapters module
vi.mock('@infra/analytics/googleTagManagerAdapter', () => ({
	googleTagManagerAdapter: mockGoogleTagManagerAdapter,
	noopAnalyticsAdapter: mockNoopAnalyticsAdapter,
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
vi.mock('@core/config/env.client', () => {
	const mockEnv = {
		ANALYTICS_ENABLED: false,
		DEV: false,
		GTM_CONTAINER_ID: undefined as string | undefined,
		GTM_DEBUG: undefined as boolean | undefined,
		GTM_DATALAYER_NAME: 'dataLayer',
	};
	// Store reference globally for test access
	(globalThis as { mockEnv?: typeof mockEnv }).mockEnv = mockEnv;
	return {
		env: mockEnv,
	};
});

// Mock runtime config
vi.mock('@core/config/runtime', async () => {
	const actual = await vi.importActual('@core/config/runtime');
	const mockGetCachedRuntimeConfig = vi.fn(() => null as RuntimeConfig);
	// Store reference globally for test access
	(
		globalThis as { mockGetCachedRuntimeConfig?: typeof mockGetCachedRuntimeConfig }
	).mockGetCachedRuntimeConfig = mockGetCachedRuntimeConfig;
	return {
		...actual,
		getCachedRuntimeConfig: mockGetCachedRuntimeConfig,
	};
});

const getMockGoogleTagManagerAdapter = () => {
	const adapter = (globalThis as { mockGoogleTagManagerAdapter?: MockAnalyticsAdapter })
		.mockGoogleTagManagerAdapter;
	if (!adapter) {
		throw new Error('mockGoogleTagManagerAdapter not initialized');
	}
	return adapter;
};
const getMockNoopAnalyticsAdapter = () => {
	const adapter = (globalThis as { mockNoopAnalyticsAdapter?: MockAnalyticsAdapter })
		.mockNoopAnalyticsAdapter;
	if (!adapter) {
		throw new Error('mockNoopAnalyticsAdapter not initialized');
	}
	return adapter;
};
const getMockEnv = () => {
	const env = (
		globalThis as {
			mockEnv?: {
				ANALYTICS_ENABLED: boolean;
				DEV: boolean;
				GTM_CONTAINER_ID?: string | undefined;
				GTM_DEBUG?: boolean | undefined;
				GTM_DATALAYER_NAME: string;
			};
		}
	).mockEnv;
	if (!env) {
		throw new Error('mockEnv not initialized');
	}
	return env;
};
const getMockGetCachedRuntimeConfig = () => {
	const config = (globalThis as { mockGetCachedRuntimeConfig?: ReturnType<typeof vi.fn> })
		.mockGetCachedRuntimeConfig;
	if (!config) {
		throw new Error('mockGetCachedRuntimeConfig not initialized');
	}
	return config;
};
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
	const globals = getTestGlobals();
	globals.mockGoogleTagManagerAdapter?.clear();
	globals.mockNoopAnalyticsAdapter?.clear();
	if (globals.mockEnv) {
		globals.mockEnv.ANALYTICS_ENABLED = false;
		globals.mockEnv.DEV = false;
		globals.mockEnv.GTM_CONTAINER_ID = undefined;
		globals.mockEnv.GTM_DEBUG = undefined;
		globals.mockEnv.GTM_DATALAYER_NAME = 'dataLayer';
	}
	globals.mockGetCachedRuntimeConfig?.mockReturnValue(null);
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

const DEFAULT_GTM_CONTAINER_ID = 'GTM-TEST123';

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

describe('App analytics configuration', () => {
	setupAppTestEnv();

	it('uses noopAnalyticsAdapter when analytics is disabled', async () => {
		const mockEnv = getMockEnv();
		mockEnv.ANALYTICS_ENABLED = false;
		getMockGetCachedRuntimeConfig().mockReturnValue(null);

		render(<App />);

		await waitFor(() => {
			expect(getMockNoopAnalyticsAdapter().initializedWith).toBeNull();
		});
	});

	it('uses googleTagManagerAdapter when analytics is enabled with env write key', async () => {
		const mockEnv = getMockEnv();
		mockEnv.ANALYTICS_ENABLED = true;
		mockEnv.GTM_CONTAINER_ID = DEFAULT_GTM_CONTAINER_ID;
		mockEnv.GTM_DEBUG = undefined;
		mockEnv.DEV = false;
		getMockGetCachedRuntimeConfig().mockReturnValue(null);

		render(<App />);

		await waitFor(() => {
			expect(getMockGoogleTagManagerAdapter().initializedWith).toEqual({
				writeKey: DEFAULT_GTM_CONTAINER_ID,
				containerId: DEFAULT_GTM_CONTAINER_ID,
				dataLayerName: 'dataLayer',
			});
		});
	});

	it('uses runtime config write key when available', async () => {
		const mockEnv = getMockEnv();
		mockEnv.ANALYTICS_ENABLED = true;
		mockEnv.GTM_CONTAINER_ID = 'GTM-ENV123';
		getMockGetCachedRuntimeConfig().mockReturnValue({
			ANALYTICS_WRITE_KEY: 'G-RUNTIME123',
		});

		render(<App />);

		await waitFor(() => {
			expect(getMockGoogleTagManagerAdapter().initializedWith?.writeKey).toBe('G-RUNTIME123');
		});
	});
});

describe('App analytics debug mode', () => {
	setupAppTestEnv();

	it('enables debug mode when GTM_DEBUG is true', async () => {
		const mockEnv = getMockEnv();
		mockEnv.ANALYTICS_ENABLED = true;
		mockEnv.GTM_CONTAINER_ID = DEFAULT_GTM_CONTAINER_ID;
		mockEnv.GTM_DEBUG = true;
		mockEnv.DEV = false;
		getMockGetCachedRuntimeConfig().mockReturnValue(null);

		render(<App />);

		await waitFor(() => {
			expect(getMockGoogleTagManagerAdapter().initializedWith).toEqual({
				writeKey: DEFAULT_GTM_CONTAINER_ID,
				containerId: DEFAULT_GTM_CONTAINER_ID,
				dataLayerName: 'dataLayer',
				debug: true,
			});
		});
	});

	it('enables debug mode when DEV is true and GTM_DEBUG is not set', async () => {
		const mockEnv = getMockEnv();
		mockEnv.ANALYTICS_ENABLED = true;
		mockEnv.GTM_CONTAINER_ID = DEFAULT_GTM_CONTAINER_ID;
		mockEnv.GTM_DEBUG = undefined;
		mockEnv.DEV = true;
		getMockGetCachedRuntimeConfig().mockReturnValue(null);

		render(<App />);

		await waitFor(() => {
			expect(getMockGoogleTagManagerAdapter().initializedWith).toEqual({
				writeKey: DEFAULT_GTM_CONTAINER_ID,
				containerId: DEFAULT_GTM_CONTAINER_ID,
				dataLayerName: 'dataLayer',
				debug: true,
			});
		});
	});
});

describe('App analytics initialization', () => {
	setupAppTestEnv();

	it('does not initialize analytics when no write key is available', async () => {
		const mockEnv = getMockEnv();
		mockEnv.ANALYTICS_ENABLED = true;
		mockEnv.GTM_CONTAINER_ID = undefined;
		getMockGetCachedRuntimeConfig().mockReturnValue(null);

		render(<App />);

		await waitFor(() => {
			expect(getMockGoogleTagManagerAdapter().initializedWith).toBeNull();
		});
	});

	it('uses custom dataLayerName from env', async () => {
		const mockEnv = getMockEnv();
		mockEnv.ANALYTICS_ENABLED = true;
		mockEnv.GTM_CONTAINER_ID = DEFAULT_GTM_CONTAINER_ID;
		mockEnv.GTM_DATALAYER_NAME = 'customDataLayer';
		getMockGetCachedRuntimeConfig().mockReturnValue(null);

		render(<App />);

		await waitFor(() => {
			expect(getMockGoogleTagManagerAdapter().initializedWith?.dataLayerName).toBe(
				'customDataLayer'
			);
		});
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
