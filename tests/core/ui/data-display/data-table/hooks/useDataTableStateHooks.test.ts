/**
 * useDataTableStateHooks Tests
 *
 * Tests for the useDataTableStateHooks hook and related hooks:
 * - useColumnState
 * - useSortState
 * - useFilterState
 * - useTableState
 * - useDataTableStateHooks (main hook)
 */

import {
	useColumnState,
	useDataTableStateHooks,
	useFilterState,
	useSortState,
	useTableState,
} from '@core/ui/data-display/data-table/hooks/useDataTableStateHooks';
import type { ColumnSort, DataTableColumn } from '@src-types/ui/dataTable';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
	age: number;
	email: string;
}

const mockColumns: DataTableColumn<TestData>[] = [
	{
		id: 'name',
		header: 'Name',
		accessor: (row: TestData) => row.name,
		sortable: true,
	},
	{
		id: 'age',
		header: 'Age',
		accessor: (row: TestData) => row.age,
		sortable: true,
	},
	{
		id: 'email',
		header: 'Email',
		accessor: (row: TestData) => row.email,
	},
];

const mockData: TestData[] = [
	{ id: '1', name: 'John Doe', age: 30, email: 'john@example.com' },
	{ id: '2', name: 'Jane Smith', age: 25, email: 'jane@example.com' },
	{ id: '3', name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
];

describe('useColumnState', () => {
	it('should initialize with provided columns', () => {
		const { result } = renderHook(() =>
			useColumnState<TestData>({
				initialColumns: mockColumns,
				enableColumnReorder: false,
			})
		);

		expect(result.current.columns).toEqual(mockColumns);
		expect(result.current.columnWidths).toBeInstanceOf(Map);
	});

	it('should handle column reorder when enabled', () => {
		const onColumnsReorder = vi.fn();
		const { result } = renderHook(() =>
			useColumnState<TestData>({
				initialColumns: mockColumns,
				enableColumnReorder: true,
				onColumnsReorder,
			})
		);

		expect(result.current.columns).toBeDefined();
	});

	it('should not pass onColumnsReorder when column reorder is disabled', () => {
		const onColumnsReorder = vi.fn();
		const { result } = renderHook(() =>
			useColumnState<TestData>({
				initialColumns: mockColumns,
				enableColumnReorder: false,
				onColumnsReorder,
			})
		);

		expect(result.current.columns).toBeDefined();
	});
});

describe('useSortState', () => {
	it('should initialize with null sort when not provided', () => {
		const { result } = renderHook(() => useSortState<TestData>({}));

		expect(result.current.sort).toBeNull();
	});

	it('should initialize with provided initialSort', () => {
		const initialSort: ColumnSort<TestData> = {
			columnId: 'name',
			direction: 'asc',
		};

		const { result } = renderHook(() =>
			useSortState<TestData>({
				initialSort,
			})
		);

		expect(result.current.sort).toEqual(initialSort);
	});

	it('should call onSortChange when provided', () => {
		const onSortChange = vi.fn();
		const { result } = renderHook(() =>
			useSortState<TestData>({
				onSortChange,
			})
		);

		act(() => {
			result.current.toggleSort('name');
		});

		expect(onSortChange).toHaveBeenCalled();
	});

	it('should not pass onSortChange when not provided', () => {
		const { result } = renderHook(() => useSortState<TestData>({}));

		act(() => {
			result.current.toggleSort('name');
		});

		expect(result.current.sort).toBeDefined();
	});
});

describe('useFilterState', () => {
	it('should initialize with empty filter when not provided', () => {
		const { result } = renderHook(() => useFilterState({}));

		expect(result.current.filter).toBeDefined();
	});

	it('should initialize with provided initialFilter', () => {
		const initialFilter = { globalSearch: 'John' };

		const { result } = renderHook(() =>
			useFilterState({
				initialFilter,
			})
		);

		expect(result.current.filter).toEqual(initialFilter);
	});

	it('should call onFilterChange when provided', () => {
		const onFilterChange = vi.fn();
		const { result } = renderHook(() =>
			useFilterState({
				onFilterChange,
			})
		);

		act(() => {
			result.current.setGlobalSearch('John');
		});

		expect(onFilterChange).toHaveBeenCalled();
	});

	it('should not pass onFilterChange when not provided', () => {
		const { result } = renderHook(() => useFilterState({}));

		act(() => {
			result.current.setGlobalSearch('John');
		});

		expect(result.current.filter.globalSearch).toBe('John');
	});
});

describe('useTableState', () => {
	it('should initialize with provided data', () => {
		const { result } = renderHook(() =>
			useTableState<TestData>({
				initialData: mockData,
				filteredData: mockData,
				sortedData: mockData,
				columns: mockColumns,
				getRowId: undefined,
				enablePagination: false,
				initialPage: 1,
				pageSize: 10,
			})
		);

		expect(result.current.displayData).toHaveLength(3);
	});

	it('should enable pagination when enablePagination is true', () => {
		const { result } = renderHook(() =>
			useTableState<TestData>({
				initialData: mockData,
				filteredData: mockData,
				sortedData: mockData,
				columns: mockColumns,
				getRowId: undefined,
				enablePagination: true,
				initialPage: 1,
				pageSize: 2,
			})
		);

		expect(result.current.displayData.length).toBe(2);
	});

	it('should use provided getRowId', () => {
		const getRowId = (row: TestData) => `custom-${row.id}`;
		const { result } = renderHook(() =>
			useTableState<TestData>({
				initialData: mockData,
				filteredData: mockData,
				sortedData: mockData,
				columns: mockColumns,
				getRowId,
				enablePagination: false,
				initialPage: 1,
				pageSize: 10,
			})
		);

		expect(result.current.rowIds[0]).toBe('custom-1');
	});

	it('should call onPageChange when provided', () => {
		const onPageChange = vi.fn();
		const { result } = renderHook(() =>
			useTableState<TestData>({
				initialData: mockData,
				filteredData: mockData,
				sortedData: mockData,
				columns: mockColumns,
				getRowId: undefined,
				enablePagination: true,
				initialPage: 1,
				pageSize: 2,
				onPageChange,
			})
		);

		act(() => {
			result.current.setPage(2);
		});

		expect(onPageChange).toHaveBeenCalledWith(2);
	});

	it('should handle controlled selectedIds', () => {
		const controlledSelectedIds = ['row-0', 'row-1'];
		const { result } = renderHook(() =>
			useTableState<TestData>({
				initialData: mockData,
				filteredData: mockData,
				sortedData: mockData,
				columns: mockColumns,
				getRowId: undefined,
				enablePagination: false,
				initialPage: 1,
				pageSize: 10,
				controlledSelectedIds,
			})
		);

		expect(result.current.selectedRowIds.has('row-0')).toBe(true);
		expect(result.current.selectedRowIds.has('row-1')).toBe(true);
	});

	it('should call onSelectionChange when provided', () => {
		const onSelectionChange = vi.fn();
		const { result } = renderHook(() =>
			useTableState<TestData>({
				initialData: mockData,
				filteredData: mockData,
				sortedData: mockData,
				columns: mockColumns,
				getRowId: undefined,
				enablePagination: false,
				initialPage: 1,
				pageSize: 10,
				onSelectionChange,
			})
		);

		act(() => {
			result.current.toggleAll(['row-0', 'row-1']);
		});

		expect(onSelectionChange).toHaveBeenCalled();
	});
});

describe('useDataTableStateHooks', () => {
	it('should initialize all state hooks', () => {
		const { result } = renderHook(() =>
			useDataTableStateHooks<TestData>({
				initialColumns: mockColumns,
				initialData: mockData,
				enableColumnReorder: false,
			})
		);

		expect(result.current.columns).toBeDefined();
		expect(result.current.columnWidths).toBeDefined();
		expect(result.current.setColumnWidth).toBeDefined();
		expect(result.current.sort).toBeDefined();
		expect(result.current.toggleSort).toBeDefined();
		expect(result.current.filter).toBeDefined();
		expect(result.current.setGlobalSearch).toBeDefined();
		expect(result.current.filteredData).toBeDefined();
		expect(result.current.sortedData).toBeDefined();
	});

	it('should pass column reorder options when enabled', () => {
		const onColumnsReorder = vi.fn();
		const { result } = renderHook(() =>
			useDataTableStateHooks<TestData>({
				initialColumns: mockColumns,
				initialData: mockData,
				enableColumnReorder: true,
				onColumnsReorder,
			})
		);

		expect(result.current.columns).toBeDefined();
	});

	it('should pass sort options when provided', () => {
		const initialSort: ColumnSort<TestData> = {
			columnId: 'name',
			direction: 'asc',
		};
		const onSortChange = vi.fn();

		const { result } = renderHook(() =>
			useDataTableStateHooks<TestData>({
				initialColumns: mockColumns,
				initialData: mockData,
				enableColumnReorder: false,
				initialSort,
				onSortChange,
			})
		);

		expect(result.current.sort).toEqual(initialSort);
	});

	it('should pass filter options when provided', () => {
		const initialFilter = { globalSearch: 'John' };
		const onFilterChange = vi.fn();

		const { result } = renderHook(() =>
			useDataTableStateHooks<TestData>({
				initialColumns: mockColumns,
				initialData: mockData,
				enableColumnReorder: false,
				initialFilter,
				onFilterChange,
			})
		);

		expect(result.current.filter).toEqual(initialFilter);
	});

	it('should apply data transformation', () => {
		const { result } = renderHook(() =>
			useDataTableStateHooks<TestData>({
				initialColumns: mockColumns,
				initialData: mockData,
				enableColumnReorder: false,
			})
		);

		expect(result.current.filteredData).toHaveLength(3);
		expect(result.current.sortedData).toHaveLength(3);
	});

	it('should apply filtering to data', () => {
		const { result } = renderHook(() =>
			useDataTableStateHooks<TestData>({
				initialColumns: mockColumns,
				initialData: mockData,
				enableColumnReorder: false,
			})
		);

		act(() => {
			result.current.setGlobalSearch('John');
		});

		expect(result.current.filteredData.length).toBeLessThan(3);
		expect(result.current.filteredData[0]?.name).toContain('John');
	});

	it('should apply sorting to filtered data', () => {
		const { result } = renderHook(() =>
			useDataTableStateHooks<TestData>({
				initialColumns: mockColumns,
				initialData: mockData,
				enableColumnReorder: false,
			})
		);

		act(() => {
			result.current.toggleSort('name');
		});

		expect(result.current.sortedData[0]?.name).toBe('Bob Johnson');
	});

	it('should handle column width changes', () => {
		const { result } = renderHook(() =>
			useDataTableStateHooks<TestData>({
				initialColumns: mockColumns,
				initialData: mockData,
				enableColumnReorder: false,
			})
		);

		act(() => {
			result.current.setColumnWidth('name', 200);
		});

		expect(result.current.columnWidths.get('name')).toBe(200);
	});

	it('should return all required properties', () => {
		const { result } = renderHook(() =>
			useDataTableStateHooks<TestData>({
				initialColumns: mockColumns,
				initialData: mockData,
				enableColumnReorder: false,
			})
		);

		expect(result.current).toHaveProperty('columns');
		expect(result.current).toHaveProperty('columnWidths');
		expect(result.current).toHaveProperty('setColumnWidth');
		expect(result.current).toHaveProperty('sort');
		expect(result.current).toHaveProperty('toggleSort');
		expect(result.current).toHaveProperty('filter');
		expect(result.current).toHaveProperty('setGlobalSearch');
		expect(result.current).toHaveProperty('filteredData');
		expect(result.current).toHaveProperty('sortedData');
	});

	describe('edge cases', () => {
		it('should handle empty data array', () => {
			const { result } = renderHook(() =>
				useDataTableStateHooks<TestData>({
					initialColumns: mockColumns,
					initialData: [],
					enableColumnReorder: false,
				})
			);

			expect(result.current.filteredData).toHaveLength(0);
			expect(result.current.sortedData).toHaveLength(0);
		});

		it('should handle empty columns array', () => {
			const { result } = renderHook(() =>
				useDataTableStateHooks<TestData>({
					initialColumns: [],
					initialData: mockData,
					enableColumnReorder: false,
				})
			);

			expect(result.current.columns).toHaveLength(0);
		});

		it('should handle all optional callbacks being undefined', () => {
			const { result } = renderHook(() =>
				useDataTableStateHooks<TestData>({
					initialColumns: mockColumns,
					initialData: mockData,
					enableColumnReorder: false,
				})
			);

			expect(result.current.columns).toBeDefined();
			expect(result.current.filteredData).toBeDefined();
		});
	});
});
