/**
 * ChartHelpers Tests
 *
 * Tests for chart helper functions including:
 * - getChartColors
 * - getChartColor
 * - Color scheme handling
 * - Default color schemes
 */

import { designTokens } from '@core/constants/designTokens';
import { getChartColor, getChartColors } from '@core/ui/data-display/chart/shared/ChartHelpers';
import type { ChartColorScheme } from '@src-types/ui/data/chart';
import { describe, expect, it } from 'vitest';

describe('ChartHelpers - getChartColors', () => {
	it('returns array when colorScheme is an array', () => {
		const customColors = ['#ff0000', '#00ff00', '#0000ff'];
		const result = getChartColors(customColors);
		expect(result).toEqual(customColors);
	});

	it('returns default scheme when colorScheme is "default"', () => {
		const result = getChartColors('default');
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it('returns primary scheme when colorScheme is "primary"', () => {
		const result = getChartColors('primary');
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toBe(designTokens.color.primary.DEFAULT);
	});

	it('returns secondary scheme when colorScheme is "secondary"', () => {
		const result = getChartColors('secondary');
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toBe(designTokens.color.secondary.DEFAULT);
	});

	it('returns success scheme when colorScheme is "success"', () => {
		const result = getChartColors('success');
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toBe(designTokens.color.success.DEFAULT);
	});

	it('returns warning scheme when colorScheme is "warning"', () => {
		const result = getChartColors('warning');
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toBe(designTokens.color.warning.DEFAULT);
	});

	it('returns error scheme when colorScheme is "error"', () => {
		const result = getChartColors('error');
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toBe(designTokens.color.destructive.DEFAULT);
	});

	it('returns info scheme when colorScheme is "info"', () => {
		const result = getChartColors('info');
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		expect(result[0]).toBe(designTokens.color.info.DEFAULT);
	});

	it('returns default scheme for unknown colorScheme', () => {
		const result = getChartColors('unknown' as ChartColorScheme);
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
		// Should fall back to default scheme
	});

	it('returns default scheme when colorScheme is undefined', () => {
		const result = getChartColors();
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it('returns different schemes for different colorScheme values', () => {
		const primary = getChartColors('primary');
		const secondary = getChartColors('secondary');
		const success = getChartColors('success');

		expect(primary[0]).not.toBe(secondary[0]);
		expect(primary[0]).not.toBe(success[0]);
		expect(secondary[0]).not.toBe(success[0]);
	});

	it('preserves custom color array order', () => {
		const customColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00'];
		const result = getChartColors(customColors);
		expect(result).toEqual(customColors);
	});

	it('handles single color array', () => {
		const singleColor = ['#ff0000'];
		const result = getChartColors(singleColor);
		expect(result).toEqual(singleColor);
	});

	it('handles empty color array', () => {
		const emptyColors: string[] = [];
		const result = getChartColors(emptyColors);
		expect(result).toEqual(emptyColors);
	});
});

describe('ChartHelpers - getChartColor', () => {
	it('returns color from default scheme for index 0', () => {
		const result = getChartColor(0);
		expect(typeof result).toBe('string');
		expect(result).toMatch(/^#/);
	});

	it('returns color from default scheme for index 1', () => {
		const result = getChartColor(1);
		expect(typeof result).toBe('string');
		expect(result).toMatch(/^#/);
	});

	it('wraps around when index exceeds color array length', () => {
		const colors = getChartColors('default');
		const indexBeyondLength = colors.length + 2;
		const result = getChartColor(indexBeyondLength);
		expect(typeof result).toBe('string');
		expect(result).toMatch(/^#/);
		// Should wrap around using modulo
		const expectedIndex = indexBeyondLength % colors.length;
		const expectedColor = colors[expectedIndex];
		expect(result).toBe(expectedColor);
	});

	it('returns color from custom color array', () => {
		const customColors = ['#ff0000', '#00ff00', '#0000ff'];
		const result = getChartColor(0, customColors);
		expect(result).toBe('#ff0000');
	});

	it('returns correct color from custom array for different indices', () => {
		const customColors = ['#ff0000', '#00ff00', '#0000ff'];
		expect(getChartColor(0, customColors)).toBe('#ff0000');
		expect(getChartColor(1, customColors)).toBe('#00ff00');
		expect(getChartColor(2, customColors)).toBe('#0000ff');
	});

	it('wraps around custom color array', () => {
		const customColors = ['#ff0000', '#00ff00', '#0000ff'];
		expect(getChartColor(3, customColors)).toBe('#ff0000');
		expect(getChartColor(4, customColors)).toBe('#00ff00');
		expect(getChartColor(5, customColors)).toBe('#0000ff');
	});

	it('returns color from primary scheme', () => {
		const result = getChartColor(0, 'primary');
		expect(result).toBe(designTokens.color.primary.DEFAULT);
	});

	it('returns color from secondary scheme', () => {
		const result = getChartColor(0, 'secondary');
		expect(result).toBe(designTokens.color.secondary.DEFAULT);
	});

	it('returns color from success scheme', () => {
		const result = getChartColor(0, 'success');
		expect(result).toBe(designTokens.color.success.DEFAULT);
	});

	it('returns color from warning scheme', () => {
		const result = getChartColor(0, 'warning');
		expect(result).toBe(designTokens.color.warning.DEFAULT);
	});

	it('returns color from error scheme', () => {
		const result = getChartColor(0, 'error');
		expect(result).toBe(designTokens.color.destructive.DEFAULT);
	});

	it('returns color from info scheme', () => {
		const result = getChartColor(0, 'info');
		expect(result).toBe(designTokens.color.info.DEFAULT);
	});

	it('returns different colors for different indices in same scheme', () => {
		const color0 = getChartColor(0, 'primary');
		const color1 = getChartColor(1, 'primary');
		expect(color0).not.toBe(color1);
	});

	it('handles negative index by wrapping', () => {
		const result = getChartColor(-1);
		// Should wrap around and return a valid color
		expect(typeof result).toBe('string');
		expect(result).toMatch(/^#/);
	});

	it('returns fallback color when color array is empty', () => {
		const result = getChartColor(0, []);
		// Should fall back to default scheme or info color
		expect(typeof result).toBe('string');
		expect(result).toMatch(/^#/);
	});

	it('returns fallback when color at index is undefined', () => {
		// This shouldn't happen in practice, but test defensive behavior
		const result = getChartColor(0);
		expect(result).toBeDefined();
		expect(typeof result).toBe('string');
	});

	it('handles undefined colorScheme with default', () => {
		const result = getChartColor(0);
		expect(typeof result).toBe('string');
		expect(result).toMatch(/^#/);
	});

	it('returns consistent colors for same index and scheme', () => {
		const color1 = getChartColor(5, 'primary');
		const color2 = getChartColor(5, 'primary');
		expect(color1).toBe(color2);
	});

	it('handles large indices correctly', () => {
		const colors = getChartColors('default');
		const largeIndex = 1000;
		const result = getChartColor(largeIndex);
		const expectedIndex = largeIndex % colors.length;
		const expectedColor = colors[expectedIndex];
		expect(result).toBe(expectedColor);
	});
});
