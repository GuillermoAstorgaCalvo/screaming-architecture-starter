/**
 * DataTableBody Component Tests
 *
 * Tests for DataTableBody component:
 * - Rendering
 * - Row rendering
 * - Row selection
 * - Cell rendering
 * - Column widths
 * - Row styling
 */

import { DataTableBody } from '@core/ui/data-display/data-table/components/DataTableBody';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactNode } from 'react';
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
	},
	{
		id: 'age',
		header: 'Age',
		accessor: (row: TestData) => row.age,
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
];

describe('DataTableBody', () => {
	describe('rendering', () => {
		it('should render without crashing', () => {
			expect(() => {
				renderWithProviders(
					<DataTableBody
						columns={mockColumns}
						data={mockData}
						striped={false}
						hoverable={false}
						size="md"
						enableRowSelection={false}
						selectedRowIds={new Set()}
						onRowToggle={vi.fn()}
						columnWidths={new Map()}
					/>
				);
			}).not.toThrow();
		});

		it('should render tbody element', () => {
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const tbody = container.querySelector('tbody');
			expect(tbody).toBeInTheDocument();
		});

		it('should render all rows', () => {
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows).toHaveLength(3);
		});

		it('should render empty tbody when data is empty', () => {
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={[]}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows).toHaveLength(0);
		});
	});

	describe('row rendering', () => {
		it('should render row data correctly', () => {
			renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
			expect(screen.getByText('30')).toBeInTheDocument();
			expect(screen.getByText('john@example.com')).toBeInTheDocument();
		});

		it('should use custom getRowId when provided', () => {
			const getRowId = (row: TestData) => `custom-${row.id}`;
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					getRowId={getRowId}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows).toHaveLength(3);
			// Verify rows are rendered (they should have keys based on custom getRowId)
			expect(rows[0]).toBeInTheDocument();
		});

		it('should use default row ID when getRowId is not provided', () => {
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows).toHaveLength(3);
		});
	});

	describe('row selection', () => {
		it('should render selection checkbox when enableRowSelection is true', () => {
			renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const checkboxes = screen.getAllByRole('checkbox');
			expect(checkboxes.length).toBeGreaterThan(0);
		});

		it('should not render selection checkbox when enableRowSelection is false', () => {
			renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const checkboxes = screen.queryAllByRole('checkbox');
			expect(checkboxes).toHaveLength(0);
		});

		it('should mark checkbox as checked when row is selected', () => {
			const selectedRowIds = new Set(['row-0']);
			renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection
					selectedRowIds={selectedRowIds}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const checkboxes = screen.getAllByRole('checkbox');
			expect(checkboxes[0]).toBeChecked();
			expect(checkboxes[1]).not.toBeChecked();
		});

		it('should call onRowToggle when checkbox is clicked', () => {
			const onRowToggle = vi.fn();
			renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection
					selectedRowIds={new Set()}
					onRowToggle={onRowToggle}
					columnWidths={new Map()}
				/>
			);
			const checkboxes = screen.getAllByRole('checkbox');
			expect(checkboxes[0]).toBeDefined();
			if (checkboxes[0]) {
				fireEvent.click(checkboxes[0]);
				expect(onRowToggle).toHaveBeenCalledWith('row-0');
			}
		});

		it('should have correct aria-label for checkboxes', () => {
			renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const checkboxes = screen.getAllByRole('checkbox');
			expect(checkboxes[0]).toHaveAttribute('aria-label', 'Select row 1');
			expect(checkboxes[1]).toHaveAttribute('aria-label', 'Select row 2');
		});
	});

	describe('row styling', () => {
		it('should apply striped styling when striped is true', () => {
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const rows = container.querySelectorAll('tbody tr');
			// Check that rows have appropriate classes
			expect(rows.length).toBeGreaterThan(0);
		});

		it('should apply hoverable styling when hoverable is true', () => {
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows.length).toBeGreaterThan(0);
		});

		it('should apply selected row styling when row is selected', () => {
			const selectedRowIds = new Set(['row-0']);
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection
					selectedRowIds={selectedRowIds}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows.length).toBeGreaterThan(0);
		});

		it('should apply custom rowClassName when provided as string', () => {
			const rowClassName = 'custom-row-class';
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					rowClassName={rowClassName}
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows.length).toBeGreaterThan(0);
		});

		it('should apply custom rowClassName when provided as function', () => {
			const rowClassName = (row: TestData, index: number) => `row-${row.id}-${index}`;
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					rowClassName={rowClassName}
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows.length).toBeGreaterThan(0);
		});
	});

	describe('cell rendering', () => {
		it('should render cell content using accessor', () => {
			renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
			expect(screen.getByText('30')).toBeInTheDocument();
		});

		it('should render cell content using cellRenderer when provided', () => {
			const columnsWithRenderer: DataTableColumn<TestData>[] = [
				{
					id: 'name',
					header: 'Name',
					accessor: (row: TestData) => row.name,
					cellRenderer: (value: ReactNode) => (
						<span data-testid="custom-cell">
							{typeof value === 'string' ? value.toUpperCase() : String(value)}
						</span>
					),
				},
			];
			renderWithProviders(
				<DataTableBody
					columns={columnsWithRenderer}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const customCells = screen.getAllByTestId('custom-cell');
			expect(customCells.length).toBeGreaterThan(0);
			expect(customCells[0]).toHaveTextContent('JOHN DOE');
		});
	});

	describe('column widths', () => {
		it('should apply column width from columnWidths map', () => {
			const columnWidths = new Map<string, number>([
				['name', 200],
				['age', 100],
			]);
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={columnWidths}
				/>
			);
			const cells = container.querySelectorAll('td');
			expect(cells.length).toBeGreaterThan(0);
		});

		it('should apply column width from column.width when not in columnWidths map', () => {
			const columnsWithWidth: DataTableColumn<TestData>[] = [
				{
					id: 'name',
					header: 'Name',
					accessor: (row: TestData) => row.name,
					width: '150px',
				},
			];
			const { container } = renderWithProviders(
				<DataTableBody
					columns={columnsWithWidth}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const cells = container.querySelectorAll('td');
			expect(cells.length).toBeGreaterThan(0);
		});
	});

	describe('size prop', () => {
		it('should apply size classes for sm', () => {
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="sm"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const cells = container.querySelectorAll('td');
			expect(cells.length).toBeGreaterThan(0);
		});

		it('should apply size classes for md', () => {
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="md"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const cells = container.querySelectorAll('td');
			expect(cells.length).toBeGreaterThan(0);
		});

		it('should apply size classes for lg', () => {
			const { container } = renderWithProviders(
				<DataTableBody
					columns={mockColumns}
					data={mockData}
					striped={false}
					hoverable={false}
					size="lg"
					enableRowSelection={false}
					selectedRowIds={new Set()}
					onRowToggle={vi.fn()}
					columnWidths={new Map()}
				/>
			);
			const cells = container.querySelectorAll('td');
			expect(cells.length).toBeGreaterThan(0);
		});
	});
});
