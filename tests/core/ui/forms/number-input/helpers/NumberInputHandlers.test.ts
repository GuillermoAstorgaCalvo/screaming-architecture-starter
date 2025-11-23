/**
 * NumberInputHandlers Tests
 *
 * Tests for handler creation functions:
 * - createIncrementHandler
 * - createDecrementHandler
 * - createInputChangeHandler
 * - createNumberInputHandlers
 */

import {
	createDecrementHandler,
	createIncrementHandler,
	createInputChangeHandler,
	createNumberInputHandlers,
} from '@core/ui/forms/number-input/helpers/NumberInputHandlers';
import type { ChangeEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('createIncrementHandler', () => {
	it('should be a function', () => {
		expect(typeof createIncrementHandler).toBe('function');
	});

	it('should create a handler that increments value by step', () => {
		const onChange = vi.fn();
		const handler = createIncrementHandler({
			currentValue: 5,
			step: 1,
			canIncrement: true,
			onChange,
		});

		handler();
		expect(onChange).toHaveBeenCalledWith(6);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should use min as base when currentValue is undefined', () => {
		const onChange = vi.fn();
		const handler = createIncrementHandler({
			currentValue: undefined,
			min: 0,
			step: 1,
			canIncrement: true,
			onChange,
		});

		handler();
		expect(onChange).toHaveBeenCalledWith(1);
	});

	it('should clamp to max when incrementing', () => {
		const onChange = vi.fn();
		const handler = createIncrementHandler({
			currentValue: 9,
			max: 10,
			step: 5,
			canIncrement: true,
			onChange,
		});

		handler();
		expect(onChange).toHaveBeenCalledWith(10);
	});

	it('should not call onChange when disabled', () => {
		const onChange = vi.fn();
		const handler = createIncrementHandler({
			currentValue: 5,
			step: 1,
			disabled: true,
			canIncrement: true,
			onChange,
		});

		handler();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('should not call onChange when cannot increment', () => {
		const onChange = vi.fn();
		const handler = createIncrementHandler({
			currentValue: 10,
			max: 10,
			step: 1,
			canIncrement: false,
			onChange,
		});

		handler();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('should handle decimal step values', () => {
		const onChange = vi.fn();
		const handler = createIncrementHandler({
			currentValue: 1.5,
			step: 0.5,
			canIncrement: true,
			onChange,
		});

		handler();
		expect(onChange).toHaveBeenCalledWith(2);
	});

	it('should handle negative values', () => {
		const onChange = vi.fn();
		const handler = createIncrementHandler({
			currentValue: -5,
			step: 2,
			canIncrement: true,
			onChange,
		});

		handler();
		expect(onChange).toHaveBeenCalledWith(-3);
	});

	it('should work without onChange', () => {
		const handler = createIncrementHandler({
			currentValue: 5,
			step: 1,
			canIncrement: true,
		});

		expect(() => handler()).not.toThrow();
	});
});

describe('createDecrementHandler', () => {
	it('should be a function', () => {
		expect(typeof createDecrementHandler).toBe('function');
	});

	it('should create a handler that decrements value by step', () => {
		const onChange = vi.fn();
		const handler = createDecrementHandler({
			currentValue: 5,
			step: 1,
			canDecrement: true,
			onChange,
		});

		handler();
		expect(onChange).toHaveBeenCalledWith(4);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should use max as base when currentValue is undefined', () => {
		const onChange = vi.fn();
		const handler = createDecrementHandler({
			currentValue: undefined,
			max: 10,
			step: 1,
			canDecrement: true,
			onChange,
		});

		handler();
		expect(onChange).toHaveBeenCalledWith(9);
	});

	it('should clamp to min when decrementing', () => {
		const onChange = vi.fn();
		const handler = createDecrementHandler({
			currentValue: 2,
			min: 0,
			step: 5,
			canDecrement: true,
			onChange,
		});

		handler();
		expect(onChange).toHaveBeenCalledWith(0);
	});

	it('should not call onChange when disabled', () => {
		const onChange = vi.fn();
		const handler = createDecrementHandler({
			currentValue: 5,
			step: 1,
			disabled: true,
			canDecrement: true,
			onChange,
		});

		handler();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('should not call onChange when cannot decrement', () => {
		const onChange = vi.fn();
		const handler = createDecrementHandler({
			currentValue: 0,
			min: 0,
			step: 1,
			canDecrement: false,
			onChange,
		});

		handler();
		expect(onChange).not.toHaveBeenCalled();
	});

	it('should handle decimal step values', () => {
		const onChange = vi.fn();
		const handler = createDecrementHandler({
			currentValue: 2.5,
			step: 0.5,
			canDecrement: true,
			onChange,
		});

		handler();
		expect(onChange).toHaveBeenCalledWith(2);
	});

	it('should handle negative values', () => {
		const onChange = vi.fn();
		const handler = createDecrementHandler({
			currentValue: -3,
			step: 2,
			canDecrement: true,
			onChange,
		});

		handler();
		expect(onChange).toHaveBeenCalledWith(-5);
	});

	it('should work without onChange', () => {
		const handler = createDecrementHandler({
			currentValue: 5,
			step: 1,
			canDecrement: true,
		});

		expect(() => handler()).not.toThrow();
	});
});

describe('createInputChangeHandler', () => {
	it('should be a function', () => {
		expect(typeof createInputChangeHandler).toBe('function');
	});

	it('should create a handler that calls onChange with parsed number', () => {
		const onChange = vi.fn();
		const handler = createInputChangeHandler({ onChange });
		const event = {
			target: { value: '42' },
		} as ChangeEvent<HTMLInputElement>;

		handler(event);
		expect(onChange).toHaveBeenCalledWith(42);
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('should handle decimal values', () => {
		const onChange = vi.fn();
		const handler = createInputChangeHandler({ onChange });
		const event = {
			target: { value: '3.14' },
		} as ChangeEvent<HTMLInputElement>;

		handler(event);
		expect(onChange).toHaveBeenCalledWith(3.14);
	});

	it('should handle empty string by passing min or 0', () => {
		const onChange = vi.fn();
		const handler = createInputChangeHandler({ min: 5, onChange });
		const event = {
			target: { value: '' },
		} as ChangeEvent<HTMLInputElement>;

		handler(event);
		expect(onChange).toHaveBeenCalledWith(5);
	});

	it('should handle empty string with no min by passing 0', () => {
		const onChange = vi.fn();
		const handler = createInputChangeHandler({ onChange });
		const event = {
			target: { value: '' },
		} as ChangeEvent<HTMLInputElement>;

		handler(event);
		expect(onChange).toHaveBeenCalledWith(0);
	});

	it('should clamp value to min', () => {
		const onChange = vi.fn();
		const handler = createInputChangeHandler({ min: 0, onChange });
		const event = {
			target: { value: '-5' },
		} as ChangeEvent<HTMLInputElement>;

		handler(event);
		expect(onChange).toHaveBeenCalledWith(0);
	});

	it('should clamp value to max', () => {
		const onChange = vi.fn();
		const handler = createInputChangeHandler({ max: 10, onChange });
		const event = {
			target: { value: '15' },
		} as ChangeEvent<HTMLInputElement>;

		handler(event);
		expect(onChange).toHaveBeenCalledWith(10);
	});

	it('should clamp value to both min and max', () => {
		const onChange = vi.fn();
		const handler = createInputChangeHandler({ min: 0, max: 10, onChange });
		const event = {
			target: { value: '20' },
		} as ChangeEvent<HTMLInputElement>;

		handler(event);
		expect(onChange).toHaveBeenCalledWith(10);
	});

	it('should not call onChange for NaN values', () => {
		const onChange = vi.fn();
		const handler = createInputChangeHandler({ onChange });
		const event = {
			target: { value: 'abc' },
		} as ChangeEvent<HTMLInputElement>;

		handler(event);
		expect(onChange).not.toHaveBeenCalled();
	});

	it('should not call onChange when onChange is not provided', () => {
		const handler = createInputChangeHandler({});
		const event = {
			target: { value: '42' },
		} as ChangeEvent<HTMLInputElement>;

		expect(() => handler(event)).not.toThrow();
	});
});

describe('createNumberInputHandlers', () => {
	it('should be a function', () => {
		expect(typeof createNumberInputHandlers).toBe('function');
	});

	it('should create all handlers', () => {
		const onChange = vi.fn();
		const valueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};
		const handlers = createNumberInputHandlers({
			valueAndCapability,
			step: 1,
			onChange,
		});

		expect(handlers).toHaveProperty('handleIncrement');
		expect(handlers).toHaveProperty('handleDecrement');
		expect(handlers).toHaveProperty('handleInputChange');
		expect(typeof handlers.handleIncrement).toBe('function');
		expect(typeof handlers.handleDecrement).toBe('function');
		expect(typeof handlers.handleInputChange).toBe('function');
	});

	it('should create working increment handler', () => {
		const onChange = vi.fn();
		const valueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};
		const handlers = createNumberInputHandlers({
			valueAndCapability,
			step: 1,
			onChange,
		});

		handlers.handleIncrement();
		expect(onChange).toHaveBeenCalledWith(6);
	});

	it('should create working decrement handler', () => {
		const onChange = vi.fn();
		const valueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};
		const handlers = createNumberInputHandlers({
			valueAndCapability,
			step: 1,
			onChange,
		});

		handlers.handleDecrement();
		expect(onChange).toHaveBeenCalledWith(4);
	});

	it('should create working input change handler', () => {
		const onChange = vi.fn();
		const valueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};
		const handlers = createNumberInputHandlers({
			valueAndCapability,
			step: 1,
			onChange,
		});

		const event = {
			target: { value: '10' },
		} as ChangeEvent<HTMLInputElement>;
		handlers.handleInputChange(event);
		expect(onChange).toHaveBeenCalledWith(10);
	});

	it('should pass min and max to handlers', () => {
		const onChange = vi.fn();
		const valueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};
		const handlers = createNumberInputHandlers({
			valueAndCapability,
			min: 0,
			max: 10,
			step: 1,
			onChange,
		});

		handlers.handleIncrement();
		expect(onChange).toHaveBeenCalledWith(6);

		onChange.mockClear();
		handlers.handleDecrement();
		expect(onChange).toHaveBeenCalledWith(4);
	});

	it('should handle disabled state', () => {
		const onChange = vi.fn();
		const valueAndCapability = {
			currentValue: 5,
			canIncrement: true,
			canDecrement: true,
		};
		const handlers = createNumberInputHandlers({
			valueAndCapability,
			step: 1,
			disabled: true,
			onChange,
		});

		handlers.handleIncrement();
		handlers.handleDecrement();
		expect(onChange).not.toHaveBeenCalled();
	});
});
