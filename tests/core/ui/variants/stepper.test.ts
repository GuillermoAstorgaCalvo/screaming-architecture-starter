/**
 * Tests for stepper variants
 *
 * Tests stepper variant functions, class generation, and type safety
 */

import {
	getStepperStepSizeClasses,
	getStepperVariantClasses,
	type StepperVariants,
	stepperVariants,
} from '@core/ui/variants/stepper';
import { describe, expect, it } from 'vitest';

const TYPE_FUNCTION = 'function';
const TEST_SHOULD_BE_FUNCTION = 'should be a function';

describe('stepperVariants', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof stepperVariants).toBe(TYPE_FUNCTION);
	});

	it('should return default classes when called with no arguments', () => {
		const classes = stepperVariants();
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for all orientations', () => {
		const orientations: Array<'horizontal' | 'vertical'> = ['horizontal', 'vertical'];

		for (const orientation of orientations) {
			const classes = stepperVariants({ orientation });
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different orientations', () => {
		const horizontalClasses = stepperVariants({ orientation: 'horizontal' });
		const verticalClasses = stepperVariants({ orientation: 'vertical' });

		expect(horizontalClasses).not.toBe(verticalClasses);
	});
});

describe('getStepperVariantClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getStepperVariantClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes with default variants', () => {
		const classes = getStepperVariantClasses({});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should merge className prop', () => {
		const customClass = 'custom-stepper-class';
		const classes = getStepperVariantClasses({ className: customClass });
		expect(classes).toContain(customClass);
	});
});

describe('getStepperStepSizeClasses', () => {
	it(TEST_SHOULD_BE_FUNCTION, () => {
		expect(typeof getStepperStepSizeClasses).toBe(TYPE_FUNCTION);
	});

	it('should return classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const classes = getStepperStepSizeClasses(size);
			expect(typeof classes).toBe('string');
			expect(classes.length).toBeGreaterThan(0);
		}
	});

	it('should return different classes for different sizes', () => {
		const smClasses = getStepperStepSizeClasses('sm');
		const mdClasses = getStepperStepSizeClasses('md');
		const lgClasses = getStepperStepSizeClasses('lg');

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});
});

describe('StepperVariants type', () => {
	it('should export StepperVariants type', () => {
		// Type check: This will fail at compile time if type doesn't exist
		const _test: StepperVariants = { orientation: 'horizontal' };
		expect(_test).toBeDefined();
	});
});
