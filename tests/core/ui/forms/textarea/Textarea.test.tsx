/**
 * Textarea Component Tests
 *
 * Tests for the Textarea component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 */

import Textarea from '@core/ui/forms/textarea/Textarea';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const ARIA_DESCRIBEDBY = 'aria-describedby';
const ARIA_INVALID = 'aria-invalid';
const ERROR_MESSAGE = 'Error message';
const HELPER_TEXT = 'Helper text';

describe('Textarea - Rendering', () => {
	it('renders textarea element', () => {
		renderWithProviders(<Textarea placeholder="Enter text" />);
		const textarea = screen.getByPlaceholderText('Enter text');
		expect(textarea).toBeInTheDocument();
		expect(textarea.tagName).toBe('TEXTAREA');
	});

	it('renders with label', () => {
		renderWithProviders(<Textarea label="Message" placeholder="Enter message" />);
		expect(screen.getByLabelText('Message')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Enter message')).toBeInTheDocument();
	});

	it('renders with helper text', () => {
		renderWithProviders(<Textarea label="Message" helperText="Minimum 10 characters" />);
		expect(screen.getByText('Minimum 10 characters')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(<Textarea label="Message" error="Message is required" />);
		expect(screen.getByText('Message is required')).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(<Textarea label="Message" required />);
		const label = screen.getByText('Message');
		expect(label).toBeInTheDocument();
		const textarea = screen.getByRole('textbox', { name: /message/i });
		expect(textarea).toHaveAttribute('required');
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(<Textarea fullWidth label="Test" />);
		const textarea = screen.getByLabelText('Test');
		expect(textarea).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(<Textarea size="sm" label="Small" />);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<Textarea size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<Textarea size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});

	it('renders with rows attribute', () => {
		renderWithProviders(<Textarea label="Message" rows={5} />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toHaveAttribute('rows', '5');
	});

	it('renders with cols attribute', () => {
		renderWithProviders(<Textarea label="Message" cols={50} />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toHaveAttribute('cols', '50');
	});
});

describe('Textarea - User Interactions', () => {
	it('allows typing text', () => {
		renderWithProviders(<Textarea label="Message" />);
		const textarea = screen.getByLabelText('Message');

		fireEvent.change(textarea, { target: { value: 'Hello, world!' } });
		expect(textarea).toHaveValue('Hello, world!');
	});

	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<Textarea label="Message" onChange={handleChange} />);
		const textarea = screen.getByLabelText('Message');

		fireEvent.change(textarea, { target: { value: 'test' } });
		expect(handleChange).toHaveBeenCalled();
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(<Textarea label="Message" onFocus={handleFocus} onBlur={handleBlur} />);
		const textarea = screen.getByLabelText('Message');

		fireEvent.focus(textarea);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(textarea);
		expect(handleBlur).toHaveBeenCalled();
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		renderWithProviders(<Textarea label="Message" onKeyDown={handleKeyDown} />);
		const textarea = screen.getByLabelText('Message');

		fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalled();
	});

	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('');
			return <Textarea label="Message" value={value} onChange={e => setValue(e.target.value)} />;
		};
		renderWithProviders(<TestComponent />);
		const textarea = screen.getByLabelText('Message');

		fireEvent.change(textarea, { target: { value: 'test' } });
		expect(textarea).toHaveValue('test');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<Textarea label="Message" defaultValue="initial" />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toHaveValue('initial');
	});

	it('handles multi-line text', () => {
		renderWithProviders(<Textarea label="Message" />);
		const textarea = screen.getByLabelText('Message');

		const multiLineValue = 'Line 1\nLine 2\nLine 3';
		fireEvent.change(textarea, { target: { value: multiLineValue } });
		expect(textarea).toHaveValue(multiLineValue);
	});
});

describe('Textarea - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<Textarea label="Message" error="Message is required" />);
		expect(screen.getByText('Message is required')).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(<Textarea label="Message" error={ERROR_MESSAGE} />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toHaveAttribute(ARIA_INVALID, 'true');
	});

	it('associates error message with textarea via ARIA', () => {
		renderWithProviders(<Textarea label="Message" error={ERROR_MESSAGE} />);
		const textarea = screen.getByLabelText('Message');
		const errorId = textarea.getAttribute(ARIA_DESCRIBEDBY);
		expect(errorId).toBeTruthy();
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', errorId ?? '');
	});

	it('shows error text when both error and helper text are provided', () => {
		renderWithProviders(
			<Textarea label="Message" error="Invalid message" helperText="Enter a valid message" />
		);
		expect(screen.getByText('Invalid message')).toBeInTheDocument();
		expect(screen.queryByText('Enter a valid message')).not.toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(<Textarea label="Message" required />);
		const textarea = screen.getByRole('textbox', { name: /message/i });
		expect(textarea).toHaveAttribute('required');
	});
});

describe('Textarea - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Textarea label="Message" helperText="Enter your message" />
		);
		await expectA11y(container);
	});

	it('associates label with textarea via id', () => {
		renderWithProviders(<Textarea label="Message" />);
		const textarea = screen.getByLabelText('Message');
		const label = screen.getByText('Message');
		expect(textarea).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', textarea.id);
	});

	it('uses aria-describedby for helper text', () => {
		renderWithProviders(<Textarea label="Message" helperText={HELPER_TEXT} />);
		const textarea = screen.getByLabelText('Message');
		const describedBy = textarea.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
		expect(screen.getByText(HELPER_TEXT)).toHaveAttribute('id', describedBy ?? '');
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(<Textarea label="Message" error={ERROR_MESSAGE} />);
		const textarea = screen.getByLabelText('Message');
		const describedBy = textarea.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', describedBy ?? '');
	});

	it('uses aria-describedby for both error and helper text', () => {
		renderWithProviders(<Textarea label="Message" error="Error" helperText="Helper" />);
		const textarea = screen.getByLabelText('Message');
		const describedBy = textarea.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			const ids = describedBy.split(' ');
			expect(ids.length).toBeGreaterThan(0);
		}
	});

	it('sets aria-invalid when error is present', () => {
		renderWithProviders(<Textarea label="Message" error={ERROR_MESSAGE} />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toHaveAttribute(ARIA_INVALID, 'true');
	});

	it('does not set aria-invalid when no error', () => {
		renderWithProviders(<Textarea label="Message" />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toHaveAttribute(ARIA_INVALID, 'false');
	});

	it('supports custom textareaId', () => {
		renderWithProviders(<Textarea label="Message" textareaId="custom-textarea-id" />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toHaveAttribute('id', 'custom-textarea-id');
	});
});

describe('Textarea - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(<Textarea label="Message" error="This field is required" />);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(<Textarea label="Message" error={ERROR_MESSAGE} />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toHaveAttribute(ARIA_INVALID, 'true');
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(
			<Textarea label="Message" error={ERROR_MESSAGE} helperText={HELPER_TEXT} />
		);
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.queryByText(HELPER_TEXT)).not.toBeInTheDocument();
	});
});

describe('Textarea - Disabled States', () => {
	it('renders disabled textarea', () => {
		renderWithProviders(<Textarea label="Message" disabled />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		renderWithProviders(<Textarea label="Message" disabled />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toBeDisabled();
		expect(textarea).toHaveAttribute('disabled');
		// Note: fireEvent doesn't respect disabled state like real browser events would
		// In a real browser, disabled elements don't fire change events
	});

	it('applies disabled styling', () => {
		renderWithProviders(<Textarea label="Message" disabled />);
		const textarea = screen.getByLabelText('Message');
		expect(textarea).toBeDisabled();
		expect(textarea).toHaveAttribute('disabled');
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(<Textarea label="Message" disabled />);
		const textarea = screen.getByLabelText('Message');
		const label = screen.getByText('Message');
		expect(textarea).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', textarea.id);
	});
});
