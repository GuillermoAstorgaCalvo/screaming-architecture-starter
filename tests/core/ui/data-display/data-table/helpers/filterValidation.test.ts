/**
 * filterValidation Tests
 *
 * Tests for validation functions:
 * - isFilterActive
 * - getActiveFilters
 */

import {
	getActiveFilters,
	isFilterActive,
} from '@core/ui/data-display/data-table/helpers/filterValidation';
import type {
	AdvancedFilter,
	DateAdvancedFilter,
	DateRangeAdvancedFilter,
	MultiSelectAdvancedFilter,
	SelectAdvancedFilter,
	TextAdvancedFilter,
} from '@src-types/ui/advancedFilter';
import { describe, expect, it } from 'vitest';

describe('isFilterActive', () => {
	describe('text filter', () => {
		it('should return true for text filter with value', () => {
			const filter: TextAdvancedFilter = {
				id: 'filter-1',
				label: 'Name',
				type: 'text',
				value: 'John',
			};
			expect(isFilterActive(filter)).toBe(true);
		});

		it('should return false for text filter with empty value', () => {
			const filter: TextAdvancedFilter = {
				id: 'filter-1',
				label: 'Name',
				type: 'text',
				value: '',
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return false for text filter with whitespace-only value', () => {
			const filter: TextAdvancedFilter = {
				id: 'filter-1',
				label: 'Name',
				type: 'text',
				value: '   ',
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return false for text filter with undefined value', () => {
			const filter: TextAdvancedFilter = {
				id: 'filter-1',
				label: 'Name',
				type: 'text',
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return true for text filter with trimmed value', () => {
			const filter: TextAdvancedFilter = {
				id: 'filter-1',
				label: 'Name',
				type: 'text',
				value: '  John  ',
			};
			expect(isFilterActive(filter)).toBe(true);
		});
	});

	describe('select filter', () => {
		it('should return true for select filter with value', () => {
			const filter: SelectAdvancedFilter = {
				id: 'filter-1',
				label: 'Status',
				type: 'select',
				options: [],
				value: 'active',
			};
			expect(isFilterActive(filter)).toBe(true);
		});

		it('should return false for select filter with empty value', () => {
			const filter: SelectAdvancedFilter = {
				id: 'filter-1',
				label: 'Status',
				type: 'select',
				options: [],
				value: '',
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return false for select filter with undefined value', () => {
			const filter: SelectAdvancedFilter = {
				id: 'filter-1',
				label: 'Status',
				type: 'select',
				options: [],
			};
			expect(isFilterActive(filter)).toBe(false);
		});
	});

	describe('date filter', () => {
		it('should return true for date filter with value', () => {
			const filter: DateAdvancedFilter = {
				id: 'filter-1',
				label: 'Date',
				type: 'date',
				value: '2024-01-01',
			};
			expect(isFilterActive(filter)).toBe(true);
		});

		it('should return false for date filter with empty value', () => {
			const filter: DateAdvancedFilter = {
				id: 'filter-1',
				label: 'Date',
				type: 'date',
				value: '',
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return false for date filter with undefined value', () => {
			const filter: DateAdvancedFilter = {
				id: 'filter-1',
				label: 'Date',
				type: 'date',
			};
			expect(isFilterActive(filter)).toBe(false);
		});
	});

	describe('multi-select filter', () => {
		it('should return true for multi-select filter with values', () => {
			const filter: MultiSelectAdvancedFilter = {
				id: 'filter-1',
				label: 'Tags',
				type: 'multi-select',
				options: [],
				value: ['tag1', 'tag2'],
			};
			expect(isFilterActive(filter)).toBe(true);
		});

		it('should return true for multi-select filter with single value', () => {
			const filter: MultiSelectAdvancedFilter = {
				id: 'filter-1',
				label: 'Tags',
				type: 'multi-select',
				options: [],
				value: ['tag1'],
			};
			expect(isFilterActive(filter)).toBe(true);
		});

		it('should return false for multi-select filter with empty array', () => {
			const filter: MultiSelectAdvancedFilter = {
				id: 'filter-1',
				label: 'Tags',
				type: 'multi-select',
				options: [],
				value: [],
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return false for multi-select filter with undefined value', () => {
			const filter: MultiSelectAdvancedFilter = {
				id: 'filter-1',
				label: 'Tags',
				type: 'multi-select',
				options: [],
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return false for multi-select filter with empty string values', () => {
			const filter: MultiSelectAdvancedFilter = {
				id: 'filter-1',
				label: 'Tags',
				type: 'multi-select',
				options: [],
				value: ['', '   '],
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return true for multi-select filter with at least one non-empty value', () => {
			const filter: MultiSelectAdvancedFilter = {
				id: 'filter-1',
				label: 'Tags',
				type: 'multi-select',
				options: [],
				value: ['', 'tag1', '   '],
			};
			expect(isFilterActive(filter)).toBe(true);
		});
	});

	describe('date-range filter', () => {
		it('should return true for date-range filter with startValue', () => {
			const filter: DateRangeAdvancedFilter = {
				id: 'filter-1',
				label: 'Date Range',
				type: 'date-range',
				startValue: '2024-01-01',
			};
			expect(isFilterActive(filter)).toBe(true);
		});

		it('should return true for date-range filter with endValue', () => {
			const filter: DateRangeAdvancedFilter = {
				id: 'filter-1',
				label: 'Date Range',
				type: 'date-range',
				endValue: '2024-12-31',
			};
			expect(isFilterActive(filter)).toBe(true);
		});

		it('should return true for date-range filter with both values', () => {
			const filter: DateRangeAdvancedFilter = {
				id: 'filter-1',
				label: 'Date Range',
				type: 'date-range',
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			};
			expect(isFilterActive(filter)).toBe(true);
		});

		it('should return false for date-range filter with empty values', () => {
			const filter: DateRangeAdvancedFilter = {
				id: 'filter-1',
				label: 'Date Range',
				type: 'date-range',
				startValue: '',
				endValue: '',
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return false for date-range filter with whitespace-only values', () => {
			const filter: DateRangeAdvancedFilter = {
				id: 'filter-1',
				label: 'Date Range',
				type: 'date-range',
				startValue: '   ',
				endValue: '   ',
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return false for date-range filter with undefined values', () => {
			const filter: DateRangeAdvancedFilter = {
				id: 'filter-1',
				label: 'Date Range',
				type: 'date-range',
			};
			expect(isFilterActive(filter)).toBe(false);
		});

		it('should return true for date-range filter with one whitespace and one valid value', () => {
			const filter: DateRangeAdvancedFilter = {
				id: 'filter-1',
				label: 'Date Range',
				type: 'date-range',
				startValue: '   ',
				endValue: '2024-12-31',
			};
			expect(isFilterActive(filter)).toBe(true);
		});
	});
});

describe('getActiveFilters', () => {
	it('should return only active filters', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'filter-1',
				label: 'Name',
				type: 'text',
				value: 'John',
			},
			{
				id: 'filter-2',
				label: 'Status',
				type: 'select',
				options: [],
				value: '',
			},
			{
				id: 'filter-3',
				label: 'Tags',
				type: 'multi-select',
				options: [],
				value: ['tag1'],
			},
		];

		const activeFilters = getActiveFilters(filters);

		expect(activeFilters).toHaveLength(2);
		expect(activeFilters[0]?.id).toBe('filter-1');
		expect(activeFilters[1]?.id).toBe('filter-3');
	});

	it('should return empty array when no filters are active', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'filter-1',
				label: 'Name',
				type: 'text',
				value: '',
			},
			{
				id: 'filter-2',
				label: 'Status',
				type: 'select',
				options: [],
			},
		];

		const activeFilters = getActiveFilters(filters);

		expect(activeFilters).toHaveLength(0);
	});

	it('should return all filters when all are active', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'filter-1',
				label: 'Name',
				type: 'text',
				value: 'John',
			},
			{
				id: 'filter-2',
				label: 'Date Range',
				type: 'date-range',
				startValue: '2024-01-01',
			},
		];

		const activeFilters = getActiveFilters(filters);

		expect(activeFilters).toHaveLength(2);
		expect(activeFilters).toEqual(filters);
	});

	it('should return empty array for empty filters array', () => {
		const filters: AdvancedFilter[] = [];

		const activeFilters = getActiveFilters(filters);

		expect(activeFilters).toHaveLength(0);
	});

	it('should handle mixed filter types correctly', () => {
		const filters: AdvancedFilter[] = [
			{
				id: 'filter-1',
				label: 'Text',
				type: 'text',
				value: 'test',
			},
			{
				id: 'filter-2',
				label: 'Select',
				type: 'select',
				options: [],
				value: 'option1',
			},
			{
				id: 'filter-3',
				label: 'Multi-Select',
				type: 'multi-select',
				options: [],
				value: ['tag1', 'tag2'],
			},
			{
				id: 'filter-4',
				label: 'Date',
				type: 'date',
				value: '2024-01-01',
			},
			{
				id: 'filter-5',
				label: 'Date Range',
				type: 'date-range',
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			},
			{
				id: 'filter-6',
				label: 'Inactive',
				type: 'text',
				value: '',
			},
		];

		const activeFilters = getActiveFilters(filters);

		expect(activeFilters).toHaveLength(5);
		expect(activeFilters.map(f => f.id)).toEqual([
			'filter-1',
			'filter-2',
			'filter-3',
			'filter-4',
			'filter-5',
		]);
	});
});
