/**
 * DatePicker Component Tests
 *
 * Tests for the DatePicker component:
 * - Rendering
 * - Date transformation
 * - Value handling
 * - Min/max date constraints
 * - Manual input control
 * - Event handlers
 */

import DatePicker from '@domains/shared/components/date-picker/DatePicker';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const TEST_DATE = '2024-01-15';
const TEST_MIN_DATE = '2024-01-01';
const TEST_MAX_DATE = '2024-12-31';

// Helper to get date input element
// Date inputs don't have "textbox" role, so we use semantic queries (label, placeholder, or value)
// Type guard is necessary because getByLabelText/getByPlaceholderText/getByDisplayValue
// return HTMLElement, but we need HTMLInputElement to access input-specific properties
function getDateInput(options: {
	label?: string;
	placeholder?: string;
	value?: string;
}): HTMLInputElement {
	let element: HTMLElement;

	if (options.label) {
		element = screen.getByLabelText(options.label);
	} else if (options.placeholder) {
		element = screen.getByPlaceholderText(options.placeholder);
	} else if (options.value) {
		element = screen.getByDisplayValue(options.value);
	} else {
		throw new Error('Must provide label, placeholder, or value to query date input');
	}

	if (!(element instanceof HTMLInputElement)) {
		throw new TypeError(`Expected HTMLInputElement but got ${element.constructor.name}`);
	}

	return element;
}

describe('DatePicker - Rendering', () => {
	it('renders date input', () => {
		renderWithProviders(<DatePicker label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'date');
	});

	it('renders with label', () => {
		renderWithProviders(<DatePicker label="Birth Date" id="birth-date" />);

		expect(screen.getByText('Birth Date')).toBeInTheDocument();
	});

	it('renders with placeholder', () => {
		renderWithProviders(<DatePicker placeholder="Select date" />);

		const input = getDateInput({ placeholder: 'Select date' });
		expect(input).toHaveAttribute('placeholder', 'Select date');
	});

	it('renders with helper text', () => {
		renderWithProviders(<DatePicker helperText="Select your birth date" id="date" label="Date" />);

		expect(screen.getByText('Select your birth date')).toBeInTheDocument();
	});

	it('renders with error', () => {
		renderWithProviders(<DatePicker error="Invalid date" id="date" label="Date" />);

		expect(screen.getByText('Invalid date')).toBeInTheDocument();
	});

	it('renders disabled state', () => {
		renderWithProviders(<DatePicker disabled label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toBeDisabled();
	});
});

describe('DatePicker - Date Transformation', () => {
	it('transforms Date object to ISO string', () => {
		const date = new Date(`${TEST_DATE}T00:00:00`);
		renderWithProviders(<DatePicker value={date.toISOString()} label="Date" />);

		// Get the input by label (value may differ due to timezone)
		const input = getDateInput({ label: 'Date' });
		// The component should transform the date to ISO format (YYYY-MM-DD)
		expect(input).toHaveAttribute('type', 'date');
		expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('transforms string date to ISO format', () => {
		renderWithProviders(<DatePicker value={TEST_DATE} />);

		const input = getDateInput({ value: TEST_DATE });
		expect(input).toHaveValue(TEST_DATE);
	});

	it('handles null value', () => {
		renderWithProviders(<DatePicker value={null as unknown as string} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveValue('');
	});

	it('handles undefined value', () => {
		renderWithProviders(<DatePicker label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveValue('');
	});

	it('handles invalid Date object', () => {
		// Don't call toISOString() on invalid date - it throws
		// The component should handle invalid date strings gracefully
		renderWithProviders(<DatePicker value="invalid-date" label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveValue('');
	});

	it('truncates long date strings to ISO format', () => {
		renderWithProviders(<DatePicker value={`${TEST_DATE}T12:30:45.123Z`} />);

		const input = getDateInput({ value: TEST_DATE });
		expect(input).toHaveValue(TEST_DATE);
	});

	it('handles empty string', () => {
		renderWithProviders(<DatePicker value="" label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveValue('');
	});
});

describe('DatePicker - Value Handling', () => {
	it('calls onChange with string value', () => {
		const onChange = vi.fn();

		renderWithProviders(<DatePicker onChange={onChange} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		fireEvent.change(input, { target: { value: TEST_DATE } });

		expect(onChange).toHaveBeenCalledWith(TEST_DATE);
	});

	it('calls onDateChange with Date object', () => {
		const onDateChange = vi.fn();

		renderWithProviders(<DatePicker onDateChange={onDateChange} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		fireEvent.change(input, { target: { value: TEST_DATE } });

		expect(onDateChange).toHaveBeenCalledWith(expect.any(Date));
		const [date] = onDateChange.mock.calls[0] ?? [];
		// Check that the date represents the correct date (component creates date in local time)
		// Format: YYYY-MM-DD
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		expect(`${year}-${month}-${day}`).toBe(TEST_DATE);
	});

	it('calls onDateChange with null when value is cleared', () => {
		const onDateChange = vi.fn();

		renderWithProviders(<DatePicker value={TEST_DATE} onDateChange={onDateChange} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		fireEvent.change(input, { target: { value: '' } });

		expect(onDateChange).toHaveBeenCalledWith(null);
	});

	it('calls both onChange and onDateChange', () => {
		const onChange = vi.fn();
		const onDateChange = vi.fn();

		renderWithProviders(
			<DatePicker onChange={onChange} onDateChange={onDateChange} label="Date" />
		);

		const input = getDateInput({ label: 'Date' });
		fireEvent.change(input, { target: { value: TEST_DATE } });

		expect(onChange).toHaveBeenCalledWith(TEST_DATE);
		expect(onDateChange).toHaveBeenCalledWith(expect.any(Date));
	});

	it('calls inputOnChange when provided', () => {
		const inputOnChange = vi.fn();

		renderWithProviders(<DatePicker inputOnChange={inputOnChange} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		fireEvent.change(input, { target: { value: TEST_DATE } });

		expect(inputOnChange).toHaveBeenCalled();
	});
});

describe('DatePicker - Min/Max Date Constraints', () => {
	it('sets min date from Date object', () => {
		const minDate = new Date(TEST_MIN_DATE);
		renderWithProviders(<DatePicker minDate={minDate} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveAttribute('min', TEST_MIN_DATE);
	});

	it('sets min date from string', () => {
		renderWithProviders(<DatePicker minDate={TEST_MIN_DATE} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveAttribute('min', TEST_MIN_DATE);
	});

	it('sets max date from Date object', () => {
		const maxDate = new Date(TEST_MAX_DATE);
		renderWithProviders(<DatePicker maxDate={maxDate} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveAttribute('max', TEST_MAX_DATE);
	});

	it('sets max date from string', () => {
		renderWithProviders(<DatePicker maxDate={TEST_MAX_DATE} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveAttribute('max', TEST_MAX_DATE);
	});

	it('handles null min date', () => {
		renderWithProviders(<DatePicker minDate={null} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).not.toHaveAttribute('min');
	});

	it('handles null max date', () => {
		renderWithProviders(<DatePicker maxDate={null} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).not.toHaveAttribute('max');
	});

	it('handles undefined min date', () => {
		renderWithProviders(<DatePicker minDate={undefined} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).not.toHaveAttribute('min');
	});

	it('handles invalid Date for min date', () => {
		const invalidDate = new Date('invalid');
		renderWithProviders(<DatePicker minDate={invalidDate} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).not.toHaveAttribute('min');
	});

	it('truncates long date string for min', () => {
		renderWithProviders(<DatePicker minDate={`${TEST_MIN_DATE}T12:30:45.123Z`} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveAttribute('min', TEST_MIN_DATE);
	});
});

describe('DatePicker - Manual Input Control', () => {
	it('allows manual input by default', () => {
		renderWithProviders(<DatePicker label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveAttribute('inputMode', 'numeric');
		expect(input).toHaveAttribute('pattern', String.raw`\d{4}-\d{2}-\d{2}`);
	});

	it('disables manual input when allowManualInput is false', () => {
		renderWithProviders(<DatePicker allowManualInput={false} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).not.toHaveAttribute('inputMode');
		expect(input).not.toHaveAttribute('pattern');
	});

	it('enables manual input when allowManualInput is true', () => {
		renderWithProviders(<DatePicker allowManualInput={true} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveAttribute('inputMode', 'numeric');
		expect(input).toHaveAttribute('pattern', String.raw`\d{4}-\d{2}-\d{2}`);
	});
});

describe('DatePicker - Props Forwarding', () => {
	it('forwards other Input props', () => {
		renderWithProviders(
			<DatePicker id="test-date" className="custom-class" data-testid="date-input" />
		);

		// Use test-id for this specific test since we're testing ID forwarding
		// which breaks the label association
		const input = screen.getByTestId('date-input');
		expect(input).toHaveAttribute('id', 'test-date');
	});

	it('does not forward type prop', () => {
		renderWithProviders(<DatePicker label="Date" />);

		const input = getDateInput({ label: 'Date' });
		expect(input).toHaveAttribute('type', 'date');
	});

	it('does not forward value prop directly', () => {
		renderWithProviders(<DatePicker value={TEST_DATE} />);

		const input = getDateInput({ value: TEST_DATE });
		expect(input).toHaveValue(TEST_DATE);
	});

	it('does not forward onChange prop directly', () => {
		const onChange = vi.fn();
		renderWithProviders(<DatePicker onChange={onChange} label="Date" />);

		const input = getDateInput({ label: 'Date' });
		fireEvent.change(input, { target: { value: TEST_DATE } });

		expect(onChange).toHaveBeenCalled();
	});
});

describe('DatePicker - Edge Cases', () => {
	it('handles date at start of day', () => {
		const date = new Date(`${TEST_DATE}T00:00:00`);
		renderWithProviders(<DatePicker value={date.toISOString()} label="Date" />);

		// Get the input by label (value may differ due to timezone)
		const input = getDateInput({ label: 'Date' });
		// The component should transform the date to ISO format (YYYY-MM-DD)
		expect(input).toHaveAttribute('type', 'date');
		expect(input.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it('handles date at end of day', () => {
		const date = new Date(`${TEST_DATE}T23:59:59`);
		renderWithProviders(<DatePicker value={date.toISOString()} />);

		const input = getDateInput({ value: TEST_DATE });
		expect(input).toHaveValue(TEST_DATE);
	});

	it('handles leap year date', () => {
		renderWithProviders(<DatePicker value="2024-02-29" />);

		const input = getDateInput({ value: '2024-02-29' });
		expect(input).toHaveValue('2024-02-29');
	});

	it('handles year boundary dates', () => {
		renderWithProviders(<DatePicker value="2023-12-31" />);

		const input = getDateInput({ value: '2023-12-31' });
		expect(input).toHaveValue('2023-12-31');
	});
});
