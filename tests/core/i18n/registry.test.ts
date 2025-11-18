import { DEFAULT_LANGUAGE, type SupportedLanguage } from '@core/i18n/constants/constants';
import { InvalidResourceFormatError } from '@core/i18n/errors';
import { registerCommonTranslations, registerDomainTranslations } from '@core/i18n/registry';
import { clearResourceLoaders, getResourceLoader } from '@core/i18n/resourceLoader/registry';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Constants for error messages
const ERROR_NAMESPACE_MUST_BE_NON_EMPTY = 'Namespace must be a non-empty string';
const ERROR_INVALID_TRANSLATIONS_FORMAT = 'Invalid translations format';
const ERROR_LOAD_ERROR = 'Load error';

// Helper functions to reduce nesting
function getRegisteredLoader(
	namespace: string
): ((namespace: string, language: string) => Promise<Record<string, unknown>>) | undefined {
	return getResourceLoader(namespace);
}

function createValidLoaderFactory(translations: Record<string, unknown>) {
	return vi.fn(async () => ({ default: translations }));
}

function createLanguageAwareLoaderFactory(translations: Record<string, Record<string, unknown>>) {
	return vi.fn(async (language: SupportedLanguage) => {
		return { default: translations[language] ?? {} };
	});
}

// Test suite functions to reduce nesting and line count
function describeNamespaceValidation() {
	describe('Namespace Validation', () => {
		it('should register valid namespace', () => {
			const loaderFactory = createValidLoaderFactory({ key: 'value' });
			registerDomainTranslations('landing', loaderFactory);

			const loader = getResourceLoader('landing');
			expect(loader).toBeDefined();
			expect(typeof loader).toBe('function');
		});

		it('should normalize namespace by trimming whitespace', () => {
			const loaderFactory = createValidLoaderFactory({ key: 'value' });
			registerDomainTranslations('  landing  ', loaderFactory);

			const loader = getResourceLoader('landing');
			expect(loader).toBeDefined();
			// Should not be registered with whitespace
			expect(getResourceLoader('  landing  ')).toBeUndefined();
		});

		it('should throw error for empty namespace', () => {
			const loaderFactory = createValidLoaderFactory({ key: 'value' });
			expect(() => {
				registerDomainTranslations('', loaderFactory);
			}).toThrow(ERROR_NAMESPACE_MUST_BE_NON_EMPTY);
		});

		it('should throw error for whitespace-only namespace', () => {
			const loaderFactory = createValidLoaderFactory({ key: 'value' });
			expect(() => {
				registerDomainTranslations('   ', loaderFactory);
			}).toThrow(ERROR_NAMESPACE_MUST_BE_NON_EMPTY);
		});

		it('should throw error for null namespace', () => {
			const loaderFactory = createValidLoaderFactory({ key: 'value' });
			expect(() => {
				registerDomainTranslations(null as unknown as string, loaderFactory);
			}).toThrow(ERROR_NAMESPACE_MUST_BE_NON_EMPTY);
		});

		it('should throw error for non-string namespace', () => {
			const loaderFactory = createValidLoaderFactory({ key: 'value' });
			expect(() => {
				registerDomainTranslations(123 as unknown as string, loaderFactory);
			}).toThrow(ERROR_NAMESPACE_MUST_BE_NON_EMPTY);
		});
	});
}

function describeLoaderFactoryValidation() {
	describe('Loader Factory Validation', () => {
		it('should throw error for non-function loader factory', () => {
			expect(() => {
				registerDomainTranslations(
					'landing',
					null as unknown as () => Promise<{ default: Record<string, unknown> }>
				);
			}).toThrow(TypeError);
			expect(() => {
				registerDomainTranslations(
					'landing',
					null as unknown as () => Promise<{ default: Record<string, unknown> }>
				);
			}).toThrow('Loader factory must be a function');
		});

		it('should throw error for undefined loader factory', () => {
			expect(() => {
				registerDomainTranslations(
					'landing',
					undefined as unknown as () => Promise<{ default: Record<string, unknown> }>
				);
			}).toThrow(TypeError);
		});
	});
}

function describeTranslationLoading() {
	describe('Translation Loading', () => {
		it('should load translations successfully for supported language', async () => {
			const translations = { hello: 'Hello', world: 'World' };
			const loaderFactory = createLanguageAwareLoaderFactory({ en: translations });

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			const result = await registeredLoader('landing', 'en');
			expect(result).toEqual(translations);
			expect(loaderFactory).toHaveBeenCalledWith('en');
		});

		it('should normalize unsupported language and warn', async () => {
			const translations = { hello: 'Hello' };
			const loaderFactory = createLanguageAwareLoaderFactory({
				[DEFAULT_LANGUAGE]: translations,
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			const consoleWarnSpy = vi.spyOn(console, 'warn');
			const result = await registeredLoader('landing', 'fr');

			expect(result).toEqual(translations);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Unsupported language: fr')
			);
			expect(loaderFactory).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
		});
	});
}

function describeInvalidModuleFormats() {
	describe('Invalid Module Formats', () => {
		describeInvalidDefaultExports();
		describeInvalidModuleStructures();
	});
}

function describeInvalidDefaultExports() {
	describe('Invalid Default Exports', () => {
		it('should handle module without default export', async () => {
			const loaderFactory = vi.fn(async () => {
				return {} as { default: Record<string, unknown> };
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			await expect(registeredLoader('landing', 'en')).rejects.toThrow(InvalidResourceFormatError);
			await expect(registeredLoader('landing', 'en')).rejects.toThrow('Module must export default');
		});

		it('should handle module with null default', async () => {
			const loaderFactory = vi.fn(async () => {
				return { default: null } as unknown as { default: Record<string, unknown> };
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			await expect(registeredLoader('landing', 'en')).rejects.toThrow(InvalidResourceFormatError);
			await expect(registeredLoader('landing', 'en')).rejects.toThrow(
				ERROR_INVALID_TRANSLATIONS_FORMAT
			);
		});

		it('should handle module with array default', async () => {
			const loaderFactory = vi.fn(async () => {
				return { default: [] } as unknown as { default: Record<string, unknown> };
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			await expect(registeredLoader('landing', 'en')).rejects.toThrow(InvalidResourceFormatError);
			await expect(registeredLoader('landing', 'en')).rejects.toThrow(
				ERROR_INVALID_TRANSLATIONS_FORMAT
			);
		});

		it('should handle module with primitive default', async () => {
			const loaderFactory = vi.fn(async () => {
				return { default: 'string' } as unknown as { default: Record<string, unknown> };
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			await expect(registeredLoader('landing', 'en')).rejects.toThrow(InvalidResourceFormatError);
			await expect(registeredLoader('landing', 'en')).rejects.toThrow(
				ERROR_INVALID_TRANSLATIONS_FORMAT
			);
		});
	});
}

function describeInvalidModuleStructures() {
	describe('Invalid Module Structures', () => {
		it('should handle module that is null', async () => {
			const loaderFactory = vi.fn(async () => {
				return null as unknown as { default: Record<string, unknown> };
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			await expect(registeredLoader('landing', 'en')).rejects.toThrow(InvalidResourceFormatError);
			await expect(registeredLoader('landing', 'en')).rejects.toThrow('Invalid module structure');
		});

		it('should handle module that is not an object', async () => {
			const loaderFactory = vi.fn(async () => {
				return 'not an object' as unknown as { default: Record<string, unknown> };
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			await expect(registeredLoader('landing', 'en')).rejects.toThrow(InvalidResourceFormatError);
			await expect(registeredLoader('landing', 'en')).rejects.toThrow('Invalid module structure');
		});
	});
}

function describeErrorHandlingAndFallback() {
	describe('Error Handling and Fallback', () => {
		it('should fallback to default language when load fails', async () => {
			const defaultTranslations = { hello: 'Hello (default)' };
			const loaderFactory = vi.fn(async (language: SupportedLanguage) => {
				if (language === 'es') {
					throw new Error(ERROR_LOAD_ERROR);
				}
				if (language === DEFAULT_LANGUAGE) {
					return { default: defaultTranslations };
				}
				return { default: {} };
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			const consoleErrorSpy = vi.spyOn(console, 'error');
			const result = await registeredLoader('landing', 'es');

			expect(result).toEqual(defaultTranslations);
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				expect.stringContaining('Failed to load translations'),
				expect.any(Error)
			);
			expect(loaderFactory).toHaveBeenCalledWith('es');
			expect(loaderFactory).toHaveBeenCalledWith(DEFAULT_LANGUAGE);
		});

		it('should return empty object when default language also fails', async () => {
			const loaderFactory = vi.fn(async () => {
				throw new Error(ERROR_LOAD_ERROR);
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			const consoleErrorSpy = vi.spyOn(console, 'error');
			const consoleWarnSpy = vi.spyOn(console, 'warn');
			const result = await registeredLoader('landing', 'es');

			expect(result).toEqual({});
			expect(consoleErrorSpy).toHaveBeenCalled();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Returning empty translations')
			);
		});
	});
}

function describeErrorHandlingFallbackErrors() {
	describe('Error Handling Fallback Errors', () => {
		it('should propagate InvalidResourceFormatError from default language fallback', async () => {
			const loaderFactory = vi.fn(async (language: SupportedLanguage) => {
				if (language === 'es') {
					throw new Error(ERROR_LOAD_ERROR);
				}
				if (language === DEFAULT_LANGUAGE) {
					return { default: null } as unknown as { default: Record<string, unknown> };
				}
				return { default: {} };
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			await expect(registeredLoader('landing', 'es')).rejects.toThrow(InvalidResourceFormatError);
		});

		it('should return empty object when default language is requested and fails', async () => {
			const loaderFactory = vi.fn(async () => {
				throw new Error(ERROR_LOAD_ERROR);
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			const consoleWarnSpy = vi.spyOn(console, 'warn');
			const result = await registeredLoader('landing', DEFAULT_LANGUAGE);

			expect(result).toEqual({});
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('Returning empty translations')
			);
		});

		it('should propagate InvalidResourceFormatError when validation fails', async () => {
			const loaderFactory = vi.fn(async () => {
				return { default: [] } as unknown as { default: Record<string, unknown> };
			});

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			await expect(registeredLoader('landing', 'en')).rejects.toThrow(InvalidResourceFormatError);
			// Should not attempt fallback for validation errors
			expect(loaderFactory).toHaveBeenCalledTimes(1);
		});
	});
}

function describeMultipleLanguages() {
	describe('Multiple Languages', () => {
		it('should load correct translations for different languages', async () => {
			const translations = {
				en: { hello: 'Hello' },
				es: { hello: 'Hola' },
				ar: { hello: 'مرحبا' },
			};
			const loaderFactory = createLanguageAwareLoaderFactory(translations);

			registerDomainTranslations('landing', loaderFactory);

			const registeredLoader = getRegisteredLoader('landing');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			const enResult = await registeredLoader('landing', 'en');
			const esResult = await registeredLoader('landing', 'es');
			const arResult = await registeredLoader('landing', 'ar');

			expect(enResult).toEqual(translations.en);
			expect(esResult).toEqual(translations.es);
			expect(arResult).toEqual(translations.ar);
		});
	});
}

function describeRegisterCommonTranslations() {
	describe('registerCommonTranslations', () => {
		it('should register translations with "common" namespace', () => {
			const loaderFactory = createValidLoaderFactory({ key: 'value' });
			registerCommonTranslations(loaderFactory);

			const loader = getResourceLoader('common');
			expect(loader).toBeDefined();
			expect(typeof loader).toBe('function');
		});

		it('should delegate to registerDomainTranslations', () => {
			const loaderFactory = createValidLoaderFactory({ key: 'value' });
			registerCommonTranslations(loaderFactory);

			// Verify it was registered with 'common' namespace
			const loader = getResourceLoader('common');
			expect(loader).toBeDefined();
		});

		it('should load common translations successfully', async () => {
			const translations = { retry: 'Retry', cancel: 'Cancel' };
			const loaderFactory = createLanguageAwareLoaderFactory({ en: translations });

			registerCommonTranslations(loaderFactory);

			const registeredLoader = getRegisteredLoader('common');
			expect(registeredLoader).toBeDefined();
			if (!registeredLoader) return;

			const result = await registeredLoader('common', 'en');
			expect(result).toEqual(translations);
		});
	});
}

describe('i18n Registry', () => {
	beforeEach(() => {
		clearResourceLoaders();
		vi.clearAllMocks();
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		clearResourceLoaders();
	});

	describe('registerDomainTranslations', () => {
		describeNamespaceValidation();
		describeLoaderFactoryValidation();
		describeTranslationLoading();
		describeInvalidModuleFormats();
		describeErrorHandlingAndFallback();
		describeErrorHandlingFallbackErrors();
		describeMultipleLanguages();
	});

	describeRegisterCommonTranslations();
});
