import type { NumberInputValueAndCapability } from '@core/ui/forms/number-input/helpers/NumberInputValue';
import type { ChangeEvent } from 'react';

function getBaseValue(value: number | undefined, fallback: number | undefined): number {
	return value ?? fallback ?? 0;
}

function clampValue(value: number, min: number | undefined, max: number | undefined): number {
	let clamped = value;
	if (min !== undefined) clamped = Math.max(clamped, min);
	if (max !== undefined) clamped = Math.min(clamped, max);
	return clamped;
}

export interface CreateIncrementHandlerOptions {
	readonly currentValue: number | undefined;
	readonly min?: number | undefined;
	readonly max?: number | undefined;
	readonly step: number;
	readonly disabled?: boolean | undefined;
	readonly canIncrement: boolean;
	readonly onChange?: ((value: number) => void) | undefined;
}

/**
 * Creates an increment handler function for the number input
 *
 * Increments the current value by the step amount, clamping to max if specified.
 * Returns early if disabled or increment is not allowed.
 *
 * @param options - Options for creating the increment handler
 * @returns Increment handler function
 *
 * @internal
 */
export function createIncrementHandler({
	currentValue,
	min,
	max,
	step,
	disabled,
	canIncrement,
	onChange,
}: Readonly<CreateIncrementHandlerOptions>): () => void {
	return () => {
		if (disabled || !canIncrement) return;
		const baseValue = getBaseValue(currentValue, min);
		const newValue = baseValue + step;
		onChange?.(clampValue(newValue, min, max));
	};
}

export interface CreateDecrementHandlerOptions {
	readonly currentValue: number | undefined;
	readonly min?: number | undefined;
	readonly max?: number | undefined;
	readonly step: number;
	readonly disabled?: boolean | undefined;
	readonly canDecrement: boolean;
	readonly onChange?: ((value: number) => void) | undefined;
}

/**
 * Creates a decrement handler function for the number input
 *
 * Decrements the current value by the step amount, clamping to min if specified.
 * Returns early if disabled or decrement is not allowed.
 *
 * @param options - Options for creating the decrement handler
 * @returns Decrement handler function
 *
 * @internal
 */
export function createDecrementHandler({
	currentValue,
	min,
	max,
	step,
	disabled,
	canDecrement,
	onChange,
}: Readonly<CreateDecrementHandlerOptions>): () => void {
	return () => {
		if (disabled || !canDecrement) return;
		const baseValue = getBaseValue(currentValue, max);
		const newValue = baseValue - step;
		onChange?.(clampValue(newValue, min, max));
	};
}

export interface CreateInputChangeHandlerOptions {
	readonly min?: number | undefined;
	readonly max?: number | undefined;
	readonly onChange?: ((value: number) => void) | undefined;
}

/**
 * Creates an input change handler that converts events to numbers
 *
 * Parses the input value, handles empty strings, and clamps values
 * to min/max constraints if specified.
 *
 * @param options - Options for creating the input change handler
 * @returns Input change handler function
 *
 * @internal
 */
export function createInputChangeHandler({
	min,
	max,
	onChange,
}: Readonly<CreateInputChangeHandlerOptions>): (e: ChangeEvent<HTMLInputElement>) => void {
	return (e: ChangeEvent<HTMLInputElement>) => {
		if (!onChange) return;
		const inputValue = e.target.value;
		if (inputValue === '') {
			// Allow empty value, but onChange expects a number, so we'll pass 0 or min
			onChange(min ?? 0);
			return;
		}
		const numValue = Number.parseFloat(inputValue);
		if (!Number.isNaN(numValue)) {
			onChange(clampValue(numValue, min, max));
		}
	};
}

export interface NumberInputHandlers {
	readonly handleIncrement: () => void;
	readonly handleDecrement: () => void;
	readonly handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Creates all handlers for the number input
 *
 * @param options - Options containing value/capability and handler parameters
 * @returns Object with all handlers
 *
 * @internal
 */
export function createNumberInputHandlers({
	valueAndCapability,
	min,
	max,
	step,
	disabled,
	onChange,
}: Readonly<{
	valueAndCapability: NumberInputValueAndCapability;
	min?: number | undefined;
	max?: number | undefined;
	step: number;
	disabled?: boolean | undefined;
	onChange?: ((value: number) => void) | undefined;
}>): NumberInputHandlers {
	const { currentValue, canIncrement, canDecrement } = valueAndCapability;
	return {
		handleIncrement: createIncrementHandler({
			currentValue,
			min,
			max,
			step,
			disabled,
			canIncrement,
			onChange,
		}),
		handleDecrement: createDecrementHandler({
			currentValue,
			min,
			max,
			step,
			disabled,
			canDecrement,
			onChange,
		}),
		handleInputChange: createInputChangeHandler({ min, max, onChange }),
	};
}
