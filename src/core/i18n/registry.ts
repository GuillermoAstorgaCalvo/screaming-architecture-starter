/**
 * i18n Registry
 *
 * Central registry for domain translation registration.
 * Domains can register their translations here without core needing to know about them.
 */

import { registerResourceLoader } from '@core/i18n/resourceLoader/registry';
import type { ResourceLoader } from '@core/i18n/resourceLoader/types';

import { DEFAULT_LANGUAGE, normalizeLanguage, type SupportedLanguage } from './constants/constants';
import { InvalidResourceFormatError } from './errors';

/**
 * Validate module structure
 */
function validateModule(
	module: unknown,
	namespace: string,
	language: string
): asserts module is { default: Record<string, unknown> } {
	if (typeof module !== 'object' || module === null) {
		throw new InvalidResourceFormatError(
			namespace,
			language,
			`Invalid module structure for namespace "${namespace}"`
		);
	}

	if (!('default' in module)) {
		throw new InvalidResourceFormatError(
			namespace,
			language,
			`Module must export default for namespace "${namespace}", language "${language}"`
		);
	}

	const translations = (module as { default: unknown }).default;
	if (typeof translations !== 'object' || translations === null || Array.isArray(translations)) {
		throw new InvalidResourceFormatError(
			namespace,
			language,
			`Invalid translations format for namespace "${namespace}", language "${language}"`
		);
	}
}

/**
 * Load translations from module
 */
async function loadTranslationsFromModule(
	loaderFactory: (language: SupportedLanguage) => Promise<{ default: Record<string, unknown> }>,
	language: SupportedLanguage,
	namespace: string
): Promise<Record<string, unknown>> {
	const module = await loaderFactory(language);
	validateModule(module, namespace, language);
	return module.default;
}

/**
 * Create resource loader for domain translations
 */
function createResourceLoader(
	loaderFactory: (language: SupportedLanguage) => Promise<{ default: Record<string, unknown> }>,
	normalizedNamespace: string
): ResourceLoader {
	return async (_namespace, language) => {
		const validLanguage = normalizeLanguage(language);
		if (validLanguage !== language) {
			console.warn(
				`Unsupported language: ${language} for namespace "${normalizedNamespace}". Falling back to "${validLanguage}".`
			);
		}

		try {
			return await loadTranslationsFromModule(loaderFactory, validLanguage, normalizedNamespace);
		} catch (error) {
			// Re-throw InvalidResourceFormatError - validation errors should propagate
			if (error instanceof InvalidResourceFormatError) throw error;

			console.error(
				`Failed to load translations for namespace "${normalizedNamespace}", language "${validLanguage}":`,
				error
			);

			// Fallback to default language if available, otherwise return empty object
			if (validLanguage === DEFAULT_LANGUAGE) {
				console.warn(
					`Returning empty translations for namespace "${normalizedNamespace}" due to load failure`
				);
				return {};
			}
			return handleFallback(loaderFactory, normalizedNamespace);
		}
	};
}

/**
 * Domain translation registration
 *
 * Registers translations for a domain namespace.
 * This allows domains to register their translations without core knowing about them.
 *
 * @param namespace - Translation namespace (typically the domain name, e.g., 'landing')
 * @param loaderFactory - Function that creates a loader for each language
 * @throws Error if namespace is invalid or already registered with a different loader
 *
 * @example
 * ```ts
 * // In domains/landing/i18n/index.ts
 * import { registerDomainTranslations } from '@core/i18n/registry';
 *
 * registerDomainTranslations('landing', (language) => {
 *   switch (language) {
 *     case 'en':
 *       return import('./en.json');
 *     case 'es':
 *       return import('./es.json');
 *     default:
 *       return import('./en.json');
 *   }
 * });
 * ```
 */
export function registerDomainTranslations(
	namespace: string,
	loaderFactory: (language: SupportedLanguage) => Promise<{ default: Record<string, unknown> }>
): void {
	// Validate namespace
	if (!namespace || typeof namespace !== 'string' || namespace.trim() === '') {
		throw new Error('Namespace must be a non-empty string');
	}

	const normalizedNamespace = namespace.trim();

	// Validate loader factory
	if (typeof loaderFactory !== 'function') {
		throw new TypeError('Loader factory must be a function');
	}

	const loader = createResourceLoader(loaderFactory, normalizedNamespace);

	registerResourceLoader(normalizedNamespace, loader);
}

/**
 * Handle fallback to default language translations
 * @param loaderFactory - Loader factory function
 * @param namespace - Translation namespace
 * @returns Fallback translations or empty object
 */
async function handleFallback(
	loaderFactory: (language: SupportedLanguage) => Promise<{ default: Record<string, unknown> }>,
	namespace: string
): Promise<Record<string, unknown>> {
	try {
		return await loadTranslationsFromModule(loaderFactory, DEFAULT_LANGUAGE, namespace);
	} catch (error) {
		// Re-throw InvalidResourceFormatError - these are validation errors that should propagate
		if (error instanceof InvalidResourceFormatError) {
			throw error;
		}

		console.error(
			`Failed to load ${DEFAULT_LANGUAGE} fallback for namespace "${namespace}":`,
			error
		);
		console.warn(`Returning empty translations for namespace "${namespace}" due to load failure`);
		return {};
	}
}

/**
 * Register common translations
 *
 * Common translations are shared across the app and loaded from core/i18n/locales
 *
 * @param loaderFactory - Function that creates a loader for each language
 */
export function registerCommonTranslations(
	loaderFactory: (language: SupportedLanguage) => Promise<{ default: Record<string, unknown> }>
): void {
	registerDomainTranslations('common', loaderFactory);
}
