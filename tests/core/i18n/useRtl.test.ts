import i18n, { i18nInitPromise } from '@core/i18n/i18n';
import { useRtl } from '@core/i18n/useRtl';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// Helper functions to reduce complexity
async function changeLanguage(language: string): Promise<void> {
	await act(async () => {
		await i18n.changeLanguage(language);
	});
}

async function renderHookAndWaitForRtl(expectedValue: boolean) {
	const { result } = renderHook(() => useRtl());
	await waitFor(() => {
		expect(result.current).toBe(expectedValue);
	});
	return result;
}

async function switchLanguageAndVerifyRtl(
	fromLanguage: string,
	toLanguage: string,
	expectedInitialRtl: boolean,
	expectedFinalRtl: boolean
) {
	await changeLanguage(fromLanguage);
	const { result } = renderHook(() => useRtl());
	await waitFor(() => {
		expect(result.current).toBe(expectedInitialRtl);
	});
	await changeLanguage(toLanguage);
	await waitFor(() => {
		expect(result.current).toBe(expectedFinalRtl);
	});
}

function describeRtlDetection() {
	describe('RTL detection', () => {
		it('should return false for LTR languages (English)', async () => {
			await changeLanguage('en');
			await renderHookAndWaitForRtl(false);
		});

		it('should return false for LTR languages (Spanish)', async () => {
			await changeLanguage('es');
			await renderHookAndWaitForRtl(false);
		});

		it('should return true for RTL languages (Arabic)', async () => {
			await changeLanguage('ar');
			await renderHookAndWaitForRtl(true);
		});

		it('should initialize with correct RTL value based on current language', async () => {
			await changeLanguage('ar');
			const { result } = renderHook(() => useRtl());
			// Should immediately reflect the current language
			expect(result.current).toBe(true);
		});
	});
}

function describeRtlSwitching() {
	describe('RTL switching', () => {
		it('should update from LTR to RTL when language changes', async () => {
			await switchLanguageAndVerifyRtl('en', 'ar', false, true);
		});

		it('should update from RTL to LTR when language changes', async () => {
			await switchLanguageAndVerifyRtl('ar', 'en', true, false);
		});

		it('should update between LTR languages without changing RTL status', async () => {
			await switchLanguageAndVerifyRtl('en', 'es', false, false);
		});

		it('should handle multiple language switches correctly', async () => {
			await changeLanguage('en');
			const { result } = renderHook(() => useRtl());
			await waitFor(() => {
				expect(result.current).toBe(false);
			});

			// Switch to RTL
			await changeLanguage('ar');
			await waitFor(() => {
				expect(result.current).toBe(true);
			});

			// Switch back to LTR
			await changeLanguage('es');
			await waitFor(() => {
				expect(result.current).toBe(false);
			});

			// Switch to RTL again
			await changeLanguage('ar');
			await waitFor(() => {
				expect(result.current).toBe(true);
			});
		});
	});
}

function describeCleanup() {
	describe('cleanup', () => {
		it('should clean up event listeners on unmount', async () => {
			await changeLanguage('en');
			const { result, unmount } = renderHook(() => useRtl());
			await waitFor(() => {
				expect(result.current).toBe(false);
			});

			unmount();

			// After unmount, the listener should be removed
			// Note: We can't directly test this, but we verify the hook doesn't cause memory leaks
			// by ensuring subsequent renders work correctly
			const { result: result2 } = renderHook(() => useRtl());
			await waitFor(() => {
				expect(result2.current).toBe(false);
			});
		});
	});
}

describe('useRtl', () => {
	beforeEach(async () => {
		await i18nInitPromise;
		await i18n.changeLanguage('en');
	});

	afterEach(async () => {
		await i18n.changeLanguage('en');
	});

	describeRtlDetection();
	describeRtlSwitching();
	describeCleanup();
});
