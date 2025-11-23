import { LocalStorageAdapter } from '@infra/storage/localStorageAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	createDisabledLocalStorageAdapter,
	createMockLocalStorageWithError,
	createSsrAdapter,
	describeGetItemTests,
	describeGetLengthTests,
	describeKeyTests,
	describeSetItemTests,
	SECURITY_ERROR,
	setupTestEnvironment,
	teardownTestEnvironment,
	TEST_DESCRIPTION_ERROR,
	TEST_KEY,
	TEST_KEY_1,
	TEST_KEY_2,
	TEST_KEY_3,
	TEST_KEY_NON_EXISTENT,
	TEST_KEY_TEST,
	TEST_VALUE,
	TEST_VALUE_1,
	TEST_VALUE_2,
	TEST_VALUE_3,
	TEST_VALUE_TEST,
	TEST_VALUE_UPDATED,
} from './localStorageAdapter.test-helpers';

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

		it('should handle non-Error objects thrown by removeItem', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const nonError = null;
			const errorAdapter = createMockLocalStorageWithError(
				'removeItem',
				nonError as unknown as Error
			);

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

		it('should handle non-Error objects thrown by clear', () => {
			const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const nonError = 123;
			const errorAdapter = createMockLocalStorageWithError('clear', nonError as unknown as Error);

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
