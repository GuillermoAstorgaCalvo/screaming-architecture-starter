/**
 * useDataTableFilter Tests
 *
 * Tests for the useDataTableFilter hook:
 * - Initial state setup
 * - Global search filtering
 * - Column-specific filtering
 * - Filter clearing
 * - applyFilters function
 */

import {
	applyFilters,
	useDataTableFilter,
} from '@core/ui/data-display/data-table/hooks/useDataTableFilter';
import type { DataTableColumn, DataTableFilter } from '@src-types/ui/dataTable';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
	age: number;
	email: string;
	active: boolean;
}

const createMockColumns = (): DataTableColumn<TestData>[] => [
	{
		id: 'name',
		header: 'Name',
		accessor: (row: TestData) => row.name,
		filterable: true,
	},
	{
		id: 'age',
		header: 'Age',
		accessor: (row: TestData) => row.age,
		filterable: true,
	},
	{
		id: 'email',
		header: 'Email',
		accessor: (row: TestData) => row.email,
		filterable: true,
	},
	{
		id: 'active',
		header: 'Active',
		accessor: (row: TestData) => row.active,
		filterable: true,
	},
];

const createMockData = (): TestData[] => [
	{ id: '1', name: 'Alice', age: 25, email: 'alice@example.com', active: true },
	{ id: '2', name: 'Bob', age: 30, email: 'bob@example.com', active: false },
	{ id: '3', name: 'Charlie', age: 35, email: 'charlie@example.com', active: true },
	{ id: '4', name: 'David', age: 28, email: 'david@example.com', active: true },
];

describe('useDataTableFilter', () => {
	describe('initial state', () => {
		it('should initialize with empty filter', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			expect(result.current.filter.globalSearch).toBe('');
			expect(result.current.filter.columnFilters).toEqual({});
		});

		it('should initialize with provided initialFilter', () => {
			const initialFilter = {
				globalSearch: 'test',
				columnFilters: { name: 'Alice' },
			};

			const { result } = renderHook(() => useDataTableFilter({ initialFilter }));

			expect(result.current.filter.globalSearch).toBe('test');
			expect(result.current.filter.columnFilters).toEqual({ name: 'Alice' });
		});
	});

	describe('setGlobalSearch', () => {
		it('should update global search value', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			act(() => {
				result.current.setGlobalSearch('test search');
			});

			expect(result.current.filter.globalSearch).toBe('test search');
		});

		it('should update global search multiple times', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			act(() => {
				result.current.setGlobalSearch('first');
			});
			expect(result.current.filter.globalSearch).toBe('first');

			act(() => {
				result.current.setGlobalSearch('second');
			});
			expect(result.current.filter.globalSearch).toBe('second');
		});

		it('should clear global search when set to empty string', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			act(() => {
				result.current.setGlobalSearch('test');
			});
			expect(result.current.filter.globalSearch).toBe('test');

			act(() => {
				result.current.setGlobalSearch('');
			});
			expect(result.current.filter.globalSearch).toBe('');
		});

		it('should call onFilterChange when provided', () => {
			const onFilterChange = vi.fn();
			const { result } = renderHook(() => useDataTableFilter({ onFilterChange }));

			act(() => {
				result.current.setGlobalSearch('test');
			});

			expect(onFilterChange).toHaveBeenCalledTimes(1);
			expect(onFilterChange).toHaveBeenCalledWith({
				globalSearch: 'test',
				columnFilters: {},
			});
		});
	});

	describe('setColumnFilter', () => {
		it('should set column filter value', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			act(() => {
				result.current.setColumnFilter('name', 'Alice');
			});

			expect(result.current.filter.columnFilters?.name).toBe('Alice');
		});

		it('should set multiple column filters', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			act(() => {
				result.current.setColumnFilter('name', 'Alice');
			});

			act(() => {
				result.current.setColumnFilter('age', '25');
			});

			expect(result.current.filter.columnFilters?.name).toBe('Alice');
			expect(result.current.filter.columnFilters?.age).toBe('25');
		});

		it('should update existing column filter', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			act(() => {
				result.current.setColumnFilter('name', 'Alice');
			});
			expect(result.current.filter.columnFilters?.name).toBe('Alice');

			act(() => {
				result.current.setColumnFilter('name', 'Bob');
			});
			expect(result.current.filter.columnFilters?.name).toBe('Bob');
		});

		it('should call onFilterChange when provided', () => {
			const onFilterChange = vi.fn();
			const { result } = renderHook(() => useDataTableFilter({ onFilterChange }));

			act(() => {
				result.current.setColumnFilter('name', 'Alice');
			});

			expect(onFilterChange).toHaveBeenCalledTimes(1);
			expect(onFilterChange).toHaveBeenCalledWith({
				globalSearch: '',
				columnFilters: { name: 'Alice' },
			});
		});
	});

	describe('clearFilter', () => {
		it('should clear all filters', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			act(() => {
				result.current.setGlobalSearch('test');
				result.current.setColumnFilter('name', 'Alice');
			});

			act(() => {
				result.current.clearFilter();
			});

			expect(result.current.filter.globalSearch).toBe('');
			expect(result.current.filter.columnFilters).toEqual({});
		});

		it('should call onFilterChange when provided', () => {
			const onFilterChange = vi.fn();
			const { result } = renderHook(() => useDataTableFilter({ onFilterChange }));

			act(() => {
				result.current.setGlobalSearch('test');
			});

			act(() => {
				result.current.clearFilter();
			});

			expect(onFilterChange).toHaveBeenCalledWith({
				globalSearch: '',
				columnFilters: {},
			});
		});
	});

	describe('clearColumnFilter', () => {
		it('should clear specific column filter', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			act(() => {
				result.current.setColumnFilter('name', 'Alice');
				result.current.setColumnFilter('age', '25');
			});

			act(() => {
				result.current.clearColumnFilter('name');
			});

			expect(result.current.filter.columnFilters?.name).toBeUndefined();
			expect(result.current.filter.columnFilters?.age).toBe('25');
		});

		it('should not affect global search', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			act(() => {
				result.current.setGlobalSearch('test');
			});

			act(() => {
				result.current.setColumnFilter('name', 'Alice');
			});

			act(() => {
				result.current.clearColumnFilter('name');
			});

			expect(result.current.filter.globalSearch).toBe('test');
			expect(result.current.filter.columnFilters?.name).toBeUndefined();
		});

		it('should handle clearing non-existent column filter', () => {
			const { result } = renderHook(() => useDataTableFilter({}));

			act(() => {
				result.current.clearColumnFilter('nonexistent');
			});

			expect(result.current.filter.columnFilters).toEqual({});
		});

		it('should call onFilterChange when provided', () => {
			const onFilterChange = vi.fn();
			const { result } = renderHook(() => useDataTableFilter({ onFilterChange }));

			act(() => {
				result.current.setColumnFilter('name', 'Alice');
			});

			act(() => {
				result.current.clearColumnFilter('name');
			});

			expect(onFilterChange).toHaveBeenCalledWith({
				globalSearch: '',
				columnFilters: {},
			});
		});
	});
});

describe('applyFilters', () => {
	const columns = createMockColumns();
	const data = createMockData();

	describe('global search', () => {
		it('should filter by global search across all columns', () => {
			const filter = { globalSearch: 'alice', columnFilters: {} };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(1);
			expect(filtered[0]?.name).toBe('Alice');
		});

		it('should be case-insensitive', () => {
			const filter = { globalSearch: 'ALICE', columnFilters: {} };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(1);
			expect(filtered[0]?.name).toBe('Alice');
		});

		it('should search across multiple columns', () => {
			const filter = { globalSearch: 'example.com', columnFilters: {} };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(4);
		});

		it('should handle empty global search', () => {
			const filter = { globalSearch: '', columnFilters: {} };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(4);
		});

		it('should handle whitespace-only global search', () => {
			const filter = { globalSearch: '   ', columnFilters: {} };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(4);
		});

		it('should search in number columns', () => {
			const filter = { globalSearch: '25', columnFilters: {} };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(1);
			expect(filtered[0]?.age).toBe(25);
		});

		it('should search in boolean columns', () => {
			const filter = { globalSearch: 'true', columnFilters: {} };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered.length).toBeGreaterThan(0);
		});
	});

	describe('column filters', () => {
		it('should filter by column-specific filter', () => {
			const filter = { globalSearch: '', columnFilters: { name: 'Alice' } };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(1);
			expect(filtered[0]?.name).toBe('Alice');
		});

		it('should filter by multiple column filters', () => {
			const filter = {
				globalSearch: '',
				columnFilters: { name: 'a', age: '2' },
			};
			const filtered = applyFilters(data, filter, columns);

			// Should match rows where name contains 'a' AND age contains '2'
			expect(filtered.length).toBeGreaterThan(0);
		});

		it('should handle non-existent column filter', () => {
			const filter = { globalSearch: '', columnFilters: { nonexistent: 'value' } };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(4);
		});

		it('should handle empty column filter value', () => {
			const filter = { globalSearch: '', columnFilters: { name: '' } };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(4);
		});

		it('should handle whitespace-only column filter value', () => {
			const filter = { globalSearch: '', columnFilters: { name: '   ' } };
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(4);
		});

		it('should use custom columnFilterFn when provided', () => {
			const customColumns: DataTableColumn<TestData>[] = [
				{
					id: 'age',
					header: 'Age',
					accessor: (row: TestData) => row.age,
					columnFilterFn: (row, filterValue) => row.age >= Number.parseInt(filterValue, 10),
				},
			];

			const filter = { globalSearch: '', columnFilters: { age: '30' } };
			const filtered = applyFilters(data, filter, customColumns);

			expect(filtered.length).toBeGreaterThan(0);
			for (const row of filtered) {
				expect(row.age).toBeGreaterThanOrEqual(30);
			}
		});
	});

	describe('custom filter', () => {
		it('should apply custom filter function', () => {
			const filter: DataTableFilter = {
				globalSearch: '',
				columnFilters: {},
				customFilter: (row: unknown) => (row as TestData).active,
			};
			const filtered = applyFilters(data, filter, columns);

			expect(filtered.length).toBeGreaterThan(0);
			for (const row of filtered) {
				expect(row.active).toBe(true);
			}
		});

		it('should combine custom filter with other filters', () => {
			const filter: DataTableFilter = {
				globalSearch: 'a',
				columnFilters: {},
				customFilter: (row: unknown) => (row as TestData).age > 25,
			};
			const filtered = applyFilters(data, filter, columns);

			// Should match rows with 'a' in any column AND age > 25
			for (const row of filtered) {
				expect(row.age).toBeGreaterThan(25);
				expect(row.name.toLowerCase().includes('a') || row.email.toLowerCase().includes('a')).toBe(
					true
				);
			}
		});
	});

	describe('combined filters', () => {
		it('should apply global search and column filters together', () => {
			const filter = {
				globalSearch: 'example',
				columnFilters: { name: 'Alice' },
			};
			const filtered = applyFilters(data, filter, columns);

			expect(filtered).toHaveLength(1);
			expect(filtered[0]?.name).toBe('Alice');
		});

		it('should apply all filter types together', () => {
			const filter: DataTableFilter = {
				globalSearch: 'example',
				columnFilters: { name: 'a' },
				customFilter: (row: unknown) => (row as TestData).active,
			};
			const filtered = applyFilters(data, filter, columns);

			for (const row of filtered) {
				expect(row.active).toBe(true);
				expect(row.name.toLowerCase()).toContain('a');
				expect(row.email).toContain('example');
			}
		});
	});

	describe('edge cases', () => {
		it('should handle empty data array', () => {
			const filter = { globalSearch: 'test', columnFilters: {} };
			const filtered = applyFilters([], filter, columns);

			expect(filtered).toHaveLength(0);
		});

		it('should handle null/undefined values in data', () => {
			const dataWithNulls: TestData[] = [
				{ id: '1', name: 'Alice', age: 25, email: 'alice@example.com', active: true },
				{ id: '2', name: 'Bob', age: 30, email: '', active: false },
			];

			const columnsWithNulls: DataTableColumn<TestData>[] = [
				{
					id: 'email',
					header: 'Email',
					accessor: (row: TestData) => row.email || null,
				},
			];

			const filter = { globalSearch: 'alice', columnFilters: {} };
			const filtered = applyFilters(dataWithNulls, filter, columnsWithNulls);

			expect(filtered).toHaveLength(1);
		});

		it('should handle complex object values', () => {
			const complexData = [
				{ id: '1', name: 'Alice', age: 25, email: 'alice@example.com', active: true },
			];

			const filter = { globalSearch: 'alice', columnFilters: {} };
			const filtered = applyFilters(complexData, filter, columns);

			expect(filtered).toHaveLength(1);
		});
	});
});
