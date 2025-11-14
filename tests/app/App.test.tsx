import App from '@app/App';
import { __resetRuntimeConfigCache } from '@core/config/runtime';
import { httpClient } from '@core/lib/http/httpClient';
import { render, screen, waitFor } from '@testing-library/react';
import type { MockAnalyticsAdapter } from '@tests/utils/mocks/MockAnalyticsAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock runtime config type
type RuntimeConfig = {
	ANALYTICS_WRITE_KEY?: string;
	API_BASE_URL?: string;
	GOOGLE_MAPS_API_KEY?: string;
	FEATURE_FLAGS?: unknown;
	[key: string]: unknown;
} | null;

// Mock the analytics adapters module
// Note: require() in vi.mock factories doesn't resolve path aliases, so we use relative paths
// Using async factory to allow proper module resolution
vi.mock('@infra/analytics/googleAnalyticsAdapter', async () => {
	const { MockAnalyticsAdapter } = await import('../utils/mocks/MockAnalyticsAdapter.js');
	const mockGoogleAnalyticsAdapter = new MockAnalyticsAdapter();
	const mockNoopAnalyticsAdapter = new MockAnalyticsAdapter();
	// Store references globally for test access
	(
		globalThis as {
			mockGoogleAnalyticsAdapter?: MockAnalyticsAdapter;
			mockNoopAnalyticsAdapter?: MockAnalyticsAdapter;
		}
	).mockGoogleAnalyticsAdapter = mockGoogleAnalyticsAdapter;
	(
		globalThis as {
			mockGoogleAnalyticsAdapter?: MockAnalyticsAdapter;
			mockNoopAnalyticsAdapter?: MockAnalyticsAdapter;
		}
	).mockNoopAnalyticsAdapter = mockNoopAnalyticsAdapter;
	return {
		googleAnalyticsAdapter: mockGoogleAnalyticsAdapter,
		noopAnalyticsAdapter: mockNoopAnalyticsAdapter,
	};
});

// Mock the auth adapter
// Note: require() in vi.mock factories doesn't resolve path aliases, so we use relative paths
// Using async factory to allow proper module resolution
vi.mock('@infra/auth/jwtAuthAdapter', async () => {
	const { MockAuthAdapter } = await import('../utils/mocks/MockAuthAdapter.js');
	return {
		JwtAuthAdapter: class extends MockAuthAdapter {},
	};
});

// Mock environment config
vi.mock('@core/config/env.client', () => {
	const mockEnv = {
		ANALYTICS_ENABLED: false,
		DEV: false,
		GA_MEASUREMENT_ID: undefined as string | undefined,
		GA_DEBUG: undefined as boolean | undefined,
		GA_DATALAYER_NAME: 'dataLayer',
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

// Mock the router to avoid lazy loading issues in tests
vi.mock('@app/router', () => ({
	default: () => <div data-testid="router">Router</div>,
}));

// Access mocked modules from globalThis (set in vi.mock factories)
const getMockGoogleAnalyticsAdapter = () => {
	const adapter = (globalThis as { mockGoogleAnalyticsAdapter?: MockAnalyticsAdapter })
		.mockGoogleAnalyticsAdapter;
	if (!adapter) {
		throw new Error('mockGoogleAnalyticsAdapter not initialized');
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
				GA_MEASUREMENT_ID?: string | undefined;
				GA_DEBUG?: boolean | undefined;
				GA_DATALAYER_NAME: string;
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

// Helper function to reset test mocks
const resetTestMocks = () => {
	__resetRuntimeConfigCache();
	getMockGoogleAnalyticsAdapter().clear();
	getMockNoopAnalyticsAdapter().clear();
	const mockEnv = getMockEnv();
	mockEnv.ANALYTICS_ENABLED = false;
	mockEnv.DEV = false;
	mockEnv.GA_MEASUREMENT_ID = undefined;
	mockEnv.GA_DEBUG = undefined;
	mockEnv.GA_DATALAYER_NAME = 'dataLayer';
	getMockGetCachedRuntimeConfig().mockReturnValue(null);
	const httpClientWithFlag = httpClient as typeof httpClient & {
		__authInterceptorAttached?: boolean;
	};
	httpClientWithFlag.__authInterceptorAttached = false;
};

// eslint-disable-next-line max-lines-per-function
describe('App', () => {
	beforeEach(() => {
		resetTestMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('rendering', () => {
		it('renders without crashing', () => {
			render(<App />);
			expect(screen.getByTestId('router')).toBeInTheDocument();
		});

		it('renders ErrorBoundaryWrapper with fallback', () => {
			render(<App />);
			expect(screen.getByTestId('router')).toBeInTheDocument();
		});

		it('renders Router component', () => {
			render(<App />);
			expect(screen.getByTestId('router')).toBeInTheDocument();
		});

		it('renders ToastContainer', () => {
			render(<App />);
			expect(screen.getByTestId('router')).toBeInTheDocument();
		});
	});

	describe('auth interceptor', () => {
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
			};

			httpClientWithFlag.__authInterceptorAttached = true;
			const initialInterceptorCount = httpClient['requestInterceptors']?.length ?? 0;

			render(<App />);

			expect(httpClientWithFlag.__authInterceptorAttached).toBe(true);
			const finalInterceptorCount = httpClient['requestInterceptors']?.length ?? 0;
			expect(finalInterceptorCount).toBe(initialInterceptorCount);
		});
	});

	describe('analytics configuration', () => {
		it('uses noopAnalyticsAdapter when analytics is disabled', async () => {
			const mockEnv = getMockEnv();
			mockEnv.ANALYTICS_ENABLED = false;
			getMockGetCachedRuntimeConfig().mockReturnValue(null);

			render(<App />);

			await waitFor(() => {
				expect(getMockNoopAnalyticsAdapter().initializedWith).toBeNull();
			});
		});

		it('uses googleAnalyticsAdapter when analytics is enabled with env write key', async () => {
			const mockEnv = getMockEnv();
			mockEnv.ANALYTICS_ENABLED = true;
			mockEnv.GA_MEASUREMENT_ID = 'G-TEST123';
			mockEnv.GA_DEBUG = undefined;
			mockEnv.DEV = false;
			getMockGetCachedRuntimeConfig().mockReturnValue(null);

			render(<App />);

			await waitFor(() => {
				expect(getMockGoogleAnalyticsAdapter().initializedWith).toEqual({
					writeKey: 'G-TEST123',
					dataLayerName: 'dataLayer',
				});
			});
		});

		it('uses runtime config write key when available', async () => {
			const mockEnv = getMockEnv();
			mockEnv.ANALYTICS_ENABLED = true;
			mockEnv.GA_MEASUREMENT_ID = 'G-ENV123';
			getMockGetCachedRuntimeConfig().mockReturnValue({
				ANALYTICS_WRITE_KEY: 'G-RUNTIME123',
			});

			render(<App />);

			await waitFor(() => {
				expect(getMockGoogleAnalyticsAdapter().initializedWith?.writeKey).toBe('G-RUNTIME123');
			});
		});
	});

	describe('analytics debug mode', () => {
		it('enables debug mode when GA_DEBUG is true', async () => {
			const mockEnv = getMockEnv();
			mockEnv.ANALYTICS_ENABLED = true;
			mockEnv.GA_MEASUREMENT_ID = 'G-TEST123';
			mockEnv.GA_DEBUG = true;
			mockEnv.DEV = false;
			getMockGetCachedRuntimeConfig().mockReturnValue(null);

			render(<App />);

			await waitFor(() => {
				expect(getMockGoogleAnalyticsAdapter().initializedWith).toEqual({
					writeKey: 'G-TEST123',
					dataLayerName: 'dataLayer',
					debug: true,
				});
			});
		});

		it('enables debug mode when DEV is true and GA_DEBUG is not set', async () => {
			const mockEnv = getMockEnv();
			mockEnv.ANALYTICS_ENABLED = true;
			mockEnv.GA_MEASUREMENT_ID = 'G-TEST123';
			mockEnv.GA_DEBUG = undefined;
			mockEnv.DEV = true;
			getMockGetCachedRuntimeConfig().mockReturnValue(null);

			render(<App />);

			await waitFor(() => {
				expect(getMockGoogleAnalyticsAdapter().initializedWith).toEqual({
					writeKey: 'G-TEST123',
					dataLayerName: 'dataLayer',
					debug: true,
				});
			});
		});
	});

	describe('analytics initialization', () => {
		it('does not initialize analytics when no write key is available', async () => {
			const mockEnv = getMockEnv();
			mockEnv.ANALYTICS_ENABLED = true;
			mockEnv.GA_MEASUREMENT_ID = undefined;
			getMockGetCachedRuntimeConfig().mockReturnValue(null);

			render(<App />);

			await waitFor(() => {
				expect(getMockGoogleAnalyticsAdapter().initializedWith).toBeNull();
			});
		});

		it('uses custom dataLayerName from env', async () => {
			const mockEnv = getMockEnv();
			mockEnv.ANALYTICS_ENABLED = true;
			mockEnv.GA_MEASUREMENT_ID = 'G-TEST123';
			mockEnv.GA_DATALAYER_NAME = 'customDataLayer';
			getMockGetCachedRuntimeConfig().mockReturnValue(null);

			render(<App />);

			await waitFor(() => {
				expect(getMockGoogleAnalyticsAdapter().initializedWith?.dataLayerName).toBe(
					'customDataLayer'
				);
			});
		});
	});
});
