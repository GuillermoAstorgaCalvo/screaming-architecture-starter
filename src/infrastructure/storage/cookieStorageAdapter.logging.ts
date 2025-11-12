/**
 * Cookie storage adapter logging utilities
 *
 * SSR-safe logging functions for cookie operations.
 * Uses console directly to avoid circular dependencies with logger adapter.
 */

/**
 * Log warning message (SSR-safe console fallback)
 * Uses console directly to avoid circular dependencies with logger adapter
 *
 * @param message - Warning message to log
 * @param context - Optional context object to include in the log
 */
export function logCookieWarn(message: string, context?: Record<string, unknown>): void {
	if (typeof console !== 'undefined') {
		if (context) {
			console.warn(message, context);
		} else {
			console.warn(message);
		}
	}
}
