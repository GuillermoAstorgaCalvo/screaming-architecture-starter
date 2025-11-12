/**
 * Custom meta tags utilities
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

import { type MergedSEOConfig, updateMetaTag } from './seoDomUtils.helpers';

/**
 * Update custom meta tags
 *
 * Updates custom meta tags defined in the SEO configuration. Supports both
 * name-based and property-based meta tags.
 *
 * @param seo - Merged SEO configuration object
 */
export function updateCustomMetaTags(seo: MergedSEOConfig): void {
	if (!seo.customMeta) {
		return;
	}

	for (const { name, property, content } of seo.customMeta) {
		if (property) {
			updateMetaTag({
				selector: `meta[property="${property}"]`,
				attribute: 'property',
				value: property,
				content,
			});
		} else if (name) {
			updateMetaTag({
				selector: `meta[name="${name}"]`,
				attribute: 'name',
				value: name,
				content,
			});
		}
	}
}
