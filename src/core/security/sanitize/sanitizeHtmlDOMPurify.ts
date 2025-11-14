/**
 * DOMPurify Integration
 *
 * Provides integration with DOMPurify library if available.
 * Falls back to basic sanitization if DOMPurify is not loaded.
 */

import { sanitizeHtml } from '@core/security/sanitize/sanitizeHtml';
import { DEFAULT_CONFIG, MAX_HTML_LENGTH } from '@core/security/sanitize/sanitizeHtmlConstants';
import type {
	SanitizeConfig,
	WindowWithDOMPurify,
} from '@core/security/sanitize/sanitizeHtmlTypes';

/**
 * Type guard to check if DOMPurify is available
 * Useful for projects that optionally include DOMPurify
 */
export function isDOMPurifyAvailable(): boolean {
	try {
		const win = globalThis.window as WindowWithDOMPurify | undefined;
		return win?.DOMPurify !== undefined;
	} catch {
		return false;
	}
}

/**
 * Validates HTML input and checks length limits
 * Returns empty string if invalid or too long
 */
export function validateHtmlInput(html: string): string {
	if (!html) {
		return '';
	}

	// Limit HTML length to prevent DoS attacks
	if (html.length > MAX_HTML_LENGTH) {
		return '';
	}

	return html;
}

/**
 * Sanitizes HTML using DOMPurify if available
 */
function sanitizeWithDOMPurify(html: string, config?: SanitizeConfig): string | null {
	if (!isDOMPurifyAvailable()) {
		return null;
	}

	const win = globalThis.window as WindowWithDOMPurify;
	const domPurify = win.DOMPurify;
	if (!domPurify) {
		return null;
	}

	return domPurify.sanitize(html, {
		ALLOWED_TAGS: config?.allowedTags ?? DEFAULT_CONFIG.allowedTags,
		ALLOWED_ATTR: config?.allowedAttributes
			? Object.values(config.allowedAttributes).flat()
			: ['href', 'title', 'target', 'rel'],
	});
}

/**
 * Sanitizes HTML using DOMPurify if available, otherwise falls back to basic sanitization
 *
 * @param html - The HTML string to sanitize
 * @param config - Optional sanitization configuration (used only if DOMPurify is not available)
 * @returns Sanitized HTML string
 *
 * @example
 * ```ts
 * // If DOMPurify is loaded, it will be used
 * // Otherwise, falls back to basic sanitization
 * const safe = sanitizeHtmlWithDOMPurify(userHtmlInput);
 * ```
 */
export function sanitizeHtmlWithDOMPurify(html: string, config?: SanitizeConfig): string {
	const validatedHtml = validateHtmlInput(html);
	if (!validatedHtml) {
		return '';
	}

	const domPurifyResult = sanitizeWithDOMPurify(validatedHtml, config);
	if (domPurifyResult !== null) {
		return domPurifyResult;
	}

	return sanitizeHtml(validatedHtml, config);
}
