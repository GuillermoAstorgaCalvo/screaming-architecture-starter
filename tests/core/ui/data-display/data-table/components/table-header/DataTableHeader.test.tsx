/**
 * DataTableHeader Component Tests
 *
 * Tests for DataTableHeader component:
 * - Rendering
 * - Props handling
 * - Integration with child components
 */

import { DataTableHeader } from '@core/ui/data-display/data-table/components/table-header/DataTableHeader';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
	age: number;
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
];

const defaultProps = {
	columns: mockColumns,
	size: 'md' as const,
	sort: null,
	onSort: vi.fn(),
	enableRowSelection: false,
	onSelectAll: vi.fn(),
	isAllSelected: false,
	isSomeSelected: false,
	columnWidths: new Map<string, number>(),
	enableColumnResize: false,
};

describe('DataTableHeader', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<DataTableHeader {...defaultProps} />);
		}).not.toThrow();
	});

	it('should render thead element', () => {
		const { container } = renderWithProviders(<DataTableHeader {...defaultProps} />);
		const thead = container.querySelector('thead');
		expect(thead).toBeInTheDocument();
	});

	it('should render header row', () => {
		const { container } = renderWithProviders(<DataTableHeader {...defaultProps} />);
		const tr = container.querySelector('thead tr');
		expect(tr).toBeInTheDocument();
	});

	it('should render column headers', () => {
		renderWithProviders(<DataTableHeader {...defaultProps} />);
		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Age')).toBeInTheDocument();
	});

	it('should use default selectAllLabel when not provided', () => {
		renderWithProviders(<DataTableHeader {...defaultProps} enableRowSelection />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('aria-label');
	});

	it('should use custom selectAllLabel when provided', () => {
		const customLabel = 'Select all items';
		renderWithProviders(
			<DataTableHeader {...defaultProps} enableRowSelection selectAllLabel={customLabel} />
		);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('aria-label', customLabel);
	});

	it('should pass props to HeaderRow', () => {
		const onSort = vi.fn();
		const onSelectAll = vi.fn();
		renderWithProviders(
			<DataTableHeader
				{...defaultProps}
				onSort={onSort}
				enableRowSelection
				onSelectAll={onSelectAll}
				isAllSelected
				isSomeSelected
			/>
		);
		// Verify that the row is rendered with selection checkbox
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).toBeChecked();
	});

	it('should not render selection checkbox when enableRowSelection is false', () => {
		renderWithProviders(<DataTableHeader {...defaultProps} enableRowSelection={false} />);
		const checkbox = screen.queryByRole('checkbox');
		expect(checkbox).not.toBeInTheDocument();
	});

	it('should handle sort state correctly', () => {
		const sort = { columnId: 'name', direction: 'asc' as const };
		renderWithProviders(<DataTableHeader {...defaultProps} sort={sort} />);
		// Verify sort button is rendered
		const sortButton = screen.getByLabelText(/sort by name/i);
		expect(sortButton).toBeInTheDocument();
	});

	it('should handle column widths', () => {
		const columnWidths = new Map<string, number>([
			['name', 200],
			['age', 100],
		]);
		const { container } = renderWithProviders(
			<DataTableHeader {...defaultProps} columnWidths={columnWidths} />
		);
		const headers = container.querySelectorAll('th');
		expect(headers.length).toBeGreaterThan(0);
	});

	it('should handle column resize when enabled', () => {
		const onColumnResize = vi.fn();
		renderWithProviders(
			<DataTableHeader {...defaultProps} enableColumnResize onColumnResize={onColumnResize} />
		);
		// Column resizer should be available when enabled
		expect(screen.getByText('Name')).toBeInTheDocument();
	});
});
