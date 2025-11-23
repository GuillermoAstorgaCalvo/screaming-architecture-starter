/**
 * AdvancedFilterBar Component Tests
 *
 * Tests for the AdvancedFilterBar component including:
 * - Rendering with all features
 * - Filter changes
 * - Builder toggle
 * - Size variants
 * - Disabled state
 * - Custom render functions
 */

import { AdvancedFilterBar } from '@core/ui/data-display/data-table/components/advanced-filter/AdvancedFilterBar';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockOnFiltersChange = vi.fn();

const createFilters = (): AdvancedFilter[] => [
	{
		id: 'filter-1',
		label: 'Name',
		type: 'text',
		value: '',
	},
	{
		id: 'filter-2',
		label: 'Status',
		type: 'select',
		options: [
			{ value: 'active', label: 'Active' },
			{ value: 'inactive', label: 'Inactive' },
		],
		value: '',
	},
];

describe('AdvancedFilterBar - Rendering', () => {
	it('renders filter inputs grid', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBar filters={filters} onFiltersChange={mockOnFiltersChange} />
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Status')).toBeInTheDocument();
	});

	it('renders with default props', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBar filters={filters} onFiltersChange={mockOnFiltersChange} />
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const filters = createFilters();
		const { container } = renderWithProviders(
			<AdvancedFilterBar
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
				className="custom-class"
			/>
		);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toHaveClass('custom-class');
	});
});

describe('AdvancedFilterBar - Filter Changes', () => {
	it('calls onFiltersChange when filter value changes', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBar filters={filters} onFiltersChange={mockOnFiltersChange} />
		);
		const nameInput = screen.getByPlaceholderText(/filter by name/i);
		fireEvent.change(nameInput, { target: { value: 'John' } });
		expect(mockOnFiltersChange).toHaveBeenCalled();
	});

	it('calls onFiltersChange when filter is removed', () => {
		const filters = createFilters();
		const filtersWithValue = filters.map(f =>
			f.id === 'filter-1' ? { ...f, value: 'John' } : f
		) as AdvancedFilter[];
		renderWithProviders(
			<AdvancedFilterBar filters={filtersWithValue} onFiltersChange={mockOnFiltersChange} />
		);
		const removeButton = screen.getByRole('button', { name: /remove/i });
		fireEvent.click(removeButton);
		expect(mockOnFiltersChange).toHaveBeenCalled();
	});

	it('calls onFiltersChange when all filters are cleared', () => {
		const filters = createFilters();
		const filtersWithValues = filters.map(f => ({ ...f, value: 'test' })) as AdvancedFilter[];
		renderWithProviders(
			<AdvancedFilterBar filters={filtersWithValues} onFiltersChange={mockOnFiltersChange} />
		);
		const clearAllButton = screen.getByText(/clear all/i);
		fireEvent.click(clearAllButton);
		expect(mockOnFiltersChange).toHaveBeenCalled();
	});
});

describe('AdvancedFilterBar - Builder Toggle', () => {
	it('toggles builder open/closed', async () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBar filters={filters} onFiltersChange={mockOnFiltersChange} />
		);
		const toggleButton = screen.getByText(/add filter/i);
		fireEvent.click(toggleButton);
		await waitFor(() => {
			expect(screen.getByText(/filter builder/i)).toBeInTheDocument();
		});
		const closeButton = screen.getByRole('button', { name: /close filter builder/i });
		fireEvent.click(closeButton);
		await waitFor(() => {
			expect(screen.queryByText(/filter builder/i)).not.toBeInTheDocument();
		});
	});

	it('calls onFiltersChange when filter is added via builder', async () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBar filters={filters} onFiltersChange={mockOnFiltersChange} />
		);
		const toggleButton = screen.getByText(/add filter/i);
		fireEvent.click(toggleButton);
		await waitFor(() => {
			expect(screen.getByText(/filter builder/i)).toBeInTheDocument();
		});
		const labelInput = screen.getByLabelText(/filter label/i);
		const addButton = screen.getByRole('button', { name: /add filter/i });
		fireEvent.change(labelInput, { target: { value: 'New Filter' } });
		await waitFor(() => {
			expect(addButton).not.toBeDisabled();
		});
		fireEvent.click(addButton);
		await waitFor(() => {
			expect(mockOnFiltersChange).toHaveBeenCalled();
		});
	});
});

describe('AdvancedFilterBar - Size Variants', () => {
	it('renders with sm size', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBar filters={filters} onFiltersChange={mockOnFiltersChange} size="sm" />
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('renders with md size by default', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBar filters={filters} onFiltersChange={mockOnFiltersChange} />
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBar filters={filters} onFiltersChange={mockOnFiltersChange} size="lg" />
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});
});

describe('AdvancedFilterBar - Disabled State', () => {
	it('renders disabled filters', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBar filters={filters} onFiltersChange={mockOnFiltersChange} disabled />
		);
		const nameInput = screen.getByPlaceholderText(/filter by name/i);
		expect(nameInput).toBeDisabled();
	});
});

describe('AdvancedFilterBar - Feature Toggles', () => {
	it('hides filter chips when showFilterChips is false', () => {
		const filters = createFilters();
		const filtersWithValue = filters.map(f =>
			f.id === 'filter-1' ? { ...f, value: 'John' } : f
		) as AdvancedFilter[];
		renderWithProviders(
			<AdvancedFilterBar
				filters={filtersWithValue}
				onFiltersChange={mockOnFiltersChange}
				showFilterChips={false}
			/>
		);
		expect(screen.queryByText(/active filters/i)).not.toBeInTheDocument();
	});

	it('hides filter builder when showFilterBuilder is false', () => {
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBar
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
				showFilterBuilder={false}
			/>
		);
		expect(screen.queryByText(/add filter/i)).not.toBeInTheDocument();
	});
});

describe('AdvancedFilterBar - Custom Render', () => {
	it('uses custom renderFilterChip when provided', () => {
		const filters = createFilters();
		const filtersWithValue = filters.map(f =>
			f.id === 'filter-1' ? { ...f, value: 'John' } : f
		) as AdvancedFilter[];
		const customRender = vi.fn(filter => (
			<div data-testid={`custom-chip-${filter.filterId}`}>Custom: {filter.label}</div>
		));
		renderWithProviders(
			<AdvancedFilterBar
				filters={filtersWithValue}
				onFiltersChange={mockOnFiltersChange}
				renderFilterChip={customRender}
			/>
		);
		expect(screen.getByTestId('custom-chip-filter-1')).toBeInTheDocument();
		expect(customRender).toHaveBeenCalled();
	});
});

describe('AdvancedFilterBar - Direct Component Test (Coverage)', () => {
	it('should execute the AdvancedFilterBar component function directly', async () => {
		const { AdvancedFilterBar: AdvancedFilterBarComponent } = await import(
			'@core/ui/data-display/data-table/components/advanced-filter/AdvancedFilterBar'
		);
		expect(typeof AdvancedFilterBarComponent).toBe('function');
		const filters = createFilters();
		renderWithProviders(
			<AdvancedFilterBarComponent filters={filters} onFiltersChange={mockOnFiltersChange} />
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
	});
});
