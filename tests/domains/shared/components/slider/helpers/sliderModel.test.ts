/**
 * sliderModel Tests
 *
 * Tests for slider model helper functions:
 * - clampValue
 * - getRange
 * - getPercentage
 * - buildSliderModel
 */

import {
	buildSliderModel,
	clampValue,
	getPercentage,
	getRange,
} from '@domains/shared/components/slider/helpers/sliderModel';
import type { SliderModelArgs } from '@domains/shared/components/slider/types/slider.types';
import { describe, expect, it, vi } from 'vitest';

const NEGATIVE_MIN_VALUE = -100;
const NEGATIVE_MAX_VALUE = 0;
const NEGATIVE_TEST_VALUE = -50;

describe('clampValue', () => {
	it('returns value when within range', () => {
		expect(clampValue(50, 0, 100)).toBe(50);
	});

	it('clamps value to minimum', () => {
		expect(clampValue(-10, 0, 100)).toBe(0);
	});

	it('clamps value to maximum', () => {
		expect(clampValue(150, 0, 100)).toBe(100);
	});

	it('handles value at minimum boundary', () => {
		expect(clampValue(0, 0, 100)).toBe(0);
	});

	it('handles value at maximum boundary', () => {
		expect(clampValue(100, 0, 100)).toBe(100);
	});

	it('handles negative range for clampValue', () => {
		expect(clampValue(NEGATIVE_TEST_VALUE, NEGATIVE_MIN_VALUE, NEGATIVE_MAX_VALUE)).toBe(
			NEGATIVE_TEST_VALUE
		);
	});

	it('clamps negative value to minimum', () => {
		expect(clampValue(-150, NEGATIVE_MIN_VALUE, NEGATIVE_MAX_VALUE)).toBe(NEGATIVE_MIN_VALUE);
	});

	it('handles zero range', () => {
		expect(clampValue(50, 0, 0)).toBe(0);
	});
});

describe('getRange', () => {
	it('calculates range correctly', () => {
		expect(getRange(0, 100)).toBe(100);
	});

	it('handles negative range for getRange', () => {
		expect(getRange(NEGATIVE_MIN_VALUE, NEGATIVE_MAX_VALUE)).toBe(100);
	});

	it('returns minimum delta for zero range', () => {
		expect(getRange(50, 50)).toBeGreaterThan(0);
		expect(getRange(50, 50)).toBeLessThanOrEqual(0.0001);
	});

	it('handles very small range', () => {
		const range = getRange(0, 0.00005);
		expect(range).toBeGreaterThanOrEqual(0.0001);
	});

	it('handles large range', () => {
		expect(getRange(0, 1000)).toBe(1000);
	});
});

describe('getPercentage', () => {
	it('calculates percentage correctly', () => {
		expect(getPercentage(50, 0, 100)).toBe(50);
	});

	it('calculates percentage at minimum', () => {
		expect(getPercentage(0, 0, 100)).toBe(0);
	});

	it('calculates percentage at maximum', () => {
		expect(getPercentage(100, 0, 100)).toBe(100);
	});

	it('calculates percentage at midpoint', () => {
		expect(getPercentage(50, 0, 100)).toBe(50);
	});

	it('handles negative values', () => {
		// value: -50, min: -100, range: 200 (from -100 to 100)
		// percentage = ((-50) - (-100)) / 200 * 100 = 50 / 200 * 100 = 25
		expect(getPercentage(NEGATIVE_TEST_VALUE, NEGATIVE_MIN_VALUE, 200)).toBe(25);
	});

	it('handles offset minimum', () => {
		expect(getPercentage(75, 50, 50)).toBe(50);
	});

	it('handles decimal values', () => {
		const percentage = getPercentage(25.5, 0, 100);
		expect(percentage).toBe(25.5);
	});
});

const baseArgs: SliderModelArgs = {
	sliderId: 'test-slider',
	value: 50,
	min: 0,
	max: 100,
	step: 1,
	helperText: undefined,
	formatValue: undefined,
	marks: undefined,
	disabled: undefined,
	onChange: vi.fn(),
	inputProps: {},
	className: undefined,
	label: undefined,
	showValue: false,
};

describe('buildSliderModel - basic props and value handling', () => {
	it('builds model with basic props', () => {
		const result = buildSliderModel(baseArgs);

		expect(result.sliderId).toBe('test-slider');
		expect(result.sliderInputProps.value).toBe(50);
		expect(result.sliderInputProps.min).toBe(0);
		expect(result.sliderInputProps.max).toBe(100);
		expect(result.sliderInputProps.step).toBe(1);
	});

	it('clamps value to min/max', () => {
		const args = { ...baseArgs, value: 150 };
		const result = buildSliderModel(args);

		expect(result.sliderInputProps.value).toBe(100);
	});

	it('handles value at minimum boundary', () => {
		const args = { ...baseArgs, value: 0 };
		const result = buildSliderModel(args);

		expect(result.sliderInputProps.value).toBe(0);
		expect(result.sliderInputProps.percentage).toBe(0);
	});

	it('handles value at maximum boundary', () => {
		const args = { ...baseArgs, value: 100 };
		const result = buildSliderModel(args);

		expect(result.sliderInputProps.value).toBe(100);
		expect(result.sliderInputProps.percentage).toBe(100);
	});
});

describe('buildSliderModel - helper text', () => {
	it('generates helperId when helperText is provided', () => {
		const args = { ...baseArgs, helperText: 'Helper text' };
		const result = buildSliderModel(args);

		expect(result.helperId).toBe('test-slider-helper');
		expect(result.helperText).toBe('Helper text');
	});

	it('does not generate helperId when helperText is undefined', () => {
		const result = buildSliderModel(baseArgs);

		expect(result.helperId).toBeUndefined();
	});
});

describe('buildSliderModel - value formatting', () => {
	it('formats value with formatValue function', () => {
		const formatValue = (value: number) => `${value}%`;
		const args = { ...baseArgs, formatValue, showValue: true };
		const result = buildSliderModel(args);

		expect(result.formattedValue).toBe('50%');
	});

	it('uses default formatting when formatValue is not provided', () => {
		const args = { ...baseArgs, showValue: true };
		const result = buildSliderModel(args);

		expect(result.formattedValue).toBe('50');
	});
});

describe('buildSliderModel - marks handling', () => {
	it('generates marksId when marks are provided', () => {
		const marks = [
			{ value: 0, label: 'Min' },
			{ value: 50, label: 'Mid' },
			{ value: 100, label: 'Max' },
		];
		const args = { ...baseArgs, marks };
		const result = buildSliderModel(args);

		expect(result.sliderMarksProps.marksId).toBe('test-slider-marks');
		expect(result.sliderMarksProps.marks).toEqual(marks);
	});

	it('does not generate marksId when marks are empty', () => {
		const args = { ...baseArgs, marks: [] };
		const result = buildSliderModel(args);

		expect(result.sliderMarksProps.marksId).toBeUndefined();
	});

	it('does not generate marksId when marks are undefined', () => {
		const result = buildSliderModel(baseArgs);

		expect(result.sliderMarksProps.marksId).toBeUndefined();
	});

	it('calculates range correctly for marks', () => {
		const marks = [
			{ value: 0, label: 'Min' },
			{ value: 100, label: 'Max' },
		];
		const args = { ...baseArgs, marks, min: 0, max: 100 };
		const result = buildSliderModel(args);

		expect(result.sliderMarksProps.range).toBe(100);
		expect(result.sliderMarksProps.min).toBe(0);
	});

	it('handles marks with labels', () => {
		const marks = [{ value: 0, label: 'Min' }, { value: 50 }, { value: 100, label: 'Max' }];
		const args = { ...baseArgs, marks };
		const result = buildSliderModel(args);

		expect(result.sliderMarksProps.marks).toEqual(marks);
	});
});

describe('buildSliderModel - props forwarding', () => {
	it('handles disabled state', () => {
		const args = { ...baseArgs, disabled: true };
		const result = buildSliderModel(args);

		expect(result.sliderInputProps.disabled).toBe(true);
	});

	it('handles undefined disabled state', () => {
		const result = buildSliderModel(baseArgs);

		expect(result.sliderInputProps.disabled).toBeUndefined();
	});

	it('forwards inputProps', () => {
		const inputProps = { 'data-testid': 'slider-input', className: 'custom-input' };
		const args = { ...baseArgs, inputProps };
		const result = buildSliderModel(args);

		expect(result.sliderInputProps.inputProps).toEqual(inputProps);
	});

	it('forwards className', () => {
		const args = { ...baseArgs, className: 'custom-slider' };
		const result = buildSliderModel(args);

		expect(result.className).toBe('custom-slider');
	});

	it('forwards label', () => {
		const args = { ...baseArgs, label: 'Volume' };
		const result = buildSliderModel(args);

		expect(result.label).toBe('Volume');
	});

	it('forwards showValue', () => {
		const args = { ...baseArgs, showValue: true };
		const result = buildSliderModel(args);

		expect(result.showValue).toBe(true);
	});

	it('handles onChange callback', () => {
		const onChange = vi.fn();
		const args = { ...baseArgs, onChange };
		const result = buildSliderModel(args);

		expect(result.sliderInputProps.onChange).toBe(onChange);
	});
});

describe('buildSliderModel - percentage calculation', () => {
	it('calculates percentage correctly', () => {
		const args = { ...baseArgs, value: 25 };
		const result = buildSliderModel(args);

		expect(result.sliderInputProps.percentage).toBe(25);
	});
});

describe('buildSliderModel - edge cases', () => {
	it('handles negative range for buildSliderModel', () => {
		const args = {
			...baseArgs,
			value: NEGATIVE_TEST_VALUE,
			min: NEGATIVE_MIN_VALUE,
			max: NEGATIVE_MAX_VALUE,
		};
		const result = buildSliderModel(args);

		expect(result.sliderInputProps.value).toBe(NEGATIVE_TEST_VALUE);
		expect(result.sliderInputProps.min).toBe(NEGATIVE_MIN_VALUE);
		expect(result.sliderInputProps.max).toBe(NEGATIVE_MAX_VALUE);
	});

	it('handles decimal step values', () => {
		const args = { ...baseArgs, step: 0.1, value: 50.5 };
		const result = buildSliderModel(args);

		expect(result.sliderInputProps.step).toBe(0.1);
		expect(result.sliderInputProps.value).toBe(50.5);
	});
});
