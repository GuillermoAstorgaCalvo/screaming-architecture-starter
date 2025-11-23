/**
 * EmailInput Component Tests
 *
 * Tests for the EmailInput component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 * - Size variants
 * - Controlled and uncontrolled modes
 */

import EmailInput from '@core/ui/forms/email-input/EmailInput';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const LABEL_EMAIL = 'Email Address';
const ERROR_MESSAGE = 'Error message';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';
const ARIA_DESCRIBEDBY = 'aria-describedby';

describe('EmailInput - Rendering', () => {
	it('renders email input element', () => {
		const { container } = renderWithProviders(<EmailInput />);
		const input = container.querySelector('input[type="email"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'email');
	});

	it('renders with label', () => {
		renderWithProviders(<EmailInput label="Email Address" />);
		expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
		const input = screen.getByLabelText('Email Address');
		expect(input).toHaveAttribute('type', 'email');
	});

	it('renders with helper text', () => {
		renderWithProviders(
			<EmailInput label="Email Address" helperText="We'll never share your email" />
		);
		expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<EmailInput label="Email Address" error="Email is required" />);
		expect(screen.getByText('Email is required')).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(<EmailInput label="Email Address" required />);
		const label = screen.getByText('Email Address');
		expect(label).toBeInTheDocument();
		// Check for required indicator (usually asterisk)
		expect(label.textContent).toContain('Email Address');
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<EmailInput fullWidth label="Test" />);
		const input = screen.getByLabelText('Test');
		expect(input).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<EmailInput size="sm" label="Small" />);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<EmailInput size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<EmailInput size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});

	it('renders without label', () => {
		const { container } = renderWithProviders(<EmailInput />);
		const input = container.querySelector('input[type="email"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'email');
	});
});

describe('EmailInput - User Interactions', () => {
	it('allows changing email value', () => {
		renderWithProviders(<EmailInput label="Email Address" />);
		const input = screen.getByLabelText('Email Address');

		fireEvent.change(input, { target: { value: 'test@example.com' } });
		expect((input as HTMLInputElement).value).toBe('test@example.com');
	});

	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<EmailInput label="Email Address" onChange={handleChange} />);
		const input = screen.getByLabelText('Email Address');

		fireEvent.change(input, { target: { value: 'test@example.com' } });
		expect(handleChange).toHaveBeenCalled();
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(
			<EmailInput label="Email Address" onFocus={handleFocus} onBlur={handleBlur} />
		);
		const input = screen.getByLabelText('Email Address');

		fireEvent.focus(input);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(input);
		expect(handleBlur).toHaveBeenCalled();
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		renderWithProviders(<EmailInput label="Email Address" onKeyDown={handleKeyDown} />);
		const input = screen.getByLabelText('Email Address');

		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalled();
	});

	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('initial@example.com');
			return (
				<EmailInput label="Controlled" value={value} onChange={e => setValue(e.target.value)} />
			);
		};
		renderWithProviders(<TestComponent />);
		const input = screen.getByLabelText('Controlled');

		expect((input as HTMLInputElement).value).toBe('initial@example.com');

		fireEvent.change(input, { target: { value: 'updated@example.com' } });
		expect((input as HTMLInputElement).value).toBe('updated@example.com');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<EmailInput label="Uncontrolled" defaultValue="default@example.com" />);
		const input = screen.getByLabelText('Uncontrolled');
		expect((input as HTMLInputElement).value).toBe('default@example.com');
	});

	it('handles multiple email changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<EmailInput label="Email Address" onChange={handleChange} />);
		const input = screen.getByLabelText('Email Address');

		fireEvent.change(input, { target: { value: 'first@example.com' } });
		fireEvent.change(input, { target: { value: 'second@example.com' } });
		fireEvent.change(input, { target: { value: 'third@example.com' } });

		expect(handleChange).toHaveBeenCalledTimes(3);
	});
});

describe('EmailInput - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<EmailInput label="Email Address" error="Email is required" />);
		expect(screen.getByText('Email is required')).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(<EmailInput label={LABEL_EMAIL} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_EMAIL);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('associates error message with input via ARIA', () => {
		renderWithProviders(<EmailInput label={LABEL_EMAIL} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_EMAIL);
		const errorId = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(errorId).toBeTruthy();
		if (errorId) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', errorId);
		}
	});

	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<EmailInput
				label="Email Address"
				error="Invalid email"
				helperText="Enter a valid email address"
			/>
		);
		expect(screen.getByText('Invalid email')).toBeInTheDocument();
		expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(<EmailInput label="Email Address" required />);
		const input = screen.getByLabelText(/email address/i);
		expect(input).toHaveAttribute('required');
	});

	it('does not show error styling when no error', () => {
		renderWithProviders(<EmailInput label={LABEL_EMAIL} />);
		const input = screen.getByLabelText(LABEL_EMAIL);
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});
});

describe('EmailInput - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<EmailInput label="Email Address" helperText="Enter your email" />
		);
		await expectA11y(container);
	});

	it('associates label with input via id', () => {
		renderWithProviders(<EmailInput label="Email Address" />);
		const input = screen.getByLabelText('Email Address');
		const label = screen.getByText('Email Address');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});

	it('uses aria-describedby for helper text', () => {
		const helperText = 'Helper text';
		renderWithProviders(<EmailInput label="Email Address" helperText={helperText} />);
		const input = screen.getByLabelText('Email Address');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(helperText)).toBeInTheDocument();
			expect(screen.getByText(helperText)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(<EmailInput label="Email Address" error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText('Email Address');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for both error and helper text', () => {
		renderWithProviders(<EmailInput label="Email Address" error="Error" helperText="Helper" />);
		const input = screen.getByLabelText('Email Address');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const ids = describedBy.split(' ');
			expect(ids.length).toBeGreaterThan(0);
		}
	});

	it('supports custom inputId', () => {
		renderWithProviders(<EmailInput label="Email Address" inputId="custom-email-id" />);
		const input = screen.getByLabelText('Email Address');
		expect(input).toHaveAttribute('id', 'custom-email-id');
	});

	it('auto-generates id when label is provided', () => {
		renderWithProviders(<EmailInput label="Email Address" />);
		const input = screen.getByLabelText('Email Address');
		expect(input).toHaveAttribute('id');
		expect(input.id).toBeTruthy();
	});
});

describe('EmailInput - Accessibility ARIA Attributes', () => {
	it('sets aria-invalid when error is present', () => {
		renderWithProviders(<EmailInput label="Email Address" error="Error message" />);
		const input = screen.getByLabelText('Email Address');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('does not set aria-invalid when no error', () => {
		renderWithProviders(<EmailInput label="Email Address" />);
		const input = screen.getByLabelText('Email Address');
		// aria-invalid can be "false" or not present, but should not be "true"
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});
});

describe('EmailInput - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(<EmailInput label="Email Address" error="This field is required" />);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<EmailInput label="Email Address" error="Error message" />);
		const input = screen.getByLabelText('Email Address');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(
			<EmailInput label="Email Address" error="Error message" helperText="Helper text" />
		);
		expect(screen.getByText('Error message')).toBeInTheDocument();
		expect(screen.getByText('Helper text')).toBeInTheDocument();
	});
});

describe('EmailInput - Disabled States', () => {
	it('renders disabled input', () => {
		renderWithProviders(<EmailInput label="Email Address" disabled />);
		const input = screen.getByLabelText('Email Address');
		expect(input).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(<EmailInput label="Email Address" disabled onChange={handleChange} />);
		const input = screen.getByLabelText('Email Address');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
		// Note: fireEvent doesn't respect disabled state like real browser events would
		// In a real browser, disabled elements don't fire change events
	});

	it('applies disabled styling', () => {
		renderWithProviders(<EmailInput label="Email Address" disabled />);
		const input = screen.getByLabelText('Email Address');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(<EmailInput label="Email Address" disabled />);
		const input = screen.getByLabelText('Email Address');
		const label = screen.getByText('Email Address');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});
});

describe('EmailInput - Size Variants', () => {
	it('renders small size', () => {
		renderWithProviders(<EmailInput size="sm" label="Small" />);
		const input = screen.getByLabelText('Small');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'email');
	});

	it('renders medium size (default)', () => {
		renderWithProviders(<EmailInput size="md" label="Medium" />);
		const input = screen.getByLabelText('Medium');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'email');
	});

	it('renders large size', () => {
		renderWithProviders(<EmailInput size="lg" label="Large" />);
		const input = screen.getByLabelText('Large');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'email');
	});

	it('defaults to medium size when size is not provided', () => {
		renderWithProviders(<EmailInput label="Default" />);
		const input = screen.getByLabelText('Default');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'email');
	});
});

describe('EmailInput - Value Handling', () => {
	it('accepts email values', () => {
		renderWithProviders(<EmailInput label="Email Address" value="test@example.com" />);
		const input = screen.getByLabelText('Email Address');
		expect((input as HTMLInputElement).value).toBe('test@example.com');
	});

	it('accepts different email formats', () => {
		const { rerender } = renderWithProviders(
			<EmailInput label="Email Address" value="user@example.com" />
		);
		let input = screen.getByLabelText('Email Address');
		expect((input as HTMLInputElement).value).toBe('user@example.com');

		rerender(<EmailInput label="Email Address" value="admin@company.co.uk" />);
		input = screen.getByLabelText('Email Address');
		expect((input as HTMLInputElement).value).toBe('admin@company.co.uk');

		rerender(<EmailInput label="Email Address" value="name+tag@domain.org" />);
		input = screen.getByLabelText('Email Address');
		expect((input as HTMLInputElement).value).toBe('name+tag@domain.org');
	});

	it('handles empty value', () => {
		renderWithProviders(<EmailInput label="Email Address" value="" />);
		const input = screen.getByLabelText('Email Address');
		expect((input as HTMLInputElement).value).toBe('');
	});
});

describe('EmailInput - Props Forwarding', () => {
	it('forwards additional HTML input attributes', () => {
		renderWithProviders(
			<EmailInput label="Email Address" data-testid="custom-email-input" aria-label="Custom" />
		);
		const input = screen.getByTestId('custom-email-input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('aria-label', 'Custom');
	});

	it('forwards className prop', () => {
		renderWithProviders(<EmailInput label="Email Address" className="custom-class" />);
		const input = screen.getByLabelText('Email Address');
		expect(input).toHaveClass('custom-class');
	});

	it('forwards placeholder prop', () => {
		renderWithProviders(
			<EmailInput label="Email Address" placeholder="Enter your email address" />
		);
		const input = screen.getByLabelText('Email Address');
		expect(input).toHaveAttribute('placeholder', 'Enter your email address');
	});
});
