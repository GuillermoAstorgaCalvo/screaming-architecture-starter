/**
 * FilterList Component Tests
 *
 * Tests for the FilterList and FilterListItem components:
 * - Rendering filter list
 * - Removing filters
 * - Disabled state
 * - Empty state
 */

import {
	FilterList,
	FilterListItem,
} from '@core/ui/data-display/data-table/components/advanced-filter/FilterList';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockOnRemove = vi.fn();

beforeEach(() => {
	mockOnRemove.mockClear();
});

const FILTER_ID_1 = 'filter-1';
const FILTER_ID_2 = 'filter-2';
const FILTER_TYPE_TEXT = 'text';
const FILTER_TYPE_SELECT = 'select';
const FILTER_LABEL_NAME = 'Name Filter';
const FILTER_LABEL_STATUS = 'Status Filter';
const HEADING_CURRENT_FILTERS = 'Current Filters';

const createFilters = (): AdvancedFilter[] => [
	{
		id: FILTER_ID_1,
		label: FILTER_LABEL_NAME,
		type: FILTER_TYPE_TEXT,
		value: '',
	},
	{
		id: FILTER_ID_2,
		label: FILTER_LABEL_STATUS,
		type: FILTER_TYPE_SELECT,
		options: [],
		value: '',
	},
];

const getFirstFilter = (): AdvancedFilter => {
	const filters = createFilters();
	const [firstFilter] = filters;
	if (!firstFilter) {
		throw new Error('Expected at least one filter');
	}
	return firstFilter;
};

describe('FilterListItem', () => {
	it('renders filter item with label and type', () => {
		const filter = getFirstFilter();
		renderWithProviders(<FilterListItem filter={filter} onRemove={mockOnRemove} />);
		expect(screen.getByText(FILTER_LABEL_NAME)).toBeInTheDocument();
		expect(screen.getByText(`(${FILTER_TYPE_TEXT})`)).toBeInTheDocument();
	});

	it('renders remove button', () => {
		const filter = getFirstFilter();
		renderWithProviders(<FilterListItem filter={filter} onRemove={mockOnRemove} />);
		const removeButton = screen.getByRole('button', { name: /remove name(?: filter){2}/i });
		expect(removeButton).toBeInTheDocument();
	});

	it('calls onRemove when remove button is clicked', () => {
		const filter = getFirstFilter();
		renderWithProviders(<FilterListItem filter={filter} onRemove={mockOnRemove} />);
		const removeButton = screen.getByRole('button', { name: /remove name(?: filter){2}/i });
		fireEvent.click(removeButton);
		expect(mockOnRemove).toHaveBeenCalledWith(FILTER_ID_1);
	});

	it('renders disabled remove button', () => {
		const filter = getFirstFilter();
		renderWithProviders(<FilterListItem filter={filter} onRemove={mockOnRemove} disabled />);
		const removeButton = screen.getByRole('button', { name: /remove name(?: filter){2}/i });
		expect(removeButton).toBeDisabled();
	});

	it('does not call onRemove when disabled and clicked', () => {
		const filter = getFirstFilter();
		renderWithProviders(<FilterListItem filter={filter} onRemove={mockOnRemove} disabled />);
		const removeButton = screen.getByRole('button', { name: /remove name(?: filter){2}/i });
		fireEvent.click(removeButton);
		expect(mockOnRemove).not.toHaveBeenCalled();
	});
});

describe('FilterList', () => {
	it('renders list of filters', () => {
		const filters = createFilters();
		renderWithProviders(<FilterList filters={filters} onRemoveFilter={mockOnRemove} />);
		expect(screen.getByText(FILTER_LABEL_NAME)).toBeInTheDocument();
		expect(screen.getByText(FILTER_LABEL_STATUS)).toBeInTheDocument();
		expect(screen.getByText(HEADING_CURRENT_FILTERS)).toBeInTheDocument();
	});

	it('renders "Current Filters" heading', () => {
		const filters = createFilters();
		renderWithProviders(<FilterList filters={filters} onRemoveFilter={mockOnRemove} />);
		expect(screen.getByText(HEADING_CURRENT_FILTERS)).toBeInTheDocument();
	});

	it('returns null when filters array is empty', () => {
		renderWithProviders(<FilterList filters={[]} onRemoveFilter={mockOnRemove} />);
		expect(screen.queryByText(HEADING_CURRENT_FILTERS)).not.toBeInTheDocument();
	});

	it('calls onRemoveFilter when filter is removed', () => {
		const filters = createFilters();
		renderWithProviders(<FilterList filters={filters} onRemoveFilter={mockOnRemove} />);
		const removeButtons = screen.getAllByRole('button', { name: /remove/i });
		const [firstButton] = removeButtons;
		if (firstButton) {
			fireEvent.click(firstButton);
		}
		expect(mockOnRemove).toHaveBeenCalledWith(FILTER_ID_1);
	});

	it('renders disabled filters', () => {
		const filters = createFilters();
		renderWithProviders(<FilterList filters={filters} onRemoveFilter={mockOnRemove} disabled />);
		const removeButtons = screen.getAllByRole('button', { name: /remove/i });
		for (const button of removeButtons) {
			expect(button).toBeDisabled();
		}
	});

	it('renders single filter', () => {
		const firstFilter = getFirstFilter();
		const filters = [firstFilter];
		renderWithProviders(<FilterList filters={filters} onRemoveFilter={mockOnRemove} />);
		expect(screen.getByText(FILTER_LABEL_NAME)).toBeInTheDocument();
		expect(screen.queryByText(FILTER_LABEL_STATUS)).not.toBeInTheDocument();
	});
});

describe('FilterList - Direct Component Test (Coverage)', () => {
	it('should execute the FilterList component function directly', async () => {
		const { FilterList: FilterListComponent } = await import(
			'@core/ui/data-display/data-table/components/advanced-filter/FilterList'
		);
		expect(typeof FilterListComponent).toBe('function');
		const filters = createFilters();
		renderWithProviders(<FilterListComponent filters={filters} onRemoveFilter={mockOnRemove} />);
		expect(screen.getByText(FILTER_LABEL_NAME)).toBeInTheDocument();
	});
});
