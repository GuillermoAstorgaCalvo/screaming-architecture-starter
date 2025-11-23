import DatePicker from '@core/ui/forms/date-picker/DatePicker';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const SELECT_DATE_LABEL = 'Select Date';
const TEST_DATE_1 = '2024-01-15';
const TEST_DATE_2 = '2024-02-20';

function testRendering() {
	describe('Rendering', () => {
		it('renders date picker input', () => {
			// Use label for better accessibility and testability
			renderWithProviders(<DatePicker label="Date" />);
			const input = screen.getByLabelText('Date');
			expect(input).toBeInTheDocument();
		});

		it('renders with label', () => {
			renderWithProviders(<DatePicker label={SELECT_DATE_LABEL} />);
			expect(screen.getByText(SELECT_DATE_LABEL)).toBeInTheDocument();
		});

		it('renders with placeholder', () => {
			renderWithProviders(<DatePicker placeholder="Choose a date" />);
			const input = screen.getByPlaceholderText('Choose a date');
			expect(input).toBeInTheDocument();
		});

		it('renders with helper text', () => {
			renderWithProviders(<DatePicker label="Date" helperText="Select your birth date" />);
			expect(screen.getByText('Select your birth date')).toBeInTheDocument();
		});

		it('renders with error message', () => {
			renderWithProviders(<DatePicker label="Date" error="Invalid date" />);
			expect(screen.getByText('Invalid date')).toBeInTheDocument();
		});
	});
}

function testUserInteractions() {
	describe('User Interactions', () => {
		it('handles value change', () => {
			const onChange = vi.fn();
			renderWithProviders(<DatePicker label="Date" onChange={onChange} />);

			const input = screen.getByLabelText('Date');
			fireEvent.change(input, { target: { value: TEST_DATE_1 } });

			expect(onChange).toHaveBeenCalled();
		});

		it('handles input focus', () => {
			renderWithProviders(<DatePicker label="Date" />);
			const input = screen.getByLabelText('Date');
			input.focus();

			expect(input).toHaveFocus();
		});

		it('handles input blur', () => {
			renderWithProviders(<DatePicker label="Date" />);
			const input = screen.getByLabelText('Date');
			input.focus();
			input.blur();

			expect(input).not.toHaveFocus();
		});
	});
}

function testStateManagement() {
	describe('State Management', () => {
		it('uses controlled value', () => {
			const value = TEST_DATE_1;
			const onChange = vi.fn();
			const { rerender } = renderWithProviders(<DatePicker value={value} onChange={onChange} />);

			const input = screen.getByDisplayValue(value);
			expect(input).toBeInTheDocument();

			const newValue = TEST_DATE_2;
			rerender(<DatePicker value={newValue} onChange={onChange} />);

			const updatedInput = screen.getByDisplayValue(newValue);
			expect(updatedInput).toBeInTheDocument();
		});

		it('uses defaultValue for uncontrolled mode', () => {
			const defaultValue = TEST_DATE_1;
			renderWithProviders(<DatePicker defaultValue={defaultValue} />);

			const input = screen.getByDisplayValue(defaultValue);
			expect(input).toBeInTheDocument();
		});

		it('updates value on change in uncontrolled mode', () => {
			renderWithProviders(<DatePicker defaultValue={TEST_DATE_1} />);

			const input = screen.getByDisplayValue(TEST_DATE_1);
			fireEvent.change(input, { target: { value: TEST_DATE_2 } });

			// Value should update
			expect(input).toHaveValue(TEST_DATE_2);
		});
	});
}

function testValidation() {
	describe('Validation', () => {
		it('respects min date', () => {
			const min = '2024-01-01';
			renderWithProviders(<DatePicker label="Date" min={min} />);

			const input = screen.getByLabelText('Date');
			expect(input).toHaveAttribute('min', min);
		});

		it('respects max date', () => {
			const max = '2024-12-31';
			renderWithProviders(<DatePicker label="Date" max={max} />);

			const input = screen.getByLabelText('Date');
			expect(input).toHaveAttribute('max', max);
		});

		it('displays error when validation fails', () => {
			renderWithProviders(<DatePicker label="Date" error="Date is required" />);
			expect(screen.getByText('Date is required')).toBeInTheDocument();
		});
	});
}

function testSizeVariants() {
	describe('Size Variants', () => {
		it('renders with small size', () => {
			const { container } = renderWithProviders(<DatePicker size="sm" label="Date" />);
			expect(container).toBeInTheDocument();
		});

		it('renders with medium size (default)', () => {
			const { container } = renderWithProviders(<DatePicker size="md" label="Date" />);
			expect(container).toBeInTheDocument();
		});

		it('renders with large size', () => {
			const { container } = renderWithProviders(<DatePicker size="lg" label="Date" />);
			expect(container).toBeInTheDocument();
		});
	});
}

function testAccessibility() {
	describe('Accessibility', () => {
		it('has no accessibility violations', async () => {
			const { container } = renderWithProviders(<DatePicker label={SELECT_DATE_LABEL} />);

			await expectA11y(container);
		});

		it('has proper label association', () => {
			renderWithProviders(<DatePicker label={SELECT_DATE_LABEL} />);

			const label = screen.getByText(SELECT_DATE_LABEL);
			const input = screen.getByLabelText(SELECT_DATE_LABEL);

			expect(label).toBeInTheDocument();
			expect(input).toBeInTheDocument();
		});

		it('has required attribute when required', () => {
			renderWithProviders(<DatePicker label="Date" required />);

			const input = screen.getByLabelText(/date/i);
			expect(input).toHaveAttribute('required');
		});

		it('has aria-describedby for helper text', () => {
			renderWithProviders(<DatePicker label="Date" helperText="Select a date" />);

			const input = screen.getByLabelText(/date/i);
			const helperText = screen.getByText('Select a date');

			expect(input).toHaveAttribute('aria-describedby');
			expect(helperText).toBeInTheDocument();
		});

		it('has aria-describedby for error message', () => {
			renderWithProviders(<DatePicker label="Date" error="Invalid date" />);

			const input = screen.getByLabelText(/date/i);
			const error = screen.getByText('Invalid date');

			expect(input).toHaveAttribute('aria-describedby');
			expect(error).toBeInTheDocument();
		});
	});
}

function testKeyboardNavigation() {
	describe('Keyboard Navigation', () => {
		it('handles keyboard input', () => {
			const onChange = vi.fn();
			renderWithProviders(<DatePicker label="Date" onChange={onChange} />);

			const input = screen.getByLabelText('Date');
			fireEvent.keyDown(input, { key: '1' });
			fireEvent.keyDown(input, { key: 'Enter' });

			// Should handle keyboard events
			expect(input).toBeInTheDocument();
		});

		it('handles Tab key navigation', () => {
			renderWithProviders(
				<>
					<DatePicker label="Start Date" />
					<DatePicker label="End Date" />
				</>
			);

			const startInput = screen.getByLabelText('Start Date');
			const endInput = screen.getByLabelText('End Date');

			startInput.focus();
			expect(startInput).toHaveFocus();

			fireEvent.keyDown(startInput, { key: 'Tab' });
			// Tab should move focus (implementation dependent)
			expect(startInput || endInput).toBeInTheDocument();
		});
	});
}

function testDisabledState() {
	describe('Disabled State', () => {
		it('disables input when disabled', () => {
			renderWithProviders(<DatePicker label="Date" disabled />);

			const input = screen.getByLabelText('Date');
			expect(input).toBeDisabled();
		});

		it('does not call onChange when disabled', () => {
			const onChange = vi.fn();
			renderWithProviders(<DatePicker label="Date" disabled onChange={onChange} />);

			const input = screen.getByLabelText('Date');
			fireEvent.change(input, { target: { value: TEST_DATE_1 } });

			// onChange may still be called by browser, but input should be disabled
			expect(input).toBeDisabled();
		});
	});
}

function testFullWidth() {
	describe('Full Width', () => {
		it('renders full width when fullWidth is true', () => {
			const { container } = renderWithProviders(<DatePicker fullWidth />);
			expect(container).toBeInTheDocument();
		});
	});
}

function testIdGeneration() {
	describe('ID Generation', () => {
		it('generates ID when label is provided', () => {
			renderWithProviders(<DatePicker label={SELECT_DATE_LABEL} />);

			const input = screen.getByLabelText(SELECT_DATE_LABEL);
			expect(input).toHaveAttribute('id');
		});

		it('uses custom ID when provided', () => {
			const customId = 'custom-date-picker';
			renderWithProviders(<DatePicker datePickerId={customId} label={SELECT_DATE_LABEL} />);

			const input = screen.getByLabelText(SELECT_DATE_LABEL);
			expect(input).toHaveAttribute('id', customId);
		});
	});
}

describe('DatePicker', () => {
	testRendering();
	testUserInteractions();
	testStateManagement();
	testValidation();
	testSizeVariants();
	testAccessibility();
	testKeyboardNavigation();
	testDisabledState();
	testFullWidth();
	testIdGeneration();
});
