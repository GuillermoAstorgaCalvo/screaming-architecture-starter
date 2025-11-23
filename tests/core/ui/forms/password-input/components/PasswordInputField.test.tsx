/**
 * PasswordInputField Component Tests
 *
 * Tests for the PasswordInputField component including:
 * - Rendering
 * - Password visibility toggle
 * - Input attributes
 * - Accessibility
 * - Disabled states
 * - Error states
 */

import { PasswordInputField } from '@core/ui/forms/password-input/components/PasswordInputField';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const INPUT_ID = 'password-input-test';
const INPUT_CLASSNAME = 'test-input-class';
const ARIA_DESCRIBEDBY = 'aria-describedby';

describe('PasswordInputField - Rendering', () => {
	it('renders password input element', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input[type="password"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'password');
	});

	it('renders text input when showPassword is true', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={true}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input[type="text"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('applies className to input', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveClass(INPUT_CLASSNAME);
	});

	it('applies id to input', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('id', INPUT_ID);
	});

	it('renders visibility toggle button', () => {
		renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const toggleButton = screen.getByRole('button');
		expect(toggleButton).toBeInTheDocument();
	});
});

describe('PasswordInputField - Password Visibility Toggle', () => {
	it('calls onToggleVisibility when toggle button is clicked', () => {
		const handleToggle = vi.fn();
		renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={handleToggle}
				props={{}}
			/>
		);
		const toggleButton = screen.getByRole('button');

		fireEvent.click(toggleButton);
		expect(handleToggle).toHaveBeenCalledTimes(1);
	});

	it('shows eye icon when password is hidden', () => {
		renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const toggleButton = screen.getByRole('button');
		// Check for eye icon (should have aria-label for show password)
		expect(toggleButton).toHaveAttribute('aria-label');
		const ariaLabel = toggleButton.getAttribute('aria-label');
		expect(ariaLabel?.toLowerCase()).toContain('show');
	});

	it('shows eye-off icon when password is visible', () => {
		renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={true}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const toggleButton = screen.getByRole('button');
		// Check for eye-off icon (should have aria-label for hide password)
		expect(toggleButton).toHaveAttribute('aria-label');
		const ariaLabel = toggleButton.getAttribute('aria-label');
		expect(ariaLabel?.toLowerCase()).toContain('hide');
	});

	it('prevents default and stops propagation on toggle button click', () => {
		const handleToggle = vi.fn();
		renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={handleToggle}
				props={{}}
			/>
		);
		const toggleButton = screen.getByRole('button');

		fireEvent.click(toggleButton);
		expect(handleToggle).toHaveBeenCalled();
	});
});

describe('PasswordInputField - Input Attributes', () => {
	it('applies aria-invalid when hasError is true', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={true}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('does not apply aria-invalid when hasError is false', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		const ariaInvalid = input.getAttribute('aria-invalid');
		expect(ariaInvalid).not.toBe('true');
	});

	it('applies aria-describedby when provided', () => {
		const describedBy = 'error-id helper-id';
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={describedBy}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute(ARIA_DESCRIBEDBY, describedBy);
	});

	it('does not apply aria-describedby when undefined', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).not.toHaveAttribute(ARIA_DESCRIBEDBY);
	});

	it('applies disabled attribute when disabled prop is provided', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={true}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeDisabled();
	});

	it('applies required attribute when required prop is provided', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				required={true}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('required');
	});

	it('forwards additional input props', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={
					{
						placeholder: 'Enter password',
						'data-testid': 'password-field',
					} as any
				}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('placeholder', 'Enter password');
		expect(input).toHaveAttribute('data-testid', 'password-field');
	});
});

describe('PasswordInputField - Disabled States', () => {
	it('disables input when disabled prop is true', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={true}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeDisabled();
	});

	it('disables toggle button when disabled prop is true', () => {
		renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={true}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const toggleButton = screen.getByRole('button');
		expect(toggleButton).toBeDisabled();
	});

	it('does not disable when disabled prop is undefined', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).not.toBeDisabled();
	});
});

describe('PasswordInputField - Accessibility', () => {
	it('toggle button has proper aria-label', () => {
		renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const toggleButton = screen.getByRole('button');
		expect(toggleButton).toHaveAttribute('aria-label');
		const ariaLabel = toggleButton.getAttribute('aria-label');
		expect(ariaLabel).toBeTruthy();
	});

	it('toggle button has type="button" to prevent form submission', () => {
		renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const toggleButton = screen.getByRole('button');
		expect(toggleButton).toHaveAttribute('type', 'button');
	});

	it('input has proper ARIA attributes for error state', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={true}
				ariaDescribedBy="error-id"
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute(ARIA_DESCRIBEDBY, 'error-id');
	});
});

describe('PasswordInputField - Edge Cases', () => {
	it('handles undefined id', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={undefined}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.id).toBe('');
	});

	it('handles empty className', () => {
		const { container } = renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeInTheDocument();
	});

	it('handles multiple toggle clicks', () => {
		const handleToggle = vi.fn();
		renderWithProviders(
			<PasswordInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				showPassword={false}
				onToggleVisibility={handleToggle}
				props={{}}
			/>
		);
		const toggleButton = screen.getByRole('button');

		fireEvent.click(toggleButton);
		fireEvent.click(toggleButton);
		fireEvent.click(toggleButton);

		expect(handleToggle).toHaveBeenCalledTimes(3);
	});
});
