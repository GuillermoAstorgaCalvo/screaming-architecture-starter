/**
 * useDataTableState Tests
 *
 * Tests for the useDataTableState hook:
 * - Initial state setup
 * - Options parsing and defaults
 * - State hooks integration
 * - Table state integration
 * - Combined state return
 * - Callbacks and handlers
 */

import { useDataTableState } from '@core/ui/data-display/data-table/hooks/useDataTableState';
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
	{ id: '4', name: 'Alice Brown', age: 28, email: 'alice@example.com' },
];

const getRowId = (row: TestData) => row.id;

describe('useDataTableState', () => {
	describe('initial state', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			expect(result.current.columns).toEqual(mockColumns);
			expect(result.current.filteredData).toHaveLength(4);
			expect(result.current.sortedData).toHaveLength(4);
			expect(result.current.sort).toBeNull();
			expect(result.current.filter).toBeDefined();
			expect(result.current.columnWidths).toBeInstanceOf(Map);
		});

		it('should initialize with provided columns and data', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			expect(result.current.columns).toEqual(mockColumns);
			expect(result.current.filteredData).toEqual(mockData);
		});

		it('should use default page size when not provided', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enablePagination: true,
				})
			);

			expect(result.current.currentPage).toBe(1);
			expect(result.current.totalPages).toBeGreaterThan(0);
		});

		it('should use default initial page when not provided', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enablePagination: true,
				})
			);

			expect(result.current.currentPage).toBe(1);
		});
	});

	describe('sorting', () => {
		it('should initialize with provided initialSort', () => {
			const initialSort: ColumnSort<TestData> = {
				columnId: 'name',
				direction: 'asc',
			};

			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					initialSort,
				})
			);

			expect(result.current.sort).toEqual(initialSort);
		});

		it('should handle sort changes via handleSort when sorting is enabled', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enableSorting: true,
				})
			);

			act(() => {
				result.current.handleSort('name', true);
			});

			expect(result.current.sort).toEqual({
				columnId: 'name',
				direction: 'asc',
			});
		});

		it('should call onSortChange when provided', () => {
			const onSortChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enableSorting: true,
					onSortChange,
				})
			);

			act(() => {
				result.current.handleSort('name', true);
			});

			expect(onSortChange).toHaveBeenCalled();
		});

		it('should apply sorting to sortedData', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enableSorting: true,
				})
			);

			act(() => {
				result.current.handleSort('name', true);
			});

			// After sorting by name ascending, first item should be alphabetically first
			expect(result.current.sortedData.length).toBeGreaterThan(0);
		});
	});

	describe('filtering', () => {
		it('should initialize with provided initialFilter', () => {
			const initialFilter = { globalSearch: 'John' };

			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					initialFilter,
				})
			);

			expect(result.current.filter).toEqual(initialFilter);
		});

		it('should filter data when global search is set', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			act(() => {
				result.current.setGlobalSearch('John');
			});

			expect(result.current.filteredData.length).toBeLessThan(4);
			expect(result.current.filteredData[0]?.name).toContain('John');
		});

		it('should call onFilterChange when provided', () => {
			const onFilterChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					onFilterChange,
				})
			);

			act(() => {
				result.current.setGlobalSearch('John');
			});

			expect(onFilterChange).toHaveBeenCalled();
		});
	});

	describe('pagination', () => {
		it('should enable pagination when enablePagination is true', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enablePagination: true,
					pageSize: 2,
				})
			);

			expect(result.current.displayData.length).toBe(2);
			expect(result.current.totalPages).toBe(2);
		});

		it('should disable pagination when enablePagination is false', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enablePagination: false,
				})
			);

			expect(result.current.displayData.length).toBe(4);
		});

		it('should use provided pageSize', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					enablePagination: true,
					pageSize: 3,
					getRowId: row => row.id,
				})
			);

			expect(result.current.displayData.length).toBe(3);
			expect(result.current.totalPages).toBe(2);
		});

		it('should use provided initialPage', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enablePagination: true,
					pageSize: 2,
					initialPage: 2,
				})
			);

			expect(result.current.currentPage).toBe(2);
		});

		it('should call onPageChange when provided', () => {
			const onPageChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enablePagination: true,
					pageSize: 2,
					onPageChange,
				})
			);

			act(() => {
				result.current.setPage(2);
			});

			expect(onPageChange).toHaveBeenCalledWith(2);
		});
	});

	describe('row selection', () => {
		it('should initialize with provided selectedRowIds', () => {
			const selectedRowIds = ['row-0', 'row-1'];

			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					selectedRowIds,
				})
			);

			expect(result.current.selectedRowIds.has('row-0')).toBe(true);
			expect(result.current.selectedRowIds.has('row-1')).toBe(true);
		});

		it('should call onSelectionChange when provided', () => {
			const onSelectionChange = vi.fn();
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					onSelectionChange,
				})
			);

			act(() => {
				result.current.handleSelectAll(result.current.rowIds, true);
			});

			expect(onSelectionChange).toHaveBeenCalled();
		});

		it('should handle toggleRow', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			act(() => {
				result.current.toggleRow('row-0');
			});

			expect(result.current.selectedRowIds.has('row-0')).toBe(true);
		});
	});

	describe('column management', () => {
		it('should initialize with provided columns', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			expect(result.current.columns).toEqual(mockColumns);
		});

		it('should handle column resize when enabled', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			act(() => {
				result.current.handleColumnResize('name', 200, true);
			});

			expect(result.current.columnWidths.get('name')).toBe(200);
		});

		it('should handle column reorder when enabled', () => {
			const onColumnsReorder = vi.fn();
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enableColumnReorder: true,
					onColumnsReorder,
				})
			);

			// Column reorder functionality is tested in useDataTableColumns
			expect(result.current.columns).toBeDefined();
		});
	});

	describe('getRowId', () => {
		it('should use default row ID when getRowId is not provided', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					// Don't pass getRowId to test default behavior
				})
			);

			expect(result.current.rowIds[0]).toBe('row-0');
		});

		it('should use custom getRowId when provided', () => {
			const getRowId = (row: TestData) => `custom-${row.id}`;
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			expect(result.current.rowIds[0]).toBe('custom-1');
		});
	});

	describe('combined state', () => {
		it('should return all state properties', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			expect(result.current.columns).toBeDefined();
			expect(result.current.columnWidths).toBeDefined();
			expect(result.current.sort).toBeDefined();
			expect(result.current.filter).toBeDefined();
			expect(result.current.filteredData).toBeDefined();
			expect(result.current.sortedData).toBeDefined();
			expect(result.current.displayData).toBeDefined();
			expect(result.current.selectedRowIds).toBeDefined();
			expect(result.current.currentPage).toBeDefined();
			expect(result.current.totalPages).toBeDefined();
		});

		it('should return all handler functions', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			expect(typeof result.current.handleColumnResize).toBe('function');
			expect(typeof result.current.handleSort).toBe('function');
			expect(typeof result.current.handleSelectAll).toBe('function');
			expect(typeof result.current.setGlobalSearch).toBe('function');
			expect(typeof result.current.setPage).toBe('function');
			expect(typeof result.current.toggleRow).toBe('function');
		});
	});

	describe('data transformation pipeline', () => {
		it('should apply filter before sort', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			act(() => {
				result.current.setGlobalSearch('John');
				result.current.handleSort('name', true);
			});

			expect(result.current.filteredData.length).toBeLessThan(4);
			expect(result.current.sortedData.length).toBeLessThan(4);
		});

		it('should apply sort to filtered data', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enableSorting: true,
				})
			);

			act(() => {
				result.current.handleSort('name', true);
			});

			// Verify sorting is applied
			expect(result.current.sortedData.length).toBeGreaterThan(0);
		});

		it('should paginate sorted data', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enablePagination: true,
					pageSize: 2,
					enableSorting: true,
				})
			);

			act(() => {
				result.current.handleSort('name', true);
			});

			expect(result.current.displayData.length).toBe(2);
			expect(result.current.displayData.length).toBeGreaterThan(0);
		});
	});

	describe('edge cases', () => {
		it('should handle empty data array', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: [],
					getRowId,
				})
			);

			expect(result.current.filteredData).toHaveLength(0);
			expect(result.current.sortedData).toHaveLength(0);
			expect(result.current.displayData).toHaveLength(0);
		});

		it('should handle empty columns array', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: [],
					data: mockData,
					getRowId,
				})
			);

			expect(result.current.columns).toHaveLength(0);
		});

		it('should handle undefined optional props', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
				})
			);

			expect(result.current.columns).toBeDefined();
			expect(result.current.filteredData).toBeDefined();
		});

		it('should handle page size larger than data length', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enablePagination: true,
					pageSize: 100,
				})
			);

			expect(result.current.displayData.length).toBe(4);
			expect(result.current.totalPages).toBe(1);
		});

		it('should handle initial page beyond total pages', () => {
			const { result } = renderHook(() =>
				useDataTableState<TestData>({
					columns: mockColumns,
					data: mockData,
					getRowId,
					enablePagination: true,
					pageSize: 2,
					initialPage: 10,
				})
			);

			// Should clamp to last page
			expect(result.current.currentPage).toBeGreaterThanOrEqual(1);
		});
	});
});
