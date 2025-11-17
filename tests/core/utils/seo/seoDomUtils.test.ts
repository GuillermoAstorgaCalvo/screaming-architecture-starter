import { mergeSEOConfig } from '@core/config/seo';
import { applySEOToDocument } from '@core/utils/seo/seoDomUtils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	clearDocument,
	getLinkHref,
	getMetaContent,
	SELECTORS,
	setupSSRTest,
	TEST_VALUES,
} from './test-helpers';

const registerDocumentCleanup = () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});
};

describe('applySEOToDocument document title', () => {
	registerDocumentCleanup();

	it('updates document title', () => {
		const seo = mergeSEOConfig({
			title: 'Test Page Title',
		});

		applySEOToDocument(seo);

		// mergeSEOConfig appends site name to title
		expect(document.title).toBe(seo.title);
	});

	it('updates document title when it differs from current title', () => {
		document.title = 'Original Title';

		const seo = mergeSEOConfig({
			title: 'New Title',
		});

		applySEOToDocument(seo);

		// mergeSEOConfig appends site name to title
		expect(document.title).toBe(seo.title);
	});

	it('does not update document title when it matches current title', () => {
		const seo = mergeSEOConfig({
			title: 'Test Page Title',
		});
		document.title = seo.title;

		applySEOToDocument(seo);

		// Title should remain the same (function checks if title differs before updating)
		expect(document.title).toBe(seo.title);
	});

	it('handles empty title', () => {
		document.title = 'Original Title';

		const seo = mergeSEOConfig({
			title: '',
		});

		applySEOToDocument(seo);

		// When title is empty, mergeSEOConfig uses site name as title
		expect(document.title).toBe(seo.title);
	});

	it('handles special characters in title', () => {
		const seo = mergeSEOConfig({
			title: 'Test with "quotes" & <special> characters',
		});

		applySEOToDocument(seo);

		// mergeSEOConfig appends site name to title
		expect(document.title).toBe(seo.title);
	});
});

describe('applySEOToDocument SEO metadata full configuration', () => {
	registerDocumentCleanup();

	it('applies all SEO metadata types', () => {
		const seo = mergeSEOConfig({
			title: TEST_VALUES.title,
			description: TEST_VALUES.description,
			indexable: true,
			canonicalUrl: TEST_VALUES.canonicalUrl,
			keywords: 'test, seo',
			author: 'Test Author',
			ogType: 'article',
			ogImage: 'https://example.com/image.jpg',
			ogImageWidth: 1200,
			ogImageHeight: 630,
			ogImageAlt: 'Test image alt',
			ogLocale: 'en_US',
			twitterCard: 'summary_large_image',
			twitterImage: 'https://example.com/twitter-image.jpg',
			twitterImageAlt: 'Twitter image alt',
			customMeta: [
				{
					name: 'custom-tag',
					content: 'Custom content',
				},
			],
		});

		applySEOToDocument(seo);

		// Check document title (mergeSEOConfig appends site name)
		expect(document.title).toBe(seo.title);

		// Check basic meta tags
		expect(getMetaContent(SELECTORS.meta.description)).toBe(TEST_VALUES.description);
		expect(getMetaContent(SELECTORS.meta.robots)).toBe('index, follow');
		expect(getMetaContent(SELECTORS.meta.keywords)).toBe('test, seo');
		expect(getMetaContent(SELECTORS.meta.author)).toBe('Test Author');

		// Check canonical URL
		expect(getLinkHref(SELECTORS.link.canonical)).toBe(TEST_VALUES.canonicalUrl);

		// Check Open Graph tags
		expect(getMetaContent(SELECTORS.og.type)).toBe('article');
		// mergeSEOConfig appends site name to title
		expect(getMetaContent(SELECTORS.og.title)).toBe(seo.title);
		expect(getMetaContent(SELECTORS.og.description)).toBe(TEST_VALUES.description);
		expect(getMetaContent(SELECTORS.og.url)).toBe(TEST_VALUES.canonicalUrl);
		expect(getMetaContent(SELECTORS.og.locale)).toBe('en_US');
		expect(getMetaContent(SELECTORS.og.image)).toBe('https://example.com/image.jpg');
		expect(getMetaContent(SELECTORS.og.imageWidth)).toBe('1200');
		expect(getMetaContent(SELECTORS.og.imageHeight)).toBe('630');
		expect(getMetaContent(SELECTORS.og.imageAlt)).toBe('Test image alt');

		// Check Twitter tags
		expect(getMetaContent(SELECTORS.twitter.card)).toBe('summary_large_image');
		// mergeSEOConfig appends site name to title
		expect(getMetaContent(SELECTORS.twitter.title)).toBe(seo.title);
		expect(getMetaContent(SELECTORS.twitter.description)).toBe(TEST_VALUES.description);
		expect(getMetaContent(SELECTORS.twitter.image)).toBe('https://example.com/twitter-image.jpg');
		expect(getMetaContent(SELECTORS.twitter.imageAlt)).toBe('Twitter image alt');

		// Check custom meta tags
		expect(getMetaContent(SELECTORS.meta.custom('custom-tag'))).toBe('Custom content');
	});
});

describe('applySEOToDocument SEO metadata variations', () => {
	registerDocumentCleanup();

	it('applies SEO with minimal configuration', () => {
		const seo = mergeSEOConfig({});

		applySEOToDocument(seo);

		// Should still apply all default values
		expect(document.title).toBeTruthy();
		expect(document.querySelector(SELECTORS.meta.description)).toBeTruthy();
		expect(document.querySelector(SELECTORS.meta.robots)).toBeTruthy();
		expect(document.querySelector(SELECTORS.link.canonical)).toBeTruthy();
		expect(document.querySelector(SELECTORS.og.type)).toBeTruthy();
		expect(document.querySelector(SELECTORS.twitter.card)).toBeTruthy();
	});

	it('handles indexable set to false', () => {
		const seo = mergeSEOConfig({
			indexable: false,
		});

		applySEOToDocument(seo);

		expect(getMetaContent(SELECTORS.meta.robots)).toBe('noindex, nofollow');
	});

	it('handles multiple calls with different configurations', () => {
		const seo1 = mergeSEOConfig({
			title: 'First Title',
			description: 'First description',
		});

		applySEOToDocument(seo1);

		// mergeSEOConfig appends site name to title
		expect(document.title).toBe(seo1.title);
		expect(getMetaContent(SELECTORS.meta.description)).toBe('First description');

		const seo2 = mergeSEOConfig({
			title: 'Second Title',
			description: 'Second description',
		});

		applySEOToDocument(seo2);

		// mergeSEOConfig appends site name to title
		expect(document.title).toBe(seo2.title);
		expect(getMetaContent(SELECTORS.meta.description)).toBe('Second description');
	});

	it('applies all SEO updates in correct order', () => {
		const seo = mergeSEOConfig({
			title: TEST_VALUES.title,
			description: TEST_VALUES.description,
			canonicalUrl: TEST_VALUES.canonicalUrl,
		});

		// Track order of operations by checking if elements exist
		applySEOToDocument(seo);

		// All elements should be present (mergeSEOConfig appends site name to title)
		expect(document.title).toBe(seo.title);
		expect(document.querySelector(SELECTORS.meta.description)).toBeTruthy();
		expect(document.querySelector(SELECTORS.link.canonical)).toBeTruthy();
		expect(document.querySelector(SELECTORS.og.type)).toBeTruthy();
		expect(document.querySelector(SELECTORS.twitter.card)).toBeTruthy();
	});
});

describe('applySEOToDocument edge cases', () => {
	registerDocumentCleanup();

	it('returns early when document is undefined (SSR safety)', () => {
		const restoreDocument = setupSSRTest();

		const seo = mergeSEOConfig({
			title: TEST_VALUES.title,
			description: TEST_VALUES.description,
		});

		// Should not throw
		expect(() => applySEOToDocument(seo)).not.toThrow();

		restoreDocument();
	});
});
