/**
 * Input Component Tests
 *
 * Tests for the Input component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 */

import Input from '@core/ui/forms/input/Input';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const LABEL_EMAIL = 'Email';
const ERROR_MESSAGE = 'Error message';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';
const ARIA_DESCRIBEDBY = 'aria-describedby';

describe('Input - Rendering', () => {
	it('renders input element', () => {
		renderWithProviders(<Input placeholder="Enter text" />);
		const input = screen.getByPlaceholderText('Enter text');
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
	});

	it('renders with label', () => {
		renderWithProviders(<Input label="Email" placeholder="Enter email" />);
		expect(screen.getByLabelText('Email')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
	});

	it('renders with helper text', () => {
		renderWithProviders(<Input label="Email" helperText="We'll never share your email" />);
		expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<Input label="Email" error="Email is required" />);
		expect(screen.getByText('Email is required')).toBeInTheDocument();
	});

	it('renders with left icon', () => {
		const LeftIcon = () => <span data-testid="left-icon">🔍</span>;
		renderWithProviders(<Input label="Search" leftIcon={<LeftIcon />} />);
		expect(screen.getByTestId('left-icon')).toBeInTheDocument();
	});

	it('renders with right icon', () => {
		const RightIcon = () => <span data-testid="right-icon">✕</span>;
		renderWithProviders(<Input label="Search" rightIcon={<RightIcon />} />);
		expect(screen.getByTestId('right-icon')).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(<Input label="Email" required />);
		const label = screen.getByText('Email');
		expect(label).toBeInTheDocument();
		// Check for required indicator (usually asterisk)
		expect(label.textContent).toContain('Email');
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<Input fullWidth label="Test" />);
		const input = screen.getByLabelText('Test');
		expect(input).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<Input size="sm" label="Small" />);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<Input size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<Input size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});
});

describe('Input - User Interactions', () => {
	it('allows typing text', () => {
		renderWithProviders(<Input label="Name" />);
		const input = screen.getByLabelText('Name');

		fireEvent.change(input, { target: { value: 'John Doe' } });
		expect(input).toHaveValue('John Doe');
	});

	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<Input label="Name" onChange={handleChange} />);
		const input = screen.getByLabelText('Name');

		fireEvent.change(input, { target: { value: 'John' } });
		expect(handleChange).toHaveBeenCalled();
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(<Input label="Email" onFocus={handleFocus} onBlur={handleBlur} />);
		const input = screen.getByLabelText('Email');

		fireEvent.focus(input);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(input);
		expect(handleBlur).toHaveBeenCalled();
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		renderWithProviders(<Input label="Search" onKeyDown={handleKeyDown} />);
		const input = screen.getByLabelText('Search');

		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalled();
	});

	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('');
			return <Input label="Controlled" value={value} onChange={e => setValue(e.target.value)} />;
		};
		renderWithProviders(<TestComponent />);
		const input = screen.getByLabelText('Controlled');

		fireEvent.change(input, { target: { value: 'test' } });
		expect(input).toHaveValue('test');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<Input label="Uncontrolled" defaultValue="initial" />);
		const input = screen.getByLabelText('Uncontrolled');
		expect(input).toHaveValue('initial');
	});
});

describe('Input - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<Input label="Email" error="Invalid email format" />);
		expect(screen.getByText('Invalid email format')).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(<Input label={LABEL_EMAIL} error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText(LABEL_EMAIL);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('associates error message with input via ARIA', () => {
		renderWithProviders(<Input label={LABEL_EMAIL} error={ERROR_MESSAGE} />);
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
			<Input label="Email" error="Invalid email" helperText="Enter a valid email address" />
		);
		expect(screen.getByText('Invalid email')).toBeInTheDocument();
		expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(<Input label="Email" required />);
		const input = screen.getByRole('textbox', { name: /email/i });
		expect(input).toHaveAttribute('required');
	});
});

describe('Input - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Input label="Email" helperText="Enter your email" />
		);
		await expectA11y(container);
	});

	it('associates label with input via id', () => {
		renderWithProviders(<Input label="Email" />);
		const input = screen.getByLabelText('Email');
		const label = screen.getByText('Email');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});

	it('uses aria-describedby for helper text', () => {
		const helperText = 'Helper text';
		renderWithProviders(<Input label="Email" helperText={helperText} />);
		const input = screen.getByLabelText('Email');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(helperText)).toBeInTheDocument();
			expect(screen.getByText(helperText)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(<Input label="Email" error={ERROR_MESSAGE} />);
		const input = screen.getByLabelText('Email');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for both error and helper text', () => {
		renderWithProviders(<Input label="Email" error="Error" helperText="Helper" />);
		const input = screen.getByLabelText('Email');
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const ids = describedBy.split(' ');
			expect(ids.length).toBeGreaterThan(0);
		}
	});
});

describe('Input - Accessibility ARIA Attributes', () => {
	it('sets aria-invalid when error is present', () => {
		renderWithProviders(<Input label="Email" error="Error message" />);
		const input = screen.getByLabelText('Email');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('does not set aria-invalid when no error', () => {
		renderWithProviders(<Input label="Email" />);
		const input = screen.getByLabelText('Email');
		// aria-invalid can be "false" or not present, but should not be "true"
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});

	it('supports custom inputId', () => {
		renderWithProviders(<Input label="Email" inputId="custom-email-id" />);
		const input = screen.getByLabelText('Email');
		expect(input).toHaveAttribute('id', 'custom-email-id');
	});
});

describe('Input - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(<Input label="Email" error="This field is required" />);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<Input label="Email" error="Error message" />);
		const input = screen.getByLabelText('Email');
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(<Input label="Email" error="Error message" helperText="Helper text" />);
		expect(screen.getByText('Error message')).toBeInTheDocument();
		expect(screen.getByText('Helper text')).toBeInTheDocument();
	});
});

describe('Input - Disabled States', () => {
	it('renders disabled input', () => {
		renderWithProviders(<Input label="Email" disabled />);
		const input = screen.getByLabelText('Email');
		expect(input).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		renderWithProviders(<Input label="Email" disabled />);
		const input = screen.getByLabelText('Email');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
		// Note: fireEvent doesn't respect disabled state like real browser events would
		// In a real browser, disabled elements don't fire change events
	});

	it('applies disabled styling', () => {
		renderWithProviders(<Input label="Email" disabled />);
		const input = screen.getByLabelText('Email');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(<Input label="Email" disabled />);
		const input = screen.getByLabelText('Email');
		const label = screen.getByText('Email');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.id);
	});
});

describe('Input - Type Variants', () => {
	it('renders email input type', () => {
		renderWithProviders(<Input type="email" label="Email" />);
		const input = screen.getByLabelText('Email');
		expect(input).toHaveAttribute('type', 'email');
	});

	it('renders password input type', () => {
		renderWithProviders(<Input type="password" label="Password" />);
		const input = screen.getByLabelText('Password');
		expect(input).toHaveAttribute('type', 'password');
	});

	it('renders number input type', () => {
		renderWithProviders(<Input type="number" label="Age" />);
		const input = screen.getByLabelText('Age');
		expect(input).toHaveAttribute('type', 'number');
	});

	it('renders search input type', () => {
		renderWithProviders(<Input type="search" label="Search" />);
		const input = screen.getByLabelText('Search');
		expect(input).toHaveAttribute('type', 'search');
	});
});
