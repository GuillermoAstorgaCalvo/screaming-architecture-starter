/**
 * Port-related types
 *
 * These types represent the hexagonal architecture ports/interfaces
 * that define contracts between domains and infrastructure.
 */

/**
 * Port adapter configuration
 */
export interface PortAdapterConfig {
	/** Adapter name/identifier */
	name: string;
	/** Whether the adapter is enabled */
	enabled?: boolean;
	/** Adapter-specific configuration */
	config?: Record<string, unknown>;
}

/**
 * Storage adapter configuration
 */
export interface StorageAdapterConfig extends PortAdapterConfig {
	/** Storage type */
	type: 'localStorage' | 'sessionStorage' | 'cookie' | 'memory';
	/** Prefix for all storage keys */
	keyPrefix?: string;
	/** Storage options */
	options?: {
		/** Default expiration time in milliseconds */
		defaultExpiration?: number;
		/** Whether to encrypt stored values */
		encrypt?: boolean;
	};
}

/**
 * Logger adapter configuration
 */
export interface LoggerAdapterConfig extends PortAdapterConfig {
	/** Minimum log level to output */
	minLevel?: 'debug' | 'info' | 'warn' | 'error';
	/** Whether to include timestamps */
	includeTimestamp?: boolean;
	/** Whether to include stack traces for errors */
	includeStackTrace?: boolean;
	/** Custom log formatter */
	formatter?: (level: string, message: string, context?: unknown) => string;
}

/**
 * HTTP adapter configuration
 */
export interface HttpAdapterConfig extends PortAdapterConfig {
	/** Base URL for all requests */
	baseURL?: string;
	/** Default timeout in milliseconds */
	defaultTimeout?: number;
	/** Default headers */
	defaultHeaders?: Record<string, string>;
	/** Whether to retry failed requests */
	retryOnFailure?: boolean;
	/** Maximum number of retry attempts */
	maxRetries?: number;
}

/**
 * Cookie storage options
 *
 * Configuration options for cookie-based storage adapters.
 */
export interface CookieOptions {
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
