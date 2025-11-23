/**
 * FilterInputsGrid Component Tests
 *
 * Tests for the FilterInputsGrid component including:
 * - Rendering multiple filters
 * - Filter labels
 * - onChange handlers
 * - Disabled state
 * - Size variants
 */

import { FilterInputsGrid } from '@core/ui/data-display/data-table/components/advanced-filter/FilterInputsGrid';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockOnFilterChange = vi.fn();

const createFilters = (): AdvancedFilter[] => [
	{
		id: 'text-filter',
		label: 'Name',
		type: 'text',
		value: '',
	},
	{
		id: 'select-filter',
		label: 'Status',
		type: 'select',
		options: [
			{ value: 'active', label: 'Active' },
			{ value: 'inactive', label: 'Inactive' },
		],
		value: '',
	},
	{
		id: 'date-filter',
		label: 'Date',
		type: 'date',
		value: '',
	},
];

describe('FilterInputsGrid - Rendering', () => {
	it('renders grid with multiple filters', () => {
		const filters = createFilters();
		renderWithProviders(<FilterInputsGrid filters={filters} onFilterChange={mockOnFilterChange} />);
		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Status')).toBeInTheDocument();
		expect(screen.getByText('Date')).toBeInTheDocument();
	});

	it('renders filter labels', () => {
		const filters = createFilters();
		renderWithProviders(<FilterInputsGrid filters={filters} onFilterChange={mockOnFilterChange} />);
		const nameLabel = screen.getByText('Name');
		expect(nameLabel).toBeInTheDocument();
		expect(nameLabel.tagName).toBe('LABEL');
	});

	it('renders empty grid when no filters', () => {
		renderWithProviders(<FilterInputsGrid filters={[]} onFilterChange={mockOnFilterChange} />);
		expect(screen.queryByText('Name')).not.toBeInTheDocument();
		expect(screen.queryByText('Status')).not.toBeInTheDocument();
		expect(screen.queryByText('Date')).not.toBeInTheDocument();
	});

	it('renders single filter', () => {
		const filters = createFilters();
		const singleFilter = filters.slice(0, 1);
		renderWithProviders(
			<FilterInputsGrid filters={singleFilter} onFilterChange={mockOnFilterChange} />
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('associates labels with inputs correctly', () => {
		const filters = createFilters();
		renderWithProviders(<FilterInputsGrid filters={filters} onFilterChange={mockOnFilterChange} />);
		const nameLabel = screen.getByText('Name');
		const nameInput = screen.getByPlaceholderText(/filter by name/i);
		expect(nameLabel).toHaveAttribute('for', 'filter-text-filter');
		expect(nameInput).toHaveAttribute('id', 'filter-text-filter');
	});
});

describe('FilterInputsGrid - Interactions', () => {
	it('calls onFilterChange when filter value changes', () => {
		const filters = createFilters();
		renderWithProviders(<FilterInputsGrid filters={filters} onFilterChange={mockOnFilterChange} />);
		const nameInput = screen.getByPlaceholderText(/filter by name/i);
		fireEvent.change(nameInput, { target: { value: 'test' } });
		expect(mockOnFilterChange).toHaveBeenCalledWith('text-filter', 'test');
	});
});

describe('FilterInputsGrid - Disabled State', () => {
	it('renders disabled filters', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterInputsGrid filters={filters} onFilterChange={mockOnFilterChange} disabled />
		);
		const nameInput = screen.getByPlaceholderText(/filter by name/i);
		expect(nameInput).toBeDisabled();
	});

	it('renders enabled filters by default', () => {
		const filters = createFilters();
		renderWithProviders(<FilterInputsGrid filters={filters} onFilterChange={mockOnFilterChange} />);
		const nameInput = screen.getByPlaceholderText(/filter by name/i);
		expect(nameInput).not.toBeDisabled();
	});
});

describe('FilterInputsGrid - Size Variants', () => {
	it('renders with sm size', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterInputsGrid filters={filters} onFilterChange={mockOnFilterChange} size="sm" />
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('renders with md size by default', () => {
		const filters = createFilters();
		renderWithProviders(<FilterInputsGrid filters={filters} onFilterChange={mockOnFilterChange} />);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterInputsGrid filters={filters} onFilterChange={mockOnFilterChange} size="lg" />
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});
});

describe('FilterInputsGrid - Direct Component Test (Coverage)', () => {
	it('should execute the FilterInputsGrid component function directly', async () => {
		const { FilterInputsGrid: FilterInputsGridComponent } = await import(
			'@core/ui/data-display/data-table/components/advanced-filter/FilterInputsGrid'
		);
		expect(typeof FilterInputsGridComponent).toBe('function');
		const filters = createFilters();
		renderWithProviders(
			<FilterInputsGridComponent filters={filters} onFilterChange={mockOnFilterChange} />
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});
});
