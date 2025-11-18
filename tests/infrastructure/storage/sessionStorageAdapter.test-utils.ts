import { SessionStorageAdapter } from '@infra/storage/sessionStorageAdapter';
import { vi } from 'vitest';

// Test constants
export const TEST_KEY = 'test-key';
export const TEST_VALUE = 'test-value';
export const KEY = 'key';
export const VALUE = 'value';
export const SECURITY_ERROR = 'Security error';
export const QUOTA_EXCEEDED_ERROR = 'QuotaExceededError';
export const OLD_VALUE = 'old-value';
export const NEW_VALUE = 'new-value';
export const NON_EXISTENT_KEY = 'non-existent';
export const TEST_DESC_RETURN_FALSE_ON_ERROR =
	'should return false when sessionStorage throws error';

// Capture the original sessionStorage at module load time (before any tests run)
export const ORIGINAL_SESSION_STORAGE = globalThis.window?.sessionStorage;

// Helper function to create a complete mock sessionStorage
export function createMockSessionStorage() {
	const storage = new Map<string, string>();
	return {
		getItem: vi.fn((key: string) => storage.get(key) ?? null),
		setItem: vi.fn((key: string, value: string) => {
			storage.set(key, value);
		}),
		removeItem: vi.fn((key: string) => {
			storage.delete(key);
		}),
		clear: vi.fn(() => {
			storage.clear();
		}),
		get length() {
			return storage.size;
		},
		key: vi.fn((index: number) => {
			const keys = Array.from(storage.keys());
			return keys[index] ?? null;
		}),
	};
}

// Helper function to setup error scenario with console.warn spy
export function setupErrorScenario(
	methodName: string,
	errorMessage: string,
	callback: (adapter: SessionStorageAdapter, consoleWarnSpy: ReturnType<typeof vi.spyOn>) => void
) {
	const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const mockSessionStorage = createMockSessionStorage();

	Object.defineProperty(globalThis.window, 'sessionStorage', {
		value: mockSessionStorage,
		writable: true,
		configurable: true,
	});

	// Create adapter first while all methods work (so availability check passes)
	const errorAdapter = new SessionStorageAdapter();

	// Now override the specific method to throw an error
	// This will affect subsequent calls but not the constructor's availability check
	if (methodName === 'length') {
		Object.defineProperty(mockSessionStorage, 'length', {
			get: () => {
				throw new Error(errorMessage);
			},
			configurable: true,
		});
	} else {
		(mockSessionStorage as Record<string, unknown>)[methodName] = vi.fn(() => {
			throw new Error(errorMessage);
		});
	}

	callback(errorAdapter, consoleWarnSpy);

	// Restore original sessionStorage
	if (ORIGINAL_SESSION_STORAGE && globalThis.window) {
		Object.defineProperty(globalThis.window, 'sessionStorage', {
			value: ORIGINAL_SESSION_STORAGE,
			writable: true,
			configurable: true,
		});
	}
	consoleWarnSpy.mockRestore();
}

// Helper function to create SSR adapter with window undefined
export function createSsrAdapter() {
	// @ts-expect-error - Intentionally removing window for SSR test
	delete globalThis.window;
	return new SessionStorageAdapter();
}

// Helper function to setup getLength error scenario (uses getter, not method)
export function setupGetLengthErrorScenario(
	callback: (adapter: SessionStorageAdapter, consoleWarnSpy: ReturnType<typeof vi.spyOn>) => void
) {
	const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
	const mockSessionStorage = createMockSessionStorage();

	// Override length getter to throw error, but keep other methods working
	Object.defineProperty(mockSessionStorage, 'length', {
		get: () => {
			throw new Error(SECURITY_ERROR);
		},
		configurable: true,
	});

	Object.defineProperty(globalThis.window, 'sessionStorage', {
		value: mockSessionStorage,
		writable: true,
		configurable: true,
	});

	const errorAdapter = new SessionStorageAdapter();
	callback(errorAdapter, consoleWarnSpy);

	// Restore original sessionStorage
	if (ORIGINAL_SESSION_STORAGE && globalThis.window) {
		Object.defineProperty(globalThis.window, 'sessionStorage', {
			value: ORIGINAL_SESSION_STORAGE,
			writable: true,
			configurable: true,
		});
	}
	consoleWarnSpy.mockRestore();
}
