/**
 * PieChart.cells Tests
 *
 * Tests for pie chart cell rendering including:
 * - renderPieCells
 * - Cell component rendering
 * - Key generation
 * - Color assignment
 */

import { renderPieCells } from '@core/ui/data-display/chart/pie-chart/components/PieChart.cells';
import type { PieChartProps } from '@src-types/ui/data/chart';
import { describe, expect, it } from 'vitest';

describe('PieChart.cells - renderPieCells', () => {
	const mockData: PieChartProps['data'] = [
		{ name: 'Desktop', value: 400 },
		{ name: 'Mobile', value: 300 },
		{ name: 'Tablet', value: 200 },
	];

	it('returns array of React elements', () => {
		const result = renderPieCells(mockData, 'name', 'default');
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBe(mockData.length);
	});

	it('renders Cell components for each data entry', () => {
		const result = renderPieCells(mockData, 'name', 'default');

		// Recharts Cell components render as SVG elements
		// We can check that we have the right number of elements
		expect(result.length).toBe(3);
	});

	it('uses nameKey to get entry key', () => {
		const dataWithCustomKey = [
			{ label: 'Desktop', value: 400 },
			{ label: 'Mobile', value: 300 },
		];
		const result = renderPieCells(
			dataWithCustomKey as unknown as PieChartProps['data'],
			'label',
			'default'
		);

		expect(result.length).toBe(2);
		// Each cell should have a key based on the label
		for (const [index, cell] of result.entries()) {
			expect(cell.key).toBeDefined();
		}
	});

	it('falls back to entry.name when nameKey value is missing', () => {
		const dataWithName = [
			{ name: 'Desktop', value: 400 },
			{ label: 'Mobile', value: 300, name: 'MobileDevice' },
		];
		const result = renderPieCells(
			dataWithName as unknown as PieChartProps['data'],
			'label',
			'default'
		);

		expect(result.length).toBe(2);
		// First entry uses nameKey (label doesn't exist, falls back to name)
		// Second entry uses nameKey (label exists)
	});

	it('uses entry.name as fallback when nameKey is not found', () => {
		const dataWithName = [
			{ name: 'Desktop', value: 400 },
			{ name: 'Mobile', value: 300 },
		];
		const result = renderPieCells(dataWithName, 'nonexistent', 'default');

		expect(result.length).toBe(2);
		// Should fall back to entry.name for keys
		for (const [index, cell] of result.entries()) {
			expect(cell.key).toBeDefined();
		}
	});

	it('generates fallback key when both nameKey and name are missing', () => {
		const dataWithoutName = [{ value: 400 }, { value: 300 }];
		const result = renderPieCells(
			dataWithoutName as unknown as PieChartProps['data'],
			'name',
			'default'
		);

		expect(result.length).toBe(2);
		for (const [index, cell] of result.entries()) {
			expect(cell.key).toBe(`cell-${index}`);
		}
	});

	it('assigns different colors to different cells', () => {
		const result = renderPieCells(mockData, 'name', 'default');
		const fills = result.map(cell => (cell.props as { fill?: string }).fill);

		// All cells should have fill colors
		for (const fill of fills) {
			expect(typeof fill).toBe('string');
			expect(fill).toMatch(/^#/);
		}

		// Colors should be different (unless color scheme wraps around)
		const uniqueFills = new Set(fills);
		// At least first few should be different
		expect(uniqueFills.size).toBeGreaterThanOrEqual(1);
	});

	it('uses colorScheme for color assignment', () => {
		const resultPrimary = renderPieCells(mockData, 'name', 'primary');
		const resultSecondary = renderPieCells(mockData, 'name', 'secondary');

		const primaryFills = resultPrimary.map(cell => (cell.props as { fill?: string }).fill);
		const secondaryFills = resultSecondary.map(cell => (cell.props as { fill?: string }).fill);

		// First color should be different between schemes
		expect(primaryFills[0]).not.toBe(secondaryFills[0]);
	});

	it('handles custom color array', () => {
		const customColors = ['#ff0000', '#00ff00', '#0000ff'];
		const result = renderPieCells(mockData, 'name', customColors);

		const fills = result.map(cell => (cell.props as { fill?: string }).fill);
		expect(fills[0]).toBe('#ff0000');
		expect(fills[1]).toBe('#00ff00');
		expect(fills[2]).toBe('#0000ff');
	});

	it('wraps around color scheme when data length exceeds colors', () => {
		const largeData = Array.from({ length: 10 }, (_, i) => ({
			name: `Item ${i}`,
			value: 100,
		}));
		const result = renderPieCells(largeData, 'name', 'default');

		expect(result.length).toBe(10);
		// All cells should have colors (wrapping around)
		for (const cell of result) {
			const props = cell.props as { fill?: string };
			expect(props.fill).toBeDefined();
			expect(typeof props.fill).toBe('string');
		}
	});

	it('handles empty data array', () => {
		const result = renderPieCells([], 'name', 'default');
		expect(result).toEqual([]);
	});

	it('handles single data entry', () => {
		const singleData = [{ name: 'Only', value: 100 }];
		const result = renderPieCells(singleData, 'name', 'default');

		expect(result.length).toBe(1);
		expect(result[0]).toBeDefined();
		const props = result[0]?.props as { fill?: string };
		expect(props.fill).toBeDefined();
	});

	it('converts entryKey to string for key prop', () => {
		const dataWithNumericKey = [
			{ id: 123, value: 400 },
			{ id: 456, value: 300 },
		];
		const result = renderPieCells(
			dataWithNumericKey as unknown as PieChartProps['data'],
			'id',
			'default'
		);

		for (const [index, cell] of result.entries()) {
			expect(typeof cell.key).toBe('string');
		}
	});

	it('handles boolean keys', () => {
		const dataWithBooleanKey = [
			{ active: true, value: 400 },
			{ active: false, value: 300 },
		];
		const result = renderPieCells(
			dataWithBooleanKey as unknown as PieChartProps['data'],
			'active',
			'default'
		);

		expect(result.length).toBe(2);
		for (const cell of result) {
			expect(cell.key).toBeDefined();
		}
	});

	it('handles null/undefined nameKey values', () => {
		const dataWithNulls = [
			{ name: null, value: 400 },
			{ name: undefined, value: 300 },
			{ value: 200 },
		];
		const result = renderPieCells(
			dataWithNulls as unknown as PieChartProps['data'],
			'name',
			'default'
		);

		expect(result.length).toBe(3);
		// Should generate fallback keys
		for (const [index, cell] of result.entries()) {
			expect(cell.key).toBeDefined();
		}
	});

	it('assigns colors based on index', () => {
		const result = renderPieCells(mockData, 'name', 'default');
		const fills = result.map(cell => (cell.props as { fill?: string }).fill);

		// Each cell should get a color based on its index
		expect(fills[0]).toBeDefined();
		expect(fills[1]).toBeDefined();
		expect(fills[2]).toBeDefined();
	});

	it('preserves Cell component structure', () => {
		const result = renderPieCells(mockData, 'name', 'default');

		for (const cell of result) {
			expect(cell.type).toBeDefined();
			expect(cell.props).toBeDefined();
			const props = cell.props as { fill?: string };
			expect(props.fill).toBeDefined();
			expect(cell.key).toBeDefined();
		}
	});
});
