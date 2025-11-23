/**
 * NumberInputValue Tests
 *
 * Tests for helper functions:
 * - calculateCurrentValue
 * - calculateIncrementDecrementCapability
 * - calculateNumberInputValueAndCapability
 */

import {
	calculateCurrentValue,
	calculateIncrementDecrementCapability,
	calculateNumberInputValueAndCapability,
} from '@core/ui/forms/number-input/helpers/NumberInputValue';
import { describe, expect, it } from 'vitest';

describe('calculateCurrentValue', () => {
	it('should be a function', () => {
		expect(typeof calculateCurrentValue).toBe('function');
	});

	it('should return value when provided', () => {
		const result = calculateCurrentValue({ value: 42 });
		expect(result).toBe(42);
	});

	it('should return defaultValue when value is not provided', () => {
		const result = calculateCurrentValue({ defaultValue: 10 });
		expect(result).toBe(10);
	});

	it('should prioritize value over defaultValue', () => {
		const result = calculateCurrentValue({ value: 42, defaultValue: 10 });
		expect(result).toBe(42);
	});

	it('should return undefined when neither value nor defaultValue provided', () => {
		const result = calculateCurrentValue({});
		expect(result).toBeUndefined();
	});

	it('should convert string number to number', () => {
		const result = calculateCurrentValue({ value: '42' });
		expect(result).toBe(42);
	});

	it('should convert string decimal to number', () => {
		const result = calculateCurrentValue({ value: '3.14' });
		expect(result).toBe(3.14);
	});

	it('should return undefined for empty string', () => {
		const result = calculateCurrentValue({ value: '' });
		expect(result).toBeUndefined();
	});

	it('should convert defaultValue string to number', () => {
		const result = calculateCurrentValue({ defaultValue: '100' });
		expect(result).toBe(100);
	});

	it('should handle zero value', () => {
		const result = calculateCurrentValue({ value: 0 });
		expect(result).toBe(0);
	});

	it('should handle negative values', () => {
		const result = calculateCurrentValue({ value: -10 });
		expect(result).toBe(-10);
	});
});

describe('calculateIncrementDecrementCapability', () => {
	it('should be a function', () => {
		expect(typeof calculateIncrementDecrementCapability).toBe('function');
	});

	it('should allow increment when no max constraint', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: 10,
		});
		expect(result.canIncrement).toBe(true);
	});

	it('should allow decrement when no min constraint', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: 10,
		});
		expect(result.canDecrement).toBe(true);
	});

	it('should allow increment when currentValue is less than max', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: 5,
			max: 10,
		});
		expect(result.canIncrement).toBe(true);
	});

	it('should disallow increment when currentValue equals max', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: 10,
			max: 10,
		});
		expect(result.canIncrement).toBe(false);
	});

	it('should disallow increment when currentValue is greater than max', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: 15,
			max: 10,
		});
		expect(result.canIncrement).toBe(false);
	});

	it('should allow decrement when currentValue is greater than min', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: 5,
			min: 0,
		});
		expect(result.canDecrement).toBe(true);
	});

	it('should disallow decrement when currentValue equals min', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: 0,
			min: 0,
		});
		expect(result.canDecrement).toBe(false);
	});

	it('should disallow decrement when currentValue is less than min', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: -5,
			min: 0,
		});
		expect(result.canDecrement).toBe(false);
	});

	it('should handle undefined currentValue with max constraint', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: undefined,
			max: 10,
		});
		expect(result.canIncrement).toBe(true);
	});

	it('should handle undefined currentValue with min constraint', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: undefined,
			min: 0,
		});
		expect(result.canDecrement).toBe(true);
	});

	it('should handle value within both min and max', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: 5,
			min: 0,
			max: 10,
		});
		expect(result.canIncrement).toBe(true);
		expect(result.canDecrement).toBe(true);
	});

	it('should handle value at min boundary', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: 0,
			min: 0,
			max: 10,
		});
		expect(result.canIncrement).toBe(true);
		expect(result.canDecrement).toBe(false);
	});

	it('should handle value at max boundary', () => {
		const result = calculateIncrementDecrementCapability({
			currentValue: 10,
			min: 0,
			max: 10,
		});
		expect(result.canIncrement).toBe(false);
		expect(result.canDecrement).toBe(true);
	});
});

describe('calculateNumberInputValueAndCapability', () => {
	it('should be a function', () => {
		expect(typeof calculateNumberInputValueAndCapability).toBe('function');
	});

	it('should calculate value and capability together', () => {
		const result = calculateNumberInputValueAndCapability({
			value: 5,
			min: 0,
			max: 10,
		});
		expect(result.currentValue).toBe(5);
		expect(result.canIncrement).toBe(true);
		expect(result.canDecrement).toBe(true);
	});

	it('should use defaultValue when value is not provided', () => {
		const result = calculateNumberInputValueAndCapability({
			defaultValue: 7,
			min: 0,
			max: 10,
		});
		expect(result.currentValue).toBe(7);
		expect(result.canIncrement).toBe(true);
		expect(result.canDecrement).toBe(true);
	});

	it('should prioritize value over defaultValue', () => {
		const result = calculateNumberInputValueAndCapability({
			value: 3,
			defaultValue: 7,
			min: 0,
			max: 10,
		});
		expect(result.currentValue).toBe(3);
	});

	it('should handle undefined value and defaultValue', () => {
		const result = calculateNumberInputValueAndCapability({
			min: 0,
			max: 10,
		});
		expect(result.currentValue).toBeUndefined();
		expect(result.canIncrement).toBe(true);
		expect(result.canDecrement).toBe(true);
	});

	it('should convert string value to number', () => {
		const result = calculateNumberInputValueAndCapability({
			value: '42',
			min: 0,
			max: 100,
		});
		expect(result.currentValue).toBe(42);
	});

	it('should handle value at max boundary', () => {
		const result = calculateNumberInputValueAndCapability({
			value: 10,
			min: 0,
			max: 10,
		});
		expect(result.currentValue).toBe(10);
		expect(result.canIncrement).toBe(false);
		expect(result.canDecrement).toBe(true);
	});

	it('should handle value at min boundary', () => {
		const result = calculateNumberInputValueAndCapability({
			value: 0,
			min: 0,
			max: 10,
		});
		expect(result.currentValue).toBe(0);
		expect(result.canIncrement).toBe(true);
		expect(result.canDecrement).toBe(false);
	});

	it('should handle no min or max constraints', () => {
		const result = calculateNumberInputValueAndCapability({
			value: 5,
		});
		expect(result.currentValue).toBe(5);
		expect(result.canIncrement).toBe(true);
		expect(result.canDecrement).toBe(true);
	});
});
