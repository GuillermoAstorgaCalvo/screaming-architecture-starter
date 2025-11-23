/**
 * Tests for button variants
 *
 * Tests button variant functions, class generation, and type safety
 */

import {
	type ButtonVariants,
	buttonVariants,
	getButtonVariantClasses,
} from '@core/ui/variants/button';
import { describe, expect, it } from 'vitest';

describe('buttonVariants', () => {
	it('should be a function', () => {
		expect(typeof buttonVariants).toBe('function');
	});

	it('should return default classes when called with no arguments', () => {
		const classes = buttonVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('buttonVariants - variants', () => {
	it('should return classes for primary variant (default)', () => {
		const classes = buttonVariants({ variant: 'primary' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for secondary variant', () => {
		const classes = buttonVariants({ variant: 'secondary' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for ghost variant', () => {
		const classes = buttonVariants({ variant: 'ghost' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different variants', () => {
		const primaryClasses = buttonVariants({ variant: 'primary' });
		const secondaryClasses = buttonVariants({ variant: 'secondary' });
		const ghostClasses = buttonVariants({ variant: 'ghost' });

		expect(primaryClasses).not.toBe(secondaryClasses);
		expect(primaryClasses).not.toBe(ghostClasses);
		expect(secondaryClasses).not.toBe(ghostClasses);
	});
});

describe('buttonVariants - sizes', () => {
	it('should return classes for sm size', () => {
		const classes = buttonVariants({ size: 'sm' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for md size (default)', () => {
		const classes = buttonVariants({ size: 'md' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for lg size', () => {
		const classes = buttonVariants({ size: 'lg' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = buttonVariants({ size: 'sm' });
		const mdClasses = buttonVariants({ size: 'md' });
		const lgClasses = buttonVariants({ size: 'lg' });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('buttonVariants - combinations', () => {
	it('should combine variant and size correctly', () => {
		const classes = buttonVariants({ variant: 'primary', size: 'lg' });
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getButtonVariantClasses', () => {
	it('should be a function', () => {
		expect(typeof getButtonVariantClasses).toBe('function');
	});

	it('should return classes with default variants', () => {
		const classes = getButtonVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-button-class';
		const classes = getButtonVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});

	it('should include fullWidth class when fullWidth is true', () => {
		const classes = getButtonVariantClasses({ fullWidth: true });
		expect(classes).toContain('w-full');
	});

	it('should not include fullWidth class when fullWidth is false', () => {
		const classes = getButtonVariantClasses({ fullWidth: false });
		expect(classes).not.toContain('w-full');
	});

	it('should combine variant, size, fullWidth, and className', () => {
		const classes = getButtonVariantClasses({
			variant: 'secondary',
			size: 'lg',
			fullWidth: true,
			className: 'custom-class',
		});
		expect(classes).toContain('w-full');
		expect(classes).toContain('custom-class');
	});
});

describe('ButtonVariants type', () => {
	it('should export ButtonVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: ButtonVariants = { variant: 'primary', size: 'md' };
		expect(_test).toBeDefined();
	});
});
