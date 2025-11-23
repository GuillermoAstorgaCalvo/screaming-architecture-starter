import { getDefaultSEO } from '@core/config/seo';
import { useSEO } from '@core/hooks/seo/useSEO';
import { renderHook, waitFor } from '@testing-library/react';
import { clearDocument, TEST_VALUES } from '@tests/core/utils/seo/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock applySEOToDocument to track calls
const mockApplySEOToDocument = vi.fn();
vi.mock('@core/utils/seo/seoDomUtils', () => ({
	applySEOToDocument: (seo: unknown) => mockApplySEOToDocument(seo),
}));

const SECOND_TITLE = 'Second Title';

// Mock mergeSEOConfig to use actual implementation
vi.mock('@core/config/seo', async () => {
	const actual = await vi.importActual('@core/config/seo');
	return {
		...actual,
	};
});

describe('useSEO', () => {
	beforeEach(() => {
		clearDocument();
		mockApplySEOToDocument.mockClear();
	});

	afterEach(() => {
		clearDocument();
		mockApplySEOToDocument.mockClear();
	});
	runTitleUpdateTests();
	runMetaTagUpdateTests();
});

function runTitleUpdateTests() {
	describe('title updates', () => {
		it('updates document title when config is provided', async () => {
			renderHook(() =>
				useSEO({
					title: 'Test Page Title',
				})
			);

			await waitFor(() => {
				expect(mockApplySEOToDocument).toHaveBeenCalled();
			});

			// Verify the SEO config was applied with correct title
			const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
			expect(appliedConfig?.title).toContain('Test Page Title');
		});

		it('updates document title when title changes', async () => {
			const { rerender } = renderHook(({ title }) => useSEO({ title }), {
				initialProps: { title: 'First Title' },
			});

			await waitFor(() => {
				expect(mockApplySEOToDocument).toHaveBeenCalled();
			});

			const firstCall = mockApplySEOToDocument.mock.calls.length;

			// Update title
			rerender({ title: SECOND_TITLE });

			await waitFor(() => {
				expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(firstCall);
			});

			// Verify new title was applied
			const lastCall = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
			expect(lastCall?.title).toContain(SECOND_TITLE);
		});

		it('uses default title when no title is provided', async () => {
			renderHook(() => useSEO({}));

			await waitFor(() => {
				expect(mockApplySEOToDocument).toHaveBeenCalled();
			});

			const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
			const defaultSEO = getDefaultSEO();
			expect(appliedConfig?.title).toBe(defaultSEO.title);
		});
	});
}

function runMetaTagUpdateTests() {
	describe('meta tag updates', () => {
		shouldUpdateDescriptionMetaTag();
		shouldUpdateRobotsMetaTag();
		shouldUpdateKeywordsMetaTag();
		shouldUpdateAuthorMetaTag();
		shouldUpdateCanonicalUrl();
	});
}

function shouldUpdateDescriptionMetaTag() {
	it('updates description meta tag', async () => {
		renderHook(() =>
			useSEO({
				description: TEST_VALUES.description,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.description).toBe(TEST_VALUES.description);
	});
}

function shouldUpdateRobotsMetaTag() {
	it('updates robots meta tag when indexable is set', async () => {
		renderHook(() =>
			useSEO({
				indexable: false,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.indexable).toBe(false);
	});
}

function shouldUpdateKeywordsMetaTag() {
	it('updates keywords meta tag when provided', async () => {
		renderHook(() =>
			useSEO({
				keywords: TEST_VALUES.keywords,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.keywords).toBe(TEST_VALUES.keywords);
	});
}

function shouldUpdateAuthorMetaTag() {
	it('updates author meta tag when provided', async () => {
		renderHook(() =>
			useSEO({
				author: TEST_VALUES.author,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.author).toBe(TEST_VALUES.author);
	});
}

function shouldUpdateCanonicalUrl() {
	it('updates canonical URL when provided', async () => {
		renderHook(() =>
			useSEO({
				canonicalUrl: TEST_VALUES.canonicalUrl,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.canonicalUrl).toContain(TEST_VALUES.canonicalUrl);
	});
}
