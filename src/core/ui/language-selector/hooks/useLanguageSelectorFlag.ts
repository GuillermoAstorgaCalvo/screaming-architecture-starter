import { useTranslation } from '@core/i18n/useTranslation';
import {
  getAllLanguageMetadata,
  getLanguageMetadata,
} from '@core/ui/language-selector/utils/languageMetadata';
import type { DropdownMenuItemOrSeparator } from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';
import { createElement, useCallback, useMemo } from 'react';

export interface LanguageInfo {
	readonly name: string;
	readonly flag: string;
}

export interface UseLanguageSelectorFlagReturn {
	readonly currentLanguage: string;
	readonly currentLanguageMetadata: ReturnType<typeof getLanguageMetadata>;
	readonly currentLanguageInfo: LanguageInfo;
	readonly menuItems: DropdownMenuItemOrSeparator[];
	readonly t: ReturnType<typeof useTranslation<'common'>>['t'];
}

/**
 * Custom hook for language selector with flag functionality
 *
 * Provides:
 * - Current language detection with flag
 * - Language metadata
 * - Menu items with flags for dropdown
 * - Translation function
 *
 * @param onLanguageChange - Optional callback called after language change
 */
export function useLanguageSelectorFlag(
	onLanguageChange?: () => void
): UseLanguageSelectorFlagReturn {
	const { t, i18n: i18nInstance } = useTranslation('common');

	const currentLanguage = useMemo(() => {
		return i18nInstance.language.split('-')[0] ?? 'en';
	}, [i18nInstance.language]);

	const currentLanguageMetadata = useMemo(() => {
		return getLanguageMetadata(currentLanguage);
	}, [currentLanguage]);

	const currentLanguageInfo = useMemo((): LanguageInfo => {
		const name = currentLanguageMetadata
			? t(`language.${currentLanguageMetadata.code}` as const)
			: currentLanguage.toUpperCase();
		const flag = currentLanguageMetadata?.flag ?? '🌐';
		return { name, flag };
	}, [currentLanguage, currentLanguageMetadata, t]);

	const handleLanguageChange = useCallback(
		(languageCode: string) => {
			i18nInstance.changeLanguage(languageCode).catch(() => {
				// Language change failed, ignore
			});
			onLanguageChange?.();
		},
		[i18nInstance, onLanguageChange]
	);

	const menuItems = useMemo(() => {
		const languageMetadata = getAllLanguageMetadata();

		return languageMetadata.map(lang => ({
			id: lang.code,
			label: createElement(
				'span',
				{ className: 'flex items-center gap-2' },
				createElement('span', { 'aria-hidden': true }, lang.flag),
				createElement('span', null, t(`language.${lang.code}` as const))
			),
			onSelect: () => {
				handleLanguageChange(lang.code);
			},
			disabled: lang.code === currentLanguage,
		}));
	}, [currentLanguage, t, handleLanguageChange]);

	return {
		currentLanguage,
		currentLanguageMetadata,
		currentLanguageInfo,
		menuItems,
		t,
	};
}
