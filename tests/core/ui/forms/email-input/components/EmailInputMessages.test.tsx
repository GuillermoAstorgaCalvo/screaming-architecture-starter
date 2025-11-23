/**
 * EmailInputMessages Component Tests
 *
 * Tests for the EmailInputMessages component including:
 * - Conditional rendering
 * - Error message display
 * - Helper text display
 * - ID generation
 * - Accessibility attributes
 * - sr-only class when error is present
 */

import { EmailInputMessages } from '@core/ui/forms/email-input/components/EmailInputMessages';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const INPUT_ID = 'email-input-test';
const ERROR_MESSAGE = 'Email is required';
const HELPER_TEXT = 'We will never share your email';

describe('EmailInputMessages - Rendering', () => {
	it('returns null when neither error nor helperText is provided', () => {
		const { container } = renderWithProviders(<EmailInputMessages inputId={INPUT_ID} />);
		expect(container.firstChild).toBeNull();
	});

	it('returns null when error is empty string and helperText is not provided', () => {
		const { container } = renderWithProviders(<EmailInputMessages inputId={INPUT_ID} error="" />);
		expect(container.firstChild).toBeNull();
	});

	it('returns null when helperText is empty string and error is not provided', () => {
		const { container } = renderWithProviders(
			<EmailInputMessages inputId={INPUT_ID} helperText="" />
		);
		expect(container.firstChild).toBeNull();
	});

	it('renders error message when error is provided', () => {
		renderWithProviders(<EmailInputMessages inputId={INPUT_ID} error={ERROR_MESSAGE} />);
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it('renders helper text when helperText is provided', () => {
		renderWithProviders(<EmailInputMessages inputId={INPUT_ID} helperText={HELPER_TEXT} />);
		expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
	});

	it('renders both error and helper text when both are provided', () => {
		renderWithProviders(
			<EmailInputMessages inputId={INPUT_ID} error={ERROR_MESSAGE} helperText={HELPER_TEXT} />
		);
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
	});
});

describe('EmailInputMessages - ID Generation', () => {
	it('generates correct error ID from inputId', () => {
		renderWithProviders(<EmailInputMessages inputId={INPUT_ID} error={ERROR_MESSAGE} />);
		const errorElement = screen.getByText(ERROR_MESSAGE);
		expect(errorElement).toHaveAttribute('id', `${INPUT_ID}-error`);
	});

	it('generates correct helper ID from inputId', () => {
		renderWithProviders(<EmailInputMessages inputId={INPUT_ID} helperText={HELPER_TEXT} />);
		const helperElement = screen.getByText(HELPER_TEXT);
		expect(helperElement).toHaveAttribute('id', `${INPUT_ID}-helper`);
	});

	it('generates correct IDs for both error and helper text', () => {
		renderWithProviders(
			<EmailInputMessages inputId={INPUT_ID} error={ERROR_MESSAGE} helperText={HELPER_TEXT} />
		);
		const errorElement = screen.getByText(ERROR_MESSAGE);
		const helperElement = screen.getByText(HELPER_TEXT);
		expect(errorElement).toHaveAttribute('id', `${INPUT_ID}-error`);
		expect(helperElement).toHaveAttribute('id', `${INPUT_ID}-helper`);
	});

	it('handles different inputId values', () => {
		const customId = 'custom-email-input';
		renderWithProviders(<EmailInputMessages inputId={customId} error={ERROR_MESSAGE} />);
		const errorElement = screen.getByText(ERROR_MESSAGE);
		expect(errorElement).toHaveAttribute('id', `${customId}-error`);
	});
});

describe('EmailInputMessages - Accessibility', () => {
	it('error message has alert role for screen readers', () => {
		renderWithProviders(<EmailInputMessages inputId={INPUT_ID} error={ERROR_MESSAGE} />);
		const errorElement = screen.getByText(ERROR_MESSAGE);
		expect(errorElement).toHaveAttribute('role', 'alert');
	});

	it('helper text does not have alert role', () => {
		renderWithProviders(<EmailInputMessages inputId={INPUT_ID} helperText={HELPER_TEXT} />);
		const helperElement = screen.getByText(HELPER_TEXT);
		expect(helperElement).not.toHaveAttribute('role', 'alert');
	});
});

describe('EmailInputMessages - Error and Helper Text Interaction', () => {
	it('applies sr-only class to helper text when error is present', () => {
		renderWithProviders(
			<EmailInputMessages inputId={INPUT_ID} error={ERROR_MESSAGE} helperText={HELPER_TEXT} />
		);
		const helperElement = screen.getByText(HELPER_TEXT);
		expect(helperElement).toHaveClass('sr-only');
	});

	it('does not apply sr-only class to helper text when no error is present', () => {
		renderWithProviders(<EmailInputMessages inputId={INPUT_ID} helperText={HELPER_TEXT} />);
		const helperElement = screen.getByText(HELPER_TEXT);
		expect(helperElement).not.toHaveClass('sr-only');
	});

	it('renders error message visibly when both error and helper text are provided', () => {
		renderWithProviders(
			<EmailInputMessages inputId={INPUT_ID} error={ERROR_MESSAGE} helperText={HELPER_TEXT} />
		);
		const errorElement = screen.getByText(ERROR_MESSAGE);
		expect(errorElement).toBeInTheDocument();
		expect(errorElement).not.toHaveClass('sr-only');
	});
});

describe('EmailInputMessages - Edge Cases', () => {
	it('handles falsy error values correctly', () => {
		const { container: container1 } = renderWithProviders(
			<EmailInputMessages inputId={INPUT_ID} error={undefined} />
		);
		expect(container1.firstChild).toBeNull();

		const { container: container2 } = renderWithProviders(
			<EmailInputMessages inputId={INPUT_ID} error={null as unknown as string} />
		);
		expect(container2.firstChild).toBeNull();
	});

	it('handles falsy helperText values correctly', () => {
		const { container: container1 } = renderWithProviders(
			<EmailInputMessages inputId={INPUT_ID} helperText={undefined} />
		);
		expect(container1.firstChild).toBeNull();

		const { container: container2 } = renderWithProviders(
			<EmailInputMessages inputId={INPUT_ID} helperText={null as unknown as string} />
		);
		expect(container2.firstChild).toBeNull();
	});

	it('handles whitespace-only error as truthy', () => {
		renderWithProviders(<EmailInputMessages inputId={INPUT_ID} error="   " />);
		const errorElement = screen.getByRole('alert');
		expect(errorElement).toBeInTheDocument();
		expect(errorElement).toHaveAttribute('id', `${INPUT_ID}-error`);
		expect(errorElement.textContent).toBe('   ');
	});

	it('handles whitespace-only helperText as truthy', () => {
		renderWithProviders(<EmailInputMessages inputId={INPUT_ID} helperText="   " />);
		const helperElement = document.getElementById(`${INPUT_ID}-helper`);
		expect(helperElement).toBeInTheDocument();
		expect(helperElement?.textContent).toBe('   ');
	});
});
