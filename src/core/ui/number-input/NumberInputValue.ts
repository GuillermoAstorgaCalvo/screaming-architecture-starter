import type { NumberInputValue } from './useNumberInput.types';

type OptionalNumber = number | undefined;

export interface CalculateCurrentValueOptions {
	readonly value?: NumberInputValue;
	readonly defaultValue?: NumberInputValue;
}

/**
 * Calculates the current numeric value from value or defaultValue props
 *
 * Handles both string and number types, converting strings to numbers
 * and returning undefined for empty strings.
 *
 * @param options - Options containing value and defaultValue
 * @returns The current numeric value or undefined
 *
 * @internal
 */
export function calculateCurrentValue({
	value,
	defaultValue,
}: Readonly<CalculateCurrentValueOptions>): OptionalNumber {
	if (value !== undefined) {
		if (typeof value === 'string') {
			return value === '' ? undefined : Number.parseFloat(value);
		}
		return value;
	}
	if (defaultValue !== undefined) {
		if (typeof defaultValue === 'string') {
			return defaultValue === '' ? undefined : Number.parseFloat(defaultValue);
		}
		return defaultValue;
	}
	return undefined;
}

export interface CalculateIncrementDecrementCapabilityOptions {
	readonly currentValue: OptionalNumber;
	readonly min?: OptionalNumber;
	readonly max?: OptionalNumber;
}

export interface IncrementDecrementCapability {
	readonly canIncrement: boolean;
	readonly canDecrement: boolean;
}

/**
 * Determines if increment and decrement operations are allowed
 *
 * Checks if the current value is within the min/max bounds and
 * whether increment/decrement would violate those bounds.
 *
 * @param options - Options containing current value and min/max constraints
 * @returns Object indicating whether increment and decrement are allowed
 *
 * @internal
 */
export function calculateIncrementDecrementCapability({
	currentValue,
	min,
	max,
}: Readonly<CalculateIncrementDecrementCapabilityOptions>): IncrementDecrementCapability {
	const hasMax = max !== undefined;
	const hasMin = min !== undefined;
	const canIncrement = !hasMax || (currentValue !== undefined && currentValue < max);
	const canDecrement = !hasMin || (currentValue !== undefined && currentValue > min);
	return { canIncrement, canDecrement };
}

export interface NumberInputValueAndCapability {
	readonly currentValue: OptionalNumber;
	readonly canIncrement: boolean;
	readonly canDecrement: boolean;
}

/**
 * Calculates current value and increment/decrement capability
 *
 * @param options - Options containing value, defaultValue, min, and max
 * @returns Current value and capability flags
 *
 * @internal
 */
export function calculateNumberInputValueAndCapability({
	value,
	defaultValue,
	min,
	max,
}: Readonly<{
	value?: NumberInputValue;
	defaultValue?: NumberInputValue;
	min?: OptionalNumber;
	max?: OptionalNumber;
}>): NumberInputValueAndCapability {
	const currentValue = calculateCurrentValue({ value, defaultValue });
	const { canIncrement, canDecrement } = calculateIncrementDecrementCapability({
		currentValue,
		min,
		max,
	});
	return { currentValue, canIncrement, canDecrement };
}
