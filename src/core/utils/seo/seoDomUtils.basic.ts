/**
 * Basic meta tags and canonical URL utilities
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
 * Helper to update a name-based meta tag
 *
 * @param name - Meta tag name attribute value
 * @param content - Meta tag content value
 */
function updateNameMetaTag(name: string, content: string): void {
	updateMetaTag({
		selector: `meta[name="${name}"]`,
		attribute: 'name',
		value: name,
		content,
	});
}

/**
 * Update basic meta tags (description, robots, keywords, author)
 *
 * @param seo - Merged SEO configuration object
 */
export function updateBasicMetaTags(seo: MergedSEOConfig): void {
	updateNameMetaTag('description', seo.description);

	const robotsContent = seo.indexable ? 'index, follow' : 'noindex, nofollow';
	updateNameMetaTag('robots', robotsContent);

	if (seo.keywords) {
		updateNameMetaTag('keywords', seo.keywords);
	}

	if (seo.author) {
		updateNameMetaTag('author', seo.author);
	}
}

/**
 * Update canonical URL link
 *
 * Creates or updates the canonical link element in the document head.
 *
 * @param canonicalUrl - Canonical URL to set
 */
export function updateCanonicalUrl(canonicalUrl: string): void {
	if (typeof document === 'undefined') {
		return;
	}

	let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
	if (!canonicalLink) {
		canonicalLink = document.createElement('link');
		canonicalLink.rel = 'canonical';
		document.head.append(canonicalLink);
	}
	canonicalLink.href = canonicalUrl;
}
