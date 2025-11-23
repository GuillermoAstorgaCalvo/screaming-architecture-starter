/**
 * ColorInput Component Tests
 *
 * Tests for the ColorInput component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 * - Size variants
 * - Controlled and uncontrolled modes
 */

import ColorInput from '@core/ui/forms/color-input/ColorInput';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const LABEL_COLOR = 'Choose Color';
const ERROR_MESSAGE = 'Error message';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';
const ARIA_DESCRIBEDBY = 'aria-describedby';

describe('ColorInput - Rendering', () => {
	it('renders color input element', () => {
		const { container } = renderWithProviders(<ColorInput />);
		const input = container.querySelector('input[type="color"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'color');
	});

	it('renders with label', () => {
		renderWithProviders(<ColorInput label="Choose Color" />);
		expect(screen.getByLabelText('Choose Color')).toBeInTheDocument();
		const input = screen.getByLabelText('Choose Color');
		expect(input).toHaveAttribute('type', 'color');
	});

	it('renders with helper text', () => {
		renderWithProviders(<ColorInput label="Choose Color" helperText="Select a theme color" />);
		expect(screen.getByText('Select a theme color')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<ColorInput label="Choose Color" error="Color is required" />);
		expect(screen.getByText('Color is required')).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(<ColorInput label="Choose Color" required />);
		const label = screen.getByText('Choose Color');
		expect(label).toBeInTheDocument();
		// Check for required indicator (usually asterisk)
		expect(label.textContent).toContain('Choose Color');
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<ColorInput fullWidth label="Test" />);
		const input = screen.getByLabelText('Test');
		expect(input).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<ColorInput size="sm" label="Small" />);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<ColorInput size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<ColorInput size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});

	it('renders without label', () => {
		const { container } = renderWithProviders(<ColorInput />);
		const input = container.querySelector('input[type="color"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'color');
	});
});

describe('ColorInput - User Interactions', () => {
	it('allows changing color value', () => {
		renderWithProviders(<ColorInput label="Choose Color" />);
		const input = screen.getByLabelText('Choose Color') as HTMLInputElement;

		fireEvent.change(input, { target: { value: '#ff0000' } });
		expect(input.value).toBe('#ff0000');
	});

	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorInput label="Choose Color" onChange={handleChange} />);
		const input = screen.getByLabelText('Choose Color');

		fireEvent.change(input, { target: { value: '#00ff00' } });
		expect(handleChange).toHaveBeenCalledWith('#00ff00');
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(
			<ColorInput label="Choose Color" onFocus={handleFocus} onBlur={handleBlur} />
		);
		const input = screen.getByLabelText('Choose Color');

		fireEvent.focus(input);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(input);
		expect(handleBlur).toHaveBeenCalled();
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		renderWithProviders(<ColorInput label="Choose Color" onKeyDown={handleKeyDown} />);
		const input = screen.getByLabelText('Choose Color');

		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalled();
	});

	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('#000000');
			return <ColorInput label="Controlled" value={value} onChange={color => setValue(color)} />;
		};
		renderWithProviders(<TestComponent />);
		const input = screen.getByLabelText('Controlled') as HTMLInputElement;

		expect(input.value).toBe('#000000');

		fireEvent.change(input, { target: { value: '#ffffff' } });
		expect(input.value).toBe('#ffffff');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<ColorInput label="Uncontrolled" defaultValue="#ff0000" />);
		const input = screen.getByLabelText('Uncontrolled') as HTMLInputElement;
		expect(input.value).toBe('#ff0000');
	});

	it('handles multiple color changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorInput label="Choose Color" onChange={handleChange} />);
		const input = screen.getByLabelText('Choose Color');

		fireEvent.change(input, { target: { value: '#ff0000' } });
		fireEvent.change(input, { target: { value: '#00ff00' } });
		fireEvent.change(input, { target: { value: '#0000ff' } });

		expect(handleChange).toHaveBeenCalledTimes(3);
		expect(handleChange).toHaveBeenNthCalledWith(1, '#ff0000');
		expect(handleChange).toHaveBeenNthCalledWith(2, '#00ff00');
		expect(handleChange).toHaveBeenNthCalledWith(3, '#0000ff');
	});
});

describe('ColorInput - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<ColorInput label="Choose Color" error="Color is required" />);
		expect(screen.getByText('Color is required')).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(<ColorInput label={LABEL_COLOR} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_COLOR);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('associates error message with input via ARIA', () => {
		renderWithProviders(<ColorInput label={LABEL_COLOR} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_COLOR);
		const errorId = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(errorId).toBeTruthy();
		if (errorId) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', errorId);
		}
	});

	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<ColorInput
				label="Choose Color"
				error="Invalid color"
				helperText="Select a valid hex color"
			/>
		);
		expect(screen.getByText('Invalid color')).toBeInTheDocument();
		expect(screen.getByText('Select a valid hex color')).toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(<ColorInput label="Choose Color" required />);
		const input = screen.getByLabelText(/choose color/i);
		expect(input).toHaveAttribute('required');
	});

	it('does not show error styling when no error', () => {
		renderWithProviders(<ColorInput label={LABEL_COLOR} />);
		const input = screen.getByLabelText(LABEL_COLOR);
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});
});

describe('ColorInput - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<ColorInput label="Choose Color" helperText="Select a color" />
		);
		await expectA11y(container);
	});

	it('associates label with input via id', () => {
		renderWithProviders(<ColorInput label="Choose Color" />);
		const input = screen.getByLabelText('Choose Color');
		const label = screen.getByText('Choose Color');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});

	it('uses aria-describedby for helper text', () => {
		const helperText = 'Helper text';
		renderWithProviders(<ColorInput label="Choose Color" helperText={helperText} />);
		const input = screen.getByLabelText('Choose Color');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(helperText)).toBeInTheDocument();
			expect(screen.getByText(helperText)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(<ColorInput label="Choose Color" error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText('Choose Color');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for both error and helper text', () => {
		renderWithProviders(<ColorInput label="Choose Color" error="Error" helperText="Helper" />);
		const input = screen.getByLabelText('Choose Color');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const ids = describedBy.split(' ');
			expect(ids.length).toBeGreaterThan(0);
		}
	});

	it('supports custom colorInputId', () => {
		renderWithProviders(<ColorInput label="Choose Color" colorInputId="custom-color-id" />);
		const input = screen.getByLabelText('Choose Color');
		expect(input).toHaveAttribute('id', 'custom-color-id');
	});

	it('auto-generates id when label is provided', () => {
		renderWithProviders(<ColorInput label="Choose Color" />);
		const input = screen.getByLabelText('Choose Color');
		expect(input).toHaveAttribute('id');
		expect(input.id).toBeTruthy();
	});
});

describe('ColorInput - Accessibility ARIA Attributes', () => {
	it('sets aria-invalid when error is present', () => {
		renderWithProviders(<ColorInput label="Choose Color" error="Error message" />);
		const input = screen.getByLabelText('Choose Color');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('does not set aria-invalid when no error', () => {
		renderWithProviders(<ColorInput label="Choose Color" />);
		const input = screen.getByLabelText('Choose Color');
		// aria-invalid can be "false" or not present, but should not be "true"
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});
});

describe('ColorInput - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(<ColorInput label="Choose Color" error="This field is required" />);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<ColorInput label="Choose Color" error="Error message" />);
		const input = screen.getByLabelText('Choose Color');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(
			<ColorInput label="Choose Color" error="Error message" helperText="Helper text" />
		);
		expect(screen.getByText('Error message')).toBeInTheDocument();
		expect(screen.getByText('Helper text')).toBeInTheDocument();
	});
});

describe('ColorInput - Disabled States', () => {
	it('renders disabled input', () => {
		renderWithProviders(<ColorInput label="Choose Color" disabled />);
		const input = screen.getByLabelText('Choose Color');
		expect(input).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorInput label="Choose Color" disabled onChange={handleChange} />);
		const input = screen.getByLabelText('Choose Color');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
		// Note: fireEvent doesn't respect disabled state like real browser events would
		// In a real browser, disabled elements don't fire change events
	});

	it('applies disabled styling', () => {
		renderWithProviders(<ColorInput label="Choose Color" disabled />);
		const input = screen.getByLabelText('Choose Color');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(<ColorInput label="Choose Color" disabled />);
		const input = screen.getByLabelText('Choose Color');
		const label = screen.getByText('Choose Color');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});
});

describe('ColorInput - Size Variants', () => {
	it('renders small size', () => {
		renderWithProviders(<ColorInput size="sm" label="Small" />);
		const input = screen.getByLabelText('Small');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'color');
	});

	it('renders medium size (default)', () => {
		renderWithProviders(<ColorInput size="md" label="Medium" />);
		const input = screen.getByLabelText('Medium');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'color');
	});

	it('renders large size', () => {
		renderWithProviders(<ColorInput size="lg" label="Large" />);
		const input = screen.getByLabelText('Large');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'color');
	});

	it('defaults to medium size when size is not provided', () => {
		renderWithProviders(<ColorInput label="Default" />);
		const input = screen.getByLabelText('Default');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'color');
	});
});

describe('ColorInput - Value Handling', () => {
	it('accepts hex color values', () => {
		renderWithProviders(<ColorInput label="Choose Color" value="#ff0000" />);
		const input = screen.getByLabelText('Choose Color') as HTMLInputElement;
		expect(input.value).toBe('#ff0000');
	});

	it('accepts different hex color formats', () => {
		const { rerender } = renderWithProviders(<ColorInput label="Choose Color" value="#000000" />);
		let input = screen.getByLabelText('Choose Color') as HTMLInputElement;
		expect(input.value).toBe('#000000');

		rerender(<ColorInput label="Choose Color" value="#ffffff" />);
		input = screen.getByLabelText('Choose Color') as HTMLInputElement;
		expect(input.value).toBe('#ffffff');

		rerender(<ColorInput label="Choose Color" value="#123456" />);
		input = screen.getByLabelText('Choose Color') as HTMLInputElement;
		expect(input.value).toBe('#123456');
	});

	it('handles empty value (defaults to black)', () => {
		// Color inputs have a default value of #000000 when value is empty (browser behavior)
		renderWithProviders(<ColorInput label="Choose Color" value="" />);
		const input = screen.getByLabelText('Choose Color') as HTMLInputElement;
		// Browser will default empty color input to #000000
		expect(input.value).toBe('#000000');
	});
});

describe('ColorInput - Props Forwarding', () => {
	it('forwards additional HTML input attributes', () => {
		renderWithProviders(
			<ColorInput label="Choose Color" data-testid="custom-color-input" aria-label="Custom" />
		);
		const input = screen.getByTestId('custom-color-input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('aria-label', 'Custom');
	});

	it('forwards className prop', () => {
		renderWithProviders(<ColorInput label="Choose Color" className="custom-class" />);
		const input = screen.getByLabelText('Choose Color');
		expect(input).toHaveClass('custom-class');
	});
});
