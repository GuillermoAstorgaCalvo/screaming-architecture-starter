/**
 * Timeout constants
 * Central source of truth for network and UI timeout values
 * Use these constants instead of hardcoding timeout values throughout the codebase
 *
 * All values are in milliseconds
 */

/**
 * HTTP/Network timeouts
 * Used for API requests, fetch calls, and network operations
 */
export const HTTP_TIMEOUTS = {
	/** Default timeout for HTTP requests */
	DEFAULT: 30000, // 30 seconds
	/** Short timeout for quick operations (health checks, etc.) */
	SHORT: 5000, // 5 seconds
	/** Long timeout for slow operations (file uploads, etc.) */
	LONG: 60000, // 60 seconds
	/** Extended timeout for very slow operations */
	EXTENDED: 120000, // 2 minutes
} as const;

/**
 * UI/Interaction timeouts
 * Used for debounce, throttle, and user interaction delays
 */
export const UI_TIMEOUTS = {
	/** Default debounce delay for search inputs and form inputs */
	DEBOUNCE_DEFAULT: 300, // 300ms
	/** Short debounce for real-time updates */
	DEBOUNCE_SHORT: 150, // 150ms
	/** Long debounce for expensive operations */
	DEBOUNCE_LONG: 500, // 500ms
	/** Default throttle delay for scroll/resize handlers */
	THROTTLE_DEFAULT: 100, // 100ms
	/** Short throttle for frequent events */
	THROTTLE_SHORT: 50, // 50ms
	/** Long throttle for infrequent updates */
	THROTTLE_LONG: 200, // 200ms
	/** Delay before showing loading states (prevents flash) */
	LOADING_DELAY: 200, // 200ms
	/** Delay before showing tooltips */
	TOOLTIP_DELAY: 500, // 500ms
	/** Delay before hiding tooltips */
	TOOLTIP_HIDE_DELAY: 100, // 100ms
	/** Delay for toast notifications */
	TOAST_DELAY: 3000, // 3 seconds
} as const;

/**
 * Retry and polling timeouts
 * Used for retry mechanisms and polling operations
 */
export const RETRY_TIMEOUTS = {
	/** Initial delay before first retry */
	INITIAL_RETRY_DELAY: 1000, // 1 second
	/** Maximum delay between retries */
	MAX_RETRY_DELAY: 10000, // 10 seconds
	/** Default polling interval */
	POLLING_INTERVAL: 5000, // 5 seconds
	/** Short polling interval */
	POLLING_INTERVAL_SHORT: 2000, // 2 seconds
	/** Long polling interval */
	POLLING_INTERVAL_LONG: 30000, // 30 seconds
} as const;

/**
 * Type exports for type-safe usage
 */
export type HttpTimeout = (typeof HTTP_TIMEOUTS)[keyof typeof HTTP_TIMEOUTS];
export type UiTimeout = (typeof UI_TIMEOUTS)[keyof typeof UI_TIMEOUTS];
export type RetryTimeout = (typeof RETRY_TIMEOUTS)[keyof typeof RETRY_TIMEOUTS];
