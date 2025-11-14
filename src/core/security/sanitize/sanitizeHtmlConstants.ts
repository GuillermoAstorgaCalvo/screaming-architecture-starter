/**
 * HTML Sanitization Constants
 *
 * Constants and default configuration for HTML sanitization utilities.
 */

import type { SanitizeConfig } from './sanitizeHtmlTypes';

/**
 * Maximum text length for HTML escaping (1MB)
 * Prevents DoS attacks via extremely long strings
 */
export const BYTES_PER_KB = 1024;
export const KB_PER_MB = 1024;
export const MAX_ESCAPE_LENGTH = BYTES_PER_KB * KB_PER_MB;

/**
 * Maximum HTML length to prevent DoS attacks via extremely large inputs
 * Adjust based on your use case (default: 1MB)
 */
export const MAX_HTML_LENGTH = BYTES_PER_KB * KB_PER_MB;

/**
 * Default safe configuration for HTML sanitization
 */
export const DEFAULT_CONFIG: Required<SanitizeConfig> = {
	allowedTags: [
		'p',
		'br',
		'strong',
		'em',
		'u',
		's',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'ul',
		'ol',
		'li',
		'a',
		'blockquote',
		'code',
		'pre',
	],
	allowedAttributes: {
		a: ['href', 'title', 'target', 'rel'],
	},
	allowedSchemes: ['http', 'https', 'mailto'],
};
