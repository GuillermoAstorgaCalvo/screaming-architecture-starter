/**
 * useDataTableStateBuilders.column Tests
 *
 * Tests for the buildColumnStateOptions function:
 * - Required parameters are included
 * - Optional onColumnsReorder callback is conditionally included
 * - Edge cases with empty columns
 */

import { buildColumnStateOptions } from '@core/ui/data-display/data-table/state/useDataTableStateBuilders.column';
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
		sortable: true,
		filterable: true,
	},
	{
		id: 'age',
		header: 'Age',
		accessor: (row: TestData) => row.age,
		sortable: true,
		filterable: true,
	},
];

describe('buildColumnStateOptions', () => {
	it('should build options with required parameters only', () => {
		const initialColumns = createMockColumns();
		const enableColumnReorder = true;

		const result = buildColumnStateOptions(initialColumns, enableColumnReorder);

		expect(result).toEqual({
			initialColumns,
			enableColumnReorder,
		});
		expect(result.onColumnsReorder).toBeUndefined();
	});

	it('should build options with all parameters including onColumnsReorder', () => {
		const initialColumns = createMockColumns();
		const enableColumnReorder = true;
		const onColumnsReorder = vi.fn();

		const result = buildColumnStateOptions(initialColumns, enableColumnReorder, onColumnsReorder);

		expect(result).toEqual({
			initialColumns,
			enableColumnReorder,
			onColumnsReorder,
		});
	});

	it('should handle enableColumnReorder set to false', () => {
		const initialColumns = createMockColumns();
		const enableColumnReorder = false;

		const result = buildColumnStateOptions(initialColumns, enableColumnReorder);

		expect(result.enableColumnReorder).toBe(false);
		expect(result.initialColumns).toEqual(initialColumns);
	});

	it('should handle empty columns array', () => {
		const initialColumns: DataTableColumn<TestData>[] = [];
		const enableColumnReorder = true;

		const result = buildColumnStateOptions(initialColumns, enableColumnReorder);

		expect(result.initialColumns).toEqual([]);
		expect(result.enableColumnReorder).toBe(true);
	});

	it('should include onColumnsReorder when provided even with empty columns', () => {
		const initialColumns: DataTableColumn<TestData>[] = [];
		const enableColumnReorder = false;
		const onColumnsReorder = vi.fn();

		const result = buildColumnStateOptions(initialColumns, enableColumnReorder, onColumnsReorder);

		expect(result.onColumnsReorder).toBe(onColumnsReorder);
		expect(result.initialColumns).toEqual([]);
		expect(result.enableColumnReorder).toBe(false);
	});

	it('should preserve column references', () => {
		const initialColumns = createMockColumns();
		const enableColumnReorder = true;

		const result = buildColumnStateOptions(initialColumns, enableColumnReorder);

		expect(result.initialColumns).toBe(initialColumns);
	});
});
