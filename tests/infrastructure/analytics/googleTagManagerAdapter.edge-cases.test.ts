/**
 * GoogleTagManagerAdapter - Edge Cases Tests
 */

import type { AnalyticsInitOptions } from '@core/ports/AnalyticsPort';
import { GoogleTagManagerAdapter } from '@infra/analytics/googleTagManagerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	clearDataLayer,
	CUSTOM_DATALAYER_NAME,
	getDataLayer,
	getWindowAsRecord,
	restoreGlobals,
	TEST_CONTAINER_ID,
} from './googleTagManagerAdapter.test-utils';

describe('GoogleTagManagerAdapter - Edge Cases', () => {
	describe('Missing Globals Handling', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			adapter = new GoogleTagManagerAdapter();
			originalWindow = globalThis.window;
			originalDocument = globalThis.document;
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should handle missing window object gracefully', () => {
			Object.defineProperty(globalThis, 'window', {
				writable: true,
				value: undefined,
				configurable: true,
			});

			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
			};

			expect(() => adapter.initialize(options)).not.toThrow();
		});

		it('should handle missing document object gracefully', () => {
			Object.defineProperty(globalThis, 'document', {
				writable: true,
				value: undefined,
				configurable: true,
			});

			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
			};

			expect(() => adapter.initialize(options)).not.toThrow();
		});
	});
});

describe('GoogleTagManagerAdapter - DataLayer Edge Cases', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		adapter = new GoogleTagManagerAdapter();
		originalWindow = globalThis.window;
		originalDocument = globalThis.document;
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should handle dataLayer that is not an array', () => {
		getWindowAsRecord().dataLayer = { not: 'an array' } as unknown;

		const options: AnalyticsInitOptions = {
			containerId: TEST_CONTAINER_ID,
		};

		adapter.initialize(options);

		// Should create a new array
		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(Array.isArray(dataLayer)).toBe(true);
	});
});

describe('GoogleTagManagerAdapter - DOM Element Edge Cases', () => {
	describe('DOM Element Handling - Null Elements', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			adapter = new GoogleTagManagerAdapter();
			originalWindow = globalThis.window;
			originalDocument = globalThis.document;
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should handle document.head being null', () => {
			const originalHead = document.head;
			Object.defineProperty(document, 'head', {
				writable: true,
				value: null,
				configurable: true,
			});

			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
			};

			expect(() => adapter.initialize(options)).not.toThrow();

			// Restore
			Object.defineProperty(document, 'head', {
				writable: true,
				value: originalHead,
				configurable: true,
			});
		});

		it('should handle document.body being null', () => {
			const originalBody = document.body;
			Object.defineProperty(document, 'body', {
				writable: true,
				value: null,
				configurable: true,
			});

			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
			};

			expect(() => adapter.initialize(options)).not.toThrow();

			// Restore
			Object.defineProperty(document, 'body', {
				writable: true,
				value: originalBody,
				configurable: true,
			});
		});
	});
});

describe('GoogleTagManagerAdapter - Script Injection Edge Cases', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		adapter = new GoogleTagManagerAdapter();
		originalWindow = globalThis.window;
		originalDocument = globalThis.document;
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should handle missing firstScript parentNode', () => {
		// Remove all scripts temporarily
		const scripts = Array.from(document.querySelectorAll('script'));
		for (const scriptEl of scripts) scriptEl.remove();

		const options: AnalyticsInitOptions = {
			containerId: TEST_CONTAINER_ID,
		};

		adapter.initialize(options);

		// Should still inject script (via document.head.append)
		const script = document.querySelector<HTMLScriptElement>(
			`script[id="gtm-script-${TEST_CONTAINER_ID}"]`
		);
		expect(script).toBeTruthy();

		// Restore scripts
		for (const scriptEl of scripts) document.head.append(scriptEl);
	});
});

describe('GoogleTagManagerAdapter - DataLayer Management', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		adapter = new GoogleTagManagerAdapter();
		originalWindow = globalThis.window;
		originalDocument = globalThis.document;
		clearDataLayer(getWindowAsRecord());
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should push multiple events to dataLayer', () => {
		adapter.initialize({ containerId: TEST_CONTAINER_ID });
		clearDataLayer(getWindowAsRecord());

		adapter.trackEvent({ name: 'event1' });
		adapter.trackEvent({ name: 'event2' });
		adapter.trackPageView({ path: '/page' });

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(3);
		expect(dataLayer[0]).toMatchObject({ event: 'event1' });
		expect(dataLayer[1]).toMatchObject({ event: 'event2' });
		expect(dataLayer[2]).toMatchObject({ event: 'page_view' });
	});

	it('should work with custom dataLayer name', () => {
		adapter.initialize({
			containerId: TEST_CONTAINER_ID,
			dataLayerName: CUSTOM_DATALAYER_NAME,
		});
		clearDataLayer(getWindowAsRecord(), CUSTOM_DATALAYER_NAME);

		adapter.trackEvent({ name: 'test_event' });

		const dataLayer = getDataLayer(getWindowAsRecord(), CUSTOM_DATALAYER_NAME);
		expect(dataLayer.length).toBe(1);
		expect(dataLayer[0]).toMatchObject({ event: 'test_event' });

		// Default dataLayer should not be affected
		const defaultDataLayer = getDataLayer(getWindowAsRecord());
		expect(defaultDataLayer.length).toBe(0);
	});
});
