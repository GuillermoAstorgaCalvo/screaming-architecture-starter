/**
 * HTML Sanitization Helper Functions
 *
 * Internal helper functions for processing and sanitizing HTML elements.
 */

import { DEFAULT_CONFIG } from '@core/security/sanitize/sanitizeHtmlConstants';
import type { SanitizeConfig } from '@core/security/sanitize/sanitizeHtmlTypes';

/**
 * Merges sanitization config with defaults
 * Deep merges allowedAttributes to combine per-tag attributes
 */
export function mergeSanitizeConfig(config?: SanitizeConfig): Required<SanitizeConfig> {
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
export function removeDangerousElements(container: HTMLElement): void {
	const dangerousSelectors = 'script, style, iframe, object, embed';
	const dangerousElements = container.querySelectorAll(dangerousSelectors);
	for (const el of dangerousElements) {
		el.remove();
	}
}

/**
 * Removes a disallowed tag, moving its children to the parent
 */
export function removeDisallowedTag(element: Element): void {
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
export function isDangerousAttribute(attr: Attr): boolean {
	return attr.name.startsWith('on') || attr.value.toLowerCase().trim().startsWith('javascript:');
}

/**
 * Validates URL scheme for href/src attributes
 * Security note: data URIs are allowed but should be used with caution.
 * Consider restricting data URIs for specific use cases (e.g., images only).
 */
export function validateUrlAttribute(attr: Attr, allowedSchemes: string[]): boolean {
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
export function processElementAttributes(element: Element, config: Required<SanitizeConfig>): void {
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
export function addSecurityAttributesToLink(element: Element): void {
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
export function processElement(element: Element, config: Required<SanitizeConfig>): void {
	const tagName = element.tagName.toLowerCase();

	if (!config.allowedTags.includes(tagName)) {
		removeDisallowedTag(element);
		return;
	}

	processElementAttributes(element, config);
	addSecurityAttributesToLink(element);
}
