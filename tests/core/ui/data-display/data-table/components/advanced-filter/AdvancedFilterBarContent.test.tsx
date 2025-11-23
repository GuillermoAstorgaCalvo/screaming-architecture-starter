/**
 * AdvancedFilterBarContent Component Tests
 *
 * Tests for the AdvancedFilterBarContent component including:
 * - Rendering filter inputs grid
 * - Rendering filter chips
 * - Rendering filter builder
 * - Conditional rendering based on props
 * - All props combinations
 */

import { AdvancedFilterBarContent } from '@core/ui/data-display/data-table/components/advanced-filter/AdvancedFilterBarContent';
import type { ActiveFilterValue, AdvancedFilter } from '@src-types/ui/advancedFilter';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockOnFilterChange = vi.fn();
const mockOnRemoveFilter = vi.fn();
const mockOnClearAllFilters = vi.fn();
const mockOnToggleBuilder = vi.fn();
const mockOnFiltersChange = vi.fn();

const createFilters = (): AdvancedFilter[] => [
	{
		id: 'filter-1',
		label: 'Name',
		type: 'text',
		value: '',
	},
];

const createActiveFilterValues = (): ActiveFilterValue[] => [
	{
		filterId: 'filter-1',
		label: 'Name',
		displayValue: 'John Doe',
		value: 'John Doe',
	},
];

describe('AdvancedFilterBarContent - Rendering', () => {
	it('renders filter inputs grid', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('renders filter chips when showFilterChips is true and active filters exist', () => {
		const filters = createFilters();
		const activeFilterValues = createActiveFilterValues();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={activeFilterValues}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText(/active filters/i)).toBeInTheDocument();
		expect(screen.getByText('Name:')).toBeInTheDocument();
	});

	it('does not render filter chips when showFilterChips is false', () => {
		const filters = createFilters();
		const activeFilterValues = createActiveFilterValues();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={activeFilterValues}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={false}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.queryByText(/active filters/i)).not.toBeInTheDocument();
	});

	it('does not render filter chips when no active filters', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.queryByText(/active filters/i)).not.toBeInTheDocument();
	});

	it('renders filter builder when showFilterBuilder is true and onFiltersChange is provided', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText(/add filter/i)).toBeInTheDocument();
	});

	it('does not render filter builder when showFilterBuilder is false', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={false}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.queryByText(/add filter/i)).not.toBeInTheDocument();
	});

	it('does not render filter builder when onFiltersChange is not provided', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
			/>
		);
		expect(screen.queryByText(/add filter/i)).not.toBeInTheDocument();
	});

	it('renders open filter builder when isBuilderOpen is true', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={true}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText(/filter builder/i)).toBeInTheDocument();
	});
});

describe('AdvancedFilterBarContent - Interactions', () => {
	it('calls onFilterChange when filter input changes', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		const input = screen.getByPlaceholderText(/filter by name/i);
		fireEvent.change(input, { target: { value: 'test' } });
		expect(mockOnFilterChange).toHaveBeenCalledWith('filter-1', 'test');
	});

	it('calls onRemoveFilter when filter chip is removed', () => {
		const filters = createFilters();
		const activeFilterValues = createActiveFilterValues();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={activeFilterValues}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		const removeButton = screen.getByRole('button', { name: /remove/i });
		fireEvent.click(removeButton);
		expect(mockOnRemoveFilter).toHaveBeenCalledWith('filter-1');
	});

	it('calls onToggleBuilder when builder toggle is clicked', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		const toggleButton = screen.getByText(/add filter/i);
		fireEvent.click(toggleButton);
		expect(mockOnToggleBuilder).toHaveBeenCalledTimes(1);
	});
});

describe('AdvancedFilterBarContent - Size Variants', () => {
	it('renders with sm size', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="sm"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="lg"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});
});

describe('AdvancedFilterBarContent - Custom ClassName', () => {
	it('applies custom className', () => {
		const filters = createFilters();
		const { container } = renderWithProviders(
			<AdvancedFilterBarContent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
				className="custom-class"
			/>
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass('custom-class');
	});
});

describe('AdvancedFilterBarContent - Direct Component Test (Coverage)', () => {
	it('should execute the AdvancedFilterBarContent component function directly', async () => {
		const { AdvancedFilterBarContent: AdvancedFilterBarContentComponent } = await import(
			'@core/ui/data-display/data-table/components/advanced-filter/AdvancedFilterBarContent'
		);
		expect(typeof AdvancedFilterBarContentComponent).toBe('function');
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarContentComponent
				filters={filters}
				activeFilterValues={[]}
				onFilterChange={mockOnFilterChange}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAllFilters={mockOnClearAllFilters}
				showFilterChips={true}
				showFilterBuilder={true}
				size="md"
				disabled={false}
				isBuilderOpen={false}
				onToggleBuilder={mockOnToggleBuilder}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});
});
