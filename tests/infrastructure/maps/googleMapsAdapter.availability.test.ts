/**
 * GoogleMapsAdapter Availability and Script Loading Tests
 */

import type { GoogleMapsAdapter } from '@infra/maps/googleMapsAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	cleanupTestEnvironment,
	clearGoogleMapsScripts,
	getScriptElement,
	GOOGLE_MAPS_SCRIPT_ID,
	mockGoogleMapsAPI,
	removeGoogleMapsAPI,
	setupTestEnvironment,
	simulateScriptLoad,
	TEST_API_KEY,
} from './googleMapsAdapter.test-utils';

describe('GoogleMapsAdapter - Availability Checks', () => {
	let adapter: GoogleMapsAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		const {
			adapter: newAdapter,
			originalWindow: origWindow,
			originalDocument: origDoc,
		} = setupTestEnvironment();
		adapter = newAdapter;
		originalWindow = origWindow;
		originalDocument = origDoc;
		removeGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);
	});

	afterEach(() => {
		cleanupTestEnvironment(originalWindow, originalDocument);
	});

	it('should return false when Google Maps is not available', () => {
		expect(adapter.isGoogleMapsAvailable()).toBe(false);
	});

	it('should return true when Google Maps is available', () => {
		mockGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);
		expect(adapter.isGoogleMapsAvailable()).toBe(true);
	});

	it('should return false in non-browser environment', () => {
		Object.defineProperty(globalThis, 'window', {
			writable: true,
			value: undefined,
			configurable: true,
		});

		expect(adapter.isGoogleMapsAvailable()).toBe(false);
	});

	it('should return null when Google Maps is not available', () => {
		expect(adapter.getGoogleMaps()).toBeNull();
	});

	it('should return Google Maps API when available', () => {
		const mockMaps = {} as unknown;
		(globalThis.window as unknown as { google?: { maps: unknown } }).google = {
			maps: mockMaps,
		};

		expect(adapter.getGoogleMaps()).toBe(mockMaps);
	});

	it('should return null in non-browser environment', () => {
		Object.defineProperty(globalThis, 'window', {
			writable: true,
			value: undefined,
			configurable: true,
		});

		expect(adapter.getGoogleMaps()).toBeNull();
	});
});

describe('GoogleMapsAdapter - Script Loading - Injection', () => {
	let adapter: GoogleMapsAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		const {
			adapter: newAdapter,
			originalWindow: origWindow,
			originalDocument: origDoc,
		} = setupTestEnvironment();
		adapter = newAdapter;
		originalWindow = origWindow;
		originalDocument = origDoc;
		clearGoogleMapsScripts();
		removeGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);
	});

	afterEach(() => {
		cleanupTestEnvironment(originalWindow, originalDocument);
	});

	it('should inject script into document head', async () => {
		const scriptLoadPromise = adapter.initialize(TEST_API_KEY);

		const script = getScriptElement();
		expect(script).toBeTruthy();
		expect(script?.parentElement).toBe(document.head);

		simulateScriptLoad(script);
		await scriptLoadPromise;
	});

	it('should not inject script if head element is missing', async () => {
		// Mock querySelector to return null for 'head' query
		// Store original implementation before spying to preserve behavior for other selectors
		// Note: querySelector is flagged as deprecated by TypeScript DOM types, but it's still
		// the standard API used by the implementation, so we need to test with it
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		const originalQuerySelector = document.querySelector;
		const querySelectorSpy = vi
			.spyOn(document, 'querySelector')
			.mockImplementation((selector: string) => {
				if (selector === 'head') {
					return null;
				}
				// Call original implementation with correct 'this' context
				return originalQuerySelector.call(document, selector);
			});

		const initPromise = adapter.initialize(TEST_API_KEY);
		await expect(initPromise).resolves.toBeUndefined();

		const script = getScriptElement();
		expect(script).toBeNull();

		querySelectorSpy.mockRestore();
	});
});

describe('GoogleMapsAdapter - Script Loading - Existing Script', () => {
	let adapter: GoogleMapsAdapter;
	let originalWindow: typeof globalThis.window;
	let originalDocument: Document;

	beforeEach(() => {
		const {
			adapter: newAdapter,
			originalWindow: origWindow,
			originalDocument: origDoc,
		} = setupTestEnvironment();
		adapter = newAdapter;
		originalWindow = origWindow;
		originalDocument = origDoc;
		clearGoogleMapsScripts();
		removeGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);
	});

	afterEach(() => {
		cleanupTestEnvironment(originalWindow, originalDocument);
	});

	it('should handle existing script that is already loaded', async () => {
		// Ensure document.head is available
		if (!document.head) {
			const head = document.createElement('head');
			document.documentElement.append(head);
		}

		const existingScript = document.createElement('script');
		existingScript.id = GOOGLE_MAPS_SCRIPT_ID;
		document.head.append(existingScript);

		mockGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);

		await adapter.initialize(TEST_API_KEY);

		const scripts = document.querySelectorAll<HTMLScriptElement>(
			`script[id="${GOOGLE_MAPS_SCRIPT_ID}"]`
		);
		expect(scripts.length).toBe(1);
	});

	it('should wait for existing script to load', async () => {
		// Ensure document.head is available
		if (!document.head) {
			const head = document.createElement('head');
			document.documentElement.append(head);
		}

		const existingScript = document.createElement('script');
		existingScript.id = GOOGLE_MAPS_SCRIPT_ID;
		document.head.append(existingScript);

		const initPromise = adapter.initialize(TEST_API_KEY);

		setTimeout(() => {
			mockGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);
			existingScript.dispatchEvent(new Event('load'));
		}, 10);

		await initPromise;
		expect(adapter.isGoogleMapsAvailable()).toBe(true);
	});
});
