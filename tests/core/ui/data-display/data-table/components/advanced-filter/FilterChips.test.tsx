/**
 * FilterChips Component Tests
 *
 * Tests for the FilterChips component including:
 * - Rendering active filters as chips
 * - Removing individual filters
 * - Clearing all filters
 * - Custom render function
 * - Size variants
 * - Empty state
 */

import { FilterChips } from '@core/ui/data-display/data-table/components/advanced-filter/FilterChips';
import type { ActiveFilterValue } from '@src-types/ui/advancedFilter';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockOnRemoveFilter = vi.fn();
const mockOnClearAll = vi.fn();

const createActiveFilters = (): ActiveFilterValue[] => [
	{
		filterId: 'filter-1',
		label: 'Name',
		displayValue: 'John Doe',
		value: 'John Doe',
	},
	{
		filterId: 'filter-2',
		label: 'Status',
		displayValue: 'Active',
		value: 'active',
	},
];

describe('FilterChips - Rendering', () => {
	it('renders active filters as chips', () => {
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
			/>
		);
		expect(screen.getByText('Name:')).toBeInTheDocument();
		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Status:')).toBeInTheDocument();
		expect(screen.getByText('Active')).toBeInTheDocument();
	});

	it('renders "Active filters:" label', () => {
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
			/>
		);
		expect(screen.getByText(/active filters/i)).toBeInTheDocument();
	});

	it('renders "Clear all" button when onClearAll is provided', () => {
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
			/>
		);
		expect(screen.getByText(/clear all/i)).toBeInTheDocument();
	});

	it('does not render "Clear all" button when onClearAll is not provided', () => {
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChips activeFilters={activeFilters} onRemoveFilter={mockOnRemoveFilter} />
		);
		expect(screen.queryByText(/clear all/i)).not.toBeInTheDocument();
	});

	it('returns null when no active filters', () => {
		const { container } = renderWithProviders(
			<FilterChips activeFilters={[]} onRemoveFilter={mockOnRemoveFilter} />
		);
		expect(container.firstChild).toBeNull();
	});
});

describe('FilterChips - Interactions', () => {
	it('calls onRemoveFilter when chip remove button is clicked', () => {
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
			/>
		);
		const removeButtons = screen.getAllByRole('button', { name: /remove/i });
		expect(removeButtons[0]).toBeDefined();
		if (removeButtons[0]) {
			fireEvent.click(removeButtons[0]);
			expect(mockOnRemoveFilter).toHaveBeenCalledWith('filter-1');
		}
	});

	it('calls onClearAll when clear all button is clicked', () => {
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
			/>
		);
		const clearAllButton = screen.getByText(/clear all/i);
		fireEvent.click(clearAllButton);
		expect(mockOnClearAll).toHaveBeenCalledTimes(1);
	});
});

describe('FilterChips - Custom Render', () => {
	it('uses custom renderFilterChip when provided', () => {
		const activeFilters = createActiveFilters();
		const customRender = vi.fn((filter: ActiveFilterValue) => (
			<div data-testid={`custom-chip-${filter.filterId}`}>Custom: {filter.label}</div>
		));
		renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
				renderFilterChip={customRender}
			/>
		);
		expect(screen.getByTestId('custom-chip-filter-1')).toBeInTheDocument();
		expect(screen.getByTestId('custom-chip-filter-2')).toBeInTheDocument();
		expect(customRender).toHaveBeenCalledTimes(2);
	});

	it('uses default chip rendering when renderFilterChip is not provided', () => {
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
			/>
		);
		expect(screen.getByText('Name:')).toBeInTheDocument();
		expect(screen.getByText('John Doe')).toBeInTheDocument();
	});
});

describe('FilterChips - Size Variants', () => {
	it('renders with sm size', () => {
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
				size="sm"
			/>
		);
		expect(screen.getByText(/active filters/i)).toBeInTheDocument();
	});

	it('renders with md size by default', () => {
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
			/>
		);
		expect(screen.getByText(/active filters/i)).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
				size="lg"
			/>
		);
		expect(screen.getByText(/active filters/i)).toBeInTheDocument();
	});
});

describe('FilterChips - Custom ClassName', () => {
	it('applies custom className', () => {
		const activeFilters = createActiveFilters();
		const { container } = renderWithProviders(
			<FilterChips
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
				className="custom-class"
			/>
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass('custom-class');
	});
});

describe('FilterChips - Direct Component Test (Coverage)', () => {
	it('should execute the FilterChips component function directly', async () => {
		const { FilterChips: FilterChipsComponent } = await import(
			'@core/ui/data-display/data-table/components/advanced-filter/FilterChips'
		);
		expect(typeof FilterChipsComponent).toBe('function');
		const activeFilters = createActiveFilters();
		renderWithProviders(
			<FilterChipsComponent
				activeFilters={activeFilters}
				onRemoveFilter={mockOnRemoveFilter}
				onClearAll={mockOnClearAll}
			/>
		);
		expect(screen.getByText(/active filters/i)).toBeInTheDocument();
	});
});
