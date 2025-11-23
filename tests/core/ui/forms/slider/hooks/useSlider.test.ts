/**
 * useSlider Hook Tests
 *
 * Tests for the useSlider hook including:
 * - Props processing
 * - State computation
 * - ID generation
 * - Class generation
 * - ARIA attributes
 * - Props forwarding
 */

import { useSliderProps } from '@core/ui/forms/slider/hooks/useSlider';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

const createSliderProps = (overrides?: Partial<Parameters<typeof useSliderProps>[0]['props']>) => ({
	min: 0,
	max: 100,
	...overrides,
});

describe('useSliderProps - Basic Props', () => {
	it('processes basic props correctly', () => {
		const props = createSliderProps();
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps).toBeDefined();
		expect(result.current.contentProps.min).toBe(0);
		expect(result.current.contentProps.max).toBe(100);
		expect(result.current.contentProps.fullWidth).toBe(false);
	});

	it('processes custom min and max', () => {
		const props = createSliderProps({ min: 10, max: 90 });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.min).toBe(10);
		expect(result.current.contentProps.max).toBe(90);
	});

	it('processes step prop', () => {
		const props = createSliderProps({ step: 5 });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.step).toBe(5);
	});

	it('processes value prop', () => {
		const props = createSliderProps({ value: 50 });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.value).toBe(50);
	});

	it('processes defaultValue prop', () => {
		const props = createSliderProps({ defaultValue: 75 });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.defaultValue).toBe(75);
	});

	it('processes disabled prop', () => {
		const props = createSliderProps({ disabled: true });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.disabled).toBe(true);
	});

	it('processes required prop', () => {
		const props = createSliderProps({ required: true });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.required).toBe(true);
	});
});

describe('useSliderProps - Size Variants', () => {
	it('uses md as default size', () => {
		const props = createSliderProps();
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.sliderClasses).toContain('h-2');
		expect(result.current.contentProps.trackClasses).toContain('h-2');
		expect(result.current.contentProps.thumbClasses).toContain('h-4');
		expect(result.current.contentProps.thumbClasses).toContain('w-4');
	});

	it('processes sm size', () => {
		const props = createSliderProps({ size: 'sm' });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.sliderClasses).toContain('h-1');
		expect(result.current.contentProps.trackClasses).toContain('h-1');
		expect(result.current.contentProps.thumbClasses).toContain('h-3');
		expect(result.current.contentProps.thumbClasses).toContain('w-3');
	});

	it('processes lg size', () => {
		const props = createSliderProps({ size: 'lg' });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.sliderClasses).toContain('h-3');
		expect(result.current.contentProps.trackClasses).toContain('h-3');
		expect(result.current.contentProps.thumbClasses).toContain('h-5');
		expect(result.current.contentProps.thumbClasses).toContain('w-5');
	});
});

describe('useSliderProps - ID Generation', () => {
	it('uses provided sliderId', () => {
		const props = createSliderProps({ sliderId: 'custom-id' });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.sliderId).toBe('custom-id');
	});

	it('generates id when label is provided but sliderId is not', () => {
		const props = createSliderProps({ label: 'Volume' });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.sliderId).toBeDefined();
		expect(result.current.contentProps.sliderId).toContain('slider-');
	});

	it('returns undefined when neither label nor sliderId is provided', () => {
		const props = createSliderProps();
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.sliderId).toBeUndefined();
	});

	it('prioritizes sliderId over label', () => {
		const props = createSliderProps({ sliderId: 'custom-id', label: 'Volume' });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.sliderId).toBe('custom-id');
	});
});

describe('useSliderProps - ARIA Attributes', () => {
	it('generates ariaDescribedBy when error exists', () => {
		const props = createSliderProps({
			sliderId: 'test-id',
			error: 'Invalid value',
		});
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.ariaDescribedBy).toBe('test-id-error');
	});

	it('generates ariaDescribedBy when helperText exists', () => {
		const props = createSliderProps({
			sliderId: 'test-id',
			helperText: 'Select a value',
		});
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.ariaDescribedBy).toBe('test-id-helper');
	});

	it('generates ariaDescribedBy when both error and helperText exist', () => {
		const props = createSliderProps({
			sliderId: 'test-id',
			error: 'Invalid value',
			helperText: 'Select a value',
		});
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.ariaDescribedBy).toBe('test-id-error test-id-helper');
	});

	it('returns undefined ariaDescribedBy when no error or helperText', () => {
		const props = createSliderProps({ sliderId: 'test-id' });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.ariaDescribedBy).toBeUndefined();
	});

	it('returns undefined ariaDescribedBy when sliderId is undefined', () => {
		const props = createSliderProps({
			error: 'Invalid value',
			helperText: 'Select a value',
		});
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.ariaDescribedBy).toBeUndefined();
	});
});

describe('useSliderProps - Label and Messages', () => {
	it('forwards label prop', () => {
		const props = createSliderProps({ label: 'Volume' });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.label).toBe('Volume');
	});

	it('forwards error prop', () => {
		const props = createSliderProps({ error: 'Invalid value' });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.error).toBe('Invalid value');
	});

	it('forwards helperText prop', () => {
		const props = createSliderProps({ helperText: 'Select a value' });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.helperText).toBe('Select a value');
	});
});

describe('useSliderProps - Full Width', () => {
	it('processes fullWidth prop as true', () => {
		const props = createSliderProps({ fullWidth: true });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.fullWidth).toBe(true);
	});

	it('processes fullWidth prop as false', () => {
		const props = createSliderProps({ fullWidth: false });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.fullWidth).toBe(false);
	});

	it('defaults fullWidth to false when not provided', () => {
		const props = createSliderProps();
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.fullWidth).toBe(false);
	});
});

describe('useSliderProps - Custom ClassName', () => {
	it('merges custom className with size classes', () => {
		const props = createSliderProps({ className: 'custom-class', size: 'md' });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.sliderClasses).toContain('custom-class');
		expect(result.current.contentProps.sliderClasses).toContain('h-2');
	});
});

describe('useSliderProps - Additional Props Forwarding', () => {
	it('forwards additional props to fieldProps', () => {
		const props = createSliderProps({
			'data-testid': 'slider-input',
		} as any);
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.fieldProps).toBeDefined();
		expect((result.current.contentProps.fieldProps as any)['data-testid']).toBe('slider-input');
		// Note: className is extracted and used for the slider wrapper, not passed to fieldProps
	});

	it('excludes known props from fieldProps', () => {
		const props = createSliderProps({
			label: 'Volume',
			error: 'Invalid',
			helperText: 'Select',
			size: 'md',
			fullWidth: true,
			sliderId: 'test-id',
			min: 0,
			max: 100,
			step: 1,
			value: 50,
			disabled: true,
			required: true,
		});
		const { result } = renderHook(() => useSliderProps({ props }));

		const { fieldProps } = result.current.contentProps;
		expect((fieldProps as any).label).toBeUndefined();
		expect((fieldProps as any).error).toBeUndefined();
		expect((fieldProps as any).helperText).toBeUndefined();
		expect((fieldProps as any).size).toBeUndefined();
		expect((fieldProps as any).sliderId).toBeUndefined();
		expect(fieldProps.className).toBeUndefined();
		expect(fieldProps.min).toBeUndefined();
		expect(fieldProps.max).toBeUndefined();
		expect(fieldProps.value).toBeUndefined();
	});
});

describe('useSliderProps - Thumb Classes with Value', () => {
	it('generates thumb classes with value at min', () => {
		const props = createSliderProps({ value: 0, min: 0, max: 100 });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.thumbClasses).toBeDefined();
		expect(result.current.contentProps.thumbClasses).toContain('h-4');
	});

	it('generates thumb classes with value at max', () => {
		const props = createSliderProps({ value: 100, min: 0, max: 100 });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.thumbClasses).toBeDefined();
		expect(result.current.contentProps.thumbClasses).toContain('h-4');
	});

	it('generates thumb classes with value in middle', () => {
		const props = createSliderProps({ value: 50, min: 0, max: 100 });
		const { result } = renderHook(() => useSliderProps({ props }));

		expect(result.current.contentProps.thumbClasses).toBeDefined();
		expect(result.current.contentProps.thumbClasses).toContain('h-4');
	});
});
