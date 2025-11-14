import { getDefaultSEO, mergeSEOConfig, type SEOConfig } from '@core/config/seo';
import { applySEOToDocument } from '@core/utils/seo/seoDomUtils';
import type { MergedSEOConfig } from '@core/utils/seo/seoDomUtils.helpers';
import { useEffect, useRef } from 'react';

/**
 * Store current SEO state before applying new config
 * This allows restoration on unmount
 */
function storeCurrentSEO(): MergedSEOConfig {
	// Capture current document state
	const currentTitle = document.title;
	const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
	const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

	// Build a config object from current state (simplified - only captures key fields)
	// For full restoration, we'd need to capture all meta tags, but this covers the essentials
	return mergeSEOConfig({
		title: currentTitle,
		description: descriptionMeta?.content ?? '',
		canonicalUrl: canonicalLink?.href ?? '',
	});
}

/**
 * Hook to update document head metadata (SEO)
 * Updates title, meta tags, Open Graph, and Twitter Card tags
 *
 * Automatically restores previous SEO config (or defaults) on unmount,
 * preventing SEO metadata from persisting when components unmount.
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   useSEO({
 *     title: 'My Page',
 *     description: 'This is my page',
 *     ogImage: '/my-image.png',
 *   });
 *
 *   return <div>My Page Content</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multiple components can use useSEO - each restores on unmount
 * function App() {
 *   return (
 *     <Router>
 *       <Route path="/" element={<HomePage />} /> // Uses default SEO
 *       <Route path="/about" element={<AboutPage />} /> // Uses custom SEO
 *     </Router>
 *   );
 * }
 * ```
 *
 * @param config - SEO configuration (partial, will be merged with defaults)
 */
export function useSEO(config: SEOConfig = {}): void {
	const seo = mergeSEOConfig(config);
	const previousSEORef = useRef<MergedSEOConfig | null>(null);
	const isFirstMountRef = useRef(true);

	useEffect(() => {
		// Store previous SEO on first mount (before applying new config)
		if (isFirstMountRef.current) {
			// Try to capture current state, but if document isn't ready, use defaults
			if (typeof document === 'undefined') {
				previousSEORef.current = getDefaultSEO();
			} else {
				try {
					previousSEORef.current = storeCurrentSEO();
				} catch {
					// If storage fails, use defaults as fallback
					previousSEORef.current = getDefaultSEO();
				}
			}
			isFirstMountRef.current = false;
		}

		// Apply new SEO config
		applySEOToDocument(seo);

		// Cleanup: restore previous SEO on unmount
		return (): void => {
			const previousSEO = previousSEORef.current ?? getDefaultSEO();
			applySEOToDocument(previousSEO);
		};
	}, [seo]);
}
