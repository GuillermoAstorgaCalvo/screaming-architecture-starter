/**
 * useNumberInput.utils Tests
 *
 * Tests for helper function:
 * - extractNumberInputProps
 */

import { extractNumberInputProps } from '@core/ui/forms/number-input/helpers/useNumberInput.utils';
import type { NumberInputProps } from '@src-types/ui/forms-inputs';
import { describe, expect, it } from 'vitest';

describe('extractNumberInputProps', () => {
	it('should be a function', () => {
		expect(typeof extractNumberInputProps).toBe('function');
	});

	it('should extract all props correctly', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			error: 'Invalid quantity',
			helperText: 'Enter a quantity',
			size: 'lg',
			fullWidth: true,
			inputId: 'custom-id',
			className: 'custom-class',
			disabled: true,
			required: true,
			min: 0,
			max: 100,
			step: 1,
			value: 42,
			onChange: () => {},
		};

		const extracted = extractNumberInputProps(props);

		expect(extracted.label).toBe('Quantity');
		expect(extracted.error).toBe('Invalid quantity');
		expect(extracted.helperText).toBe('Enter a quantity');
		expect(extracted.size).toBe('lg');
		expect(extracted.fullWidth).toBe(true);
		expect(extracted.inputId).toBe('custom-id');
		expect(extracted.className).toBe('custom-class');
		expect(extracted.disabled).toBe(true);
		expect(extracted.required).toBe(true);
		expect(extracted.min).toBe(0);
		expect(extracted.max).toBe(100);
		expect(extracted.step).toBe(1);
		expect(extracted.value).toBe(42);
		expect(extracted.onChange).toBeDefined();
	});

	it('should use default values for optional props', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
		};

		const extracted = extractNumberInputProps(props);

		expect(extracted.size).toBe('md');
		expect(extracted.fullWidth).toBe(false);
		expect(extracted.step).toBe(1);
		expect(extracted.error).toBeUndefined();
		expect(extracted.helperText).toBeUndefined();
		expect(extracted.inputId).toBeUndefined();
		expect(extracted.className).toBeUndefined();
		expect(extracted.disabled).toBeUndefined();
		expect(extracted.required).toBeUndefined();
		expect(extracted.min).toBeUndefined();
		expect(extracted.max).toBeUndefined();
		expect(extracted.value).toBeUndefined();
		expect(extracted.defaultValue).toBeUndefined();
		expect(extracted.onChange).toBeUndefined();
	});

	it('should extract defaultValue', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			defaultValue: 10,
		};

		const extracted = extractNumberInputProps(props);

		expect(extracted.defaultValue).toBe(10);
	});

	it('should extract rest props', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			placeholder: 'Enter quantity',
			'data-testid': 'number-input',
		} as any;

		const extracted = extractNumberInputProps(props);

		expect(extracted.rest).toBeDefined();
		expect(extracted.rest.placeholder).toBe('Enter quantity');
		expect((extracted.rest as any)['data-testid']).toBe('number-input');
	});

	it('should exclude controlled props from rest', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			size: 'md',
			inputId: 'test-id',
			className: 'test-class',
			disabled: true,
			required: true,
			min: 0,
			max: 100,
			step: 1,
			value: 42,
		};

		const extracted = extractNumberInputProps(props);

		expect(extracted.rest).not.toHaveProperty('size');
		expect(extracted.rest).not.toHaveProperty('id');
		expect(extracted.rest).not.toHaveProperty('className');
		expect(extracted.rest).not.toHaveProperty('disabled');
		expect(extracted.rest).not.toHaveProperty('required');
		expect(extracted.rest).not.toHaveProperty('min');
		expect(extracted.rest).not.toHaveProperty('max');
		expect(extracted.rest).not.toHaveProperty('step');
		expect(extracted.rest).not.toHaveProperty('value');
		expect(extracted.rest).not.toHaveProperty('defaultValue');
	});

	it('should handle string value', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			value: '42',
		};

		const extracted = extractNumberInputProps(props);

		expect(extracted.value).toBe('42');
	});

	it('should handle string defaultValue', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			defaultValue: '10',
		};

		const extracted = extractNumberInputProps(props);

		expect(extracted.defaultValue).toBe('10');
	});

	it('should handle custom step value', () => {
		const props: NumberInputProps = {
			label: 'Price',
			step: 0.01,
		};

		const extracted = extractNumberInputProps(props);

		expect(extracted.step).toBe(0.01);
	});

	it('should handle all size variants', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const props: NumberInputProps = {
				label: 'Quantity',
				size,
			};

			const extracted = extractNumberInputProps(props);
			expect(extracted.size).toBe(size);
		}
	});
});
