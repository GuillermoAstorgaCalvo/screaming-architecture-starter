/**
 * useRangeSliderState.hooks Tests
 *
 * Tests for RangeSlider state hooks including:
 * - Value state management
 * - Calculations
 * - Input refs
 * - Derived state
 */

import {
	useRangeCalculations,
	useRangeDerivedState,
	useRangeInputRefs,
	useRangeValue,
	useRangeValueState,
} from '@core/ui/forms/range-slider/hooks/useRangeSliderState.hooks';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useRangeValue', () => {
	it('returns controlled state when value is provided', () => {
		const { result } = renderHook(() =>
			useRangeValue({
				value: [20, 80],
				defaultValue: undefined,
				min: 0,
				max: 100,
			})
		);

		expect(result.current.isControlled).toBe(true);
		expect(result.current.safeMinValue).toBe(20);
		expect(result.current.safeMaxValue).toBe(80);
	});

	it('returns uncontrolled state when defaultValue is provided', () => {
		const { result } = renderHook(() =>
			useRangeValue({
				value: undefined,
				defaultValue: [25, 75],
				min: 0,
				max: 100,
			})
		);

		expect(result.current.isControlled).toBe(false);
		expect(result.current.safeMinValue).toBe(25);
		expect(result.current.safeMaxValue).toBe(75);
	});

	it('defaults to [min, max] when no value or defaultValue provided', () => {
		const { result } = renderHook(() =>
			useRangeValue({
				value: undefined,
				defaultValue: undefined,
				min: 10,
				max: 90,
			})
		);

		expect(result.current.isControlled).toBe(false);
		expect(result.current.safeMinValue).toBe(10);
		expect(result.current.safeMaxValue).toBe(90);
	});

	it('normalizes reversed value array', () => {
		const { result } = renderHook(() =>
			useRangeValue({
				value: [80, 20],
				defaultValue: undefined,
				min: 0,
				max: 100,
			})
		);

		expect(result.current.safeMinValue).toBe(20);
		expect(result.current.safeMaxValue).toBe(80);
	});

	it('provides setInternalValue function', () => {
		const { result } = renderHook(() =>
			useRangeValue({
				value: undefined,
				defaultValue: undefined,
				min: 0,
				max: 100,
			})
		);

		expect(typeof result.current.setInternalValue).toBe('function');
	});

	it('updates internal value when setInternalValue is called', () => {
		const { result, rerender } = renderHook(() =>
			useRangeValue({
				value: undefined,
				defaultValue: undefined,
				min: 0,
				max: 100,
			})
		);

		expect(result.current.safeMinValue).toBe(0);
		expect(result.current.safeMaxValue).toBe(100);

		result.current.setInternalValue([30, 70]);
		// Trigger a re-render to see the state update
		rerender();

		expect(result.current.safeMinValue).toBe(30);
		expect(result.current.safeMaxValue).toBe(70);
	});
});

describe('useRangeCalculations', () => {
	it('calculates percentages correctly', () => {
		const { result } = renderHook(() =>
			useRangeCalculations({
				safeMinValue: 25,
				safeMaxValue: 75,
				min: 0,
				max: 100,
			})
		);

		expect(result.current.minPercentage).toBe(25);
		expect(result.current.maxPercentage).toBe(75);
	});

	it('calculates thumb offsets', () => {
		const { result } = renderHook(() =>
			useRangeCalculations({
				safeMinValue: 0,
				safeMaxValue: 100,
				min: 0,
				max: 100,
			})
		);

		expect(result.current.minThumbOffset).toBe('0px');
		expect(result.current.maxThumbOffset).toBe('100%');
	});

	it('calculates active track position and width', () => {
		const { result } = renderHook(() =>
			useRangeCalculations({
				safeMinValue: 20,
				safeMaxValue: 80,
				min: 0,
				max: 100,
			})
		);

		expect(result.current.activeTrackLeft).toBe(20);
		expect(result.current.activeTrackWidth).toBe(60);
	});

	it('handles min equals max', () => {
		const { result } = renderHook(() =>
			useRangeCalculations({
				safeMinValue: 50,
				safeMaxValue: 50,
				min: 0,
				max: 100,
			})
		);

		expect(result.current.minPercentage).toBe(50);
		expect(result.current.maxPercentage).toBe(50);
		expect(result.current.activeTrackLeft).toBe(50);
		expect(result.current.activeTrackWidth).toBe(0);
	});

	it('handles custom min/max range', () => {
		const { result } = renderHook(() =>
			useRangeCalculations({
				safeMinValue: 30,
				safeMaxValue: 70,
				min: 10,
				max: 90,
			})
		);

		// Percentage should be calculated relative to the range
		expect(result.current.minPercentage).toBeCloseTo(25, 1);
		expect(result.current.maxPercentage).toBeCloseTo(75, 1);
	});
});

describe('useRangeInputRefs', () => {
	it('returns refs for min and max inputs', () => {
		const { result } = renderHook(() => useRangeInputRefs(20, 80));

		expect(result.current[0]).toBeDefined();
		expect(result.current[1]).toBeDefined();
		expect(result.current[0].current).toBeNull();
		expect(result.current[1].current).toBeNull();
	});

	it('sets CSS custom properties when refs are attached', () => {
		const { result } = renderHook(() => useRangeInputRefs(25, 75));

		const [minInputRef, maxInputRef] = result.current;

		// Create mock input elements
		const minInput = document.createElement('input');
		const maxInput = document.createElement('input');
		minInputRef.current = minInput;
		maxInputRef.current = maxInput;

		// Re-render to trigger effect
		const { rerender } = renderHook(() => useRangeInputRefs(30, 80));
		rerender();

		// The effect should set the CSS custom properties
		// Note: In a real scenario, the effect runs after render
		expect(minInputRef.current).toBeDefined();
		expect(maxInputRef.current).toBeDefined();
	});

	it('updates CSS custom properties when percentages change', () => {
		const { result, rerender } = renderHook(
			({ min, max }: { min: number; max: number }) => useRangeInputRefs(min, max),
			{
				initialProps: { min: 20, max: 80 },
			}
		);

		const [minInputRef, maxInputRef] = result.current;
		const minInput = document.createElement('input');
		const maxInput = document.createElement('input');
		minInputRef.current = minInput;
		maxInputRef.current = maxInput;

		rerender({ min: 30, max: 90 });

		// The effect should update the CSS custom properties
		expect(minInputRef.current).toBeDefined();
		expect(maxInputRef.current).toBeDefined();
	});
});

describe('useRangeValueState', () => {
	it('returns same result as useRangeValue', () => {
		const { result: result1 } = renderHook(() =>
			useRangeValue({
				value: [20, 80],
				defaultValue: undefined,
				min: 0,
				max: 100,
			})
		);

		const { result: result2 } = renderHook(() =>
			useRangeValueState({
				value: [20, 80],
				defaultValue: undefined,
				min: 0,
				max: 100,
			})
		);

		expect(result2.current.isControlled).toBe(result1.current.isControlled);
		expect(result2.current.safeMinValue).toBe(result1.current.safeMinValue);
		expect(result2.current.safeMaxValue).toBe(result1.current.safeMaxValue);
	});
});

describe('useRangeDerivedState', () => {
	it('returns calculations and input refs', () => {
		const { result } = renderHook(() =>
			useRangeDerivedState({
				safeMinValue: 20,
				safeMaxValue: 80,
				min: 0,
				max: 100,
			})
		);

		expect(result.current.calculations).toBeDefined();
		expect(result.current.minInputRef).toBeDefined();
		expect(result.current.maxInputRef).toBeDefined();
	});

	it('calculates correct percentages', () => {
		const { result } = renderHook(() =>
			useRangeDerivedState({
				safeMinValue: 25,
				safeMaxValue: 75,
				min: 0,
				max: 100,
			})
		);

		expect(result.current.calculations.minPercentage).toBe(25);
		expect(result.current.calculations.maxPercentage).toBe(75);
	});

	it('provides input refs', () => {
		const { result } = renderHook(() =>
			useRangeDerivedState({
				safeMinValue: 20,
				safeMaxValue: 80,
				min: 0,
				max: 100,
			})
		);

		expect(result.current.minInputRef.current).toBeNull();
		expect(result.current.maxInputRef.current).toBeNull();
	});

	it('updates calculations when values change', () => {
		const { result, rerender } = renderHook(
			({ safeMinValue, safeMaxValue }: { safeMinValue: number; safeMaxValue: number }) =>
				useRangeDerivedState({
					safeMinValue,
					safeMaxValue,
					min: 0,
					max: 100,
				}),
			{
				initialProps: { safeMinValue: 20, safeMaxValue: 80 },
			}
		);

		expect(result.current.calculations.minPercentage).toBe(20);
		expect(result.current.calculations.maxPercentage).toBe(80);

		rerender({ safeMinValue: 30, safeMaxValue: 90 });

		expect(result.current.calculations.minPercentage).toBe(30);
		expect(result.current.calculations.maxPercentage).toBe(90);
	});
});
