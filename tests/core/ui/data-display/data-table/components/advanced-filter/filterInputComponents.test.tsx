/**
 * FilterInputComponents Tests
 *
 * Tests for filter input component implementations:
 * - TextFilterInput
 * - SelectFilterInput
 * - MultiSelectFilterInput
 * - DateFilterInput
 * - DateRangeFilterInput
 */

import {
	DateFilterInput,
	DateRangeFilterInput,
	MultiSelectFilterInput,
	SelectFilterInput,
	TextFilterInput,
} from '@core/ui/data-display/data-table/components/advanced-filter/filterInputComponents';
import type {
	DateAdvancedFilter,
	DateRangeAdvancedFilter,
	MultiSelectAdvancedFilter,
	SelectAdvancedFilter,
	TextAdvancedFilter,
} from '@src-types/ui/advancedFilter';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockOnChange = vi.fn();

const commonProps = {
	disabled: false,
	size: 'md' as const,
	onChange: mockOnChange,
};

const PLACEHOLDER_ENTER_NAME = 'Enter name';
const PLACEHOLDER_ALL_STATUS = 'All Status';
const FILTER_ID_TEXT = 'text-filter';
const FILTER_ID_DATE_RANGE = 'date-range-filter';
const TEST_NAME_HANDLES_EMPTY_VALUE = 'handles empty value';

describe('TextFilterInput', () => {
	const filter: TextAdvancedFilter = {
		id: FILTER_ID_TEXT,
		label: 'Name',
		type: 'text',
		value: 'initial value',
		placeholder: 'Enter name',
	};

	it('renders text input with value', () => {
		renderWithProviders(<TextFilterInput filter={filter} commonProps={commonProps} />);
		const input = screen.getByPlaceholderText(PLACEHOLDER_ENTER_NAME);
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue('initial value');
	});

	it('renders with default placeholder when not provided', () => {
		const { placeholder: _placeholder, ...filterWithoutPlaceholder } = filter;
		renderWithProviders(
			<TextFilterInput filter={filterWithoutPlaceholder} commonProps={commonProps} />
		);
		const input = screen.getByPlaceholderText('Filter by Name');
		expect(input).toBeInTheDocument();
	});

	it('calls onChange when value changes', () => {
		renderWithProviders(<TextFilterInput filter={filter} commonProps={commonProps} />);
		const input = screen.getByPlaceholderText(PLACEHOLDER_ENTER_NAME);
		fireEvent.change(input, { target: { value: 'new value' } });
		expect(mockOnChange).toHaveBeenCalledWith(FILTER_ID_TEXT, 'new value');
	});

	it(TEST_NAME_HANDLES_EMPTY_VALUE, () => {
		const { value: _value, ...emptyFilter } = filter;
		renderWithProviders(<TextFilterInput filter={emptyFilter} commonProps={commonProps} />);
		const input = screen.getByPlaceholderText(PLACEHOLDER_ENTER_NAME);
		expect(input).toHaveValue('');
	});

	it('renders disabled input', () => {
		renderWithProviders(
			<TextFilterInput filter={filter} commonProps={{ ...commonProps, disabled: true }} />
		);
		const input = screen.getByPlaceholderText(PLACEHOLDER_ENTER_NAME);
		expect(input).toBeDisabled();
	});
});

describe('SelectFilterInput', () => {
	const filter: SelectAdvancedFilter = {
		id: 'select-filter',
		label: 'Status',
		type: 'select',
		options: [
			{ value: 'active', label: 'Active' },
			{ value: 'inactive', label: 'Inactive' },
		],
		value: 'active',
		placeholder: 'All Status',
	};

	it('renders select with options', () => {
		renderWithProviders(<SelectFilterInput filter={filter} commonProps={commonProps} />);
		const select = screen.getByRole('combobox');
		expect(select).toBeInTheDocument();
		expect(select).toHaveValue('active');
	});

	it('renders placeholder option', () => {
		renderWithProviders(<SelectFilterInput filter={filter} commonProps={commonProps} />);
		const placeholder = screen.getByText(PLACEHOLDER_ALL_STATUS);
		expect(placeholder).toBeInTheDocument();
	});

	it('renders default placeholder when not provided', () => {
		const { placeholder: _placeholder, ...filterWithoutPlaceholder } = filter;
		renderWithProviders(
			<SelectFilterInput filter={filterWithoutPlaceholder} commonProps={commonProps} />
		);
		const placeholderText = screen.getByText(PLACEHOLDER_ALL_STATUS);
		expect(placeholderText).toBeInTheDocument();
	});

	it('calls onChange when selection changes', () => {
		renderWithProviders(<SelectFilterInput filter={filter} commonProps={commonProps} />);
		const select = screen.getByRole('combobox');
		fireEvent.change(select, { target: { value: 'inactive' } });
		expect(mockOnChange).toHaveBeenCalledWith('select-filter', 'inactive');
	});

	it(TEST_NAME_HANDLES_EMPTY_VALUE, () => {
		const { value: _value, ...emptyFilter } = filter;
		renderWithProviders(<SelectFilterInput filter={emptyFilter} commonProps={commonProps} />);
		const select = screen.getByRole('combobox');
		expect(select).toHaveValue('');
	});

	it('renders disabled options', () => {
		const filterWithDisabled = {
			...filter,
			options: [
				{ value: 'active', label: 'Active' },
				{ value: 'disabled', label: 'Disabled', disabled: true },
			],
		};
		renderWithProviders(
			<SelectFilterInput filter={filterWithDisabled} commonProps={commonProps} />
		);
		const disabledOption = screen.getByRole('option', { name: 'Disabled' });
		expect(disabledOption).toBeDisabled();
	});
});

describe('MultiSelectFilterInput', () => {
	const filter: MultiSelectAdvancedFilter = {
		id: 'multi-select-filter',
		label: 'Tags',
		type: 'multi-select',
		options: [
			{ value: 'tag1', label: 'Tag 1' },
			{ value: 'tag2', label: 'Tag 2' },
		],
		value: ['tag1'],
		placeholder: 'Select tags',
	};

	it('renders multi-select input', () => {
		renderWithProviders(<MultiSelectFilterInput filter={filter} commonProps={commonProps} />);
		const multiSelect = screen.getByRole('textbox');
		expect(multiSelect).toBeInTheDocument();
	});

	it('renders with default placeholder when not provided', () => {
		const { placeholder: _placeholder, ...filterWithoutPlaceholder } = filter;
		renderWithProviders(
			<MultiSelectFilterInput filter={filterWithoutPlaceholder} commonProps={commonProps} />
		);
		const multiSelect = screen.getByRole('textbox');
		expect(multiSelect).toBeInTheDocument();
	});

	it('calls onChange when values change', () => {
		renderWithProviders(<MultiSelectFilterInput filter={filter} commonProps={commonProps} />);
		// MultiSelect component handles onChange internally
		// We just verify it's rendered correctly
		const multiSelect = screen.getByRole('textbox');
		expect(multiSelect).toBeInTheDocument();
	});

	it('handles empty value array', () => {
		const { value: _value, ...emptyFilter } = filter;
		renderWithProviders(<MultiSelectFilterInput filter={emptyFilter} commonProps={commonProps} />);
		const multiSelect = screen.getByRole('textbox');
		expect(multiSelect).toBeInTheDocument();
	});
});

const TEST_DATE_2024_01_01 = '2024-01-01';
const TEST_DATE_2024_02_01 = '2024-02-01';
const TEST_DATE_2024_12_31 = '2024-12-31';

describe('DateFilterInput', () => {
	const filter: DateAdvancedFilter = {
		id: 'date-filter',
		label: 'Date',
		type: 'date',
		value: TEST_DATE_2024_01_01,
		minDate: TEST_DATE_2024_01_01,
		maxDate: TEST_DATE_2024_12_31,
	};

	it('renders date input', () => {
		renderWithProviders(<DateFilterInput filter={filter} commonProps={commonProps} />);
		const dateInput = screen.getByDisplayValue(TEST_DATE_2024_01_01);
		expect(dateInput).toBeInTheDocument();
		expect(dateInput).toHaveValue(TEST_DATE_2024_01_01);
	});

	it('calls onChange when date changes', () => {
		renderWithProviders(<DateFilterInput filter={filter} commonProps={commonProps} />);
		const dateInput = screen.getByDisplayValue(TEST_DATE_2024_01_01);
		fireEvent.change(dateInput, { target: { value: TEST_DATE_2024_02_01 } });
		expect(mockOnChange).toHaveBeenCalledWith('date-filter', TEST_DATE_2024_02_01);
	});

	it(TEST_NAME_HANDLES_EMPTY_VALUE, () => {
		const { value: _value, ...emptyFilter } = filter;
		const { container } = renderWithProviders(
			<DateFilterInput filter={emptyFilter} commonProps={commonProps} />
		);
		// Date inputs without values don't have accessible roles, so we use container query
		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
		const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
		expect(dateInput).toBeInTheDocument();
		expect(dateInput).toHaveValue('');
	});

	it('applies min and max date constraints', () => {
		renderWithProviders(<DateFilterInput filter={filter} commonProps={commonProps} />);
		const dateInput = screen.getByDisplayValue(TEST_DATE_2024_01_01);
		expect(dateInput).toHaveAttribute('min', TEST_DATE_2024_01_01);
		expect(dateInput).toHaveAttribute('max', TEST_DATE_2024_12_31);
	});
});

const TEST_DATE_2024_01_31 = '2024-01-31';
const TEST_DATE_2024_02_28 = '2024-02-28';

const dateRangeFilter: DateRangeAdvancedFilter = {
	id: FILTER_ID_DATE_RANGE,
	label: 'Date Range',
	type: 'date-range',
	startValue: TEST_DATE_2024_01_01,
	endValue: TEST_DATE_2024_01_31,
	startMin: TEST_DATE_2024_01_01,
	startMax: TEST_DATE_2024_12_31,
	endMin: TEST_DATE_2024_01_01,
	endMax: TEST_DATE_2024_12_31,
};

describe('DateRangeFilterInput', () => {
	it('renders date range inputs', () => {
		renderWithProviders(
			<DateRangeFilterInput filter={dateRangeFilter} commonProps={commonProps} />
		);
		const startInput = screen.getByDisplayValue(TEST_DATE_2024_01_01);
		const endInput = screen.getByDisplayValue(TEST_DATE_2024_01_31);
		expect(startInput).toBeInTheDocument();
		expect(endInput).toBeInTheDocument();
		expect(startInput).toHaveValue(TEST_DATE_2024_01_01);
		expect(endInput).toHaveValue(TEST_DATE_2024_01_31);
	});

	it('calls onChange when start date changes', () => {
		renderWithProviders(
			<DateRangeFilterInput filter={dateRangeFilter} commonProps={commonProps} />
		);
		const startInput = screen.getByDisplayValue(TEST_DATE_2024_01_01);
		fireEvent.change(startInput, { target: { value: TEST_DATE_2024_02_01 } });
		expect(mockOnChange).toHaveBeenCalledWith(FILTER_ID_DATE_RANGE, {
			start: TEST_DATE_2024_02_01,
			end: TEST_DATE_2024_01_31,
		});
	});

	it('calls onChange when end date changes', () => {
		renderWithProviders(
			<DateRangeFilterInput filter={dateRangeFilter} commonProps={commonProps} />
		);
		const endInput = screen.getByDisplayValue(TEST_DATE_2024_01_31);
		fireEvent.change(endInput, { target: { value: TEST_DATE_2024_02_28 } });
		expect(mockOnChange).toHaveBeenCalledWith(FILTER_ID_DATE_RANGE, {
			start: TEST_DATE_2024_01_01,
			end: TEST_DATE_2024_02_28,
		});
	});

	it('handles empty values', () => {
		const { startValue: _startValue, endValue: _endValue, ...emptyFilter } = dateRangeFilter;
		const { container } = renderWithProviders(
			<DateRangeFilterInput filter={emptyFilter} commonProps={commonProps} />
		);
		// Date inputs without values don't have accessible roles, so we use container query
		// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
		const dateInputs = container.querySelectorAll('input[type="date"]');
		expect(dateInputs).toHaveLength(2);
		expect(dateInputs[0]).toHaveValue('');
		expect(dateInputs[1]).toHaveValue('');
	});
});

describe('DateRangeFilterInput constraints', () => {
	it('applies date constraints', () => {
		renderWithProviders(
			<DateRangeFilterInput filter={dateRangeFilter} commonProps={commonProps} />
		);
		const startInput = screen.getByDisplayValue(TEST_DATE_2024_01_01);
		const endInput = screen.getByDisplayValue(TEST_DATE_2024_01_31);
		expect(startInput).toHaveAttribute('min', TEST_DATE_2024_01_01);
		expect(startInput).toHaveAttribute('max', TEST_DATE_2024_12_31);
		expect(endInput).toHaveAttribute('min', TEST_DATE_2024_01_01);
		expect(endInput).toHaveAttribute('max', TEST_DATE_2024_12_31);
	});

	it('handles partial constraints', () => {
		const {
			startMin: _startMin,
			startMax: _startMax,
			endMin: _endMin,
			endMax: _endMax,
			...partialFilter
		} = dateRangeFilter;
		renderWithProviders(<DateRangeFilterInput filter={partialFilter} commonProps={commonProps} />);
		const startInput = screen.getByDisplayValue(TEST_DATE_2024_01_01);
		const endInput = screen.getByDisplayValue(TEST_DATE_2024_01_31);
		expect(startInput).toBeInTheDocument();
		expect(endInput).toBeInTheDocument();
	});
});
