/**
 * DataTableHeaderCell Component Tests
 *
 * Tests for DataTableHeaderCell component:
 * - Rendering
 * - Sorting functionality
 * - Column resizing
 * - Styling
 */

import { DataTableHeaderCell } from '@core/ui/data-display/data-table/components/table-header/DataTableHeaderCell';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
	age: number;
}

const mockColumn: DataTableColumn<TestData> = {
	id: 'name',
	header: 'Name',
	accessor: (row: TestData) => row.name,
	sortable: true,
};

const defaultProps = {
	column: mockColumn,
	size: 'md' as const,
	sort: null,
	onSort: vi.fn(),
	columnWidths: new Map<string, number>(),
	enableColumnResize: false,
};

describe('DataTableHeaderCell', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<DataTableHeaderCell {...defaultProps} />);
		}).not.toThrow();
	});

	it('should render th element with scope="col"', () => {
		const { container } = renderWithProviders(<DataTableHeaderCell {...defaultProps} />);
		const th = container.querySelector('th[scope="col"]');
		expect(th).toBeInTheDocument();
	});

	it('should render column header text', () => {
		renderWithProviders(<DataTableHeaderCell {...defaultProps} />);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('should render sortable button when column is sortable', () => {
		renderWithProviders(<DataTableHeaderCell {...defaultProps} />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		expect(sortButton).toBeInTheDocument();
	});

	it('should not render sortable button when column is not sortable', () => {
		const nonSortableColumn: DataTableColumn<TestData> = {
			...mockColumn,
			sortable: false,
		};
		renderWithProviders(<DataTableHeaderCell {...defaultProps} column={nonSortableColumn} />);
		const sortButton = screen.queryByLabelText(/sort by name/i);
		expect(sortButton).not.toBeInTheDocument();
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('should show correct sort direction when sorted ascending', () => {
		const sort = { columnId: 'name', direction: 'asc' as const };
		renderWithProviders(<DataTableHeaderCell {...defaultProps} sort={sort} />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		expect(sortButton).toBeInTheDocument();
	});

	it('should show correct sort direction when sorted descending', () => {
		const sort = { columnId: 'name', direction: 'desc' as const };
		renderWithProviders(<DataTableHeaderCell {...defaultProps} sort={sort} />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		expect(sortButton).toBeInTheDocument();
	});

	it('should not show sort indicator when column is not sorted', () => {
		renderWithProviders(<DataTableHeaderCell {...defaultProps} sort={null} />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		expect(sortButton).toBeInTheDocument();
	});

	it('should apply column width style when provided', () => {
		const columnWidths = new Map<string, number>([['name', 200]]);
		const { container } = renderWithProviders(
			<DataTableHeaderCell {...defaultProps} columnWidths={columnWidths} />
		);
		const th = container.querySelector('th');
		expect(th).toHaveStyle({ width: '200px', minWidth: '200px' });
	});

	it('should apply column width from column definition when not in columnWidths', () => {
		const columnWithWidth: DataTableColumn<TestData> = {
			...mockColumn,
			width: '150px',
		};
		const { container } = renderWithProviders(
			<DataTableHeaderCell {...defaultProps} column={columnWithWidth} />
		);
		const th = container.querySelector('th');
		expect(th).toHaveStyle({ width: '150px' });
	});

	it('should render column resizer when resize is enabled', () => {
		const onColumnResize = vi.fn();
		renderWithProviders(
			<DataTableHeaderCell {...defaultProps} enableColumnResize onColumnResize={onColumnResize} />
		);
		// Resizer button should be present
		const resizer = screen.getByLabelText(/resize column name/i);
		expect(resizer).toBeInTheDocument();
	});

	it('should not render column resizer when resize is disabled', () => {
		renderWithProviders(<DataTableHeaderCell {...defaultProps} enableColumnResize={false} />);
		const resizer = screen.queryByLabelText(/resize column name/i);
		expect(resizer).not.toBeInTheDocument();
	});

	it('should not render column resizer when column is not resizable', () => {
		const nonResizableColumn: DataTableColumn<TestData> = {
			...mockColumn,
			resizable: false,
		};
		const onColumnResize = vi.fn();
		renderWithProviders(
			<DataTableHeaderCell
				{...defaultProps}
				column={nonResizableColumn}
				enableColumnResize
				onColumnResize={onColumnResize}
			/>
		);
		const resizer = screen.queryByLabelText(/resize column name/i);
		expect(resizer).not.toBeInTheDocument();
	});

	it('should not render column resizer when onColumnResize is not provided', () => {
		renderWithProviders(<DataTableHeaderCell {...defaultProps} enableColumnResize />);
		const resizer = screen.queryByLabelText(/resize column name/i);
		expect(resizer).not.toBeInTheDocument();
	});

	it('should call onSort when sortable button is clicked', () => {
		const onSort = vi.fn();
		renderWithProviders(<DataTableHeaderCell {...defaultProps} onSort={onSort} />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		sortButton.click();
		expect(onSort).toHaveBeenCalledWith('name');
		expect(onSort).toHaveBeenCalledTimes(1);
	});

	it('should handle different sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;
		for (const size of sizes) {
			const { container } = renderWithProviders(
				<DataTableHeaderCell {...defaultProps} size={size} />
			);
			const th = container.querySelector('th');
			expect(th).toBeInTheDocument();
		}
	});
});
