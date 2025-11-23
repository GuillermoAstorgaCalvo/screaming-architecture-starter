/**
 * Language Selector Constants Tests
 *
 * Tests for language selector constants including:
 * - Size variant classes
 * - Size variant classes with gap
 * - Flag size classes
 * - Type exports
 */

import {
	FLAG_SIZE_CLASSES,
	type LanguageSelectorSize,
	SIZE_CLASSES,
	SIZE_CLASSES_WITH_GAP,
} from '@core/ui/language-selector/constants/languageSelector.constants';
import { describe, expect, it } from 'vitest';

describe('languageSelector.constants', () => {
	describe('SIZE_CLASSES', () => {
		it('should be defined', () => {
			expect(SIZE_CLASSES).toBeDefined();
		});

		it('should have all size variants', () => {
			expect(SIZE_CLASSES.sm).toBeDefined();
			expect(SIZE_CLASSES.md).toBeDefined();
			expect(SIZE_CLASSES.lg).toBeDefined();
		});

		it('should have correct classes for sm size', () => {
			expect(SIZE_CLASSES.sm).toBe('h-8 px-2 text-xs');
		});

		it('should have correct classes for md size', () => {
			expect(SIZE_CLASSES.md).toBe('h-10 px-3 text-sm');
		});

		it('should have correct classes for lg size', () => {
			expect(SIZE_CLASSES.lg).toBe('h-12 px-4 text-base');
		});

		it('should have different classes for each size', () => {
			expect(SIZE_CLASSES.sm).not.toBe(SIZE_CLASSES.md);
			expect(SIZE_CLASSES.sm).not.toBe(SIZE_CLASSES.lg);
			expect(SIZE_CLASSES.md).not.toBe(SIZE_CLASSES.lg);
		});
	});

	describe('SIZE_CLASSES_WITH_GAP', () => {
		it('should be defined', () => {
			expect(SIZE_CLASSES_WITH_GAP).toBeDefined();
		});

		it('should have all size variants', () => {
			expect(SIZE_CLASSES_WITH_GAP.sm).toBeDefined();
			expect(SIZE_CLASSES_WITH_GAP.md).toBeDefined();
			expect(SIZE_CLASSES_WITH_GAP.lg).toBeDefined();
		});

		it('should have correct classes for sm size', () => {
			expect(SIZE_CLASSES_WITH_GAP.sm).toBe('h-8 px-2 text-xs gap-1.5');
		});

		it('should have correct classes for md size', () => {
			expect(SIZE_CLASSES_WITH_GAP.md).toBe('h-10 px-3 text-sm gap-2');
		});

		it('should have correct classes for lg size', () => {
			expect(SIZE_CLASSES_WITH_GAP.lg).toBe('h-12 px-4 text-base gap-2.5');
		});

		it('should include gap classes', () => {
			expect(SIZE_CLASSES_WITH_GAP.sm).toContain('gap-1.5');
			expect(SIZE_CLASSES_WITH_GAP.md).toContain('gap-2');
			expect(SIZE_CLASSES_WITH_GAP.lg).toContain('gap-2.5');
		});

		it('should have different classes for each size', () => {
			expect(SIZE_CLASSES_WITH_GAP.sm).not.toBe(SIZE_CLASSES_WITH_GAP.md);
			expect(SIZE_CLASSES_WITH_GAP.sm).not.toBe(SIZE_CLASSES_WITH_GAP.lg);
			expect(SIZE_CLASSES_WITH_GAP.md).not.toBe(SIZE_CLASSES_WITH_GAP.lg);
		});
	});

	describe('FLAG_SIZE_CLASSES', () => {
		it('should be defined', () => {
			expect(FLAG_SIZE_CLASSES).toBeDefined();
		});

		it('should have all size variants', () => {
			expect(FLAG_SIZE_CLASSES.sm).toBeDefined();
			expect(FLAG_SIZE_CLASSES.md).toBeDefined();
			expect(FLAG_SIZE_CLASSES.lg).toBeDefined();
		});

		it('should have correct classes for sm size', () => {
			expect(FLAG_SIZE_CLASSES.sm).toBe('text-sm');
		});

		it('should have correct classes for md size', () => {
			expect(FLAG_SIZE_CLASSES.md).toBe('text-base');
		});

		it('should have correct classes for lg size', () => {
			expect(FLAG_SIZE_CLASSES.lg).toBe('text-lg');
		});

		it('should have different classes for each size', () => {
			expect(FLAG_SIZE_CLASSES.sm).not.toBe(FLAG_SIZE_CLASSES.md);
			expect(FLAG_SIZE_CLASSES.sm).not.toBe(FLAG_SIZE_CLASSES.lg);
			expect(FLAG_SIZE_CLASSES.md).not.toBe(FLAG_SIZE_CLASSES.lg);
		});
	});

	describe('LanguageSelectorSize type', () => {
		it('should export LanguageSelectorSize type', () => {
			// Type check: This will fail at compile time if type doesn't exist
			const _test: LanguageSelectorSize = 'sm';
			expect(_test).toBe('sm');
		});

		it('should accept all size variants', () => {
			const sizes: LanguageSelectorSize[] = ['sm', 'md', 'lg'];
			expect(sizes).toHaveLength(3);
		});
	});
});
