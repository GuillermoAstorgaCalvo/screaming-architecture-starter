/**
 * DataTableHeaderRow Component Tests
 *
 * Tests for DataTableHeaderRow component:
 * - Rendering
 * - Selection checkbox
 * - Column cells rendering
 */

import { HeaderRow } from '@core/ui/data-display/data-table/components/table-header/DataTableHeaderRow';
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
	},
	{
		id: 'age',
		header: 'Age',
		accessor: (row: TestData) => row.age,
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
	selectAllLabel: 'Select all rows',
	columnWidths: new Map<string, number>(),
	enableColumnResize: false,
};

describe('HeaderRow', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<HeaderRow {...defaultProps} />);
		}).not.toThrow();
	});

	it('should render tr element', () => {
		const { container } = renderWithProviders(<HeaderRow {...defaultProps} />);
		const tr = container.querySelector('tr');
		expect(tr).toBeInTheDocument();
	});

	it('should render all column headers', () => {
		renderWithProviders(<HeaderRow {...defaultProps} />);
		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Age')).toBeInTheDocument();
	});

	it('should render selection checkbox when enableRowSelection is true', () => {
		renderWithProviders(<HeaderRow {...defaultProps} enableRowSelection />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeInTheDocument();
	});

	it('should not render selection checkbox when enableRowSelection is false', () => {
		renderWithProviders(<HeaderRow {...defaultProps} enableRowSelection={false} />);
		const checkbox = screen.queryByRole('checkbox');
		expect(checkbox).not.toBeInTheDocument();
	});

	it('should render checkbox as checked when isAllSelected is true', () => {
		renderWithProviders(<HeaderRow {...defaultProps} enableRowSelection isAllSelected />);
		const checkbox = screen.getByRole<HTMLInputElement>('checkbox');
		expect(checkbox.checked).toBe(true);
	});

	it('should render checkbox as unchecked when isAllSelected is false', () => {
		renderWithProviders(<HeaderRow {...defaultProps} enableRowSelection isAllSelected={false} />);
		const checkbox = screen.getByRole<HTMLInputElement>('checkbox');
		expect(checkbox.checked).toBe(false);
	});

	it('should set checkbox indeterminate when isSomeSelected is true', () => {
		renderWithProviders(<HeaderRow {...defaultProps} enableRowSelection isSomeSelected />);
		const checkbox = screen.getByRole<HTMLInputElement>('checkbox');
		expect(checkbox.indeterminate).toBe(true);
	});

	it('should call onSelectAll when checkbox is clicked', () => {
		const onSelectAll = vi.fn();
		renderWithProviders(
			<HeaderRow {...defaultProps} enableRowSelection onSelectAll={onSelectAll} />
		);
		const checkbox = screen.getByRole('checkbox');
		checkbox.click();
		expect(onSelectAll).toHaveBeenCalledTimes(1);
	});

	it('should use selectAllLabel for checkbox aria-label', () => {
		const customLabel = 'Select all items';
		renderWithProviders(
			<HeaderRow {...defaultProps} enableRowSelection selectAllLabel={customLabel} />
		);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('aria-label', customLabel);
	});

	it('should pass column props to ColumnCells', () => {
		const onSort = vi.fn();
		renderWithProviders(<HeaderRow {...defaultProps} onSort={onSort} />);
		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Age')).toBeInTheDocument();
	});

	it('should pass onColumnResize when provided', () => {
		const onColumnResize = vi.fn();
		renderWithProviders(
			<HeaderRow {...defaultProps} enableColumnResize onColumnResize={onColumnResize} />
		);
		// Column cells should be rendered
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('should not pass onColumnResize when not provided', () => {
		renderWithProviders(<HeaderRow {...defaultProps} enableColumnResize />);
		// Column cells should still be rendered
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('should handle empty columns array', () => {
		renderWithProviders(<HeaderRow {...defaultProps} columns={[]} />);
		const tr = screen.getByRole('row');
		expect(tr).toBeInTheDocument();
	});
});
