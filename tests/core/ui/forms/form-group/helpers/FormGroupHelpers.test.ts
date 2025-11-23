/**
 * Tests for FormGroupHelpers
 *
 * Tests form group variant functions, class generation, and type safety
 */

import {
	type FormGroupVariants,
	formGroupVariants,
	getFormGroupVariantClasses,
} from '@core/ui/forms/form-group/helpers/FormGroupHelpers';
import { describe, expect, it } from 'vitest';

describe('formGroupVariants', () => {
	it('should be a function', () => {
		expect(typeof formGroupVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = formGroupVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
		expect(classes).toContain('flex');
		expect(classes).toContain('flex-col');
	});

	it('should return classes for all gap sizes', () => {
		const gaps: Array<'none' | 'sm' | 'md' | 'lg'> = ['none', 'sm', 'md', 'lg'];

		for (const gap of gaps) {
			const classes = formGroupVariants({ gap });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different gap classes for different sizes', () => {
		const noneClasses = formGroupVariants({ gap: 'none' });
		const smClasses = formGroupVariants({ gap: 'sm' });
		const mdClasses = formGroupVariants({ gap: 'md' });
		const lgClasses = formGroupVariants({ gap: 'lg' });

		expect(noneClasses).not.toContain('gap-');
		expect(smClasses).toContain('gap-2');
		expect(mdClasses).toContain('gap-4');
		expect(lgClasses).toContain('gap-6');
	});

	it('should return classes for all alignment options', () => {
		const aligns: Array<'start' | 'center' | 'end' | 'stretch'> = [
			'start',
			'center',
			'end',
			'stretch',
		];

		for (const align of aligns) {
			const classes = formGroupVariants({ align });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different alignment classes', () => {
		const startClasses = formGroupVariants({ align: 'start' });
		const centerClasses = formGroupVariants({ align: 'center' });
		const endClasses = formGroupVariants({ align: 'end' });
		const stretchClasses = formGroupVariants({ align: 'stretch' });

		expect(startClasses).toContain('items-start');
		expect(centerClasses).toContain('items-center');
		expect(endClasses).toContain('items-end');
		expect(stretchClasses).toContain('items-stretch');
	});

	it('should handle fullWidth variant', () => {
		const fullWidthClasses = formGroupVariants({ fullWidth: true });
		const notFullWidthClasses = formGroupVariants({ fullWidth: false });

		expect(fullWidthClasses).toContain('w-full');
		expect(notFullWidthClasses).not.toContain('w-full');
	});

	it('should combine multiple variants correctly', () => {
		const classes = formGroupVariants({
			gap: 'lg',
			align: 'center',
			fullWidth: true,
		});
		expect(classes).toContain('gap-6');
		expect(classes).toContain('items-center');
		expect(classes).toContain('w-full');
		expect(classes).toContain('flex');
		expect(classes).toContain('flex-col');
	});

	it('should use default variants when not provided', () => {
		const classes = formGroupVariants();
		// Defaults: gap: 'md', align: 'start', fullWidth: false
		expect(classes).toContain('gap-4');
		expect(classes).toContain('items-start');
		expect(classes).not.toContain('w-full');
	});
});

describe('getFormGroupVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getFormGroupVariantClasses).toBe('function');
	});

	it('should return classes when called with no arguments', () => {
		const classes = getFormGroupVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge custom className with variant classes', () => {
		const customClass = 'custom-form-group-class';
		const classes = getFormGroupVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});

	it('should merge className correctly with all variants', () => {
		const customClass = 'my-custom-class';
		const classes = getFormGroupVariantClasses({
			gap: 'md',
			align: 'center',
			fullWidth: true,
			className: customClass,
		});
		expect(classes).toContain(customClass);
		expect(classes).toContain('gap-4');
		expect(classes).toContain('items-center');
		expect(classes).toContain('w-full');
	});

	it('should handle undefined className', () => {
		const classes = getFormGroupVariantClasses({ gap: 'md' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should handle empty className string', () => {
		const classes = getFormGroupVariantClasses({ gap: 'md', className: '' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should use default variants when not provided', () => {
		const classes = getFormGroupVariantClasses({});
		expect(classes).toContain('gap-4');
		expect(classes).toContain('items-start');
	});

	it('should return different class strings for different props', () => {
		const defaultClasses = getFormGroupVariantClasses({});
		const withCustomClass = getFormGroupVariantClasses({ className: 'custom' });
		const withDifferentGap = getFormGroupVariantClasses({ gap: 'lg' });
		expect(defaultClasses).not.toBe(withCustomClass);
		expect(defaultClasses).not.toBe(withDifferentGap);
	});
});

describe('FormGroupVariants type', () => {
	it('should accept valid gap values', () => {
		const validGaps: FormGroupVariants['gap'][] = ['none', 'sm', 'md', 'lg', undefined];
		for (const gap of validGaps) {
			if (gap !== undefined) {
				const classes = formGroupVariants({ gap });
				expect(typeof classes).toBe('string');
			}
		}
	});

	it('should accept valid align values', () => {
		const validAligns: FormGroupVariants['align'][] = [
			'start',
			'center',
			'end',
			'stretch',
			undefined,
		];
		for (const align of validAligns) {
			if (align !== undefined) {
				const classes = formGroupVariants({ align });
				expect(typeof classes).toBe('string');
			}
		}
	});

	it('should accept valid fullWidth values', () => {
		const validFullWidths: FormGroupVariants['fullWidth'][] = [true, false, undefined];
		for (const fullWidth of validFullWidths) {
			if (fullWidth !== undefined) {
				const classes = formGroupVariants({ fullWidth });
				expect(typeof classes).toBe('string');
			}
		}
	});
});
