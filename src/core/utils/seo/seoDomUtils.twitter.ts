/**
 * Twitter Card meta tags utilities
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

import { type MergedSEOConfig, updateMetaTag } from '@core/utils/seo/seoDomUtils.helpers';

/**
 * Update Twitter Card meta tags
 *
 * Updates all Twitter Card meta tags including card type, title, description, image, and image alt text.
 *
 * @param seo - Merged SEO configuration object
 */
export function updateTwitterTags(seo: MergedSEOConfig): void {
	const tags = [
		{ name: 'twitter:card', content: seo.twitterCard },
		{ name: 'twitter:title', content: seo.title },
		{ name: 'twitter:description', content: seo.description },
		{ name: 'twitter:image', content: seo.twitterImage },
		{ name: 'twitter:image:alt', content: seo.twitterImageAlt },
	];

	for (const tag of tags) {
		updateMetaTag({
			selector: `meta[name="${tag.name}"]`,
			attribute: 'name',
			value: tag.name,
			content: tag.content,
		});
	}
}
