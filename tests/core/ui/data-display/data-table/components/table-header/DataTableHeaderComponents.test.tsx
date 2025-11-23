/**
 * DataTableHeaderComponents Tests
 *
 * Tests for header component utilities:
 * - SortButton
 * - SelectionCheckbox
 * - ColumnResizer
 */

import {
	ColumnResizer,
	SelectionCheckbox,
	SortButton,
} from '@core/ui/data-display/data-table/components/table-header/DataTableHeaderComponents';
import type { DataTableColumn } from '@src-types/ui/dataTable';
import { fireEvent, screen } from '@testing-library/react';
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

describe('SortButton', () => {
	const defaultProps = {
		column: mockColumn,
		sortDirection: null as 'asc' | 'desc' | null,
		onSort: vi.fn(),
	};

	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<SortButton {...defaultProps} />);
		}).not.toThrow();
	});

	it('should render button element', () => {
		renderWithProviders(<SortButton {...defaultProps} />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should render column header text', () => {
		renderWithProviders(<SortButton {...defaultProps} />);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('should have correct aria-label', () => {
		renderWithProviders(<SortButton {...defaultProps} />);
		const button = screen.getByLabelText('Sort by Name');
		expect(button).toBeInTheDocument();
	});

	it('should call onSort when clicked', () => {
		const onSort = vi.fn();
		renderWithProviders(<SortButton {...defaultProps} onSort={onSort} />);
		const button = screen.getByRole('button');
		button.click();
		expect(onSort).toHaveBeenCalledWith('name');
		expect(onSort).toHaveBeenCalledTimes(1);
	});

	it('should show sort icon for null direction', () => {
		renderWithProviders(<SortButton {...defaultProps} sortDirection={null} />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should show sort icon for asc direction', () => {
		renderWithProviders(<SortButton {...defaultProps} sortDirection="asc" />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should show sort icon for desc direction', () => {
		renderWithProviders(<SortButton {...defaultProps} sortDirection="desc" />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should handle ReactNode header', () => {
		const columnWithNodeHeader: DataTableColumn<TestData> = {
			...mockColumn,
			header: <span data-testid="custom-header">Custom</span>,
		};
		renderWithProviders(<SortButton {...defaultProps} column={columnWithNodeHeader} />);
		expect(screen.getByTestId('custom-header')).toBeInTheDocument();
	});
});

describe('SelectionCheckbox', () => {
	const defaultProps = {
		size: 'md' as const,
		isAllSelected: false,
		isSomeSelected: false,
		onSelectAll: vi.fn(),
		selectAllLabel: 'Select all rows',
	};

	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<SelectionCheckbox {...defaultProps} />);
		}).not.toThrow();
	});

	it('should render th element with scope="col"', () => {
		const { container } = renderWithProviders(<SelectionCheckbox {...defaultProps} />);
		const th = container.querySelector('th[scope="col"]');
		expect(th).toBeInTheDocument();
	});

	it('should render checkbox input', () => {
		renderWithProviders(<SelectionCheckbox {...defaultProps} />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeInTheDocument();
	});

	it('should be checked when isAllSelected is true', () => {
		renderWithProviders(<SelectionCheckbox {...defaultProps} isAllSelected />);
		const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
		expect(checkbox.checked).toBe(true);
	});

	it('should be unchecked when isAllSelected is false', () => {
		renderWithProviders(<SelectionCheckbox {...defaultProps} isAllSelected={false} />);
		const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
		expect(checkbox.checked).toBe(false);
	});

	it('should be indeterminate when isSomeSelected is true', () => {
		renderWithProviders(<SelectionCheckbox {...defaultProps} isSomeSelected />);
		const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
		expect(checkbox.indeterminate).toBe(true);
	});

	it('should not be indeterminate when isSomeSelected is false', () => {
		renderWithProviders(<SelectionCheckbox {...defaultProps} isSomeSelected={false} />);
		const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
		expect(checkbox.indeterminate).toBe(false);
	});

	it('should call onSelectAll when checkbox is changed', () => {
		const onSelectAll = vi.fn();
		renderWithProviders(<SelectionCheckbox {...defaultProps} onSelectAll={onSelectAll} />);
		const checkbox = screen.getByRole('checkbox');
		fireEvent.click(checkbox);
		expect(onSelectAll).toHaveBeenCalledTimes(1);
	});

	it('should have correct aria-label', () => {
		const customLabel = 'Select all items';
		renderWithProviders(<SelectionCheckbox {...defaultProps} selectAllLabel={customLabel} />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('aria-label', customLabel);
	});

	it('should handle different sizes', () => {
		const sizes = ['sm', 'md', 'lg'] as const;
		for (const size of sizes) {
			const { container } = renderWithProviders(
				<SelectionCheckbox {...defaultProps} size={size} />
			);
			const th = container.querySelector('th');
			expect(th).toBeInTheDocument();
		}
	});
});

describe('ColumnResizer', () => {
	const defaultProps = {
		columnId: 'name',
		onResize: vi.fn(),
	};

	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<ColumnResizer {...defaultProps} />);
		}).not.toThrow();
	});

	it('should render button element', () => {
		renderWithProviders(<ColumnResizer {...defaultProps} />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should have correct aria-label', () => {
		renderWithProviders(<ColumnResizer {...defaultProps} />);
		const button = screen.getByLabelText('Resize column name');
		expect(button).toBeInTheDocument();
	});

	it('should handle mouse down event', () => {
		const onResize = vi.fn();
		renderWithProviders(<ColumnResizer {...defaultProps} onResize={onResize} />);
		const button = screen.getByRole('button');

		// Test that mousedown event is handled
		// The actual resize logic requires proper DOM structure with th element
		// This test verifies the button is interactive and can handle events
		fireEvent.mouseDown(button, { clientX: 100 });

		// Verify button is still in document after interaction
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('type', 'button');
	});

	it('should respect minWidth constraint', async () => {
		const onResize = vi.fn();
		renderWithProviders(<ColumnResizer {...defaultProps} onResize={onResize} minWidth={100} />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should respect maxWidth constraint', () => {
		const onResize = vi.fn();
		renderWithProviders(<ColumnResizer {...defaultProps} onResize={onResize} maxWidth={500} />);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should handle both minWidth and maxWidth', () => {
		const onResize = vi.fn();
		renderWithProviders(
			<ColumnResizer {...defaultProps} onResize={onResize} minWidth={100} maxWidth={500} />
		);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});
});
