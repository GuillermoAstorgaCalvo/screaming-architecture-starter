import { LocalStorageAdapter } from '@infra/storage/localStorageAdapter';
import { describe, expect, it, vi } from 'vitest';

export const TEST_KEY = 'key';
export const TEST_VALUE = 'value';
export const TEST_KEY_NON_EXISTENT = 'non-existent';
export const TEST_KEY_1 = 'key1';
export const TEST_KEY_2 = 'key2';
export const TEST_KEY_3 = 'key3';
export const TEST_KEY_TEST = 'test-key';
export const TEST_VALUE_1 = 'value1';
export const TEST_VALUE_2 = 'value2';
export const TEST_VALUE_3 = 'value3';
export const TEST_VALUE_TEST = 'test-value';
export const TEST_VALUE_OLD = 'old-value';
export const TEST_VALUE_NEW = 'new-value';
export const TEST_VALUE_UPDATED = 'updated-value';
export const SECURITY_ERROR = 'Security error';
export const QUOTA_EXCEEDED_ERROR = 'QuotaExceededError';
export const TEST_DESCRIPTION_ERROR = 'should return false when localStorage throws error';

export function createMockLocalStorageWithError(
	methodName: 'getItem' | 'setItem' | 'removeItem' | 'clear' | 'key',
	error: Error
) {
	const originalLocalStorage = globalThis.window.localStorage;
	const AVAILABILITY_TEST_KEY = '__localStorage_test__';

	// Create a mock that preserves all methods, but the specified method throws
	// For setItem/removeItem, we need to allow the availability check to pass
	const mockLocalStorage = {
		getItem:
			methodName === 'getItem'
				? vi.fn(() => {
						throw error;
					})
				: originalLocalStorage.getItem.bind(originalLocalStorage),
		setItem:
			methodName === 'setItem'
				? vi.fn((key: string, value?: string) => {
						// Allow availability check to pass
						if (key === AVAILABILITY_TEST_KEY) {
							originalLocalStorage.setItem(key, value ?? 'test');
							return;
						}
						throw error;
					})
				: originalLocalStorage.setItem.bind(originalLocalStorage),
		removeItem:
			methodName === 'removeItem'
				? vi.fn((key: string) => {
						// Allow availability check to pass
						if (key === AVAILABILITY_TEST_KEY) {
							originalLocalStorage.removeItem(key);
							return;
						}
						throw error;
					})
				: originalLocalStorage.removeItem.bind(originalLocalStorage),
		clear:
			methodName === 'clear'
				? vi.fn(() => {
						throw error;
					})
				: originalLocalStorage.clear.bind(originalLocalStorage),
		key:
			methodName === 'key'
				? vi.fn(() => {
						throw error;
					})
				: originalLocalStorage.key.bind(originalLocalStorage),
		get length() {
			return originalLocalStorage.length;
		},
	};

	Object.defineProperty(globalThis.window, 'localStorage', {
		value: mockLocalStorage,
		writable: true,
		configurable: true,
	});

	return new LocalStorageAdapter();
}

export function createMockLocalStorageWithLengthError(error: Error) {
	const originalLocalStorage = globalThis.window.localStorage;

	// Create a mock that preserves all methods, but length throws
	const mockLocalStorage = {
		getItem: originalLocalStorage.getItem.bind(originalLocalStorage),
		setItem: originalLocalStorage.setItem.bind(originalLocalStorage),
		removeItem: originalLocalStorage.removeItem.bind(originalLocalStorage),
		clear: originalLocalStorage.clear.bind(originalLocalStorage),
		key: originalLocalStorage.key.bind(originalLocalStorage),
		get length() {
			throw error;
		},
	};

	Object.defineProperty(globalThis.window, 'localStorage', {
		value: mockLocalStorage,
		writable: true,
		configurable: true,
	});

	return new LocalStorageAdapter();
}

export function createSsrAdapter() {
	// @ts-expect-error - Intentionally removing window for SSR test
	delete globalThis.window;
	return new LocalStorageAdapter();
}

export function createDisabledLocalStorageAdapter() {
	const mockLocalStorage = {
		setItem: vi.fn(() => {
			throw new Error(QUOTA_EXCEEDED_ERROR);
		}),
		getItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		length: 0,
		key: vi.fn(),
	};

	Object.defineProperty(globalThis, 'window', {
		value: { localStorage: mockLocalStorage },
		writable: true,
		configurable: true,
	});

	return new LocalStorageAdapter();
}

export function setupTestEnvironment() {
	const originalWindow = globalThis.window;
	const originalLocalStorage = globalThis.window?.localStorage;
	const adapter = new LocalStorageAdapter();

	return { adapter, originalWindow, originalLocalStorage };
}

export function teardownTestEnvironment(
	originalWindow: Window & typeof globalThis,
	originalLocalStorage?: Storage | null
) {
	// Restore original localStorage first if it was stored
	if (originalLocalStorage && globalThis.window) {
		Object.defineProperty(globalThis.window, 'localStorage', {
			value: originalLocalStorage,
			writable: true,
			configurable: true,
		});
	}

	if (originalWindow) {
		globalThis.window = originalWindow;
	}

	if (
		globalThis.window?.localStorage &&
		typeof globalThis.window.localStorage.clear === 'function'
	) {
		try {
			globalThis.window.localStorage.clear();
		} catch {
			// Ignore errors during teardown
		}
	}
	vi.restoreAllMocks();
}

export function describeGetItemTests(getAdapter: () => LocalStorageAdapter) {
	describe('getItem', () => {
		it('should return null for non-existent key', () => {
			expect(getAdapter().getItem(TEST_KEY_NON_EXISTENT)).toBeNull();
		});

		it('should return stored value', () => {
			globalThis.window.localStorage.setItem(TEST_KEY_TEST, TEST_VALUE_TEST);
			expect(getAdapter().getItem(TEST_KEY_TEST)).toBe(TEST_VALUE_TEST);
		});

		it('should return null when localStorage throws error', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const errorAdapter = createMockLocalStorageWithError('getItem', new Error(SECURITY_ERROR));

			expect(errorAdapter.getItem(TEST_KEY)).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to get item from localStorage'),
				expect.objectContaining({ error: expect.any(String) })
			);

			consoleWarnSpy.mockRestore();
		});

		it('should handle non-Error objects thrown by localStorage', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const nonError = { message: 'Custom error object' };
			const errorAdapter = createMockLocalStorageWithError('getItem', nonError as Error);

			expect(errorAdapter.getItem(TEST_KEY)).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to get item from localStorage'),
				expect.objectContaining({ error: expect.any(String) })
			);

			consoleWarnSpy.mockRestore();
		});
	});
}

export function describeSetItemTests(getAdapter: () => LocalStorageAdapter) {
	describe('setItem', () => {
		it('should store value and return true', () => {
			const result = getAdapter().setItem(TEST_KEY_TEST, TEST_VALUE_TEST);
			expect(result).toBe(true);
			expect(globalThis.window.localStorage.getItem(TEST_KEY_TEST)).toBe(TEST_VALUE_TEST);
		});

		it('should overwrite existing value', () => {
			globalThis.window.localStorage.setItem(TEST_KEY_TEST, TEST_VALUE_OLD);
			const result = getAdapter().setItem(TEST_KEY_TEST, TEST_VALUE_NEW);
			expect(result).toBe(true);
			expect(globalThis.window.localStorage.getItem(TEST_KEY_TEST)).toBe(TEST_VALUE_NEW);
		});

		it(TEST_DESCRIPTION_ERROR, () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const errorAdapter = createMockLocalStorageWithError(
				'setItem',
				new Error(QUOTA_EXCEEDED_ERROR)
			);

			expect(errorAdapter.setItem(TEST_KEY, TEST_VALUE)).toBe(false);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to set item in localStorage'),
				expect.objectContaining({ error: expect.any(String) })
			);

			consoleWarnSpy.mockRestore();
		});

		it('should handle non-Error objects thrown by setItem', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const nonError = 'String error';
			const errorAdapter = createMockLocalStorageWithError('setItem', nonError as unknown as Error);

			expect(errorAdapter.setItem(TEST_KEY, TEST_VALUE)).toBe(false);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to set item in localStorage'),
				expect.objectContaining({ error: expect.any(String) })
			);

			consoleWarnSpy.mockRestore();
		});
	});
}

export function describeGetLengthTests(getAdapter: () => LocalStorageAdapter) {
	describe('getLength', () => {
		it('should return 0 for empty storage', () => {
			globalThis.window.localStorage.clear();
			expect(getAdapter().getLength()).toBe(0);
		});

		it('should return correct length', () => {
			globalThis.window.localStorage.clear();
			globalThis.window.localStorage.setItem(TEST_KEY_1, TEST_VALUE_1);
			globalThis.window.localStorage.setItem(TEST_KEY_2, TEST_VALUE_2);
			expect(getAdapter().getLength()).toBe(2);
		});

		it('should return 0 when localStorage throws error', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const errorAdapter = createMockLocalStorageWithLengthError(new Error(SECURITY_ERROR));

			expect(errorAdapter.getLength()).toBe(0);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to get localStorage length'),
				expect.objectContaining({ error: expect.any(String) })
			);

			consoleWarnSpy.mockRestore();
		});

		it('should handle non-Error objects thrown by getLength', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const nonError = { toString: () => 'Custom error' };
			const errorAdapter = createMockLocalStorageWithLengthError(nonError as unknown as Error);

			expect(errorAdapter.getLength()).toBe(0);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to get localStorage length'),
				expect.objectContaining({ error: expect.any(String) })
			);

			consoleWarnSpy.mockRestore();
		});
	});
}

export function describeKeyTests(getAdapter: () => LocalStorageAdapter) {
	describe('key', () => {
		it('should return null for invalid index', () => {
			globalThis.window.localStorage.clear();
			expect(getAdapter().key(0)).toBeNull();
			expect(getAdapter().key(-1)).toBeNull();
		});

		it('should return key at given index', () => {
			globalThis.window.localStorage.clear();
			globalThis.window.localStorage.setItem(TEST_KEY_1, TEST_VALUE_1);
			globalThis.window.localStorage.setItem(TEST_KEY_2, TEST_VALUE_2);
			expect(getAdapter().key(0)).toBe(TEST_KEY_1);
			expect(getAdapter().key(1)).toBe(TEST_KEY_2);
		});

		it('should return null when localStorage throws error', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const errorAdapter = createMockLocalStorageWithError('key', new Error(SECURITY_ERROR));

			expect(errorAdapter.key(0)).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to get key from localStorage'),
				expect.objectContaining({ error: expect.any(String) })
			);

			consoleWarnSpy.mockRestore();
		});

		it('should handle non-Error objects thrown by key', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const nonError = undefined;
			const errorAdapter = createMockLocalStorageWithError('key', nonError as unknown as Error);

			expect(errorAdapter.key(0)).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to get key from localStorage'),
				expect.objectContaining({ error: expect.any(String) })
			);

			consoleWarnSpy.mockRestore();
		});
	});
}
