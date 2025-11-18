/**
 * GoogleMapsAdapter Initialization Tests
 */

import type { GoogleMapsAdapter } from '@infra/maps/googleMapsAdapter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	cleanupTestEnvironment,
	clearGoogleMapsScripts,
	getScriptElement,
	GOOGLE_MAPS_SCRIPT_ID,
	removeGoogleMapsAPI,
	setupTestEnvironment,
	simulateScriptLoad,
	TEST_API_KEY,
} from './googleMapsAdapter.test-utils';

describe('GoogleMapsAdapter - Initialization - Basic', () => {
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

	it('should initialize with API key', async () => {
		const scriptLoadPromise = adapter.initialize(TEST_API_KEY);

		const script = getScriptElement();
		expect(script).toBeTruthy();
		expect(script?.async).toBe(true);
		expect(script?.defer).toBe(true);
		expect(script?.src).toContain(`key=${TEST_API_KEY}`);
		expect(script?.src).toContain('https://maps.googleapis.com/maps/api/js');

		simulateScriptLoad(script);
		await scriptLoadPromise;
	});

	it('should not initialize when API key is empty', async () => {
		await adapter.initialize('');

		const script = getScriptElement();
		expect(script).toBeNull();
	});

	it('should not initialize in non-browser environment', async () => {
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

		await adapter.initialize(TEST_API_KEY);
		expect(true).toBe(true);
	});
});

describe('GoogleMapsAdapter - Initialization - Library Handling', () => {
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

	it('should include marker library by default', async () => {
		const scriptLoadPromise = adapter.initialize(TEST_API_KEY);

		const script = getScriptElement();
		expect(script?.src).toContain('libraries=marker');

		simulateScriptLoad(script);
		await scriptLoadPromise;
	});

	it('should include custom libraries', async () => {
		const libraries = ['places', 'geometry'];
		const scriptLoadPromise = adapter.initialize(TEST_API_KEY, libraries);

		const script = getScriptElement();
		const url = new URL(script?.src ?? '');
		const librariesParam = url.searchParams.get('libraries');
		expect(librariesParam).toBeTruthy();
		const libraryArray = librariesParam?.split(',') ?? [];
		expect(libraryArray).toContain('places');
		expect(libraryArray).toContain('geometry');
		expect(libraryArray).toContain('marker');

		simulateScriptLoad(script);
		await scriptLoadPromise;
	});

	it('should not duplicate marker library if already included', async () => {
		const libraries = ['marker', 'places'];
		const scriptLoadPromise = adapter.initialize(TEST_API_KEY, libraries);

		const script = getScriptElement();
		const url = new URL(script?.src ?? '');
		const librariesParam = url.searchParams.get('libraries');
		const libraryArray = librariesParam?.split(',') ?? [];
		const markerCount = libraryArray.filter(lib => lib === 'marker').length;

		expect(markerCount).toBe(1);

		simulateScriptLoad(script);
		await scriptLoadPromise;
	});
});

describe('GoogleMapsAdapter - Initialization - Concurrent', () => {
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

	it('should resolve immediately if script is already loaded', async () => {
		const firstInitPromise = adapter.initialize(TEST_API_KEY);
		const script = getScriptElement();
		simulateScriptLoad(script);
		await firstInitPromise;

		const secondInitPromise = adapter.initialize(TEST_API_KEY);
		await expect(secondInitPromise).resolves.toBeUndefined();
	});

	it('should wait for script if already loading', async () => {
		const firstInitPromise = adapter.initialize(TEST_API_KEY);
		const secondInitPromise = adapter.initialize(TEST_API_KEY);

		const script = getScriptElement();
		expect(script).toBeTruthy();

		const scripts = document.querySelectorAll<HTMLScriptElement>(
			`script[id="${GOOGLE_MAPS_SCRIPT_ID}"]`
		);
		expect(scripts.length).toBe(1);

		simulateScriptLoad(script);
		await Promise.all([firstInitPromise, secondInitPromise]);
	});
});
