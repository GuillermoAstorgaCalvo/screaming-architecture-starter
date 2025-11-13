import type { StoragePort } from '@core/ports/StoragePort';
import type { CookieOptions } from '@src-types/ports';

import {
	DEFAULT_COOKIE_EXPIRATION_DAYS,
	isCookieStorageAvailable,
} from './cookieStorageAdapter.constants';
import { logCookieWarn } from './cookieStorageAdapter.logging';
import { parseCookies } from './cookieStorageAdapter.parsing';
import { serializeCookieOptions } from './cookieStorageAdapter.serialization';

/**
 * CookieStorageAdapter - Encapsulates cookie access
 *
 * Provides SSR-safe access to browser cookies via document.cookie API.
 * This adapter gates browser API calls to prevent errors during server-side rendering.
 *
 * Cookie options:
 * - path: defaults to '/' for app-wide access
 * - sameSite: defaults to 'Lax' for CSRF protection
 * - secure: defaults to true in HTTPS environments
 *
 * Guidelines:
 * - Always gate browser APIs for SSR/test environments
 * - Domains/services should NOT access cookies directly; use this adapter
 * - Uses console.warn for error logging (SSR-safe) to avoid circular dependencies with logger adapter
 */
export class CookieStorageAdapter implements StoragePort {
	private readonly isAvailable: boolean;

	constructor() {
		// Check if document and cookies are available (browser environment, not in SSR)
		this.isAvailable = isCookieStorageAvailable();
	}

	/**
	 * Set a cookie with optional configuration
	 *
	 * @param key - Cookie key
	 * @param value - Cookie value (will be URL-encoded)
	 * @param options - Cookie options (expiresDays, path, sameSite, secure, domain)
	 * @returns true if successful, false otherwise
	 */
	setItemWithOptions(key: string, value: string, options: CookieOptions = {}): boolean {
		if (!this.isAvailable) {
			return false;
		}

		try {
			const encodedValue = encodeURIComponent(value);
			const optionsString = serializeCookieOptions(options);
			document.cookie = `${key}=${encodedValue}${optionsString}`;
			return true;
		} catch (error) {
			logCookieWarn(`Failed to set cookie`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return false;
		}
	}

	getItem(key: string): string | null {
		if (!this.isAvailable) {
			return null;
		}

		try {
			const cookieString = document.cookie;
			const cookies = parseCookies(cookieString);
			return cookies.get(key) ?? null;
		} catch (error) {
			logCookieWarn(`Failed to get cookie`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return null;
		}
	}

	setItem(key: string, value: string): boolean {
		// Use default options for standard setItem (expires in 365 days)
		return this.setItemWithOptions(key, value, { expiresDays: DEFAULT_COOKIE_EXPIRATION_DAYS });
	}

	removeItem(key: string): boolean {
		if (!this.isAvailable) {
			return false;
		}

		// Delete cookie by setting expiration in the past
		return this.setItemWithOptions(key, '', { expiresDays: -1 });
	}

	clear(): boolean {
		if (!this.isAvailable) {
			return false;
		}

		try {
			const cookieString = document.cookie;
			const cookies = parseCookies(cookieString);
			let allRemoved = true;
			for (const key of cookies.keys()) {
				// Validate key to prevent object injection
				if (typeof key === 'string' && !this.removeItem(key)) {
					allRemoved = false;
				}
			}
			return allRemoved;
		} catch (error) {
			logCookieWarn(`Failed to clear cookies`, {
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
			const cookieString = document.cookie;
			const cookies = parseCookies(cookieString);
			return cookies.size;
		} catch (error) {
			logCookieWarn(`Failed to get cookie count`, {
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
			const cookieString = document.cookie;
			const cookies = parseCookies(cookieString);
			const keys = Array.from(cookies.keys());
			// Map keys are always strings, but validate index access

			return keys[index] ?? null;
		} catch (error) {
			logCookieWarn(`Failed to get cookie key`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return null;
		}
	}
}

/**
 * Singleton instance of CookieStorageAdapter
 * Use this instance throughout the application to ensure consistent cookie access
 */
export const cookieStorageAdapter = new CookieStorageAdapter();
