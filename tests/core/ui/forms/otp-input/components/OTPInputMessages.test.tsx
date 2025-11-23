/**
 * OTPInputMessages Component Tests
 *
 * Tests for the OTPInputMessages component including:
 * - Rendering
 * - Error message display
 * - Helper text display
 * - Accessibility
 */

import { OTPInputMessages } from '@core/ui/forms/otp-input/components/OTPInputMessages';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('OTPInputMessages - Rendering', () => {
	it('renders nothing when no error and no helperText', () => {
		const { container } = renderWithProviders(<OTPInputMessages inputId="test-input" />);

		expect(container.firstChild).toBeNull();
	});

	it('renders error message when error is provided', () => {
		renderWithProviders(<OTPInputMessages inputId="test-input" error="This field is required" />);

		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('renders helper text when helperText is provided', () => {
		renderWithProviders(
			<OTPInputMessages inputId="test-input" helperText="Enter a 6-digit code" />
		);

		expect(screen.getByText('Enter a 6-digit code')).toBeInTheDocument();
	});

	it('renders both error and helper text when both are provided', () => {
		renderWithProviders(
			<OTPInputMessages
				inputId="test-input"
				error="Invalid code"
				helperText="Enter a 6-digit code"
			/>
		);

		expect(screen.getByText('Invalid code')).toBeInTheDocument();
		expect(screen.getByText('Enter a 6-digit code')).toBeInTheDocument();
	});
});

describe('OTPInputMessages - Error Message', () => {
	it('generates correct error ID', () => {
		renderWithProviders(<OTPInputMessages inputId="test-input" error="Error message" />);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toHaveAttribute('id', 'test-input-error');
	});

	it('uses ErrorText component for error', () => {
		renderWithProviders(<OTPInputMessages inputId="test-input" error="Error message" />);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toBeInTheDocument();
		// ErrorText should render the error message
	});

	it('handles different error messages', () => {
		const { rerender } = renderWithProviders(
			<OTPInputMessages inputId="test-input" error="First error" />
		);

		expect(screen.getByText('First error')).toBeInTheDocument();

		rerender(<OTPInputMessages inputId="test-input" error="Second error" />);

		expect(screen.getByText('Second error')).toBeInTheDocument();
		expect(screen.queryByText('First error')).not.toBeInTheDocument();
	});
});

describe('OTPInputMessages - Helper Text', () => {
	it('generates correct helper ID', () => {
		renderWithProviders(<OTPInputMessages inputId="test-input" helperText="Helper text" />);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toHaveAttribute('id', 'test-input-helper');
	});

	it('uses HelperText component for helper text', () => {
		renderWithProviders(<OTPInputMessages inputId="test-input" helperText="Helper text" />);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toBeInTheDocument();
		// HelperText should render the helper text
	});

	it('hides helper text when error is present', () => {
		renderWithProviders(
			<OTPInputMessages inputId="test-input" error="Error message" helperText="Helper text" />
		);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toHaveClass('sr-only');
	});

	it('shows helper text when no error', () => {
		renderWithProviders(<OTPInputMessages inputId="test-input" helperText="Helper text" />);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).not.toHaveClass('sr-only');
	});

	it('handles different helper text messages', () => {
		const { rerender } = renderWithProviders(
			<OTPInputMessages inputId="test-input" helperText="First helper" />
		);

		expect(screen.getByText('First helper')).toBeInTheDocument();

		rerender(<OTPInputMessages inputId="test-input" helperText="Second helper" />);

		expect(screen.getByText('Second helper')).toBeInTheDocument();
		expect(screen.queryByText('First helper')).not.toBeInTheDocument();
	});
});

describe('OTPInputMessages - Accessibility', () => {
	it('associates error with input via ID', () => {
		renderWithProviders(<OTPInputMessages inputId="test-input" error="Error message" />);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toHaveAttribute('id', 'test-input-error');
	});

	it('associates helper text with input via ID', () => {
		renderWithProviders(<OTPInputMessages inputId="test-input" helperText="Helper text" />);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toHaveAttribute('id', 'test-input-helper');
	});

	it('handles different input IDs', () => {
		renderWithProviders(<OTPInputMessages inputId="custom-input-id" error="Error message" />);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toHaveAttribute('id', 'custom-input-id-error');
	});
});

describe('OTPInputMessages - Edge Cases', () => {
	it('handles empty string error', () => {
		const { container } = renderWithProviders(<OTPInputMessages inputId="test-input" error="" />);

		expect(container.firstChild).toBeNull();
	});

	it('handles empty string helperText', () => {
		const { container } = renderWithProviders(
			<OTPInputMessages inputId="test-input" helperText="" />
		);

		expect(container.firstChild).toBeNull();
	});

	it('handles both empty strings', () => {
		const { container } = renderWithProviders(
			<OTPInputMessages inputId="test-input" error="" helperText="" />
		);

		expect(container.firstChild).toBeNull();
	});

	it('handles long error messages', () => {
		const longError = 'This is a very long error message that should still be displayed correctly';
		renderWithProviders(<OTPInputMessages inputId="test-input" error={longError} />);

		expect(screen.getByText(longError)).toBeInTheDocument();
	});

	it('handles long helper text', () => {
		const longHelper =
			'This is a very long helper text message that should still be displayed correctly';
		renderWithProviders(<OTPInputMessages inputId="test-input" helperText={longHelper} />);

		expect(screen.getByText(longHelper)).toBeInTheDocument();
	});
});
