/**
 * GoogleTagManagerAdapter - Tracking Tests (Page Views & Events)
 */

import type { AnalyticsEvent, AnalyticsPageView } from '@core/ports/AnalyticsPort';
import { GoogleTagManagerAdapter } from '@infra/analytics/googleTagManagerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	clearDataLayer,
	getDataLayer,
	getWindowAsRecord,
	restoreGlobals,
	setupInitializedAdapter,
	TEST_PAGE_PATH,
} from './googleTagManagerAdapter.test-utils';

describe('GoogleTagManagerAdapter - Page View Tracking', () => {
	describe('Successful Tracking', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			({ adapter, originalWindow, originalDocument } = setupInitializedAdapter());
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should track page view with all properties', () => {
			const page: AnalyticsPageView = {
				path: TEST_PAGE_PATH,
				title: 'Test Page',
				location: 'https://example.com/test-page',
			};

			adapter.trackPageView(page);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBe(1);
			expect(dataLayer[0]).toMatchObject({
				event: 'page_view',
				page_path: TEST_PAGE_PATH,
				page_title: 'Test Page',
				page_location: 'https://example.com/test-page',
			});
		});

		it('should track page view with minimal properties', () => {
			const page: AnalyticsPageView = {
				path: TEST_PAGE_PATH,
			};

			adapter.trackPageView(page);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBe(1);
			expect(dataLayer[0]).toMatchObject({
				event: 'page_view',
				page_path: TEST_PAGE_PATH,
			});
			// The adapter includes these properties even when undefined
			expect((dataLayer[0] as Record<string, unknown>).page_title).toBeUndefined();
			expect((dataLayer[0] as Record<string, unknown>).page_location).toBeUndefined();
		});
	});
});

describe('GoogleTagManagerAdapter - Page View Error Handling', () => {
	beforeEach(() => {
		clearDataLayer(getWindowAsRecord());
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should not track page view when not initialized', () => {
		const uninitializedAdapter = new GoogleTagManagerAdapter();
		const page: AnalyticsPageView = {
			path: TEST_PAGE_PATH,
		};

		uninitializedAdapter.trackPageView(page);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(0);
	});

	it('should not track page view when containerId is missing', () => {
		const uninitializedAdapter = new GoogleTagManagerAdapter();
		uninitializedAdapter.initialize({});
		const page: AnalyticsPageView = {
			path: TEST_PAGE_PATH,
		};

		uninitializedAdapter.trackPageView(page);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(0);
	});
});

describe('GoogleTagManagerAdapter - Event Tracking', () => {
	describe('Simple Events', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			({ adapter, originalWindow, originalDocument } = setupInitializedAdapter());
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should track event with name and params', () => {
			const event: AnalyticsEvent = {
				name: 'button_click',
				params: {
					button_id: 'submit',
					button_text: 'Submit',
				},
			};

			adapter.trackEvent(event);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBe(1);
			expect(dataLayer[0]).toMatchObject({
				event: 'button_click',
				button_id: 'submit',
				button_text: 'Submit',
			});
		});

		it('should track event with name only', () => {
			const event: AnalyticsEvent = {
				name: 'simple_event',
			};

			adapter.trackEvent(event);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBe(1);
			expect(dataLayer[0]).toMatchObject({
				event: 'simple_event',
			});
		});
	});
});

describe('GoogleTagManagerAdapter - Complex Event Tracking', () => {
	describe('Complex Events', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			({ adapter, originalWindow, originalDocument } = setupInitializedAdapter());
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should track event with complex params', () => {
			const event: AnalyticsEvent = {
				name: 'purchase',
				params: {
					transaction_id: '12345',
					value: 99.99,
					currency: 'USD',
					items: [
						{ id: 'item1', name: 'Product 1', price: 49.99 },
						{ id: 'item2', name: 'Product 2', price: 50 },
					],
				},
			};

			adapter.trackEvent(event);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBe(1);
			expect(dataLayer[0]).toMatchObject({
				event: 'purchase',
				transaction_id: '12345',
				value: 99.99,
				currency: 'USD',
			});
			expect((dataLayer[0] as Record<string, unknown>).items).toBeDefined();
		});
	});
});

describe('GoogleTagManagerAdapter - Event Error Handling', () => {
	beforeEach(() => {
		clearDataLayer(getWindowAsRecord());
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should not track event when not initialized', () => {
		const uninitializedAdapter = new GoogleTagManagerAdapter();
		const event: AnalyticsEvent = {
			name: 'test_event',
		};

		uninitializedAdapter.trackEvent(event);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(0);
	});

	it('should not track event when containerId is missing', () => {
		const uninitializedAdapter = new GoogleTagManagerAdapter();
		uninitializedAdapter.initialize({});
		const event: AnalyticsEvent = {
			name: 'test_event',
		};

		uninitializedAdapter.trackEvent(event);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(0);
	});
});
