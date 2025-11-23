/**
 * useDataTableStateBuilders.hooks Tests
 *
 * Tests for the buildStateHooksOptions function:
 * - Required parameters are included
 * - Optional callbacks are conditionally included
 * - All combinations of optional parameters
 */

import { buildStateHooksOptions } from '@core/ui/data-display/data-table/state/useDataTableStateBuilders.hooks';
import type { ColumnSort, DataTableColumn, DataTableFilter } from '@src-types/ui/dataTable';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
	age: number;
}

const createMockColumns = (): DataTableColumn<TestData>[] => [
	{
		id: 'name',
		header: 'Name',
		accessor: (row: TestData) => row.name,
	},
	{
		id: 'age',
		header: 'Age',
		accessor: (row: TestData) => row.age,
	},
];

const createMockData = (): TestData[] => [
	{ id: '1', name: 'Alice', age: 25 },
	{ id: '2', name: 'Bob', age: 30 },
];

describe('buildStateHooksOptions', () => {
	it('should build options with required parameters only', () => {
		const initialColumns = createMockColumns();
		const initialData = createMockData();
		const enableColumnReorder = true;

		const result = buildStateHooksOptions({
			initialColumns,
			initialData,
			enableColumnReorder,
		});

		expect(result).toEqual({
			initialColumns,
			initialData,
			enableColumnReorder,
		});
		expect(result.onColumnsReorder).toBeUndefined();
		expect(result.initialSort).toBeUndefined();
		expect(result.onSortChange).toBeUndefined();
		expect(result.initialFilter).toBeUndefined();
		expect(result.onFilterChange).toBeUndefined();
	});

	it('should build options with onColumnsReorder', () => {
		const initialColumns = createMockColumns();
		const initialData = createMockData();
		const enableColumnReorder = true;
		const onColumnsReorder = vi.fn();

		const result = buildStateHooksOptions({
			initialColumns,
			initialData,
			enableColumnReorder,
			onColumnsReorder,
		});

		expect(result.onColumnsReorder).toBe(onColumnsReorder);
		expect(result.initialColumns).toEqual(initialColumns);
		expect(result.initialData).toEqual(initialData);
		expect(result.enableColumnReorder).toBe(true);
	});

	it('should build options with initialSort', () => {
		const initialColumns = createMockColumns();
		const initialData = createMockData();
		const enableColumnReorder = false;
		const initialSort: ColumnSort<TestData> = {
			columnId: 'name',
			direction: 'asc',
		};

		const result = buildStateHooksOptions({
			initialColumns,
			initialData,
			enableColumnReorder,
			initialSort,
		});

		expect(result.initialSort).toEqual(initialSort);
		expect(result.initialColumns).toEqual(initialColumns);
	});

	it('should build options with onSortChange', () => {
		const initialColumns = createMockColumns();
		const initialData = createMockData();
		const enableColumnReorder = true;
		const onSortChange = vi.fn();

		const result = buildStateHooksOptions({
			initialColumns,
			initialData,
			enableColumnReorder,
			onSortChange,
		});

		expect(result.onSortChange).toBe(onSortChange);
		expect(result.initialSort).toBeUndefined();
	});

	it('should build options with initialFilter', () => {
		const initialColumns = createMockColumns();
		const initialData = createMockData();
		const enableColumnReorder = true;
		const initialFilter: DataTableFilter = {
			globalSearch: 'test',
		};

		const result = buildStateHooksOptions({
			initialColumns,
			initialData,
			enableColumnReorder,
			initialFilter,
		});

		expect(result.initialFilter).toEqual(initialFilter);
		expect(result.onFilterChange).toBeUndefined();
	});

	it('should build options with onFilterChange', () => {
		const initialColumns = createMockColumns();
		const initialData = createMockData();
		const enableColumnReorder = true;
		const onFilterChange = vi.fn();

		const result = buildStateHooksOptions({
			initialColumns,
			initialData,
			enableColumnReorder,
			onFilterChange,
		});

		expect(result.onFilterChange).toBe(onFilterChange);
		expect(result.initialFilter).toBeUndefined();
	});

	it('should build options with all optional parameters', () => {
		const initialColumns = createMockColumns();
		const initialData = createMockData();
		const enableColumnReorder = true;
		const onColumnsReorder = vi.fn();
		const initialSort: ColumnSort<TestData> = {
			columnId: 'age',
			direction: 'desc',
		};
		const onSortChange = vi.fn();
		const initialFilter: DataTableFilter = {
			globalSearch: 'search',
			columnFilters: { name: 'Alice' },
		};
		const onFilterChange = vi.fn();

		const result = buildStateHooksOptions({
			initialColumns,
			initialData,
			enableColumnReorder,
			onColumnsReorder,
			initialSort,
			onSortChange,
			initialFilter,
			onFilterChange,
		});

		expect(result).toEqual({
			initialColumns,
			initialData,
			enableColumnReorder,
			onColumnsReorder,
			initialSort,
			onSortChange,
			initialFilter,
			onFilterChange,
		});
	});

	it('should handle empty columns array', () => {
		const initialColumns: DataTableColumn<TestData>[] = [];
		const initialData = createMockData();
		const enableColumnReorder = false;

		const result = buildStateHooksOptions({
			initialColumns,
			initialData,
			enableColumnReorder,
		});

		expect(result.initialColumns).toEqual([]);
		expect(result.initialData).toEqual(initialData);
	});

	it('should handle empty data array', () => {
		const initialColumns = createMockColumns();
		const initialData: TestData[] = [];
		const enableColumnReorder = true;

		const result = buildStateHooksOptions({
			initialColumns,
			initialData,
			enableColumnReorder,
		});

		expect(result.initialData).toEqual([]);
		expect(result.initialColumns).toEqual(initialColumns);
	});

	it('should preserve object references', () => {
		const initialColumns = createMockColumns();
		const initialData = createMockData();
		const enableColumnReorder = true;
		const initialSort: ColumnSort<TestData> = {
			columnId: 'name',
			direction: 'asc',
		};
		const initialFilter: DataTableFilter = {
			globalSearch: 'test',
		};

		const result = buildStateHooksOptions({
			initialColumns,
			initialData,
			enableColumnReorder,
			initialSort,
			initialFilter,
		});

		expect(result.initialColumns).toBe(initialColumns);
		expect(result.initialData).toBe(initialData);
		expect(result.initialSort).toBe(initialSort);
		expect(result.initialFilter).toBe(initialFilter);
	});
});
