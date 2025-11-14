/**
 * SEO DOM utilities - Main orchestrator
 * Applies SEO metadata to the document head
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
 *
 * This module orchestrates all SEO-related DOM updates by delegating to
 * specialized modules for different meta tag types.
 */

import { updateBasicMetaTags, updateCanonicalUrl } from '@core/utils/seo/seoDomUtils.basic';
import { updateCustomMetaTags } from '@core/utils/seo/seoDomUtils.custom';
import type { MergedSEOConfig } from '@core/utils/seo/seoDomUtils.helpers';
import { updateOpenGraphTags } from '@core/utils/seo/seoDomUtils.openGraph';
import { updateTwitterTags } from '@core/utils/seo/seoDomUtils.twitter';

/**
 * Apply all SEO metadata to the document
 *
 * Note: This function requires a browser environment with DOM APIs.
 * For SSR safety, ensure this is only called in client-side code (e.g., within useEffect).
 */
export function applySEOToDocument(seo: MergedSEOConfig): void {
	if (typeof document === 'undefined') {
		return;
	}

	if (document.title !== seo.title) {
		document.title = seo.title;
	}

	updateBasicMetaTags(seo);
	updateCanonicalUrl(seo.canonicalUrl);
	updateOpenGraphTags(seo);
	updateTwitterTags(seo);
	updateCustomMetaTags(seo);
}
