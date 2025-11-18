/**
 * HTML Escaping Utilities
 *
 * Provides utilities for escaping HTML special characters to prevent XSS attacks.
 * SSR-safe: falls back to basic entity escaping in non-browser environments.
 */

import { MAX_ESCAPE_LENGTH } from '@core/security/sanitize/sanitizeHtmlConstants';

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
	// Handle null/undefined for runtime safety (defensive programming)
	// String(null) returns 'null', String(undefined) returns 'undefined'
	// But we want null to return empty string per test expectations
	// Using type assertion for defensive null check (tests pass null with @ts-expect-error)
	if ((text as unknown) === null) {
		return '';
	}

	const textStr = String(text);

	// Limit input length to prevent DoS attacks
	// Worst case expansion is 4x (e.g., '<' becomes '&lt;'), so we can safely process
	// up to MAX_ESCAPE_LENGTH characters for plain text, or MAX_ESCAPE_LENGTH / 4 for worst case
	// We'll truncate input to MAX_ESCAPE_LENGTH to be safe, then truncate output if needed
	const maxInputLength = MAX_ESCAPE_LENGTH;
	let safeText = textStr;
	if (textStr.length > maxInputLength) {
		// Truncate to safe length before escaping
		safeText = textStr.slice(0, maxInputLength);
	}

	if (typeof document === 'undefined') {
		// SSR-safe fallback: basic HTML entity escaping without DOM
		// Must escape & first to avoid double-escaping
		let escaped = safeText
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&#39;');
		// Ensure output doesn't exceed MAX_ESCAPE_LENGTH
		if (escaped.length > MAX_ESCAPE_LENGTH) {
			escaped = escaped.slice(0, MAX_ESCAPE_LENGTH);
		}
		return escaped;
	}

	const div = document.createElement('div');
	div.textContent = safeText;
	// textContent escapes <, >, and & but not quotes
	// We need to manually escape quotes for consistency
	let escaped = div.innerHTML.replaceAll('"', '&quot;').replaceAll("'", '&#39;');
	// Ensure output doesn't exceed MAX_ESCAPE_LENGTH
	if (escaped.length > MAX_ESCAPE_LENGTH) {
		escaped = escaped.slice(0, MAX_ESCAPE_LENGTH);
	}
	return escaped;
}
