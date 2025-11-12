import type { CookieOptions } from '@src-types/ports';

/**
 * Cookie storage adapter constants
 *
 * Default options and configuration for cookie-based storage.
 */

/**
 * Default cookie options
 * - path: defaults to '/' for app-wide access
 * - sameSite: defaults to 'Lax' for CSRF protection
 * - secure: defaults to true in HTTPS environments
 */
export function getDefaultCookieOptions(): Required<
	Pick<CookieOptions, 'path' | 'sameSite' | 'secure'>
> {
	const isSecure = globalThis.window?.location.protocol === 'https:';
	return {
		path: '/',
		sameSite: 'Lax',
		secure: isSecure ?? false,
	};
}

/**
 * Check if cookies are available in the current environment
 * Returns true if document and cookies are available (browser environment, not in SSR)
 */
export function isCookieStorageAvailable(): boolean {
	return typeof document !== 'undefined' && typeof document.cookie === 'string';
}

/**
 * Default expiration for cookies (in days)
 */
export const DEFAULT_COOKIE_EXPIRATION_DAYS = 365;

/**
 * Cookie deletion expiration date (past date to delete cookies)
 */
export const COOKIE_DELETE_EXPIRATION = 'Thu, 01 Jan 1970 00:00:00 GMT';
