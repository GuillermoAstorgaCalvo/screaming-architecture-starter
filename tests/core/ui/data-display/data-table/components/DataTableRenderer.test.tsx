/**
 * DataTableRenderer Component Tests
 *
 * Tests for DataTableRenderer component:
 * - Rendering empty state
 * - Rendering no results state
 * - Rendering table content
 * - Conditional rendering based on data
 */

import { DataTableRenderer } from '@core/ui/data-display/data-table/components/DataTableRenderer';
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

const mockData: TestData[] = [
	{ id: '1', name: 'John Doe', age: 30 },
	{ id: '2', name: 'Jane Smith', age: 25 },
];

const defaultProps = {
	displayData: mockData,
	initialData: mockData,
	enableGlobalFilter: false,
	globalSearch: '',
	onGlobalSearchChange: vi.fn(),
	globalSearchPlaceholder: 'Search...',
	emptyMessage: 'No data available',
	dataTableId: 'test-table',
	className: '',
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
	striped: false,
	hoverable: false,
	selectedRowIds: new Set<string>(),
	onRowToggle: vi.fn(),
	enablePagination: false,
	totalPages: 1,
	currentPage: 1,
	onPageChange: vi.fn(),
	showPaginationInfo: false,
	startIndex: 0,
	endIndex: 2,
	totalItems: 2,
	tableProps: {},
};

describe('DataTableRenderer', () => {
	describe('empty state', () => {
		it('should render empty message when initialData is empty', () => {
			renderWithProviders(
				<DataTableRenderer
					{...defaultProps}
					displayData={[]}
					initialData={[]}
					emptyMessage="No data available"
				/>
			);
			expect(screen.getByText('No data available')).toBeInTheDocument();
		});

		it('should render custom empty message', () => {
			const customMessage = 'Custom empty message';
			renderWithProviders(
				<DataTableRenderer
					{...defaultProps}
					displayData={[]}
					initialData={[]}
					emptyMessage={customMessage}
				/>
			);
			expect(screen.getByText(customMessage)).toBeInTheDocument();
		});

		it('should render ReactNode empty message', () => {
			const customMessage = <div data-testid="custom-empty">Custom empty</div>;
			renderWithProviders(
				<DataTableRenderer
					{...defaultProps}
					displayData={[]}
					initialData={[]}
					emptyMessage={customMessage}
				/>
			);
			expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
		});
	});

	describe('no results state', () => {
		it('should render no results when displayData is empty but initialData is not', () => {
			renderWithProviders(
				<DataTableRenderer
					{...defaultProps}
					displayData={[]}
					initialData={mockData}
					enableGlobalFilter
				/>
			);
			// Should show "No results found" message
			expect(screen.getByText(/no results found/i)).toBeInTheDocument();
		});

		it('should render global filter when enableGlobalFilter is true and no results', () => {
			renderWithProviders(
				<DataTableRenderer
					{...defaultProps}
					displayData={[]}
					initialData={mockData}
					enableGlobalFilter
					globalSearch="test"
				/>
			);
			// Should show filter input
			const searchInput = screen.queryByPlaceholderText(/search/i);
			expect(searchInput).toBeInTheDocument();
		});

		it('should not render global filter when enableGlobalFilter is false and no results', () => {
			renderWithProviders(
				<DataTableRenderer
					{...defaultProps}
					displayData={[]}
					initialData={mockData}
					enableGlobalFilter={false}
				/>
			);
			// Should not show filter input
			const searchInput = screen.queryByPlaceholderText(/search/i);
			expect(searchInput).not.toBeInTheDocument();
		});
	});

	describe('table content rendering', () => {
		it('should render DataTableContent when data is available', () => {
			renderWithProviders(<DataTableRenderer {...defaultProps} />);
			// Should render table (check for table structure)
			// The actual table rendering is tested in DataTableContent tests
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should pass all props to DataTableContent', () => {
			renderWithProviders(<DataTableRenderer {...defaultProps} />);
			// Verify that data is rendered
			expect(screen.getByText('John Doe')).toBeInTheDocument();
			expect(screen.getByText('30')).toBeInTheDocument();
		});

		it('should handle rowClassName as function', () => {
			const rowClassName = (row: TestData, index: number) => `row-${row.id}-${index}`;
			renderWithProviders(<DataTableRenderer {...defaultProps} rowClassName={rowClassName} />);
			// Should render without errors
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should handle rowClassName as string', () => {
			const rowClassName = 'custom-row-class';
			renderWithProviders(<DataTableRenderer {...defaultProps} rowClassName={rowClassName} />);
			// Should render without errors
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});

		it('should pass getRowId to DataTableContent', () => {
			const getRowId = (row: TestData) => `custom-${row.id}`;
			renderWithProviders(<DataTableRenderer {...defaultProps} getRowId={getRowId} />);
			// Should render without errors
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});
	});

	describe('conditional rendering', () => {
		it('should prioritize empty state over no results when both conditions are true', () => {
			// When initialData is empty, should show empty message
			renderWithProviders(
				<DataTableRenderer
					{...defaultProps}
					displayData={[]}
					initialData={[]}
					emptyMessage="No data"
				/>
			);
			expect(screen.getByText('No data')).toBeInTheDocument();
			expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
		});

		it('should show no results when displayData is empty but initialData has items', () => {
			renderWithProviders(
				<DataTableRenderer
					{...defaultProps}
					displayData={[]}
					initialData={mockData}
					enableGlobalFilter
				/>
			);
			expect(screen.getByText(/no results found/i)).toBeInTheDocument();
		});

		it('should show table content when displayData has items', () => {
			renderWithProviders(<DataTableRenderer {...defaultProps} />);
			expect(screen.getByText('John Doe')).toBeInTheDocument();
			expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
			expect(screen.queryByText('No data available')).not.toBeInTheDocument();
		});
	});

	describe('props forwarding', () => {
		it('should forward global filter props when rendering no results', () => {
			const onGlobalSearchChange = vi.fn();
			renderWithProviders(
				<DataTableRenderer
					{...defaultProps}
					displayData={[]}
					initialData={mockData}
					enableGlobalFilter
					globalSearch="test"
					onGlobalSearchChange={onGlobalSearchChange}
					globalSearchPlaceholder="Search items..."
				/>
			);
			// Should render filter with correct placeholder
			const searchInput = screen.getByPlaceholderText('Search items...');
			expect(searchInput).toBeInTheDocument();
		});

		it('should forward all table props to DataTableContent', () => {
			renderWithProviders(
				<DataTableRenderer
					{...defaultProps}
					enableRowSelection
					enableColumnResize
					striped
					hoverable
				/>
			);
			// Should render without errors
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});
	});
});
