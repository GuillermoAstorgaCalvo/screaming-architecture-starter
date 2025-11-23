import { CookieStorageAdapter } from '@infra/storage/cookieStorageAdapter';
import { throwTestError } from '@tests/utils/testUtils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	createErrorCookieProperty,
	createErrorCookiePropertyWithSetter,
	ERROR_MESSAGE_FAILED_TO_SET_COOKIE,
	setCookieString,
	setupTestEnvironment,
} from './cookieStorageAdapter.test-helpers';

describe('CookieStorageAdapter - getItem - Error handling', () => {
	let cleanup: () => void;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		const { cleanup: c, consoleWarnSpy: spy } = setupTestEnvironment();
		cleanup = c;
		consoleWarnSpy = spy;
	});

	afterEach(() => {
		cleanup();
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

	it('should handle non-Error objects thrown by getItem', () => {
		const errorAdapter = new CookieStorageAdapter();
		Object.defineProperty(globalThis.document, 'cookie', {
			get: () => {
				return throwTestError('String error');
			},
			configurable: true,
		});

		expect(errorAdapter.getItem('key')).toBeNull();
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Failed to get cookie'),
			expect.objectContaining({ error: expect.any(String) })
		);
	});
});

describe('CookieStorageAdapter - setItem - Error handling', () => {
	let cleanup: () => void;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		const { cleanup: c, consoleWarnSpy: spy } = setupTestEnvironment();
		cleanup = c;
		consoleWarnSpy = spy;
	});

	afterEach(() => {
		cleanup();
	});

	it('should return false when document.cookie assignment throws error', () => {
		Object.defineProperty(globalThis.document, 'cookie', createErrorCookiePropertyWithSetter());

		const errorAdapter = new CookieStorageAdapter();
		expect(errorAdapter.setItem('key', 'value')).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining(ERROR_MESSAGE_FAILED_TO_SET_COOKIE),
			expect.objectContaining({ error: expect.any(String) })
		);
	});

	it('should handle non-Error objects thrown by setItem', () => {
		Object.defineProperty(globalThis.document, 'cookie', {
			set: () => {
				throwTestError({ message: 'Custom error object' });
			},
			get: () => '',
			configurable: true,
		});

		const errorAdapter = new CookieStorageAdapter();
		expect(errorAdapter.setItem('key', 'value')).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining(ERROR_MESSAGE_FAILED_TO_SET_COOKIE),
			expect.objectContaining({ error: expect.any(String) })
		);
	});
});

describe('CookieStorageAdapter - setItemWithOptions - Error handling', () => {
	let cleanup: () => void;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		const { cleanup: c, consoleWarnSpy: spy } = setupTestEnvironment();
		cleanup = c;
		consoleWarnSpy = spy;
	});

	afterEach(() => {
		cleanup();
	});

	it('should return false when document.cookie assignment throws error', () => {
		Object.defineProperty(globalThis.document, 'cookie', createErrorCookiePropertyWithSetter());

		const errorAdapter = new CookieStorageAdapter();
		expect(errorAdapter.setItemWithOptions('key', 'value', {})).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining(ERROR_MESSAGE_FAILED_TO_SET_COOKIE),
			expect.objectContaining({ error: expect.any(String) })
		);
	});

	it('should handle non-Error objects thrown by setItemWithOptions', () => {
		Object.defineProperty(globalThis.document, 'cookie', {
			set: () => {
				throwTestError(null);
			},
			get: () => '',
			configurable: true,
		});

		const errorAdapter = new CookieStorageAdapter();
		expect(errorAdapter.setItemWithOptions('key', 'value', {})).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining(ERROR_MESSAGE_FAILED_TO_SET_COOKIE),
			expect.objectContaining({ error: expect.any(String) })
		);
	});
});

describe('CookieStorageAdapter - clear - Error handling', () => {
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

	it('should handle non-Error objects thrown by clear', () => {
		const errorAdapter = new CookieStorageAdapter();
		Object.defineProperty(globalThis.document, 'cookie', {
			get: () => {
				return throwTestError(123);
			},
			configurable: true,
		});

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

describe('CookieStorageAdapter - getLength - Error handling', () => {
	let cleanup: () => void;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		const { cleanup: c, consoleWarnSpy: spy } = setupTestEnvironment();
		cleanup = c;
		consoleWarnSpy = spy;
	});

	afterEach(() => {
		cleanup();
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

	it('should handle non-Error objects thrown by getLength', () => {
		const errorAdapter = new CookieStorageAdapter();
		Object.defineProperty(globalThis.document, 'cookie', {
			get: () => {
				return throwTestError({ toString: () => 'Custom error' });
			},
			configurable: true,
		});

		expect(errorAdapter.getLength()).toBe(0);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Failed to get cookie count'),
			expect.objectContaining({ error: expect.any(String) })
		);
	});
});

describe('CookieStorageAdapter - key - Error handling', () => {
	let cleanup: () => void;
	let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		const { cleanup: c, consoleWarnSpy: spy } = setupTestEnvironment();
		cleanup = c;
		consoleWarnSpy = spy;
	});

	afterEach(() => {
		cleanup();
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

	it('should handle non-Error objects thrown by key', () => {
		const errorAdapter = new CookieStorageAdapter();
		Object.defineProperty(globalThis.document, 'cookie', {
			get: () => {
				return throwTestError('String error');
			},
			configurable: true,
		});

		expect(errorAdapter.key(0)).toBeNull();
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Failed to get cookie key'),
			expect.objectContaining({ error: expect.any(String) })
		);
	});
});
