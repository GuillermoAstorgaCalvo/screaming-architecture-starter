/**
 * HTML Sanitization Utilities
 *
 * Provides utilities for sanitizing untrusted HTML content to prevent XSS attacks.
 *
 * Framework Agnostic:
 * This utility is in `core/security/` because it:
 * - Has minimal framework dependencies (browser/DOM context required)
 * - Provides security-critical sanitization functions
 * - Can be used across the application for any HTML content
 *
 * Note: This module requires a DOM environment (browser). For Node.js contexts,
 * consider using server-side sanitization libraries or generating hashes at build time.
 *
 * Security Principles:
 * - Never render user-provided HTML without sanitization
 * - Avoid `dangerouslySetInnerHTML` unless content is sanitized
 * - Default to text escaping for untrusted content
 *
 * @example
 * ```ts
 * // Basic text escaping (safest option)
 * const safe = escapeHtml(userInput);
 * // Use in JSX: <div>{safe}</div>
 *
 * // HTML sanitization (when HTML is required)
 * const sanitized = sanitizeHtml(userHtmlInput);
 * // Use with dangerouslySetInnerHTML: <div dangerouslySetInnerHTML={{ __html: sanitized }} />
 * ```
 *
 * @see .cursor/rules/security/security-privacy.mdc
 */

import { MAX_HTML_LENGTH } from '@core/security/sanitize/sanitizeHtmlConstants';
import { escapeHtml } from '@core/security/sanitize/sanitizeHtmlEscape';
import {
	mergeSanitizeConfig,
	processElement,
	removeDangerousElements,
} from '@core/security/sanitize/sanitizeHtmlHelpers';
import type { SanitizeConfig } from '@core/security/sanitize/sanitizeHtmlTypes';

/**
 * Sanitizes HTML content by removing potentially dangerous elements and attributes
 *
 * Note: This is a basic implementation. For production use with complex HTML,
 * consider using a library like DOMPurify (https://github.com/cure53/DOMPurify).
 * This function provides a lightweight alternative for simple use cases.
 *
 * @param html - The HTML string to sanitize
 * @param config - Optional sanitization configuration
 * @returns Sanitized HTML string safe for rendering
 *
 * @example
 * ```ts
 * const userContent = '<p>Hello <script>alert("xss")</script>World</p>';
 * const safe = sanitizeHtml(userContent);
 * // => '<p>Hello World</p>'
 * ```
 */
export function sanitizeHtml(html: string, config?: SanitizeConfig): string {
	if (!html) {
		return '';
	}

	// Limit HTML length to prevent DoS attacks
	if (html.length > MAX_HTML_LENGTH) {
		// Truncate or return empty - truncation is safer than processing huge strings
		return '';
	}

	if (typeof document === 'undefined') {
		// SSR-safe fallback: return escaped HTML (most secure option without DOM)
		return escapeHtml(html);
	}

	const configWithDefaults = mergeSanitizeConfig(config);
	const temp = document.createElement('div');
	temp.innerHTML = html;

	removeDangerousElements(temp);

	const allElements = temp.querySelectorAll('*');
	for (const element of allElements) {
		processElement(element, configWithDefaults);
	}

	return temp.innerHTML;
}
