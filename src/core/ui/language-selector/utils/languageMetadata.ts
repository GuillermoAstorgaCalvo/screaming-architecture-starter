/**
 * Language Metadata Utilities
 *
 * Provides language names, flag emojis, and other metadata for supported languages
 */

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '@core/i18n/constants/constants';

/**
 * Language metadata including native name, English name, and flag emoji
 */
export interface LanguageMetadata {
	readonly code: SupportedLanguage;
	readonly nativeName: string;
	readonly englishName: string;
	readonly flag: string;
}

/**
 * Language metadata map
 * Maps language codes to their metadata (native name, English name, flag emoji)
 */
export const LANGUAGE_METADATA: Record<SupportedLanguage, LanguageMetadata> = {
	en: {
		code: 'en',
		nativeName: 'English',
		englishName: 'English',
		flag: '🇺🇸',
	},
	es: {
		code: 'es',
		nativeName: 'Español',
		englishName: 'Spanish',
		flag: '🇪🇸',
	},
	ar: {
		code: 'ar',
		nativeName: 'العربية',
		englishName: 'Arabic',
		flag: '🇸🇦',
	},
} as const;

/**
 * Get metadata for a specific language
 * @param language - Language code
 * @returns Language metadata or undefined if not found
 */
export function getLanguageMetadata(language: string): LanguageMetadata | undefined {
	const normalized = language.split('-')[0] as SupportedLanguage;
	return LANGUAGE_METADATA[normalized];
}

/**
 * Get all language metadata as an array
 * @returns Array of language metadata
 */
export function getAllLanguageMetadata(): readonly LanguageMetadata[] {
	return SUPPORTED_LANGUAGES.map(code => LANGUAGE_METADATA[code]);
}

/**
 * Get flag emoji for a language
 * @param language - Language code
 * @returns Flag emoji or empty string if not found
 */
export function getLanguageFlag(language: string): string {
	return getLanguageMetadata(language)?.flag ?? '';
}

/**
 * Get native name for a language
 * @param language - Language code
 * @returns Native name or empty string if not found
 */
export function getLanguageNativeName(language: string): string {
	return getLanguageMetadata(language)?.nativeName ?? '';
}

/**
 * Get English name for a language
 * @param language - Language code
 * @returns English name or empty string if not found
 */
export function getLanguageEnglishName(language: string): string {
	return getLanguageMetadata(language)?.englishName ?? '';
}
