/**
 * Shared test utilities for GoogleMapsAdapter tests
 */

import { GoogleMapsAdapter } from '@infra/maps/googleMapsAdapter';
import { vi } from 'vitest';

export const TEST_API_KEY = 'test-api-key-12345';
export const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';

// Helper to restore original window/document
export function restoreGlobals(
	originalWindow: typeof globalThis.window,
	originalDocument: Document
): void {
	Object.defineProperty(globalThis, 'window', {
		writable: true,
		value: originalWindow,
		configurable: true,
	});
	Object.defineProperty(globalThis, 'document', {
		writable: true,
		value: originalDocument,
		configurable: true,
	});
}

// Helper to clear existing Google Maps scripts
export function clearGoogleMapsScripts(): void {
	const existingScript = document.querySelector<HTMLScriptElement>(
		`script[id="${GOOGLE_MAPS_SCRIPT_ID}"]`
	);
	if (existingScript) {
		existingScript.remove();
	}
}

// Helper to mock Google Maps API on window
export function mockGoogleMapsAPI(window: Window & Record<string, unknown>): void {
	(window as unknown as { google?: { maps: unknown } }).google = {
		maps: {} as unknown,
	};
}

// Helper to remove Google Maps API from window
export function removeGoogleMapsAPI(window: Window & Record<string, unknown>): void {
	delete (window as unknown as { google?: { maps: unknown } }).google;
}

// Helper to get script element
export function getScriptElement(): HTMLScriptElement | null {
	return document.querySelector<HTMLScriptElement>(`script[id="${GOOGLE_MAPS_SCRIPT_ID}"]`);
}

// Helper to simulate script load
export function simulateScriptLoad(script: HTMLScriptElement | null): void {
	if (script) {
		mockGoogleMapsAPI(globalThis.window as unknown as Window & Record<string, unknown>);
		script.dispatchEvent(new Event('load'));
	}
}

// Helper to setup test environment
export function setupTestEnvironment() {
	return {
		adapter: new GoogleMapsAdapter(),
		originalWindow: globalThis.window,
		originalDocument: globalThis.document,
	};
}

// Helper to cleanup test environment
export function cleanupTestEnvironment(
	originalWindow: typeof globalThis.window,
	originalDocument: Document
): void {
	restoreGlobals(originalWindow, originalDocument);
	vi.clearAllMocks();
	clearGoogleMapsScripts();
}

// Type for accessing private adapter methods in tests
export interface AdapterWithPrivate {
	loadScript: () => Promise<void>;
	createScriptElement: () => HTMLScriptElement;
	getWindow: () => unknown;
	getGoogleMaps: () => unknown;
	apiKey: string | null;
	libraries: string[];
}

// Helper to setup non-browser environment for testing
export function setupNonBrowserEnvironment(): void {
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
}

// Helper to restore browser environment after testing
export function restoreBrowserEnvironment(
	originalWindow: typeof globalThis.window,
	originalDocument: Document
): void {
	restoreGlobals(originalWindow, originalDocument);
}
