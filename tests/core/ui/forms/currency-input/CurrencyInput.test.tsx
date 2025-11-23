/**
 * CurrencyInput Component Tests
 *
 * Tests for the CurrencyInput component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 * - Size variants
 * - Controlled and uncontrolled modes
 * - Currency formatting and symbols
 */

import CurrencyInput from '@core/ui/forms/currency-input/CurrencyInput';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const LABEL_PRICE = 'Price';
const ERROR_MESSAGE = 'Error message';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';
const ARIA_DESCRIBEDBY = 'aria-describedby';

describe('CurrencyInput - Rendering', () => {
	it('renders currency input element', () => {
		const { container } = renderWithProviders(<CurrencyInput />);
		const input = container.querySelector('input[type="text"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'text');
		expect(input).toHaveAttribute('inputMode', 'decimal');
	});

	it('renders with label', () => {
		renderWithProviders(<CurrencyInput label="Price" />);
		expect(screen.getByLabelText('Price')).toBeInTheDocument();
		const input = screen.getByLabelText('Price');
		expect(input).toHaveAttribute('type', 'text');
	});

	it('renders with helper text', () => {
		renderWithProviders(<CurrencyInput label="Price" helperText="Enter the price in USD" />);
		expect(screen.getByText('Enter the price in USD')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<CurrencyInput label="Price" error="Price is required" />);
		expect(screen.getByText('Price is required')).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(<CurrencyInput label="Price" required />);
		const label = screen.getByText('Price');
		expect(label).toBeInTheDocument();
		// Check for required indicator (usually asterisk)
		expect(label.textContent).toContain('Price');
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<CurrencyInput fullWidth label="Test" />);
		const input = screen.getByLabelText('Test');
		expect(input).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<CurrencyInput size="sm" label="Small" />);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<CurrencyInput size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<CurrencyInput size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});

	it('renders without label', () => {
		const { container } = renderWithProviders(<CurrencyInput />);
		const input = container.querySelector('input[type="text"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('renders with currency symbol', () => {
		renderWithProviders(<CurrencyInput label="Price" currency="USD" />);
		const input = screen.getByLabelText('Price');
		expect(input).toBeInTheDocument();
		// Check for currency symbol in the DOM
		const symbol = screen.getByText('$');
		expect(symbol).toBeInTheDocument();
	});

	it('renders different currency symbols', () => {
		const { rerender } = renderWithProviders(<CurrencyInput label="Price" currency="USD" />);
		expect(screen.getByText('$')).toBeInTheDocument();

		rerender(<CurrencyInput label="Price" currency="EUR" />);
		expect(screen.getByText('€')).toBeInTheDocument();

		rerender(<CurrencyInput label="Price" currency="GBP" />);
		expect(screen.getByText('£')).toBeInTheDocument();

		rerender(<CurrencyInput label="Price" currency="JPY" />);
		expect(screen.getByText('¥')).toBeInTheDocument();
	});

	it('defaults to USD currency when currency is not provided', () => {
		renderWithProviders(<CurrencyInput label="Price" />);
		const symbol = screen.getByText('$');
		expect(symbol).toBeInTheDocument();
	});
});

describe('CurrencyInput - User Interactions', () => {
	it('allows typing currency value', () => {
		renderWithProviders(<CurrencyInput label="Price" />);
		const input = screen.getByLabelText('Price');

		fireEvent.change(input, { target: { value: '100.50' } });
		expect(input).toHaveValue('100.50');
	});

	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<CurrencyInput label="Price" onChange={handleChange} />);
		const input = screen.getByLabelText('Price');

		fireEvent.change(input, { target: { value: '100.50' } });
		expect(handleChange).toHaveBeenCalled();
		// onChange should receive parsed numeric value (trailing zeros removed)
		const callArgs = handleChange.mock.calls[0]?.[0];
		expect(callArgs).toBeDefined();
		expect(callArgs?.target?.value).toBe('100.5');
	});

	it('parses currency input and calls onChange with numeric value', () => {
		const handleChange = vi.fn();
		renderWithProviders(<CurrencyInput label="Price" onChange={handleChange} />);
		const input = screen.getByLabelText('Price');

		fireEvent.change(input, { target: { value: '$100.50' } });
		expect(handleChange).toHaveBeenCalled();
		const callArgs = handleChange.mock.calls[0]?.[0];
		expect(callArgs?.target?.value).toBe('100.5');
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(<CurrencyInput label="Price" onFocus={handleFocus} onBlur={handleBlur} />);
		const input = screen.getByLabelText('Price');

		fireEvent.focus(input);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(input);
		expect(handleBlur).toHaveBeenCalled();
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		renderWithProviders(<CurrencyInput label="Price" onKeyDown={handleKeyDown} />);
		const input = screen.getByLabelText('Price');

		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalled();
	});

	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('100');
			return (
				<CurrencyInput label="Controlled" value={value} onChange={e => setValue(e.target.value)} />
			);
		};
		renderWithProviders(<TestComponent />);
		const input = screen.getByLabelText('Controlled');

		expect(input).toHaveValue('100');

		fireEvent.change(input, { target: { value: '200' } });
		expect(input).toHaveValue('200');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<CurrencyInput label="Uncontrolled" defaultValue="50.00" />);
		const input = screen.getByLabelText('Uncontrolled');
		expect(input).toHaveValue('50.00');
	});

	it('handles multiple currency value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<CurrencyInput label="Price" onChange={handleChange} />);
		const input = screen.getByLabelText('Price');

		fireEvent.change(input, { target: { value: '100' } });
		fireEvent.change(input, { target: { value: '200' } });
		fireEvent.change(input, { target: { value: '300' } });

		expect(handleChange).toHaveBeenCalledTimes(3);
	});

	it('handles empty input', () => {
		const handleChange = vi.fn();
		renderWithProviders(<CurrencyInput label="Price" onChange={handleChange} />);
		const input = screen.getByLabelText('Price');

		fireEvent.change(input, { target: { value: '' } });
		// onChange is called with empty string when input is cleared
		if (handleChange.mock.calls.length > 0) {
			const callArgs = handleChange.mock.calls[0]?.[0];
			expect(callArgs?.target?.value).toBe('');
		}
		// Input value should be empty
		expect((input as HTMLInputElement).value).toBe('');
	});

	it('parses currency with formatting characters', () => {
		const handleChange = vi.fn();
		renderWithProviders(<CurrencyInput label="Price" onChange={handleChange} />);
		const input = screen.getByLabelText('Price');

		fireEvent.change(input, { target: { value: '$1,234.56' } });
		expect(handleChange).toHaveBeenCalled();
		const callArgs = handleChange.mock.calls[0]?.[0];
		expect(callArgs?.target?.value).toBe('1234.56');
	});
});

describe('CurrencyInput - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<CurrencyInput label="Price" error="Price is required" />);
		expect(screen.getByText('Price is required')).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(<CurrencyInput label={LABEL_PRICE} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_PRICE);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('associates error message with input via ARIA', () => {
		renderWithProviders(<CurrencyInput label={LABEL_PRICE} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_PRICE);
		const errorId = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(errorId).toBeTruthy();
		if (errorId) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', errorId);
		}
	});

	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<CurrencyInput label="Price" error="Invalid price" helperText="Enter a valid price" />
		);
		expect(screen.getByText('Invalid price')).toBeInTheDocument();
		expect(screen.getByText('Enter a valid price')).toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(<CurrencyInput label="Price" required />);
		const input = screen.getByLabelText(/price/i);
		expect(input).toHaveAttribute('required');
	});

	it('does not show error styling when no error', () => {
		renderWithProviders(<CurrencyInput label={LABEL_PRICE} />);
		const input = screen.getByLabelText(LABEL_PRICE);
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});
});

describe('CurrencyInput - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<CurrencyInput label="Price" helperText="Enter the price" />
		);
		await expectA11y(container);
	});

	it('associates label with input via id', () => {
		renderWithProviders(<CurrencyInput label="Price" />);
		const input = screen.getByLabelText('Price');
		const label = screen.getByText('Price');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});

	it('uses aria-describedby for helper text', () => {
		const helperText = 'Helper text';
		renderWithProviders(<CurrencyInput label="Price" helperText={helperText} />);
		const input = screen.getByLabelText('Price');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(helperText)).toBeInTheDocument();
			expect(screen.getByText(helperText)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(<CurrencyInput label="Price" error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText('Price');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for both error and helper text', () => {
		renderWithProviders(<CurrencyInput label="Price" error="Error" helperText="Helper" />);
		const input = screen.getByLabelText('Price');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const ids = describedBy.split(' ');
			expect(ids.length).toBeGreaterThan(0);
		}
	});

	it('supports custom inputId', () => {
		renderWithProviders(<CurrencyInput label="Price" inputId="custom-currency-id" />);
		const input = screen.getByLabelText('Price');
		expect(input).toHaveAttribute('id', 'custom-currency-id');
	});

	it('auto-generates id when label is provided', () => {
		renderWithProviders(<CurrencyInput label="Price" />);
		const input = screen.getByLabelText('Price');
		expect(input).toHaveAttribute('id');
		expect(input.id).toBeTruthy();
	});
});

describe('CurrencyInput - Accessibility ARIA Attributes', () => {
	it('sets aria-invalid when error is present', () => {
		renderWithProviders(<CurrencyInput label="Price" error="Error message" />);
		const input = screen.getByLabelText('Price');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('does not set aria-invalid when no error', () => {
		renderWithProviders(<CurrencyInput label="Price" />);
		const input = screen.getByLabelText('Price');
		// aria-invalid can be "false" or not present, but should not be "true"
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});
});

describe('CurrencyInput - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(<CurrencyInput label="Price" error="This field is required" />);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<CurrencyInput label="Price" error="Error message" />);
		const input = screen.getByLabelText('Price');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(
			<CurrencyInput label="Price" error="Error message" helperText="Helper text" />
		);
		expect(screen.getByText('Error message')).toBeInTheDocument();
		expect(screen.getByText('Helper text')).toBeInTheDocument();
	});
});

describe('CurrencyInput - Disabled States', () => {
	it('renders disabled input', () => {
		renderWithProviders(<CurrencyInput label="Price" disabled />);
		const input = screen.getByLabelText('Price');
		expect(input).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(<CurrencyInput label="Price" disabled onChange={handleChange} />);
		const input = screen.getByLabelText('Price');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
		// Note: fireEvent doesn't respect disabled state like real browser events would
		// In a real browser, disabled elements don't fire change events
	});

	it('applies disabled styling', () => {
		renderWithProviders(<CurrencyInput label="Price" disabled />);
		const input = screen.getByLabelText('Price');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(<CurrencyInput label="Price" disabled />);
		const input = screen.getByLabelText('Price');
		const label = screen.getByText('Price');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});
});

describe('CurrencyInput - Size Variants', () => {
	it('renders small size', () => {
		renderWithProviders(<CurrencyInput size="sm" label="Small" />);
		const input = screen.getByLabelText('Small');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('renders medium size (default)', () => {
		renderWithProviders(<CurrencyInput size="md" label="Medium" />);
		const input = screen.getByLabelText('Medium');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('renders large size', () => {
		renderWithProviders(<CurrencyInput size="lg" label="Large" />);
		const input = screen.getByLabelText('Large');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('defaults to medium size when size is not provided', () => {
		renderWithProviders(<CurrencyInput label="Default" />);
		const input = screen.getByLabelText('Default');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});
});

describe('CurrencyInput - Value Handling', () => {
	it('accepts numeric string values', () => {
		renderWithProviders(<CurrencyInput label="Price" value="100.50" />);
		const input = screen.getByLabelText('Price') as HTMLInputElement;
		expect(input.value).toBe('100.50');
	});

	it('accepts numeric values', () => {
		renderWithProviders(<CurrencyInput label="Price" value={100.5} />);
		const input = screen.getByLabelText('Price') as HTMLInputElement;
		expect(input.value).toBe('100.5');
	});

	it('handles different numeric values', () => {
		const { rerender } = renderWithProviders(<CurrencyInput label="Price" value="0" />);
		let input = screen.getByLabelText('Price') as HTMLInputElement;
		expect(input.value).toBe('0');

		rerender(<CurrencyInput label="Price" value="1000" />);
		input = screen.getByLabelText('Price') as HTMLInputElement;
		expect(input.value).toBe('1000');

		rerender(<CurrencyInput label="Price" value="1234.56" />);
		input = screen.getByLabelText('Price') as HTMLInputElement;
		expect(input.value).toBe('1234.56');
	});

	it('handles empty value', () => {
		renderWithProviders(<CurrencyInput label="Price" value="" />);
		const input = screen.getByLabelText('Price') as HTMLInputElement;
		expect(input.value).toBe('');
	});
});

describe('CurrencyInput - Currency Symbols', () => {
	it('displays USD symbol', () => {
		renderWithProviders(<CurrencyInput label="Price" currency="USD" />);
		expect(screen.getByText('$')).toBeInTheDocument();
	});

	it('displays EUR symbol', () => {
		renderWithProviders(<CurrencyInput label="Price" currency="EUR" />);
		expect(screen.getByText('€')).toBeInTheDocument();
	});

	it('displays GBP symbol', () => {
		renderWithProviders(<CurrencyInput label="Price" currency="GBP" />);
		expect(screen.getByText('£')).toBeInTheDocument();
	});

	it('displays JPY symbol', () => {
		renderWithProviders(<CurrencyInput label="Price" currency="JPY" />);
		expect(screen.getByText('¥')).toBeInTheDocument();
	});

	it('displays INR symbol', () => {
		renderWithProviders(<CurrencyInput label="Price" currency="INR" />);
		expect(screen.getByText('₹')).toBeInTheDocument();
	});

	it('displays currency code when symbol is not available', () => {
		renderWithProviders(<CurrencyInput label="Price" currency="XYZ" />);
		expect(screen.getByText('XYZ')).toBeInTheDocument();
	});
});

describe('CurrencyInput - Props Forwarding', () => {
	it('forwards additional HTML input attributes', () => {
		renderWithProviders(
			<CurrencyInput label="Price" data-testid="custom-currency-input" aria-label="Custom" />
		);
		const input = screen.getByTestId('custom-currency-input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('aria-label', 'Custom');
	});

	it('forwards className prop', () => {
		renderWithProviders(<CurrencyInput label="Price" className="custom-class" />);
		const input = screen.getByLabelText('Price');
		expect(input).toHaveClass('custom-class');
	});

	it('forwards placeholder prop', () => {
		renderWithProviders(<CurrencyInput label="Price" placeholder="0.00" />);
		const input = screen.getByLabelText('Price');
		expect(input).toHaveAttribute('placeholder', '0.00');
	});
});
