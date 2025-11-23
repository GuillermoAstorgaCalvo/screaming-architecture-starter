/**
 * RangeSliderHelpers Tests
 *
 * Tests for RangeSlider helper functions including:
 * - Class generation
 * - ID generation
 * - ARIA attributes
 * - Percentage calculations
 * - Value clamping
 */

import {
	calculatePercentage,
	clampValue,
	generateRangeSliderId,
	getAriaDescribedBy,
	getRangeSliderActiveTrackClasses,
	getRangeSliderClasses,
	getRangeSliderThumbClasses,
	getRangeSliderTrackClasses,
	getThumbOffset,
} from '@core/ui/forms/range-slider/helpers/RangeSliderHelpers';
import { describe, expect, it } from 'vitest';

describe('getRangeSliderClasses', () => {
	it('returns base classes with size', () => {
		const classes = getRangeSliderClasses({ size: 'sm' });
		expect(classes).toContain('relative');
		expect(classes).toContain('w-full');
		expect(classes).toContain('h-1');
	});

	it('returns md size classes', () => {
		const classes = getRangeSliderClasses({ size: 'md' });
		expect(classes).toContain('h-2');
	});

	it('returns lg size classes', () => {
		const classes = getRangeSliderClasses({ size: 'lg' });
		expect(classes).toContain('h-3');
	});

	it('merges custom className', () => {
		const classes = getRangeSliderClasses({ size: 'md', className: 'custom-class' });
		expect(classes).toContain('custom-class');
		expect(classes).toContain('h-2');
	});
});

describe('getRangeSliderTrackClasses', () => {
	it('returns track classes with size', () => {
		const classes = getRangeSliderTrackClasses({ size: 'sm' });
		expect(classes).toContain('absolute');
		expect(classes).toContain('bg-muted');
		expect(classes).toContain('h-1');
	});

	it('returns md size track classes', () => {
		const classes = getRangeSliderTrackClasses({ size: 'md' });
		expect(classes).toContain('h-2');
	});

	it('returns lg size track classes', () => {
		const classes = getRangeSliderTrackClasses({ size: 'lg' });
		expect(classes).toContain('h-3');
	});
});

describe('getRangeSliderActiveTrackClasses', () => {
	it('returns active track classes with size', () => {
		const classes = getRangeSliderActiveTrackClasses({ size: 'sm' });
		expect(classes).toContain('absolute');
		expect(classes).toContain('bg-primary');
		expect(classes).toContain('h-1');
	});

	it('returns md size active track classes', () => {
		const classes = getRangeSliderActiveTrackClasses({ size: 'md' });
		expect(classes).toContain('h-2');
	});

	it('returns lg size active track classes', () => {
		const classes = getRangeSliderActiveTrackClasses({ size: 'lg' });
		expect(classes).toContain('h-3');
	});
});

describe('getRangeSliderThumbClasses', () => {
	it('returns thumb classes with size', () => {
		const classes = getRangeSliderThumbClasses({ size: 'sm' });
		expect(classes).toContain('absolute');
		expect(classes).toContain('bg-primary');
		expect(classes).toContain('h-3');
		expect(classes).toContain('w-3');
	});

	it('returns md size thumb classes', () => {
		const classes = getRangeSliderThumbClasses({ size: 'md' });
		expect(classes).toContain('h-4');
		expect(classes).toContain('w-4');
	});

	it('returns lg size thumb classes', () => {
		const classes = getRangeSliderThumbClasses({ size: 'lg' });
		expect(classes).toContain('h-5');
		expect(classes).toContain('w-5');
	});
});

describe('getAriaDescribedBy', () => {
	it('returns undefined when no error or helper text', () => {
		const result = getAriaDescribedBy('test-id');
		expect(result).toBeUndefined();
	});

	it('returns error ID when error exists', () => {
		const result = getAriaDescribedBy('test-id', 'Error message');
		expect(result).toBe('test-id-error');
	});

	it('returns helper ID when helper text exists', () => {
		const result = getAriaDescribedBy('test-id', undefined, 'Helper text');
		expect(result).toBe('test-id-helper');
	});

	it('returns both IDs when both exist', () => {
		const result = getAriaDescribedBy('test-id', 'Error message', 'Helper text');
		expect(result).toBe('test-id-error test-id-helper');
	});
});

describe('generateRangeSliderId', () => {
	it('returns provided rangeSliderId when given', () => {
		const result = generateRangeSliderId('generated-id', 'custom-id', 'Label');
		expect(result).toBe('custom-id');
	});

	it('returns undefined when no label and no rangeSliderId', () => {
		const result = generateRangeSliderId('generated-id', undefined, undefined);
		expect(result).toBeUndefined();
	});

	it('generates ID from label when no rangeSliderId provided', () => {
		const result = generateRangeSliderId(':r1:', undefined, 'Price Range');
		expect(result).toBe('range-slider-r1');
	});

	it('removes colons from generated ID', () => {
		const result = generateRangeSliderId(':r1:abc:', undefined, 'Label');
		expect(result).toBe('range-slider-r1abc');
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
});

describe('getThumbOffset', () => {
	it('returns 0px for 0%', () => {
		expect(getThumbOffset(0)).toBe('0px');
	});

	it('returns 100% for 100%', () => {
		expect(getThumbOffset(100)).toBe('100%');
	});

	it('returns 50% for other percentages', () => {
		expect(getThumbOffset(25)).toBe('50%');
		expect(getThumbOffset(50)).toBe('50%');
		expect(getThumbOffset(75)).toBe('50%');
		expect(getThumbOffset(1)).toBe('50%');
		expect(getThumbOffset(99)).toBe('50%');
	});
});

describe('clampValue', () => {
	it('clamps value to min when below min', () => {
		expect(clampValue(-10, 0, 100)).toBe(0);
		expect(clampValue(5, 10, 100)).toBe(10);
	});

	it('clamps value to max when above max', () => {
		expect(clampValue(150, 0, 100)).toBe(100);
		expect(clampValue(95, 0, 90)).toBe(90);
	});

	it('returns value when within range', () => {
		expect(clampValue(50, 0, 100)).toBe(50);
		expect(clampValue(25, 10, 80)).toBe(25);
	});

	it('handles value at boundaries', () => {
		expect(clampValue(0, 0, 100)).toBe(0);
		expect(clampValue(100, 0, 100)).toBe(100);
	});

	it('handles negative ranges', () => {
		expect(clampValue(-150, -100, 0)).toBe(-100);
		expect(clampValue(50, -100, 0)).toBe(0);
		expect(clampValue(-50, -100, 0)).toBe(-50);
	});
});
