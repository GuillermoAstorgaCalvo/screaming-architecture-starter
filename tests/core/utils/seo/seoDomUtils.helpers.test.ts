import { updateMetaTag, type UpdateMetaTagOptions } from '@core/utils/seo/seoDomUtils.helpers';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const DESCRIPTION_SELECTOR = 'meta[name="description"]';
const DESCRIPTION_VALUE = 'description';
const OG_TITLE_SELECTOR = 'meta[property="og:title"]';
const OG_TITLE_VALUE = 'og:title';
const TEST_DESCRIPTION = 'Test description';

const resetDocumentHead = () => {
	document.head.innerHTML = '';
};

beforeEach(resetDocumentHead);
afterEach(resetDocumentHead);

describe('updateMetaTag - creation', () => {
	it('creates a new meta tag when it does not exist', () => {
		const options: UpdateMetaTagOptions = {
			selector: DESCRIPTION_SELECTOR,
			attribute: 'name',
			value: DESCRIPTION_VALUE,
			content: TEST_DESCRIPTION,
		};

		updateMetaTag(options);

		const metaTag = document.querySelector<HTMLMetaElement>(DESCRIPTION_SELECTOR);
		expect(metaTag).toBeTruthy();
		expect(metaTag?.getAttribute('name')).toBe(DESCRIPTION_VALUE);
		expect(metaTag?.content).toBe(TEST_DESCRIPTION);
	});

	it('creates a property-based meta tag', () => {
		const options: UpdateMetaTagOptions = {
			selector: OG_TITLE_SELECTOR,
			attribute: 'property',
			value: OG_TITLE_VALUE,
			content: 'Open Graph Title',
		};

		updateMetaTag(options);

		const metaTag = document.querySelector<HTMLMetaElement>(OG_TITLE_SELECTOR);
		expect(metaTag).toBeTruthy();
		expect(metaTag?.getAttribute('property')).toBe(OG_TITLE_VALUE);
		expect(metaTag?.content).toBe('Open Graph Title');
	});
});

describe('updateMetaTag - updates', () => {
	it('updates an existing meta tag when it already exists', () => {
		const existingMeta = document.createElement('meta');
		existingMeta.setAttribute('name', DESCRIPTION_VALUE);
		existingMeta.content = 'Original description';
		document.head.append(existingMeta);

		const options: UpdateMetaTagOptions = {
			selector: DESCRIPTION_SELECTOR,
			attribute: 'name',
			value: DESCRIPTION_VALUE,
			content: 'Updated description',
		};

		updateMetaTag(options);

		const metaTag = document.querySelector<HTMLMetaElement>(DESCRIPTION_SELECTOR);
		expect(metaTag).toBeTruthy();
		expect(metaTag?.content).toBe('Updated description');
		expect(document.querySelectorAll(DESCRIPTION_SELECTOR).length).toBe(1);
	});

	it('updates an existing property-based meta tag', () => {
		const existingMeta = document.createElement('meta');
		existingMeta.setAttribute('property', OG_TITLE_VALUE);
		existingMeta.content = 'Original OG Title';
		document.head.append(existingMeta);

		const options: UpdateMetaTagOptions = {
			selector: OG_TITLE_SELECTOR,
			attribute: 'property',
			value: OG_TITLE_VALUE,
			content: 'Updated OG Title',
		};

		updateMetaTag(options);

		const metaTag = document.querySelector<HTMLMetaElement>(OG_TITLE_SELECTOR);
		expect(metaTag).toBeTruthy();
		expect(metaTag?.content).toBe('Updated OG Title');
		expect(document.querySelectorAll(OG_TITLE_SELECTOR).length).toBe(1);
	});
});

describe('updateMetaTag - edge cases', () => {
	it('handles empty content string', () => {
		const options: UpdateMetaTagOptions = {
			selector: DESCRIPTION_SELECTOR,
			attribute: 'name',
			value: DESCRIPTION_VALUE,
			content: '',
		};

		updateMetaTag(options);

		const metaTag = document.querySelector<HTMLMetaElement>(DESCRIPTION_SELECTOR);
		expect(metaTag).toBeTruthy();
		expect(metaTag?.content).toBe('');
	});

	it('handles special characters in content', () => {
		const options: UpdateMetaTagOptions = {
			selector: DESCRIPTION_SELECTOR,
			attribute: 'name',
			value: DESCRIPTION_VALUE,
			content: 'Test with "quotes" & <special> characters',
		};

		updateMetaTag(options);

		const metaTag = document.querySelector<HTMLMetaElement>(DESCRIPTION_SELECTOR);
		expect(metaTag).toBeTruthy();
		expect(metaTag?.content).toBe('Test with "quotes" & <special> characters');
	});

	it('handles long content strings', () => {
		const longContent = 'A'.repeat(1000);
		const options: UpdateMetaTagOptions = {
			selector: DESCRIPTION_SELECTOR,
			attribute: 'name',
			value: DESCRIPTION_VALUE,
			content: longContent,
		};

		updateMetaTag(options);

		const metaTag = document.querySelector<HTMLMetaElement>(DESCRIPTION_SELECTOR);
		expect(metaTag).toBeTruthy();
		expect(metaTag?.content).toBe(longContent);
	});
});

describe('updateMetaTag - special scenarios', () => {
	it('handles multiple calls with different selectors', () => {
		const options1: UpdateMetaTagOptions = {
			selector: DESCRIPTION_SELECTOR,
			attribute: 'name',
			value: DESCRIPTION_VALUE,
			content: 'Description 1',
		};

		const options2: UpdateMetaTagOptions = {
			selector: OG_TITLE_SELECTOR,
			attribute: 'property',
			value: OG_TITLE_VALUE,
			content: 'OG Title 1',
		};

		updateMetaTag(options1);
		updateMetaTag(options2);

		const descTag = document.querySelector<HTMLMetaElement>(DESCRIPTION_SELECTOR);
		const ogTag = document.querySelector<HTMLMetaElement>(OG_TITLE_SELECTOR);
		expect(descTag).toBeTruthy();
		expect(ogTag).toBeTruthy();
		expect(descTag?.content).toBe('Description 1');
		expect(ogTag?.content).toBe('OG Title 1');
	});

	it('returns early when document is undefined (SSR safety)', () => {
		const originalDocument = globalThis.document;

		Object.defineProperty(globalThis, 'document', {
			value: undefined,
			writable: true,
			configurable: true,
		});

		const options: UpdateMetaTagOptions = {
			selector: DESCRIPTION_SELECTOR,
			attribute: 'name',
			value: DESCRIPTION_VALUE,
			content: TEST_DESCRIPTION,
		};

		expect(() => updateMetaTag(options)).not.toThrow();

		Object.defineProperty(globalThis, 'document', {
			value: originalDocument,
			writable: true,
			configurable: true,
		});
	});

	it('appends meta tag to document head', () => {
		const options: UpdateMetaTagOptions = {
			selector: 'meta[name="test"]',
			attribute: 'name',
			value: 'test',
			content: 'Test content',
		};

		updateMetaTag(options);

		const metaTag = document.head.querySelector<HTMLMetaElement>('meta[name="test"]');
		expect(metaTag).toBeTruthy();
		expect(metaTag?.parentElement).toBe(document.head);
	});
});
