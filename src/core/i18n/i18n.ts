import { env } from '@core/config/env.client';
import { resourceLoaderBackend } from '@core/i18n/resourceLoader/backend';
import { loadAndAddResource } from '@core/i18n/resourceLoader/i18n';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import {
	DEFAULT_LANGUAGE,
	DEFAULT_NAMESPACE,
	isRtlLanguage,
	LANGUAGE_DETECTION_ORDER,
	LANGUAGE_STORAGE_KEY,
	normalizeLanguage,
	SUPPORTED_LANGUAGES,
	type SupportedLanguage,
} from './constants/constants';
import { registerCommonTranslations } from './registry';
import { getRegisteredNamespaces } from './resourceLoader/registry';

/**
 * Common translation loader factory
 * Common translations are loaded from core/i18n/locales
 */
const commonTranslationLoader = async (language: SupportedLanguage) => {
	switch (language) {
		case 'en': {
			return import('./locales/en.json');
		}
		case 'es': {
			return import('./locales/es.json');
		}
		case 'ar': {
			return import('./locales/ar.json');
		}
		default: {
			return import('./locales/en.json');
		}
	}
};

/**
 * Core i18n instance configuration
 * Configured with lazy-loaded namespaces, fallbacks, and language detection
 *
 * Translation files are organized by domain:
 * - Domain translations: domains/<domain>/i18n/<locale>.json
 *   Domains register their translations via registerDomainTranslations()
 * - Core/common translations: core/i18n/locales/<locale>.json
 *
 * Namespaces follow domain structure (e.g., 'landing', 'common')
 *
 * Resources are loaded dynamically as needed, allowing for scalable translation management.
 */
i18n.use(LanguageDetector).use(resourceLoaderBackend).use(initReactI18next);

/**
 * Get i18n configuration options
 * @returns i18next configuration object
 */
function getI18nConfig() {
	return {
		// Default language
		fallbackLng: DEFAULT_LANGUAGE,

		// Supported languages
		supportedLngs: Array.from(SUPPORTED_LANGUAGES),

		// Default namespace
		defaultNS: DEFAULT_NAMESPACE,

		// Initial namespaces (common is always loaded)
		// Other namespaces are loaded on-demand when first used
		ns: [DEFAULT_NAMESPACE],

		// Interpolation options
		interpolation: {
			escapeValue: false, // React already escapes values
			formatSeparator: ',',
		},

		// Language detection options
		detection: {
			// Order of detection methods
			order: Array.from(LANGUAGE_DETECTION_ORDER),

			// Cache language selection
			caches: ['localStorage'],

			// Key to store language preference
			lookupLocalStorage: LANGUAGE_STORAGE_KEY,
		},

		// Fallback configuration
		fallbackNS: DEFAULT_NAMESPACE,

		// React i18next options
		react: {
			useSuspense: false, // Disable suspense for better compatibility
		},

		// Debug mode in development (but not in tests)
		debug: env.DEV && env.MODE !== 'test',

		// Return null for missing keys in production (better UX)
		returnNull: false,
		returnEmptyString: false,
	};
}

/**
 * Load common translations for all supported languages
 */
async function loadCommonTranslations(languages: Iterable<SupportedLanguage>): Promise<void> {
	await Promise.all(
		Array.from(languages).map(async language => {
			try {
				await loadAndAddResource({
					i18nInstance: i18n,
					namespace: 'common',
					language,
				});
			} catch (error) {
				console.error(`Failed to load common translations for ${language}:`, error);
				// Continue loading other languages even if one fails
			}
		})
	);
}

/**
 * Preload registered namespaces so the first render has translations available.
 * Skips the 'common' namespace since it is handled separately.
 */
async function preloadRegisteredNamespaces(languages: Iterable<SupportedLanguage>): Promise<void> {
	const namespaces: string[] = getRegisteredNamespaces().filter(
		namespace => namespace !== 'common'
	);
	if (namespaces.length === 0) {
		return;
	}

	await Promise.all(
		namespaces.map(namespace =>
			Promise.all(
				Array.from(languages).map(async language => {
					try {
						await loadAndAddResource({
							i18nInstance: i18n,
							namespace,
							language,
						});
					} catch (error) {
						console.error(
							`Failed to preload namespace "${namespace}" for language "${language}":`,
							error
						);
					}
				})
			)
		)
	);
}

/**
 * Set up RTL language support
 * Updates HTML dir and lang attributes when language changes
 */
function setupRtlSupport(): void {
	i18n.on('languageChanged', lng => {
		updateHtmlDirection(lng);
	});
}

/**
 * Update HTML direction and language attributes
 * @param language - Language code
 */
function updateHtmlDirection(language: string): void {
	if (typeof document === 'undefined') {
		return;
	}

	const htmlElement = document.documentElement;
	const isRtl = isRtlLanguage(language);

	htmlElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
	htmlElement.setAttribute('lang', language);
}

/**
 * Initialize i18n
 * This ensures the app can start while translations are loading
 * The promise resolves when initialization and common translations are loaded
 */
async function initializeI18n(): Promise<void> {
	// Register common translations before initialization
	// This ensures all modules are loaded before registration
	registerCommonTranslations(commonTranslationLoader);

	// Initialize i18next
	await i18n.init(getI18nConfig());

	// Load common translations for all supported languages
	const initialLanguages = new Set<SupportedLanguage>();
	const detectedLanguage = i18n.language ? normalizeLanguage(i18n.language) : DEFAULT_LANGUAGE;

	initialLanguages.add(detectedLanguage);
	initialLanguages.add(DEFAULT_LANGUAGE);

	await loadCommonTranslations(initialLanguages);
	await preloadRegisteredNamespaces(initialLanguages);

	// Set up RTL language support
	setupRtlSupport();

	// Set initial direction on load
	updateHtmlDirection(i18n.language);
}

// Initialize i18n and export the promise
let resolveInitialization: (() => void) | undefined;
let rejectInitialization: ((reason?: unknown) => void) | undefined;

export const i18nInitPromise = new Promise<void>((resolve, reject) => {
	resolveInitialization = resolve;
	rejectInitialization = reject;
});

try {
	await initializeI18n();
	resolveInitialization?.();
} catch (error) {
	rejectInitialization?.(error);
	throw error;
}

// Export our configured i18n instance (direct export, not from i18next)
// eslint-disable-next-line unicorn/prefer-export-from
export default i18n;
