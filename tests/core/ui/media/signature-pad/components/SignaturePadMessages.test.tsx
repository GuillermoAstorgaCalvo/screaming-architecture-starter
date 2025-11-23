/**
 * SignaturePadMessages Component Tests
 *
 * Tests for the SignaturePadMessages component including:
 * - Rendering
 * - Error message display
 * - Helper text display
 * - Accessibility
 */

import { SignaturePadMessages } from '@core/ui/media/signature-pad/components/SignaturePadMessages';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('SignaturePadMessages - Rendering', () => {
	it('renders nothing when no error and no helperText', () => {
		const { container } = renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" />
		);

		expect(container.firstChild).toBeNull();
	});

	it('renders error message when error is provided', () => {
		renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" error="This field is required" />
		);

		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('renders helper text when helperText is provided', () => {
		renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" helperText="Please sign here" />
		);

		expect(screen.getByText('Please sign here')).toBeInTheDocument();
	});

	it('renders error when both error and helperText are provided', () => {
		renderWithProviders(
			<SignaturePadMessages
				signaturePadId="test-signature-pad"
				error="Invalid signature"
				helperText="Please sign here"
			/>
		);

		expect(screen.getByText('Invalid signature')).toBeInTheDocument();
		expect(screen.queryByText('Please sign here')).not.toBeInTheDocument();
	});
});

describe('SignaturePadMessages - Error Message', () => {
	it('generates correct error ID', () => {
		renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" error="Error message" />
		);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toHaveAttribute('id', 'test-signature-pad-error');
	});

	it('applies correct error styling', () => {
		renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" error="Error message" />
		);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toHaveClass('text-sm', 'text-destructive');
	});

	it('handles different error messages', () => {
		const { rerender } = renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" error="First error" />
		);

		expect(screen.getByText('First error')).toBeInTheDocument();

		rerender(<SignaturePadMessages signaturePadId="test-signature-pad" error="Second error" />);

		expect(screen.getByText('Second error')).toBeInTheDocument();
		expect(screen.queryByText('First error')).not.toBeInTheDocument();
	});
});

describe('SignaturePadMessages - Helper Text', () => {
	it('generates correct helper ID', () => {
		renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" helperText="Helper text" />
		);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toHaveAttribute('id', 'test-signature-pad-helper');
	});

	it('applies correct helper text styling', () => {
		renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" helperText="Helper text" />
		);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toHaveClass('text-sm', 'text-text-muted');
	});

	it('hides helper text when error is present', () => {
		renderWithProviders(
			<SignaturePadMessages
				signaturePadId="test-signature-pad"
				error="Error message"
				helperText="Helper text"
			/>
		);

		expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
	});

	it('shows helper text when no error', () => {
		renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" helperText="Helper text" />
		);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toBeInTheDocument();
	});

	it('handles different helper text messages', () => {
		const { rerender } = renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" helperText="First helper" />
		);

		expect(screen.getByText('First helper')).toBeInTheDocument();

		rerender(
			<SignaturePadMessages signaturePadId="test-signature-pad" helperText="Second helper" />
		);

		expect(screen.getByText('Second helper')).toBeInTheDocument();
		expect(screen.queryByText('First helper')).not.toBeInTheDocument();
	});
});

describe('SignaturePadMessages - Accessibility', () => {
	it('associates error with signature pad via ID', () => {
		renderWithProviders(
			<SignaturePadMessages signaturePadId="custom-signature-pad" error="Error message" />
		);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toHaveAttribute('id', 'custom-signature-pad-error');
	});

	it('associates helper text with signature pad via ID', () => {
		renderWithProviders(
			<SignaturePadMessages signaturePadId="custom-signature-pad" helperText="Helper text" />
		);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toHaveAttribute('id', 'custom-signature-pad-helper');
	});

	it('handles different signature pad IDs', () => {
		renderWithProviders(
			<SignaturePadMessages signaturePadId="signature-pad-123" error="Error message" />
		);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toHaveAttribute('id', 'signature-pad-123-error');
	});
});

describe('SignaturePadMessages - Edge Cases', () => {
	it('handles empty string error', () => {
		const { container } = renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" error="" />
		);

		expect(container.firstChild).toBeNull();
	});

	it('handles empty string helperText', () => {
		const { container } = renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" helperText="" />
		);

		expect(container.firstChild).toBeNull();
	});

	it('handles both empty strings', () => {
		const { container } = renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" error="" helperText="" />
		);

		expect(container.firstChild).toBeNull();
	});

	it('handles long error messages', () => {
		const longError =
			'This is a very long error message that should still be displayed correctly in the signature pad messages component';
		renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" error={longError} />
		);

		expect(screen.getByText(longError)).toBeInTheDocument();
	});

	it('handles long helper text', () => {
		const longHelper =
			'This is a very long helper text message that should still be displayed correctly in the signature pad messages component';
		renderWithProviders(
			<SignaturePadMessages signaturePadId="test-signature-pad" helperText={longHelper} />
		);

		expect(screen.getByText(longHelper)).toBeInTheDocument();
	});
});
