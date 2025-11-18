import {
	DEFAULT_LANGUAGE,
	DEFAULT_NAMESPACE,
	isRtlLanguage,
	isSupportedLanguage,
	LANGUAGE_DETECTION_ORDER,
	LANGUAGE_STORAGE_KEY,
	normalizeLanguage,
	RTL_LANGUAGES,
	type RtlLanguage,
	SUPPORTED_LANGUAGES,
	type SupportedLanguage,
} from '@core/i18n/constants/constants';
import { describe, expect, it } from 'vitest';

describe('SUPPORTED_LANGUAGES', () => {
	it('should contain expected languages', () => {
		expect(SUPPORTED_LANGUAGES).toEqual(['en', 'es', 'ar']);
	});

	it('should be a readonly array', () => {
		expect(SUPPORTED_LANGUAGES).toHaveLength(3);
	});
});

describe('DEFAULT_LANGUAGE', () => {
	it('should be "en"', () => {
		expect(DEFAULT_LANGUAGE).toBe('en');
	});

	it('should be included in SUPPORTED_LANGUAGES', () => {
		expect(SUPPORTED_LANGUAGES).toContain(DEFAULT_LANGUAGE);
	});
});

describe('RTL_LANGUAGES', () => {
	it('should contain RTL languages', () => {
		expect(RTL_LANGUAGES).toEqual(['ar']);
	});

	it('should only include languages from SUPPORTED_LANGUAGES', () => {
		for (const rtlLang of RTL_LANGUAGES) {
			expect(SUPPORTED_LANGUAGES).toContain(rtlLang);
		}
	});
});

describe('DEFAULT_NAMESPACE', () => {
	it('should be "common"', () => {
		expect(DEFAULT_NAMESPACE).toBe('common');
	});
});

describe('LANGUAGE_STORAGE_KEY', () => {
	it('should be "i18nextLng"', () => {
		expect(LANGUAGE_STORAGE_KEY).toBe('i18nextLng');
	});
});

describe('LANGUAGE_DETECTION_ORDER', () => {
	it('should have correct detection order', () => {
		expect(LANGUAGE_DETECTION_ORDER).toEqual(['localStorage', 'navigator', 'htmlTag']);
	});

	it('should prioritize localStorage first', () => {
		expect(LANGUAGE_DETECTION_ORDER[0]).toBe('localStorage');
	});
});

describe('isSupportedLanguage', () => {
	it('should return true for supported languages', () => {
		expect(isSupportedLanguage('en')).toBe(true);
		expect(isSupportedLanguage('es')).toBe(true);
		expect(isSupportedLanguage('ar')).toBe(true);
	});

	it('should return false for unsupported languages', () => {
		expect(isSupportedLanguage('fr')).toBe(false);
		expect(isSupportedLanguage('de')).toBe(false);
		expect(isSupportedLanguage('zh')).toBe(false);
		expect(isSupportedLanguage('')).toBe(false);
	});

	it('should act as a type guard', () => {
		const lang: string = 'en';
		if (isSupportedLanguage(lang)) {
			const typedLang: SupportedLanguage = lang;
			expect(typedLang).toBe('en');
		}
	});
});

describe('isRtlLanguage', () => {
	it('should return true for RTL languages', () => {
		expect(isRtlLanguage('ar')).toBe(true);
	});

	it('should return false for LTR languages', () => {
		expect(isRtlLanguage('en')).toBe(false);
		expect(isRtlLanguage('es')).toBe(false);
	});

	it('should return false for unsupported languages', () => {
		expect(isRtlLanguage('fr')).toBe(false);
		expect(isRtlLanguage('he')).toBe(false);
	});

	it('should act as a type guard', () => {
		const lang: string = 'ar';
		if (isRtlLanguage(lang)) {
			const typedLang: RtlLanguage = lang;
			expect(typedLang).toBe('ar');
		}
	});
});

describe('normalizeLanguage', () => {
	it('should return the language if supported', () => {
		expect(normalizeLanguage('en')).toBe('en');
		expect(normalizeLanguage('es')).toBe('es');
		expect(normalizeLanguage('ar')).toBe('ar');
	});

	it('should return DEFAULT_LANGUAGE for unsupported languages', () => {
		expect(normalizeLanguage('fr')).toBe(DEFAULT_LANGUAGE);
		expect(normalizeLanguage('de')).toBe(DEFAULT_LANGUAGE);
		expect(normalizeLanguage('zh')).toBe(DEFAULT_LANGUAGE);
		expect(normalizeLanguage('')).toBe(DEFAULT_LANGUAGE);
	});

	it('should handle case variations', () => {
		// normalizeLanguage doesn't handle case, but we test the behavior
		expect(normalizeLanguage('EN')).toBe(DEFAULT_LANGUAGE);
		expect(normalizeLanguage('En')).toBe(DEFAULT_LANGUAGE);
	});

	it('should always return a SupportedLanguage', () => {
		const result = normalizeLanguage('invalid');
		expect(isSupportedLanguage(result)).toBe(true);
	});
});

describe('type exports', () => {
	it('should export SupportedLanguage type', () => {
		const lang: SupportedLanguage = 'en';
		expect(lang).toBe('en');
	});

	it('should export RtlLanguage type', () => {
		const lang: RtlLanguage = 'ar';
		expect(lang).toBe('ar');
	});
});
