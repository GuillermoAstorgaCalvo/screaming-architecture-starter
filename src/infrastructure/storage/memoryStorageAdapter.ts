import type { StoragePort } from '@core/ports/StoragePort';

/**
 * memoryStorageAdapter - In-memory storage implementation
 *
 * Provides a StoragePort implementation using an in-memory Map.
 * Useful for:
 * - SSR environments where browser storage is unavailable
 * - Testing scenarios
 * - Temporary storage that doesn't persist across page reloads
 *
 * Note: This is different from MockStorageAdapter (used in tests) as this is
 * a production-ready adapter that can be used in SSR contexts.
 */
export class MemoryStorageAdapter implements StoragePort {
	private readonly storage = new Map<string, string>();

	getItem(key: string): string | null {
		return this.storage.get(key) ?? null;
	}

	setItem(key: string, value: string): boolean {
		try {
			this.storage.set(key, value);
			return true;
		} catch {
			return false;
		}
	}

	removeItem(key: string): boolean {
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
	 * Reset storage (useful for testing or cleanup)
	 */
	reset(): void {
		this.storage.clear();
	}
}

/**
 * Singleton instance of memoryStorageAdapter
 * Use this instance throughout the application when in-memory storage is needed
 */
export const memoryStorageAdapter = new MemoryStorageAdapter();
