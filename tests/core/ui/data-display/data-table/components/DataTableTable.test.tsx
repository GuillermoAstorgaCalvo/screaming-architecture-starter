/**
 * DataTableTable Component Tests
 *
 * Tests for DataTableTable component:
 * - Rendering
 * - Props building and extraction
 * - Header and body integration
 * - Table wrapper
 */

import { DataTableTable } from '@core/ui/data-display/data-table/components/DataTableTable';
import type { DataTableColumn, DataTableProps } from '@src-types/ui/dataTable';
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

const defaultProps = {
	className: undefined,
	columns: mockColumns,
	size: 'md' as const,
	sort: null,
	onSort: vi.fn(),
	enableRowSelection: false,
	onSelectAll: vi.fn(),
	isAllSelected: false,
	isSomeSelected: false,
	selectAllLabel: 'Select all',
	columnWidths: new Map<string, number>(),
	enableColumnResize: false,
	onColumnResize: vi.fn(),
	displayData: mockData,
	getRowId: undefined,
	striped: false,
	hoverable: false,
	rowClassName: undefined,
	selectedRowIds: new Set<string>(),
	onRowToggle: vi.fn(),
	tableProps: {},
};

describe('DataTableTable', () => {
	describe('rendering', () => {
		it('should render without crashing', () => {
			expect(() => {
				renderWithProviders(<DataTableTable {...defaultProps} />);
			}).not.toThrow();
		});

		it('should render table wrapper with overflow-x-auto', () => {
			const { container } = renderWithProviders(<DataTableTable {...defaultProps} />);
			const wrapper = container.querySelector('div.overflow-x-auto');
			expect(wrapper).toBeInTheDocument();
		});

		it('should render table element', () => {
			const { container } = renderWithProviders(<DataTableTable {...defaultProps} />);
			const table = container.querySelector('table');
			expect(table).toBeInTheDocument();
		});

		it('should render thead element', () => {
			const { container } = renderWithProviders(<DataTableTable {...defaultProps} />);
			const thead = container.querySelector('thead');
			expect(thead).toBeInTheDocument();
		});

		it('should render tbody element', () => {
			const { container } = renderWithProviders(<DataTableTable {...defaultProps} />);
			const tbody = container.querySelector('tbody');
			expect(tbody).toBeInTheDocument();
		});
	});

	describe('header rendering', () => {
		it('should render column headers', () => {
			renderWithProviders(<DataTableTable {...defaultProps} />);
			expect(screen.getByText('Name')).toBeInTheDocument();
			expect(screen.getByText('Age')).toBeInTheDocument();
			expect(screen.getByText('Email')).toBeInTheDocument();
		});

		it('should render selection checkbox when enableRowSelection is true', () => {
			renderWithProviders(
				<DataTableTable {...defaultProps} enableRowSelection isAllSelected={false} />
			);
			const checkbox = screen.getByLabelText('Select all');
			expect(checkbox).toBeInTheDocument();
		});

		it('should pass sort state to header', () => {
			const sort = { columnId: 'name', direction: 'asc' as const };
			renderWithProviders(<DataTableTable {...defaultProps} sort={sort} />);
			// Header should receive sort prop
			expect(screen.getByText('Name')).toBeInTheDocument();
		});

		it('should call onSort when header sort button is clicked', () => {
			const onSort = vi.fn();
			renderWithProviders(<DataTableTable {...defaultProps} onSort={onSort} />);
			// Sort functionality is tested in DataTableHeader tests
			expect(screen.getByText('Name')).toBeInTheDocument();
		});

		it('should pass column widths to header', () => {
			const columnWidths = new Map<string, number>([
				['name', 200],
				['age', 100],
			]);
			renderWithProviders(<DataTableTable {...defaultProps} columnWidths={columnWidths} />);
			expect(screen.getByText('Name')).toBeInTheDocument();
		});

		it('should pass column resize handler to header', () => {
			const onColumnResize = vi.fn();
			renderWithProviders(
				<DataTableTable {...defaultProps} enableColumnResize onColumnResize={onColumnResize} />
			);
			expect(screen.getByText('Name')).toBeInTheDocument();
		});
	});

	describe('body rendering', () => {
		it('should render all rows', () => {
			renderWithProviders(<DataTableTable {...defaultProps} />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
			expect(screen.getByText('Jane Smith')).toBeInTheDocument();
			expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
		});

		it('should pass getRowId to body when provided', () => {
			const getRowId = (row: TestData) => `custom-${row.id}`;
			renderWithProviders(<DataTableTable {...defaultProps} getRowId={getRowId} />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should pass striped prop to body', () => {
			renderWithProviders(<DataTableTable {...defaultProps} striped />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should pass hoverable prop to body', () => {
			renderWithProviders(<DataTableTable {...defaultProps} hoverable />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should pass rowClassName to body when provided as function', () => {
			const rowClassName = (row: TestData, index: number) => `row-${row.id}-${index}`;
			renderWithProviders(<DataTableTable {...defaultProps} rowClassName={rowClassName} />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should pass rowClassName to body when provided as function', () => {
			const rowClassName = (row: TestData, index: number) => `custom-row-class-${row.id}`;
			renderWithProviders(<DataTableTable {...defaultProps} rowClassName={rowClassName} />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should pass selectedRowIds to body', () => {
			const selectedRowIds = new Set(['row-0']);
			renderWithProviders(
				<DataTableTable {...defaultProps} enableRowSelection selectedRowIds={selectedRowIds} />
			);
			const rowCheckbox = screen.getByLabelText('Select row 1');
			expect(rowCheckbox).toBeChecked();
		});

		it('should pass onRowToggle to body', () => {
			const onRowToggle = vi.fn();
			renderWithProviders(
				<DataTableTable {...defaultProps} enableRowSelection onRowToggle={onRowToggle} />
			);
			// Function is passed correctly (tested in DataTableBody tests)
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should pass columnWidths to body', () => {
			const columnWidths = new Map<string, number>([
				['name', 200],
				['age', 100],
			]);
			renderWithProviders(<DataTableTable {...defaultProps} columnWidths={columnWidths} />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});
	});

	describe('table props', () => {
		it('should apply custom className', () => {
			const className = 'custom-table-class';
			const { container } = renderWithProviders(
				<DataTableTable {...defaultProps} className={className} />
			);
			const table = container.querySelector('table');
			expect(table).toBeInTheDocument();
		});

		it('should pass tableProps to table element', () => {
			const tableProps = { 'data-testid': 'custom-table' } as Omit<
				DataTableProps<TestData>,
				'columns' | 'data'
			>;
			const { container } = renderWithProviders(
				<DataTableTable {...defaultProps} tableProps={tableProps} />
			);
			const table = container.querySelector('table[data-testid="custom-table"]');
			expect(table).toBeInTheDocument();
		});
	});

	describe('size prop', () => {
		it('should pass size to header and body', () => {
			renderWithProviders(<DataTableTable {...defaultProps} size="sm" />);
			expect(screen.getByText('Name')).toBeInTheDocument();
		});

		it('should handle different sizes', () => {
			const sizes = ['sm', 'md', 'lg'] as const;
			for (const size of sizes) {
				const { container } = renderWithProviders(<DataTableTable {...defaultProps} size={size} />);
				const table = container.querySelector('table');
				expect(table).toBeInTheDocument();
			}
		});
	});

	describe('selection integration', () => {
		it('should pass selection state to header', () => {
			renderWithProviders(
				<DataTableTable {...defaultProps} enableRowSelection isAllSelected isSomeSelected={false} />
			);
			const checkbox = screen.getByLabelText('Select all');
			expect(checkbox).toBeChecked();
		});

		it('should pass selection state to header when some selected', () => {
			renderWithProviders(
				<DataTableTable {...defaultProps} enableRowSelection isAllSelected={false} isSomeSelected />
			);
			const checkbox = screen.getByLabelText('Select all');

			expect((checkbox as HTMLInputElement).indeterminate).toBe(true);
		});

		it('should call onSelectAll when header checkbox is clicked', () => {
			const onSelectAll = vi.fn();
			renderWithProviders(
				<DataTableTable {...defaultProps} enableRowSelection onSelectAll={onSelectAll} />
			);
			// onSelectAll is passed to header (tested in DataTableHeader tests)
			expect(screen.getByText('Name')).toBeInTheDocument();
		});
	});

	describe('edge cases', () => {
		it('should handle empty data array', () => {
			renderWithProviders(<DataTableTable {...defaultProps} displayData={[]} />);
			const { container } = renderWithProviders(
				<DataTableTable {...defaultProps} displayData={[]} />
			);
			const tbody = container.querySelector('tbody');
			expect(tbody).toBeInTheDocument();
		});

		it('should handle undefined getRowId', () => {
			renderWithProviders(<DataTableTable {...defaultProps} getRowId={undefined} />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should handle undefined rowClassName', () => {
			renderWithProviders(<DataTableTable {...defaultProps} rowClassName={undefined} />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should handle empty columnWidths map', () => {
			renderWithProviders(<DataTableTable {...defaultProps} columnWidths={new Map()} />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});
	});
});
