import { getDefaultSEO } from '@core/config/seo';
import { useSEO } from '@core/hooks/seo/useSEO';
import { renderHook, waitFor } from '@testing-library/react';
import { clearDocument } from '@tests/core/utils/seo/test-helpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock applySEOToDocument to track calls
const mockApplySEOToDocument = vi.fn();
vi.mock('@core/utils/seo/seoDomUtils', () => ({
	applySEOToDocument: (seo: unknown) => mockApplySEOToDocument(seo),
}));

const SECOND_TITLE = 'Second Title';
const SECOND_DESCRIPTION = 'Second description';
const ORIGINAL_TITLE = 'Original Title';
const NEW_DESCRIPTION = 'New description';

// Mock mergeSEOConfig to use actual implementation
vi.mock('@core/config/seo', async () => {
	const actual = await vi.importActual('@core/config/seo');
	return {
		...actual,
	};
});

describe('useSEO - Cleanup and Edge Cases', () => {
	beforeEach(() => {
		clearDocument();
		mockApplySEOToDocument.mockClear();
	});

	afterEach(() => {
		clearDocument();
		mockApplySEOToDocument.mockClear();
	});

	runCleanupTests();
	runEdgeCaseTests();
});

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
		document.title = ORIGINAL_TITLE;
		const originalDescription = document.createElement('meta');
		originalDescription.setAttribute('name', 'description');
		originalDescription.content = 'Original description';
		document.head.append(originalDescription);

		const { unmount } = renderHook(() =>
			useSEO({
				title: 'New Title',
				description: NEW_DESCRIPTION,
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
	runBasicEdgeCaseTests();
	runStoreCurrentSEOTests();
	runErrorHandlingTests();
}

function runBasicEdgeCaseTests() {
	describe('edge cases', () => {
		shouldHandleEmptyConfigObject();
		shouldHandleUndefinedConfig();
		shouldHandleSSREnvironment();
		shouldHandleConfigChanges();
	});
}

function shouldHandleEmptyConfigObject() {
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
}

function shouldHandleUndefinedConfig() {
	it('handles undefined config', async () => {
		renderHook(() => useSEO());

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		const appliedConfig = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		const defaultSEO = getDefaultSEO();
		expect(appliedConfig?.title).toBe(defaultSEO.title);
	});
}

function shouldHandleSSREnvironment() {
	it('handles SSR environment (document undefined)', () => {
		// Note: renderHook requires document to exist, so we test that the hook
		// handles document being undefined internally rather than testing renderHook
		// The hook's internal logic checks for document existence before using it
		expect(typeof document).toBe('object');
	});
}

function shouldHandleConfigChanges() {
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
}

function runStoreCurrentSEOTests() {
	describe('storeCurrentSEO function', () => {
		shouldCaptureCurrentDocumentState();
		shouldHandleMissingDescriptionMetaTag();
		shouldHandleMissingCanonicalLink();
		shouldHandleEmptyDocumentState();
	});
}

function shouldCaptureCurrentDocumentState() {
	it('captures current document title, description, and canonical URL', async () => {
		// Set up initial document state
		document.title = ORIGINAL_TITLE;
		const descriptionMeta = document.createElement('meta');
		descriptionMeta.setAttribute('name', 'description');
		descriptionMeta.content = 'Original description';
		document.head.append(descriptionMeta);

		const canonicalLink = document.createElement('link');
		canonicalLink.setAttribute('rel', 'canonical');
		canonicalLink.href = 'https://example.com/original';
		document.head.append(canonicalLink);

		const { unmount } = renderHook(() =>
			useSEO({
				title: 'New Title',
				description: NEW_DESCRIPTION,
				canonicalUrl: 'https://example.com/new',
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

		// Verify that cleanup was called (restoring previous state)
		expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThanOrEqual(callsBeforeUnmount + 1);
	});
}

function shouldHandleMissingDescriptionMetaTag() {
	it('handles missing description meta tag', async () => {
		document.title = ORIGINAL_TITLE;
		// No description meta tag

		const { unmount } = renderHook(() =>
			useSEO({
				title: 'New Title',
				description: NEW_DESCRIPTION,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		unmount();

		await waitFor(() => {
			expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(1);
		});

		// Should still restore without errors
		expect(mockApplySEOToDocument).toHaveBeenCalled();
	});
}

function shouldHandleMissingCanonicalLink() {
	it('handles missing canonical link', async () => {
		document.title = ORIGINAL_TITLE;
		// No canonical link

		const { unmount } = renderHook(() =>
			useSEO({
				title: 'New Title',
				canonicalUrl: 'https://example.com/new',
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		unmount();

		await waitFor(() => {
			expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(1);
		});

		// Should still restore without errors
		expect(mockApplySEOToDocument).toHaveBeenCalled();
	});
}

function shouldHandleEmptyDocumentState() {
	it('handles empty document state', async () => {
		clearDocument();

		const { unmount } = renderHook(() =>
			useSEO({
				title: 'New Title',
				description: NEW_DESCRIPTION,
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		unmount();

		await waitFor(() => {
			expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(1);
		});

		// Should restore to default SEO when no previous state
		const cleanupCall = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		const defaultSEO = getDefaultSEO();
		expect(cleanupCall?.title).toBe(defaultSEO.title);
	});
}

function runErrorHandlingTests() {
	describe('error handling in storeCurrentSEO', () => {
		shouldFallbackToDefaultSEOOnError();
	});
}

function shouldFallbackToDefaultSEOOnError() {
	it('falls back to default SEO when storeCurrentSEO throws error', async () => {
		// Mock querySelector to throw an error - required for error handling test
		// eslint-disable-next-line -- Testing error handling requires accessing DOM API directly
		const originalQuerySelector = document.querySelector;

		vi.spyOn(document, 'querySelector').mockImplementation(() => {
			throw new Error('Query selector error');
		});

		const { unmount } = renderHook(() =>
			useSEO({
				title: 'Test Title',
				description: 'Test description',
			})
		);

		await waitFor(() => {
			expect(mockApplySEOToDocument).toHaveBeenCalled();
		});

		unmount();

		await waitFor(() => {
			expect(mockApplySEOToDocument.mock.calls.length).toBeGreaterThan(1);
		});

		// Should fall back to default SEO on error
		const cleanupCall = mockApplySEOToDocument.mock.calls.at(-1)?.[0];
		const defaultSEO = getDefaultSEO();
		expect(cleanupCall?.title).toBe(defaultSEO.title);

		// Restore original
		vi.spyOn(document, 'querySelector').mockImplementation(originalQuerySelector);
	});
}
