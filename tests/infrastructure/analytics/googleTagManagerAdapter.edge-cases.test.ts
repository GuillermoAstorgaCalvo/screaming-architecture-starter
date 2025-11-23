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

// Helper to test adapter method when window is null
function testMethodWithNullWindow(adapter: GoogleTagManagerAdapter, methodCall: () => void): void {
	const savedWindow = globalThis.window;
	Object.defineProperty(globalThis, 'window', {
		writable: true,
		value: undefined,
		configurable: true,
	});

	expect(() => {
		methodCall();
	}).not.toThrow();

	Object.defineProperty(globalThis, 'window', {
		writable: true,
		value: savedWindow,
		configurable: true,
	});
}

// Helper to test adapter method when dataLayer is not an array
function testMethodWithNonArrayDataLayer(
	adapter: GoogleTagManagerAdapter,
	methodCall: () => void
): void {
	getWindowAsRecord().dataLayer = { not: 'an array' } as unknown;
	expect(() => {
		methodCall();
	}).not.toThrow();
}

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

			// Verify ensureGlobalDataLayer handles null window gracefully
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

	describe('Non-array dataLayer handling', () => {
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

		it('should handle pushToDataLayer when dataLayer is not an array after initialization', () => {
			adapter.initialize({ containerId: TEST_CONTAINER_ID });
			getWindowAsRecord().dataLayer = { not: 'an array' } as unknown;

			expect(() => {
				adapter.trackEvent({ name: 'test_event' });
			}).not.toThrow();

			const { dataLayer } = getWindowAsRecord();
			expect(Array.isArray(dataLayer)).toBe(false);
		});

		it('should handle pushToDataLayer with custom dataLayer name when dataLayer is not an array', () => {
			adapter.initialize({
				containerId: TEST_CONTAINER_ID,
				dataLayerName: CUSTOM_DATALAYER_NAME,
			});

			getWindowAsRecord()[CUSTOM_DATALAYER_NAME] = { not: 'an array' } as unknown;

			expect(() => {
				adapter.trackEvent({ name: 'test_event' });
			}).not.toThrow();

			const dataLayer = getWindowAsRecord()[CUSTOM_DATALAYER_NAME];
			expect(Array.isArray(dataLayer)).toBe(false);
		});
	});

	describe('Null window handling', () => {
		it('should handle pushToDataLayer when window is null (non-browser environment)', () => {
			adapter.initialize({ containerId: TEST_CONTAINER_ID });

			testMethodWithNullWindow(adapter, () => {
				adapter.trackEvent({ name: 'test_event' });
			});
		});
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

	it('should use insertBefore when firstScript has parentNode (line 151)', () => {
		// Clear any existing scripts first
		const existingScripts = Array.from(document.head.querySelectorAll('script'));
		for (const script of existingScripts) {
			script.remove();
		}

		// Ensure there's at least one script in the document with a parentNode
		const existingScript = document.createElement('script');
		existingScript.id = 'existing-script';
		existingScript.textContent = '// existing script';
		document.head.append(existingScript);

		// Verify the script has a parentNode
		expect(existingScript.parentNode).toBeTruthy();

		const options: AnalyticsInitOptions = {
			containerId: TEST_CONTAINER_ID,
		};

		adapter.initialize(options);

		// Verify script was injected
		const gtmScript = document.querySelector<HTMLScriptElement>(
			`script[id="gtm-script-${TEST_CONTAINER_ID}"]`
		);
		expect(gtmScript).toBeTruthy();

		// Verify the script was inserted before the first script (line 151)
		// This verifies that insertBefore was called when firstScript has parentNode
		const allScripts = Array.from(document.head.querySelectorAll('script'));
		const gtmScriptIndex = allScripts.findIndex(s => s.id === `gtm-script-${TEST_CONTAINER_ID}`);
		const existingScriptIndex = allScripts.findIndex(s => s.id === 'existing-script');

		// GTM script should be before the existing script (insertBefore path)
		expect(gtmScriptIndex).toBeLessThan(existingScriptIndex);
		expect(gtmScriptIndex).toBe(0); // Should be first

		// Verify insertBefore was actually called by checking parentNode
		expect(gtmScript?.parentNode).toBe(existingScript.parentNode);

		// Cleanup
		existingScript.remove();
	});
});

describe('GoogleTagManagerAdapter - Script Injection Non-Browser Environment', () => {
	it('should not inject script when isBrowserEnvironment is false (line 138)', () => {
		const savedWindow = globalThis.window;
		const savedDocument = globalThis.document;

		// Set window and document to undefined to make isBrowserEnvironment return false
		Object.defineProperty(globalThis, 'window', {
			writable: true,
			value: undefined,
			configurable: true,
		});
		Object.defineProperty(globalThis, 'document', {
			writable: true,
			value: undefined,
			configurable: true,
		});

		const testAdapter = new GoogleTagManagerAdapter();
		const options: AnalyticsInitOptions = {
			containerId: TEST_CONTAINER_ID,
		};

		// This should not throw and should not inject script (line 138)
		expect(() => testAdapter.initialize(options)).not.toThrow();

		// Restore
		Object.defineProperty(globalThis, 'window', {
			writable: true,
			value: savedWindow,
			configurable: true,
		});
		Object.defineProperty(globalThis, 'document', {
			writable: true,
			value: savedDocument,
			configurable: true,
		});
	});

	it('should handle ensureGlobalDataLayer when window is null (line 125)', () => {
		const savedWindow = globalThis.window;
		const savedDocument = globalThis.document;

		// Set window to null but keep document as object
		// This makes isBrowserEnvironment() return true (typeof null === 'object')
		// but getWindow() will return null, hitting line 125
		Object.defineProperty(globalThis, 'window', {
			writable: true,
			value: null,
			configurable: true,
		});

		const testAdapter = new GoogleTagManagerAdapter();
		const options: AnalyticsInitOptions = {
			containerId: TEST_CONTAINER_ID,
		};

		// This should not throw and should handle null window gracefully (line 125)
		expect(() => testAdapter.initialize(options)).not.toThrow();

		// Restore
		Object.defineProperty(globalThis, 'window', {
			writable: true,
			value: savedWindow,
			configurable: true,
		});
		Object.defineProperty(globalThis, 'document', {
			writable: true,
			value: savedDocument,
			configurable: true,
		});
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

describe('GoogleTagManagerAdapter - DataLayer Null Handling - Non-array dataLayer', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		adapter = new GoogleTagManagerAdapter();
		originalWindow = globalThis.window;
		originalDocument = globalThis.document;
		adapter.initialize({ containerId: TEST_CONTAINER_ID });
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should handle trackPageView when dataLayer is not an array', () => {
		testMethodWithNonArrayDataLayer(adapter, () => {
			adapter.trackPageView({ path: '/test' });
		});
	});

	it('should handle identify when dataLayer is not an array', () => {
		testMethodWithNonArrayDataLayer(adapter, () => {
			adapter.identify({ userId: 'user123' });
		});
	});

	it('should handle setUserProperties when dataLayer is not an array', () => {
		testMethodWithNonArrayDataLayer(adapter, () => {
			adapter.setUserProperties({ email: 'test@example.com' });
		});
	});

	it('should handle reset when dataLayer is not an array', () => {
		testMethodWithNonArrayDataLayer(adapter, () => {
			adapter.reset();
		});
	});
});

describe('GoogleTagManagerAdapter - DataLayer Null Handling - Null window', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		adapter = new GoogleTagManagerAdapter();
		originalWindow = globalThis.window;
		originalDocument = globalThis.document;
		adapter.initialize({ containerId: TEST_CONTAINER_ID });
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should handle trackEvent when window is null', () => {
		testMethodWithNullWindow(adapter, () => {
			adapter.trackEvent({ name: 'test_event' });
		});
	});

	it('should handle trackPageView when window is null', () => {
		testMethodWithNullWindow(adapter, () => {
			adapter.trackPageView({ path: '/test' });
		});
	});

	it('should handle identify when window is null', () => {
		testMethodWithNullWindow(adapter, () => {
			adapter.identify({ userId: 'user123' });
		});
	});

	it('should handle setUserProperties when window is null', () => {
		testMethodWithNullWindow(adapter, () => {
			adapter.setUserProperties({ email: 'test@example.com' });
		});
	});

	it('should handle reset when window is null', () => {
		testMethodWithNullWindow(adapter, () => {
			adapter.reset();
		});
	});
});

describe('GoogleTagManagerAdapter - Error Recovery Paths', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		adapter = new GoogleTagManagerAdapter();
		originalWindow = globalThis.window;
		originalDocument = globalThis.document;
		adapter.initialize({ containerId: TEST_CONTAINER_ID });
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should handle pushToDataLayer when getDataLayer returns null (line 188)', () => {
		// Set dataLayer to non-array to make getDataLayer return null (line 204)
		getWindowAsRecord().dataLayer = { not: 'an array' } as unknown;

		// This should call pushToDataLayer which will return early at line 188
		expect(() => {
			adapter.trackEvent({ name: 'test_event' });
		}).not.toThrow();

		// Verify dataLayer was not modified
		const { dataLayer } = getWindowAsRecord();
		expect(Array.isArray(dataLayer)).toBe(false);
	});

	it('should handle getDataLayer when window is null (line 197)', () => {
		// Temporarily set window to null
		const savedWindow = globalThis.window;
		Object.defineProperty(globalThis, 'window', {
			writable: true,
			value: null,
			configurable: true,
		});

		// This should call getDataLayer which will return null at line 197
		expect(() => {
			adapter.trackEvent({ name: 'test_event' });
		}).not.toThrow();

		// Restore
		Object.defineProperty(globalThis, 'window', {
			writable: true,
			value: savedWindow,
			configurable: true,
		});
	});

	it('should handle getDataLayer when dataLayer is not an array (line 204)', () => {
		// Set dataLayer to non-array to make getDataLayer return null at line 204
		getWindowAsRecord().dataLayer = { not: 'an array' } as unknown;

		// This should call getDataLayer which will return null at line 204
		expect(() => {
			adapter.trackEvent({ name: 'test_event' });
		}).not.toThrow();

		// Verify dataLayer was not modified
		const { dataLayer } = getWindowAsRecord();
		expect(Array.isArray(dataLayer)).toBe(false);
	});

	it('should handle pushToDataLayer with custom dataLayer name when getDataLayer returns null', () => {
		// Re-initialize with custom dataLayer name
		adapter.initialize({
			containerId: TEST_CONTAINER_ID,
			dataLayerName: CUSTOM_DATALAYER_NAME,
		});

		// Set custom dataLayer to non-array
		getWindowAsRecord()[CUSTOM_DATALAYER_NAME] = { not: 'an array' } as unknown;

		// This should call pushToDataLayer which will return early
		expect(() => {
			adapter.trackEvent({ name: 'test_event' });
		}).not.toThrow();

		// Verify custom dataLayer was not modified
		const dataLayer = getWindowAsRecord()[CUSTOM_DATALAYER_NAME];
		expect(Array.isArray(dataLayer)).toBe(false);
	});
});
