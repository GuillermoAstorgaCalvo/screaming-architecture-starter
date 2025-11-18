import { CookieStorageAdapter } from '@infra/storage/cookieStorageAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Test constants
const TEST_KEY = 'test-key';
const TEST_VALUE = 'test-value';
const TEST_COOKIE_STRING = `${TEST_KEY}=${TEST_VALUE}`;
const EXPIRED_COOKIE_DATE = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
const MULTI_COOKIE_STRING = 'key1=value1; key2=value2; key3=value3';

// Helper functions
const setCookieString = (cookies: string): void => {
	Object.defineProperty(globalThis.document, 'cookie', {
		value: cookies,
		writable: true,
		configurable: true,
	});
};

const getCookieString = (): string => {
	return globalThis.document.cookie;
};

const createErrorCookieProperty = (errorMessage = 'Security error') => {
	return {
		get: () => {
			throw new Error(errorMessage);
		},
		configurable: true,
	};
};

const createErrorCookiePropertyWithSetter = (errorMessage = 'Security error') => {
	return {
		set: () => {
			throw new Error(errorMessage);
		},
		get: () => '',
		configurable: true,
	};
};

const setupTestEnvironment = () => {
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

describe('CookieStorageAdapter - SSR Safety', () => {
	describe('SSR Safety', () => {
		it('should return null for getItem when document is undefined', () => {
			// @ts-expect-error - Intentionally removing document for SSR test
			delete globalThis.document;
			const ssrAdapter = new CookieStorageAdapter();

			expect(ssrAdapter.getItem('key')).toBeNull();
		});

		it('should return false for setItem when document is undefined', () => {
			// @ts-expect-error - Intentionally removing document for SSR test
			delete globalThis.document;
			const ssrAdapter = new CookieStorageAdapter();

			expect(ssrAdapter.setItem('key', 'value')).toBe(false);
		});

		it('should return false for removeItem when document is undefined', () => {
			// @ts-expect-error - Intentionally removing document for SSR test
			delete globalThis.document;
			const ssrAdapter = new CookieStorageAdapter();

			expect(ssrAdapter.removeItem('key')).toBe(false);
		});

		it('should return false for clear when document is undefined', () => {
			// @ts-expect-error - Intentionally removing document for SSR test
			delete globalThis.document;
			const ssrAdapter = new CookieStorageAdapter();

			expect(ssrAdapter.clear()).toBe(false);
		});

		it('should return 0 for getLength when document is undefined', () => {
			// @ts-expect-error - Intentionally removing document for SSR test
			delete globalThis.document;
			const ssrAdapter = new CookieStorageAdapter();

			expect(ssrAdapter.getLength()).toBe(0);
		});

		it('should return null for key when document is undefined', () => {
			// @ts-expect-error - Intentionally removing document for SSR test
			delete globalThis.document;
			const ssrAdapter = new CookieStorageAdapter();

			expect(ssrAdapter.key(0)).toBeNull();
		});
	});
});

describe('CookieStorageAdapter - getItem', () => {
	let adapter: CookieStorageAdapter;
	let cleanup: () => void;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		const { adapter: a, cleanup: c, consoleWarnSpy: spy } = setupTestEnvironment();
		adapter = a;
		cleanup = c;
		consoleWarnSpy = spy;
	});

	afterEach(() => {
		cleanup();
	});

	it('should return null for non-existent key', () => {
		setCookieString('');
		expect(adapter.getItem('non-existent')).toBeNull();
	});

	it('should return stored value', () => {
		setCookieString(`${TEST_KEY}=${TEST_VALUE}`);
		expect(adapter.getItem(TEST_KEY)).toBe(TEST_VALUE);
	});

	it('should decode URL-encoded values', () => {
		setCookieString('test-key=value%20with%20spaces');
		expect(adapter.getItem('test-key')).toBe('value with spaces');
	});

	it('should return null when document.cookie throws error', () => {
		// Create adapter first when document.cookie is normal
		const errorAdapter = new CookieStorageAdapter();
		// Then replace with error property that throws on access
		Object.defineProperty(globalThis.document, 'cookie', createErrorCookieProperty());

		expect(errorAdapter.getItem('key')).toBeNull();
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Failed to get cookie'),
			expect.objectContaining({ error: expect.any(String) })
		);
	});
});

describe('CookieStorageAdapter - setItem', () => {
	let adapter: CookieStorageAdapter;
	let cleanup: () => void;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		const { adapter: a, cleanup: c, consoleWarnSpy: spy } = setupTestEnvironment();
		adapter = a;
		cleanup = c;
		consoleWarnSpy = spy;
	});

	afterEach(() => {
		cleanup();
	});

	it('should store value and return true', () => {
		const result = adapter.setItem(TEST_KEY, TEST_VALUE);
		expect(result).toBe(true);
		const cookieString = getCookieString();
		expect(cookieString).toContain(TEST_COOKIE_STRING);
	});

	it('should URL-encode value', () => {
		adapter.setItem('test-key', 'value with spaces');
		const cookieString = getCookieString();
		expect(cookieString).toContain('test-key=value%20with%20spaces');
	});

	it('should include default expiration', () => {
		adapter.setItem(TEST_KEY, TEST_VALUE);
		const cookieString = getCookieString();
		expect(cookieString).toContain('expires=');
	});

	it('should include default path', () => {
		adapter.setItem(TEST_KEY, TEST_VALUE);
		const cookieString = getCookieString();
		expect(cookieString).toContain('path=/');
	});

	it('should return false when document.cookie assignment throws error', () => {
		Object.defineProperty(globalThis.document, 'cookie', createErrorCookiePropertyWithSetter());

		const errorAdapter = new CookieStorageAdapter();
		expect(errorAdapter.setItem('key', 'value')).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Failed to set cookie'),
			expect.objectContaining({ error: expect.any(String) })
		);
	});
});

describe('CookieStorageAdapter - setItemWithOptions', () => {
	let adapter: CookieStorageAdapter;
	let cleanup: () => void;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		const { adapter: a, cleanup: c, consoleWarnSpy: spy } = setupTestEnvironment();
		adapter = a;
		cleanup = c;
		consoleWarnSpy = spy;
	});

	afterEach(() => {
		cleanup();
	});

	it('should store value with custom options', () => {
		const result = adapter.setItemWithOptions(TEST_KEY, TEST_VALUE, {
			path: '/custom',
			domain: 'example.com',
			sameSite: 'Strict',
			secure: true,
			expiresDays: 30,
		});

		expect(result).toBe(true);
		const cookieString = getCookieString();
		expect(cookieString).toContain(TEST_COOKIE_STRING);
		expect(cookieString).toContain('path=/custom');
		expect(cookieString).toContain('domain=example.com');
		expect(cookieString).toContain('sameSite=Strict');
		expect(cookieString).toContain('secure');
	});

	it('should handle empty options object', () => {
		const result = adapter.setItemWithOptions(TEST_KEY, TEST_VALUE, {});
		expect(result).toBe(true);
		const cookieString = getCookieString();
		expect(cookieString).toContain(TEST_COOKIE_STRING);
	});

	it('should handle undefined options', () => {
		const result = adapter.setItemWithOptions(TEST_KEY, TEST_VALUE);
		expect(result).toBe(true);
		const cookieString = getCookieString();
		expect(cookieString).toContain(TEST_COOKIE_STRING);
	});

	it('should delete cookie when expiresDays is negative', () => {
		// First set a cookie
		setCookieString(TEST_COOKIE_STRING);
		expect(adapter.getItem(TEST_KEY)).toBe(TEST_VALUE);

		// Delete it
		const result = adapter.setItemWithOptions('test-key', '', { expiresDays: -1 });
		expect(result).toBe(true);
		const cookieString = getCookieString();
		expect(cookieString).toContain(EXPIRED_COOKIE_DATE);
	});

	it('should return false when document.cookie assignment throws error', () => {
		Object.defineProperty(globalThis.document, 'cookie', createErrorCookiePropertyWithSetter());

		const errorAdapter = new CookieStorageAdapter();
		expect(errorAdapter.setItemWithOptions('key', 'value', {})).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Failed to set cookie'),
			expect.objectContaining({ error: expect.any(String) })
		);
	});
});

describe('CookieStorageAdapter - removeItem', () => {
	let adapter: CookieStorageAdapter;
	let cleanup: () => void;

	beforeEach(() => {
		const { adapter: a, cleanup: c } = setupTestEnvironment();
		adapter = a;
		cleanup = c;
	});

	afterEach(() => {
		cleanup();
	});

	it('should remove cookie by setting expiration in past', () => {
		// First set a cookie
		setCookieString(TEST_COOKIE_STRING);
		expect(adapter.getItem(TEST_KEY)).toBe(TEST_VALUE);

		// Remove it
		const result = adapter.removeItem('test-key');
		expect(result).toBe(true);
		const cookieString = getCookieString();
		expect(cookieString).toContain('test-key=');
		expect(cookieString).toContain(EXPIRED_COOKIE_DATE);
	});

	it('should return true when removing non-existent cookie', () => {
		setCookieString('');
		const result = adapter.removeItem('non-existent');
		expect(result).toBe(true);
	});

	it('should return false when document is unavailable', () => {
		// @ts-expect-error - Intentionally removing document for SSR test
		delete globalThis.document;
		const ssrAdapter = new CookieStorageAdapter();

		expect(ssrAdapter.removeItem('key')).toBe(false);
	});
});

describe('CookieStorageAdapter - clear', () => {
	let adapter: CookieStorageAdapter;
	let cleanup: () => void;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		const { adapter: a, cleanup: c, consoleWarnSpy: spy } = setupTestEnvironment();
		adapter = a;
		cleanup = c;
		consoleWarnSpy = spy;
	});

	afterEach(() => {
		cleanup();
	});

	it('should clear all cookies', () => {
		setCookieString(MULTI_COOKIE_STRING);
		expect(adapter.getLength()).toBe(3);

		const result = adapter.clear();
		expect(result).toBe(true);
		// All cookies should have expiration set to past
		const cookieString = getCookieString();
		expect(cookieString).toContain(EXPIRED_COOKIE_DATE);
	});

	it('should return true when clearing empty storage', () => {
		setCookieString('');
		const result = adapter.clear();
		expect(result).toBe(true);
	});

	it('should return false when document.cookie throws error during parsing', () => {
		// Create adapter first when document.cookie is normal
		const errorAdapter = new CookieStorageAdapter();
		// Then replace with error property that throws on access
		Object.defineProperty(globalThis.document, 'cookie', createErrorCookieProperty());

		expect(errorAdapter.clear()).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Failed to clear cookies'),
			expect.objectContaining({ error: expect.any(String) })
		);
	});

	it('should return false when removeItem fails for a cookie', () => {
		setCookieString('key1=value1; key2=value2');
		// Mock removeItem to fail for one cookie
		const originalRemoveItem = adapter.removeItem.bind(adapter);
		vi.spyOn(adapter, 'removeItem').mockImplementation((key: string) => {
			if (key === 'key1') {
				return false;
			}
			return originalRemoveItem(key);
		});

		const result = adapter.clear();
		expect(result).toBe(false);
	});
});

describe('CookieStorageAdapter - Utility Operations', () => {
	let adapter: CookieStorageAdapter;
	let cleanup: () => void;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		const { adapter: a, cleanup: c, consoleWarnSpy: spy } = setupTestEnvironment();
		adapter = a;
		cleanup = c;
		consoleWarnSpy = spy;
	});

	afterEach(() => {
		cleanup();
	});

	describe('getLength', () => {
		it('should return 0 for empty storage', () => {
			setCookieString('');
			expect(adapter.getLength()).toBe(0);
		});

		it('should return correct count', () => {
			setCookieString(MULTI_COOKIE_STRING);
			expect(adapter.getLength()).toBe(3);
		});

		it('should return 0 when document.cookie throws error', () => {
			// Create adapter first when document.cookie is normal
			const errorAdapter = new CookieStorageAdapter();
			// Then replace with error property that throws on access
			Object.defineProperty(globalThis.document, 'cookie', createErrorCookieProperty());

			expect(errorAdapter.getLength()).toBe(0);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to get cookie count'),
				expect.objectContaining({ error: expect.any(String) })
			);
		});
	});

	describe('key', () => {
		it('should return null for invalid index', () => {
			setCookieString('');
			expect(adapter.key(0)).toBeNull();
			expect(adapter.key(-1)).toBeNull();
		});

		it('should return key at given index', () => {
			setCookieString(MULTI_COOKIE_STRING);
			const keys = [adapter.key(0), adapter.key(1), adapter.key(2)];
			expect(keys).toContain('key1');
			expect(keys).toContain('key2');
			expect(keys).toContain('key3');
		});

		it('should return null for index beyond length', () => {
			setCookieString('key1=value1');
			expect(adapter.key(1)).toBeNull();
		});

		it('should return null when document.cookie throws error', () => {
			// Create adapter first when document.cookie is normal
			const errorAdapter = new CookieStorageAdapter();
			// Then replace with error property that throws on access
			Object.defineProperty(globalThis.document, 'cookie', createErrorCookieProperty());

			expect(errorAdapter.key(0)).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to get cookie key'),
				expect.objectContaining({ error: expect.any(String) })
			);
		});
	});
});

describe('CookieStorageAdapter - Integration', () => {
	let adapter: CookieStorageAdapter;
	let cleanup: () => void;

	beforeEach(() => {
		const { adapter: a, cleanup: c } = setupTestEnvironment();
		adapter = a;
		cleanup = c;
	});

	afterEach(() => {
		cleanup();
	});

	describe('Integration', () => {
		it('should handle full storage lifecycle', () => {
			// Set multiple items
			adapter.setItem('key1', 'value1');
			adapter.setItem('key2', 'value2');
			adapter.setItem('key3', 'value3');

			// Verify all items (need to set cookie string to simulate browser behavior)
			setCookieString(MULTI_COOKIE_STRING);
			expect(adapter.getItem('key1')).toBe('value1');
			expect(adapter.getItem('key2')).toBe('value2');
			expect(adapter.getItem('key3')).toBe('value3');
			expect(adapter.getLength()).toBe(3);

			// Remove one item
			adapter.removeItem('key2');
			setCookieString('key1=value1; key3=value3');
			expect(adapter.getItem('key2')).toBeNull();
			expect(adapter.getLength()).toBe(2);

			// Update one item
			adapter.setItem('key1', 'updated-value');
			setCookieString('key1=updated-value; key3=value3');
			expect(adapter.getItem('key1')).toBe('updated-value');
			expect(adapter.getLength()).toBe(2);

			// Clear all
			adapter.clear();
			setCookieString('');
			expect(adapter.getLength()).toBe(0);
			expect(adapter.getItem('key1')).toBeNull();
		});

		it('should handle special characters in values', () => {
			adapter.setItem('special-key', 'value with spaces & symbols = test');
			const cookieString = getCookieString();
			expect(cookieString).toContain('special-key=');
			// Value should be URL-encoded
			expect(cookieString).toContain('%20'); // space
			expect(cookieString).toContain('%26'); // &
		});

		it('should handle cookies with options', () => {
			adapter.setItemWithOptions(TEST_KEY, TEST_VALUE, {
				path: '/api',
				domain: 'example.com',
				sameSite: 'None',
				secure: true,
				expiresDays: 7,
			});

			const cookieString = getCookieString();
			expect(cookieString).toContain(TEST_COOKIE_STRING);
			expect(cookieString).toContain('path=/api');
			expect(cookieString).toContain('domain=example.com');
			expect(cookieString).toContain('sameSite=None');
			expect(cookieString).toContain('secure');
		});
	});
});
