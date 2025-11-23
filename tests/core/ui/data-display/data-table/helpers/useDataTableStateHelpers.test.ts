/**
 * useDataTableStateHelpers Tests
 *
 * Tests for helper functions:
 * - useDataTableDataTransformation
 * - createDataTableHandlers
 */

import {
	createDataTableHandlers,
	useDataTableDataTransformation,
} from '@core/ui/data-display/data-table/helpers/useDataTableStateHelpers';
import { useDataTableFilter } from '@core/ui/data-display/data-table/hooks/useDataTableFilter';
import { useDataTableSort } from '@core/ui/data-display/data-table/hooks/useDataTableSort';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
	age: number;
	email: string;
}

const createMockColumns = (): DataTableColumn<TestData>[] => [
	{
		id: 'name',
		header: 'Name',
		accessor: (row: TestData) => row.name,
		filterable: true,
		sortable: true,
	},
	{
		id: 'age',
		header: 'Age',
		accessor: (row: TestData) => row.age,
		filterable: true,
		sortable: true,
	},
	{
		id: 'email',
		header: 'Email',
		accessor: (row: TestData) => row.email,
		filterable: true,
		sortable: true,
	},
];

const createMockData = (): TestData[] => [
	{ id: '1', name: 'Alice', age: 25, email: 'alice@example.com' },
	{ id: '2', name: 'Bob', age: 30, email: 'bob@example.com' },
	{ id: '3', name: 'Charlie', age: 35, email: 'charlie@example.com' },
	{ id: '4', name: 'David', age: 28, email: 'david@example.com' },
];

describe('useDataTableDataTransformation', () => {
	it('should return filtered and sorted data', () => {
		const initialData = createMockData();
		const columns = createMockColumns();

		const { result: filterResult } = renderHook(() => useDataTableFilter({}));
		const { result: sortResult } = renderHook(() => useDataTableSort<TestData>({}));

		const { result } = renderHook(() =>
			useDataTableDataTransformation({
				initialData,
				filter: filterResult.current.filter,
				columns,
				sort: sortResult.current.sort,
			})
		);

		expect(result.current.filteredData).toBeDefined();
		expect(result.current.sortedData).toBeDefined();
		expect(result.current.filteredData).toHaveLength(4);
		expect(result.current.sortedData).toHaveLength(4);
	});

	it('should apply filters correctly', () => {
		const initialData = createMockData();
		const columns = createMockColumns();

		const { result: filterResult } = renderHook(() => useDataTableFilter({}));
		const { result: sortResult } = renderHook(() => useDataTableSort<TestData>({}));

		// Set a global search filter
		filterResult.current.setGlobalSearch('Alice');

		const { result } = renderHook(() =>
			useDataTableDataTransformation({
				initialData,
				filter: filterResult.current.filter,
				columns,
				sort: sortResult.current.sort,
			})
		);

		expect(result.current.filteredData).toHaveLength(1);
		expect(result.current.filteredData[0]?.name).toBe('Alice');
	});

	it('should apply sorting correctly', () => {
		const initialData = createMockData();
		const columns = createMockColumns();

		const { result: filterResult } = renderHook(() => useDataTableFilter({}));
		const { result: sortResult } = renderHook(() => useDataTableSort<TestData>({}));

		// Set sort by name ascending
		sortResult.current.setSort('name', 'asc');

		const { result } = renderHook(() =>
			useDataTableDataTransformation({
				initialData,
				filter: filterResult.current.filter,
				columns,
				sort: sortResult.current.sort,
			})
		);

		expect(result.current.sortedData[0]?.name).toBe('Alice');
		expect(result.current.sortedData[1]?.name).toBe('Bob');
		expect(result.current.sortedData[2]?.name).toBe('Charlie');
		expect(result.current.sortedData[3]?.name).toBe('David');
	});

	it('should apply both filters and sorting', () => {
		const initialData = createMockData();
		const columns = createMockColumns();

		const { result: filterResult } = renderHook(() => useDataTableFilter({}));
		const { result: sortResult } = renderHook(() => useDataTableSort<TestData>({}));

		// Set filter and sort
		filterResult.current.setGlobalSearch('a');
		sortResult.current.setSort('age', 'desc');

		const { result } = renderHook(() =>
			useDataTableDataTransformation({
				initialData,
				filter: filterResult.current.filter,
				columns,
				sort: sortResult.current.sort,
			})
		);

		// Should filter to Alice, Charlie, and David (all have 'a' in name or email)
		expect(result.current.filteredData.length).toBeGreaterThan(0);
		// Should be sorted by age descending
		if (result.current.sortedData.length > 1) {
			expect(result.current.sortedData[0]?.age).toBeGreaterThanOrEqual(
				result.current.sortedData[1]?.age ?? 0
			);
		}
	});

	it('should handle empty data', () => {
		const initialData: TestData[] = [];
		const columns = createMockColumns();

		const { result: filterResult } = renderHook(() => useDataTableFilter({}));
		const { result: sortResult } = renderHook(() => useDataTableSort<TestData>({}));

		const { result } = renderHook(() =>
			useDataTableDataTransformation({
				initialData,
				filter: filterResult.current.filter,
				columns,
				sort: sortResult.current.sort,
			})
		);

		expect(result.current.filteredData).toHaveLength(0);
		expect(result.current.sortedData).toHaveLength(0);
	});

	it('should update when filter changes', () => {
		const initialData = createMockData();
		const columns = createMockColumns();

		const { result: filterResult } = renderHook(() => useDataTableFilter({}));
		const { result: sortResult } = renderHook(() => useDataTableSort<TestData>({}));

		const { result, rerender } = renderHook(() =>
			useDataTableDataTransformation({
				initialData,
				filter: filterResult.current.filter,
				columns,
				sort: sortResult.current.sort,
			})
		);

		expect(result.current.filteredData).toHaveLength(4);

		filterResult.current.setGlobalSearch('Bob');
		rerender();

		expect(result.current.filteredData).toHaveLength(1);
		expect(result.current.filteredData[0]?.name).toBe('Bob');
	});

	it('should update when sort changes', () => {
		const initialData = createMockData();
		const columns = createMockColumns();

		const { result: filterResult } = renderHook(() => useDataTableFilter({}));
		const { result: sortResult } = renderHook(() => useDataTableSort<TestData>({}));

		const { result, rerender } = renderHook(() =>
			useDataTableDataTransformation({
				initialData,
				filter: filterResult.current.filter,
				columns,
				sort: sortResult.current.sort,
			})
		);

		sortResult.current.setSort('age', 'asc');
		rerender();

		expect(result.current.sortedData[0]?.age).toBe(25);
		expect(result.current.sortedData.at(-1)?.age).toBe(35);
	});
});

describe('createDataTableHandlers', () => {
	it('should create handlers with correct functions', () => {
		const setColumnWidth = vi.fn();
		const toggleSort = vi.fn();
		const toggleAll = vi.fn();

		const handlers = createDataTableHandlers({
			setColumnWidth,
			toggleSort,
			toggleAll,
		});

		expect(handlers.handleColumnResize).toBeDefined();
		expect(handlers.handleSort).toBeDefined();
		expect(handlers.handleSelectAll).toBeDefined();
		expect(typeof handlers.handleColumnResize).toBe('function');
		expect(typeof handlers.handleSort).toBe('function');
		expect(typeof handlers.handleSelectAll).toBe('function');
	});

	it('should call setColumnWidth when column resize is enabled', () => {
		const setColumnWidth = vi.fn();
		const toggleSort = vi.fn();
		const toggleAll = vi.fn();

		const handlers = createDataTableHandlers({
			setColumnWidth,
			toggleSort,
			toggleAll,
		});

		handlers.handleColumnResize('column-1', 200, true);

		expect(setColumnWidth).toHaveBeenCalledTimes(1);
		expect(setColumnWidth).toHaveBeenCalledWith('column-1', 200);
	});

	it('should not call setColumnWidth when column resize is disabled', () => {
		const setColumnWidth = vi.fn();
		const toggleSort = vi.fn();
		const toggleAll = vi.fn();

		const handlers = createDataTableHandlers({
			setColumnWidth,
			toggleSort,
			toggleAll,
		});

		handlers.handleColumnResize('column-1', 200, false);

		expect(setColumnWidth).not.toHaveBeenCalled();
	});

	it('should call toggleSort when sorting is enabled', () => {
		const setColumnWidth = vi.fn();
		const toggleSort = vi.fn();
		const toggleAll = vi.fn();

		const handlers = createDataTableHandlers({
			setColumnWidth,
			toggleSort,
			toggleAll,
		});

		handlers.handleSort('column-1', true);

		expect(toggleSort).toHaveBeenCalledTimes(1);
		expect(toggleSort).toHaveBeenCalledWith('column-1');
	});

	it('should not call toggleSort when sorting is disabled', () => {
		const setColumnWidth = vi.fn();
		const toggleSort = vi.fn();
		const toggleAll = vi.fn();

		const handlers = createDataTableHandlers({
			setColumnWidth,
			toggleSort,
			toggleAll,
		});

		handlers.handleSort('column-1', false);

		expect(toggleSort).not.toHaveBeenCalled();
	});

	it('should call toggleAll when row selection is enabled', () => {
		const setColumnWidth = vi.fn();
		const toggleSort = vi.fn();
		const toggleAll = vi.fn();

		const handlers = createDataTableHandlers({
			setColumnWidth,
			toggleSort,
			toggleAll,
		});

		const rowIds = ['row-1', 'row-2', 'row-3'];
		handlers.handleSelectAll(rowIds, true);

		expect(toggleAll).toHaveBeenCalledTimes(1);
		expect(toggleAll).toHaveBeenCalledWith(rowIds);
	});

	it('should not call toggleAll when row selection is disabled', () => {
		const setColumnWidth = vi.fn();
		const toggleSort = vi.fn();
		const toggleAll = vi.fn();

		const handlers = createDataTableHandlers({
			setColumnWidth,
			toggleSort,
			toggleAll,
		});

		const rowIds = ['row-1', 'row-2', 'row-3'];
		handlers.handleSelectAll(rowIds, false);

		expect(toggleAll).not.toHaveBeenCalled();
	});

	it('should handle multiple handler calls', () => {
		const setColumnWidth = vi.fn();
		const toggleSort = vi.fn();
		const toggleAll = vi.fn();

		const handlers = createDataTableHandlers({
			setColumnWidth,
			toggleSort,
			toggleAll,
		});

		handlers.handleColumnResize('column-1', 200, true);
		handlers.handleColumnResize('column-2', 300, true);
		handlers.handleSort('column-1', true);
		handlers.handleSort('column-2', true);
		handlers.handleSelectAll(['row-1'], true);
		handlers.handleSelectAll(['row-2'], true);

		expect(setColumnWidth).toHaveBeenCalledTimes(2);
		expect(toggleSort).toHaveBeenCalledTimes(2);
		expect(toggleAll).toHaveBeenCalledTimes(2);
	});

	it('should handle empty rowIds array', () => {
		const setColumnWidth = vi.fn();
		const toggleSort = vi.fn();
		const toggleAll = vi.fn();

		const handlers = createDataTableHandlers({
			setColumnWidth,
			toggleSort,
			toggleAll,
		});

		handlers.handleSelectAll([], true);

		expect(toggleAll).toHaveBeenCalledTimes(1);
		expect(toggleAll).toHaveBeenCalledWith([]);
	});

	it('should handle zero width for column resize', () => {
		const setColumnWidth = vi.fn();
		const toggleSort = vi.fn();
		const toggleAll = vi.fn();

		const handlers = createDataTableHandlers({
			setColumnWidth,
			toggleSort,
			toggleAll,
		});

		handlers.handleColumnResize('column-1', 0, true);

		expect(setColumnWidth).toHaveBeenCalledTimes(1);
		expect(setColumnWidth).toHaveBeenCalledWith('column-1', 0);
	});
});
