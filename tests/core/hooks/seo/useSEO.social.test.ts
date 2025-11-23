import { useSEO } from '@core/hooks/seo/useSEO';
import { renderHook, waitFor } from '@testing-library/react';
import { clearDocument, TEST_VALUES } from '@tests/core/utils/seo/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock applySEOToDocument to track calls
const mockApplySEOToDocument = vi.fn();
vi.mock('@core/utils/seo/seoDomUtils', () => ({
	applySEOToDocument: (seo: unknown) => mockApplySEOToDocument(seo),
}));

// Mock mergeSEOConfig to use actual implementation
vi.mock('@core/config/seo', async () => {
	const actual = await vi.importActual('@core/config/seo');
	return {
		...actual,
	};
});

describe('useSEO - Social Media', () => {
	beforeEach(() => {
		clearDocument();
		mockApplySEOToDocument.mockClear();
	});

	afterEach(() => {
		clearDocument();
		mockApplySEOToDocument.mockClear();
	});

	runOpenGraphTests();
	runTwitterCardTests();
});

function runOpenGraphTests() {
	describe('OpenGraph tags', () => {
		shouldUpdateOgType();
		shouldUpdateOgImage();
		shouldUpdateOgImageDimensions();
		shouldUpdateOgImageAlt();
		shouldUpdateOgLocale();
		shouldApplyAllOgTags();
	});
}

function shouldUpdateOgType() {
	it('updates OpenGraph type tag', async () => {
		renderHook(() =>
			useSEO({
				ogType: TEST_VALUES.ogType,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.ogType).toBe(TEST_VALUES.ogType);
	});
}

function shouldUpdateOgImage() {
	it('updates OpenGraph image tag', async () => {
		renderHook(() =>
			useSEO({
				ogImage: TEST_VALUES.imageUrl,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.ogImage).toContain(TEST_VALUES.imageUrl);
	});
}

function shouldUpdateOgImageDimensions() {
	it('updates OpenGraph image dimensions', async () => {
		renderHook(() =>
			useSEO({
				ogImageWidth: 1200,
				ogImageHeight: 630,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.ogImageWidth).toBe(1200);
		expect(appliedConfig?.ogImageHeight).toBe(630);
	});
}

function shouldUpdateOgImageAlt() {
	it('updates OpenGraph image alt text', async () => {
		const ogImageAlt = 'Test OG image alt';
		renderHook(() =>
			useSEO({
				ogImageAlt,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.ogImageAlt).toBe(ogImageAlt);
	});
}

function shouldUpdateOgLocale() {
	it('updates OpenGraph locale tag', async () => {
		renderHook(() =>
			useSEO({
				ogLocale: TEST_VALUES.ogLocale,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.ogLocale).toBe(TEST_VALUES.ogLocale);
	});
}

function shouldApplyAllOgTags() {
	it('applies all OpenGraph tags together', async () => {
		renderHook(() =>
			useSEO({
				ogType: 'article',
				ogImage: TEST_VALUES.imageUrl,
				ogImageWidth: 1200,
				ogImageHeight: 630,
				ogImageAlt: 'Test alt',
				ogLocale: 'en_US',
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		expect(appliedConfig?.ogType).toBe('article');
		expect(appliedConfig?.ogImage).toContain(TEST_VALUES.imageUrl);
		expect(appliedConfig?.ogImageWidth).toBe(1200);
		expect(appliedConfig?.ogImageHeight).toBe(630);
		expect(appliedConfig?.ogImageAlt).toBe('Test alt');
		expect(appliedConfig?.ogLocale).toBe('en_US');
	});
}

function runTwitterCardTests() {
	describe('Twitter cards', () => {
		it('updates Twitter card type', async () => {
			renderHook(() =>
				useSEO({
					twitterCard: TEST_VALUES.twitterCard,
				})
			);

			await waitFor(() => {
				expect(mockApplySEOToDocument).toHaveBeenCalled();
			});

			const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
			expect(appliedConfig?.twitterCard).toBe(TEST_VALUES.twitterCard);
		});

		it('updates Twitter image tag', async () => {
			renderHook(() =>
				useSEO({
					twitterImage: TEST_VALUES.twitterImageUrl,
				})
			);

			await waitFor(() => {
				expect(mockApplySEOToDocument).toHaveBeenCalled();
			});

			const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
			expect(appliedConfig?.twitterImage).toContain(TEST_VALUES.twitterImageUrl);
		});

		it('updates Twitter image alt text', async () => {
			const twitterImageAlt = 'Test Twitter image alt';
			renderHook(() =>
				useSEO({
					twitterImageAlt,
				})
			);

			await waitFor(() => {
				expect(mockApplySEOToDocument).toHaveBeenCalled();
			});

			const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
			expect(appliedConfig?.twitterImageAlt).toBe(twitterImageAlt);
		});

		it('applies all Twitter card tags together', async () => {
			renderHook(() =>
				useSEO({
					twitterCard: 'summary_large_image',
					twitterImage: TEST_VALUES.twitterImageUrl,
					twitterImageAlt: 'Twitter alt',
				})
			);

			await waitFor(() => {
				expect(mockApplySEOToDocument).toHaveBeenCalled();
			});

			const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
			expect(appliedConfig?.twitterCard).toBe('summary_large_image');
			expect(appliedConfig?.twitterImage).toContain(TEST_VALUES.twitterImageUrl);
			expect(appliedConfig?.twitterImageAlt).toBe('Twitter alt');
		});
	});
}
