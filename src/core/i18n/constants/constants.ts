/**
 * i18n Constants
 *
 * Centralized constants for i18n configuration to ensure consistency
 * and make the system more maintainable.
 */

/**
 * Supported languages in the application
 * Add new languages here when needed
 */
export const SUPPORTED_LANGUAGES = ['en', 'es', 'ar'] as const;

/**
 * Default/fallback language
 */
export const DEFAULT_LANGUAGE = 'en' as const;

/**
 * RTL (Right-to-Left) languages
 * Languages that require RTL layout direction
 */
export const RTL_LANGUAGES = ['ar'] as const;

/**
 * Default namespace for translations
 */
export const DEFAULT_NAMESPACE = 'common' as const;

/**
 * LocalStorage key for language preference
 */
export const LANGUAGE_STORAGE_KEY = 'i18nextLng' as const;

/**
 * Language detection order
 * Priority: localStorage > browser > HTML tag
 */
export const LANGUAGE_DETECTION_ORDER = ['localStorage', 'navigator', 'htmlTag'] as const;

/**
 * Type exports for language types
 */
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type RtlLanguage = (typeof RTL_LANGUAGES)[number];

/**
 * Check if a language code is supported
 * @param language - Language code to check
 * @returns true if language is supported
 */
export function isSupportedLanguage(language: string): language is SupportedLanguage {
	return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
}

/**
 * Check if a language code is RTL
 * @param language - Language code to check
 * @returns true if language is RTL
 */
export function isRtlLanguage(language: string): language is RtlLanguage {
	return RTL_LANGUAGES.includes(language as RtlLanguage);
}

/**
 * Normalize language code to a supported language
 * Falls back to default language if not supported
 * @param language - Language code to normalize
 * @returns Normalized supported language
 */
export function normalizeLanguage(language: string): SupportedLanguage {
	return isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;
}
