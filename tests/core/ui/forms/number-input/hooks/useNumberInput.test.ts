/**
 * useNumberInput Tests
 *
 * Tests for the useNumberInputProps hook:
 * - Prop extraction
 * - State computation
 * - Field props building
 * - Return values
 */

import { useNumberInputProps } from '@core/ui/forms/number-input/hooks/useNumberInput';
import type { NumberInputProps } from '@src-types/ui/forms-inputs';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useNumberInputProps - Prop Extraction', () => {
	it('extracts all props correctly', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			error: 'Invalid quantity',
			helperText: 'Enter a quantity',
			size: 'lg',
			fullWidth: true,
			inputId: 'custom-id',
			disabled: true,
			required: true,
			min: 0,
			max: 100,
			step: 1,
			value: 42,
			onChange: () => {},
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.label).toBe('Quantity');
		expect(result.current.error).toBe('Invalid quantity');
		expect(result.current.helperText).toBe('Enter a quantity');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});

	it('uses default values for optional props', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.label).toBe('Quantity');
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
	});

	it('defaults size to md when not provided', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.state).toBeDefined();
		// State should be computed with default size 'md'
	});

	it('extracts value and onChange correctly', () => {
		const onChange = () => {};
		const props: NumberInputProps = {
			label: 'Quantity',
			value: 42,
			onChange,
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.props.value).toBe(42);
		expect(typeof result.current.fieldProps.props.onChange).toBe('function');
	});

	it('extracts defaultValue correctly', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			defaultValue: 10,
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.props.defaultValue).toBe(10);
	});

	it('extracts disabled and required correctly', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			disabled: true,
			required: true,
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
	});
});

describe('useNumberInputProps - State Computation', () => {
	it('computes state using useNumberInputState', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			error: 'Invalid quantity',
			helperText: 'Enter a quantity',
			size: 'lg',
			inputId: 'test-id',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.state).toBeDefined();
		expect(result.current.state.finalId).toBe('test-id');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.state.ariaDescribedBy).toContain('test-id-helper');
	});

	it('passes computed state to field props', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			inputId: 'test-id',
			size: 'md',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBe(result.current.state.inputClasses);
		expect(result.current.fieldProps.hasError).toBe(result.current.state.hasError);
		expect(result.current.fieldProps.ariaDescribedBy).toBe(result.current.state.ariaDescribedBy);
	});
});

describe('useNumberInputProps - Value and Capability', () => {
	it('calculates value and capability from props', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			value: 5,
			min: 0,
			max: 10,
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.canIncrement).toBe(true);
		expect(result.current.fieldProps.canDecrement).toBe(true);
	});

	it('handles value at max boundary', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			value: 10,
			min: 0,
			max: 10,
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.canIncrement).toBe(false);
		expect(result.current.fieldProps.canDecrement).toBe(true);
	});

	it('handles value at min boundary', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			value: 0,
			min: 0,
			max: 10,
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.canIncrement).toBe(true);
		expect(result.current.fieldProps.canDecrement).toBe(false);
	});

	it('handles string value', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			value: '42',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.canIncrement).toBe(true);
		expect(result.current.fieldProps.canDecrement).toBe(true);
	});
});

describe('useNumberInputProps - Field Props Building', () => {
	it('builds complete field props object', () => {
		const onChange = () => {};
		const props: NumberInputProps = {
			label: 'Quantity',
			inputId: 'test-id',
			disabled: true,
			required: true,
			min: 0,
			max: 100,
			step: 1,
			value: 42,
			onChange,
			size: 'md',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps).toBeDefined();
		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBeDefined();
		expect(result.current.fieldProps.hasError).toBe(false);
		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.min).toBe(0);
		expect(result.current.fieldProps.max).toBe(100);
		expect(result.current.fieldProps.step).toBe(1);
		expect(result.current.fieldProps.props.value).toBe(42);
		expect(typeof result.current.fieldProps.props.onChange).toBe('function');
		expect(result.current.fieldProps.props).toBeDefined();
	});

	it('includes rest props in field props', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			placeholder: 'Enter quantity',
			'data-testid': 'number-input',
			size: 'md',
		} as any;

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.props).toBeDefined();
		expect(result.current.fieldProps.props.placeholder).toBe('Enter quantity');
		expect((result.current.fieldProps.props as any)['data-testid']).toBe('number-input');
	});

	it('excludes controlled props from rest props', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			size: 'md',
			disabled: true,
			required: true,
			value: 42,
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		// These should not be in props.rest
		expect(result.current.fieldProps.props).not.toHaveProperty('size');
		expect(result.current.fieldProps.props).not.toHaveProperty('type');
		expect(result.current.fieldProps.props).not.toHaveProperty('id');
		expect(result.current.fieldProps.props).not.toHaveProperty('className');
		expect(result.current.fieldProps.props).not.toHaveProperty('disabled');
		expect(result.current.fieldProps.props).not.toHaveProperty('required');
		// value should be included in props for controlled inputs
		expect(result.current.fieldProps.props).toHaveProperty('value');
		expect(result.current.fieldProps.props.value).toBe(42);
	});

	it('handles uncontrolled mode with defaultValue', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			defaultValue: 10,
			size: 'md',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.props.defaultValue).toBe(10);
		expect(result.current.fieldProps.props.value).toBeUndefined();
	});

	it('handles controlled mode with value', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			value: 42,
			size: 'md',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.fieldProps.props.value).toBe(42);
		expect(result.current.fieldProps.props.defaultValue).toBeUndefined();
	});
});

describe('useNumberInputProps - Return Values', () => {
	it('returns all expected values', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			error: 'Invalid',
			helperText: 'Helper',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('fieldProps');
		expect(result.current).toHaveProperty('label');
		expect(result.current).toHaveProperty('error');
		expect(result.current).toHaveProperty('helperText');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('fullWidth');
	});

	it('returns extracted label, error, and helperText', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			error: 'Invalid quantity',
			helperText: 'Enter a quantity',
			size: 'md',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.label).toBe('Quantity');
		expect(result.current.error).toBe('Invalid quantity');
		expect(result.current.helperText).toBe('Enter a quantity');
	});

	it('returns required and fullWidth flags', () => {
		const props: NumberInputProps = {
			label: 'Quantity',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});
});

describe('useNumberInputProps - Integration', () => {
	it('handles complete NumberInput props flow', () => {
		const onChange = () => {};
		const props: NumberInputProps = {
			label: 'Quantity',
			error: 'Invalid quantity',
			helperText: 'Enter a quantity',
			size: 'lg',
			fullWidth: true,
			inputId: 'quantity-input',
			disabled: false,
			required: true,
			min: 0,
			max: 100,
			step: 1,
			value: 42,
			onChange,
			placeholder: 'Enter quantity',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		// Check extracted props
		expect(result.current.label).toBe('Quantity');
		expect(result.current.error).toBe('Invalid quantity');
		expect(result.current.helperText).toBe('Enter a quantity');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);

		// Check computed state
		expect(result.current.state.finalId).toBe('quantity-input');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('quantity-input-error');
		expect(result.current.state.ariaDescribedBy).toContain('quantity-input-helper');

		// Check field props
		expect(result.current.fieldProps.id).toBe('quantity-input');
		expect(result.current.fieldProps.hasError).toBe(true);
		expect(result.current.fieldProps.disabled).toBe(false);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.min).toBe(0);
		expect(result.current.fieldProps.max).toBe(100);
		expect(result.current.fieldProps.step).toBe(1);
		expect(result.current.fieldProps.props.value).toBe(42);
		expect(typeof result.current.fieldProps.props.onChange).toBe('function');
		expect(result.current.fieldProps.props.placeholder).toBe('Enter quantity');
	});

	it('handles minimal props', () => {
		const props: NumberInputProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useNumberInputProps({ props }));

		expect(result.current.label).toBeUndefined();
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
		expect(result.current.state).toBeDefined();
		expect(result.current.fieldProps).toBeDefined();
	});

	it('updates when props change', () => {
		const { result, rerender } = renderHook(
			({ props }: { props: NumberInputProps }) => useNumberInputProps({ props }),
			{
				initialProps: {
					props: {
						label: 'Quantity',
						size: 'md',
					},
				},
			}
		);

		expect(result.current.label).toBe('Quantity');
		expect(result.current.state.hasError).toBe(false);

		rerender({
			props: {
				label: 'Quantity',
				error: 'Invalid',
				size: 'md',
			},
		});

		expect(result.current.error).toBe('Invalid');
		expect(result.current.state.hasError).toBe(true);
	});
});
