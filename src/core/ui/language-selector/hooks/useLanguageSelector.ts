import { useTranslation } from '@core/i18n/useTranslation';
import {
	getAllLanguageMetadata,
	getLanguageMetadata,
} from '@core/ui/language-selector/utils/languageMetadata';
import type { DropdownMenuItemOrSeparator } from '@core/ui/overlays/dropdown-menu/types/DropdownMenu.types';
import { useCallback, useMemo } from 'react';

export interface UseLanguageSelectorReturn {
	readonly currentLanguage: string;
	readonly currentLanguageMetadata: ReturnType<typeof getLanguageMetadata>;
	readonly menuItems: DropdownMenuItemOrSeparator[];
	readonly t: ReturnType<typeof useTranslation<'common'>>['t'];
}

/**
 * Custom hook for language selector functionality
 *
 * Provides:
 * - Current language detection
 * - Language metadata
 * - Menu items for dropdown
 * - Translation function
 *
 * @param onLanguageChange - Optional callback called after language change
 */
export function useLanguageSelector(onLanguageChange?: () => void): UseLanguageSelectorReturn {
	const { t, i18n: i18nInstance } = useTranslation('common');

	const currentLanguage = useMemo(() => {
		return i18nInstance.language.split('-')[0] ?? 'en';
	}, [i18nInstance.language]);

	const currentLanguageMetadata = useMemo(() => {
		return getLanguageMetadata(currentLanguage);
	}, [currentLanguage]);

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
			label: t(`language.${lang.code}`),
			onSelect: () => {
				handleLanguageChange(lang.code);
			},
			disabled: lang.code === currentLanguage,
		}));
	}, [currentLanguage, t, handleLanguageChange]);

	return {
		currentLanguage,
		currentLanguageMetadata,
		menuItems,
		t,
	};
}
