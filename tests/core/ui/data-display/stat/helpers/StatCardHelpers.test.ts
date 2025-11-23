/**
 * Tests for StatCard helper functions
 *
 * Tests helper functions:
 * - getTrendColorClasses
 * - formatTrendValue
 * - getTrendIconName
 */

import {
	formatTrendValue,
	getTrendColorClasses,
	getTrendIconName,
} from '@core/ui/data-display/stat/helpers/StatCardHelpers';
import type { StatTrendDirection } from '@src-types/ui/layout/card';
import { describe, expect, it } from 'vitest';

describe('StatCardHelpers - getTrendColorClasses', () => {
	it('returns text-success for up direction', () => {
		expect(getTrendColorClasses('up')).toBe('text-success');
	});

	it('returns text-destructive for down direction', () => {
		expect(getTrendColorClasses('down')).toBe('text-destructive');
	});

	it('returns text-text-secondary for neutral direction', () => {
		expect(getTrendColorClasses('neutral')).toBe('text-text-secondary');
	});

	it('returns text-text-secondary for default case', () => {
		// Test with a value that doesn't match any case (using type assertion to test default)
		const invalidDirection = 'invalid' as StatTrendDirection;
		expect(getTrendColorClasses(invalidDirection)).toBe('text-text-secondary');
	});

	it('handles all valid StatTrendDirection values', () => {
		const directions: StatTrendDirection[] = ['up', 'down', 'neutral'];
		const expectedClasses = ['text-success', 'text-destructive', 'text-text-secondary'];

		for (const [index, direction] of directions.entries()) {
			expect(getTrendColorClasses(direction)).toBe(expectedClasses[index]);
		}
	});
});

describe('StatCardHelpers - formatTrendValue', () => {
	it('formats positive values with plus sign', () => {
		expect(formatTrendValue(5.5)).toBe('+5.5%');
		expect(formatTrendValue(10)).toBe('+10.0%');
		expect(formatTrendValue(0.1)).toBe('+0.1%');
		expect(formatTrendValue(100)).toBe('+100.0%');
	});

	it('formats negative values without plus sign', () => {
		expect(formatTrendValue(-5.5)).toBe('-5.5%');
		expect(formatTrendValue(-10)).toBe('-10.0%');
		expect(formatTrendValue(-0.1)).toBe('-0.1%');
		expect(formatTrendValue(-100)).toBe('-100.0%');
	});

	it('formats zero value with plus sign', () => {
		expect(formatTrendValue(0)).toBe('+0.0%');
	});

	it('formats decimal values with one decimal place', () => {
		expect(formatTrendValue(3.14159)).toBe('+3.1%');
		expect(formatTrendValue(-3.14159)).toBe('-3.1%');
		expect(formatTrendValue(99.999)).toBe('+100.0%');
		expect(formatTrendValue(-99.999)).toBe('-100.0%');
	});

	it('handles very small values', () => {
		expect(formatTrendValue(0.01)).toBe('+0.0%');
		expect(formatTrendValue(-0.01)).toBe('-0.0%');
		expect(formatTrendValue(0.05)).toBe('+0.1%');
		expect(formatTrendValue(-0.05)).toBe('-0.1%');
	});

	it('handles very large values', () => {
		expect(formatTrendValue(1000)).toBe('+1000.0%');
		expect(formatTrendValue(-1000)).toBe('-1000.0%');
		expect(formatTrendValue(9999.99)).toBe('+10000.0%');
		expect(formatTrendValue(-9999.99)).toBe('-10000.0%');
	});
});

describe('StatCardHelpers - getTrendIconName', () => {
	it('returns arrow-up for up direction', () => {
		expect(getTrendIconName('up')).toBe('arrow-up');
	});

	it('returns arrow-down for down direction', () => {
		expect(getTrendIconName('down')).toBe('arrow-down');
	});

	it('returns null for neutral direction', () => {
		expect(getTrendIconName('neutral')).toBeNull();
	});

	it('returns null for default case', () => {
		// Test with a value that doesn't match any case (using type assertion to test default)
		const invalidDirection = 'invalid' as StatTrendDirection;
		expect(getTrendIconName(invalidDirection)).toBeNull();
	});

	it('handles all valid StatTrendDirection values', () => {
		expect(getTrendIconName('up')).toBe('arrow-up');
		expect(getTrendIconName('down')).toBe('arrow-down');
		expect(getTrendIconName('neutral')).toBeNull();
	});

	it('returns correct type for each direction', () => {
		const upResult = getTrendIconName('up');
		const downResult = getTrendIconName('down');
		const neutralResult = getTrendIconName('neutral');

		expect(typeof upResult).toBe('string');
		expect(typeof downResult).toBe('string');
		expect(neutralResult).toBeNull();
		expect(upResult).toBe('arrow-up');
		expect(downResult).toBe('arrow-down');
	});
});
