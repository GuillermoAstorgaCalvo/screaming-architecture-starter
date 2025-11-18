/**
 * Shared test utilities for GoogleTagManagerAdapter tests
 */

import { GoogleTagManagerAdapter } from '@infra/analytics/googleTagManagerAdapter';

export const TEST_CONTAINER_ID = 'GTM-XXXXXX';
export const CUSTOM_DATALAYER_NAME = 'customDataLayer';
export const TEST_USER_EMAIL = 'user@example.com';
export const TEST_USER_NAME = 'John Doe';
export const TEST_PAGE_PATH = '/test-page';
export const TEST_USER_PLAN = 'premium';

// Helper to get dataLayer from window
export function getDataLayer(win: Window & Record<string, unknown>, name = 'dataLayer'): unknown[] {
	return (win[name] as unknown[]) ?? [];
}

// Helper to clear dataLayer
export function clearDataLayer(win: Window & Record<string, unknown>, name = 'dataLayer'): void {
	if (win[name] && Array.isArray(win[name])) {
		(win[name] as unknown[]).length = 0;
	}
}

// Helper to safely cast window to the expected type
export function getWindowAsRecord(): Window & Record<string, unknown> {
	return globalThis.window as unknown as Window & Record<string, unknown>;
}

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

// Helper to setup test environment with adapter initialization
export function setupTestEnvironment(): {
	adapter: GoogleTagManagerAdapter;
	originalWindow: typeof globalThis.window;
	originalDocument: Document;
} {
	const adapter = new GoogleTagManagerAdapter();
	const originalWindow = globalThis.window;
	const originalDocument = globalThis.document;
	clearDataLayer(getWindowAsRecord());
	// Clear any existing GTM scripts/noscripts
	for (const el of document.head.querySelectorAll('script[id^="gtm-script-"]')) el.remove();
	for (const el of document.body.querySelectorAll('noscript[id^="gtm-noscript-"]')) el.remove();
	return { adapter, originalWindow, originalDocument };
}

// Helper to setup test environment with initialized adapter
export function setupInitializedAdapter(): {
	adapter: GoogleTagManagerAdapter;
	originalWindow: typeof globalThis.window;
	originalDocument: Document;
} {
	const { adapter, originalWindow, originalDocument } = setupTestEnvironment();
	adapter.initialize({ containerId: TEST_CONTAINER_ID });
	// Clear initialization events
	clearDataLayer(getWindowAsRecord());
	return { adapter, originalWindow, originalDocument };
}
