/**
 * useDataTableStateBuilders.filter Tests
 *
 * Tests for the buildFilterStateOptions function:
 * - Optional initialFilter is conditionally included
 * - Optional onFilterChange callback is conditionally included
 * - Edge cases with undefined parameters
 */

import { buildFilterStateOptions } from '@core/ui/data-display/data-table/state/useDataTableStateBuilders.filter';
import type { DataTableFilter } from '@src-types/ui/dataTable';
import { describe, expect, it, vi } from 'vitest';

describe('buildFilterStateOptions', () => {
	it('should build empty options when no parameters provided', () => {
		const result = buildFilterStateOptions();

		expect(result).toEqual({});
		expect(result.initialFilter).toBeUndefined();
		expect(result.onFilterChange).toBeUndefined();
	});

	it('should build options with initialFilter only', () => {
		const initialFilter: DataTableFilter = {
			globalSearch: 'test search',
		};

		const result = buildFilterStateOptions(initialFilter);

		expect(result).toEqual({
			initialFilter,
		});
		expect(result.onFilterChange).toBeUndefined();
	});

	it('should build options with onFilterChange only', () => {
		const onFilterChange = vi.fn();

		const result = buildFilterStateOptions(undefined, onFilterChange);

		expect(result).toEqual({
			onFilterChange,
		});
		expect(result.initialFilter).toBeUndefined();
	});

	it('should build options with both initialFilter and onFilterChange', () => {
		const initialFilter: DataTableFilter = {
			globalSearch: 'test',
			columnFilters: {
				name: 'John',
			},
		};
		const onFilterChange = vi.fn();

		const result = buildFilterStateOptions(initialFilter, onFilterChange);

		expect(result).toEqual({
			initialFilter,
			onFilterChange,
		});
	});

	it('should handle empty initialFilter object', () => {
		const initialFilter: DataTableFilter = {};

		const result = buildFilterStateOptions(initialFilter);

		expect(result.initialFilter).toEqual({});
	});

	it('should handle initialFilter with all filter types', () => {
		const initialFilter: DataTableFilter = {
			globalSearch: 'search',
			columnFilters: {
				column1: 'value1',
			},
			advancedFilters: {
				column2: 'value2',
			},
			customFilter: Boolean,
		};

		const result = buildFilterStateOptions(initialFilter);

		expect(result.initialFilter).toEqual(initialFilter);
	});

	it('should preserve filter object reference', () => {
		const initialFilter: DataTableFilter = {
			globalSearch: 'test',
		};

		const result = buildFilterStateOptions(initialFilter);

		expect(result.initialFilter).toBe(initialFilter);
	});
});
