// Vitest setup (jsdom)
import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';

import { i18nInitPromise } from '@core/i18n/i18n';
import { handlers } from '@tests/mocks/handlers';
import { setupServer } from 'msw/node';
import { expect, vi } from 'vitest';
import * as matchers from 'vitest-axe/matchers';

// Extend Vitest matchers with axe assertions
expect.extend(matchers);

// Suppress i18next backend warning in tests
// This codebase uses a custom resource loading mechanism instead of a standard backend
// Note: This suppression is set up at module level to catch warnings during i18n initialization
const originalWarn = console.warn;
const originalError = console.error;
console.warn = (...args: unknown[]) => {
	if (
		typeof args[0] === 'string' &&
		args[0].includes('i18next::backendConnector: No backend was added via i18next.use')
	) {
		// Suppress this specific warning - expected in our custom setup
		return;
	}
	originalWarn(...args);
};

// Suppress React act() warnings from async effects in useTranslation tests
// These warnings occur because async effects trigger state updates outside React's batching.
// This is expected behavior with async resource loading and is handled correctly by waitFor().
console.error = (...args: unknown[]) => {
	if (
		typeof args[0] === 'string' &&
		args[0].includes('An update to') &&
		args[0].includes('inside a test was not wrapped in act(...)')
	) {
		// Suppress act() warnings from async effects - these are expected with async resource loading
		return;
	}
	originalError(...args);
};

/**
 * Setup MSW server for Node.js environment (Vitest)
 *
 * This server intercepts HTTP requests during tests and returns
 * mocked responses based on the handlers defined in handlers.ts
 *
 * Lifecycle:
 * - beforeAll: Start the server with error handling for unhandled requests
 * - afterEach: Reset handlers to default state (allows test-specific overrides)
 * - afterAll: Close the server
 *
 * Note: Handlers are validated and spread defensively to handle module loading race conditions
 */
function createServer() {
	// Defensive check: ensure handlers is an array
	// This handles module loading race conditions in test environments

	if (!Array.isArray(handlers)) {
		console.warn(
			'Handlers not available or not an array, creating MSW server with empty handlers array'
		);
		return setupServer();
	}
	// If handlers array is empty, still create server with empty array (MSW handles this)
	return setupServer(...handlers);
}

export const server = createServer();

// Initialize i18n before all tests
beforeAll(async () => {
	// Ensure i18n is initialized before tests run
	await i18nInitPromise;
});

// Establish API mocking before all tests
beforeAll(() => {
	server.listen({ onUnhandledRequest: 'error' });
});

// Reset any request handlers that are declared as a part of our tests
// (i.e., for testing one-time error scenarios)
afterEach(() => {
	server.resetHandlers();
});

// Clean up after the tests are finished
afterAll(() => {
	server.close();
});

// Mock HTMLDialogElement.showModal() for Modal component tests
// jsdom doesn't implement showModal() by default
beforeAll(() => {
	HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
		this.setAttribute('open', '');
	});
	HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
		this.removeAttribute('open');
	});
});

// Mock matchMedia for ThemeProvider tests
// jsdom doesn't implement matchMedia by default
Object.defineProperty(globalThis.window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});
