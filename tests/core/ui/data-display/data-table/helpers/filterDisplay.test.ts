/**
 * filterDisplay Helper Tests
 *
 * Tests for the filterDisplay helper functions including:
 * - getActiveFilterValues (main exported function)
 * - All filter types: text, select, multi-select, date, date-range
 * - Edge cases: undefined values, empty arrays, missing options
 * - Default case handling
 */

import { getActiveFilterValues } from '@core/ui/data-display/data-table/helpers/filterDisplay';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

describe('filterDisplay - Text Filter', () => {
	it('should return display value for text filter with value', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'text-1',
				label: 'Name',
				type: 'text',
				value: 'John Doe',
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			filterId: 'text-1',
			label: 'Name',
			displayValue: 'John Doe',
			value: 'John Doe',
		});
	});

	it('should return empty string for text filter without value', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'text-1',
				label: 'Name',
				type: 'text',
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			filterId: 'text-1',
			label: 'Name',
			displayValue: '',
			value: undefined,
		});
	});

	it('should return empty string for text filter with undefined value', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'text-1',
				label: 'Name',
				type: 'text',
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('');
	});
});

describe('filterDisplay - Select Filter', () => {
	it('should return display value for select filter with matching option', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'select-1',
				label: 'Status',
				type: 'select',
				value: 'active',
				options: [
					{ value: 'active', label: 'Active' },
					{ value: 'inactive', label: 'Inactive' },
				],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			filterId: 'select-1',
			label: 'Status',
			displayValue: 'Active',
			value: 'active',
		});
	});

	it('should return value as display when option not found', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'select-1',
				label: 'Status',
				type: 'select',
				value: 'unknown',
				options: [
					{ value: 'active', label: 'Active' },
					{ value: 'inactive', label: 'Inactive' },
				],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('unknown');
		expect(result[0]?.value).toBe('unknown');
	});

	it('should return empty string for select filter without value', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'select-1',
				label: 'Status',
				type: 'select',
				options: [
					{ value: 'active', label: 'Active' },
					{ value: 'inactive', label: 'Inactive' },
				],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('');
		expect(result[0]?.value).toBeUndefined();
	});

	it('should handle ReactNode labels in select options', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'select-1',
				label: 'Status',
				type: 'select',
				value: 'active',
				options: [
					{ value: 'active', label: createElement('span', {}, 'Active Status') },
					{ value: 'inactive', label: 'Inactive' },
				],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('Active Status');
		expect(result[0]?.value).toBe('active');
	});
});

describe('filterDisplay - Multi-Select Filter', () => {
	it('should return display value for multi-select filter with values', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'multi-1',
				label: 'Tags',
				type: 'multi-select',
				value: ['tag1', 'tag2'],
				options: [
					{ value: 'tag1', label: 'Tag 1' },
					{ value: 'tag2', label: 'Tag 2' },
					{ value: 'tag3', label: 'Tag 3' },
				],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual({
			filterId: 'multi-1',
			label: 'Tags',
			displayValue: 'Tag 1, Tag 2',
			value: ['tag1', 'tag2'],
		});
	});

	it('should return empty string for multi-select filter without value', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'multi-1',
				label: 'Tags',
				type: 'multi-select',
				options: [
					{ value: 'tag1', label: 'Tag 1' },
					{ value: 'tag2', label: 'Tag 2' },
				],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('');
		expect(result[0]?.value).toBeUndefined();
	});

	it('should return empty string for multi-select filter with empty array', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'multi-1',
				label: 'Tags',
				type: 'multi-select',
				value: [],
				options: [
					{ value: 'tag1', label: 'Tag 1' },
					{ value: 'tag2', label: 'Tag 2' },
				],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('');
		expect(result[0]?.value).toEqual([]);
	});

	it('should handle partial matches in multi-select filter', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'multi-1',
				label: 'Tags',
				type: 'multi-select',
				value: ['tag1', 'unknown'],
				options: [
					{ value: 'tag1', label: 'Tag 1' },
					{ value: 'tag2', label: 'Tag 2' },
				],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('Tag 1');
		expect(result[0]?.value).toEqual(['tag1', 'unknown']);
	});

	it('should handle ReactNode labels in multi-select options', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'multi-1',
				label: 'Tags',
				type: 'multi-select',
				value: ['tag1', 'tag2'],
				options: [
					{ value: 'tag1', label: createElement('span', {}, 'Tag One') },
					{ value: 'tag2', label: 'Tag 2' },
				],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('Tag One, Tag 2');
		expect(result[0]?.value).toEqual(['tag1', 'tag2']);
	});
});

describe('filterDisplay - Date Filter', () => {
	it('should return formatted date for date filter with value', () => {
		const dateString = '2024-01-15';
		const filters: AdvancedFilter[] = [
			{
				id: 'date-1',
				label: 'Created Date',
				type: 'date',
				value: dateString,
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.filterId).toBe('date-1');
		expect(result[0]?.label).toBe('Created Date');
		expect(result[0]?.displayValue).toBe(new Date(dateString).toLocaleDateString());
		expect(result[0]?.value).toBe(dateString);
	});

	it('should return empty string for date filter without value', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'date-1',
				label: 'Created Date',
				type: 'date',
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('');
		expect(result[0]?.value).toBeUndefined();
	});

	it('should handle different date formats', () => {
		const dateString = '2024-12-31T23:59:59.000Z';
		const filters: AdvancedFilter[] = [
			{
				id: 'date-1',
				label: 'Created Date',
				type: 'date',
				value: dateString,
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe(new Date(dateString).toLocaleDateString());
		expect(result[0]?.value).toBe(dateString);
	});
});

describe('filterDisplay - Date Range Filter', () => {
	it('should return formatted date range for date-range filter with both values', () => {
		const startDate = '2024-01-01';
		const endDate = '2024-01-31';
		const filters: AdvancedFilter[] = [
			{
				id: 'date-range-1',
				label: 'Date Range',
				type: 'date-range',
				startValue: startDate,
				endValue: endDate,
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.filterId).toBe('date-range-1');
		expect(result[0]?.label).toBe('Date Range');
		const expectedDisplay = `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
		expect(result[0]?.displayValue).toBe(expectedDisplay);
		expect(result[0]?.value).toEqual({
			start: startDate,
			end: endDate,
		});
	});

	it('should return only start date when end date is missing', () => {
		const startDate = '2024-01-01';
		const filters: AdvancedFilter[] = [
			{
				id: 'date-range-1',
				label: 'Date Range',
				type: 'date-range',
				startValue: startDate,
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe(new Date(startDate).toLocaleDateString());
		expect(result[0]?.value).toEqual({
			start: startDate,
			end: undefined,
		});
	});

	it('should return only end date when start date is missing', () => {
		const endDate = '2024-01-31';
		const filters: AdvancedFilter[] = [
			{
				id: 'date-range-1',
				label: 'Date Range',
				type: 'date-range',
				endValue: endDate,
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe(new Date(endDate).toLocaleDateString());
		expect(result[0]?.value).toEqual({
			start: undefined,
			end: endDate,
		});
	});

	it('should return empty string when both dates are missing', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'date-range-1',
				label: 'Date Range',
				type: 'date-range',
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('');
		expect(result[0]?.value).toEqual({
			start: undefined,
			end: undefined,
		});
	});
});

describe('filterDisplay - Multiple Filters', () => {
	it('should handle multiple filters of different types', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'text-1',
				label: 'Name',
				type: 'text',
				value: 'John Doe',
			},
			{
				id: 'select-1',
				label: 'Status',
				type: 'select',
				value: 'active',
				options: [{ value: 'active', label: 'Active' }],
			},
			{
				id: 'multi-1',
				label: 'Tags',
				type: 'multi-select',
				value: ['tag1'],
				options: [{ value: 'tag1', label: 'Tag 1' }],
			},
			{
				id: 'date-1',
				label: 'Date',
				type: 'date',
				value: '2024-01-15',
			},
			{
				id: 'date-range-1',
				label: 'Range',
				type: 'date-range',
				startValue: '2024-01-01',
				endValue: '2024-01-31',
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(5);
		expect(result[0]?.displayValue).toBe('John Doe');
		expect(result[1]?.displayValue).toBe('Active');
		expect(result[2]?.displayValue).toBe('Tag 1');
		expect(result[3]?.displayValue).toBe(new Date('2024-01-15').toLocaleDateString());
		expect(result[4]?.displayValue).toContain(' - ');
	});

	it('should handle empty filters array', () => {
		const filters: AdvancedFilter[] = [];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(0);
		expect(result).toEqual([]);
	});
});

describe('filterDisplay - Edge Cases', () => {
	it('should handle unknown filter type (default case)', () => {
		// TypeScript won't allow this, but we test the runtime behavior
		const filters = [
			{
				id: 'unknown-1',
				label: 'Unknown',
				type: 'unknown' as AdvancedFilter['type'],
				value: 'test',
			},
		] as AdvancedFilter[];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('');
		expect(result[0]?.value).toBeNull();
	});

	it('should preserve filter metadata (id, label) in result', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'custom-id',
				label: 'Custom Label',
				type: 'text',
				value: 'test',
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result[0]?.filterId).toBe('custom-id');
		expect(result[0]?.label).toBe('Custom Label');
	});

	it('should handle select filter with empty options array', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'select-1',
				label: 'Status',
				type: 'select',
				value: 'active',
				options: [],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('active');
		expect(result[0]?.value).toBe('active');
	});

	it('should handle multi-select filter with empty options array', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'multi-1',
				label: 'Tags',
				type: 'multi-select',
				value: ['tag1'],
				options: [],
			},
		];

		const result = getActiveFilterValues(filters);

		expect(result).toHaveLength(1);
		expect(result[0]?.displayValue).toBe('');
		expect(result[0]?.value).toEqual(['tag1']);
	});
});
