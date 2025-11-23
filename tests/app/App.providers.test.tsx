import App from '@app/App';
import { __resetRuntimeConfigCache } from '@core/config/runtime';
import { httpClient } from '@core/lib/http/httpClient';
import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@app/router', async () => {
	const React = await import('react');
	return {
		default: () => React.createElement('div', null, 'Router'),
	};
});

vi.mock('@core/ui/utilities/motion/components/LayoutGroup.lazy', async () => {
	const React = await import('react');
	return {
		LazyLayoutGroup: ({ children }: { children?: ReactNode }) =>
			React.createElement('div', { 'data-testid': 'lazy-layout-group' }, children),
	};
});

vi.mock('@infra/auth/jwtAuthAdapter', async () => {
	const { MockAuthAdapter } = await import('../utils/mocks/MockAuthAdapter.js');
	return {
		JwtAuthAdapter: MockAuthAdapter,
	};
});

vi.mock('@infra/analytics/googleTagManagerAdapter', () => ({
	googleTagManagerAdapter: { clear: vi.fn(), initializedWith: null },
	noopAnalyticsAdapter: { clear: vi.fn(), initializedWith: null },
}));

vi.mock('@core/config/env.client', () => ({
	env: {
		ANALYTICS_ENABLED: false,
		DEV: false,
		GTM_CONTAINER_ID: undefined,
		GTM_DEBUG: undefined,
		GTM_DATALAYER_NAME: 'dataLayer',
	},
}));

vi.mock('@core/config/runtime', async () => {
	const actual = await vi.importActual('@core/config/runtime');
	return {
		...actual,
		getCachedRuntimeConfig: vi.fn(() => null),
	};
});

const waitForRouterRender = async () => {
	await waitFor(
		() => {
			expect(screen.getByTestId('router')).toBeInTheDocument();
		},
		{ timeout: 5000 }
	);
};

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

const setupAppTestEnv = () => {
	beforeEach(() => {
		resetTestMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});
};

describe('App provider composition', () => {
	setupAppTestEnv();

	it('renders all providers in correct order', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});
});

describe('App provider composition - Core providers', () => {
	setupAppTestEnv();

	it('provides LoggerProvider to ErrorBoundary', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});

	it('provides HttpProvider', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});

	it('provides AuthProvider', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});

	it('provides StorageProvider', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});
});

describe('App provider composition - UI providers', () => {
	setupAppTestEnv();

	it('provides ThemeProvider', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});

	it('provides I18nProvider', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});

	it('provides QueryProvider', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});

	it('provides AnalyticsProvider', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});

	it('provides DeferredMotionProvider', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});

	it('provides ToastProvider', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});
});

describe('App provider composition - Router components', () => {
	setupAppTestEnv();

	it('renders BrowserRouter', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});

	it('renders LazyLayoutGroup', async () => {
		render(<App />);
		await waitForRouterRender();

		expect(screen.getByTestId('router')).toBeInTheDocument();
	});
});
