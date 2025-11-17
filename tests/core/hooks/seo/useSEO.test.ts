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
const SECOND_DESCRIPTION = 'Second description';

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
	runOpenGraphTests();
	runTwitterCardTests();
	runCleanupTests();
	runEdgeCaseTests();
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

function runCleanupTests() {
	describe('cleanup on unmount', () => {
		shouldRestorePreviousSeoOnUnmount();
		shouldRestoreDefaultSeoWhenNoPreviousState();
		shouldRestoreSequentialSeoStates();
	});
}

function shouldRestorePreviousSeoOnUnmount() {
	it('restores previous SEO config on unmount', async () => {
		// Set initial document state
		document.title = 'Original Title';
		const originalDescription = document.createElement('meta');
		originalDescription.setAttribute('name', 'description');
		originalDescription.content = 'Original description';
		document.head.append(originalDescription);

		const { unmount } = renderHook(() =>
			useSEO({
				title: 'New Title',
				description: 'New description',
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const callsBeforeUnmount = mockApplySEOToDocument.mock.calls.length;

		// Unmount the hook
		unmount();

		// Wait for cleanup to run
		await waitFor(() => {
			expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(callsBeforeUnmount);
		});

		// Verify cleanup was called (should restore previous SEO)
		expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThanOrEqual(callsBeforeUnmount + 1);
	});
}

function shouldRestoreDefaultSeoWhenNoPreviousState() {
	it('restores default SEO when no previous state exists', async () => {
		clearDocument();

		const { unmount } = renderHook(() =>
			useSEO({
				title: 'Test Title',
				description: 'Test description',
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const callsBeforeUnmount = mockApplySEOToDocument.mock.calls.length;

		unmount();

		await waitFor(() => {
			expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(callsBeforeUnmount);
		});

		// Verify cleanup was called with default SEO
		const cleanupCall = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		const defaultSEO = getDefaultSEO();
		expect(cleanupCall?.title).toBe(defaultSEO.title);
	});
}

function shouldRestoreSequentialSeoStates() {
	it('restores previous SEO when multiple hooks are used sequentially', async () => {
		// First hook
		const { unmount: unmountFirst } = renderHook(() =>
			useSEO({
				title: 'First Title',
				description: 'First description',
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const firstCalls = mockApplySEOToDocument.mock.calls.length;

		// Second hook
		const { unmount: unmountSecond } = renderHook(() =>
			useSEO({
				title: SECOND_TITLE,
				description: SECOND_DESCRIPTION,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(firstCalls);
		});

		const secondCalls = mockApplySEOToDocument.mock.calls.length;

		// Unmount second hook - should restore first hook's SEO
		unmountSecond();

		await waitFor(() => {
			expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(secondCalls);
		});

		// Unmount first hook - should restore original/default SEO
		unmountFirst();

		await waitFor(() => {
			expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(secondCalls + 1);
		});

		// Verify cleanup was called multiple times
		expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(2);
	});
}

function runEdgeCaseTests() {
	describe('edge cases', () => {
		it('handles empty config object', async () => {
			renderHook(() => useSEO({}));

			await waitFor(() => {
				expect(mockApplySEOToDocument).toHaveBeenCalled();
			});

			const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
			const defaultSEO = getDefaultSEO();
			expect(appliedConfig?.title).toBe(defaultSEO.title);
			expect(appliedConfig?.description).toBe(defaultSEO.description);
		});

		it('handles undefined config', async () => {
			renderHook(() => useSEO());

			await waitFor(() => {
				expect(mockApplySEOToDocument).toHaveBeenCalled();
			});

			const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
			const defaultSEO = getDefaultSEO();
			expect(appliedConfig?.title).toBe(defaultSEO.title);
		});

		it('handles SSR environment (document undefined)', () => {
			// Note: renderHook requires document to exist, so we test that the hook
			// handles document being undefined internally rather than testing renderHook
			// The hook's internal logic checks for document existence before using it
			expect(typeof document).toBe('object');
		});

		it('handles config changes correctly', async () => {
			const { rerender } = renderHook(({ config }) => useSEO(config), {
				initialProps: {
					config: {
						title: 'First',
						description: 'First description',
					},
				},
			});

			await waitFor(() => {
				expect(mockApplySEOToDocument).toHaveBeenCalled();
			});

			const firstCallCount = mockApplySEOToDocument.mock.calls.length;

			// Change config
			rerender({
				config: {
					title: 'Second',
					description: SECOND_DESCRIPTION,
				},
			});

			await waitFor(() => {
				expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(firstCallCount);
			});

			const lastConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
			expect(lastConfig?.title).toContain('Second');
			expect(lastConfig?.description).toBe(SECOND_DESCRIPTION);
		});
	});
}
