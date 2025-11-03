import type { StoragePort } from '@core/ports/StoragePort';

/**
 * Mock StoragePort implementation for testing
 * Uses in-memory Map to simulate localStorage without browser APIs
 */
export class MockStorageAdapter implements StoragePort {
	private readonly storage = new Map<string, string>();

	private static readonly TYPE_STRING = 'string';
	private static readonly ERROR_KEY_MUST_BE_STRING = 'MockStorageAdapter: key must be a string';
	private static readonly ERROR_VALUE_MUST_BE_STRING = 'MockStorageAdapter: value must be a string';

	getItem(key: string): string | null {
		if (typeof key !== MockStorageAdapter.TYPE_STRING) {
			throw new TypeError(MockStorageAdapter.ERROR_KEY_MUST_BE_STRING);
		}
		return this.storage.get(key) ?? null;
	}

	setItem(key: string, value: string): boolean {
		if (typeof key !== MockStorageAdapter.TYPE_STRING) {
			throw new TypeError(MockStorageAdapter.ERROR_KEY_MUST_BE_STRING);
		}
		if (typeof value !== MockStorageAdapter.TYPE_STRING) {
			throw new TypeError(MockStorageAdapter.ERROR_VALUE_MUST_BE_STRING);
		}
		try {
			this.storage.set(key, value);
			return true;
		} catch {
			return false;
		}
	}

	removeItem(key: string): boolean {
		if (typeof key !== MockStorageAdapter.TYPE_STRING) {
			throw new TypeError(MockStorageAdapter.ERROR_KEY_MUST_BE_STRING);
		}
		return this.storage.delete(key);
	}

	clear(): boolean {
		this.storage.clear();
		return true;
	}

	getLength(): number {
		return this.storage.size;
	}

	key(index: number): string | null {
		const keys = Array.from(this.storage.keys());
		return keys[index] ?? null;
	}

	/**
	 * Test helper: Clear all storage (useful for test cleanup)
	 */
	reset(): void {
		this.storage.clear();
	}
}
