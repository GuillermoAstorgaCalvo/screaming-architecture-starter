/**
 * Tests for FormActionsHelpers
 *
 * Tests form actions variant functions, class generation, and type safety
 */

import {
	type FormActionsVariants,
	formActionsVariants,
	getFormActionsVariantClasses,
} from '@core/ui/forms/form-actions/helpers/FormActionsHelpers';
import { describe, expect, it } from 'vitest';

describe('formActionsVariants', () => {
	it('should be a function', () => {
		expect(typeof formActionsVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = formActionsVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
		expect(classes).toContain('flex');
		expect(classes).toContain('flex-row');
	});

	it('should return classes for all gap sizes', () => {
		const gaps: Array<'none' | 'sm' | 'md' | 'lg'> = ['none', 'sm', 'md', 'lg'];

		for (const gap of gaps) {
			const classes = formActionsVariants({ gap });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different gap classes for different sizes', () => {
		const noneClasses = formActionsVariants({ gap: 'none' });
		const smClasses = formActionsVariants({ gap: 'sm' });
		const mdClasses = formActionsVariants({ gap: 'md' });
		const lgClasses = formActionsVariants({ gap: 'lg' });

		expect(noneClasses).not.toContain('gap-');
		expect(smClasses).toContain('gap-2');
		expect(mdClasses).toContain('gap-4');
		expect(lgClasses).toContain('gap-6');
	});

	it('should return classes for all alignment options', () => {
		const aligns: Array<'start' | 'center' | 'end' | 'space-between'> = [
			'start',
			'center',
			'end',
			'space-between',
		];

		for (const align of aligns) {
			const classes = formActionsVariants({ align });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different alignment classes', () => {
		const startClasses = formActionsVariants({ align: 'start' });
		const centerClasses = formActionsVariants({ align: 'center' });
		const endClasses = formActionsVariants({ align: 'end' });
		const spaceBetweenClasses = formActionsVariants({ align: 'space-between' });

		expect(startClasses).toContain('justify-start');
		expect(centerClasses).toContain('justify-center');
		expect(endClasses).toContain('justify-end');
		expect(spaceBetweenClasses).toContain('justify-between');
	});

	it('should handle fullWidth variant', () => {
		const fullWidthClasses = formActionsVariants({ fullWidth: true });
		const notFullWidthClasses = formActionsVariants({ fullWidth: false });

		expect(fullWidthClasses).toContain('w-full');
		expect(notFullWidthClasses).not.toContain('w-full');
	});

	it('should combine multiple variants correctly', () => {
		const classes = formActionsVariants({
			gap: 'lg',
			align: 'center',
			fullWidth: true,
		});
		expect(classes).toContain('gap-6');
		expect(classes).toContain('justify-center');
		expect(classes).toContain('w-full');
		expect(classes).toContain('flex');
		expect(classes).toContain('flex-row');
	});

	it('should use default variants when not provided', () => {
		const classes = formActionsVariants();
		// Defaults: gap: 'md', align: 'end', fullWidth: false
		expect(classes).toContain('gap-4');
		expect(classes).toContain('justify-end');
		expect(classes).not.toContain('w-full');
	});
});

describe('getFormActionsVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getFormActionsVariantClasses).toBe('function');
	});

	it('should return classes when called with no arguments', () => {
		const classes = getFormActionsVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge custom className with variant classes', () => {
		const customClass = 'custom-form-actions-class';
		const classes = getFormActionsVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});

	it('should merge className correctly with all variants', () => {
		const customClass = 'my-custom-class';
		const classes = getFormActionsVariantClasses({
			gap: 'md',
			align: 'center',
			fullWidth: true,
			className: customClass,
		});
		expect(classes).toContain(customClass);
		expect(classes).toContain('gap-4');
		expect(classes).toContain('justify-center');
		expect(classes).toContain('w-full');
	});

	it('should handle undefined className', () => {
		const classes = getFormActionsVariantClasses({ gap: 'md' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should handle empty className string', () => {
		const classes = getFormActionsVariantClasses({ gap: 'md', className: '' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should use default variants when not provided', () => {
		const classes = getFormActionsVariantClasses({});
		expect(classes).toContain('gap-4');
		expect(classes).toContain('justify-end');
	});

	it('should return different class strings for different props', () => {
		const defaultClasses = getFormActionsVariantClasses({});
		const withCustomClass = getFormActionsVariantClasses({ className: 'custom' });
		const withDifferentGap = getFormActionsVariantClasses({ gap: 'lg' });
		expect(defaultClasses).not.toBe(withCustomClass);
		expect(defaultClasses).not.toBe(withDifferentGap);
	});
});

describe('FormActionsVariants type', () => {
	it('should accept valid gap values', () => {
		const validGaps: FormActionsVariants['gap'][] = ['none', 'sm', 'md', 'lg', undefined];
		for (const gap of validGaps) {
			if (gap !== undefined) {
				const classes = formActionsVariants({ gap });
				expect(typeof classes).toBe('string');
			}
		}
	});

	it('should accept valid align values', () => {
		const validAligns: FormActionsVariants['align'][] = [
			'start',
			'center',
			'end',
			'space-between',
			undefined,
		];
		for (const align of validAligns) {
			if (align !== undefined) {
				const classes = formActionsVariants({ align });
				expect(typeof classes).toBe('string');
			}
		}
	});

	it('should accept valid fullWidth values', () => {
		const validFullWidths: FormActionsVariants['fullWidth'][] = [true, false, undefined];
		for (const fullWidth of validFullWidths) {
			if (fullWidth !== undefined) {
				const classes = formActionsVariants({ fullWidth });
				expect(typeof classes).toBe('string');
			}
		}
	});
});
