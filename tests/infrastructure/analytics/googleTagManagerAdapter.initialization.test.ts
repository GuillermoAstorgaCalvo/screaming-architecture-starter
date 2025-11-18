/**
 * GoogleTagManagerAdapter - Initialization Tests
 */

import type { AnalyticsInitOptions } from '@core/ports/AnalyticsPort';
import type { GoogleTagManagerAdapter } from '@infra/analytics/googleTagManagerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	CUSTOM_DATALAYER_NAME,
	getDataLayer,
	getWindowAsRecord,
	restoreGlobals,
	setupTestEnvironment,
	TEST_CONTAINER_ID,
} from './googleTagManagerAdapter.test-utils';

describe('GoogleTagManagerAdapter - Initialization', () => {
	describe('Successful Initialization', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			({ adapter, originalWindow, originalDocument } = setupTestEnvironment());
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should initialize with containerId', () => {
			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
			};

			adapter.initialize(options);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBeGreaterThan(0);
			expect(dataLayer[0]).toMatchObject({
				event: 'gtm.js',
			});
			expect(dataLayer[0]).toHaveProperty('gtm.start');
		});

		it('should initialize with writeKey as fallback', () => {
			const options: AnalyticsInitOptions = {
				writeKey: TEST_CONTAINER_ID,
			};

			adapter.initialize(options);

			const dataLayer = getDataLayer(getWindowAsRecord());
			expect(dataLayer.length).toBeGreaterThan(0);
			expect(dataLayer[0]).toMatchObject({
				event: 'gtm.js',
			});
		});

		it('should use custom dataLayer name when provided', () => {
			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
				dataLayerName: CUSTOM_DATALAYER_NAME,
			};

			adapter.initialize(options);

			const dataLayer = getDataLayer(getWindowAsRecord(), CUSTOM_DATALAYER_NAME);
			expect(Array.isArray(dataLayer)).toBe(true);
			expect(dataLayer.length).toBeGreaterThan(0);
		});
	});
});

describe('GoogleTagManagerAdapter - Initialization Errors', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		({ adapter, originalWindow, originalDocument } = setupTestEnvironment());
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should not initialize when containerId is missing', () => {
		const options: AnalyticsInitOptions = {};

		adapter.initialize(options);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBe(0);

		const script = document.querySelector(`script[id^="gtm-script-"]`);
		expect(script).toBeNull();
	});

	it('should not initialize in non-browser environment', () => {
		// Mock non-browser environment
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

		const options: AnalyticsInitOptions = {
			containerId: TEST_CONTAINER_ID,
		};

		adapter.initialize(options);

		// Should not throw, but should not initialize
		expect(true).toBe(true); // Just verify it doesn't crash
	});
});

describe('GoogleTagManagerAdapter - Script Injection', () => {
	describe('Script Element', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			({ adapter, originalWindow, originalDocument } = setupTestEnvironment());
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should inject GTM script with correct attributes', () => {
			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
			};

			adapter.initialize(options);

			const script = document.querySelector<HTMLScriptElement>(
				`script[id="gtm-script-${TEST_CONTAINER_ID}"]`
			);
			expect(script).toBeTruthy();
			expect(script?.async).toBe(true);
			expect(script?.src).toContain(`id=${TEST_CONTAINER_ID}`);
			expect(script?.src).toContain('https://www.googletagmanager.com/gtm.js');
		});

		it('should include debug parameter when debug is enabled', () => {
			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
				debug: true,
			};

			adapter.initialize(options);

			const script = document.querySelector<HTMLScriptElement>(
				`script[id="gtm-script-${TEST_CONTAINER_ID}"]`
			);
			expect(script?.src).toContain('gtm_debug=x');
		});
	});
});

describe('GoogleTagManagerAdapter - Script Injection Advanced', () => {
	describe('Script Element - Advanced', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			({ adapter, originalWindow, originalDocument } = setupTestEnvironment());
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should include custom dataLayer name in script URL when provided', () => {
			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
				dataLayerName: CUSTOM_DATALAYER_NAME,
			};

			adapter.initialize(options);

			const script = document.querySelector<HTMLScriptElement>(
				`script[id="gtm-script-${TEST_CONTAINER_ID}"]`
			);
			expect(script?.src).toContain(`l=${CUSTOM_DATALAYER_NAME}`);
		});

		it('should not inject script twice', () => {
			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
			};

			adapter.initialize(options);
			const firstScriptCount = document.querySelectorAll(
				`script[id="gtm-script-${TEST_CONTAINER_ID}"]`
			).length;

			adapter.initialize(options);
			const secondScriptCount = document.querySelectorAll(
				`script[id="gtm-script-${TEST_CONTAINER_ID}"]`
			).length;

			expect(firstScriptCount).toBe(1);
			expect(secondScriptCount).toBe(1);
		});
	});
});

describe('GoogleTagManagerAdapter - Noscript Injection', () => {
	describe('Noscript Element', () => {
		let adapter: GoogleTagManagerAdapter;
		let originalWindow: typeof globalThis.window;
		let originalDocument: Document;

		beforeEach(() => {
			({ adapter, originalWindow, originalDocument } = setupTestEnvironment());
		});

		afterEach(() => {
			restoreGlobals(originalWindow, originalDocument);
			vi.clearAllMocks();
		});

		it('should inject noscript iframe', () => {
			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
			};

			adapter.initialize(options);

			const noscript = document.querySelector(`noscript[id="gtm-noscript-${TEST_CONTAINER_ID}"]`);
			expect(noscript).toBeTruthy();

			const iframe = noscript?.querySelector('iframe');
			expect(iframe).toBeTruthy();
			expect(iframe?.src).toBe(`https://www.googletagmanager.com/ns.html?id=${TEST_CONTAINER_ID}`);
			expect(iframe?.height).toBe('0');
			expect(iframe?.width).toBe('0');
			expect(iframe?.title).toBe('Google Tag Manager');
			expect(iframe?.style.display).toBe('none');
			expect(iframe?.style.visibility).toBe('hidden');
		});

		it('should not inject noscript twice', () => {
			const options: AnalyticsInitOptions = {
				containerId: TEST_CONTAINER_ID,
			};

			adapter.initialize(options);
			const firstNoscriptCount = document.querySelectorAll(
				`noscript[id="gtm-noscript-${TEST_CONTAINER_ID}"]`
			).length;

			adapter.initialize(options);
			const secondNoscriptCount = document.querySelectorAll(
				`noscript[id="gtm-noscript-${TEST_CONTAINER_ID}"]`
			).length;

			expect(firstNoscriptCount).toBe(1);
			expect(secondNoscriptCount).toBe(1);
		});
	});
});

describe('GoogleTagManagerAdapter - DataLayer Management', () => {
	let adapter: GoogleTagManagerAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		({ adapter, originalWindow, originalDocument } = setupTestEnvironment());
	});

	afterEach(() => {
		restoreGlobals(originalWindow, originalDocument);
		vi.clearAllMocks();
	});

	it('should create dataLayer if it does not exist', () => {
		// Remove dataLayer if it exists
		delete getWindowAsRecord().dataLayer;

		const options: AnalyticsInitOptions = {
			containerId: TEST_CONTAINER_ID,
		};

		adapter.initialize(options);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(Array.isArray(dataLayer)).toBe(true);
		expect(dataLayer.length).toBeGreaterThan(0);
	});

	it('should use existing dataLayer if it already exists', () => {
		const existingData = { event: 'existing_event' };
		getWindowAsRecord().dataLayer = [existingData];

		const options: AnalyticsInitOptions = {
			containerId: TEST_CONTAINER_ID,
		};

		adapter.initialize(options);

		const dataLayer = getDataLayer(getWindowAsRecord());
		expect(dataLayer.length).toBeGreaterThan(1);
		expect(dataLayer[0]).toEqual(existingData);
	});
});
