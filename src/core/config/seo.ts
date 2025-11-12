import { designTokens } from '@core/constants/designTokens';

/**
 * SEO & Metadata Configuration
 * Centralized SEO defaults and helper functions for dynamic metadata management
 * Enables per-route metadata updates and improves sharing/discoverability
 *
 * See: .cursor/rules/ux/seo.mdc
 */

/**
 * Default SEO configuration
 * These values are used as fallbacks when route-specific metadata is not provided
 * Theme colors are derived from design tokens to maintain consistency
 */
export const DEFAULT_SEO = {
	title: 'Screaming Architecture Starter',
	description: 'A modern, scalable React application starter template',
	siteName: 'Screaming Architecture Starter',
	locale: 'en_US',
	robots: 'index, follow',
	themeColorLight: designTokens.color.primary.DEFAULT,
	themeColorDark: designTokens.color.surface.dark,
	colorScheme: 'light dark',
	ogImage: '/og-image.png',
	ogImageWidth: 1200,
	ogImageHeight: 630,
	twitterCard: 'summary_large_image' as const,
	appleMobileWebAppTitle: 'SAS',
} as const;

/**
 * SEO metadata configuration for a route/page
 */
export interface SEOConfig {
	/** Page title (will be appended to site name if provided) */
	title?: string;
	/** Page description (meta description) */
	description?: string;
	/** Whether page should be indexed by search engines */
	indexable?: boolean;
	/** Canonical URL (relative or absolute) */
	canonicalUrl?: string;
	/** Open Graph type (default: 'website') */
	ogType?: 'website' | 'article' | 'profile' | 'book' | 'music' | 'video';
	/** Open Graph image URL (relative or absolute) */
	ogImage?: string;
	/** Open Graph image width */
	ogImageWidth?: number;
	/** Open Graph image height */
	ogImageHeight?: number;
	/** Open Graph image alt text */
	ogImageAlt?: string;
	/** Open Graph locale */
	ogLocale?: string;
	/** Twitter card type */
	twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
	/** Twitter image URL (relative or absolute) */
	twitterImage?: string;
	/** Twitter image alt text */
	twitterImageAlt?: string;
	/** Additional keywords (comma-separated) */
	keywords?: string;
	/** Author name */
	author?: string;
	/** Custom meta tags */
	customMeta?: Array<{ name?: string; property?: string; content: string }>;
}

/**
 * Build full page title from title and site name
 *
 * @param title - Page title
 * @param siteName - Site name (defaults to DEFAULT_SEO.siteName)
 * @returns Full title with site name
 */
export function buildPageTitle(title?: string, siteName: string = DEFAULT_SEO.siteName): string {
	if (!title) return siteName;
	return `${title} | ${siteName}`;
}

/**
 * Build absolute URL from relative path
 * Uses globalThis.window.location.origin in browser, falls back to relative path in SSR
 *
 * @param path - Relative or absolute URL
 * @returns Absolute URL
 */
export function buildAbsoluteUrl(path: string): string {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- SSR check
	if (globalThis.window === undefined) {
		// SSR fallback - return as-is if already absolute
		return path;
	}

	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path;
	}

	const { origin } = globalThis.window.location;
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return `${origin}${normalizedPath}`;
}

/**
 * Build robots meta tag content
 *
 * @param indexable - Whether page should be indexed
 * @returns Robots meta content
 */
export function buildRobotsContent(indexable?: boolean): string {
	if (indexable === false) {
		return 'noindex, nofollow';
	}
	return DEFAULT_SEO.robots;
}

/**
 * Build Open Graph image URL
 * Uses provided image or falls back to default
 *
 * @param ogImage - Open Graph image URL
 * @returns Absolute URL for Open Graph image
 */
export function buildOgImageUrl(ogImage?: string): string {
	const imageUrl = ogImage ?? DEFAULT_SEO.ogImage;
	return buildAbsoluteUrl(imageUrl);
}

/**
 * Build Twitter image URL
 * Uses provided image or falls back to Open Graph image
 *
 * @param twitterImage - Twitter image URL
 * @param ogImage - Open Graph image URL (fallback)
 * @returns Absolute URL for Twitter image
 */
export function buildTwitterImageUrl(twitterImage?: string, ogImage?: string): string {
	const imageUrl = twitterImage ?? ogImage ?? DEFAULT_SEO.ogImage;
	return buildAbsoluteUrl(imageUrl);
}

/**
 * Build canonical URL
 * Uses provided URL or falls back to current path
 *
 * @param canonicalUrl - Canonical URL
 * @returns Absolute canonical URL
 */
export function buildCanonicalUrl(canonicalUrl?: string): string {
	if (canonicalUrl) {
		return buildAbsoluteUrl(canonicalUrl);
	}

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- SSR check
	if (globalThis.window === undefined) {
		return '/';
	}

	const { pathname, search } = globalThis.window.location;
	return buildAbsoluteUrl(pathname + search);
}

/**
 * Build required SEO values from config
 */
function buildRequiredSEOValues(config: SEOConfig): {
	title: string;
	canonicalUrl: string;
	ogImage: string;
	ogImageAlt: string;
	twitterImage: string;
	twitterImageAlt: string;
} {
	const fullTitle = buildPageTitle(config.title);
	const canonicalUrl = buildCanonicalUrl(config.canonicalUrl);
	const ogImage = buildOgImageUrl(config.ogImage);
	const ogImageAlt = config.ogImageAlt ?? fullTitle;
	const twitterImage = buildTwitterImageUrl(config.twitterImage, config.ogImage);
	const twitterImageAlt = config.twitterImageAlt ?? ogImageAlt;

	return {
		title: fullTitle,
		canonicalUrl,
		ogImage,
		ogImageAlt,
		twitterImage,
		twitterImageAlt,
	};
}

/**
 * Build base SEO result object
 */
function buildBaseSEOResult(
	config: SEOConfig,
	values: ReturnType<typeof buildRequiredSEOValues>
): ReturnType<typeof mergeSEOConfig> {
	return {
		title: values.title,
		description: config.description ?? DEFAULT_SEO.description,
		indexable: config.indexable ?? true,
		canonicalUrl: values.canonicalUrl,
		ogType: config.ogType ?? 'website',
		ogImage: values.ogImage,
		ogImageWidth: config.ogImageWidth ?? DEFAULT_SEO.ogImageWidth,
		ogImageHeight: config.ogImageHeight ?? DEFAULT_SEO.ogImageHeight,
		ogImageAlt: values.ogImageAlt,
		ogLocale: config.ogLocale ?? DEFAULT_SEO.locale,
		twitterCard: config.twitterCard ?? DEFAULT_SEO.twitterCard,
		twitterImage: values.twitterImage,
		twitterImageAlt: values.twitterImageAlt,
	};
}

/**
 * Add optional properties to SEO result
 */
function addOptionalSEOProperties(
	result: ReturnType<typeof mergeSEOConfig>,
	config: SEOConfig
): void {
	if (config.keywords !== undefined) {
		result.keywords = config.keywords;
	}
	if (config.author !== undefined) {
		result.author = config.author;
	}
	if (config.customMeta !== undefined) {
		result.customMeta = config.customMeta;
	}
}

/**
 * Merge SEO config with defaults
 * Creates a complete SEO configuration with all defaults filled in
 *
 * @param config - Partial SEO configuration
 * @returns Complete SEO configuration with defaults
 */
export function mergeSEOConfig(config: SEOConfig = {}): Required<
	Pick<
		SEOConfig,
		| 'title'
		| 'description'
		| 'indexable'
		| 'canonicalUrl'
		| 'ogType'
		| 'ogImage'
		| 'ogImageWidth'
		| 'ogImageHeight'
		| 'ogImageAlt'
		| 'ogLocale'
		| 'twitterCard'
		| 'twitterImage'
		| 'twitterImageAlt'
	>
> & {
	keywords?: string;
	author?: string;
	customMeta?: Array<{ name?: string; property?: string; content: string }>;
} {
	const values = buildRequiredSEOValues(config);
	const result = buildBaseSEOResult(config, values);
	addOptionalSEOProperties(result, config);
	return result;
}

/**
 * Get default SEO configuration
 * Useful for initial page load or fallback scenarios
 *
 * @returns Default SEO configuration
 */
export function getDefaultSEO(): ReturnType<typeof mergeSEOConfig> {
	return mergeSEOConfig({});
}
