/**
 * useLanguageSelector Tests
 *
 * Tests for the useLanguageSelector hook including:
 * - Current language detection
 * - Language metadata retrieval
 * - Menu items generation
 * - Language change handling
 * - Callback execution
 * - Translation function
 */

import { useLanguageSelector } from '@core/ui/language-selector/hooks/useLanguageSelector';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock i18n
const mockChangeLanguage = vi.fn().mockResolvedValue(undefined);
const mockI18n = {
	language: 'en',
	changeLanguage: mockChangeLanguage,
};

vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: vi.fn(() => ({
		t: vi.fn((key: string) => {
			const translations: Record<string, string> = {
				'language.en': 'English',
				'language.es': 'Spanish',
				'language.ar': 'Arabic',
				'a11y.selectLanguage': 'Select language',
			};
			return translations[key] ?? key;
		}),
		i18n: mockI18n,
	})),
}));

describe('useLanguageSelector', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockI18n.language = 'en';
	});

	it('should be a function', () => {
		expect(typeof useLanguageSelector).toBe('function');
	});

	it('should return all expected properties', () => {
		const { result } = renderHook(() => useLanguageSelector());

		expect(result.current).toHaveProperty('currentLanguage');
		expect(result.current).toHaveProperty('currentLanguageMetadata');
		expect(result.current).toHaveProperty('menuItems');
		expect(result.current).toHaveProperty('t');
	});

	it('should detect current language from i18n', () => {
		mockI18n.language = 'en';
		const { result } = renderHook(() => useLanguageSelector());

		expect(result.current.currentLanguage).toBe('en');
	});

	it('should handle language codes with locale', () => {
		mockI18n.language = 'en-US';
		const { result } = renderHook(() => useLanguageSelector());

		expect(result.current.currentLanguage).toBe('en');
	});

	it('should return language metadata for current language', () => {
		mockI18n.language = 'en';
		const { result } = renderHook(() => useLanguageSelector());

		expect(result.current.currentLanguageMetadata).toBeDefined();
		expect(result.current.currentLanguageMetadata?.code).toBe('en');
	});

	it('should return undefined metadata for unsupported language', () => {
		mockI18n.language = 'fr';
		const { result } = renderHook(() => useLanguageSelector());

		expect(result.current.currentLanguageMetadata).toBeUndefined();
	});

	it('should generate menu items for all supported languages', () => {
		const { result } = renderHook(() => useLanguageSelector());

		expect(result.current.menuItems.length).toBeGreaterThan(0);
	});

	it('should include all supported languages in menu items', () => {
		const { result } = renderHook(() => useLanguageSelector());

		const codes = result.current.menuItems.map(item => item.id);
		expect(codes).toContain('en');
		expect(codes).toContain('es');
		expect(codes).toContain('ar');
	});

	it('should disable current language in menu items', () => {
		mockI18n.language = 'en';
		const { result } = renderHook(() => useLanguageSelector());

		const currentLanguageItem = result.current.menuItems.find(item => item.id === 'en');
		expect(
			currentLanguageItem && 'type' in currentLanguageItem ? false : currentLanguageItem?.disabled
		).toBe(true);
	});

	it('should not disable other languages in menu items', () => {
		mockI18n.language = 'en';
		const { result } = renderHook(() => useLanguageSelector());

		const spanishItem = result.current.menuItems.find(item => item.id === 'es');
		expect(spanishItem && 'type' in spanishItem ? false : spanishItem?.disabled).toBe(false);
	});

	it('should call changeLanguage when menu item is selected', async () => {
		const { result } = renderHook(() => useLanguageSelector());

		const spanishItem = result.current.menuItems.find(item => item.id === 'es');
		expect(spanishItem).toBeDefined();

		await act(async () => {
			if (spanishItem && !('type' in spanishItem)) {
				spanishItem.onSelect?.();
			}
		});

		await waitFor(() => {
			expect(mockChangeLanguage).toHaveBeenCalledWith('es');
		});
	});

	it('should call onLanguageChange callback when provided', async () => {
		const onLanguageChange = vi.fn();
		const { result } = renderHook(() => useLanguageSelector(onLanguageChange));

		const spanishItem = result.current.menuItems.find(item => item.id === 'es');
		expect(spanishItem).toBeDefined();

		await act(async () => {
			if (spanishItem && !('type' in spanishItem)) {
				spanishItem.onSelect?.();
			}
		});

		await waitFor(() => {
			expect(onLanguageChange).toHaveBeenCalled();
		});
	});

	it('should not call onLanguageChange callback when not provided', async () => {
		const onLanguageChange = vi.fn();
		const { result } = renderHook(() => useLanguageSelector());

		const spanishItem = result.current.menuItems.find(item => item.id === 'es');
		expect(spanishItem).toBeDefined();

		await act(async () => {
			if (spanishItem && !('type' in spanishItem)) {
				spanishItem.onSelect?.();
			}
		});

		await waitFor(() => {
			expect(onLanguageChange).not.toHaveBeenCalled();
		});
	});

	it('should handle language change errors gracefully', async () => {
		mockChangeLanguage.mockRejectedValueOnce(new Error('Change failed'));
		const { result } = renderHook(() => useLanguageSelector());

		const spanishItem = result.current.menuItems.find(item => item.id === 'es');
		expect(spanishItem).toBeDefined();

		await act(async () => {
			if (spanishItem && !('type' in spanishItem)) {
				spanishItem.onSelect?.();
			}
		});

		// Should not throw
		expect(mockChangeLanguage).toHaveBeenCalled();
	});

	it('should return translation function', () => {
		const { result } = renderHook(() => useLanguageSelector());

		expect(typeof result.current.t).toBe('function');
	});

	it('should update when language changes', () => {
		mockI18n.language = 'en';
		const { result, rerender } = renderHook(() => useLanguageSelector());

		expect(result.current.currentLanguage).toBe('en');

		mockI18n.language = 'es';
		rerender();

		expect(result.current.currentLanguage).toBe('es');
	});
});
