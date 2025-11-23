/**
 * useNumberInputFieldProps Tests
 *
 * Tests for the useNumberInputFieldProps hook:
 * - Field props building
 * - Memoization
 */

import type { NumberInputHandlers } from '@core/ui/forms/number-input/helpers/NumberInputHandlers';
import type { NumberInputValueAndCapability } from '@core/ui/forms/number-input/helpers/NumberInputValue';
import { useNumberInputFieldProps } from '@core/ui/forms/number-input/hooks/useNumberInputFieldProps';
import type { UseNumberInputStateReturn } from '@core/ui/forms/number-input/types/NumberInputTypes';
import type { ExtractedNumberInputProps } from '@core/ui/forms/number-input/types/useNumberInput.types';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useNumberInputFieldProps', () => {
	it('should be a function', () => {
		expect(typeof useNumberInputFieldProps).toBe('function');
	});

	it('should build complete field props object', () => {
		const state: UseNumberInputStateReturn = {
			finalId: 'test-id',
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: 'test-classes',
		};

		const extracted: ExtractedNumberInputProps = {
			label: 'Quantity',
			size: 'md',
			fullWidth: false,
			disabled: true,
			required: true,
			min: 0,
			max: 100,
			step: 1,
			rest: {},
		};

		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const handlers: NumberInputHandlers = {
			handleIncrement: () => {},
			handleDecrement: () => {},
			handleInputChange: () => {},
		};

		const { result } = renderHook(() =>
			useNumberInputFieldProps({
				state,
				extracted,
				valueAndCapability,
				handlers,
			})
		);

		expect(result.current.id).toBe('test-id');
		expect(result.current.className).toBe('test-classes');
		expect(result.current.hasError).toBe(false);
		expect(result.current.ariaDescribedBy).toBeUndefined();
		expect(result.current.disabled).toBe(true);
		expect(result.current.required).toBe(true);
		expect(result.current.min).toBe(0);
		expect(result.current.max).toBe(100);
		expect(result.current.step).toBe(1);
		expect(result.current.canIncrement).toBe(true);
		expect(result.current.canDecrement).toBe(true);
		expect(result.current.onIncrement).toBe(handlers.handleIncrement);
		expect(result.current.onDecrement).toBe(handlers.handleDecrement);
		expect(result.current.props).toBeDefined();
	});

	it('should include rest props in field props', () => {
		const state: UseNumberInputStateReturn = {
			finalId: 'test-id',
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: 'test-classes',
		};

		const extracted: ExtractedNumberInputProps = {
			label: 'Quantity',
			size: 'md',
			fullWidth: false,
			step: 1,
			rest: {
				placeholder: 'Enter quantity',
				'data-testid': 'number-input',
			} as any,
		};

		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const handlers: NumberInputHandlers = {
			handleIncrement: () => {},
			handleDecrement: () => {},
			handleInputChange: () => {},
		};

		const { result } = renderHook(() =>
			useNumberInputFieldProps({
				state,
				extracted,
				valueAndCapability,
				handlers,
			})
		);

		expect(result.current.props.placeholder).toBe('Enter quantity');
		expect((result.current.props as any)['data-testid']).toBe('number-input');
	});

	it('should include onChange handler in props', () => {
		const handleInputChange = () => {};
		const state: UseNumberInputStateReturn = {
			finalId: 'test-id',
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: 'test-classes',
		};

		const extracted: ExtractedNumberInputProps = {
			label: 'Quantity',
			size: 'md',
			fullWidth: false,
			step: 1,
			rest: {},
		};

		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const handlers: NumberInputHandlers = {
			handleIncrement: () => {},
			handleDecrement: () => {},
			handleInputChange,
		};

		const { result } = renderHook(() =>
			useNumberInputFieldProps({
				state,
				extracted,
				valueAndCapability,
				handlers,
			})
		);

		expect(result.current.props.onChange).toBe(handleInputChange);
	});

	it('should memoize field props when dependencies do not change', () => {
		const state: UseNumberInputStateReturn = {
			finalId: 'test-id',
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: 'test-classes',
		};

		const extracted: ExtractedNumberInputProps = {
			label: 'Quantity',
			size: 'md',
			fullWidth: false,
			step: 1,
			rest: {},
		};

		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const handlers: NumberInputHandlers = {
			handleIncrement: () => {},
			handleDecrement: () => {},
			handleInputChange: () => {},
		};

		const { result, rerender } = renderHook(
			({ state }: { state: UseNumberInputStateReturn }) =>
				useNumberInputFieldProps({
					state,
					extracted,
					valueAndCapability,
					handlers,
				}),
			{
				initialProps: { state },
			}
		);

		const firstProps = result.current;

		rerender({ state });

		expect(result.current).toBe(firstProps);
	});

	it('should recreate field props when state changes', () => {
		const state1: UseNumberInputStateReturn = {
			finalId: 'test-id',
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: 'test-classes',
		};

		const state2: UseNumberInputStateReturn = {
			finalId: 'test-id',
			hasError: true,
			ariaDescribedBy: 'test-id-error',
			inputClasses: 'test-classes-error',
		};

		const extracted: ExtractedNumberInputProps = {
			label: 'Quantity',
			size: 'md',
			fullWidth: false,
			step: 1,
			rest: {},
		};

		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const handlers: NumberInputHandlers = {
			handleIncrement: () => {},
			handleDecrement: () => {},
			handleInputChange: () => {},
		};

		const { result, rerender } = renderHook(
			({ state }: { state: UseNumberInputStateReturn }) =>
				useNumberInputFieldProps({
					state,
					extracted,
					valueAndCapability,
					handlers,
				}),
			{
				initialProps: { state: state1 },
			}
		);

		const firstProps = result.current;

		rerender({ state: state2 });

		expect(result.current).not.toBe(firstProps);
		expect(result.current.hasError).toBe(true);
		expect(result.current.className).toBe('test-classes-error');
	});

	it('should update canIncrement and canDecrement from valueAndCapability', () => {
		const state: UseNumberInputStateReturn = {
			finalId: 'test-id',
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: 'test-classes',
		};

		const extracted: ExtractedNumberInputProps = {
			label: 'Quantity',
			size: 'md',
			fullWidth: false,
			step: 1,
			rest: {},
		};

		const valueAndCapability1: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const valueAndCapability2: NumberInputValueAndCapability = {
			currentValue: 10,
			canIncrement: false,
			canDecrement: true,
		};

		const handlers: NumberInputHandlers = {
			handleIncrement: () => {},
			handleDecrement: () => {},
			handleInputChange: () => {},
		};

		const { result, rerender } = renderHook(
			({ valueAndCapability }: { valueAndCapability: NumberInputValueAndCapability }) =>
				useNumberInputFieldProps({
					state,
					extracted,
					valueAndCapability,
					handlers,
				}),
			{
				initialProps: { valueAndCapability: valueAndCapability1 },
			}
		);

		expect(result.current.canIncrement).toBe(true);
		expect(result.current.canDecrement).toBe(true);

		rerender({ valueAndCapability: valueAndCapability2 });

		expect(result.current.canIncrement).toBe(false);
		expect(result.current.canDecrement).toBe(true);
	});
});
