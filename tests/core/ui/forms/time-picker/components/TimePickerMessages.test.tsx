/**
 * TimePickerMessages Component Tests
 *
 * Tests for the TimePickerMessages component including:
 * - Rendering
 * - Error message display
 * - Helper text display
 * - Accessibility
 */

import { TimePickerMessages } from '@core/ui/forms/time-picker/components/TimePickerMessages';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('TimePickerMessages - Rendering', () => {
	it('renders nothing when no error and no helperText', () => {
		const { container } = renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" />
		);

		expect(container.firstChild).toBeNull();
	});

	it('renders error message when error is provided', () => {
		renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" error="This field is required" />
		);

		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('renders helper text when helperText is provided', () => {
		renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" helperText="Enter a time" />
		);

		expect(screen.getByText('Enter a time')).toBeInTheDocument();
	});

	it('renders both error and helper text when both are provided', () => {
		renderWithProviders(
			<TimePickerMessages
				timePickerId="test-timepicker"
				error="Invalid time"
				helperText="Enter a time"
			/>
		);

		expect(screen.getByText('Invalid time')).toBeInTheDocument();
		expect(screen.getByText('Enter a time')).toBeInTheDocument();
	});
});

describe('TimePickerMessages - Error Message', () => {
	it('generates correct error ID', () => {
		renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" error="Error message" />
		);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toHaveAttribute('id', 'test-timepicker-error');
	});

	it('uses ErrorText component for error', () => {
		renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" error="Error message" />
		);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toBeInTheDocument();
	});

	it('handles different error messages', () => {
		const { rerender } = renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" error="First error" />
		);

		expect(screen.getByText('First error')).toBeInTheDocument();

		rerender(<TimePickerMessages timePickerId="test-timepicker" error="Second error" />);

		expect(screen.getByText('Second error')).toBeInTheDocument();
		expect(screen.queryByText('First error')).not.toBeInTheDocument();
	});
});

describe('TimePickerMessages - Helper Text', () => {
	it('generates correct helper ID', () => {
		renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" helperText="Helper text" />
		);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toHaveAttribute('id', 'test-timepicker-helper');
	});

	it('uses HelperText component for helper text', () => {
		renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" helperText="Helper text" />
		);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toBeInTheDocument();
	});

	it('hides helper text when error is present', () => {
		renderWithProviders(
			<TimePickerMessages
				timePickerId="test-timepicker"
				error="Error message"
				helperText="Helper text"
			/>
		);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toHaveClass('sr-only');
	});

	it('shows helper text when no error', () => {
		renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" helperText="Helper text" />
		);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).not.toHaveClass('sr-only');
	});

	it('handles different helper text messages', () => {
		const { rerender } = renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" helperText="First helper" />
		);

		expect(screen.getByText('First helper')).toBeInTheDocument();

		rerender(<TimePickerMessages timePickerId="test-timepicker" helperText="Second helper" />);

		expect(screen.getByText('Second helper')).toBeInTheDocument();
		expect(screen.queryByText('First helper')).not.toBeInTheDocument();
	});
});

describe('TimePickerMessages - Accessibility', () => {
	it('associates error with input via ID', () => {
		renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" error="Error message" />
		);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toHaveAttribute('id', 'test-timepicker-error');
	});

	it('associates helper text with input via ID', () => {
		renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" helperText="Helper text" />
		);

		const helperElement = screen.getByText('Helper text');
		expect(helperElement).toHaveAttribute('id', 'test-timepicker-helper');
	});

	it('handles different timePicker IDs', () => {
		renderWithProviders(
			<TimePickerMessages timePickerId="custom-timepicker-id" error="Error message" />
		);

		const errorElement = screen.getByText('Error message');
		expect(errorElement).toHaveAttribute('id', 'custom-timepicker-id-error');
	});
});

describe('TimePickerMessages - Edge Cases', () => {
	it('handles empty string error', () => {
		const { container } = renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" error="" />
		);

		expect(container.firstChild).toBeNull();
	});

	it('handles empty string helperText', () => {
		const { container } = renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" helperText="" />
		);

		expect(container.firstChild).toBeNull();
	});

	it('handles both empty strings', () => {
		const { container } = renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" error="" helperText="" />
		);

		expect(container.firstChild).toBeNull();
	});

	it('handles long error messages', () => {
		const longError = 'This is a very long error message that should still be displayed correctly';
		renderWithProviders(<TimePickerMessages timePickerId="test-timepicker" error={longError} />);

		expect(screen.getByText(longError)).toBeInTheDocument();
	});

	it('handles long helper text', () => {
		const longHelper =
			'This is a very long helper text message that should still be displayed correctly';
		renderWithProviders(
			<TimePickerMessages timePickerId="test-timepicker" helperText={longHelper} />
		);

		expect(screen.getByText(longHelper)).toBeInTheDocument();
	});
});
