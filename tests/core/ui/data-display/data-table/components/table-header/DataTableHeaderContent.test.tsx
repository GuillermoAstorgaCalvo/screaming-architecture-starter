/**
 * DataTableHeaderContent Component Tests
 *
 * Tests for DataTableHeaderContent component:
 * - Rendering sortable vs non-sortable headers
 * - Sort button integration
 */

import { HeaderContent } from '@core/ui/data-display/data-table/components/table-header/DataTableHeaderContent';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import { screen } from '@testing-library/react';
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

const defaultProps = {
	column: mockColumn,
	isSortable: false,
	sortDirection: null as 'asc' | 'desc' | null,
	onSort: vi.fn(),
};

describe('HeaderContent', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<HeaderContent {...defaultProps} />);
		}).not.toThrow();
	});

	it('should render plain text when column is not sortable', () => {
		renderWithProviders(<HeaderContent {...defaultProps} isSortable={false} />);
		const text = screen.getByText('Name');
		expect(text).toBeInTheDocument();
		expect(text.tagName).toBe('SPAN');
	});

	it('should render SortButton when column is sortable', () => {
		renderWithProviders(<HeaderContent {...defaultProps} isSortable />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		expect(sortButton).toBeInTheDocument();
		expect(sortButton.tagName).toBe('BUTTON');
	});

	it('should pass sortDirection to SortButton', () => {
		renderWithProviders(<HeaderContent {...defaultProps} isSortable sortDirection="asc" />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		expect(sortButton).toBeInTheDocument();
	});

	it('should pass onSort callback to SortButton', () => {
		const onSort = vi.fn();
		renderWithProviders(<HeaderContent {...defaultProps} isSortable onSort={onSort} />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		sortButton.click();
		expect(onSort).toHaveBeenCalledWith('name');
	});

	it('should handle null sortDirection', () => {
		renderWithProviders(<HeaderContent {...defaultProps} isSortable sortDirection={null} />);
		const sortButton = screen.getByLabelText(/sort by name/i);
		expect(sortButton).toBeInTheDocument();
	});

	it('should handle string header', () => {
		renderWithProviders(<HeaderContent {...defaultProps} />);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('should handle ReactNode header', () => {
		const columnWithNodeHeader: DataTableColumn<TestData> = {
			...mockColumn,
			header: <span data-testid="custom-header">Custom Header</span>,
		};
		renderWithProviders(<HeaderContent {...defaultProps} column={columnWithNodeHeader} />);
		expect(screen.getByTestId('custom-header')).toBeInTheDocument();
	});
});
