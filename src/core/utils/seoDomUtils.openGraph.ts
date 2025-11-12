/**
 * Open Graph meta tags utilities
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
 * Update basic Open Graph meta tags (type, title, description, url, locale)
 *
 * @param seo - Merged SEO configuration object
 */
function updateOpenGraphBasicTags(seo: MergedSEOConfig): void {
	const tags = [
		{ property: 'og:type', content: seo.ogType },
		{ property: 'og:title', content: seo.title },
		{ property: 'og:description', content: seo.description },
		{ property: 'og:url', content: seo.canonicalUrl },
		{ property: 'og:locale', content: seo.ogLocale },
	] as const;

	for (const tag of tags) {
		updateMetaTag({
			selector: `meta[property="${tag.property}"]`,
			attribute: 'property',
			value: tag.property,
			content: tag.content,
		});
	}
}

/**
 * Update Open Graph image meta tags
 *
 * @param seo - Merged SEO configuration object
 */
function updateOpenGraphImageTags(seo: MergedSEOConfig): void {
	updateMetaTag({
		selector: 'meta[property="og:image"]',
		attribute: 'property',
		value: 'og:image',
		content: seo.ogImage,
	});
	updateMetaTag({
		selector: 'meta[property="og:image:width"]',
		attribute: 'property',
		value: 'og:image:width',
		content: seo.ogImageWidth.toString(),
	});
	updateMetaTag({
		selector: 'meta[property="og:image:height"]',
		attribute: 'property',
		value: 'og:image:height',
		content: seo.ogImageHeight.toString(),
	});
	updateMetaTag({
		selector: 'meta[property="og:image:alt"]',
		attribute: 'property',
		value: 'og:image:alt',
		content: seo.ogImageAlt,
	});
}

/**
 * Update Open Graph meta tags
 *
 * Updates all Open Graph meta tags including basic tags (type, title, description, url, locale)
 * and image tags (image, image:width, image:height, image:alt).
 *
 * @param seo - Merged SEO configuration object
 */
export function updateOpenGraphTags(seo: MergedSEOConfig): void {
	updateOpenGraphBasicTags(seo);
	updateOpenGraphImageTags(seo);
}
