/**
 * TypeScript types for translation keys
 *
 * This file provides type-safe access to translation keys.
 * Types are manually maintained based on translation JSON files.
 *
 * For better type safety at scale, consider using i18next TypeScript generator:
 * - i18next-parser for extracting keys
 * - i18next-ts-generator for generating types
 * - Or a custom script to generate types from JSON files
 *
 * Structure:
 * - Keys are namespaced by domain (e.g., 'landing', 'common')
 * - Nested keys use dot notation (e.g., 'landing.hero.title')
 * - All keys must be strings (no nested objects in translation values)
 *
 * @example
 * ```ts
 * // Usage in components
 * const { t } = useTranslation('landing');
 * const title = t('hero.title'); // Type-safe, autocomplete available
 * ```
 *
 * @module core/i18n/types
 */

/**
 * Common namespace translations
 * Add keys as they are defined in core/i18n/locales/*.json
 *
 * @example
 * ```json
 * {
 *   "app": {
 *     "title": "My App",
 *     "description": "App description"
 *   },
 *   "nav": {
 *     "home": "Home"
 *   }
 * }
 * ```
 * Maps to:
 * ```ts
 * {
 *   'app.title': string;
 *   'app.description': string;
 *   'nav.home': string;
 * }
 * ```
 */
export interface CommonTranslations {
	'app.title': string;
	'app.description': string;
	'nav.home': string;
}

/**
 * Landing domain translations
 * Add keys as they are defined in domains/landing/i18n/*.json
 *
 * @example
 * ```json
 * {
 *   "hero": {
 *     "title": "Welcome",
 *     "subtitle": "Welcome subtitle"
 *   }
 * }
 * ```
 * Maps to:
 * ```ts
 * {
 *   'hero.title': string;
 *   'hero.subtitle': string;
 * }
 * ```
 */
export interface LandingTranslations {
	'hero.title': string;
	'hero.subtitle': string;
	'buttons.title': string;
	'buttons.variants': string;
	'buttons.sizes': string;
	'buttons.states': string;
	'buttons.sizeVariantCombinations': string;
	'buttons.primary': string;
	'buttons.secondary': string;
	'buttons.ghost': string;
	'buttons.small': string;
	'buttons.medium': string;
	'buttons.large': string;
	'buttons.default': string;
	'buttons.disabled': string;
	'buttons.loading': string;
	'buttons.clickToLoad': string;
	'buttons.fullWidth': string;
	'buttons.primarySmall': string;
	'buttons.secondarySmall': string;
	'buttons.ghostSmall': string;
	'buttons.primaryMedium': string;
	'buttons.secondaryMedium': string;
	'buttons.ghostMedium': string;
	'buttons.primaryLarge': string;
	'buttons.secondaryLarge': string;
	'buttons.ghostLarge': string;
}

/**
 * Union type of all translation namespaces
 * Extend this as new domains are added
 *
 * @example
 * ```ts
 * // Adding a new domain
 * export interface MyDomainTranslations {
 *   'key1': string;
 *   'key2': string;
 * }
 *
 * export interface TranslationNamespaces {
 *   common: CommonTranslations;
 *   landing: LandingTranslations;
 *   'my-domain': MyDomainTranslations; // Add here
 * }
 * ```
 */
export interface TranslationNamespaces {
	common: CommonTranslations;
	landing: LandingTranslations;
}

/**
 * Type helper for getting translation keys from a namespace
 * Provides type-safe access to keys within a namespace
 *
 * @example
 * ```ts
 * type LandingKeys = NamespaceKeys<'landing'>;
 * // 'hero.title' | 'hero.subtitle' | 'buttons.title' | ...
 * ```
 */
export type NamespaceKeys<T extends keyof TranslationNamespaces> = keyof TranslationNamespaces[T] &
	string;

/**
 * Type helper for interpolation values
 * Extracts interpolation variable names from translation strings
 * Note: This is a simplified version; for full interpolation type safety,
 * consider using i18next-ts-generator or a similar tool
 *
 * @example
 * ```ts
 * // If translation is: "Hello {{name}}"
 * // InterpolationValues would include: { name: string }
 * ```
 */
export type InterpolationValues = Record<string, string | number | boolean | null | undefined>;

/**
 * Type helper for getting all possible translation keys across all namespaces
 * Useful for utilities that work with any translation key
 *
 * @example
 * ```ts
 * type AllKeys = AllTranslationKeys;
 * // 'common.app.title' | 'common.app.description' | 'landing.hero.title' | ...
 * ```
 */
export type AllTranslationKeys = {
	[K in keyof TranslationNamespaces]: `${K & string}.${string & keyof TranslationNamespaces[K]}`;
}[keyof TranslationNamespaces];

/**
 * Type helper for getting translation keys from a namespace
 * Provides type-safe access to keys within a namespace
 *
 * @template N - Namespace key
 * @example
 * ```ts
 * type LandingKeys = GetNamespaceKeys<'landing'>;
 * // 'hero.title' | 'hero.subtitle' | 'buttons.title' | ...
 * ```
 */
export type GetNamespaceKeys<N extends keyof TranslationNamespaces> = NamespaceKeys<N>;

/**
 * Type helper for checking if a namespace exists
 * @template N - Namespace key to check
 */
export type IsValidNamespace<N extends string> = N extends keyof TranslationNamespaces
	? true
	: false;

/**
 * Type helper for namespace validation
 * Throws a type error if namespace doesn't exist
 * @template N - Namespace key
 */
export type ValidateNamespace<N extends string> = IsValidNamespace<N> extends true ? N : never;

/**
 * Utility type for creating translation key with namespace
 * @template N - Namespace key
 * @template K - Translation key within namespace
 */
export type NamespacedKey<
	N extends keyof TranslationNamespaces,
	K extends NamespaceKeys<N>,
> = `${N}.${K}`;
