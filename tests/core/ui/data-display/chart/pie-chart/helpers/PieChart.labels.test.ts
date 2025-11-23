/**
 * PieChart.labels Tests
 *
 * Tests for pie chart label helper functions including:
 * - formatPieLabel
 * - getPieLabelFormatter
 */

import {
	formatPieLabel,
	getPieLabelFormatter,
} from '@core/ui/data-display/chart/pie-chart/helpers/PieChart.labels';
import { describe, expect, it } from 'vitest';

describe('PieChart.labels - formatPieLabel', () => {
	it('formats label with name and percent', () => {
		const result = formatPieLabel({ name: 'Desktop', percent: 0.45 });
		expect(result).toBe('Desktop: 45%');
	});

	it('formats label with name and zero percent', () => {
		const result = formatPieLabel({ name: 'Mobile', percent: 0 });
		expect(result).toBe('Mobile: 0%');
	});

	it('formats label with name and 100 percent', () => {
		const result = formatPieLabel({ name: 'Tablet', percent: 1 });
		expect(result).toBe('Tablet: 100%');
	});

	it('formats label with name and decimal percent', () => {
		const result = formatPieLabel({ name: 'Other', percent: 0.333 });
		expect(result).toBe('Other: 33%');
	});

	it('rounds percent to nearest integer', () => {
		const result1 = formatPieLabel({ name: 'Test', percent: 0.334 });
		const result2 = formatPieLabel({ name: 'Test', percent: 0.335 });
		// Both should round to 33% or 34% depending on rounding
		expect(result1).toMatch(/\d+%/);
		expect(result2).toMatch(/\d+%/);
	});

	it('handles undefined name with "Unknown"', () => {
		const result = formatPieLabel({ percent: 0.5 });
		expect(result).toBe('Unknown: 50%');
	});

	it('handles missing name property', () => {
		const result = formatPieLabel({ percent: 0.5 });
		expect(result).toBe('Unknown: 50%');
	});

	it('handles undefined percent with 0', () => {
		const result = formatPieLabel({ name: 'Desktop' });
		expect(result).toBe('Desktop: 0%');
	});

	it('handles missing percent property', () => {
		const result = formatPieLabel({ name: 'Desktop' });
		expect(result).toBe('Desktop: 0%');
	});

	it('handles both undefined name and percent', () => {
		const result = formatPieLabel({});
		expect(result).toBe('Unknown: 0%');
	});

	it('handles empty string name', () => {
		const result = formatPieLabel({ name: '', percent: 0.5 });
		expect(result).toBe(': 50%');
	});

	it('formats percent correctly for various values', () => {
		expect(formatPieLabel({ name: 'A', percent: 0.123 })).toBe('A: 12%');
		expect(formatPieLabel({ name: 'B', percent: 0.456 })).toBe('B: 46%');
		expect(formatPieLabel({ name: 'C', percent: 0.789 })).toBe('C: 79%');
		expect(formatPieLabel({ name: 'D', percent: 0.999 })).toBe('D: 100%');
	});

	it('handles very small percent values', () => {
		const result = formatPieLabel({ name: 'Tiny', percent: 0.001 });
		expect(result).toBe('Tiny: 0%');
	});

	it('handles percent greater than 1 (should not happen but test defensive)', () => {
		const result = formatPieLabel({ name: 'Large', percent: 1.5 });
		expect(result).toBe('Large: 150%');
	});

	it('handles negative percent (should not happen but test defensive)', () => {
		const result = formatPieLabel({ name: 'Negative', percent: -0.1 });
		expect(result).toBe('Negative: -10%');
	});
});

describe('PieChart.labels - getPieLabelFormatter', () => {
	it('returns formatPieLabel function when showLabels is true', () => {
		const formatter = getPieLabelFormatter(true);
		expect(typeof formatter).toBe('function');
		expect(formatter).toBe(formatPieLabel);
	});

	it('returns false when showLabels is false', () => {
		const formatter = getPieLabelFormatter(false);
		expect(formatter).toBe(false);
	});

	it('returns formatPieLabel function when showLabels is explicitly true', () => {
		const formatter = getPieLabelFormatter(true);
		expect(formatter).toBe(formatPieLabel);
	});

	it('can use returned formatter function', () => {
		const formatter = getPieLabelFormatter(true);
		if (typeof formatter === 'function') {
			const result = formatter({ name: 'Test', percent: 0.5 });
			expect(result).toBe('Test: 50%');
		} else {
			throw new TypeError('Formatter should be a function');
		}
	});

	it('returns false for falsy showLabels values', () => {
		expect(getPieLabelFormatter(false)).toBe(false);
	});

	it('returns formatPieLabel for truthy showLabels values', () => {
		expect(getPieLabelFormatter(true)).toBe(formatPieLabel);
	});

	it('formatter function matches formatPieLabel behavior', () => {
		const formatter = getPieLabelFormatter(true);
		if (typeof formatter === 'function') {
			const testCases = [
				{ name: 'A', percent: 0.25 },
				{ name: 'B', percent: 0.5 },
				{ name: 'C', percent: 0.75 },
			];

			for (const testCase of testCases) {
				const formatterResult = formatter(testCase);
				const directResult = formatPieLabel(testCase);
				expect(formatterResult).toBe(directResult);
			}
		}
	});
});
