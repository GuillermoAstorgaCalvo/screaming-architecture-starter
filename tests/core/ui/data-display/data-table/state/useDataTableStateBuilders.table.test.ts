/**
 * useDataTableStateBuilders.table Tests
 *
 * Tests for the buildTableStateOptions and buildTableStateParams functions:
 * - Required parameters are included
 * - Optional callbacks are conditionally included
 * - Edge cases with different pagination settings
 */

import {
	buildTableStateOptions,
	buildTableStateParams,
} from '@core/ui/data-display/data-table/state/useDataTableStateBuilders.table';
import type { DataTableColumn } from '@src-types/ui/dataTable';
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
	{ id: '3', name: 'Charlie', age: 35 },
];

const getRowId = (row: TestData) => row.id;

describe('buildTableStateOptions', () => {
	it('should build options with required parameters only', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;

		const result = buildTableStateOptions({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
		});

		expect(result).toEqual({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
		});
		expect(result.onPageChange).toBeUndefined();
		expect(result.controlledSelectedIds).toBeUndefined();
		expect(result.onSelectionChange).toBeUndefined();
	});

	it('should build options with onPageChange', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;
		const onPageChange = vi.fn();

		const result = buildTableStateOptions({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
			onPageChange,
		});

		expect(result.onPageChange).toBe(onPageChange);
		expect(result.enablePagination).toBe(true);
	});

	it('should build options with controlledSelectedIds', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = false;
		const initialPage = 0;
		const pageSize = 20;
		const controlledSelectedIds = ['1', '2'];

		const result = buildTableStateOptions({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
			controlledSelectedIds,
		});

		expect(result.controlledSelectedIds).toEqual(controlledSelectedIds);
		expect(result.enablePagination).toBe(false);
	});

	it('should build options with onSelectionChange', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 2;
		const pageSize = 5;
		const onSelectionChange = vi.fn();

		const result = buildTableStateOptions({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
			onSelectionChange,
		});

		expect(result.onSelectionChange).toBe(onSelectionChange);
		expect(result.initialPage).toBe(2);
		expect(result.pageSize).toBe(5);
	});

	it('should build options with all optional parameters', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;
		const onPageChange = vi.fn();
		const controlledSelectedIds = ['1', '3'];
		const onSelectionChange = vi.fn();

		const result = buildTableStateOptions({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
			onPageChange,
			controlledSelectedIds,
			onSelectionChange,
		});

		expect(result).toEqual({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
			onPageChange,
			controlledSelectedIds,
			onSelectionChange,
		});
	});

	it('should handle pagination disabled', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = false;
		const initialPage = 0;
		const pageSize = 0;

		const result = buildTableStateOptions({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
		});

		expect(result.enablePagination).toBe(false);
	});

	it('should handle empty data arrays', () => {
		const initialData: TestData[] = [];
		const filteredData: TestData[] = [];
		const sortedData: TestData[] = [];
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;

		const result = buildTableStateOptions({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
		});

		expect(result.initialData).toEqual([]);
		expect(result.filteredData).toEqual([]);
		expect(result.sortedData).toEqual([]);
	});

	it('should handle undefined getRowId', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;

		const result = buildTableStateOptions({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId: undefined,
			enablePagination,
			initialPage,
			pageSize,
		});

		expect(result.getRowId).toBeUndefined();
	});

	it('should preserve object references', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;

		const result = buildTableStateOptions({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
		});

		expect(result.initialData).toBe(initialData);
		expect(result.filteredData).toBe(filteredData);
		expect(result.sortedData).toBe(sortedData);
		expect(result.columns).toBe(columns);
		expect(result.getRowId).toBe(getRowId);
	});
});

describe('buildTableStateParams', () => {
	it('should build params with required parameters only', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;

		const result = buildTableStateParams({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
		});

		expect(result).toEqual({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
		});
		expect(result.onPageChange).toBeUndefined();
		expect(result.controlledSelectedIds).toBeUndefined();
		expect(result.onSelectionChange).toBeUndefined();
	});

	it('should build params with onPageChange', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;
		const onPageChange = vi.fn();

		const result = buildTableStateParams({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
			onPageChange,
		});

		expect(result.onPageChange).toBe(onPageChange);
	});

	it('should build params with controlledSelectedIds', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = false;
		const initialPage = 0;
		const pageSize = 20;
		const controlledSelectedIds = ['1', '2'];

		const result = buildTableStateParams({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
			controlledSelectedIds,
		});

		expect(result.controlledSelectedIds).toEqual(controlledSelectedIds);
	});

	it('should build params with onSelectionChange', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 2;
		const pageSize = 5;
		const onSelectionChange = vi.fn();

		const result = buildTableStateParams({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
			onSelectionChange,
		});

		expect(result.onSelectionChange).toBe(onSelectionChange);
	});

	it('should build params with all optional parameters', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;
		const onPageChange = vi.fn();
		const controlledSelectedIds = ['1', '3'];
		const onSelectionChange = vi.fn();

		const result = buildTableStateParams({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
			onPageChange,
			controlledSelectedIds,
			onSelectionChange,
		});

		expect(result).toEqual({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
			onPageChange,
			controlledSelectedIds,
			onSelectionChange,
		});
	});

	it('should handle empty data arrays', () => {
		const initialData: TestData[] = [];
		const filteredData: TestData[] = [];
		const sortedData: TestData[] = [];
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;

		const result = buildTableStateParams({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
		});

		expect(result.initialData).toEqual([]);
		expect(result.filteredData).toEqual([]);
		expect(result.sortedData).toEqual([]);
	});

	it('should preserve object references', () => {
		const initialData = createMockData();
		const filteredData = createMockData();
		const sortedData = createMockData();
		const columns = createMockColumns();
		const enablePagination = true;
		const initialPage = 1;
		const pageSize = 10;

		const result = buildTableStateParams({
			initialData,
			filteredData,
			sortedData,
			columns,
			getRowId,
			enablePagination,
			initialPage,
			pageSize,
		});

		expect(result.initialData).toBe(initialData);
		expect(result.filteredData).toBe(filteredData);
		expect(result.sortedData).toBe(sortedData);
		expect(result.columns).toBe(columns);
		expect(result.getRowId).toBe(getRowId);
	});
});
