import { CookieStorageAdapter } from '@infra/storage/cookieStorageAdapter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	EXPIRED_COOKIE_DATE,
	MULTI_COOKIE_STRING,
	setCookieString,
	setupTestEnvironment,
	TEST_COOKIE_STRING,
	TEST_KEY,
	TEST_VALUE,
} from './cookieStorageAdapter.test-helpers';

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

	beforeEach(() => {
		const { adapter: a, cleanup: c } = setupTestEnvironment();
		adapter = a;
		cleanup = c;
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
});

describe('CookieStorageAdapter - setItem', () => {
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

	it('should store value and return true', () => {
		const result = adapter.setItem(TEST_KEY, TEST_VALUE);
		expect(result).toBe(true);
		const cookieString = globalThis.document.cookie;
		expect(cookieString).toContain(TEST_COOKIE_STRING);
	});

	it('should URL-encode value', () => {
		adapter.setItem('test-key', 'value with spaces');
		const cookieString = globalThis.document.cookie;
		expect(cookieString).toContain('test-key=value%20with%20spaces');
	});

	it('should include default expiration', () => {
		adapter.setItem(TEST_KEY, TEST_VALUE);
		const cookieString = globalThis.document.cookie;
		expect(cookieString).toContain('expires=');
	});

	it('should include default path', () => {
		adapter.setItem(TEST_KEY, TEST_VALUE);
		const cookieString = globalThis.document.cookie;
		expect(cookieString).toContain('path=/');
	});
});

describe('CookieStorageAdapter - setItemWithOptions - Basic functionality', () => {
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

	it('should store value with custom options', () => {
		const result = adapter.setItemWithOptions(TEST_KEY, TEST_VALUE, {
			path: '/custom',
			domain: 'example.com',
			sameSite: 'Strict',
			secure: true,
			expiresDays: 30,
		});

		expect(result).toBe(true);
		const cookieString = globalThis.document.cookie;
		expect(cookieString).toContain(TEST_COOKIE_STRING);
		expect(cookieString).toContain('path=/custom');
		expect(cookieString).toContain('domain=example.com');
		expect(cookieString).toContain('sameSite=Strict');
		expect(cookieString).toContain('secure');
	});

	it('should handle empty options object', () => {
		const result = adapter.setItemWithOptions(TEST_KEY, TEST_VALUE, {});
		expect(result).toBe(true);
		const cookieString = globalThis.document.cookie;
		expect(cookieString).toContain(TEST_COOKIE_STRING);
	});

	it('should handle undefined options', () => {
		const result = adapter.setItemWithOptions(TEST_KEY, TEST_VALUE);
		expect(result).toBe(true);
		const cookieString = globalThis.document.cookie;
		expect(cookieString).toContain(TEST_COOKIE_STRING);
	});

	it('should delete cookie when expiresDays is negative', () => {
		// First set a cookie
		setCookieString(TEST_COOKIE_STRING);
		expect(adapter.getItem(TEST_KEY)).toBe(TEST_VALUE);

		// Delete it
		const result = adapter.setItemWithOptions('test-key', '', { expiresDays: -1 });
		expect(result).toBe(true);
		const cookieString = globalThis.document.cookie;
		expect(cookieString).toContain(EXPIRED_COOKIE_DATE);
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
		const cookieString = globalThis.document.cookie;
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

describe('CookieStorageAdapter - clear - Basic functionality', () => {
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

	it('should clear all cookies', () => {
		setCookieString(MULTI_COOKIE_STRING);
		expect(adapter.getLength()).toBe(3);

		const result = adapter.clear();
		expect(result).toBe(true);
		// All cookies should have expiration set to past
		const cookieString = globalThis.document.cookie;
		expect(cookieString).toContain(EXPIRED_COOKIE_DATE);
	});

	it('should return true when clearing empty storage', () => {
		setCookieString('');
		const result = adapter.clear();
		expect(result).toBe(true);
	});
});

describe('CookieStorageAdapter - getLength - Basic functionality', () => {
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

	it('should return 0 for empty storage', () => {
		setCookieString('');
		expect(adapter.getLength()).toBe(0);
	});

	it('should return correct count', () => {
		setCookieString(MULTI_COOKIE_STRING);
		expect(adapter.getLength()).toBe(3);
	});
});

describe('CookieStorageAdapter - key - Basic functionality', () => {
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
			const cookieString = globalThis.document.cookie;
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

			const cookieString = globalThis.document.cookie;
			expect(cookieString).toContain(TEST_COOKIE_STRING);
			expect(cookieString).toContain('path=/api');
			expect(cookieString).toContain('domain=example.com');
			expect(cookieString).toContain('sameSite=None');
			expect(cookieString).toContain('secure');
		});
	});
});
