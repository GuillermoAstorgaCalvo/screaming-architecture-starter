import App from '@app/App';
import { __resetRuntimeConfigCache } from '@core/config/runtime';
import { render, screen, waitFor } from '@testing-library/react';
import type { MockAnalyticsAdapter } from '@tests/utils/mocks/MockAnalyticsAdapter';
import type React from 'react';
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

vi.mock('@app/router', async () => {
	const React = await import('react');
	return {
		default: () => React.createElement('div', { 'data-testid': 'router' }, 'Router'),
	};
});

vi.mock('@core/ui/utilities/motion/components/LayoutGroup.lazy', async () => {
	const React = await import('react');
	return {
		LazyLayoutGroup: ({ children }: { children?: React.ReactNode }) =>
			React.createElement('div', { 'data-testid': 'lazy-layout-group' }, children),
	};
});

type RuntimeConfig = {
	ANALYTICS_WRITE_KEY?: string;
	API_BASE_URL?: string;
	GOOGLE_MAPS_API_KEY?: string;
	FEATURE_FLAGS?: unknown;
	[key: string]: unknown;
} | null;

vi.mock('@infra/analytics/googleTagManagerAdapter', () => ({
	googleTagManagerAdapter: mockGoogleTagManagerAdapter,
	noopAnalyticsAdapter: mockNoopAnalyticsAdapter,
}));

const ANALYTICS_ADAPTER_MODULE = '@infra/analytics/googleTagManagerAdapter';

vi.mock('@infra/auth/jwtAuthAdapter', async () => {
	const { MockAuthAdapter } = await import('../utils/mocks/MockAuthAdapter.js');
	return {
		JwtAuthAdapter: MockAuthAdapter,
	};
});

vi.mock('@core/config/env.client', () => {
	const mockEnv = {
		ANALYTICS_ENABLED: false,
		DEV: false,
		GTM_CONTAINER_ID: undefined as string | undefined,
		GTM_DEBUG: undefined as boolean | undefined,
		GTM_DATALAYER_NAME: 'dataLayer',
	};
	(globalThis as { mockEnv?: typeof mockEnv }).mockEnv = mockEnv;
	return {
		env: mockEnv,
	};
});

vi.mock('@core/config/runtime', async () => {
	const actual = await vi.importActual('@core/config/runtime');
	const mockGetCachedRuntimeConfig = vi.fn(() => null as RuntimeConfig);
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
};

const DEFAULT_GTM_CONTAINER_ID = 'GTM-TEST123';

const setupAppTestEnv = () => {
	beforeEach(() => {
		resetTestMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});
};

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

describe('App analytics error handling', () => {
	setupAppTestEnv();

	it('falls back to noopAnalyticsAdapter when analytics adapter import fails', async () => {
		const mockEnv = getMockEnv();
		mockEnv.ANALYTICS_ENABLED = true;
		mockEnv.GTM_CONTAINER_ID = DEFAULT_GTM_CONTAINER_ID;
		getMockGetCachedRuntimeConfig().mockReturnValue(null);

		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		vi.resetModules();
		vi.doMock(ANALYTICS_ADAPTER_MODULE, () => {
			throw new Error('Failed to load module');
		});

		const { default: AppWithError } = await import('@app/App');

		render(<AppWithError />);

		await waitFor(() => {
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				'Failed to load analytics adapter',
				expect.any(Error)
			);
		});

		await waitFor(() => {
			expect(getMockNoopAnalyticsAdapter().initializedWith).toBeNull();
		});

		consoleWarnSpy.mockRestore();
		vi.resetModules();
	});

	it('handles errors gracefully when analytics adapter module has issues', async () => {
		const mockEnv = getMockEnv();
		mockEnv.ANALYTICS_ENABLED = true;
		mockEnv.GTM_CONTAINER_ID = DEFAULT_GTM_CONTAINER_ID;
		getMockGetCachedRuntimeConfig().mockReturnValue(null);

		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		vi.resetModules();
		vi.doMock(ANALYTICS_ADAPTER_MODULE, () => {
			return {
				get googleTagManagerAdapter() {
					throw new Error('Error accessing adapter property');
				},
				noopAnalyticsAdapter: mockNoopAnalyticsAdapter,
			};
		});

		const { default: AppWithError } = await import('@app/App');

		render(<AppWithError />);

		await waitFor(() => {
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				'Failed to load analytics adapter',
				expect.any(Error)
			);
		});

		await waitFor(() => {
			expect(screen.getAllByTestId('router').length).toBeGreaterThan(0);
		});

		await waitFor(() => {
			expect(getMockNoopAnalyticsAdapter().initializedWith).toBeNull();
		});

		consoleWarnSpy.mockRestore();
		vi.resetModules();
	});
});
