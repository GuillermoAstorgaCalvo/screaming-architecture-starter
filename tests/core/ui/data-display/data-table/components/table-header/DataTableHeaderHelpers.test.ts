/**
 * DataTableHeaderHelpers Tests
 *
 * Tests for helper functions:
 * - getColumnStyle
 * - renderColumnResizer
 */

import {
	getColumnStyle,
	renderColumnResizer,
} from '@core/ui/data-display/data-table/components/table-header/DataTableHeaderHelpers';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
}

const mockColumn: DataTableColumn<TestData> = {
	id: 'name',
	header: 'Name',
	accessor: (row: TestData) => row.name,
};

describe('getColumnStyle', () => {
	it('should return empty style when no width is provided', () => {
		const columnWidths = new Map<string, number>();
		const style = getColumnStyle(mockColumn, columnWidths);
		expect(style).toEqual({});
	});

	it('should return style with width from columnWidths', () => {
		const columnWidths = new Map<string, number>([['name', 200]]);
		const style = getColumnStyle(mockColumn, columnWidths);
		expect(style).toEqual({
			width: '200px',
			minWidth: '200px',
		});
	});

	it('should return style with width from column definition when not in columnWidths', () => {
		const columnWithWidth: DataTableColumn<TestData> = {
			...mockColumn,
			width: '150px',
		};
		const columnWidths = new Map<string, number>();
		const style = getColumnStyle(columnWithWidth, columnWidths);
		expect(style).toEqual({
			width: '150px',
		});
	});

	it('should prioritize columnWidths over column width', () => {
		const columnWithWidth: DataTableColumn<TestData> = {
			...mockColumn,
			width: '150px',
		};
		const columnWidths = new Map<string, number>([['name', 200]]);
		const style = getColumnStyle(columnWithWidth, columnWidths);
		expect(style).toEqual({
			width: '200px',
			minWidth: '200px',
		});
	});

	it('should handle different column IDs', () => {
		const columnWidths = new Map<string, number>([
			['name', 200],
			['age', 100],
		]);
		const style = getColumnStyle(mockColumn, columnWidths);
		expect(style).toEqual({
			width: '200px',
			minWidth: '200px',
		});
	});

	it('should handle column not in columnWidths', () => {
		const columnWidths = new Map<string, number>([['other', 200]]);
		const style = getColumnStyle(mockColumn, columnWidths);
		expect(style).toEqual({});
	});
});

describe('renderColumnResizer', () => {
	const onColumnResize = vi.fn();

	it('should render ColumnResizer component', () => {
		const result = renderColumnResizer(mockColumn, onColumnResize);
		expect(result).toBeDefined();
	});

	it('should pass columnId to ColumnResizer', () => {
		const { container } = renderWithProviders(renderColumnResizer(mockColumn, onColumnResize));
		const button = container.querySelector('button');
		expect(button).toHaveAttribute('aria-label', 'Resize column name');
	});

	it('should pass onResize callback to ColumnResizer', () => {
		const result = renderColumnResizer(mockColumn, onColumnResize);
		expect(result).toBeDefined();
	});

	it('should pass minWidth when provided', () => {
		const columnWithMinWidth: DataTableColumn<TestData> = {
			...mockColumn,
			minWidth: 100,
		};
		const result = renderColumnResizer(columnWithMinWidth, onColumnResize);
		expect(result).toBeDefined();
	});

	it('should pass maxWidth when provided', () => {
		const columnWithMaxWidth: DataTableColumn<TestData> = {
			...mockColumn,
			maxWidth: 500,
		};
		const result = renderColumnResizer(columnWithMaxWidth, onColumnResize);
		expect(result).toBeDefined();
	});

	it('should pass both minWidth and maxWidth when provided', () => {
		const columnWithBoth: DataTableColumn<TestData> = {
			...mockColumn,
			minWidth: 100,
			maxWidth: 500,
		};
		const result = renderColumnResizer(columnWithBoth, onColumnResize);
		expect(result).toBeDefined();
	});

	it('should not pass minWidth or maxWidth when not provided', () => {
		const result = renderColumnResizer(mockColumn, onColumnResize);
		expect(result).toBeDefined();
	});
});
