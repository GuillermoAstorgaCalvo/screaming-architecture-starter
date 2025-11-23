/**
 * GoogleMapsAdapter Error Handling, Callbacks, and Edge Cases Tests
 */

import type { GoogleMapsAdapter } from '@infra/maps/googleMapsAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	type AdapterWithPrivate,
	cleanupTestEnvironment,
	clearGoogleMapsScripts,
	getScriptElement,
	removeGoogleMapsAPI,
	restoreBrowserEnvironment,
	setupNonBrowserEnvironment,
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

interface TestContext {
	adapter: GoogleMapsAdapter;
	originalWindow: typeof globalThis.window;
	originalDocument: Document;
}

function describeLoadScriptEdgeCases(getContext: () => TestContext): void {
	describe('loadScript edge cases', () => {
		it('should return early in loadScript when not in browser environment', async () => {
			// Test line 95: return early when !isBrowserEnvironment()
			const { adapter, originalWindow, originalDocument } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			setupNonBrowserEnvironment();
			adapterWithPrivate.apiKey = TEST_API_KEY;

			await expect(adapterWithPrivate.loadScript()).resolves.toBeUndefined();

			restoreBrowserEnvironment(originalWindow, originalDocument);
		});

		it('should return early in loadScript when API key is null', async () => {
			// Test line 95: return early when !this.apiKey
			const { adapter } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			adapterWithPrivate.apiKey = null;

			await expect(adapterWithPrivate.loadScript()).resolves.toBeUndefined();
		});
	});
}

function describeCreateScriptElementEdgeCases(getContext: () => TestContext): void {
	describe('createScriptElement edge cases', () => {
		it('should throw error in createScriptElement when API key is null', () => {
			// Test line 194: throw error when !this.apiKey in createScriptElement
			const { adapter } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			adapterWithPrivate.apiKey = null;

			expect(() => adapterWithPrivate.createScriptElement()).toThrow(
				'API key is required to create script element'
			);
		});
	});
}

function describeGetWindowEdgeCases(getContext: () => TestContext): void {
	describe('getWindow edge cases', () => {
		it('should return null in getWindow when not in browser environment', () => {
			// Test line 224: return null when !isBrowserEnvironment() in getWindow
			const { adapter, originalWindow, originalDocument } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			setupNonBrowserEnvironment();

			const result = adapterWithPrivate.getWindow();
			expect(result).toBeNull();

			restoreBrowserEnvironment(originalWindow, originalDocument);
		});
	});
}

function describeGetGoogleMapsEdgeCases(getContext: () => TestContext): void {
	describe('getGoogleMaps edge cases - Line 87', () => {
		it('should return null when win exists but win.google is null', () => {
			// Test line 87: return null when win?.google?.maps is falsy due to win.google being null
			// We need to mock isGoogleMapsAvailable to return true to bypass the early return
			// and reach line 87, then test the branch where win.google is null
			const { adapter } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			// Mock isGoogleMapsAvailable to return true to reach line 87
			const isAvailableSpy = vi.spyOn(adapter, 'isGoogleMapsAvailable').mockReturnValue(true);

			// Set window.google to null to test the optional chaining branch
			(globalThis.window as unknown as { google: null }).google = null;

			const result = adapterWithPrivate.getGoogleMaps();
			expect(result).toBeNull();

			// Restore
			isAvailableSpy.mockRestore();
			removeGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);
		});

		it('should return null when win exists but win.google is undefined', () => {
			// Test line 87: return null when win?.google?.maps is falsy due to win.google being undefined
			const { adapter } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			// Mock isGoogleMapsAvailable to return true to reach line 87
			const isAvailableSpy = vi.spyOn(adapter, 'isGoogleMapsAvailable').mockReturnValue(true);

			// Ensure window.google is undefined
			removeGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);

			const result = adapterWithPrivate.getGoogleMaps();
			expect(result).toBeNull();

			// Restore
			isAvailableSpy.mockRestore();
		});

		it('should return null when win.google exists but win.google.maps is null', () => {
			// Test line 87: return null when win?.google?.maps is falsy due to win.google.maps being null
			const { adapter } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			// Mock isGoogleMapsAvailable to return true to reach line 87
			const isAvailableSpy = vi.spyOn(adapter, 'isGoogleMapsAvailable').mockReturnValue(true);

			// Set window.google to exist but maps to be null
			(globalThis.window as unknown as { google?: { maps: null } }).google = {
				maps: null,
			};

			const result = adapterWithPrivate.getGoogleMaps();
			expect(result).toBeNull();

			// Restore
			isAvailableSpy.mockRestore();
			removeGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);
		});

		it('should return null when win.google exists but win.google.maps is undefined', () => {
			// Test line 87: return null when win?.google?.maps is falsy due to win.google.maps being undefined
			const { adapter } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			// Mock isGoogleMapsAvailable to return true to reach line 87
			const isAvailableSpy = vi.spyOn(adapter, 'isGoogleMapsAvailable').mockReturnValue(true);

			// Set window.google to exist but maps to be undefined
			(globalThis.window as unknown as { google?: { maps?: unknown } }).google = {};

			const result = adapterWithPrivate.getGoogleMaps();
			expect(result).toBeNull();

			// Restore
			isAvailableSpy.mockRestore();
			removeGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);
		});

		it('should return null when win is null (edge case)', () => {
			// Test line 87: return null when win is null (shouldn't happen in practice but tests optional chaining)
			const { adapter } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			// Mock isGoogleMapsAvailable to return true to reach line 87
			const isAvailableSpy = vi.spyOn(adapter, 'isGoogleMapsAvailable').mockReturnValue(true);
			// Mock getWindow to return null to test the optional chaining branch
			const getWindowSpy = vi.spyOn(adapterWithPrivate, 'getWindow').mockReturnValue(null);

			const result = adapterWithPrivate.getGoogleMaps();
			expect(result).toBeNull();

			// Restore
			isAvailableSpy.mockRestore();
			getWindowSpy.mockRestore();
		});
	});
}

function describeCreateScriptElementLine201EdgeCases(getContext: () => TestContext): void {
	describe('createScriptElement edge cases - Line 201', () => {
		it('should not set libraries parameter when libraries array is empty', () => {
			// Test line 201: skip if block when libraries.length === 0
			const { adapter } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			adapterWithPrivate.apiKey = TEST_API_KEY;
			adapterWithPrivate.libraries = []; // Set libraries to empty array

			const script = adapterWithPrivate.createScriptElement();
			const url = new URL(script.src);
			const librariesParam = url.searchParams.get('libraries');

			// When libraries.length === 0, the if block is skipped, so libraries param should not be set
			expect(librariesParam).toBeNull();
			// Verify the script src still contains the API key
			expect(script.src).toContain(`key=${TEST_API_KEY}`);
		});

		it('should set libraries parameter when libraries array has items', () => {
			// Test line 201: execute if block when libraries.length > 0
			const { adapter } = getContext();
			const adapterWithPrivate = adapter as unknown as AdapterWithPrivate;

			adapterWithPrivate.apiKey = TEST_API_KEY;
			adapterWithPrivate.libraries = ['places', 'geometry']; // Set libraries to non-empty array

			const script = adapterWithPrivate.createScriptElement();
			const url = new URL(script.src);
			const librariesParam = url.searchParams.get('libraries');

			// When libraries.length > 0, the if block is executed, so libraries param should be set
			expect(librariesParam).toBeTruthy();
			expect(librariesParam).toBe('places,geometry');
			// Verify the script src contains both API key and libraries (URL may encode commas)
			expect(script.src).toContain(`key=${TEST_API_KEY}`);
			expect(script.src).toContain('libraries=');
			// Verify the decoded parameter value
			expect(librariesParam?.split(',')).toContain('places');
			expect(librariesParam?.split(',')).toContain('geometry');
		});
	});
}

describe('GoogleMapsAdapter - Edge Cases - Uncovered Lines', () => {
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

	const getContext = (): TestContext => ({
		adapter,
		originalWindow,
		originalDocument,
	});

	describeLoadScriptEdgeCases(getContext);
	describeCreateScriptElementEdgeCases(getContext);
	describeGetWindowEdgeCases(getContext);
	describeGetGoogleMapsEdgeCases(getContext);
	describeCreateScriptElementLine201EdgeCases(getContext);
});
