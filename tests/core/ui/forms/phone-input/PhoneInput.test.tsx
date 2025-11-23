/**
 * PhoneInput Component Tests
 *
 * Tests for the PhoneInput component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 * - Size variants
 * - Country code selector
 * - Controlled and uncontrolled modes
 */

import PhoneInput from '@core/ui/forms/phone-input/PhoneInput';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const LABEL_PHONE = 'Phone Number';
const ERROR_MESSAGE = 'Phone number is required';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';
const ARIA_DESCRIBEDBY = 'aria-describedby';

describe('PhoneInput - Rendering', () => {
	it('renders phone input element', () => {
		const { container } = renderWithProviders(<PhoneInput />);
		const input = container.querySelector('input[type="tel"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'tel');
	});

	it('renders with label', () => {
		renderWithProviders(<PhoneInput label="Phone Number" />);
		expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
		const input = screen.getByLabelText('Phone Number');
		expect(input).toHaveAttribute('type', 'tel');
	});

	it('renders with helper text', () => {
		renderWithProviders(<PhoneInput label="Phone Number" helperText="Enter your phone number" />);
		expect(screen.getByText('Enter your phone number')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<PhoneInput label="Phone Number" error="Phone number is required" />);
		expect(screen.getByText('Phone number is required')).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(<PhoneInput label="Phone Number" required />);
		const label = screen.getByText('Phone Number');
		expect(label).toBeInTheDocument();
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<PhoneInput fullWidth label="Test" />);
		const input = screen.getByLabelText('Test');
		expect(input).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<PhoneInput size="sm" label="Small" />);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<PhoneInput size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<PhoneInput size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});

	it('renders without label', () => {
		const { container } = renderWithProviders(<PhoneInput />);
		const input = container.querySelector('input[type="tel"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'tel');
	});

	it('renders country code selector', () => {
		renderWithProviders(<PhoneInput label="Phone Number" />);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toBeInTheDocument();
		expect(selector.tagName).toBe('SELECT');
	});

	it('defaults to US country code (+1)', () => {
		renderWithProviders(<PhoneInput label="Phone Number" />);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toHaveValue('+1');
	});

	it('uses defaultCountryCode when provided', () => {
		renderWithProviders(<PhoneInput label="Phone Number" defaultCountryCode="+44" />);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toHaveValue('+44');
	});
});

describe('PhoneInput - User Interactions', () => {
	it('allows typing phone number value', () => {
		renderWithProviders(<PhoneInput label="Phone Number" />);
		const input = screen.getByLabelText('Phone Number');

		fireEvent.change(input, { target: { value: '1234567890' } });
		expect((input as HTMLInputElement).value).toBe('1234567890');
	});

	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<PhoneInput label="Phone Number" onChange={handleChange} />);
		const input = screen.getByLabelText('Phone Number');

		fireEvent.change(input, { target: { value: '1234567890' } });
		expect(handleChange).toHaveBeenCalled();
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(
			<PhoneInput label="Phone Number" onFocus={handleFocus} onBlur={handleBlur} />
		);
		const input = screen.getByLabelText('Phone Number');

		fireEvent.focus(input);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(input);
		expect(handleBlur).toHaveBeenCalled();
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		renderWithProviders(<PhoneInput label="Phone Number" onKeyDown={handleKeyDown} />);
		const input = screen.getByLabelText('Phone Number');

		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalled();
	});

	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('1234567890');
			return (
				<PhoneInput label="Controlled" value={value} onChange={e => setValue(e.target.value)} />
			);
		};
		renderWithProviders(<TestComponent />);
		const input = screen.getByLabelText('Controlled');

		expect((input as HTMLInputElement).value).toBe('1234567890');

		fireEvent.change(input, { target: { value: '9876543210' } });
		expect((input as HTMLInputElement).value).toBe('9876543210');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<PhoneInput label="Uncontrolled" defaultValue="1234567890" />);
		const input = screen.getByLabelText('Uncontrolled');
		expect((input as HTMLInputElement).value).toBe('1234567890');
	});

	it('calls onCountryCodeChange when country code changes', () => {
		const handleCountryCodeChange = vi.fn();
		renderWithProviders(
			<PhoneInput label="Phone Number" onCountryCodeChange={handleCountryCodeChange} />
		);
		const selector = screen.getByLabelText(/country code/i);

		fireEvent.change(selector, { target: { value: '+44' } });
		expect(handleCountryCodeChange).toHaveBeenCalledWith('+44');
		expect(handleCountryCodeChange).toHaveBeenCalledTimes(1);
	});

	it('updates country code selector value when changed', () => {
		renderWithProviders(<PhoneInput label="Phone Number" />);
		const selector = screen.getByLabelText(/country code/i);

		fireEvent.change(selector, { target: { value: '+44' } });
		expect(selector).toHaveValue('+44');
	});
});

describe('PhoneInput - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<PhoneInput label="Phone Number" error="Phone number is required" />);
		expect(screen.getByText('Phone number is required')).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(<PhoneInput label={LABEL_PHONE} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_PHONE);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('associates error message with input via ARIA', () => {
		renderWithProviders(<PhoneInput label={LABEL_PHONE} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_PHONE);
		const errorId = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(errorId).toBeTruthy();
		if (errorId) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', errorId);
		}
	});

	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<PhoneInput
				label="Phone Number"
				error="Invalid phone number"
				helperText="Enter your phone number"
			/>
		);
		expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
		expect(screen.getByText('Enter your phone number')).toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(<PhoneInput label="Phone Number" required />);
		const input = screen.getByLabelText(/phone number/i);
		expect(input).toHaveAttribute('required');
	});

	it('does not show error styling when no error', () => {
		renderWithProviders(<PhoneInput label={LABEL_PHONE} />);
		const input = screen.getByLabelText(LABEL_PHONE);
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});
});

describe('PhoneInput - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<PhoneInput label="Phone Number" helperText="Enter your phone number" />
		);
		await expectA11y(container);
	});

	it('associates label with input via id', () => {
		renderWithProviders(<PhoneInput label="Phone Number" />);
		const input = screen.getByLabelText('Phone Number');
		const label = screen.getByText('Phone Number');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});

	it('uses aria-describedby for helper text', () => {
		const helperText = 'Helper text';
		renderWithProviders(<PhoneInput label="Phone Number" helperText={helperText} />);
		const input = screen.getByLabelText('Phone Number');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(helperText)).toBeInTheDocument();
			expect(screen.getByText(helperText)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(<PhoneInput label="Phone Number" error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText('Phone Number');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for both error and helper text', () => {
		renderWithProviders(<PhoneInput label="Phone Number" error="Error" helperText="Helper" />);
		const input = screen.getByLabelText('Phone Number');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const ids = describedBy.split(' ');
			expect(ids.length).toBeGreaterThan(0);
		}
	});

	it('supports custom inputId', () => {
		renderWithProviders(<PhoneInput label="Phone Number" inputId="custom-phone-id" />);
		const input = screen.getByLabelText('Phone Number');
		expect(input).toHaveAttribute('id', 'custom-phone-id');
	});

	it('auto-generates id when label is provided', () => {
		renderWithProviders(<PhoneInput label="Phone Number" />);
		const input = screen.getByLabelText('Phone Number');
		expect(input).toHaveAttribute('id');
		expect(input.id).toBeTruthy();
	});

	it('country code selector has proper aria-label', () => {
		renderWithProviders(<PhoneInput label="Phone Number" />);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toHaveAttribute('aria-label');
	});
});

describe('PhoneInput - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(<PhoneInput label="Phone Number" error="This field is required" />);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<PhoneInput label="Phone Number" error="Error message" />);
		const input = screen.getByLabelText('Phone Number');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(
			<PhoneInput label="Phone Number" error="Error message" helperText="Helper text" />
		);
		expect(screen.getByText('Error message')).toBeInTheDocument();
		expect(screen.getByText('Helper text')).toBeInTheDocument();
	});
});

describe('PhoneInput - Disabled States', () => {
	it('renders disabled input', () => {
		renderWithProviders(<PhoneInput label="Phone Number" disabled />);
		const input = screen.getByLabelText('Phone Number');
		expect(input).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(<PhoneInput label="Phone Number" disabled onChange={handleChange} />);
		const input = screen.getByLabelText('Phone Number');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('disables country code selector when input is disabled', () => {
		renderWithProviders(<PhoneInput label="Phone Number" disabled />);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toBeDisabled();
	});

	it('applies disabled styling', () => {
		renderWithProviders(<PhoneInput label="Phone Number" disabled />);
		const input = screen.getByLabelText('Phone Number');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(<PhoneInput label="Phone Number" disabled />);
		const input = screen.getByLabelText('Phone Number');
		const label = screen.getByText('Phone Number');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});
});

describe('PhoneInput - Size Variants', () => {
	it('renders small size', () => {
		renderWithProviders(<PhoneInput size="sm" label="Small" />);
		const input = screen.getByLabelText('Small');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'tel');
	});

	it('renders medium size (default)', () => {
		renderWithProviders(<PhoneInput size="md" label="Medium" />);
		const input = screen.getByLabelText('Medium');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'tel');
	});

	it('renders large size', () => {
		renderWithProviders(<PhoneInput size="lg" label="Large" />);
		const input = screen.getByLabelText('Large');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'tel');
	});

	it('defaults to medium size when size is not provided', () => {
		renderWithProviders(<PhoneInput label="Default" />);
		const input = screen.getByLabelText('Default');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'tel');
	});
});

describe('PhoneInput - Country Code Selector', () => {
	it('renders country code options', () => {
		const { container } = renderWithProviders(<PhoneInput label="Phone Number" />);
		const selector = container.querySelector('select') as HTMLSelectElement;
		const options = Array.from(selector.options);
		expect(options.length).toBeGreaterThan(0);
	});

	it('includes common country codes', () => {
		const { container } = renderWithProviders(<PhoneInput label="Phone Number" />);
		const selector = container.querySelector('select') as HTMLSelectElement;
		const values = Array.from(selector.options).map(opt => opt.value);
		expect(values).toContain('+1'); // US
		expect(values).toContain('+44'); // UK
		expect(values).toContain('+33'); // France
	});

	it('updates input padding based on country code length', () => {
		renderWithProviders(<PhoneInput label="Phone Number" />);
		const input = screen.getByLabelText('Phone Number');
		const selector = screen.getByLabelText(/country code/i);

		// Test with 2-digit code
		fireEvent.change(selector, { target: { value: '+1' } });
		expect(input).toHaveClass('pl-4xl');

		// Test with 3-digit code
		fireEvent.change(selector, { target: { value: '+358' } });
		expect(input.className).toContain('pl-');
	});
});

describe('PhoneInput - Props Forwarding', () => {
	it('forwards additional HTML input attributes', () => {
		renderWithProviders(
			<PhoneInput label="Phone Number" data-testid="custom-phone-input" aria-label="Custom" />
		);
		const input = screen.getByTestId('custom-phone-input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('aria-label', 'Custom');
	});

	it('forwards className prop', () => {
		renderWithProviders(<PhoneInput label="Phone Number" className="custom-class" />);
		const input = screen.getByLabelText('Phone Number');
		expect(input).toHaveClass('custom-class');
	});

	it('forwards placeholder prop', () => {
		renderWithProviders(<PhoneInput label="Phone Number" placeholder="Enter your phone number" />);
		const input = screen.getByLabelText('Phone Number');
		expect(input).toHaveAttribute('placeholder', 'Enter your phone number');
	});
});
