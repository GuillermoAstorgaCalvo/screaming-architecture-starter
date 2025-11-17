import { mergeSEOConfig } from '@core/config/seo';
import { updateBasicMetaTags, updateCanonicalUrl } from '@core/utils/seo/seoDomUtils.basic';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	clearDocument,
	createMetaTag,
	getLinkHref,
	getMetaContent,
	SELECTORS,
	setupSSRTest,
} from './test-helpers';

const TEST_CANONICAL_URL = 'https://example.com/page';

describe('updateBasicMetaTags - description', () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});

	it('creates description meta tag', () => {
		const seo = mergeSEOConfig({
			description: 'Test page description',
		});

		updateBasicMetaTags(seo);

		expect(getMetaContent(SELECTORS.meta.description)).toBe('Test page description');
	});

	it('updates existing description meta tag', () => {
		// Create initial meta tag
		const existingMeta = createMetaTag('name', 'description', 'Original description');
		document.head.append(existingMeta);

		const seo = mergeSEOConfig({
			description: 'Updated description',
		});

		updateBasicMetaTags(seo);

		expect(getMetaContent(SELECTORS.meta.description)).toBe('Updated description');
		expect(document.querySelectorAll(SELECTORS.meta.description).length).toBe(1);
	});

	it('handles empty description', () => {
		const seo = mergeSEOConfig({
			description: '',
		});

		updateBasicMetaTags(seo);

		expect(getMetaContent(SELECTORS.meta.description)).toBe('');
	});
});

describe('updateBasicMetaTags - robots', () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});

	it('creates robots meta tag with index, follow when indexable is true', () => {
		const seo = mergeSEOConfig({
			indexable: true,
		});

		updateBasicMetaTags(seo);

		expect(getMetaContent(SELECTORS.meta.robots)).toBe('index, follow');
	});

	it('creates robots meta tag with noindex, nofollow when indexable is false', () => {
		const seo = mergeSEOConfig({
			indexable: false,
		});

		updateBasicMetaTags(seo);

		expect(getMetaContent(SELECTORS.meta.robots)).toBe('noindex, nofollow');
	});

	it('updates robots meta tag when indexable changes', () => {
		const seo1 = mergeSEOConfig({
			indexable: true,
		});
		updateBasicMetaTags(seo1);

		const seo2 = mergeSEOConfig({
			indexable: false,
		});
		updateBasicMetaTags(seo2);

		expect(getMetaContent(SELECTORS.meta.robots)).toBe('noindex, nofollow');
	});
});

describe('updateBasicMetaTags - keywords and author', () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});

	it('creates keywords meta tag when keywords are provided', () => {
		const seo = mergeSEOConfig({
			keywords: 'test, keywords, seo',
		});

		updateBasicMetaTags(seo);

		expect(getMetaContent(SELECTORS.meta.keywords)).toBe('test, keywords, seo');
	});

	it('does not create keywords meta tag when keywords are not provided', () => {
		const seo = mergeSEOConfig({});

		updateBasicMetaTags(seo);

		expect(document.querySelector(SELECTORS.meta.keywords)).toBeNull();
	});

	it('creates author meta tag when author is provided', () => {
		const seo = mergeSEOConfig({
			author: 'John Doe',
		});

		updateBasicMetaTags(seo);

		expect(getMetaContent(SELECTORS.meta.author)).toBe('John Doe');
	});

	it('does not create author meta tag when author is not provided', () => {
		const seo = mergeSEOConfig({});

		updateBasicMetaTags(seo);

		expect(document.querySelector(SELECTORS.meta.author)).toBeNull();
	});
});

describe('updateBasicMetaTags - all fields', () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});

	it('creates all basic meta tags when all fields are provided', () => {
		const seo = mergeSEOConfig({
			description: 'Test description',
			indexable: true,
			keywords: 'test, seo',
			author: 'Test Author',
		});

		updateBasicMetaTags(seo);

		expect(getMetaContent(SELECTORS.meta.description)).toBe('Test description');
		expect(getMetaContent(SELECTORS.meta.robots)).toBe('index, follow');
		expect(getMetaContent(SELECTORS.meta.keywords)).toBe('test, seo');
		expect(getMetaContent(SELECTORS.meta.author)).toBe('Test Author');
	});
});

describe('updateCanonicalUrl', () => {
	beforeEach(() => {
		clearDocument();
	});

	afterEach(() => {
		clearDocument();
	});

	it('creates canonical link when it does not exist', () => {
		updateCanonicalUrl(TEST_CANONICAL_URL);

		const link = document.querySelector<HTMLLinkElement>(SELECTORS.link.canonical);
		expect(link).toBeTruthy();
		expect(link?.rel).toBe('canonical');
		expect(getLinkHref(SELECTORS.link.canonical)).toBe(TEST_CANONICAL_URL);
	});

	it('updates existing canonical link', () => {
		// Create initial canonical link
		const existingLink = document.createElement('link');
		existingLink.rel = 'canonical';
		existingLink.href = 'https://example.com/old';
		document.head.append(existingLink);

		updateCanonicalUrl(TEST_CANONICAL_URL);

		expect(getLinkHref(SELECTORS.link.canonical)).toBe(TEST_CANONICAL_URL);
		expect(document.querySelectorAll(SELECTORS.link.canonical).length).toBe(1);
	});

	it('handles relative URLs', () => {
		const canonicalUrl = '/page';

		updateCanonicalUrl(canonicalUrl);

		// link.href will be resolved to absolute URL by the browser
		expect(getLinkHref(SELECTORS.link.canonical)).toContain('/page');
	});

	it('handles absolute URLs', () => {
		updateCanonicalUrl(TEST_CANONICAL_URL);

		expect(getLinkHref(SELECTORS.link.canonical)).toBe(TEST_CANONICAL_URL);
	});

	it('handles URLs with query parameters', () => {
		const canonicalUrl = 'https://example.com/page?param=value&other=test';

		updateCanonicalUrl(canonicalUrl);

		expect(getLinkHref(SELECTORS.link.canonical)).toBe(canonicalUrl);
	});

	it('handles URLs with hash fragments', () => {
		const canonicalUrl = 'https://example.com/page#section';

		updateCanonicalUrl(canonicalUrl);

		expect(getLinkHref(SELECTORS.link.canonical)).toBe(canonicalUrl);
	});

	it('appends canonical link to document head', () => {
		updateCanonicalUrl(TEST_CANONICAL_URL);

		const link = document.head.querySelector<HTMLLinkElement>(SELECTORS.link.canonical);
		expect(link).toBeTruthy();
		expect(link?.parentElement).toBe(document.head);
	});

	it('returns early when document is undefined (SSR safety)', () => {
		const restoreDocument = setupSSRTest();

		// Should not throw
		expect(() => updateCanonicalUrl(TEST_CANONICAL_URL)).not.toThrow();

		restoreDocument();
	});
});
