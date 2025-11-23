/**
 * TimePickerContent Component Tests
 *
 * Tests for the TimePickerContent component including:
 * - Rendering
 * - Label display
 * - Error and helper text
 * - Full width option
 * - Props forwarding
 */

import { TimePickerContent } from '@core/ui/forms/time-picker/components/TimePickerContent';
import type {
	TimePickerContentProps,
	TimePickerInputProps,
} from '@core/ui/forms/time-picker/types/TimePickerTypes';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const createMockContentProps = (
	overrides?: Partial<TimePickerContentProps>
): TimePickerContentProps => ({
	timePickerId: 'test-timepicker',
	timePickerClasses: 'test-classes',
	ariaDescribedBy: undefined,
	label: 'Select Time',
	error: undefined,
	helperText: undefined,
	required: false,
	fullWidth: false,
	disabled: false,
	fieldProps: {},
	...overrides,
});

describe('TimePickerContent - Rendering', () => {
	it('renders time picker field', () => {
		const props = createMockContentProps();
		renderWithProviders(<TimePickerContent {...props} />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'time');
	});

	it('renders with label', () => {
		const props = createMockContentProps({ label: 'Start Time' });
		renderWithProviders(<TimePickerContent {...props} />);
		expect(screen.getByLabelText('Start Time')).toBeInTheDocument();
	});

	it('renders without label when label is not provided', () => {
		const props = createMockContentProps({ label: undefined, timePickerId: undefined });
		const { container } = renderWithProviders(<TimePickerContent {...props} />);
		const input = container.querySelector('input[type="time"]');
		expect(input).toBeInTheDocument();
		expect(screen.queryByText('Select Time')).not.toBeInTheDocument();
	});

	it('renders with helper text', () => {
		const props = createMockContentProps({ helperText: 'Select a time' });
		renderWithProviders(<TimePickerContent {...props} />);
		expect(screen.getByText('Select a time')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		const props = createMockContentProps({ error: 'Time is required' });
		renderWithProviders(<TimePickerContent {...props} />);
		expect(screen.getByText('Time is required')).toBeInTheDocument();
	});

	it('renders both error and helper text when both are provided', () => {
		const props = createMockContentProps({
			error: 'Invalid time',
			helperText: 'Select a time between 9 AM and 5 PM',
		});
		renderWithProviders(<TimePickerContent {...props} />);
		expect(screen.getByText('Invalid time')).toBeInTheDocument();
		expect(screen.getByText('Select a time between 9 AM and 5 PM')).toBeInTheDocument();
	});
});

describe('TimePickerContent - Full Width', () => {
	it('applies fullWidth when fullWidth is true', () => {
		const props = createMockContentProps({ fullWidth: true });
		const { container } = renderWithProviders(<TimePickerContent {...props} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toBeInTheDocument();
	});

	it('does not apply fullWidth when fullWidth is false', () => {
		const props = createMockContentProps({ fullWidth: false });
		const { container } = renderWithProviders(<TimePickerContent {...props} />);
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toBeInTheDocument();
	});
});

describe('TimePickerContent - Messages', () => {
	it('renders messages when timePickerId is provided', () => {
		const props = createMockContentProps({
			timePickerId: 'test-id',
			error: 'Error message',
		});
		renderWithProviders(<TimePickerContent {...props} />);
		expect(screen.getByText('Error message')).toBeInTheDocument();
	});

	it('does not render messages when timePickerId is not provided', () => {
		const props = createMockContentProps({
			timePickerId: undefined,
			error: 'Error message',
		});
		renderWithProviders(<TimePickerContent {...props} />);
		expect(screen.queryByText('Error message')).not.toBeInTheDocument();
	});
});

describe('TimePickerContent - Props Forwarding', () => {
	it('forwards fieldProps to input', () => {
		const props = createMockContentProps({
			fieldProps: {
				placeholder: 'HH:MM',
			} as TimePickerInputProps,
		});
		renderWithProviders(<TimePickerContent {...props} />);
		const input = document.querySelector('#test-timepicker') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('placeholder', 'HH:MM');
	});

	it('forwards required prop', () => {
		const props = createMockContentProps({ required: true });
		renderWithProviders(<TimePickerContent {...props} />);
		const input = document.querySelector('#test-timepicker') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('required');
	});

	it('forwards disabled prop', () => {
		const props = createMockContentProps({ disabled: true });
		renderWithProviders(<TimePickerContent {...props} />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toBeDisabled();
	});
});

describe('TimePickerContent - ARIA Attributes', () => {
	it('applies aria-describedby when provided', () => {
		const props = createMockContentProps({
			ariaDescribedBy: 'error-id helper-id',
		});
		renderWithProviders(<TimePickerContent {...props} />);
		const input = screen.getByLabelText('Select Time');
		expect(input).toHaveAttribute('aria-describedby', 'error-id helper-id');
	});

	it('does not apply aria-describedby when not provided', () => {
		const props = createMockContentProps({ ariaDescribedBy: undefined });
		renderWithProviders(<TimePickerContent {...props} />);
		const input = screen.getByLabelText('Select Time');
		const describedBy = input.getAttribute('aria-describedby');
		expect(describedBy).toBeNull();
	});
});
