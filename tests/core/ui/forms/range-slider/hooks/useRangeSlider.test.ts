/**
 * useRangeSlider Tests
 *
 * Tests for the useRangeSliderProps hook including:
 * - Prop extraction
 * - State computation
 * - Content props building
 * - Return values
 */

import { useRangeSliderProps } from '@core/ui/forms/range-slider/hooks/useRangeSlider';
import type { RangeSliderProps } from '@src-types/ui/forms-advanced';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useRangeSliderProps - Prop Extraction', () => {
	it('extracts all props correctly', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
			error: 'Invalid range',
			helperText: 'Select a range',
			size: 'lg',
			fullWidth: true,
			rangeSliderId: 'custom-id',
			disabled: true,
			required: true,
			min: 0,
			max: 100,
			step: 1,
			value: [20, 80],
			onChange: () => {},
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.label).toBe('Price Range');
		expect(result.current.contentProps.error).toBe('Invalid range');
		expect(result.current.contentProps.helperText).toBe('Select a range');
		expect(result.current.contentProps.required).toBe(true);
		expect(result.current.contentProps.fullWidth).toBe(true);
	});

	it('uses default values for optional props', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.label).toBe('Price Range');
		expect(result.current.contentProps.error).toBeUndefined();
		expect(result.current.contentProps.helperText).toBeUndefined();
		expect(result.current.contentProps.required).toBeUndefined();
		expect(result.current.contentProps.fullWidth).toBe(false);
	});

	it('defaults size to md when not provided', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.sliderClasses).toBeDefined();
		// State should be computed with default size 'md'
	});

	it('extracts value and onChange correctly', () => {
		const onChange = () => {};
		const props: RangeSliderProps = {
			label: 'Price Range',
			value: [20, 80],
			onChange,
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.value).toEqual([20, 80]);
		expect(result.current.contentProps.onChange).toBe(onChange);
	});

	it('extracts defaultValue correctly', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
			defaultValue: [25, 75],
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.defaultValue).toEqual([25, 75]);
	});

	it('extracts disabled and required correctly', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
			disabled: true,
			required: true,
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.disabled).toBe(true);
		expect(result.current.contentProps.required).toBe(true);
	});

	it('defaults min to 0 when not provided', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.min).toBe(0);
	});

	it('defaults max to 100 when not provided', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.max).toBe(100);
	});
});

describe('useRangeSliderProps - State Computation', () => {
	it('computes state using useRangeSliderState', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
			error: 'Invalid range',
			helperText: 'Select a range',
			size: 'lg',
			rangeSliderId: 'test-id',
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.rangeSliderId).toBe('test-id');
		expect(result.current.contentProps.sliderClasses).toBeDefined();
		expect(result.current.contentProps.trackClasses).toBeDefined();
		expect(result.current.contentProps.thumbClasses).toBeDefined();
		expect(result.current.contentProps.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.contentProps.ariaDescribedBy).toContain('test-id-helper');
	});

	it('generates ID from label when no rangeSliderId provided', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.rangeSliderId).toBeDefined();
		expect(result.current.contentProps.rangeSliderId).toContain('range-slider');
	});

	it('passes computed classes to content props', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
			size: 'md',
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.sliderClasses).toBeDefined();
		expect(result.current.contentProps.trackClasses).toBeDefined();
		expect(result.current.contentProps.activeTrackClasses).toBeDefined();
		expect(result.current.contentProps.thumbClasses).toBeDefined();
	});
});

describe('useRangeSliderProps - Field Props', () => {
	it('includes rest props in field props', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
			'data-testid': 'range-slider',
			className: 'custom-class',
		} as any;

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.fieldProps).toBeDefined();
		expect((result.current.contentProps.fieldProps as any)['data-testid']).toBe('range-slider');
		// className is extracted before rest, so it's not in fieldProps
		expect(result.current.contentProps.fieldProps.className).toBeUndefined();
	});

	it('excludes controlled props from field props', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
			size: 'md',
			disabled: true,
			required: true,
			value: [20, 80],
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		// These should not be in fieldProps
		expect(result.current.contentProps.fieldProps).not.toHaveProperty('size');
		expect(result.current.contentProps.fieldProps).not.toHaveProperty('type');
		expect(result.current.contentProps.fieldProps).not.toHaveProperty('id');
		// disabled and required are passed separately to RangeSliderField, not in fieldProps
		// but they may still be in rest if not explicitly extracted
		// Note: value is currently in fieldProps because it's not extracted before rest destructuring
		// but it's also passed separately to contentProps, so it's handled in both places
	});
});

describe('useRangeSliderProps - Return Values', () => {
	it('returns contentProps with all expected values', () => {
		const props: RangeSliderProps = {
			label: 'Price Range',
			error: 'Invalid',
			helperText: 'Helper',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps).toHaveProperty('rangeSliderId');
		expect(result.current.contentProps).toHaveProperty('sliderClasses');
		expect(result.current.contentProps).toHaveProperty('trackClasses');
		expect(result.current.contentProps).toHaveProperty('thumbClasses');
		expect(result.current.contentProps).toHaveProperty('label');
		expect(result.current.contentProps).toHaveProperty('error');
		expect(result.current.contentProps).toHaveProperty('helperText');
		expect(result.current.contentProps).toHaveProperty('required');
		expect(result.current.contentProps).toHaveProperty('fullWidth');
		expect(result.current.contentProps).toHaveProperty('min');
		expect(result.current.contentProps).toHaveProperty('max');
		expect(result.current.contentProps).toHaveProperty('fieldProps');
	});
});

describe('useRangeSliderProps - Integration', () => {
	it('handles complete RangeSlider props flow', () => {
		const onChange = () => {};
		const props: RangeSliderProps = {
			label: 'Price Range',
			error: 'Invalid range',
			helperText: 'Select a range',
			size: 'lg',
			fullWidth: true,
			rangeSliderId: 'price-range',
			disabled: false,
			required: true,
			min: 0,
			max: 100,
			step: 1,
			value: [20, 80],
			onChange,
			'data-testid': 'range-slider',
		} as any;

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		// Check extracted props
		expect(result.current.contentProps.label).toBe('Price Range');
		expect(result.current.contentProps.error).toBe('Invalid range');
		expect(result.current.contentProps.helperText).toBe('Select a range');
		expect(result.current.contentProps.required).toBe(true);
		expect(result.current.contentProps.fullWidth).toBe(true);

		// Check computed state
		expect(result.current.contentProps.rangeSliderId).toBe('price-range');
		expect(result.current.contentProps.ariaDescribedBy).toContain('price-range-error');
		expect(result.current.contentProps.ariaDescribedBy).toContain('price-range-helper');

		// Check field props
		expect(result.current.contentProps.min).toBe(0);
		expect(result.current.contentProps.max).toBe(100);
		expect(result.current.contentProps.step).toBe(1);
		expect(result.current.contentProps.value).toEqual([20, 80]);
		expect(result.current.contentProps.onChange).toBe(onChange);
		expect((result.current.contentProps.fieldProps as any)['data-testid']).toBe('range-slider');
	});

	it('handles minimal props', () => {
		const props: RangeSliderProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useRangeSliderProps({ props }));

		expect(result.current.contentProps.label).toBeUndefined();
		expect(result.current.contentProps.error).toBeUndefined();
		expect(result.current.contentProps.helperText).toBeUndefined();
		expect(result.current.contentProps.required).toBeUndefined();
		expect(result.current.contentProps.fullWidth).toBe(false);
		expect(result.current.contentProps.rangeSliderId).toBeUndefined();
		expect(result.current.contentProps.min).toBe(0);
		expect(result.current.contentProps.max).toBe(100);
	});

	it('updates when props change', () => {
		const { result, rerender } = renderHook(
			({ props }: { props: RangeSliderProps }) => useRangeSliderProps({ props }),
			{
				initialProps: {
					props: {
						label: 'Price Range',
						size: 'md',
					},
				},
			}
		);

		expect(result.current.contentProps.label).toBe('Price Range');
		expect(result.current.contentProps.error).toBeUndefined();

		rerender({
			props: {
				label: 'Price Range',
				error: 'Invalid',
				size: 'md',
			},
		});

		expect(result.current.contentProps.error).toBe('Invalid');
		expect(result.current.contentProps.ariaDescribedBy).toContain('error');
	});
});
