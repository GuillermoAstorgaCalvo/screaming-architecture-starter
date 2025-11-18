/**
 * GoogleMapsAdapter Error Handling, Callbacks, and Edge Cases Tests
 */

import type { GoogleMapsAdapter } from '@infra/maps/googleMapsAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	cleanupTestEnvironment,
	clearGoogleMapsScripts,
	getScriptElement,
	removeGoogleMapsAPI,
	setupTestEnvironment,
	simulateScriptLoad,
	TEST_API_KEY,
} from './googleMapsAdapter.test-utils';

describe('GoogleMapsAdapter - Error Handling - Script Errors', () => {
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

	it('should reject when script fails to load', async () => {
		const initPromise = adapter.initialize(TEST_API_KEY);

		const script = getScriptElement();
		expect(script).toBeTruthy();

		if (script) {
			script.dispatchEvent(new Event('error'));
		}

		await expect(initPromise).rejects.toThrow('Failed to load Google Maps script');
	});

	it('should handle missing API key when creating script element', () => {
		adapter.initialize('');

		const script = getScriptElement();
		expect(script).toBeNull();
	});
});

describe('GoogleMapsAdapter - Error Handling - Recovery', () => {
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

	it('should reset loading state on script error', async () => {
		const initPromise = adapter.initialize(TEST_API_KEY);

		const script = getScriptElement();
		if (script) {
			script.dispatchEvent(new Event('error'));
		}

		await expect(initPromise).rejects.toThrow();

		const retryPromise = adapter.initialize(TEST_API_KEY);
		const retryScript = getScriptElement();
		expect(retryScript).toBeTruthy();

		simulateScriptLoad(retryScript);
		await retryPromise;
		expect(adapter.isGoogleMapsAvailable()).toBe(true);
	});

	it('should handle multiple concurrent initializations with error', async () => {
		const firstInitPromise = adapter.initialize(TEST_API_KEY);
		adapter.initialize(TEST_API_KEY);

		await new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();
			}, 10);
		});

		const script = getScriptElement();
		expect(script).toBeTruthy();

		if (script) {
			script.dispatchEvent(new Event('error'));
		}

		await expect(firstInitPromise).rejects.toThrow('Failed to load Google Maps script');
		expect(adapter.isGoogleMapsAvailable()).toBe(false);
	});
});

describe('GoogleMapsAdapter - Callback Management', () => {
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

	it('should notify all callbacks when script loads', async () => {
		const callback1 = vi.fn();
		const callback2 = vi.fn();

		const promise1 = adapter.initialize(TEST_API_KEY).then(callback1);
		const promise2 = adapter.initialize(TEST_API_KEY).then(callback2);

		const script = getScriptElement();
		simulateScriptLoad(script);

		await Promise.all([promise1, promise2]);

		expect(callback1).toHaveBeenCalled();
		expect(callback2).toHaveBeenCalled();
	});

	it('should clear callbacks after notifying', async () => {
		const promise1 = adapter.initialize(TEST_API_KEY);
		const promise2 = adapter.initialize(TEST_API_KEY);

		const script = getScriptElement();
		simulateScriptLoad(script);

		await Promise.all([promise1, promise2]);

		const newPromise = adapter.initialize(TEST_API_KEY);
		const newScript = getScriptElement();
		expect(newScript).toBeTruthy();

		simulateScriptLoad(newScript);
		await newPromise;
	});
});

describe('GoogleMapsAdapter - Edge Cases', () => {
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

	it('should handle empty libraries array', async () => {
		const scriptLoadPromise = adapter.initialize(TEST_API_KEY, []);

		const script = getScriptElement();
		expect(script?.src).toContain('libraries=marker');

		simulateScriptLoad(script);
		await scriptLoadPromise;
	});

	it('should handle window.google being undefined', () => {
		removeGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);
		expect(adapter.isGoogleMapsAvailable()).toBe(false);
		expect(adapter.getGoogleMaps()).toBeNull();
	});

	it('should handle window.google.maps being undefined', () => {
		(globalThis.window as unknown as { google?: { maps?: unknown } }).google = {};
		expect(adapter.isGoogleMapsAvailable()).toBe(false);
		expect(adapter.getGoogleMaps()).toBeNull();
	});

	it('should handle script URL with multiple libraries', async () => {
		const libraries = ['places', 'geometry', 'drawing'];
		const scriptLoadPromise = adapter.initialize(TEST_API_KEY, libraries);

		const script = getScriptElement();
		const url = new URL(script?.src ?? '');
		const librariesParam = url.searchParams.get('libraries');
		const libraryArray = librariesParam?.split(',') ?? [];

		expect(libraryArray).toContain('places');
		expect(libraryArray).toContain('geometry');
		expect(libraryArray).toContain('drawing');
		expect(libraryArray).toContain('marker');

		simulateScriptLoad(script);
		await scriptLoadPromise;
	});
});
