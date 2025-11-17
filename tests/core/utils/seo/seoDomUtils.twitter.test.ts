import { mergeSEOConfig } from '@core/config/seo';
import { updateTwitterTags } from '@core/utils/seo/seoDomUtils.twitter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getMetaContent, SELECTORS } from './test-helpers';

const TEST_TWITTER_IMAGE = 'https://example.com/twitter-image.jpg';
const TEST_TWITTER_CARD = 'summary_large_image';
const TEST_DESCRIPTION = 'Test description';

beforeEach(() => {
	// Clear document head before each test
	document.head.innerHTML = '';
});

afterEach(() => {
	// Clean up after each test
	document.head.innerHTML = '';
});

describe('updateTwitterTags - basic tag creation', () => {
	it('creates all Twitter Card meta tags', () => {
		const seo = mergeSEOConfig({
			title: 'Test Page',
			description: TEST_DESCRIPTION,
			twitterCard: TEST_TWITTER_CARD,
			twitterImage: TEST_TWITTER_IMAGE,
			twitterImageAlt: 'Twitter image alt',
		});

		updateTwitterTags(seo);

		expect(getMetaContent(SELECTORS.twitter.card)).toBe(TEST_TWITTER_CARD);
		// mergeSEOConfig appends site name to title
		expect(getMetaContent(SELECTORS.twitter.title)).toBe(seo.title);
		expect(getMetaContent(SELECTORS.twitter.description)).toBe(TEST_DESCRIPTION);
		expect(getMetaContent(SELECTORS.twitter.image)).toBe(TEST_TWITTER_IMAGE);
		expect(getMetaContent(SELECTORS.twitter.imageAlt)).toBe('Twitter image alt');
	});

	it('creates all Twitter tags with default values', () => {
		const seo = mergeSEOConfig({});

		updateTwitterTags(seo);

		// Should create all tags
		expect(document.querySelector(SELECTORS.twitter.card)).toBeTruthy();
		expect(document.querySelector(SELECTORS.twitter.title)).toBeTruthy();
		expect(document.querySelector(SELECTORS.twitter.description)).toBeTruthy();
		expect(document.querySelector(SELECTORS.twitter.image)).toBeTruthy();
		expect(document.querySelector(SELECTORS.twitter.imageAlt)).toBeTruthy();
	});

	it('updates existing Twitter meta tags', () => {
		// Create initial meta tags
		const twitterCard = document.createElement('meta');
		twitterCard.setAttribute('name', 'twitter:card');
		twitterCard.content = 'summary';
		document.head.append(twitterCard);

		const twitterTitle = document.createElement('meta');
		twitterTitle.setAttribute('name', 'twitter:title');
		twitterTitle.content = 'Original Title';
		document.head.append(twitterTitle);

		const seo = mergeSEOConfig({
			title: 'Updated Title',
			twitterCard: TEST_TWITTER_CARD,
		});

		updateTwitterTags(seo);

		expect(getMetaContent(SELECTORS.twitter.card)).toBe(TEST_TWITTER_CARD);
		// mergeSEOConfig appends site name to title
		expect(getMetaContent(SELECTORS.twitter.title)).toBe(seo.title);
		expect(document.querySelectorAll(SELECTORS.twitter.card).length).toBe(1);
		expect(document.querySelectorAll(SELECTORS.twitter.title).length).toBe(1);
	});
});

describe('updateTwitterTags - card types and images', () => {
	it('handles different twitter:card values', () => {
		const cardTypes: Array<'summary' | 'summary_large_image' | 'app' | 'player'> = [
			'summary',
			'summary_large_image',
			'app',
			'player',
		];

		for (const cardType of cardTypes) {
			document.head.innerHTML = '';
			const seo = mergeSEOConfig({
				twitterCard: cardType,
			});

			updateTwitterTags(seo);

			expect(getMetaContent(SELECTORS.twitter.card)).toBe(cardType);
		}
	});

	it('handles relative image URLs', () => {
		const seo = mergeSEOConfig({
			twitterImage: '/images/twitter-image.jpg',
		});

		updateTwitterTags(seo);

		// mergeSEOConfig converts relative URLs to absolute URLs
		expect(getMetaContent(SELECTORS.twitter.image)).toContain('/images/twitter-image.jpg');
	});

	it('handles absolute image URLs', () => {
		const seo = mergeSEOConfig({
			twitterImage: TEST_TWITTER_IMAGE,
		});

		updateTwitterTags(seo);

		expect(getMetaContent(SELECTORS.twitter.image)).toBe(TEST_TWITTER_IMAGE);
	});

	it('handles empty image alt text', () => {
		const seo = mergeSEOConfig({
			twitterImage: TEST_TWITTER_IMAGE,
			twitterImageAlt: '',
		});

		updateTwitterTags(seo);

		expect(getMetaContent(SELECTORS.twitter.imageAlt)).toBe('');
	});
});

describe('updateTwitterTags - content handling', () => {
	it('handles long descriptions', () => {
		const longDescription = 'A'.repeat(200);
		const seo = mergeSEOConfig({
			description: longDescription,
		});

		updateTwitterTags(seo);

		expect(getMetaContent(SELECTORS.twitter.description)).toBe(longDescription);
	});

	it('handles special characters in title and description', () => {
		const seo = mergeSEOConfig({
			title: 'Test with "quotes" & <special> characters',
			description: 'Description with "quotes" & <special> characters',
		});

		updateTwitterTags(seo);

		// mergeSEOConfig appends site name to title
		expect(getMetaContent(SELECTORS.twitter.title)).toBe(seo.title);
		expect(getMetaContent(SELECTORS.twitter.description)).toBe(
			'Description with "quotes" & <special> characters'
		);
	});

	it('creates exactly 5 Twitter meta tags', () => {
		const seo = mergeSEOConfig({
			title: 'Test Page',
			description: TEST_DESCRIPTION,
			twitterCard: 'summary',
			twitterImage: 'https://example.com/image.jpg',
			twitterImageAlt: 'Alt text',
		});

		updateTwitterTags(seo);

		const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
		expect(twitterTags.length).toBe(5);
	});

	it('uses title from SEO config for twitter:title', () => {
		const seo = mergeSEOConfig({
			title: 'Custom Page Title',
		});

		updateTwitterTags(seo);

		// mergeSEOConfig appends site name to title
		expect(getMetaContent(SELECTORS.twitter.title)).toBe(seo.title);
	});

	it('uses description from SEO config for twitter:description', () => {
		const seo = mergeSEOConfig({
			description: 'Custom page description',
		});

		updateTwitterTags(seo);

		expect(getMetaContent(SELECTORS.twitter.description)).toBe('Custom page description');
	});
});
