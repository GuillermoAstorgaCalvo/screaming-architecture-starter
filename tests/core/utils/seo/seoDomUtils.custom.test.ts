import { mergeSEOConfig } from '@core/config/seo';
import { updateCustomMetaTags } from '@core/utils/seo/seoDomUtils.custom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const CUSTOM_TAG_NAME = 'custom-tag';
const CUSTOM_TAG_SELECTOR = `meta[name="${CUSTOM_TAG_NAME}"]`;
const CUSTOM_PROPERTY = 'custom:property';
const CUSTOM_PROPERTY_SELECTOR = `meta[property="${CUSTOM_PROPERTY}"]`;

describe('updateCustomMetaTags - basic tag creation', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
	});

	afterEach(() => {
		document.head.innerHTML = '';
	});

	it('creates custom meta tags with name attribute', () => {
		const seo = mergeSEOConfig({
			customMeta: [
				{
					name: CUSTOM_TAG_NAME,
					content: 'Custom content',
				},
			],
		});

		updateCustomMetaTags(seo);

		const metaTag = document.querySelector<HTMLMetaElement>(CUSTOM_TAG_SELECTOR);
		expect(metaTag).toBeTruthy();
		expect(metaTag?.getAttribute('name')).toBe(CUSTOM_TAG_NAME);
		expect(metaTag?.content).toBe('Custom content');
	});

	it('creates custom meta tags with property attribute', () => {
		const seo = mergeSEOConfig({
			customMeta: [
				{
					property: CUSTOM_PROPERTY,
					content: 'Custom property content',
				},
			],
		});

		updateCustomMetaTags(seo);

		const metaTag = document.querySelector<HTMLMetaElement>(CUSTOM_PROPERTY_SELECTOR);
		expect(metaTag).toBeTruthy();
		expect(metaTag?.getAttribute('property')).toBe(CUSTOM_PROPERTY);
		expect(metaTag?.content).toBe('Custom property content');
	});
});

describe('updateCustomMetaTags - multiple tags', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
	});

	afterEach(() => {
		document.head.innerHTML = '';
	});

	it('creates multiple custom meta tags', () => {
		const seo = mergeSEOConfig({
			customMeta: [
				{
					name: 'tag1',
					content: 'Content 1',
				},
				{
					name: 'tag2',
					content: 'Content 2',
				},
				{
					property: 'custom:tag3',
					content: 'Content 3',
				},
			],
		});

		updateCustomMetaTags(seo);

		const tag1 = document.querySelector<HTMLMetaElement>('meta[name="tag1"]');
		const tag2 = document.querySelector<HTMLMetaElement>('meta[name="tag2"]');
		const tag3 = document.querySelector<HTMLMetaElement>('meta[property="custom:tag3"]');
		expect(tag1?.content).toBe('Content 1');
		expect(tag2?.content).toBe('Content 2');
		expect(tag3?.content).toBe('Content 3');
	});
});

describe('updateCustomMetaTags - edge cases', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
	});

	afterEach(() => {
		document.head.innerHTML = '';
	});

	it('updates existing custom meta tags', () => {
		const existingMeta = document.createElement('meta');
		existingMeta.setAttribute('name', CUSTOM_TAG_NAME);
		existingMeta.content = 'Original content';
		document.head.append(existingMeta);

		const seo = mergeSEOConfig({
			customMeta: [
				{
					name: CUSTOM_TAG_NAME,
					content: 'Updated content',
				},
			],
		});

		updateCustomMetaTags(seo);

		const metaTag = document.querySelector<HTMLMetaElement>(CUSTOM_TAG_SELECTOR);
		expect(metaTag?.content).toBe('Updated content');
		expect(document.querySelectorAll(CUSTOM_TAG_SELECTOR).length).toBe(1);
	});

	it('does not create meta tags when customMeta is not provided', () => {
		const seo = mergeSEOConfig({});

		updateCustomMetaTags(seo);

		const customTags = document.querySelectorAll('meta[name^="custom"], meta[property^="custom"]');
		expect(customTags.length).toBe(0);
	});

	it('does not create meta tags when customMeta is empty array', () => {
		const seo = mergeSEOConfig({
			customMeta: [],
		});

		updateCustomMetaTags(seo);

		const customTags = document.querySelectorAll('meta[name^="custom"], meta[property^="custom"]');
		expect(customTags.length).toBe(0);
	});
});

describe('updateCustomMetaTags - attribute handling', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
	});

	afterEach(() => {
		document.head.innerHTML = '';
	});

	it('handles custom meta tags with both name and property (prioritizes property)', () => {
		const seo = mergeSEOConfig({
			customMeta: [
				{
					name: 'custom-name',
					property: CUSTOM_PROPERTY,
					content: 'Content',
				},
			],
		});

		updateCustomMetaTags(seo);

		const propertyTag = document.querySelector<HTMLMetaElement>(CUSTOM_PROPERTY_SELECTOR);
		const nameTag = document.querySelector<HTMLMetaElement>('meta[name="custom-name"]');

		expect(propertyTag).toBeTruthy();
		expect(propertyTag?.content).toBe('Content');
		expect(nameTag).toBeNull();
	});

	it('handles custom meta tags with only name (no property)', () => {
		const seo = mergeSEOConfig({
			customMeta: [
				{
					name: 'custom-name',
					content: 'Content',
				},
			],
		});

		updateCustomMetaTags(seo);

		const nameTag = document.querySelector<HTMLMetaElement>('meta[name="custom-name"]');
		expect(nameTag).toBeTruthy();
		expect(nameTag?.content).toBe('Content');
	});

	it('handles custom meta tags with only property (no name)', () => {
		const seo = mergeSEOConfig({
			customMeta: [
				{
					property: CUSTOM_PROPERTY,
					content: 'Content',
				},
			],
		});

		updateCustomMetaTags(seo);

		const propertyTag = document.querySelector<HTMLMetaElement>(CUSTOM_PROPERTY_SELECTOR);
		expect(propertyTag).toBeTruthy();
		expect(propertyTag?.content).toBe('Content');
	});
});

describe('updateCustomMetaTags - content handling', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
	});

	afterEach(() => {
		document.head.innerHTML = '';
	});

	it('skips custom meta tags with neither name nor property', () => {
		const seo = mergeSEOConfig({
			customMeta: [
				{
					content: 'Content without name or property',
				},
			],
		});

		updateCustomMetaTags(seo);

		const metaTags = document.head.querySelectorAll('meta');
		expect(metaTags.length).toBe(0);
	});

	it('handles empty content strings', () => {
		const seo = mergeSEOConfig({
			customMeta: [
				{
					name: CUSTOM_TAG_NAME,
					content: '',
				},
			],
		});

		updateCustomMetaTags(seo);

		const metaTag = document.querySelector<HTMLMetaElement>(CUSTOM_TAG_SELECTOR);
		expect(metaTag).toBeTruthy();
		expect(metaTag?.content).toBe('');
	});

	it('handles special characters in content', () => {
		const seo = mergeSEOConfig({
			customMeta: [
				{
					name: CUSTOM_TAG_NAME,
					content: 'Content with "quotes" & <special> characters',
				},
			],
		});

		updateCustomMetaTags(seo);

		const metaTag = document.querySelector<HTMLMetaElement>(CUSTOM_TAG_SELECTOR);
		expect(metaTag?.content).toBe('Content with "quotes" & <special> characters');
	});
});

describe('updateCustomMetaTags - mixed tags', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
	});

	afterEach(() => {
		document.head.innerHTML = '';
	});

	it('handles mixed name and property tags in same array', () => {
		const seo = mergeSEOConfig({
			customMeta: [
				{
					name: 'name-tag',
					content: 'Name content',
				},
				{
					property: 'property:tag',
					content: 'Property content',
				},
				{
					name: 'another-name',
					content: 'Another name content',
				},
			],
		});

		updateCustomMetaTags(seo);

		const nameTag = document.querySelector<HTMLMetaElement>('meta[name="name-tag"]');
		const propertyTag = document.querySelector<HTMLMetaElement>('meta[property="property:tag"]');
		expect(nameTag?.content).toBe('Name content');
		expect(propertyTag?.content).toBe('Property content');
		const anotherName = document.querySelector<HTMLMetaElement>('meta[name="another-name"]');
		expect(anotherName?.content).toBe('Another name content');
	});
});

describe('updateCustomMetaTags - SSR safety', () => {
	beforeEach(() => {
		document.head.innerHTML = '';
	});

	afterEach(() => {
		document.head.innerHTML = '';
	});

	it('returns early when document is undefined (SSR safety)', () => {
		const originalDocument = globalThis.document;

		Object.defineProperty(globalThis, 'document', {
			value: undefined,
			writable: true,
			configurable: true,
		});

		const seo = mergeSEOConfig({
			customMeta: [
				{
					name: CUSTOM_TAG_NAME,
					content: 'Content',
				},
			],
		});

		expect(() => updateCustomMetaTags(seo)).not.toThrow();

		Object.defineProperty(globalThis, 'document', {
			value: originalDocument,
			writable: true,
			configurable: true,
		});
	});
});
