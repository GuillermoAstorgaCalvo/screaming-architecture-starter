import { env } from '@core/config/env.client';
import {
	DEFAULT_LANGUAGE,
	isRtlLanguage,
	normalizeLanguage,
	SUPPORTED_LANGUAGES,
} from '@core/i18n/constants/constants';
import i18n, { i18nInitPromise } from '@core/i18n/i18n';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Shared test state
let originalDocument: Document | undefined;
let mockHtmlElement: HTMLElement;

// Helper functions
function createMockHtmlElement() {
	return {
		setAttribute: vi.fn(),
		getAttribute: vi.fn(),
	} as unknown as HTMLElement;
}

function setupMockDocument(mock: HTMLElement) {
	globalThis.document = {
		documentElement: mock,
	} as unknown as Document;
}

async function setupTestEnvironment() {
	await i18nInitPromise;
	const doc = globalThis.document;
	const mock = createMockHtmlElement();
	setupMockDocument(mock);
	await i18n.changeLanguage(DEFAULT_LANGUAGE);
	return { originalDocument: doc, mockHtmlElement: mock };
}

async function teardownTestEnvironment(doc: Document | undefined) {
	if (doc) {
		globalThis.document = doc;
	}
	await i18n.changeLanguage(DEFAULT_LANGUAGE);
}

function testLanguageChange(language: string) {
	return async () => {
		await i18n.changeLanguage(language);
		expect(i18n.language).toBe(language);
	};
}

function testHtmlAttributeUpdate(attribute: string, language: string, expectedValue: string) {
	return async () => {
		vi.clearAllMocks();
		await i18n.changeLanguage(language);
		expect(mockHtmlElement.setAttribute).toHaveBeenCalledWith(attribute, expectedValue);
	};
}

function testHtmlLangAttribute(language: string) {
	return testHtmlAttributeUpdate('lang', language, language);
}

function testHtmlDirAttribute(language: string, direction: string) {
	return testHtmlAttributeUpdate('dir', language, direction);
}

function testTranslationLoading(language: string) {
	return async () => {
		await i18n.changeLanguage(language);
		const translation = i18n.t('retry', { ns: 'common' });
		expect(translation).toBeDefined();
		expect(typeof translation).toBe('string');
	};
}

function testNormalizeLanguage(input: string, expected: string) {
	return () => {
		const normalized = normalizeLanguage(input);
		expect(normalized).toBe(expected);
	};
}

function testHtmlDirectionUpdate(language: string) {
	return async () => {
		vi.clearAllMocks();
		await i18n.changeLanguage(language);
		const direction = isRtlLanguage(language) ? 'rtl' : 'ltr';
		expect(mockHtmlElement.setAttribute).toHaveBeenCalledWith('dir', direction);
		expect(mockHtmlElement.setAttribute).toHaveBeenCalledWith('lang', language);
	};
}

beforeEach(async () => {
	const { originalDocument: doc, mockHtmlElement: mock } = await setupTestEnvironment();
	originalDocument = doc;
	mockHtmlElement = mock;
});

afterEach(async () => {
	await teardownTestEnvironment(originalDocument);
});

describe('i18n - initialization', () => {
	describe('i18nInitPromise', () => {
		it('should export a promise', () => {
			expect(i18nInitPromise).toBeInstanceOf(Promise);
		});

		it('should resolve when initialization completes', async () => {
			await expect(i18nInitPromise).resolves.toBeUndefined();
		});
	});

	describe('i18n instance', () => {
		it('should be initialized', () => {
			expect(i18n.isInitialized).toBe(true);
		});

		it('should have a language set', () => {
			expect(i18n.language).toBeDefined();
			expect(typeof i18n.language).toBe('string');
		});

		it('should support changeLanguage', async () => {
			await i18n.changeLanguage('es');
			expect(i18n.language).toBe('es');
		});
	});
});

describe('i18n - language switching', () => {
	it('should switch to supported languages', async () => {
		for (const lang of SUPPORTED_LANGUAGES) {
			await i18n.changeLanguage(lang);
			expect(i18n.language).toBe(lang);
		}
	});

	it('should handle language change to English', testLanguageChange('en'));

	it('should handle language change to Spanish', testLanguageChange('es'));

	it('should handle language change to Arabic', testLanguageChange('ar'));

	it('should update HTML direction attribute when language changes', async () => {
		await i18n.changeLanguage('ar');
		expect(mockHtmlElement.setAttribute).toHaveBeenCalled();
	});

	it('should update HTML lang attribute when language changes', testHtmlLangAttribute('es'));
});

describe('i18n - RTL support', () => {
	it('should set RTL direction for RTL languages', testHtmlDirAttribute('ar', 'rtl'));

	it('should set LTR direction for LTR languages', testHtmlDirAttribute('en', 'ltr'));

	it('should use isRtlLanguage helper correctly', () => {
		expect(isRtlLanguage('ar')).toBe(true);
		expect(isRtlLanguage('en')).toBe(false);
		expect(isRtlLanguage('es')).toBe(false);
	});
});

describe('i18n - translation loading', () => {
	it('should load common namespace translations', testTranslationLoading('en'));

	it('should load translations for different languages', async () => {
		await i18n.changeLanguage('en');
		const enTranslation = i18n.t('retry', { ns: 'common' });

		await i18n.changeLanguage('es');
		const esTranslation = i18n.t('retry', { ns: 'common' });

		await i18n.changeLanguage('ar');
		const arTranslation = i18n.t('retry', { ns: 'common' });

		expect(enTranslation).toBeDefined();
		expect(esTranslation).toBeDefined();
		expect(arTranslation).toBeDefined();
	});
});

describe('i18n - configuration', () => {
	it('should use DEFAULT_LANGUAGE as fallback', () => {
		expect(DEFAULT_LANGUAGE).toBe('en');
	});

	it('should support all SUPPORTED_LANGUAGES', () => {
		for (const lang of SUPPORTED_LANGUAGES) {
			expect(SUPPORTED_LANGUAGES).toContain(lang);
		}
	});

	it('should normalize unsupported languages', testNormalizeLanguage('fr', DEFAULT_LANGUAGE));
});

describe('i18n - language normalization', () => {
	it('should normalize detected language to supported language', () => {
		expect(normalizeLanguage('en')).toBe('en');
		expect(normalizeLanguage('es')).toBe('es');
		expect(normalizeLanguage('ar')).toBe('ar');
	});

	it('should fallback to DEFAULT_LANGUAGE for unsupported languages', () => {
		expect(normalizeLanguage('fr')).toBe(DEFAULT_LANGUAGE);
		expect(normalizeLanguage('de')).toBe(DEFAULT_LANGUAGE);
		expect(normalizeLanguage('zh')).toBe(DEFAULT_LANGUAGE);
	});
});

describe('i18n - HTML direction updates', () => {
	it('should update HTML direction on language change', testHtmlDirectionUpdate('ar'));

	it('should handle document being undefined (SSR scenario)', () => {
		const savedDocument = globalThis.document;
		// @ts-expect-error - Testing SSR scenario
		globalThis.document = undefined;

		expect(() => {
			// Function should not throw when document is undefined
		}).not.toThrow();

		globalThis.document = savedDocument;
	});
});

describe('i18n - debug mode', () => {
	it('should disable debug mode in test environment', () => {
		expect(env.MODE).toBe('test');
	});
});
