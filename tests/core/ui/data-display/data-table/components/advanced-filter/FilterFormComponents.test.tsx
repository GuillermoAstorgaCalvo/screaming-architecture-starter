/**
 * FilterFormComponents Tests
 *
 * Tests for filter form components:
 * - FilterLabelInput
 * - FilterTypeSelect
 * - AddFilterForm
 */

import {
	AddFilterForm,
	FilterLabelInput,
	FilterTypeSelect,
} from '@core/ui/data-display/data-table/components/advanced-filter/FilterFormComponents';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockOnChange = vi.fn();
const mockOnFilterTypeChange = vi.fn();
const mockOnFilterLabelChange = vi.fn();
const mockOnAddFilter = vi.fn();

describe('FilterLabelInput', () => {
	it('renders label input', () => {
		renderWithProviders(<FilterLabelInput value="" onChange={mockOnChange} />);
		const input = screen.getByLabelText(/filter label/i);
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('renders with value', () => {
		renderWithProviders(<FilterLabelInput value="Test Label" onChange={mockOnChange} />);
		const input = screen.getByLabelText(/filter label/i);
		expect(input).toHaveValue('Test Label');
	});

	it('calls onChange when value changes', () => {
		renderWithProviders(<FilterLabelInput value="" onChange={mockOnChange} />);
		const input = screen.getByLabelText(/filter label/i);
		fireEvent.change(input, { target: { value: 'New Label' } });
		expect(mockOnChange).toHaveBeenCalledWith('New Label');
	});

	it('renders disabled input', () => {
		renderWithProviders(<FilterLabelInput value="" onChange={mockOnChange} disabled />);
		const input = screen.getByLabelText(/filter label/i);
		expect(input).toBeDisabled();
	});

	it('renders placeholder', () => {
		renderWithProviders(<FilterLabelInput value="" onChange={mockOnChange} />);
		const input = screen.getByPlaceholderText(/e\.g\., status, date, category/i);
		expect(input).toBeInTheDocument();
	});
});

describe('FilterTypeSelect', () => {
	it('renders filter type select', () => {
		renderWithProviders(<FilterTypeSelect value="text" onChange={mockOnFilterTypeChange} />);
		const select = screen.getByLabelText(/filter type/i);
		expect(select).toBeInTheDocument();
	});

	it('renders all filter type options', () => {
		renderWithProviders(<FilterTypeSelect value="text" onChange={mockOnFilterTypeChange} />);
		const select = screen.getByLabelText(/filter type/i);
		expect(select).toBeInTheDocument();
		// Verify select has multiple filter type options by testing value changes to different types
		mockOnFilterTypeChange.mockClear();
		fireEvent.change(select, { target: { value: 'select' } });
		expect(mockOnFilterTypeChange).toHaveBeenCalledWith('select');
		mockOnFilterTypeChange.mockClear();
		fireEvent.change(select, { target: { value: 'date' } });
		expect(mockOnFilterTypeChange).toHaveBeenCalledWith('date');
		mockOnFilterTypeChange.mockClear();
		fireEvent.change(select, { target: { value: 'multi-select' } });
		expect(mockOnFilterTypeChange).toHaveBeenCalledWith('multi-select');
	});

	it('calls onChange when type changes', () => {
		renderWithProviders(<FilterTypeSelect value="text" onChange={mockOnFilterTypeChange} />);
		const select = screen.getByLabelText(/filter type/i);
		fireEvent.change(select, { target: { value: 'select' } });
		expect(mockOnFilterTypeChange).toHaveBeenCalledWith('select');
	});

	it('renders disabled select', () => {
		renderWithProviders(
			<FilterTypeSelect value="text" onChange={mockOnFilterTypeChange} disabled />
		);
		const select = screen.getByLabelText(/filter type/i);
		expect(select).toBeDisabled();
	});

	it('renders with current value selected', () => {
		renderWithProviders(<FilterTypeSelect value="date" onChange={mockOnFilterTypeChange} />);
		const select = screen.getByLabelText(/filter type/i);
		expect(select).toHaveValue('date');
	});
});

describe('AddFilterForm', () => {
	describe('Rendering', () => {
		it('renders form with inputs', () => {
			renderWithProviders(
				<AddFilterForm
					filterType="text"
					filterLabel=""
					onFilterTypeChange={mockOnFilterTypeChange}
					onFilterLabelChange={mockOnFilterLabelChange}
					onAddFilter={mockOnAddFilter}
				/>
			);
			expect(screen.getByText(/add new filter/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/filter label/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/filter type/i)).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /add filter/i })).toBeInTheDocument();
		});
	});

	describe('Button state', () => {
		it('renders disabled add button when label is empty', () => {
			renderWithProviders(
				<AddFilterForm
					filterType="text"
					filterLabel=""
					onFilterTypeChange={mockOnFilterTypeChange}
					onFilterLabelChange={mockOnFilterLabelChange}
					onAddFilter={mockOnAddFilter}
				/>
			);
			const addButton = screen.getByRole('button', { name: /add filter/i });
			expect(addButton).toBeDisabled();
		});

		it('renders disabled add button when label is only whitespace', () => {
			renderWithProviders(
				<AddFilterForm
					filterType="text"
					filterLabel="   "
					onFilterTypeChange={mockOnFilterTypeChange}
					onFilterLabelChange={mockOnFilterLabelChange}
					onAddFilter={mockOnAddFilter}
				/>
			);
			const addButton = screen.getByRole('button', { name: /add filter/i });
			expect(addButton).toBeDisabled();
		});

		it('renders enabled add button when label has value', () => {
			renderWithProviders(
				<AddFilterForm
					filterType="text"
					filterLabel="Test Filter"
					onFilterTypeChange={mockOnFilterTypeChange}
					onFilterLabelChange={mockOnFilterLabelChange}
					onAddFilter={mockOnAddFilter}
				/>
			);
			const addButton = screen.getByRole('button', { name: /add filter/i });
			expect(addButton).not.toBeDisabled();
		});
	});

	describe('Interactions', () => {
		it('calls onAddFilter when add button is clicked', () => {
			renderWithProviders(
				<AddFilterForm
					filterType="text"
					filterLabel="Test Filter"
					onFilterTypeChange={mockOnFilterTypeChange}
					onFilterLabelChange={mockOnFilterLabelChange}
					onAddFilter={mockOnAddFilter}
				/>
			);
			const addButton = screen.getByRole('button', { name: /add filter/i });
			fireEvent.click(addButton);
			expect(mockOnAddFilter).toHaveBeenCalledTimes(1);
		});

		it('does not call onAddFilter when button is disabled', () => {
			mockOnAddFilter.mockClear();
			renderWithProviders(
				<AddFilterForm
					filterType="text"
					filterLabel=""
					onFilterTypeChange={mockOnFilterTypeChange}
					onFilterLabelChange={mockOnFilterLabelChange}
					onAddFilter={mockOnAddFilter}
				/>
			);
			const addButton = screen.getByRole('button', { name: /add filter/i });
			expect(addButton).toBeDisabled();
			fireEvent.click(addButton);
			expect(mockOnAddFilter).not.toHaveBeenCalled();
		});

		it('calls onFilterLabelChange when label input changes', () => {
			renderWithProviders(
				<AddFilterForm
					filterType="text"
					filterLabel=""
					onFilterTypeChange={mockOnFilterTypeChange}
					onFilterLabelChange={mockOnFilterLabelChange}
					onAddFilter={mockOnAddFilter}
				/>
			);
			const labelInput = screen.getByLabelText(/filter label/i);
			fireEvent.change(labelInput, { target: { value: 'New Label' } });
			expect(mockOnFilterLabelChange).toHaveBeenCalledWith('New Label');
		});

		it('calls onFilterTypeChange when type select changes', () => {
			renderWithProviders(
				<AddFilterForm
					filterType="text"
					filterLabel="Test Filter"
					onFilterTypeChange={mockOnFilterTypeChange}
					onFilterLabelChange={mockOnFilterLabelChange}
					onAddFilter={mockOnAddFilter}
				/>
			);
			const typeSelect = screen.getByLabelText(/filter type/i);
			fireEvent.change(typeSelect, { target: { value: 'select' } });
			expect(mockOnFilterTypeChange).toHaveBeenCalledWith('select');
		});
	});

	describe('Disabled state', () => {
		it('renders disabled form when disabled prop is true', () => {
			renderWithProviders(
				<AddFilterForm
					filterType="text"
					filterLabel="Test Filter"
					onFilterTypeChange={mockOnFilterTypeChange}
					onFilterLabelChange={mockOnFilterLabelChange}
					onAddFilter={mockOnAddFilter}
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
});
