import type { StoragePort } from '@core/ports/StoragePort';

/**
 * sessionStorageAdapter - Encapsulates sessionStorage access
 *
 * Provides SSR-safe access to browser sessionStorage API.
 * This adapter gates browser API calls to prevent errors during server-side rendering.
 *
 * Guidelines:
 * - Always gate browser APIs for SSR/test environments
 * - Domains/services should NOT access storage directly; use this adapter
 * - Uses console.warn for error logging (SSR-safe) to avoid circular dependencies with logger adapter
 */
export class SessionStorageAdapter implements StoragePort {
	private readonly isAvailable: boolean;

	constructor() {
		// Check if sessionStorage is available (browser environment, not in SSR)
		// Guard for SSR safety: check for window and sessionStorage existence
		if (globalThis.window === undefined) {
			this.isAvailable = false;
			return;
		}
		// TypeScript knows window exists here, but runtime check for sessionStorage is still needed
		this.isAvailable =
			Boolean(globalThis.window.sessionStorage) && this.checkSessionStorageAvailability();
	}

	/**
	 * Check if sessionStorage is actually usable (not just defined)
	 * Some browsers may disable sessionStorage in certain contexts (e.g., private mode)
	 * Note: Called only when window exists, but sessionStorage may still be null in some contexts
	 */
	private checkSessionStorageAvailability(): boolean {
		try {
			const testKey = '__sessionStorage_test__';
			globalThis.window.sessionStorage.setItem(testKey, 'test');
			globalThis.window.sessionStorage.removeItem(testKey);
			return true;
		} catch {
			// sessionStorage may be disabled (private browsing, storage quota exceeded, etc.)
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
			// isAvailable already checks for window and sessionStorage existence
			return globalThis.window.sessionStorage.getItem(key);
		} catch (error) {
			// Handle potential errors (quota exceeded, security errors, etc.)
			this.logWarn(`Failed to get item from sessionStorage`, {
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
			// isAvailable already checks for window and sessionStorage existence
			globalThis.window.sessionStorage.setItem(key, value);
			return true;
		} catch (error) {
			// Handle potential errors (quota exceeded, security errors, etc.)
			this.logWarn(`Failed to set item in sessionStorage`, {
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
			// isAvailable already checks for window and sessionStorage existence
			globalThis.window.sessionStorage.removeItem(key);
			return true;
		} catch (error) {
			// Handle potential errors (security errors, etc.)
			this.logWarn(`Failed to remove item from sessionStorage`, {
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
			// isAvailable already checks for window and sessionStorage existence
			globalThis.window.sessionStorage.clear();
			return true;
		} catch (error) {
			// Handle potential errors (security errors, etc.)
			this.logWarn(`Failed to clear sessionStorage`, {
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
			// isAvailable already checks for window and sessionStorage existence
			return globalThis.window.sessionStorage.length;
		} catch (error) {
			this.logWarn(`Failed to get sessionStorage length`, {
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
			// isAvailable already checks for window and sessionStorage existence
			return globalThis.window.sessionStorage.key(index);
		} catch (error) {
			this.logWarn(`Failed to get key from sessionStorage`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return null;
		}
	}
}

/**
 * Singleton instance of sessionStorageAdapter
 * Use this instance throughout the application to ensure consistent storage access
 */
export const sessionStorageAdapter = new SessionStorageAdapter();
