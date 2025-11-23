/**
 * filterValueOperations Tests
 *
 * Tests for filter value operations:
 * - resetFilter
 * - updateFilterValue
 * - Internal helpers (tested indirectly)
 */

import {
	resetFilter,
	updateFilterValue,
} from '@core/ui/data-display/data-table/helpers/filterValueOperations';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import { describe, expect, it } from 'vitest';

describe('resetFilter', () => {
	it('should reset text filter to empty string', () => {
		const filter: AdvancedFilter = {
			id: 'text-filter',
			label: 'Text Filter',
			type: 'text',
			value: 'some value',
		};

		const result = resetFilter(filter);

		expect(result).toEqual({
			...filter,
			value: '',
		});
	});

	it('should reset select filter to empty string', () => {
		const filter: AdvancedFilter = {
			id: 'select-filter',
			label: 'Select Filter',
			type: 'select',
			options: [{ value: 'opt1', label: 'Option 1' }],
			value: 'opt1',
		};

		const result = resetFilter(filter);

		expect(result).toEqual({
			...filter,
			value: '',
		});
	});

	it('should reset date filter to empty string', () => {
		const filter: AdvancedFilter = {
			id: 'date-filter',
			label: 'Date Filter',
			type: 'date',
			value: '2024-01-01',
		};

		const result = resetFilter(filter);

		expect(result).toEqual({
			...filter,
			value: '',
		});
	});

	it('should reset multi-select filter to empty array', () => {
		const filter: AdvancedFilter = {
			id: 'multi-select-filter',
			label: 'Multi Select Filter',
			type: 'multi-select',
			options: [
				{ value: 'opt1', label: 'Option 1' },
				{ value: 'opt2', label: 'Option 2' },
			],
			value: ['opt1', 'opt2'],
		};

		const result = resetFilter(filter);

		expect(result).toEqual({
			...filter,
			value: [],
		});
	});

	it('should reset date-range filter to empty strings', () => {
		const filter: AdvancedFilter = {
			id: 'date-range-filter',
			label: 'Date Range Filter',
			type: 'date-range',
			startValue: '2024-01-01',
			endValue: '2024-12-31',
		};

		const result = resetFilter(filter);

		expect(result).toEqual({
			...filter,
			startValue: '',
			endValue: '',
		});
	});

	it('should return filter unchanged for unknown type', () => {
		const filter = {
			id: 'unknown-filter',
			label: 'Unknown Filter',
			type: 'unknown' as any,
		} as AdvancedFilter;

		const result = resetFilter(filter);

		expect(result).toBe(filter);
	});
});

describe('updateFilterValue', () => {
	describe('text filter', () => {
		it('should update text filter with string value', () => {
			const filter: AdvancedFilter = {
				id: 'text-filter',
				label: 'Text Filter',
				type: 'text',
				value: '',
			};

			const result = updateFilterValue(filter, 'new value');

			expect(result).toEqual({
				...filter,
				value: 'new value',
			});
		});

		it('should keep existing value when newValue is not a string', () => {
			const filter: AdvancedFilter = {
				id: 'text-filter',
				label: 'Text Filter',
				type: 'text',
				value: 'existing value',
			};

			const result = updateFilterValue(filter, 123);

			expect(result).toEqual({
				...filter,
				value: 'existing value',
			});
		});

		it('should use empty string when newValue is not a string and filter has no value', () => {
			const filter: AdvancedFilter = {
				id: 'text-filter',
				label: 'Text Filter',
				type: 'text',
			};

			const result = updateFilterValue(filter, null);

			expect(result).toEqual({
				...filter,
				value: '',
			});
		});
	});

	describe('select filter', () => {
		it('should update select filter with string value', () => {
			const filter: AdvancedFilter = {
				id: 'select-filter',
				label: 'Select Filter',
				type: 'select',
				options: [{ value: 'opt1', label: 'Option 1' }],
				value: '',
			};

			const result = updateFilterValue(filter, 'opt1');

			expect(result).toEqual({
				...filter,
				value: 'opt1',
			});
		});

		it('should keep existing value when newValue is not a string', () => {
			const filter: AdvancedFilter = {
				id: 'select-filter',
				label: 'Select Filter',
				type: 'select',
				options: [{ value: 'opt1', label: 'Option 1' }],
				value: 'opt1',
			};

			const result = updateFilterValue(filter, undefined);

			expect(result).toEqual({
				...filter,
				value: 'opt1',
			});
		});
	});

	describe('date filter', () => {
		it('should update date filter with string value', () => {
			const filter: AdvancedFilter = {
				id: 'date-filter',
				label: 'Date Filter',
				type: 'date',
				value: '',
			};

			const result = updateFilterValue(filter, '2024-01-01');

			expect(result).toEqual({
				...filter,
				value: '2024-01-01',
			});
		});

		it('should keep existing value when newValue is not a string', () => {
			const filter: AdvancedFilter = {
				id: 'date-filter',
				label: 'Date Filter',
				type: 'date',
				value: '2024-01-01',
			};

			const result = updateFilterValue(filter, {});

			expect(result).toEqual({
				...filter,
				value: '2024-01-01',
			});
		});
	});

	describe('multi-select filter', () => {
		it('should update multi-select filter with array of strings', () => {
			const filter: AdvancedFilter = {
				id: 'multi-select-filter',
				label: 'Multi Select Filter',
				type: 'multi-select',
				options: [
					{ value: 'opt1', label: 'Option 1' },
					{ value: 'opt2', label: 'Option 2' },
				],
				value: [],
			};

			const result = updateFilterValue(filter, ['opt1', 'opt2']);

			expect(result).toEqual({
				...filter,
				value: ['opt1', 'opt2'],
			});
		});

		it('should filter out non-string items from array', () => {
			const filter: AdvancedFilter = {
				id: 'multi-select-filter',
				label: 'Multi Select Filter',
				type: 'multi-select',
				options: [
					{ value: 'opt1', label: 'Option 1' },
					{ value: 'opt2', label: 'Option 2' },
				],
				value: [],
			};

			const result = updateFilterValue(filter, ['opt1', 123, 'opt2', null, 'opt3']);

			expect(result).toEqual({
				...filter,
				value: ['opt1', 'opt2', 'opt3'],
			});
		});

		it('should keep existing value when newValue is not an array', () => {
			const filter: AdvancedFilter = {
				id: 'multi-select-filter',
				label: 'Multi Select Filter',
				type: 'multi-select',
				options: [
					{ value: 'opt1', label: 'Option 1' },
					{ value: 'opt2', label: 'Option 2' },
				],
				value: ['opt1'],
			};

			const result = updateFilterValue(filter, 'not an array');

			expect(result).toEqual({
				...filter,
				value: ['opt1'],
			});
		});

		it('should use empty array when newValue is not an array and filter has no value', () => {
			const filter: AdvancedFilter = {
				id: 'multi-select-filter',
				label: 'Multi Select Filter',
				type: 'multi-select',
				options: [
					{ value: 'opt1', label: 'Option 1' },
					{ value: 'opt2', label: 'Option 2' },
				],
			};

			const result = updateFilterValue(filter, null);

			expect(result).toEqual({
				...filter,
				value: [],
			});
		});

		it('should handle empty array', () => {
			const filter: AdvancedFilter = {
				id: 'multi-select-filter',
				label: 'Multi Select Filter',
				type: 'multi-select',
				options: [
					{ value: 'opt1', label: 'Option 1' },
					{ value: 'opt2', label: 'Option 2' },
				],
				value: ['opt1'],
			};

			const result = updateFilterValue(filter, []);

			expect(result).toEqual({
				...filter,
				value: [],
			});
		});
	});

	describe('date-range filter', () => {
		it('should update date-range filter with valid date range object', () => {
			const filter: AdvancedFilter = {
				id: 'date-range-filter',
				label: 'Date Range Filter',
				type: 'date-range',
				startValue: '',
				endValue: '',
			};

			const result = updateFilterValue(filter, {
				start: '2024-01-01',
				end: '2024-12-31',
			});

			expect(result).toEqual({
				...filter,
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			});
		});

		it('should update only start value when end is missing', () => {
			const filter: AdvancedFilter = {
				id: 'date-range-filter',
				label: 'Date Range Filter',
				type: 'date-range',
				startValue: '',
				endValue: '',
			};

			const result = updateFilterValue(filter, {
				start: '2024-01-01',
			});

			expect(result).toEqual({
				...filter,
				startValue: '2024-01-01',
				endValue: '',
			});
		});

		it('should update only end value when start is missing', () => {
			const filter: AdvancedFilter = {
				id: 'date-range-filter',
				label: 'Date Range Filter',
				type: 'date-range',
				startValue: '',
				endValue: '',
			};

			const result = updateFilterValue(filter, {
				end: '2024-12-31',
			});

			expect(result).toEqual({
				...filter,
				startValue: '',
				endValue: '2024-12-31',
			});
		});

		it('should preserve existing startValue when new start is null', () => {
			const filter: AdvancedFilter = {
				id: 'date-range-filter',
				label: 'Date Range Filter',
				type: 'date-range',
				startValue: '2024-01-01',
				endValue: '',
			};

			const result = updateFilterValue(filter, {
				start: null,
				end: '2024-12-31',
			});

			expect(result).toEqual({
				...filter,
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			});
		});

		it('should preserve existing endValue when new end is null', () => {
			const filter: AdvancedFilter = {
				id: 'date-range-filter',
				label: 'Date Range Filter',
				type: 'date-range',
				startValue: '',
				endValue: '2024-12-31',
			};

			const result = updateFilterValue(filter, {
				start: '2024-01-01',
				end: null,
			});

			expect(result).toEqual({
				...filter,
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			});
		});

		it('should use empty string when both new and existing values are missing', () => {
			const filter: AdvancedFilter = {
				id: 'date-range-filter',
				label: 'Date Range Filter',
				type: 'date-range',
			};

			const result = updateFilterValue(filter, {
				start: null,
				end: undefined,
			});

			expect(result).toEqual({
				...filter,
				startValue: '',
				endValue: '',
			});
		});

		it('should keep existing values when newValue is not a valid date range object', () => {
			const filter: AdvancedFilter = {
				id: 'date-range-filter',
				label: 'Date Range Filter',
				type: 'date-range',
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			};

			const result = updateFilterValue(filter, 'not a date range');

			expect(result).toEqual({
				...filter,
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			});
		});

		it('should keep existing values when newValue is an array', () => {
			const filter: AdvancedFilter = {
				id: 'date-range-filter',
				label: 'Date Range Filter',
				type: 'date-range',
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			};

			const result = updateFilterValue(filter, []);

			expect(result).toEqual({
				...filter,
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			});
		});

		it('should keep existing values when newValue is null', () => {
			const filter: AdvancedFilter = {
				id: 'date-range-filter',
				label: 'Date Range Filter',
				type: 'date-range',
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			};

			const result = updateFilterValue(filter, null);

			expect(result).toEqual({
				...filter,
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			});
		});

		it('should handle empty date range object', () => {
			const filter: AdvancedFilter = {
				id: 'date-range-filter',
				label: 'Date Range Filter',
				type: 'date-range',
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			};

			const result = updateFilterValue(filter, {});

			expect(result).toEqual({
				...filter,
				startValue: '2024-01-01',
				endValue: '2024-12-31',
			});
		});
	});

	it('should return filter unchanged for unknown type', () => {
		const filter = {
			id: 'unknown-filter',
			label: 'Unknown Filter',
			type: 'unknown' as any,
		} as AdvancedFilter;

		const result = updateFilterValue(filter, 'any value');

		expect(result).toBe(filter);
	});
});
