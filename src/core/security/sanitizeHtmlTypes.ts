/**
 * HTML Sanitization Types
 *
 * Type definitions for HTML sanitization utilities.
 */

/**
 * Configuration for HTML sanitization
 */
export interface SanitizeConfig {
	/**
	 * Allowed HTML tags (whitelist approach)
	 * If undefined, uses default safe set
	 */
	allowedTags?: string[];

	/**
	 * Allowed HTML attributes per tag
	 * Format: { tagName: ['attr1', 'attr2'] }
	 */
	allowedAttributes?: Record<string, string[]>;

	/**
	 * Allowed URL schemes for href/src attributes
	 * Default: ['http', 'https', 'mailto']
	 */
	allowedSchemes?: string[];
}

/**
 * Type definition for DOMPurify configuration
 */
export interface DOMPurifyConfig {
	ALLOWED_TAGS?: string[];
	ALLOWED_ATTR?: string[];
}

/**
 * Type definition for DOMPurify API
 */
export interface DOMPurifyAPI {
	sanitize(html: string, config?: DOMPurifyConfig): string;
}

/**
 * Extended Window interface that may include DOMPurify
 */
export interface WindowWithDOMPurify extends Window {
	DOMPurify?: DOMPurifyAPI;
}
