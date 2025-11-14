/**
 * Shared helper functions and types for SEO DOM utilities
 *
 * Framework Agnostic:
 * This utility is in `core/utils/` (not `core/lib/`) because it:
 * - Uses DOM APIs but guards them with SSR checks (typeof document === 'undefined')
 * - Is a pure function with no framework dependencies
 * - Can be used in any JavaScript context that has DOM APIs available
 *
 * See: src/core/README.md for distinction between `lib/` and `utils/`
 *
 * Note: This module requires a browser environment with DOM APIs.
 * For SSR safety, ensure this is only called in client-side code.
 */

import type { mergeSEOConfig } from '@core/config/seo';

/**
 * Type for merged SEO configuration
 * Derived from the return type of mergeSEOConfig function
 */

export type MergedSEOConfig = ReturnType<typeof mergeSEOConfig>;

/**
 * Options for updating a meta tag
 */
export interface UpdateMetaTagOptions {
	selector: string;
	attribute: 'name' | 'property';
	value: string;
	content: string;
}

/**
 * Update or create a meta tag in the document head
 *
 * If the meta tag doesn't exist, it will be created. If it exists, its content will be updated.
 *
 * @param options - Options for updating the meta tag
 * @param options.selector - CSS selector to find the meta tag
 * @param options.attribute - Attribute type ('name' or 'property')
 * @param options.value - Attribute value
 * @param options.content - Meta tag content value
 */
export function updateMetaTag({ selector, attribute, value, content }: UpdateMetaTagOptions): void {
	if (typeof document === 'undefined') {
		return;
	}

	let element = document.querySelector<HTMLMetaElement>(selector);
	if (!element) {
		element = document.createElement('meta');
		element.setAttribute(attribute, value);
		document.head.append(element);
	}
	element.content = content;
}
