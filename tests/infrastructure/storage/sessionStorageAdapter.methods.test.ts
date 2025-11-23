import { SessionStorageAdapter } from '@infra/storage/sessionStorageAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	KEY,
	NON_EXISTENT_KEY,
	OLD_VALUE,
	ORIGINAL_SESSION_STORAGE,
	QUOTA_EXCEEDED_ERROR,
	SECURITY_ERROR,
	setupErrorScenario,
	setupGetLengthErrorScenario,
	setupNonErrorThrowScenario,
	TEST_DESC_RETURN_FALSE_ON_ERROR,
	TEST_KEY,
	TEST_VALUE,
	VALUE,
} from './sessionStorageAdapter.test-utils';

// Helper to restore sessionStorage in beforeEach
function restoreSessionStorage() {
	if (ORIGINAL_SESSION_STORAGE && globalThis.window) {
		Object.defineProperty(globalThis.window, 'sessionStorage', {
			value: ORIGINAL_SESSION_STORAGE,
			writable: true,
			configurable: true,
		});
	}
}

// Helper for afterEach cleanup
function cleanupSessionStorage(originalWindow: Window & typeof globalThis) {
	if (originalWindow) {
		globalThis.window = originalWindow;
	}
	if (
		globalThis.window?.sessionStorage &&
		typeof globalThis.window.sessionStorage.clear === 'function'
	) {
		try {
			globalThis.window.sessionStorage.clear();
		} catch {
			// Ignore errors during cleanup
		}
	}
	vi.restoreAllMocks();
}

describe('SessionStorageAdapter - getItem', () => {
	let adapter: SessionStorageAdapter;
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalWindow = globalThis.window;
		restoreSessionStorage();
		adapter = new SessionStorageAdapter();
	});

	afterEach(() => cleanupSessionStorage(originalWindow));

	describe('getItem', () => {
		it('should return null for non-existent key', () => {
			expect(adapter.getItem(NON_EXISTENT_KEY)).toBeNull();
		});

		it('should return stored value', () => {
			globalThis.window.sessionStorage.setItem(TEST_KEY, TEST_VALUE);
			expect(adapter.getItem(TEST_KEY)).toBe(TEST_VALUE);
		});

		it('should return null when sessionStorage throws error', () => {
			setupErrorScenario('getItem', SECURITY_ERROR, (errorAdapter, consoleWarnSpy) => {
				expect(errorAdapter.getItem(KEY)).toBeNull();
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					expect.stringContaining('Failed to get item from sessionStorage'),
					expect.objectContaining({ error: expect.any(String) })
				);
			});
		});

		it('should handle non-Error objects thrown by getItem', () => {
			setupNonErrorThrowScenario('getItem', 'String error', (errorAdapter, consoleWarnSpy) => {
				expect(errorAdapter.getItem(KEY)).toBeNull();
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					expect.stringContaining('Failed to get item from sessionStorage'),
					expect.objectContaining({ error: expect.any(String) })
				);
			});
		});
	});
});

describe('SessionStorageAdapter - setItem', () => {
	let adapter: SessionStorageAdapter;
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalWindow = globalThis.window;
		restoreSessionStorage();
		adapter = new SessionStorageAdapter();
	});

	afterEach(() => cleanupSessionStorage(originalWindow));

	describe('setItem', () => {
		it('should store value and return true', () => {
			const result = adapter.setItem(TEST_KEY, TEST_VALUE);
			expect(result).toBe(true);
			expect(globalThis.window.sessionStorage.getItem(TEST_KEY)).toBe(TEST_VALUE);
		});

		it('should overwrite existing value', () => {
			globalThis.window.sessionStorage.setItem(TEST_KEY, OLD_VALUE);
			const result = adapter.setItem(TEST_KEY, 'new-value');
			expect(result).toBe(true);
			expect(globalThis.window.sessionStorage.getItem(TEST_KEY)).toBe('new-value');
		});

		it(TEST_DESC_RETURN_FALSE_ON_ERROR, () => {
			setupErrorScenario('setItem', QUOTA_EXCEEDED_ERROR, (errorAdapter, consoleWarnSpy) => {
				expect(errorAdapter.setItem(KEY, VALUE)).toBe(false);
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					expect.stringContaining('Failed to set item in sessionStorage'),
					expect.objectContaining({ error: expect.any(String) })
				);
			});
		});

		it('should handle non-Error objects thrown by setItem', () => {
			setupNonErrorThrowScenario(
				'setItem',
				{ message: 'Custom error object' },
				(errorAdapter, consoleWarnSpy) => {
					expect(errorAdapter.setItem(KEY, VALUE)).toBe(false);
					expect(consoleWarnSpy).toHaveBeenCalledWith(
						expect.stringContaining('Failed to set item in sessionStorage'),
						expect.objectContaining({ error: expect.any(String) })
					);
				}
			);
		});
	});
});

describe('SessionStorageAdapter - removeItem', () => {
	let adapter: SessionStorageAdapter;
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalWindow = globalThis.window;
		restoreSessionStorage();
		adapter = new SessionStorageAdapter();
	});

	afterEach(() => cleanupSessionStorage(originalWindow));

	describe('removeItem', () => {
		it('should remove item and return true', () => {
			globalThis.window.sessionStorage.setItem(TEST_KEY, TEST_VALUE);
			const result = adapter.removeItem(TEST_KEY);
			expect(result).toBe(true);
			expect(globalThis.window.sessionStorage.getItem(TEST_KEY)).toBeNull();
		});

		it('should return true when removing non-existent key', () => {
			const result = adapter.removeItem(NON_EXISTENT_KEY);
			expect(result).toBe(true);
		});

		it(TEST_DESC_RETURN_FALSE_ON_ERROR, () => {
			setupErrorScenario('removeItem', SECURITY_ERROR, (errorAdapter, consoleWarnSpy) => {
				expect(errorAdapter.removeItem(KEY)).toBe(false);
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					expect.stringContaining('Failed to remove item from sessionStorage'),
					expect.objectContaining({ error: expect.any(String) })
				);
			});
		});

		it('should handle non-Error objects thrown by removeItem', () => {
			setupNonErrorThrowScenario('removeItem', null, (errorAdapter, consoleWarnSpy) => {
				expect(errorAdapter.removeItem(KEY)).toBe(false);
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					expect.stringContaining('Failed to remove item from sessionStorage'),
					expect.objectContaining({ error: expect.any(String) })
				);
			});
		});
	});
});

describe('SessionStorageAdapter - clear', () => {
	let adapter: SessionStorageAdapter;
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalWindow = globalThis.window;
		restoreSessionStorage();
		adapter = new SessionStorageAdapter();
	});

	afterEach(() => cleanupSessionStorage(originalWindow));

	describe('clear', () => {
		it('should clear all items and return true', () => {
			globalThis.window.sessionStorage.setItem('key1', 'value1');
			globalThis.window.sessionStorage.setItem('key2', 'value2');
			const result = adapter.clear();
			expect(result).toBe(true);
			expect(globalThis.window.sessionStorage.length).toBe(0);
		});

		it('should return true when clearing empty storage', () => {
			globalThis.window.sessionStorage.clear();
			const result = adapter.clear();
			expect(result).toBe(true);
		});

		it(TEST_DESC_RETURN_FALSE_ON_ERROR, () => {
			setupErrorScenario('clear', SECURITY_ERROR, (errorAdapter, consoleWarnSpy) => {
				expect(errorAdapter.clear()).toBe(false);
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					expect.stringContaining('Failed to clear sessionStorage'),
					expect.objectContaining({ error: expect.any(String) })
				);
			});
		});

		it('should handle non-Error objects thrown by clear', () => {
			setupNonErrorThrowScenario('clear', 123, (errorAdapter, consoleWarnSpy) => {
				expect(errorAdapter.clear()).toBe(false);
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					expect.stringContaining('Failed to clear sessionStorage'),
					expect.objectContaining({ error: expect.any(String) })
				);
			});
		});
	});
});

describe('SessionStorageAdapter - getLength', () => {
	let adapter: SessionStorageAdapter;
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalWindow = globalThis.window;
		restoreSessionStorage();
		adapter = new SessionStorageAdapter();
	});

	afterEach(() => cleanupSessionStorage(originalWindow));

	describe('getLength', () => {
		it('should return 0 for empty storage', () => {
			globalThis.window.sessionStorage.clear();
			expect(adapter.getLength()).toBe(0);
		});

		it('should return correct length', () => {
			globalThis.window.sessionStorage.clear();
			globalThis.window.sessionStorage.setItem('key1', 'value1');
			globalThis.window.sessionStorage.setItem('key2', 'value2');
			expect(adapter.getLength()).toBe(2);
		});

		it('should return 0 when sessionStorage throws error', () => {
			setupGetLengthErrorScenario((errorAdapter, consoleWarnSpy) => {
				expect(errorAdapter.getLength()).toBe(0);
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					expect.stringContaining('Failed to get sessionStorage length'),
					expect.objectContaining({ error: expect.any(String) })
				);
			});
		});

		it('should handle non-Error objects thrown by getLength', () => {
			setupNonErrorThrowScenario(
				'length',
				{ toString: () => 'Custom error' },
				(errorAdapter, consoleWarnSpy) => {
					expect(errorAdapter.getLength()).toBe(0);
					expect(consoleWarnSpy).toHaveBeenCalledWith(
						expect.stringContaining('Failed to get sessionStorage length'),
						expect.objectContaining({ error: expect.any(String) })
					);
				}
			);
		});
	});
});

describe('SessionStorageAdapter - key', () => {
	let adapter: SessionStorageAdapter;
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalWindow = globalThis.window;
		restoreSessionStorage();
		adapter = new SessionStorageAdapter();
	});

	afterEach(() => cleanupSessionStorage(originalWindow));

	describe('key', () => {
		it('should return null for invalid index', () => {
			globalThis.window.sessionStorage.clear();
			expect(adapter.key(0)).toBeNull();
			expect(adapter.key(-1)).toBeNull();
		});

		it('should return key at given index', () => {
			globalThis.window.sessionStorage.clear();
			globalThis.window.sessionStorage.setItem('key1', 'value1');
			globalThis.window.sessionStorage.setItem('key2', 'value2');
			expect(adapter.key(0)).toBe('key1');
			expect(adapter.key(1)).toBe('key2');
		});

		it('should return null when sessionStorage throws error', () => {
			setupErrorScenario('key', SECURITY_ERROR, (errorAdapter, consoleWarnSpy) => {
				expect(errorAdapter.key(0)).toBeNull();
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					expect.stringContaining('Failed to get key from sessionStorage'),
					expect.objectContaining({ error: expect.any(String) })
				);
			});
		});

		it('should handle non-Error objects thrown by key', () => {
			setupNonErrorThrowScenario('key', 'String error', (errorAdapter, consoleWarnSpy) => {
				expect(errorAdapter.key(0)).toBeNull();
				expect(consoleWarnSpy).toHaveBeenCalledWith(
					expect.stringContaining('Failed to get key from sessionStorage'),
					expect.objectContaining({ error: expect.any(String) })
				);
			});
		});
	});
});

describe('SessionStorageAdapter - Integration', () => {
	let adapter: SessionStorageAdapter;
	let originalWindow: Window & typeof globalThis;

	beforeEach(() => {
		originalWindow = globalThis.window;
		restoreSessionStorage();
		adapter = new SessionStorageAdapter();
	});

	afterEach(() => cleanupSessionStorage(originalWindow));

	describe('Integration', () => {
		it('should handle full storage lifecycle', () => {
			// Set multiple items
			adapter.setItem('key1', 'value1');
			adapter.setItem('key2', 'value2');
			adapter.setItem('key3', 'value3');

			// Verify all items
			expect(adapter.getItem('key1')).toBe('value1');
			expect(adapter.getItem('key2')).toBe('value2');
			expect(adapter.getItem('key3')).toBe('value3');
			expect(adapter.getLength()).toBe(3);

			// Remove one item
			adapter.removeItem('key2');
			expect(adapter.getItem('key2')).toBeNull();
			expect(adapter.getLength()).toBe(2);

			// Update one item
			adapter.setItem('key1', 'updated-value');
			expect(adapter.getItem('key1')).toBe('updated-value');
			expect(adapter.getLength()).toBe(2);

			// Clear all
			adapter.clear();
			expect(adapter.getLength()).toBe(0);
			expect(adapter.getItem('key1')).toBeNull();
		});
	});
});
