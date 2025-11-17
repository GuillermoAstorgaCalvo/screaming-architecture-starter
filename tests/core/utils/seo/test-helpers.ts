/**
 * Test helpers for SEO utility tests
 * Provides reusable functions and constants to reduce duplication
 */

// Common selectors
export const SELECTORS = {
	meta: {
		description: 'meta[name="description"]',
		robots: 'meta[name="robots"]',
		keywords: 'meta[name="keywords"]',
		author: 'meta[name="author"]',
		custom: (name: string) => `meta[name="${name}"]`,
	},
	og: {
		type: 'meta[property="og:type"]',
		title: 'meta[property="og:title"]',
		description: 'meta[property="og:description"]',
		url: 'meta[property="og:url"]',
		locale: 'meta[property="og:locale"]',
		image: 'meta[property="og:image"]',
		imageWidth: 'meta[property="og:image:width"]',
		imageHeight: 'meta[property="og:image:height"]',
		imageAlt: 'meta[property="og:image:alt"]',
	},
	twitter: {
		card: 'meta[name="twitter:card"]',
		title: 'meta[name="twitter:title"]',
		description: 'meta[name="twitter:description"]',
		image: 'meta[name="twitter:image"]',
		imageAlt: 'meta[name="twitter:image:alt"]',
	},
	link: {
		canonical: 'link[rel="canonical"]',
	},
} as const;

// Common test values
export const TEST_VALUES = {
	description: 'Test description',
	title: 'Test Page',
	titleWithSiteName: 'Test Page Title',
	canonicalUrl: 'https://example.com/page',
	imageUrl: 'https://example.com/image.jpg',
	twitterImageUrl: 'https://example.com/twitter-image.jpg',
	keywords: 'test, seo',
	author: 'Test Author',
	ogType: 'article',
	ogLocale: 'en_US',
	twitterCard: 'summary_large_image',
} as const;

/**
 * Helper to query a meta tag and get its content
 */
export function getMetaContent(selector: string): string | undefined {
	return document.querySelector<HTMLMetaElement>(selector)?.content;
}

/**
 * Helper to query a link element and get its href
 */
export function getLinkHref(selector: string): string | undefined {
	return document.querySelector<HTMLLinkElement>(selector)?.href;
}

/**
 * Helper to create a meta tag for test setup
 */
export function createMetaTag(
	nameOrProperty: 'name' | 'property',
	value: string,
	content: string
): HTMLMetaElement {
	const meta = document.createElement('meta');
	meta.setAttribute(nameOrProperty, value);
	meta.content = content;
	return meta;
}

/**
 * Helper to setup SSR safety test (mock document as undefined)
 */
export function setupSSRTest(): () => void {
	const originalDocument = globalThis.document;
	Object.defineProperty(globalThis, 'document', {
		value: undefined,
		writable: true,
		configurable: true,
	});

	return () => {
		Object.defineProperty(globalThis, 'document', {
			value: originalDocument,
			writable: true,
			configurable: true,
		});
	};
}

/**
 * Helper to clear document head and title
 */
export function clearDocument(): void {
	document.head.innerHTML = '';
	document.title = '';
}
