import type { StoragePort } from '@core/ports/StoragePort';

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
interface CookieOptions {
	/**
	 * Cookie expiration in days (default: 365)
	 * Set to 0 for session cookie (expires when browser closes)
	 * Set to negative number to delete the cookie
	 */
	expiresDays?: number;
	/**
	 * Cookie path (default: '/')
	 */
	path?: string;
	/**
	 * SameSite attribute (default: 'Lax')
	 */
	sameSite?: 'Strict' | 'Lax' | 'None';
	/**
	 * Secure flag (default: true in HTTPS environments)
	 */
	secure?: boolean;
	/**
	 * Domain attribute (optional)
	 */
	domain?: string;
}

class CookieStorageAdapter implements StoragePort {
	private readonly isAvailable: boolean;
	private readonly defaultOptions: Required<Pick<CookieOptions, 'path' | 'sameSite' | 'secure'>>;

	constructor() {
		// Check if document and cookies are available (browser environment, not in SSR)
		this.isAvailable = typeof document !== 'undefined' && typeof document.cookie === 'string';

		// Default options
		const isSecure = globalThis.window?.location.protocol === 'https:';
		this.defaultOptions = {
			path: '/',
			sameSite: 'Lax',
			secure: isSecure || true,
		};
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

	/**
	 * Parse cookie string into key-value pairs
	 */
	private parseCookies(): Map<string, string> {
		const cookies = new Map<string, string>();
		if (!this.isAvailable || typeof document === 'undefined' || !document.cookie) {
			return cookies;
		}

		const cookieStrings = document.cookie.split(';');
		for (const cookieString of cookieStrings) {
			const [key, ...valueParts] = cookieString.trim().split('=');
			if (key) {
				const value = valueParts.join('='); // Handle values that contain '='
				cookies.set(key, decodeURIComponent(value || ''));
			}
		}

		return cookies;
	}

	/**
	 * Calculate expiration date from days
	 */
	private calculateExpirationDate(expiresDays: number): string {
		const date = new Date();
		const HOURS_PER_DAY = 24;
		const MINUTES_PER_HOUR = 60;
		const SECONDS_PER_MINUTE = 60;
		const MILLISECONDS_PER_SECOND = 1000;
		date.setTime(
			date.getTime() +
				expiresDays *
					HOURS_PER_DAY *
					MINUTES_PER_HOUR *
					SECONDS_PER_MINUTE *
					MILLISECONDS_PER_SECOND
		);
		return date.toUTCString();
	}

	/**
	 * Serialize expiration option
	 */
	private serializeExpiration(expiresDays: number | undefined, parts: string[]): void {
		if (expiresDays === undefined) {
			return;
		}

		if (expiresDays <= 0) {
			// Delete cookie by setting expiration in the past
			parts.push('expires=Thu, 01 Jan 1970 00:00:00 GMT');
		} else {
			const expirationDate = this.calculateExpirationDate(expiresDays);
			parts.push(`expires=${expirationDate}`);
		}
	}

	/**
	 * Serialize cookie options into cookie string format
	 */
	private serializeOptions(options: CookieOptions): string {
		const parts: string[] = [];
		const opts: CookieOptions = {
			...this.defaultOptions,
			...options,
		};

		this.serializeExpiration(opts.expiresDays, parts);

		if (opts.path) {
			parts.push(`path=${opts.path}`);
		}

		if (opts.domain) {
			parts.push(`domain=${opts.domain}`);
		}

		if (opts.sameSite) {
			parts.push(`sameSite=${opts.sameSite}`);
		}

		if (opts.secure) {
			parts.push('secure');
		}

		return parts.length > 0 ? `; ${parts.join('; ')}` : '';
	}

	/**
	 * Set a cookie with optional configuration
	 */
	setItemWithOptions(key: string, value: string, options: CookieOptions = {}): boolean {
		if (!this.isAvailable || typeof document === 'undefined') {
			return false;
		}

		try {
			const encodedValue = encodeURIComponent(value);
			const optionsString = this.serializeOptions(options);
			document.cookie = `${key}=${encodedValue}${optionsString}`;
			return true;
		} catch (error) {
			this.logWarn(`Failed to set cookie`, {
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
			const cookies = this.parseCookies();
			return cookies.get(key) ?? null;
		} catch (error) {
			this.logWarn(`Failed to get cookie`, {
				error: error instanceof Error ? error.message : String(error),
			});
			return null;
		}
	}

	setItem(key: string, value: string): boolean {
		// Use default options for standard setItem (expires in 365 days)
		return this.setItemWithOptions(key, value, { expiresDays: 365 });
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
			const cookies = this.parseCookies();
			let allRemoved = true;
			for (const key of cookies.keys()) {
				// Validate key to prevent object injection
				if (typeof key === 'string' && !this.removeItem(key)) {
					allRemoved = false;
				}
			}
			return allRemoved;
		} catch (error) {
			this.logWarn(`Failed to clear cookies`, {
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
			const cookies = this.parseCookies();
			return cookies.size;
		} catch (error) {
			this.logWarn(`Failed to get cookie count`, {
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
			const cookies = this.parseCookies();
			const keys = Array.from(cookies.keys());
			// Map keys are always strings, but validate index access

			return keys[index] ?? null;
		} catch (error) {
			this.logWarn(`Failed to get cookie key`, {
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

// Re-export the CookieOptions type for convenience
export type { CookieOptions };
