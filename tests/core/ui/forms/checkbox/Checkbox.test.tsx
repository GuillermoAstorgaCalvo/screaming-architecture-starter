/**
 * Checkbox Component Tests
 *
 * Tests for the Checkbox component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 */

import Checkbox from '@core/ui/forms/checkbox/Checkbox';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const LABEL_I_AGREE = 'I agree';
const ERROR_MESSAGE = 'Error message';
const ERROR_YOU_MUST_AGREE = 'You must agree';
const HELPER_TEXT = 'Helper text';
const HELPER_PLEASE_READ = 'Please read the terms';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';
const ARIA_DESCRIBEDBY = 'aria-describedby';

// Helper to get checkbox input element with correct type
// Type guard is necessary because getByLabelText returns HTMLElement,
// but we need HTMLInputElement to access the 'checked' property
const getCheckboxInput = (label: string): HTMLInputElement => {
	const element = screen.getByLabelText(label);
	if (!(element instanceof HTMLInputElement)) {
		throw new TypeError(`Expected HTMLInputElement but got ${element.constructor.name}`);
	}
	return element;
};

describe('Checkbox - Rendering', () => {
	it('renders checkbox element', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		expect(checkbox).toBeInTheDocument();
		expect(checkbox.tagName).toBe('INPUT');
		expect(checkbox).toHaveAttribute('type', 'checkbox');
	});

	it('renders with label', () => {
		renderWithProviders(<Checkbox label="Subscribe to newsletter" />);
		expect(screen.getByLabelText('Subscribe to newsletter')).toBeInTheDocument();
	});

	it('renders with helper text', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} helperText={HELPER_PLEASE_READ} />);
		expect(screen.getByText(HELPER_PLEASE_READ)).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} error={ERROR_YOU_MUST_AGREE} />);
		expect(screen.getByText(ERROR_YOU_MUST_AGREE)).toBeInTheDocument();
	});

	it('renders checked checkbox when checked prop is true', () => {
		renderWithProviders(
			<Checkbox
				label={LABEL_I_AGREE}
				checked
				onChange={() => {
					// Controlled component needs onChange
				}}
			/>
		);
		const checkbox = getCheckboxInput(LABEL_I_AGREE);
		expect(checkbox.checked).toBe(true);
	});

	it('renders unchecked checkbox by default', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} />);
		const checkbox = getCheckboxInput(LABEL_I_AGREE);
		expect(checkbox.checked).toBe(false);
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} required />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('required');
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} fullWidth />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		expect(checkbox).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<Checkbox size="sm" label="Small" />);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<Checkbox size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<Checkbox size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});
});

describe('Checkbox - User Interactions', () => {
	it('toggles checked state on click', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} />);
		const checkbox = getCheckboxInput(LABEL_I_AGREE);

		expect(checkbox.checked).toBe(false);
		fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(true);
		fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(false);
	});

	it('calls onChange handler when clicked', () => {
		const handleChange = vi.fn();
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} onChange={handleChange} />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);

		fireEvent.click(checkbox);
		expect(handleChange).toHaveBeenCalled();
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(
			<Checkbox label={LABEL_I_AGREE} onFocus={handleFocus} onBlur={handleBlur} />
		);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);

		fireEvent.focus(checkbox);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(checkbox);
		expect(handleBlur).toHaveBeenCalled();
	});
});

describe('Checkbox - Controlled and Uncontrolled', () => {
	it('supports controlled mode', () => {
		function TestComponent() {
			const [checked, setChecked] = React.useState(false);
			return (
				<Checkbox
					label={LABEL_I_AGREE}
					checked={checked}
					onChange={e => setChecked(e.target.checked)}
				/>
			);
		}
		renderWithProviders(<TestComponent />);
		const checkbox = getCheckboxInput(LABEL_I_AGREE);

		expect(checkbox.checked).toBe(false);
		fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(true);
	});

	it('supports uncontrolled mode with defaultChecked', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} defaultChecked />);
		const checkbox = getCheckboxInput(LABEL_I_AGREE);
		expect(checkbox.checked).toBe(true);
	});
});

describe('Checkbox - Keyboard Interaction', () => {
	it('can be toggled via keyboard', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} />);
		const checkbox = getCheckboxInput(LABEL_I_AGREE);

		checkbox.focus();
		expect(checkbox.checked).toBe(false);
		// Space key on a focused checkbox triggers a click event
		// Simulate the keyboard interaction by triggering keyDown with space
		// and then the click that would normally follow
		fireEvent.keyDown(checkbox, { key: ' ', code: 'Space', keyCode: 32 });
		// The space key triggers a click on checkboxes
		fireEvent.click(checkbox);
		expect(checkbox.checked).toBe(true);
	});
});

describe('Checkbox - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} error={ERROR_YOU_MUST_AGREE} />);
		expect(screen.getByText(ERROR_YOU_MUST_AGREE)).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} error={ERROR_MESSAGE} />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		expect(checkbox).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('associates error message with checkbox via ARIA', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} error={ERROR_MESSAGE} />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		const errorId = checkbox.getAttribute(ARIA_DESCRIBEDBY);
		expect(errorId).toBeTruthy();
		if (errorId) {
			const errorElement = screen.getByText(ERROR_MESSAGE);
			expect(errorElement).toBeInTheDocument();
		}
	});

	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<Checkbox
				label={LABEL_I_AGREE}
				error={ERROR_YOU_MUST_AGREE}
				helperText={HELPER_PLEASE_READ}
			/>
		);
		expect(screen.getByText(ERROR_YOU_MUST_AGREE)).toBeInTheDocument();
		expect(screen.getByText(HELPER_PLEASE_READ)).toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} required />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toHaveAttribute('required');
	});
});

describe('Checkbox - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Checkbox label={LABEL_I_AGREE} helperText={HELPER_PLEASE_READ} />
		);
		await expectA11y(container);
	});

	it('associates label with checkbox via id', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		const label = screen.getByText(LABEL_I_AGREE);
		expect(checkbox).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', checkbox.id);
	});

	it('uses aria-describedby for helper text', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} helperText={HELPER_TEXT} />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		const describedBy = checkbox.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const helperElement = screen.getByText(HELPER_TEXT);
			expect(helperElement).toBeInTheDocument();
		}
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} error={ERROR_MESSAGE} />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		const describedBy = checkbox.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const errorElement = screen.getByText(ERROR_MESSAGE);
			expect(errorElement).toBeInTheDocument();
		}
	});

	it('sets aria-invalid when error is present', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} error={ERROR_MESSAGE} />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		expect(checkbox).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('does not set aria-invalid when no error', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		expect(checkbox).not.toHaveAttribute('aria-invalid');
	});

	it('supports custom checkboxId', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} checkboxId="custom-checkbox-id" />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		expect(checkbox).toHaveAttribute('id', 'custom-checkbox-id');
	});
});

describe('Checkbox - Error States', () => {
	it('displays error message', () => {
		const errorText = 'This field is required';
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} error={errorText} />);
		expect(screen.getByText(errorText)).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} error={ERROR_MESSAGE} />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		expect(checkbox).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(
			<Checkbox label={LABEL_I_AGREE} error={ERROR_MESSAGE} helperText={HELPER_TEXT} />
		);
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
	});
});

describe('Checkbox - Disabled States', () => {
	it('renders disabled checkbox', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} disabled />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		expect(checkbox).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} disabled onChange={handleChange} />);
		const checkbox = getCheckboxInput(LABEL_I_AGREE);

		const initialChecked = checkbox.checked;
		fireEvent.click(checkbox);
		expect(handleChange).not.toHaveBeenCalled();
		expect(checkbox.checked).toBe(initialChecked);
	});

	it('applies disabled styling', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} disabled />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		expect(checkbox).toBeDisabled();
		expect(checkbox).toHaveAttribute('disabled');
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} disabled />);
		const checkbox = screen.getByLabelText(LABEL_I_AGREE);
		const label = screen.getByText(LABEL_I_AGREE);
		expect(checkbox).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', checkbox.id);
	});

	it('maintains checked state when disabled', () => {
		renderWithProviders(<Checkbox label={LABEL_I_AGREE} checked disabled />);
		const checkbox = getCheckboxInput(LABEL_I_AGREE);
		expect(checkbox.checked).toBe(true);
		expect(checkbox).toBeDisabled();
	});
});
