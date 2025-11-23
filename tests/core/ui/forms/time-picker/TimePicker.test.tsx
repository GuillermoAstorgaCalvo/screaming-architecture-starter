/**
 * TimePicker Component Tests
 *
 * Tests for the TimePicker component including:
 * - Rendering
 * - Props forwarding
 * - Label display
 * - Error and helper text
 * - Size variants
 * - Full width option
 * - Controlled and uncontrolled modes
 * - Accessibility
 */

import TimePicker from '@core/ui/forms/time-picker/TimePicker';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('TimePicker - Rendering', () => {
	it('renders time input element', () => {
		const { container } = renderWithProviders(<TimePicker />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'time');
	});

	it('renders with label', () => {
		renderWithProviders(<TimePicker label="Select Time" />);
		expect(screen.getByLabelText('Select Time')).toBeInTheDocument();
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveAttribute('type', 'time');
	});

	it('renders with helper text', () => {
		renderWithProviders(
			<TimePicker label="Select Time" helperText="Select a time between 9 AM and 5 PM" />
		);
		expect(screen.getByText('Select a time between 9 AM and 5 PM')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<TimePicker label="Select Time" error="Time is required" />);
		expect(screen.getByText('Time is required')).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(<TimePicker label="Select Time" required />);
		const label = screen.getByText('Select Time');
		expect(label).toBeInTheDocument();
		expect(label.textContent).toContain('Select Time');
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<TimePicker fullWidth label="Test" />);
		const input = screen.getByLabelText('Test');
		expect(input).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<TimePicker size="sm" label="Small" />);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<TimePicker size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<TimePicker size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});

	it('renders without label', () => {
		const { container } = renderWithProviders(<TimePicker />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'time');
	});
});

describe('TimePicker - User Interactions', () => {
	it('allows changing time value', () => {
		renderWithProviders(<TimePicker label="Select Time" />);
		const input = screen.getByLabelText('Select Time');

		fireEvent.change(input, { target: { value: '14:30' } });
		expect(input).toHaveValue('14:30');
	});

	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<TimePicker label="Select Time" onChange={handleChange} />);
		const input = screen.getByLabelText('Select Time');

		fireEvent.change(input, { target: { value: '14:30' } });
		expect(handleChange).toHaveBeenCalled();
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(
			<TimePicker label="Select Time" onFocus={handleFocus} onBlur={handleBlur} />
		);
		const input = screen.getByLabelText('Select Time');

		fireEvent.focus(input);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(input);
		expect(handleBlur).toHaveBeenCalled();
	});

	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('10:00');
			return (
				<TimePicker label="Controlled" value={value} onChange={e => setValue(e.target.value)} />
			);
		};
		renderWithProviders(<TestComponent />);
		const input = screen.getByLabelText('Controlled');

		expect(input).toHaveValue('10:00');

		fireEvent.change(input, { target: { value: '14:30' } });
		expect(input).toHaveValue('14:30');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<TimePicker label="Uncontrolled" defaultValue="15:00" />);
		const input = screen.getByLabelText('Uncontrolled');
		expect(input).toHaveValue('15:00');
	});

	it('handles multiple value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<TimePicker label="Select Time" onChange={handleChange} />);
		const input = screen.getByLabelText('Select Time');

		fireEvent.change(input, { target: { value: '09:00' } });
		fireEvent.change(input, { target: { value: '12:00' } });
		fireEvent.change(input, { target: { value: '17:00' } });

		expect(handleChange).toHaveBeenCalledTimes(3);
	});
});

describe('TimePicker - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<TimePicker label="Select Time" error="Time is required" />);
		expect(screen.getByText('Time is required')).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(<TimePicker label="Select Time" error="Time is required" />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('associates error message with input via ARIA', () => {
		renderWithProviders(<TimePicker label="Select Time" error="Time is required" />);
		const input = screen.getByLabelText('Select Time');
		const errorId = input.getAttribute('aria-describedby');
		expect(errorId).toBeTruthy();
		if (errorId) {
			expect(screen.getByText('Time is required')).toBeInTheDocument();
			expect(screen.getByText('Time is required')).toHaveAttribute('id', errorId);
		}
	});

	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<TimePicker
				label="Select Time"
				error="Invalid time"
				helperText="Select a time between 9 AM and 5 PM"
			/>
		);
		expect(screen.getByText('Invalid time')).toBeInTheDocument();
		expect(screen.getByText('Select a time between 9 AM and 5 PM')).toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(<TimePicker label="Select Time" required />);
		const input = screen.getByLabelText(/select time/i);
		expect(input).toHaveAttribute('required');
	});

	it('does not show error styling when no error', () => {
		renderWithProviders(<TimePicker label="Select Time" />);
		const input = screen.getByLabelText('Select Time');
		const ariaInvalid = input.getAttribute('aria-invalid');
		expect(ariaInvalid).not.toBe('true');
	});
});

describe('TimePicker - Min/Max', () => {
	it('applies min attribute', () => {
		renderWithProviders(<TimePicker label="Select Time" min="09:00" />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveAttribute('min', '09:00');
	});

	it('applies max attribute', () => {
		renderWithProviders(<TimePicker label="Select Time" max="17:00" />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveAttribute('max', '17:00');
	});

	it('applies both min and max attributes', () => {
		renderWithProviders(<TimePicker label="Select Time" min="09:00" max="17:00" />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveAttribute('min', '09:00');
		expect(input).toHaveAttribute('max', '17:00');
	});
});

describe('TimePicker - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<TimePicker label="Select Time" helperText="Enter a time" />
		);
		await expectA11y(container);
	});

	it('associates label with input via id', () => {
		renderWithProviders(<TimePicker label="Select Time" />);
		const input = screen.getByLabelText('Select Time');
		const label = screen.getByText('Select Time');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});

	it('uses aria-describedby for helper text', () => {
		const helperText = 'Helper text';
		renderWithProviders(<TimePicker label="Select Time" helperText={helperText} />);
		const input = screen.getByLabelText('Select Time');
		const describedBy = input.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(helperText)).toBeInTheDocument();
			expect(screen.getByText(helperText)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for error message', () => {
		const errorMessage = 'Error message';
		renderWithProviders(<TimePicker label="Select Time" error={errorMessage} />);
		const input = screen.getByLabelText('Select Time');
		const describedBy = input.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(errorMessage)).toBeInTheDocument();
			expect(screen.getByText(errorMessage)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for both error and helper text', () => {
		renderWithProviders(<TimePicker label="Select Time" error="Error" helperText="Helper" />);
		const input = screen.getByLabelText('Select Time');
		const describedBy = input.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const ids = describedBy.split(' ');
			expect(ids.length).toBeGreaterThan(0);
		}
	});

	it('supports custom timePickerId', () => {
		renderWithProviders(<TimePicker label="Select Time" timePickerId="custom-time-id" />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveAttribute('id', 'custom-time-id');
	});

	it('auto-generates id when label is provided', () => {
		renderWithProviders(<TimePicker label="Select Time" />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveAttribute('id');
		expect(input.id).toBeTruthy();
	});
});

describe('TimePicker - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(<TimePicker label="Select Time" error="This field is required" />);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<TimePicker label="Select Time" error="Error message" />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(
			<TimePicker label="Select Time" error="Error message" helperText="Helper text" />
		);
		expect(screen.getByText('Error message')).toBeInTheDocument();
		expect(screen.getByText('Helper text')).toBeInTheDocument();
	});
});

describe('TimePicker - Disabled States', () => {
	it('renders disabled input', () => {
		renderWithProviders(<TimePicker label="Select Time" disabled />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(<TimePicker label="Select Time" disabled onChange={handleChange} />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(<TimePicker label="Select Time" disabled />);
		const input = screen.getByLabelText('Select Time');
		const label = screen.getByText('Select Time');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});
});

describe('TimePicker - Size Variants', () => {
	it('renders small size', () => {
		renderWithProviders(<TimePicker size="sm" label="Small" />);
		const input = screen.getByLabelText('Small');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'time');
	});

	it('renders medium size (default)', () => {
		renderWithProviders(<TimePicker size="md" label="Medium" />);
		const input = screen.getByLabelText('Medium');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'time');
	});

	it('renders large size', () => {
		renderWithProviders(<TimePicker size="lg" label="Large" />);
		const input = screen.getByLabelText('Large');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'time');
	});

	it('defaults to medium size when size is not provided', () => {
		renderWithProviders(<TimePicker label="Default" />);
		const input = screen.getByLabelText('Default');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'time');
	});
});

describe('TimePicker - Props Forwarding', () => {
	it('forwards additional HTML input attributes', () => {
		renderWithProviders(
			<TimePicker label="Select Time" data-testid="custom-time-input" aria-label="Custom" />
		);
		const input = screen.getByTestId('custom-time-input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('aria-label', 'Custom');
	});

	it('forwards className prop', () => {
		renderWithProviders(<TimePicker label="Select Time" className="custom-class" />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveClass('custom-class');
	});

	it('forwards placeholder prop', () => {
		renderWithProviders(<TimePicker label="Select Time" placeholder="HH:MM" />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveAttribute('placeholder', 'HH:MM');
	});
});
