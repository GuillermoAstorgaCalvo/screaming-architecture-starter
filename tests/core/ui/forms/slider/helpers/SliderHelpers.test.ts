/**
 * SliderHelpers Tests
 *
 * Tests for Slider helper functions including:
 * - Class generation
 * - ID generation
 * - ARIA attributes
 * - Percentage calculations
 */

import {
	calculatePercentage,
	generateSliderId,
	getAriaDescribedBy,
	getSliderClasses,
	getSliderThumbClasses,
	getSliderTrackClasses,
} from '@core/ui/forms/slider/helpers/SliderHelpers';
import { describe, expect, it } from 'vitest';

describe('getSliderClasses', () => {
	it('returns base classes with size', () => {
		const classes = getSliderClasses({ size: 'sm' });
		expect(classes).toContain('relative');
		expect(classes).toContain('w-full');
		expect(classes).toContain('h-1');
	});

	it('returns md size classes', () => {
		const classes = getSliderClasses({ size: 'md' });
		expect(classes).toContain('h-2');
	});

	it('returns lg size classes', () => {
		const classes = getSliderClasses({ size: 'lg' });
		expect(classes).toContain('h-3');
	});

	it('merges custom className', () => {
		const classes = getSliderClasses({ size: 'md', className: 'custom-class' });
		expect(classes).toContain('custom-class');
		expect(classes).toContain('h-2');
	});
});

describe('getSliderTrackClasses', () => {
	it('returns base classes with sm size', () => {
		const classes = getSliderTrackClasses({ size: 'sm' });
		expect(classes).toContain('absolute');
		expect(classes).toContain('top-1/2');
		expect(classes).toContain('-translate-y-1/2');
		expect(classes).toContain('w-full');
		expect(classes).toContain('rounded-full');
		expect(classes).toContain('bg-muted');
		expect(classes).toContain('h-1');
	});

	it('returns md size classes', () => {
		const classes = getSliderTrackClasses({ size: 'md' });
		expect(classes).toContain('h-2');
	});

	it('returns lg size classes', () => {
		const classes = getSliderTrackClasses({ size: 'lg' });
		expect(classes).toContain('h-3');
	});
});

describe('getSliderThumbClasses', () => {
	it('returns base classes with sm size', () => {
		const classes = getSliderThumbClasses({ size: 'sm' });
		expect(classes).toContain('absolute');
		expect(classes).toContain('top-1/2');
		expect(classes).toContain('-translate-y-1/2');
		expect(classes).toContain('rounded-full');
		expect(classes).toContain('bg-primary');
		expect(classes).toContain('cursor-pointer');
		expect(classes).toContain('h-3');
		expect(classes).toContain('w-3');
	});

	it('returns md size classes', () => {
		const classes = getSliderThumbClasses({ size: 'md' });
		expect(classes).toContain('h-4');
		expect(classes).toContain('w-4');
	});

	it('returns lg size classes', () => {
		const classes = getSliderThumbClasses({ size: 'lg' });
		expect(classes).toContain('h-5');
		expect(classes).toContain('w-5');
	});

	it('ignores value, min, and max parameters', () => {
		const classes1 = getSliderThumbClasses({ size: 'md' });
		const classes2 = getSliderThumbClasses({
			size: 'md',
			value: 50,
			min: 0,
			max: 100,
		});
		expect(classes1).toBe(classes2);
	});
});

describe('getAriaDescribedBy', () => {
	it('returns undefined when no error or helperText', () => {
		const result = getAriaDescribedBy('test-id');
		expect(result).toBeUndefined();
	});

	it('returns error ID when error exists', () => {
		const result = getAriaDescribedBy('test-id', 'Invalid value');
		expect(result).toBe('test-id-error');
	});

	it('returns helper ID when helperText exists', () => {
		const result = getAriaDescribedBy('test-id', undefined, 'Select a value');
		expect(result).toBe('test-id-helper');
	});

	it('returns both IDs when error and helperText exist', () => {
		const result = getAriaDescribedBy('test-id', 'Invalid value', 'Select a value');
		expect(result).toBe('test-id-error test-id-helper');
	});
});

describe('generateSliderId', () => {
	it('returns provided sliderId when given', () => {
		const result = generateSliderId('generated-id', 'custom-id');
		expect(result).toBe('custom-id');
	});

	it('returns provided sliderId even when label exists', () => {
		const result = generateSliderId('generated-id', 'custom-id', 'Volume');
		expect(result).toBe('custom-id');
	});

	it('generates id from label when sliderId is not provided', () => {
		const generatedId = 'r1:abc';
		const result = generateSliderId(generatedId, undefined, 'Volume');
		expect(result).toBe('slider-r1abc');
	});

	it('removes colons from generatedId', () => {
		const generatedId = 'r1:abc:def';
		const result = generateSliderId(generatedId, undefined, 'Volume');
		expect(result).toBe('slider-r1abcdef');
	});

	it('returns undefined when neither sliderId nor label is provided', () => {
		const result = generateSliderId('generated-id');
		expect(result).toBeUndefined();
	});
});

describe('calculatePercentage', () => {
	it('calculates percentage correctly', () => {
		expect(calculatePercentage(50, 0, 100)).toBe(50);
		expect(calculatePercentage(25, 0, 100)).toBe(25);
		expect(calculatePercentage(75, 0, 100)).toBe(75);
	});

	it('handles min equals max', () => {
		expect(calculatePercentage(50, 50, 50)).toBe(0);
	});

	it('handles value at min', () => {
		expect(calculatePercentage(0, 0, 100)).toBe(0);
	});

	it('handles value at max', () => {
		expect(calculatePercentage(100, 0, 100)).toBe(100);
	});

	it('handles custom min/max range', () => {
		expect(calculatePercentage(60, 20, 80)).toBeCloseTo(66.67, 1);
		expect(calculatePercentage(30, 10, 50)).toBe(50);
	});

	it('handles negative ranges', () => {
		expect(calculatePercentage(-50, -100, 0)).toBe(50);
		expect(calculatePercentage(-25, -100, 0)).toBe(75);
	});

	it('handles value below min', () => {
		expect(calculatePercentage(-10, 0, 100)).toBe(-10);
	});

	it('handles value above max', () => {
		expect(calculatePercentage(150, 0, 100)).toBe(150);
	});
});
