import { mergeSEOConfig } from '@core/config/seo';
import { updateOpenGraphTags } from '@core/utils/seo/seoDomUtils.openGraph';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { clearDocument, getMetaContent, SELECTORS, TEST_VALUES } from './test-helpers';

const TEST_IMAGE_ALT = 'Test image alt';

describe('seoDomUtils.openGraph - updateOpenGraphTags - basic tags', () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});

	it('creates all basic Open Graph meta tags', () => {
		const seo = mergeSEOConfig({
			title: TEST_VALUES.title,
			description: TEST_VALUES.description,
			canonicalUrl: TEST_VALUES.canonicalUrl,
			ogType: TEST_VALUES.ogType,
			ogLocale: TEST_VALUES.ogLocale,
		});

		updateOpenGraphTags(seo);

		expect(getMetaContent(SELECTORS.og.type)).toBe(TEST_VALUES.ogType);
		expect(getMetaContent(SELECTORS.og.title)).toBe(seo.title);
		expect(getMetaContent(SELECTORS.og.description)).toBe(TEST_VALUES.description);
		expect(getMetaContent(SELECTORS.og.url)).toBe(TEST_VALUES.canonicalUrl);
		expect(getMetaContent(SELECTORS.og.locale)).toBe(TEST_VALUES.ogLocale);
	});
});

describe('seoDomUtils.openGraph - updateOpenGraphTags - image tags', () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});

	it('creates Open Graph image meta tags', () => {
		const seo = mergeSEOConfig({
			ogImage: TEST_VALUES.imageUrl,
			ogImageWidth: 1200,
			ogImageHeight: 630,
			ogImageAlt: TEST_IMAGE_ALT,
		});

		updateOpenGraphTags(seo);

		expect(getMetaContent(SELECTORS.og.image)).toBe(TEST_VALUES.imageUrl);
		expect(getMetaContent(SELECTORS.og.imageWidth)).toBe('1200');
		expect(getMetaContent(SELECTORS.og.imageHeight)).toBe('630');
		expect(getMetaContent(SELECTORS.og.imageAlt)).toBe(TEST_IMAGE_ALT);
	});

	it('creates all Open Graph tags including image tags', () => {
		const seo = mergeSEOConfig({
			title: TEST_VALUES.title,
			description: TEST_VALUES.description,
			canonicalUrl: TEST_VALUES.canonicalUrl,
			ogType: 'website',
			ogLocale: TEST_VALUES.ogLocale,
			ogImage: TEST_VALUES.imageUrl,
			ogImageWidth: 1200,
			ogImageHeight: 630,
			ogImageAlt: TEST_IMAGE_ALT,
		});

		updateOpenGraphTags(seo);

		// Basic tags
		expect(getMetaContent(SELECTORS.og.type)).toBe('website');
		expect(getMetaContent(SELECTORS.og.title)).toBe(seo.title);
		expect(getMetaContent(SELECTORS.og.description)).toBe(TEST_VALUES.description);
		expect(getMetaContent(SELECTORS.og.url)).toBe(TEST_VALUES.canonicalUrl);
		expect(getMetaContent(SELECTORS.og.locale)).toBe(TEST_VALUES.ogLocale);

		// Image tags
		expect(getMetaContent(SELECTORS.og.image)).toBe(TEST_VALUES.imageUrl);
		expect(getMetaContent(SELECTORS.og.imageWidth)).toBe('1200');
		expect(getMetaContent(SELECTORS.og.imageHeight)).toBe('630');
		expect(getMetaContent(SELECTORS.og.imageAlt)).toBe(TEST_IMAGE_ALT);
	});
});

describe('seoDomUtils.openGraph - updateOpenGraphTags - image tag edge cases', () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});

	it('handles image dimensions as numbers', () => {
		const seo = mergeSEOConfig({
			ogImage: TEST_VALUES.imageUrl,
			ogImageWidth: 1920,
			ogImageHeight: 1080,
		});

		updateOpenGraphTags(seo);

		expect(getMetaContent(SELECTORS.og.imageWidth)).toBe('1920');
		expect(getMetaContent(SELECTORS.og.imageHeight)).toBe('1080');
	});

	it('handles relative image URLs', () => {
		const seo = mergeSEOConfig({
			ogImage: '/images/og-image.jpg',
		});

		updateOpenGraphTags(seo);

		// mergeSEOConfig converts relative URLs to absolute URLs
		expect(getMetaContent(SELECTORS.og.image)).toContain('/images/og-image.jpg');
	});

	it('handles empty image alt text', () => {
		const seo = mergeSEOConfig({
			ogImage: TEST_VALUES.imageUrl,
			ogImageAlt: '',
		});

		updateOpenGraphTags(seo);

		expect(getMetaContent(SELECTORS.og.imageAlt)).toBe('');
	});
});

describe('seoDomUtils.openGraph - updateOpenGraphTags - edge cases', () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});

	it('updates existing Open Graph meta tags', () => {
		// Create initial meta tags
		const ogType = document.createElement('meta');
		ogType.setAttribute('property', 'og:type');
		ogType.content = 'website';
		document.head.append(ogType);

		const ogTitle = document.createElement('meta');
		ogTitle.setAttribute('property', 'og:title');
		ogTitle.content = 'Original Title';
		document.head.append(ogTitle);

		const seo = mergeSEOConfig({
			title: 'Updated Title',
			ogType: 'article',
		});

		updateOpenGraphTags(seo);

		expect(getMetaContent(SELECTORS.og.type)).toBe('article');
		// mergeSEOConfig appends site name to title
		expect(getMetaContent(SELECTORS.og.title)).toBe(seo.title);
		expect(document.querySelectorAll(SELECTORS.og.type).length).toBe(1);
		expect(document.querySelectorAll(SELECTORS.og.title).length).toBe(1);
	});

	it('handles different og:type values', () => {
		const types: Array<'website' | 'article' | 'profile' | 'book' | 'music' | 'video'> = [
			'website',
			'article',
			'profile',
			'book',
			'music',
			'video',
		];

		for (const type of types) {
			clearDocument();
			const seo = mergeSEOConfig({
				ogType: type,
			});

			updateOpenGraphTags(seo);

			expect(getMetaContent(SELECTORS.og.type)).toBe(type);
		}
	});

	it('handles different locale values', () => {
		const locales = ['en_US', 'en_GB', 'fr_FR', 'de_DE', 'es_ES'];

		for (const locale of locales) {
			clearDocument();
			const seo = mergeSEOConfig({
				ogLocale: locale,
			});

			updateOpenGraphTags(seo);

			expect(getMetaContent(SELECTORS.og.locale)).toBe(locale);
		}
	});
});

describe('seoDomUtils.openGraph - updateOpenGraphTags - default values', () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});

	it('creates all required Open Graph tags with default values', () => {
		const seo = mergeSEOConfig({});

		updateOpenGraphTags(seo);

		// Should create all basic tags
		expect(document.querySelector(SELECTORS.og.type)).toBeTruthy();
		expect(document.querySelector(SELECTORS.og.title)).toBeTruthy();
		expect(document.querySelector(SELECTORS.og.description)).toBeTruthy();
		expect(document.querySelector(SELECTORS.og.url)).toBeTruthy();
		expect(document.querySelector(SELECTORS.og.locale)).toBeTruthy();

		// Should create all image tags
		expect(document.querySelector(SELECTORS.og.image)).toBeTruthy();
		expect(document.querySelector(SELECTORS.og.imageWidth)).toBeTruthy();
		expect(document.querySelector(SELECTORS.og.imageHeight)).toBeTruthy();
		expect(document.querySelector(SELECTORS.og.imageAlt)).toBeTruthy();
	});
});
