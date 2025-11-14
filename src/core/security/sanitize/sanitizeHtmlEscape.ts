/**
 * HTML Escaping Utilities
 *
 * Provides utilities for escaping HTML special characters to prevent XSS attacks.
 * SSR-safe: falls back to basic entity escaping in non-browser environments.
 */

import { MAX_ESCAPE_LENGTH } from './sanitizeHtmlConstants';

/**
 * Escape HTML special characters to prevent XSS
 * Converts HTML special characters to their entity equivalents
 *
 * @param text - The text to escape
 * @returns Escaped HTML-safe string
 *
 * @example
 * ```ts
 * escapeHtml('<script>alert("xss")</script>');
 * // => '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(text: string): string {
	const textStr = String(text);

	// Limit text length to prevent DoS attacks
	let safeText = textStr;
	if (textStr.length > MAX_ESCAPE_LENGTH) {
		// Truncate to safe length (arbitrary but reasonable)
		// Note: This truncation might break entities, but it's safer than processing huge strings
		// For production, consider throwing an error or logging a warning
		safeText = textStr.slice(0, MAX_ESCAPE_LENGTH);
	}

	if (typeof document === 'undefined') {
		// SSR-safe fallback: basic HTML entity escaping without DOM
		// Must escape & first to avoid double-escaping
		return safeText
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#39;');
	}

	const div = document.createElement('div');
	div.textContent = safeText;
	// textContent escapes <, >, and & but not quotes
	// We need to manually escape quotes for consistency
	return div.innerHTML.replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}
