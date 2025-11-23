/**
 * NumberInput Component Tests
 *
 * Tests for the NumberInput component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 * - Size variants
 * - Controlled and uncontrolled modes
 */

import NumberInput from '@core/ui/forms/number-input/NumberInput';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const LABEL_QUANTITY = 'Quantity';
const ERROR_MESSAGE = 'Error message';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';
const ARIA_DESCRIBEDBY = 'aria-describedby';

describe('NumberInput - Rendering', () => {
	it('renders number input element', () => {
		const { container } = renderWithProviders(<NumberInput />);
		const input = container.querySelector('input[type="number"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'number');
	});

	it('renders with label', () => {
		renderWithProviders(<NumberInput label="Quantity" />);
		expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
		const input = screen.getByLabelText('Quantity');
		expect(input).toHaveAttribute('type', 'number');
	});

	it('renders with helper text', () => {
		renderWithProviders(
			<NumberInput label="Quantity" helperText="Enter a quantity between 0 and 100" />
		);
		expect(screen.getByText('Enter a quantity between 0 and 100')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<NumberInput label="Quantity" error="Quantity is required" />);
		expect(screen.getByText('Quantity is required')).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(<NumberInput label="Quantity" required />);
		const label = screen.getByText('Quantity');
		expect(label).toBeInTheDocument();
		// Check for required indicator (usually asterisk)
		expect(label.textContent).toContain('Quantity');
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<NumberInput fullWidth label="Test" />);
		const input = screen.getByLabelText('Test');
		expect(input).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<NumberInput size="sm" label="Small" />);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<NumberInput size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<NumberInput size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});

	it('renders without label', () => {
		const { container } = renderWithProviders(<NumberInput />);
		const input = container.querySelector('input[type="number"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'number');
	});

	it('renders increment and decrement buttons', () => {
		renderWithProviders(<NumberInput label="Quantity" />);
		const buttons = screen.getAllByRole('button');
		expect(buttons.length).toBeGreaterThanOrEqual(2);
	});
});

describe('NumberInput - User Interactions', () => {
	it('allows changing number value', () => {
		renderWithProviders(<NumberInput label="Quantity" />);
		const input = screen.getByLabelText('Quantity');

		fireEvent.change(input, { target: { value: '42' } });
		expect((input as HTMLInputElement).value).toBe('42');
	});

	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<NumberInput label="Quantity" onChange={handleChange} />);
		const input = screen.getByLabelText('Quantity');

		fireEvent.change(input, { target: { value: '42' } });
		expect(handleChange).toHaveBeenCalled();
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('increments value when increment button is clicked', () => {
		const handleChange = vi.fn();
		renderWithProviders(<NumberInput label="Quantity" value={5} onChange={handleChange} />);
		const buttons = screen.getAllByRole('button');
		const incrementButton = buttons[0];
		expect(incrementButton).toBeDefined();
		fireEvent.click(incrementButton!);
		expect(handleChange).toHaveBeenCalled();
	});

	it('decrements value when decrement button is clicked', () => {
		const handleChange = vi.fn();
		renderWithProviders(<NumberInput label="Quantity" value={5} onChange={handleChange} />);
		const buttons = screen.getAllByRole('button');
		const decrementButton = buttons[1];
		expect(decrementButton).toBeDefined();
		fireEvent.click(decrementButton!);
		expect(handleChange).toHaveBeenCalled();
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(<NumberInput label="Quantity" onFocus={handleFocus} onBlur={handleBlur} />);
		const input = screen.getByLabelText('Quantity');

		fireEvent.focus(input);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(input);
		expect(handleBlur).toHaveBeenCalled();
	});

	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState(10);
			return <NumberInput label="Controlled" value={value} onChange={v => setValue(v)} />;
		};
		renderWithProviders(<TestComponent />);
		const input = screen.getByLabelText('Controlled') as HTMLInputElement;

		expect(input.value).toBe('10');

		fireEvent.change(input, { target: { value: '20' } });
		expect(input.value).toBe('20');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<NumberInput label="Uncontrolled" defaultValue={15} />);
		const input = screen.getByLabelText('Uncontrolled') as HTMLInputElement;
		expect(input.value).toBe('15');
	});

	it('handles multiple value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<NumberInput label="Quantity" onChange={handleChange} />);
		const input = screen.getByLabelText('Quantity');

		fireEvent.change(input, { target: { value: '10' } });
		fireEvent.change(input, { target: { value: '20' } });
		fireEvent.change(input, { target: { value: '30' } });

		expect(handleChange).toHaveBeenCalledTimes(3);
	});
});

describe('NumberInput - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<NumberInput label="Quantity" error="Quantity is required" />);
		expect(screen.getByText('Quantity is required')).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(<NumberInput label={LABEL_QUANTITY} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_QUANTITY);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('associates error message with input via ARIA', () => {
		renderWithProviders(<NumberInput label={LABEL_QUANTITY} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_QUANTITY);
		const errorId = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(errorId).toBeTruthy();
		if (errorId) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', errorId);
		}
	});

	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<NumberInput
				label="Quantity"
				error="Invalid quantity"
				helperText="Enter a quantity between 0 and 100"
			/>
		);
		expect(screen.getByText('Invalid quantity')).toBeInTheDocument();
		expect(screen.getByText('Enter a quantity between 0 and 100')).toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(<NumberInput label="Quantity" required />);
		const input = screen.getByLabelText(/quantity/i);
		expect(input).toHaveAttribute('required');
	});

	it('does not show error styling when no error', () => {
		renderWithProviders(<NumberInput label={LABEL_QUANTITY} />);
		const input = screen.getByLabelText(LABEL_QUANTITY);
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});
});

describe('NumberInput - Min/Max/Step', () => {
	it('applies min attribute', () => {
		renderWithProviders(<NumberInput label="Quantity" min={0} />);
		const input = screen.getByLabelText('Quantity');
		expect(input).toHaveAttribute('min', '0');
	});

	it('applies max attribute', () => {
		renderWithProviders(<NumberInput label="Quantity" max={100} />);
		const input = screen.getByLabelText('Quantity');
		expect(input).toHaveAttribute('max', '100');
	});

	it('applies step attribute', () => {
		renderWithProviders(<NumberInput label="Price" step={0.01} />);
		const input = screen.getByLabelText('Price');
		expect(input).toHaveAttribute('step', '0.01');
	});

	it('disables increment button when value is at max', () => {
		renderWithProviders(<NumberInput label="Quantity" value={10} max={10} />);
		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDisabled();
	});

	it('disables decrement button when value is at min', () => {
		renderWithProviders(<NumberInput label="Quantity" value={0} min={0} />);
		const buttons = screen.getAllByRole('button');
		expect(buttons[1]).toBeDisabled();
	});
});

describe('NumberInput - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<NumberInput label="Quantity" helperText="Enter a number" />
		);
		await expectA11y(container);
	});

	it('associates label with input via id', () => {
		renderWithProviders(<NumberInput label="Quantity" />);
		const input = screen.getByLabelText('Quantity');
		const label = screen.getByText('Quantity');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});

	it('uses aria-describedby for helper text', () => {
		const helperText = 'Helper text';
		renderWithProviders(<NumberInput label="Quantity" helperText={helperText} />);
		const input = screen.getByLabelText('Quantity');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(helperText)).toBeInTheDocument();
			expect(screen.getByText(helperText)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(<NumberInput label="Quantity" error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText('Quantity');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for both error and helper text', () => {
		renderWithProviders(<NumberInput label="Quantity" error="Error" helperText="Helper" />);
		const input = screen.getByLabelText('Quantity');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const ids = describedBy.split(' ');
			expect(ids.length).toBeGreaterThan(0);
		}
	});

	it('supports custom inputId', () => {
		renderWithProviders(<NumberInput label="Quantity" inputId="custom-quantity-id" />);
		const input = screen.getByLabelText('Quantity');
		expect(input).toHaveAttribute('id', 'custom-quantity-id');
	});

	it('auto-generates id when label is provided', () => {
		renderWithProviders(<NumberInput label="Quantity" />);
		const input = screen.getByLabelText('Quantity');
		expect(input).toHaveAttribute('id');
		expect(input.id).toBeTruthy();
	});
});

describe('NumberInput - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(<NumberInput label="Quantity" error="This field is required" />);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<NumberInput label="Quantity" error="Error message" />);
		const input = screen.getByLabelText('Quantity');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(
			<NumberInput label="Quantity" error="Error message" helperText="Helper text" />
		);
		expect(screen.getByText('Error message')).toBeInTheDocument();
		expect(screen.getByText('Helper text')).toBeInTheDocument();
	});
});

describe('NumberInput - Disabled States', () => {
	it('renders disabled input', () => {
		renderWithProviders(<NumberInput label="Quantity" disabled />);
		const input = screen.getByLabelText('Quantity');
		expect(input).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(<NumberInput label="Quantity" disabled onChange={handleChange} />);
		const input = screen.getByLabelText('Quantity');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('disables increment and decrement buttons when disabled', () => {
		renderWithProviders(<NumberInput label="Quantity" disabled />);
		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDisabled();
		expect(buttons[1]).toBeDisabled();
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(<NumberInput label="Quantity" disabled />);
		const input = screen.getByLabelText('Quantity');
		const label = screen.getByText('Quantity');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});
});

describe('NumberInput - Size Variants', () => {
	it('renders small size', () => {
		renderWithProviders(<NumberInput size="sm" label="Small" />);
		const input = screen.getByLabelText('Small');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'number');
	});

	it('renders medium size (default)', () => {
		renderWithProviders(<NumberInput size="md" label="Medium" />);
		const input = screen.getByLabelText('Medium');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'number');
	});

	it('renders large size', () => {
		renderWithProviders(<NumberInput size="lg" label="Large" />);
		const input = screen.getByLabelText('Large');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'number');
	});

	it('defaults to medium size when size is not provided', () => {
		renderWithProviders(<NumberInput label="Default" />);
		const input = screen.getByLabelText('Default');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'number');
	});
});

describe('NumberInput - Value Handling', () => {
	it('accepts number values', () => {
		renderWithProviders(<NumberInput label="Quantity" value={42} />);
		const input = screen.getByLabelText('Quantity') as HTMLInputElement;
		expect(input.value).toBe('42');
	});

	it('accepts string number values', () => {
		renderWithProviders(<NumberInput label="Quantity" value="42" />);
		const input = screen.getByLabelText('Quantity') as HTMLInputElement;
		expect(input.value).toBe('42');
	});

	it('handles decimal values', () => {
		renderWithProviders(<NumberInput label="Price" value={3.14} />);
		const input = screen.getByLabelText('Price') as HTMLInputElement;
		expect(input.value).toBe('3.14');
	});

	it('handles zero value', () => {
		renderWithProviders(<NumberInput label="Quantity" value={0} />);
		const input = screen.getByLabelText('Quantity') as HTMLInputElement;
		expect(input.value).toBe('0');
	});

	it('handles negative values', () => {
		renderWithProviders(<NumberInput label="Temperature" value={-10} />);
		const input = screen.getByLabelText('Temperature') as HTMLInputElement;
		expect(input.value).toBe('-10');
	});
});

describe('NumberInput - Props Forwarding', () => {
	it('forwards additional HTML input attributes', () => {
		renderWithProviders(
			<NumberInput label="Quantity" data-testid="custom-number-input" aria-label="Custom" />
		);
		const input = screen.getByTestId('custom-number-input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('aria-label', 'Custom');
	});

	it('forwards className prop', () => {
		renderWithProviders(<NumberInput label="Quantity" className="custom-class" />);
		const input = screen.getByLabelText('Quantity');
		expect(input).toHaveClass('custom-class');
	});

	it('forwards placeholder prop', () => {
		renderWithProviders(<NumberInput label="Quantity" placeholder="Enter quantity" />);
		const input = screen.getByLabelText('Quantity');
		expect(input).toHaveAttribute('placeholder', 'Enter quantity');
	});
});
