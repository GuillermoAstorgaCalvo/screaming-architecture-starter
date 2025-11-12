import type { StoragePort } from '@core/ports/StoragePort';

/**
 * localStorageAdapter - Encapsulates localStorage access
 *
 * Provides SSR-safe access to browser localStorage API.
 * This adapter gates browser API calls to prevent errors during server-side rendering.
 *
 * Guidelines:
 * - Always gate browser APIs for SSR/test environments
 * - Domains/services should NOT access storage directly; use this adapter
 * - Uses console.warn for error logging (SSR-safe) to avoid circular dependencies with logger adapter
 */
class LocalStorageAdapter implements StoragePort {
	private readonly isAvailable: boolean;

	constructor() {
		// Check if localStorage is available (browser environment, not in SSR)
		// Guard for SSR safety: check for window and localStorage existence
		if (globalThis.window === undefined) {
			this.isAvailable = false;
			return;
		}
		// TypeScript knows window exists here, but runtime check for localStorage is still needed
		this.isAvailable =
			Boolean(globalThis.window.localStorage) && this.checkLocalStorageAvailability();
	}

	/**
	 * Check if localStorage is actually usable (not just defined)
	 * Some browsers may disable localStorage in certain contexts (e.g., private mode)
	 * Note: Called only when window exists, but localStorage may still be null in some contexts
	 */
	private checkLocalStorageAvailability(): boolean {
		try {
			const testKey = '__localStorage_test__';
			globalThis.window.localStorage.setItem(testKey, 'test');
			globalThis.window.localStorage.removeItem(testKey);
			return true;
		} catch {
			// localStorage may be disabled (private browsing, storage quota exceeded, etc.)
			return false;
		}
	}

	/**
	 * Log warning message (SSR-safe console fallback)
	 * Uses console directly to avoid circular dependencies with logger adapter
	 */
	private logWarn(message: string, context?: Record<string, unknown>): void {
		if (typeof console !== 'undefined') {
			if (context) {
				console.warn(message, context);
			} else {
				console.warn(message);
			}
		}
	}

	getItem(key: string): string | null {
		if (!this.isAvailable) {
			return null;
		}

		try {
			// isAvailable already checks for window and localStorage existence
			return globalThis.window.localStorage.getItem(key);
		} catch (error) {
			// Handle potential errors (quota exceeded, security errors, etc.)
			this.logWarn(`Failed to get item from localStorage`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return null;
		}
	}

	setItem(key: string, value: string): boolean {
		if (!this.isAvailable) {
			return false;
		}

		try {
			// isAvailable already checks for window and localStorage existence
			globalThis.window.localStorage.setItem(key, value);
			return true;
		} catch (error) {
			// Handle potential errors (quota exceeded, security errors, etc.)
			this.logWarn(`Failed to set item in localStorage`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return false;
		}
	}

	removeItem(key: string): boolean {
		if (!this.isAvailable) {
			return false;
		}

		try {
			// isAvailable already checks for window and localStorage existence
			globalThis.window.localStorage.removeItem(key);
			return true;
		} catch (error) {
			// Handle potential errors (security errors, etc.)
			this.logWarn(`Failed to remove item from localStorage`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return false;
		}
	}

	clear(): boolean {
		if (!this.isAvailable) {
			return false;
		}

		try {
			// isAvailable already checks for window and localStorage existence
			globalThis.window.localStorage.clear();
			return true;
		} catch (error) {
			// Handle potential errors (security errors, etc.)
			this.logWarn(`Failed to clear localStorage`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return false;
		}
	}

	getLength(): number {
		if (!this.isAvailable) {
			return 0;
		}

		try {
			// isAvailable already checks for window and localStorage existence
			return globalThis.window.localStorage.length;
		} catch (error) {
			this.logWarn(`Failed to get localStorage length`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return 0;
		}
	}

	key(index: number): string | null {
		if (!this.isAvailable) {
			return null;
		}

		try {
			// isAvailable already checks for window and localStorage existence
			return globalThis.window.localStorage.key(index);
		} catch (error) {
			this.logWarn(`Failed to get key from localStorage`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return null;
		}
	}
}

/**
 * Singleton instance of localStorageAdapter
 * Use this instance throughout the application to ensure consistent storage access
 */
export const localStorageAdapter = new LocalStorageAdapter();

// Export class for testing
export { LocalStorageAdapter };
