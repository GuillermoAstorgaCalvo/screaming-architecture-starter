/**
 * FilterInput Component Tests
 *
 * Tests for the FilterInput component including:
 * - Rendering different filter types
 * - onChange handlers
 * - Disabled state
 * - Size variants
 */

import { FilterInput } from '@core/ui/data-display/data-table/components/advanced-filter/FilterInput';
import type { AdvancedFilter } from '@src-types/ui/advancedFilter';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockOnChange = vi.fn();

const DATE_INPUT_SELECTOR = 'input[type="date"]';

const createTextFilter = (): AdvancedFilter => ({
	id: 'text-filter',
	label: 'Text Filter',
	type: 'text',
	value: '',
});

const createSelectFilter = (): AdvancedFilter => ({
	id: 'select-filter',
	label: 'Select Filter',
	type: 'select',
	options: [
		{ value: 'option1', label: 'Option 1' },
		{ value: 'option2', label: 'Option 2' },
	],
	value: '',
});

const createMultiSelectFilter = (): AdvancedFilter => ({
	id: 'multi-select-filter',
	label: 'Multi Select Filter',
	type: 'multi-select',
	options: [
		{ value: 'option1', label: 'Option 1' },
		{ value: 'option2', label: 'Option 2' },
	],
	value: [],
});

const createDateFilter = (): AdvancedFilter => ({
	id: 'date-filter',
	label: 'Date Filter',
	type: 'date',
	value: '',
});

const createDateRangeFilter = (): AdvancedFilter => ({
	id: 'date-range-filter',
	label: 'Date Range Filter',
	type: 'date-range',
	startValue: '',
	endValue: '',
});

describe('FilterInput - Rendering', () => {
	it('renders text filter input', () => {
		const filter = createTextFilter();
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} />);
		const input = screen.getByPlaceholderText(/filter by text filter/i);
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('renders select filter input', () => {
		const filter = createSelectFilter();
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} />);
		const select = screen.getByRole('combobox');
		expect(select).toBeInTheDocument();
	});

	it('renders multi-select filter input', () => {
		const filter = createMultiSelectFilter();
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} />);
		// MultiSelect renders a textbox input
		const multiSelect = screen.getByRole('textbox');
		expect(multiSelect).toBeInTheDocument();
	});

	it('renders date filter input', () => {
		const filter = createDateFilter();
		const { container } = renderWithProviders(
			<FilterInput filter={filter} onChange={mockOnChange} />
		);
		// Date inputs without labels don't have accessible roles, so we use querySelector
		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
		const dateInput = container.querySelector(DATE_INPUT_SELECTOR);
		expect(dateInput).toBeInTheDocument();
	});

	it('renders date-range filter input', () => {
		const filter = createDateRangeFilter();
		const { container } = renderWithProviders(
			<FilterInput filter={filter} onChange={mockOnChange} />
		);
		// Date inputs without labels don't have accessible roles, so we use querySelector
		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
		const dateInputs = container.querySelectorAll(DATE_INPUT_SELECTOR);
		expect(dateInputs).toHaveLength(2);
		expect(dateInputs[0]).toBeInTheDocument();
		expect(dateInputs[1]).toBeInTheDocument();
	});

	it('returns null for unknown filter type', () => {
		const filter = {
			id: 'unknown',
			label: 'Unknown',
			type: 'unknown',
		} as unknown as AdvancedFilter;
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} />);
		// Component returns null, so no elements should be rendered
		expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
		expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
	});
});

describe('FilterInput - Interactions', () => {
	it('calls onChange when text input changes', () => {
		const filter = createTextFilter();
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} />);
		const input = screen.getByPlaceholderText(/filter by text filter/i);
		fireEvent.change(input, { target: { value: 'test value' } });
		expect(mockOnChange).toHaveBeenCalledWith('text-filter', 'test value');
	});

	it('calls onChange when select changes', () => {
		const filter = createSelectFilter();
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} />);
		const select = screen.getByRole('combobox');
		fireEvent.change(select, { target: { value: 'option1' } });
		expect(mockOnChange).toHaveBeenCalledWith('select-filter', 'option1');
	});

	it('calls onChange when date input changes', () => {
		const filter = createDateFilter();
		const { container } = renderWithProviders(
			<FilterInput filter={filter} onChange={mockOnChange} />
		);
		// Date inputs without labels don't have accessible roles, so we use querySelector
		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
		const dateInput = container.querySelector(DATE_INPUT_SELECTOR) as HTMLInputElement;
		expect(dateInput).toBeInTheDocument();
		fireEvent.change(dateInput, { target: { value: '2024-01-01' } });
		expect(mockOnChange).toHaveBeenCalledWith('date-filter', '2024-01-01');
	});
});

describe('FilterInput - Disabled State', () => {
	it('renders disabled text input', () => {
		const filter = createTextFilter();
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} disabled />);
		const input = screen.getByPlaceholderText(/filter by text filter/i);
		expect(input).toBeDisabled();
	});

	it('renders disabled select input', () => {
		const filter = createSelectFilter();
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} disabled />);
		const select = screen.getByRole('combobox');
		expect(select).toBeDisabled();
	});
});

describe('FilterInput - Size Variants', () => {
	it('renders with sm size', () => {
		const filter = createTextFilter();
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} size="sm" />);
		const input = screen.getByPlaceholderText(/filter by text filter/i);
		expect(input).toBeInTheDocument();
	});

	it('renders with md size by default', () => {
		const filter = createTextFilter();
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} />);
		const input = screen.getByPlaceholderText(/filter by text filter/i);
		expect(input).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		const filter = createTextFilter();
		renderWithProviders(<FilterInput filter={filter} onChange={mockOnChange} size="lg" />);
		const input = screen.getByPlaceholderText(/filter by text filter/i);
		expect(input).toBeInTheDocument();
	});
});

describe('FilterInput - Direct Component Test (Coverage)', () => {
	it('should execute the FilterInput component function directly', async () => {
		const { FilterInput: FilterInputComponent } = await import(
			'@core/ui/data-display/data-table/components/advanced-filter/FilterInput'
		);
		expect(typeof FilterInputComponent).toBe('function');
		const filter = createTextFilter();
		renderWithProviders(<FilterInputComponent filter={filter} onChange={mockOnChange} />);
		expect(screen.getByPlaceholderText(/filter by text filter/i)).toBeInTheDocument();
	});
});
