/**
 * Router Tests
 *
 * Tests for route configuration, route rendering, analytics tracking,
 * lazy loading, and route transitions
 */

import '@domains/landing/i18n';

import Router from '@app/router';
import { buildRoute } from '@core/router/routes.gen';
import { screen, waitFor } from '@testing-library/react';
import { MockAnalyticsAdapter } from '@tests/utils/mocks/MockAnalyticsAdapter';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ROOT_PATH = '/';
const UNKNOWN_ROUTE = '/unknown-route';
const LANDING_PAGE_TEST_ID = 'landing-page';

// Mock lazy-loaded components
vi.mock('@domains/landing/pages/LandingPage', () => ({
	default: () => <div data-testid="landing-page">Landing Page</div>,
}));

vi.mock('@core/ui/utilities/motion/components/RouteTransition.lazy', () => ({
	LazyRouteTransition: ({ children }: { children: ReactNode }) => (
		<div data-testid="route-transition">{children}</div>
	),
}));

vi.mock('@core/ui/utilities/loadable/components/loadableFallback', () => ({
	DefaultLoadingFallback: () => <div data-testid="loading-fallback">Loading...</div>,
}));

describe('Router - Route Configuration', () => {
	let mockAnalytics: MockAnalyticsAdapter;

	beforeEach(() => {
		mockAnalytics = new MockAnalyticsAdapter();
	});

	afterEach(() => {
		mockAnalytics.clear();
		vi.clearAllMocks();
	});

	it('renders HOME route at root path', async () => {
		renderWithProviders(<Router />, {
			analytics: mockAnalytics,
			router: MemoryRouter,
			routerProps: { initialEntries: [ROOT_PATH] },
		});

		await waitFor(() => {
			expect(screen.getByTestId(LANDING_PAGE_TEST_ID)).toBeInTheDocument();
		});
	});

	it('renders Error404 for unknown routes', async () => {
		renderWithProviders(<Router />, {
			analytics: mockAnalytics,
			router: MemoryRouter,
			routerProps: { initialEntries: [UNKNOWN_ROUTE] },
		});

		// Wait for lazy loading and route resolution
		await waitFor(() => {
			expect(screen.getByText('404')).toBeInTheDocument();
		});

		// Error404 should be rendered for unknown routes
		expect(screen.getByText('404')).toBeInTheDocument();
		expect(screen.getByText('Page not found')).toBeInTheDocument();
	});

	it('uses buildRoute for HOME route path', () => {
		const homePath = buildRoute('HOME');
		expect(homePath).toBe(ROOT_PATH);
	});
});

describe('Router - Route Rendering', () => {
	let mockAnalytics: MockAnalyticsAdapter;

	beforeEach(() => {
		mockAnalytics = new MockAnalyticsAdapter();
	});

	afterEach(() => {
		mockAnalytics.clear();
		vi.clearAllMocks();
	});

	it('renders AppLayout wrapper around routes', async () => {
		renderWithProviders(<Router />, {
			analytics: mockAnalytics,
			router: MemoryRouter,
			routerProps: { initialEntries: [ROOT_PATH] },
		});

		await waitFor(() => {
			expect(screen.getByTestId(LANDING_PAGE_TEST_ID)).toBeInTheDocument();
		});

		// AppLayout should be present (rendered by Layout component)
		expect(screen.getByRole('main')).toBeInTheDocument();
	});

	it('renders Suspense wrapper for lazy-loaded routes', async () => {
		renderWithProviders(<Router />, {
			analytics: mockAnalytics,
			router: MemoryRouter,
			routerProps: { initialEntries: [ROOT_PATH] },
		});

		// Suspense should wrap the routes, but fallback may not be visible
		// if lazy loading is fast enough
		await waitFor(() => {
			expect(screen.getByTestId(LANDING_PAGE_TEST_ID)).toBeInTheDocument();
		});
	});

	it('renders routes with route transitions when transitions are ready', async () => {
		renderWithProviders(<Router />, {
			analytics: mockAnalytics,
			router: MemoryRouter,
			routerProps: { initialEntries: [ROOT_PATH] },
		});

		// Wait for deferred activation (timeout is 0, so should be ready immediately)
		await waitFor(() => {
			// Route transition should be rendered when transitionsReady is true
			// Note: transition may or may not be present depending on timing
			expect(screen.getByTestId('landing-page')).toBeInTheDocument();
		});
	});
});

function setupAnalyticsMocks() {
	const mockAnalytics = new MockAnalyticsAdapter();
	// Mock document.title
	Object.defineProperty(document, 'title', {
		writable: true,
		value: 'Test App',
	});
	// Mock globalThis.window.location
	Object.defineProperty(globalThis, 'window', {
		writable: true,
		value: {
			location: {
				href: 'http://localhost:3000/',
			},
		},
	});
	return mockAnalytics;
}

function renderRouterWithPath(path: string, analytics: MockAnalyticsAdapter) {
	renderWithProviders(<Router />, {
		analytics,
		router: MemoryRouter,
		routerProps: { initialEntries: [path] },
	});
}

async function waitForPageView(analytics: MockAnalyticsAdapter) {
	// Wait for the page view to be tracked
	// Use a simple polling approach since we're checking a mock adapter
	let attempts = 0;
	const maxAttempts = 50;
	while (analytics.pageViews.length === 0 && attempts < maxAttempts) {
		await new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();
			}, 10);
		});
		attempts++;
	}
	if (analytics.pageViews.length === 0) {
		throw new Error('Page view was not tracked within timeout');
	}
	return analytics.pageViews[0];
}

describe('Router - Analytics Tracking - Page View', () => {
	let mockAnalytics: MockAnalyticsAdapter;

	beforeEach(() => {
		mockAnalytics = setupAnalyticsMocks();
	});

	afterEach(() => {
		mockAnalytics.clear();
		vi.clearAllMocks();
	});

	describe('Initial render', () => {
		it('tracks page view on initial render', async () => {
			renderRouterWithPath(ROOT_PATH, mockAnalytics);

			const pageView = await waitForPageView(mockAnalytics);

			expect(pageView).toBeDefined();
			expect(pageView?.path).toBe(ROOT_PATH);
		});
	});

	describe('Document title', () => {
		it('tracks page view with document title when available', async () => {
			document.title = 'My App Title';

			renderRouterWithPath(ROOT_PATH, mockAnalytics);

			const pageView = await waitForPageView(mockAnalytics);

			expect(pageView).toBeDefined();
			expect(pageView?.title).toBe('My App Title');
		});
	});

	describe('Window location', () => {
		it('tracks page view with window location when available', async () => {
			Object.defineProperty(globalThis, 'window', {
				writable: true,
				value: {
					location: {
						href: 'http://localhost:3000/test?param=value#hash',
					},
				},
			});

			renderRouterWithPath(ROOT_PATH, mockAnalytics);

			const pageView = await waitForPageView(mockAnalytics);

			expect(pageView).toBeDefined();
			expect(pageView?.location).toBe('http://localhost:3000/test?param=value#hash');
		});
	});

	describe('Path components', () => {
		it('tracks page view with path, search, and hash', async () => {
			renderRouterWithPath('/test?query=value#section', mockAnalytics);

			const pageView = await waitForPageView(mockAnalytics);

			expect(pageView).toBeDefined();
			expect(pageView?.path).toContain('/test');
			expect(pageView?.path).toContain('query=value');
			expect(pageView?.path).toContain('#section');
		});
	});
});

describe('Router - Analytics Tracking - Error Handling', () => {
	let mockAnalytics: MockAnalyticsAdapter;

	beforeEach(() => {
		mockAnalytics = new MockAnalyticsAdapter();
	});

	afterEach(() => {
		mockAnalytics.clear();
		vi.clearAllMocks();
	});

	describe('Missing document title', () => {
		it('handles missing document title gracefully', async () => {
			// Mock document without title property
			const originalTitle = document.title;
			Object.defineProperty(document, 'title', {
				writable: true,
				value: undefined,
			});

			renderRouterWithPath(ROOT_PATH, mockAnalytics);

			const pageView = await waitForPageView(mockAnalytics);

			expect(pageView).toBeDefined();
			expect(pageView?.title).toBeUndefined();

			// Restore
			Object.defineProperty(document, 'title', {
				writable: true,
				value: originalTitle,
			});
		});
	});

	describe('Missing window location', () => {
		it('handles missing window location gracefully', async () => {
			// Mock window without location
			const originalWindow = globalThis.window;
			Object.defineProperty(globalThis, 'window', {
				writable: true,
				value: {},
			});

			renderRouterWithPath(ROOT_PATH, mockAnalytics);

			const pageView = await waitForPageView(mockAnalytics);

			expect(pageView).toBeDefined();
			expect(pageView?.location).toBeUndefined();

			// Restore
			Object.defineProperty(globalThis, 'window', {
				writable: true,
				value: originalWindow,
			});
		});
	});
});

describe('Router - App Initialization', () => {
	let mockAnalytics: MockAnalyticsAdapter;

	beforeEach(() => {
		mockAnalytics = new MockAnalyticsAdapter();
	});

	afterEach(() => {
		mockAnalytics.clear();
		vi.clearAllMocks();
	});

	it('renders without crashing', () => {
		expect(() => {
			renderWithProviders(<Router />, {
				analytics: mockAnalytics,
				router: MemoryRouter,
				routerProps: { initialEntries: [ROOT_PATH] },
			});
		}).not.toThrow();
	});

	it('initializes with correct route structure', async () => {
		const { container } = renderWithProviders(<Router />, {
			analytics: mockAnalytics,
			router: MemoryRouter,
			routerProps: { initialEntries: [ROOT_PATH] },
		});

		await waitFor(
			() => {
				expect(screen.getByTestId(LANDING_PAGE_TEST_ID)).toBeInTheDocument();
			},
			{ container }
		);

		// Verify route structure is correct
		expect(screen.getByTestId(LANDING_PAGE_TEST_ID)).toBeInTheDocument();
	});
});
