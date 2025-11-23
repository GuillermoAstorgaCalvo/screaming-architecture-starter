/**
 * useNumberInputHandlers Tests
 *
 * Tests for the useNumberInputHandlers hook:
 * - Handler memoization
 * - Handler creation with different options
 */

import type { NumberInputValueAndCapability } from '@core/ui/forms/number-input/helpers/NumberInputValue';
import { useNumberInputHandlers } from '@core/ui/forms/number-input/hooks/useNumberInputHandlers';
import { renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useNumberInputHandlers', () => {
	it('should be a function', () => {
		expect(typeof useNumberInputHandlers).toBe('function');
	});

	it('should return handlers object', () => {
		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const { result } = renderHook(() =>
			useNumberInputHandlers({
				valueAndCapability,
				step: 1,
			})
		);

		expect(result.current).toHaveProperty('handleIncrement');
		expect(result.current).toHaveProperty('handleDecrement');
		expect(result.current).toHaveProperty('handleInputChange');
		expect(typeof result.current.handleIncrement).toBe('function');
		expect(typeof result.current.handleDecrement).toBe('function');
		expect(typeof result.current.handleInputChange).toBe('function');
	});

	it('should create working increment handler', () => {
		const onChange = vi.fn();
		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const { result } = renderHook(() =>
			useNumberInputHandlers({
				valueAndCapability,
				step: 1,
				onChange,
			})
		);

		result.current.handleIncrement();
		expect(onChange).toHaveBeenCalledWith(6);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should create working decrement handler', () => {
		const onChange = vi.fn();
		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const { result } = renderHook(() =>
			useNumberInputHandlers({
				valueAndCapability,
				step: 1,
				onChange,
			})
		);

		result.current.handleDecrement();
		expect(onChange).toHaveBeenCalledWith(4);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should create working input change handler', () => {
		const onChange = vi.fn();
		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const { result } = renderHook(() =>
			useNumberInputHandlers({
				valueAndCapability,
				step: 1,
				onChange,
			})
		);

		const event = {
			target: { value: '10' },
		} as ChangeEvent<HTMLInputElement>;

		result.current.handleInputChange(event);
		expect(onChange).toHaveBeenCalledWith(10);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should memoize handlers when dependencies do not change', () => {
		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const { result, rerender } = renderHook(
			({ step }: { step: number }) =>
				useNumberInputHandlers({
					valueAndCapability,
					step,
				}),
			{
				initialProps: { step: 1 },
			}
		);

		const firstHandlers = result.current;

		rerender({ step: 1 });

		expect(result.current.handleIncrement).toBe(firstHandlers.handleIncrement);
		expect(result.current.handleDecrement).toBe(firstHandlers.handleDecrement);
		expect(result.current.handleInputChange).toBe(firstHandlers.handleInputChange);
	});

	it('should recreate handlers when step changes', () => {
		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const { result, rerender } = renderHook(
			({ step }: { step: number }) =>
				useNumberInputHandlers({
					valueAndCapability,
					step,
				}),
			{
				initialProps: { step: 1 },
			}
		);

		const firstHandlers = result.current;

		rerender({ step: 2 });

		expect(result.current.handleIncrement).not.toBe(firstHandlers.handleIncrement);
	});

	it('should recreate handlers when valueAndCapability changes', () => {
		const { result, rerender } = renderHook(
			({ valueAndCapability }: { valueAndCapability: NumberInputValueAndCapability }) =>
				useNumberInputHandlers({
					valueAndCapability,
					step: 1,
				}),
			{
				initialProps: {
					valueAndCapability: {
						currentValue: 5,
						canIncrement: true,
						canDecrement: true,
					},
				},
			}
		);

		const firstHandlers = result.current;

		rerender({
			valueAndCapability: {
				currentValue: 10,
				canIncrement: true,
				canDecrement: true,
			},
		});

		expect(result.current.handleIncrement).not.toBe(firstHandlers.handleIncrement);
	});

	it('should pass min and max to handlers', () => {
		const onChange = vi.fn();
		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const { result } = renderHook(() =>
			useNumberInputHandlers({
				valueAndCapability,
				min: 0,
				max: 10,
				step: 1,
				onChange,
			})
		);

		result.current.handleIncrement();
		expect(onChange).toHaveBeenCalledWith(6);

		onChange.mockClear();

		result.current.handleDecrement();
		expect(onChange).toHaveBeenCalledWith(4);
	});

	it('should handle disabled state', () => {
		const onChange = vi.fn();
		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const { result } = renderHook(() =>
			useNumberInputHandlers({
				valueAndCapability,
				step: 1,
				disabled: true,
				onChange,
			})
		);

		result.current.handleIncrement();
		result.current.handleDecrement();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('should handle onChange changes', () => {
		const onChange1 = vi.fn();
		const onChange2 = vi.fn();
		const valueAndCapability: NumberInputValueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};

		const { result, rerender } = renderHook(
			({ onChange }: { onChange?: (value: number) => void }) =>
				useNumberInputHandlers({
					valueAndCapability,
					step: 1,
					onChange,
				}),
			{
				initialProps: { onChange: onChange1 },
			}
		);

		result.current.handleIncrement();
		expect(onChange1).toHaveBeenCalledWith(6);

		rerender({ onChange: onChange2 });

		result.current.handleIncrement();
		expect(onChange2).toHaveBeenCalledWith(6);
		expect(onChange1).toHaveBeenCalledTimes(1);
	});
});
