import { CookieStorageAdapter } from '@infra/storage/cookieStorageAdapter';
import { vi } from 'vitest';

// Test constants
export const TEST_KEY = 'test-key';
export const TEST_VALUE = 'test-value';
export const TEST_COOKIE_STRING = `${TEST_KEY}=${TEST_VALUE}`;
export const EXPIRED_COOKIE_DATE = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
export const MULTI_COOKIE_STRING = 'key1=value1; key2=value2; key3=value3';
export const ERROR_MESSAGE_FAILED_TO_SET_COOKIE = 'Failed to set cookie';

// Helper functions
export const setCookieString = (cookies: string): void => {
	Object.defineProperty(globalThis.document, 'cookie', {
		value: cookies,
		writable: true,
		configurable: true,
	});
};

export const getCookieString = (): string => {
	return globalThis.document.cookie;
};

export const createErrorCookieProperty = (errorMessage = 'Security error') => {
	return {
		get: () => {
			throw new Error(errorMessage);
		},
		configurable: true,
	};
};

export const createErrorCookiePropertyWithSetter = (errorMessage = 'Security error') => {
	return {
		set: () => {
			throw new Error(errorMessage);
		},
		get: () => '',
		configurable: true,
	};
};

export const setupTestEnvironment = () => {
	const originalDocument = globalThis.document;
	const originalWindow = globalThis.window;
	const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

	// Mock document.cookie
	Object.defineProperty(globalThis, 'document', {
		value: {
			cookie: '',
		},
		writable: true,
		configurable: true,
	});

	const adapter = new CookieStorageAdapter();

	const cleanup = () => {
		if (originalDocument) {
			globalThis.document = originalDocument;
		}
		if (originalWindow) {
			globalThis.window = originalWindow;
		}
		consoleWarnSpy.mockRestore();
		vi.restoreAllMocks();
	};

	return { adapter, cleanup, consoleWarnSpy };
};
