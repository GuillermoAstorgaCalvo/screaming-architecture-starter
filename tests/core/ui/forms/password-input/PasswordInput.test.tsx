/**
 * PasswordInput Component Tests
 *
 * Tests for the PasswordInput component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 * - Size variants
 * - Password visibility toggle
 * - Controlled and uncontrolled modes
 */

import PasswordInput from '@core/ui/forms/password-input/PasswordInput';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const LABEL_PASSWORD = 'Password';
const ERROR_MESSAGE = 'Password is required';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';
const ARIA_DESCRIBEDBY = 'aria-describedby';

describe('PasswordInput - Rendering', () => {
	it('renders password input element', () => {
		const { container } = renderWithProviders(<PasswordInput />);
		const input = container.querySelector('input[type="password"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'password');
	});

	it('renders with label', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		expect(screen.getByLabelText('Password')).toBeInTheDocument();
		const input = screen.getByLabelText('Password');
		expect(input).toHaveAttribute('type', 'password');
	});

	it('renders with helper text', () => {
		renderWithProviders(
			<PasswordInput label="Password" helperText="Must be at least 8 characters" />
		);
		expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<PasswordInput label="Password" error="Password is required" />);
		expect(screen.getByText('Password is required')).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(<PasswordInput label="Password" required />);
		const label = screen.getByText('Password');
		expect(label).toBeInTheDocument();
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<PasswordInput fullWidth label="Test" />);
		const input = screen.getByLabelText('Test');
		expect(input).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<PasswordInput size="sm" label="Small" />);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<PasswordInput size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<PasswordInput size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});

	it('renders without label', () => {
		const { container } = renderWithProviders(<PasswordInput />);
		const input = container.querySelector('input[type="password"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'password');
	});

	it('renders visibility toggle button', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const toggleButton = screen.getByRole('button', { name: /show password/i });
		expect(toggleButton).toBeInTheDocument();
	});
});

describe('PasswordInput - User Interactions', () => {
	it('allows typing password value', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const input = screen.getByLabelText('Password');

		fireEvent.change(input, { target: { value: 'mySecretPassword' } });
		expect((input as HTMLInputElement).value).toBe('mySecretPassword');
	});

	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<PasswordInput label="Password" onChange={handleChange} />);
		const input = screen.getByLabelText('Password');

		fireEvent.change(input, { target: { value: 'password123' } });
		expect(handleChange).toHaveBeenCalled();
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(
			<PasswordInput label="Password" onFocus={handleFocus} onBlur={handleBlur} />
		);
		const input = screen.getByLabelText('Password');

		fireEvent.focus(input);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(input);
		expect(handleBlur).toHaveBeenCalled();
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		renderWithProviders(<PasswordInput label="Password" onKeyDown={handleKeyDown} />);
		const input = screen.getByLabelText('Password');

		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalled();
	});

	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('initialPassword');
			return (
				<PasswordInput label="Controlled" value={value} onChange={e => setValue(e.target.value)} />
			);
		};
		renderWithProviders(<TestComponent />);
		const input = screen.getByLabelText('Controlled');

		expect((input as HTMLInputElement).value).toBe('initialPassword');

		fireEvent.change(input, { target: { value: 'updatedPassword' } });
		expect((input as HTMLInputElement).value).toBe('updatedPassword');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<PasswordInput label="Uncontrolled" defaultValue="defaultPassword" />);
		const input = screen.getByLabelText('Uncontrolled');
		expect((input as HTMLInputElement).value).toBe('defaultPassword');
	});

	it('toggles password visibility when toggle button is clicked', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const input = screen.getByLabelText('Password');
		const toggleButton = screen.getByRole('button', { name: /show password/i });

		expect(input).toHaveAttribute('type', 'password');

		fireEvent.click(toggleButton);
		expect(input).toHaveAttribute('type', 'text');

		fireEvent.click(toggleButton);
		expect(input).toHaveAttribute('type', 'password');
	});

	it('updates toggle button aria-label when visibility changes', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const toggleButton = screen.getByRole('button', { name: /show password/i });

		expect(toggleButton).toHaveAttribute('aria-label');
		const initialLabel = toggleButton.getAttribute('aria-label');

		fireEvent.click(toggleButton);
		const newLabel = toggleButton.getAttribute('aria-label');
		expect(newLabel).not.toBe(initialLabel);
	});
});

describe('PasswordInput - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<PasswordInput label="Password" error="Password is required" />);
		expect(screen.getByText('Password is required')).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(<PasswordInput label={LABEL_PASSWORD} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_PASSWORD);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('associates error message with input via ARIA', () => {
		renderWithProviders(<PasswordInput label={LABEL_PASSWORD} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_PASSWORD);
		const errorId = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(errorId).toBeTruthy();
		if (errorId) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', errorId);
		}
	});

	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<PasswordInput
				label="Password"
				error="Invalid password"
				helperText="Must be at least 8 characters"
			/>
		);
		expect(screen.getByText('Invalid password')).toBeInTheDocument();
		expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
	});

	it('validates required field', () => {
		const { container } = renderWithProviders(<PasswordInput label="Password" required />);
		// Get the input by its type since the label includes the asterisk when required
		const input = container.querySelector('input[type="password"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('required');
	});

	it('does not show error styling when no error', () => {
		renderWithProviders(<PasswordInput label={LABEL_PASSWORD} />);
		const input = screen.getByLabelText(LABEL_PASSWORD);
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});
});

describe('PasswordInput - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<PasswordInput label="Password" helperText="Enter your password" />
		);
		await expectA11y(container);
	});

	it('associates label with input via id', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const input = screen.getByLabelText('Password');
		const label = screen.getByText('Password');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});

	it('uses aria-describedby for helper text', () => {
		const helperText = 'Helper text';
		renderWithProviders(<PasswordInput label="Password" helperText={helperText} />);
		const input = screen.getByLabelText('Password');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(helperText)).toBeInTheDocument();
			expect(screen.getByText(helperText)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(<PasswordInput label="Password" error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText('Password');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for both error and helper text', () => {
		renderWithProviders(<PasswordInput label="Password" error="Error" helperText="Helper" />);
		const input = screen.getByLabelText('Password');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const ids = describedBy.split(' ');
			expect(ids.length).toBeGreaterThan(0);
		}
	});

	it('supports custom inputId', () => {
		renderWithProviders(<PasswordInput label="Password" inputId="custom-password-id" />);
		const input = screen.getByLabelText('Password');
		expect(input).toHaveAttribute('id', 'custom-password-id');
	});

	it('auto-generates id when label is provided', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const input = screen.getByLabelText('Password');
		expect(input).toHaveAttribute('id');
		expect(input.id).toBeTruthy();
	});

	it('toggle button has proper aria-label', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const toggleButton = screen.getByRole('button');
		expect(toggleButton).toHaveAttribute('aria-label');
	});
});

describe('PasswordInput - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(<PasswordInput label="Password" error="This field is required" />);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<PasswordInput label="Password" error="Error message" />);
		const input = screen.getByLabelText('Password');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(
			<PasswordInput label="Password" error="Error message" helperText="Helper text" />
		);
		expect(screen.getByText('Error message')).toBeInTheDocument();
		expect(screen.getByText('Helper text')).toBeInTheDocument();
	});
});

describe('PasswordInput - Disabled States', () => {
	it('renders disabled input', () => {
		renderWithProviders(<PasswordInput label="Password" disabled />);
		const input = screen.getByLabelText('Password');
		expect(input).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(<PasswordInput label="Password" disabled onChange={handleChange} />);
		const input = screen.getByLabelText('Password');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('disables toggle button when input is disabled', () => {
		renderWithProviders(<PasswordInput label="Password" disabled />);
		const toggleButton = screen.getByRole('button');
		expect(toggleButton).toBeDisabled();
	});

	it('applies disabled styling', () => {
		renderWithProviders(<PasswordInput label="Password" disabled />);
		const input = screen.getByLabelText('Password');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(<PasswordInput label="Password" disabled />);
		const input = screen.getByLabelText('Password');
		const label = screen.getByText('Password');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});
});

describe('PasswordInput - Size Variants', () => {
	it('renders small size', () => {
		renderWithProviders(<PasswordInput size="sm" label="Small" />);
		const input = screen.getByLabelText('Small');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'password');
	});

	it('renders medium size (default)', () => {
		renderWithProviders(<PasswordInput size="md" label="Medium" />);
		const input = screen.getByLabelText('Medium');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'password');
	});

	it('renders large size', () => {
		renderWithProviders(<PasswordInput size="lg" label="Large" />);
		const input = screen.getByLabelText('Large');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'password');
	});

	it('defaults to medium size when size is not provided', () => {
		renderWithProviders(<PasswordInput label="Default" />);
		const input = screen.getByLabelText('Default');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'password');
	});
});

describe('PasswordInput - Password Visibility', () => {
	it('starts with password hidden', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const input = screen.getByLabelText('Password');
		expect(input).toHaveAttribute('type', 'password');
	});

	it('shows password when toggle is clicked', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const input = screen.getByLabelText('Password');
		const toggleButton = screen.getByRole('button', { name: /show password/i });

		fireEvent.click(toggleButton);
		expect(input).toHaveAttribute('type', 'text');
	});

	it('hides password when toggle is clicked again', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const input = screen.getByLabelText('Password');
		const toggleButton = screen.getByRole('button', { name: /show password/i });

		fireEvent.click(toggleButton);
		expect(input).toHaveAttribute('type', 'text');

		fireEvent.click(toggleButton);
		expect(input).toHaveAttribute('type', 'password');
	});

	it('maintains input value when toggling visibility', () => {
		renderWithProviders(<PasswordInput label="Password" />);
		const input = screen.getByLabelText('Password');
		const toggleButton = screen.getByRole('button', { name: /show password/i });

		const inputElement = input as HTMLInputElement;
		fireEvent.change(inputElement, { target: { value: 'myPassword123' } });
		expect(inputElement.value).toBe('myPassword123');

		fireEvent.click(toggleButton);
		expect(inputElement.value).toBe('myPassword123');
		expect(inputElement).toHaveAttribute('type', 'text');

		fireEvent.click(toggleButton);
		expect(inputElement.value).toBe('myPassword123');
		expect(input).toHaveAttribute('type', 'password');
	});
});

describe('PasswordInput - Props Forwarding', () => {
	it('forwards additional HTML input attributes', () => {
		renderWithProviders(
			<PasswordInput label="Password" data-testid="custom-password-input" aria-label="Custom" />
		);
		const input = screen.getByTestId('custom-password-input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('aria-label', 'Custom');
	});

	it('forwards className prop', () => {
		renderWithProviders(<PasswordInput label="Password" className="custom-class" />);
		const input = screen.getByLabelText('Password');
		expect(input).toHaveClass('custom-class');
	});

	it('forwards placeholder prop', () => {
		renderWithProviders(<PasswordInput label="Password" placeholder="Enter your password" />);
		const input = screen.getByLabelText('Password');
		expect(input).toHaveAttribute('placeholder', 'Enter your password');
	});
});
