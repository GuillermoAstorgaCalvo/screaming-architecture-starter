/**
 * FilterBuilder Component Tests
 *
 * Tests for the FilterBuilder component including:
 * - Rendering closed state
 * - Rendering open state
 * - Adding filters
 * - Removing filters
 * - Toggle functionality
 * - Disabled state
 */

import { FilterBuilder } from '@core/ui/data-display/data-table/components/advanced-filter/FilterBuilder';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockOnToggle = vi.fn();
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
		options: [],
		value: '',
	},
];

describe('FilterBuilder - Closed State', () => {
	beforeEach(() => {
		mockOnToggle.mockClear();
		mockOnFiltersChange.mockClear();
	});

	it('renders closed state button when isOpen is false', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilder
				isOpen={false}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText(/add filter/i)).toBeInTheDocument();
		expect(screen.queryByText(/filter builder/i)).not.toBeInTheDocument();
	});

	it('calls onToggle when closed button is clicked', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilder
				isOpen={false}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		const button = screen.getByText(/add filter/i);
		fireEvent.click(button);
		expect(mockOnToggle).toHaveBeenCalledTimes(1);
	});

	it('renders disabled closed button when disabled', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilder
				isOpen={false}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
				disabled
			/>
		);
		const button = screen.getByText(/add filter/i);
		expect(button).toBeDisabled();
	});
});

describe('FilterBuilder - Open State - Rendering', () => {
	beforeEach(() => {
		mockOnToggle.mockClear();
		mockOnFiltersChange.mockClear();
	});
	it('renders open state with header and form when isOpen is true', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilder
				isOpen={true}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText(/filter builder/i)).toBeInTheDocument();
		expect(screen.getByText(/add new filter/i)).toBeInTheDocument();
		expect(screen.getByText(/current filters/i)).toBeInTheDocument();
	});

	it('renders filter list when filters exist', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilder
				isOpen={true}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText('Name')).toBeInTheDocument();
		expect(screen.getByText('Status')).toBeInTheDocument();
	});

	it('renders add filter form', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilder
				isOpen={true}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByLabelText(/filter label/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/filter type/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /add filter/i })).toBeInTheDocument();
	});

	it('does not render filter list when filters array is empty', () => {
		renderWithProviders(
			<FilterBuilder
				isOpen={true}
				onToggle={mockOnToggle}
				filters={[]}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.queryByText(/current filters/i)).not.toBeInTheDocument();
	});
});

describe('FilterBuilder - Open State - Interactions', () => {
	beforeEach(() => {
		mockOnToggle.mockClear();
		mockOnFiltersChange.mockClear();
	});
	it('calls onToggle when close button is clicked', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilder
				isOpen={true}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		const closeButton = screen.getByRole('button', { name: /close filter builder/i });
		fireEvent.click(closeButton);
		expect(mockOnToggle).toHaveBeenCalledTimes(1);
	});

	it('calls onFiltersChange when filter is added', async () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilder
				isOpen={true}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
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

	it('calls onFiltersChange when filter is removed', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilder
				isOpen={true}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		const removeButtons = screen.getAllByRole('button', { name: /remove/i });
		const [firstRemoveButton] = removeButtons;
		expect(firstRemoveButton).toBeDefined();
		if (firstRemoveButton) {
			fireEvent.click(firstRemoveButton);
		}
		expect(mockOnFiltersChange).toHaveBeenCalledWith([filters[1]]);
	});
});

describe('FilterBuilder - Open State - Disabled State', () => {
	beforeEach(() => {
		mockOnToggle.mockClear();
		mockOnFiltersChange.mockClear();
	});
	it('renders disabled form when disabled prop is true', () => {
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilder
				isOpen={true}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
				disabled
			/>
		);
		const labelInput = screen.getByLabelText(/filter label/i);
		const typeSelect = screen.getByLabelText(/filter type/i);
		const addButton = screen.getByRole('button', { name: /add filter/i });
		expect(labelInput).toBeDisabled();
		expect(typeSelect).toBeDisabled();
		expect(addButton).toBeDisabled();
	});
});

describe('FilterBuilder - Direct Component Test (Coverage)', () => {
	beforeEach(() => {
		mockOnToggle.mockClear();
		mockOnFiltersChange.mockClear();
	});

	it('should execute the FilterBuilder component function directly', async () => {
		const { FilterBuilder: FilterBuilderComponent } = await import(
			'@core/ui/data-display/data-table/components/advanced-filter/FilterBuilder'
		);
		expect(typeof FilterBuilderComponent).toBe('function');
		const filters = createFilters();
		renderWithProviders(
			<FilterBuilderComponent
				isOpen={true}
				onToggle={mockOnToggle}
				filters={filters}
				onFiltersChange={mockOnFiltersChange}
			/>
		);
		expect(screen.getByText(/filter builder/i)).toBeInTheDocument();
	});
});
