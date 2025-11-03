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
/**
 * Maximum text length for HTML escaping (1MB)
 * Prevents DoS attacks via extremely long strings
 */
const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;
const MAX_ESCAPE_LENGTH = BYTES_PER_KB * KB_PER_MB;

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
	return div.innerHTML;
}

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
 * Default safe configuration for HTML sanitization
 */
const DEFAULT_CONFIG: Required<SanitizeConfig> = {
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

/**
 * Merges sanitization config with defaults
 * Deep merges allowedAttributes to combine per-tag attributes
 */
function mergeSanitizeConfig(config?: SanitizeConfig): Required<SanitizeConfig> {
	const allowedAttributes = { ...DEFAULT_CONFIG.allowedAttributes };
	if (config?.allowedAttributes) {
		// Deep merge allowedAttributes: merge arrays per tag
		for (const [tag, attrs] of Object.entries(config.allowedAttributes)) {
			const existingAttrs = allowedAttributes[tag] ?? [];
			// Combine and deduplicate attributes
			allowedAttributes[tag] = Array.from(
				new Set([...existingAttrs, ...(Array.isArray(attrs) ? attrs : [])])
			);
		}
	}

	return {
		allowedTags: config?.allowedTags ?? DEFAULT_CONFIG.allowedTags,
		allowedAttributes,
		allowedSchemes: config?.allowedSchemes ?? DEFAULT_CONFIG.allowedSchemes,
	};
}

/**
 * Removes dangerous elements from DOM (script, style, iframe, etc.)
 */
function removeDangerousElements(container: HTMLElement): void {
	const dangerousSelectors = 'script, style, iframe, object, embed';
	const dangerousElements = container.querySelectorAll(dangerousSelectors);
	for (const el of dangerousElements) {
		el.remove();
	}
}

/**
 * Removes a disallowed tag, moving its children to the parent
 */
function removeDisallowedTag(element: Element): void {
	const parent = element.parentNode;
	if (!parent) {
		return;
	}

	while (element.firstChild) {
		parent.insertBefore(element.firstChild, element);
	}
	element.remove();
}

/**
 * Checks if an attribute is dangerous (event handlers, javascript: URLs)
 */
function isDangerousAttribute(attr: Attr): boolean {
	return attr.name.startsWith('on') || attr.value.toLowerCase().trim().startsWith('javascript:');
}

/**
 * Validates URL scheme for href/src attributes
 * Security note: data URIs are allowed but should be used with caution.
 * Consider restricting data URIs for specific use cases (e.g., images only).
 */
function validateUrlAttribute(attr: Attr, allowedSchemes: string[]): boolean {
	if (!attr.value) {
		return true;
	}

	const url = attr.value.toLowerCase().trim();
	const hasAllowedScheme = allowedSchemes.some(scheme => url.startsWith(`${scheme}:`));
	const isRelative = url.startsWith('/') || url.startsWith('#') || url.startsWith('?');

	// Data URIs are potentially dangerous - only allow if explicitly in allowedSchemes
	// or if the scheme list includes 'data'
	const isDataUri = url.startsWith('data:');
	const dataAllowed = allowedSchemes.includes('data') || allowedSchemes.includes('data:');

	return hasAllowedScheme || isRelative || (isDataUri && dataAllowed);
}

/**
 * Processes attributes for a single element
 */
function processElementAttributes(element: Element, config: Required<SanitizeConfig>): void {
	const tagName = element.tagName.toLowerCase();
	const allowedAttrs = config.allowedAttributes[tagName] ?? [];
	const attributes = Array.from(element.attributes);

	for (const attr of attributes) {
		if (isDangerousAttribute(attr)) {
			element.removeAttribute(attr.name);
			continue;
		}

		if (!allowedAttrs.includes(attr.name)) {
			element.removeAttribute(attr.name);
			continue;
		}

		if (
			(attr.name === 'href' || attr.name === 'src') &&
			attr.value &&
			!validateUrlAttribute(attr, config.allowedSchemes)
		) {
			element.removeAttribute(attr.name);
		}
	}
}

/**
 * Adds security attributes to anchor links
 */
function addSecurityAttributesToLink(element: Element): void {
	if (element.tagName.toLowerCase() !== 'a' || !element.hasAttribute('href')) {
		return;
	}

	const href = element.getAttribute('href');
	if (href && !href.startsWith('#')) {
		element.setAttribute('target', '_blank');
		element.setAttribute('rel', 'noopener noreferrer');
	}
}

/**
 * Processes a single element: removes if disallowed, processes attributes, adds security attrs
 */
function processElement(element: Element, config: Required<SanitizeConfig>): void {
	const tagName = element.tagName.toLowerCase();

	if (!config.allowedTags.includes(tagName)) {
		removeDisallowedTag(element);
		return;
	}

	processElementAttributes(element, config);
	addSecurityAttributesToLink(element);
}

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
/**
 * Maximum HTML length to prevent DoS attacks via extremely large inputs
 * Adjust based on your use case (default: 1MB)
 */
const MAX_HTML_LENGTH = BYTES_PER_KB * KB_PER_MB;

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

/**
 * Type definition for DOMPurify configuration
 */
interface DOMPurifyConfig {
	ALLOWED_TAGS?: string[];
	ALLOWED_ATTR?: string[];
}

/**
 * Type definition for DOMPurify API
 */
interface DOMPurifyAPI {
	sanitize(html: string, config?: DOMPurifyConfig): string;
}

/**
 * Extended Window interface that may include DOMPurify
 */
interface WindowWithDOMPurify extends Window {
	DOMPurify?: DOMPurifyAPI;
}

/**
 * Type guard to check if DOMPurify is available
 * Useful for projects that optionally include DOMPurify
 */
function isDOMPurifyAvailable(): boolean {
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
function validateHtmlInput(html: string): string {
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
