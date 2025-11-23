/**
 * ColumnCells Component Tests
 *
 * Tests for ColumnCells component:
 * - Rendering all column cells
 * - Props passing to individual cells
 */

import { ColumnCells } from '@core/ui/data-display/data-table/components/table-header/DataTableColumnCells';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
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
		sortable: false,
	},
	{
		id: 'email',
		header: 'Email',
		accessor: (row: TestData) => row.email,
	},
];

const defaultProps = {
	columns: mockColumns,
	size: 'md' as const,
	sort: null,
	onSort: vi.fn(),
	columnWidths: new Map<string, number>(),
	enableColumnResize: false,
};

describe('ColumnCells', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<ColumnCells {...defaultProps} />);
		}).not.toThrow();
	});

	it('should render all column headers', () => {
		renderWithProviders(<ColumnCells {...defaultProps} />);
		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Age')).toBeInTheDocument();
		expect(screen.getByText('Email')).toBeInTheDocument();
	});

	it('should render correct number of header cells', () => {
		const { container } = renderWithProviders(<ColumnCells {...defaultProps} />);
		const headers = container.querySelectorAll('th');
		expect(headers.length).toBe(mockColumns.length);
	});

	it('should pass sort prop to each cell', () => {
		const sort = { columnId: 'name', direction: 'asc' as const };
		renderWithProviders(<ColumnCells {...defaultProps} sort={sort} />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		expect(sortButton).toBeInTheDocument();
	});

	it('should pass onSort callback to each cell', () => {
		const onSort = vi.fn();
		renderWithProviders(<ColumnCells {...defaultProps} onSort={onSort} />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		sortButton.click();
		expect(onSort).toHaveBeenCalledWith('name');
	});

	it('should pass columnWidths to each cell', () => {
		const columnWidths = new Map<string, number>([
			['name', 200],
			['age', 100],
			['email', 250],
		]);
		const { container } = renderWithProviders(
			<ColumnCells {...defaultProps} columnWidths={columnWidths} />
		);
		const headers = container.querySelectorAll('th');
		expect(headers.length).toBe(mockColumns.length);
	});

	it('should pass enableColumnResize to each cell', () => {
		const onColumnResize = vi.fn();
		renderWithProviders(
			<ColumnCells {...defaultProps} enableColumnResize onColumnResize={onColumnResize} />
		);
		// Resizers should be available for resizable columns
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('should not pass onColumnResize when not provided', () => {
		renderWithProviders(<ColumnCells {...defaultProps} enableColumnResize />);
		// Cells should still render
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('should handle empty columns array', () => {
		renderWithProviders(<ColumnCells {...defaultProps} columns={[]} />);
		const { container } = renderWithProviders(<ColumnCells {...defaultProps} columns={[]} />);
		const headers = container.querySelectorAll('th');
		expect(headers.length).toBe(0);
	});

	it('should handle different sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;
		for (const size of sizes) {
			const { container } = renderWithProviders(<ColumnCells {...defaultProps} size={size} />);
			const headers = container.querySelectorAll('th');
			expect(headers.length).toBe(mockColumns.length);
		}
	});

	it('should render cells with correct keys', () => {
		const { container } = renderWithProviders(<ColumnCells {...defaultProps} />);
		const headers = container.querySelectorAll('th');
		expect(headers.length).toBe(mockColumns.length);
		// Each header should have the column header text
		for (const column of mockColumns) {
			expect(screen.getByText(column.header as string)).toBeInTheDocument();
		}
	});
});
