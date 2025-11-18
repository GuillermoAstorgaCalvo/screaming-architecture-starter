import { LocalStorageAdapter } from '@infra/storage/localStorageAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TEST_KEY = 'key';
const TEST_VALUE = 'value';
const TEST_KEY_NON_EXISTENT = 'non-existent';
const TEST_KEY_1 = 'key1';
const TEST_KEY_2 = 'key2';
const TEST_KEY_3 = 'key3';
const TEST_KEY_TEST = 'test-key';
const TEST_VALUE_1 = 'value1';
const TEST_VALUE_2 = 'value2';
const TEST_VALUE_3 = 'value3';
const TEST_VALUE_TEST = 'test-value';
const TEST_VALUE_OLD = 'old-value';
const TEST_VALUE_NEW = 'new-value';
const TEST_VALUE_UPDATED = 'updated-value';
const SECURITY_ERROR = 'Security error';
const QUOTA_EXCEEDED_ERROR = 'QuotaExceededError';
const TEST_DESCRIPTION_ERROR = 'should return false when localStorage throws error';

function createMockLocalStorageWithError(
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

function createMockLocalStorageWithLengthError(error: Error) {
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

function createSsrAdapter() {
	// @ts-expect-error - Intentionally removing window for SSR test
	delete globalThis.window;
	return new LocalStorageAdapter();
}

function createDisabledLocalStorageAdapter() {
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

function setupTestEnvironment() {
	const originalWindow = globalThis.window;
	const originalLocalStorage = globalThis.window?.localStorage;
	const adapter = new LocalStorageAdapter();

	return { adapter, originalWindow, originalLocalStorage };
}

function teardownTestEnvironment(
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

function describeGetItemTests(getAdapter: () => LocalStorageAdapter) {
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
	});
}

function describeSetItemTests(getAdapter: () => LocalStorageAdapter) {
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
	});
}

function describeGetLengthTests(getAdapter: () => LocalStorageAdapter) {
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
	});
}

function describeKeyTests(getAdapter: () => LocalStorageAdapter) {
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
	});
}

describe('LocalStorageAdapter - SSR Safety', () => {
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalWindow = globalThis.window;
	});

	afterEach(() => {
		teardownTestEnvironment(originalWindow);
	});

	describe('when window is undefined', () => {
		it('should return null for getItem', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.getItem(TEST_KEY)).toBeNull();
		});

		it('should return false for setItem', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.setItem(TEST_KEY, TEST_VALUE)).toBe(false);
		});

		it('should return false for removeItem', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.removeItem(TEST_KEY)).toBe(false);
		});

		it('should return false for clear', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.clear()).toBe(false);
		});

		it('should return 0 for getLength', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.getLength()).toBe(0);
		});

		it('should return null for key', () => {
			const ssrAdapter = createSsrAdapter();
			expect(ssrAdapter.key(0)).toBeNull();
		});
	});

	describe('when localStorage is unavailable', () => {
		it('should handle localStorage being null', () => {
			// Mock window without localStorage
			Object.defineProperty(globalThis, 'window', {
				value: {},
				writable: true,
				configurable: true,
			});
			const noStorageAdapter = new LocalStorageAdapter();

			expect(noStorageAdapter.getItem(TEST_KEY)).toBeNull();
			expect(noStorageAdapter.setItem(TEST_KEY, TEST_VALUE)).toBe(false);
		});
	});

	describe('when localStorage is disabled', () => {
		it('should handle localStorage being disabled (private browsing)', () => {
			const disabledAdapter = createDisabledLocalStorageAdapter();
			expect(disabledAdapter.getItem(TEST_KEY)).toBeNull();
			expect(disabledAdapter.setItem(TEST_KEY, TEST_VALUE)).toBe(false);
		});
	});
});

describe('LocalStorageAdapter - Core Methods', () => {
	let adapter: LocalStorageAdapter;
	let originalWindow: Window & typeof globalThis;
	let originalLocalStorage: Storage | null | undefined;

	beforeEach(() => {
		const {
			adapter: setupAdapter,
			originalWindow: setupOriginalWindow,
			originalLocalStorage: setupOriginalLocalStorage,
		} = setupTestEnvironment();
		adapter = setupAdapter;
		originalWindow = setupOriginalWindow;
		originalLocalStorage = setupOriginalLocalStorage;
	});

	afterEach(() => {
		teardownTestEnvironment(originalWindow, originalLocalStorage);
	});

	describeGetItemTests(() => adapter);
	describeSetItemTests(() => adapter);
});

describe('LocalStorageAdapter - Remove Method', () => {
	let adapter: LocalStorageAdapter;
	let originalWindow: Window & typeof globalThis;
	let originalLocalStorage: Storage | null | undefined;

	beforeEach(() => {
		const {
			adapter: setupAdapter,
			originalWindow: setupOriginalWindow,
			originalLocalStorage: setupOriginalLocalStorage,
		} = setupTestEnvironment();
		adapter = setupAdapter;
		originalWindow = setupOriginalWindow;
		originalLocalStorage = setupOriginalLocalStorage;
	});

	afterEach(() => {
		teardownTestEnvironment(originalWindow, originalLocalStorage);
	});

	describe('removeItem', () => {
		it('should remove item and return true', () => {
			globalThis.window.localStorage.setItem(TEST_KEY_TEST, TEST_VALUE_TEST);
			const result = adapter.removeItem(TEST_KEY_TEST);
			expect(result).toBe(true);
			expect(globalThis.window.localStorage.getItem(TEST_KEY_TEST)).toBeNull();
		});

		it('should return true when removing non-existent key', () => {
			const result = adapter.removeItem(TEST_KEY_NON_EXISTENT);
			expect(result).toBe(true);
		});

		it(TEST_DESCRIPTION_ERROR, () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const errorAdapter = createMockLocalStorageWithError('removeItem', new Error(SECURITY_ERROR));

			expect(errorAdapter.removeItem(TEST_KEY)).toBe(false);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to remove item from localStorage'),
				expect.objectContaining({ error: expect.any(String) })
			);

			consoleWarnSpy.mockRestore();
		});
	});
});

describe('LocalStorageAdapter - Clear Method', () => {
	let adapter: LocalStorageAdapter;
	let originalWindow: Window & typeof globalThis;
	let originalLocalStorage: Storage | null | undefined;

	beforeEach(() => {
		const {
			adapter: setupAdapter,
			originalWindow: setupOriginalWindow,
			originalLocalStorage: setupOriginalLocalStorage,
		} = setupTestEnvironment();
		adapter = setupAdapter;
		originalWindow = setupOriginalWindow;
		originalLocalStorage = setupOriginalLocalStorage;
	});

	afterEach(() => {
		teardownTestEnvironment(originalWindow, originalLocalStorage);
	});

	describe('clear', () => {
		it('should clear all items and return true', () => {
			globalThis.window.localStorage.setItem(TEST_KEY_1, TEST_VALUE_1);
			globalThis.window.localStorage.setItem(TEST_KEY_2, TEST_VALUE_2);
			const result = adapter.clear();
			expect(result).toBe(true);
			expect(globalThis.window.localStorage.length).toBe(0);
		});

		it('should return true when clearing empty storage', () => {
			globalThis.window.localStorage.clear();
			const result = adapter.clear();
			expect(result).toBe(true);
		});

		it(TEST_DESCRIPTION_ERROR, () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const errorAdapter = createMockLocalStorageWithError('clear', new Error(SECURITY_ERROR));

			expect(errorAdapter.clear()).toBe(false);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to clear localStorage'),
				expect.objectContaining({ error: expect.any(String) })
			);

			consoleWarnSpy.mockRestore();
		});
	});
});

describe('LocalStorageAdapter - Utility Methods', () => {
	let adapter: LocalStorageAdapter;
	let originalWindow: Window & typeof globalThis;
	let originalLocalStorage: Storage | null | undefined;

	beforeEach(() => {
		const {
			adapter: setupAdapter,
			originalWindow: setupOriginalWindow,
			originalLocalStorage: setupOriginalLocalStorage,
		} = setupTestEnvironment();
		adapter = setupAdapter;
		originalWindow = setupOriginalWindow;
		originalLocalStorage = setupOriginalLocalStorage;
	});

	afterEach(() => {
		teardownTestEnvironment(originalWindow, originalLocalStorage);
	});

	describeGetLengthTests(() => adapter);
	describeKeyTests(() => adapter);
});

describe('LocalStorageAdapter - Integration', () => {
	let adapter: LocalStorageAdapter;
	let originalWindow: Window & typeof globalThis;
	let originalLocalStorage: Storage | null | undefined;

	beforeEach(() => {
		const {
			adapter: setupAdapter,
			originalWindow: setupOriginalWindow,
			originalLocalStorage: setupOriginalLocalStorage,
		} = setupTestEnvironment();
		adapter = setupAdapter;
		originalWindow = setupOriginalWindow;
		originalLocalStorage = setupOriginalLocalStorage;
	});

	afterEach(() => {
		teardownTestEnvironment(originalWindow, originalLocalStorage);
	});

	describe('Integration', () => {
		it('should handle full storage lifecycle', () => {
			// Set multiple items
			adapter.setItem(TEST_KEY_1, TEST_VALUE_1);
			adapter.setItem(TEST_KEY_2, TEST_VALUE_2);
			adapter.setItem(TEST_KEY_3, TEST_VALUE_3);

			// Verify all items
			expect(adapter.getItem(TEST_KEY_1)).toBe(TEST_VALUE_1);
			expect(adapter.getItem(TEST_KEY_2)).toBe(TEST_VALUE_2);
			expect(adapter.getItem(TEST_KEY_3)).toBe(TEST_VALUE_3);
			expect(adapter.getLength()).toBe(3);

			// Remove one item
			adapter.removeItem(TEST_KEY_2);
			expect(adapter.getItem(TEST_KEY_2)).toBeNull();
			expect(adapter.getLength()).toBe(2);

			// Update one item
			adapter.setItem(TEST_KEY_1, TEST_VALUE_UPDATED);
			expect(adapter.getItem(TEST_KEY_1)).toBe(TEST_VALUE_UPDATED);
			expect(adapter.getLength()).toBe(2);

			// Clear all
			adapter.clear();
			expect(adapter.getLength()).toBe(0);
			expect(adapter.getItem(TEST_KEY_1)).toBeNull();
		});
	});
});
