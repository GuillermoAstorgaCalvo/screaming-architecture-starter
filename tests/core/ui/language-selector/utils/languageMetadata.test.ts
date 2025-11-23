/**
 * Language Metadata Utilities Tests
 *
 * Tests for language metadata utilities including:
 * - getLanguageMetadata
 * - getAllLanguageMetadata
 * - getLanguageFlag
 * - getLanguageNativeName
 * - getLanguageEnglishName
 * - Edge cases and invalid inputs
 */

import {
	getAllLanguageMetadata,
	getLanguageEnglishName,
	getLanguageFlag,
	getLanguageMetadata,
	getLanguageNativeName,
} from '@core/ui/language-selector/utils/languageMetadata';
import { describe, expect, it } from 'vitest';

describe('languageMetadata utilities', () => {
	describe('getLanguageMetadata', () => {
		it('should be a function', () => {
			expect(typeof getLanguageMetadata).toBe('function');
		});

		it('should return metadata for valid language code', () => {
			const metadata = getLanguageMetadata('en');
			expect(metadata).toBeDefined();
			expect(metadata?.code).toBe('en');
			expect(metadata?.nativeName).toBe('English');
			expect(metadata?.englishName).toBe('English');
			expect(metadata?.flag).toBe('🇺🇸');
		});

		it('should return metadata for Spanish', () => {
			const metadata = getLanguageMetadata('es');
			expect(metadata).toBeDefined();
			expect(metadata?.code).toBe('es');
			expect(metadata?.nativeName).toBe('Español');
			expect(metadata?.englishName).toBe('Spanish');
			expect(metadata?.flag).toBe('🇪🇸');
		});

		it('should return metadata for Arabic', () => {
			const metadata = getLanguageMetadata('ar');
			expect(metadata).toBeDefined();
			expect(metadata?.code).toBe('ar');
			expect(metadata?.nativeName).toBe('العربية');
			expect(metadata?.englishName).toBe('Arabic');
			expect(metadata?.flag).toBe('🇸🇦');
		});

		it('should handle language codes with locale (e.g., en-US)', () => {
			const metadata = getLanguageMetadata('en-US');
			expect(metadata).toBeDefined();
			expect(metadata?.code).toBe('en');
		});

		it('should handle language codes with locale (e.g., es-ES)', () => {
			const metadata = getLanguageMetadata('es-ES');
			expect(metadata).toBeDefined();
			expect(metadata?.code).toBe('es');
		});

		it('should return undefined for unsupported language', () => {
			const metadata = getLanguageMetadata('fr');
			expect(metadata).toBeUndefined();
		});

		it('should return undefined for empty string', () => {
			const metadata = getLanguageMetadata('');
			expect(metadata).toBeUndefined();
		});

		it('should handle invalid language codes', () => {
			const metadata = getLanguageMetadata('invalid');
			expect(metadata).toBeUndefined();
		});
	});

	describe('getAllLanguageMetadata', () => {
		it('should be a function', () => {
			expect(typeof getAllLanguageMetadata).toBe('function');
		});

		it('should return an array', () => {
			const metadata = getAllLanguageMetadata();
			expect(Array.isArray(metadata)).toBe(true);
		});

		it('should return all supported languages', () => {
			const metadata = getAllLanguageMetadata();
			expect(metadata.length).toBeGreaterThan(0);
		});

		it('should return metadata for all languages', () => {
			const metadata = getAllLanguageMetadata();
			const codes = metadata.map(m => m.code);
			expect(codes).toContain('en');
			expect(codes).toContain('es');
			expect(codes).toContain('ar');
		});

		it('should return complete metadata for each language', () => {
			const metadata = getAllLanguageMetadata();
			for (const lang of metadata) {
				expect(lang).toHaveProperty('code');
				expect(lang).toHaveProperty('nativeName');
				expect(lang).toHaveProperty('englishName');
				expect(lang).toHaveProperty('flag');
			}
		});

		it('should return readonly array', () => {
			const metadata = getAllLanguageMetadata();
			// Type check: readonly arrays should be returned
			expect(metadata).toBeDefined();
		});
	});

	describe('getLanguageFlag', () => {
		it('should be a function', () => {
			expect(typeof getLanguageFlag).toBe('function');
		});

		it('should return flag for English', () => {
			const flag = getLanguageFlag('en');
			expect(flag).toBe('🇺🇸');
		});

		it('should return flag for Spanish', () => {
			const flag = getLanguageFlag('es');
			expect(flag).toBe('🇪🇸');
		});

		it('should return flag for Arabic', () => {
			const flag = getLanguageFlag('ar');
			expect(flag).toBe('🇸🇦');
		});

		it('should handle language codes with locale', () => {
			const flag = getLanguageFlag('en-US');
			expect(flag).toBe('🇺🇸');
		});

		it('should return empty string for unsupported language', () => {
			const flag = getLanguageFlag('fr');
			expect(flag).toBe('');
		});

		it('should return empty string for empty input', () => {
			const flag = getLanguageFlag('');
			expect(flag).toBe('');
		});
	});

	describe('getLanguageNativeName', () => {
		it('should be a function', () => {
			expect(typeof getLanguageNativeName).toBe('function');
		});

		it('should return native name for English', () => {
			const name = getLanguageNativeName('en');
			expect(name).toBe('English');
		});

		it('should return native name for Spanish', () => {
			const name = getLanguageNativeName('es');
			expect(name).toBe('Español');
		});

		it('should return native name for Arabic', () => {
			const name = getLanguageNativeName('ar');
			expect(name).toBe('العربية');
		});

		it('should handle language codes with locale', () => {
			const name = getLanguageNativeName('en-US');
			expect(name).toBe('English');
		});

		it('should return empty string for unsupported language', () => {
			const name = getLanguageNativeName('fr');
			expect(name).toBe('');
		});

		it('should return empty string for empty input', () => {
			const name = getLanguageNativeName('');
			expect(name).toBe('');
		});
	});

	describe('getLanguageEnglishName', () => {
		it('should be a function', () => {
			expect(typeof getLanguageEnglishName).toBe('function');
		});

		it('should return English name for English', () => {
			const name = getLanguageEnglishName('en');
			expect(name).toBe('English');
		});

		it('should return English name for Spanish', () => {
			const name = getLanguageEnglishName('es');
			expect(name).toBe('Spanish');
		});

		it('should return English name for Arabic', () => {
			const name = getLanguageEnglishName('ar');
			expect(name).toBe('Arabic');
		});

		it('should handle language codes with locale', () => {
			const name = getLanguageEnglishName('en-US');
			expect(name).toBe('English');
		});

		it('should return empty string for unsupported language', () => {
			const name = getLanguageEnglishName('fr');
			expect(name).toBe('');
		});

		it('should return empty string for empty input', () => {
			const name = getLanguageEnglishName('');
			expect(name).toBe('');
		});
	});
});
