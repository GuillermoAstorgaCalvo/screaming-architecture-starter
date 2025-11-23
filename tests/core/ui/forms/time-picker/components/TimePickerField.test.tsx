/**
 * TimePickerField Component Tests
 *
 * Tests for the TimePickerField component including:
 * - Rendering
 * - Props forwarding
 * - ARIA attributes
 * - Disabled and required states
 */

import { TimePickerField } from '@core/ui/forms/time-picker/components/TimePickerField';
import type { TimePickerFieldProps } from '@core/ui/forms/time-picker/types/TimePickerTypes';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createMockFieldProps = (overrides?: Partial<TimePickerFieldProps>): TimePickerFieldProps => ({
	id: 'test-field',
	timePickerClasses: 'test-classes',
	ariaDescribedBy: undefined,
	disabled: false,
	required: false,
	props: {},
	...overrides,
});

describe('TimePickerField - Rendering', () => {
	it('renders time input element', () => {
		const props = createMockFieldProps();
		const { container } = renderWithProviders(<TimePickerField {...props} />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'time');
	});

	it('applies id attribute', () => {
		const props = createMockFieldProps({ id: 'custom-field-id' });
		const { container } = renderWithProviders(<TimePickerField {...props} />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		expect(input).toHaveAttribute('id', 'custom-field-id');
	});

	it('applies timePickerClasses', () => {
		const props = createMockFieldProps({ timePickerClasses: 'custom-class another-class' });
		const { container } = renderWithProviders(<TimePickerField {...props} />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		expect(input).toHaveClass('custom-class', 'another-class');
	});
});

describe('TimePickerField - Props Forwarding', () => {
	it('forwards props from fieldProps to input', () => {
		const props = createMockFieldProps({
			props: {
				'data-testid': 'custom-input',
				placeholder: 'HH:MM',
				value: '14:30',
			} as any,
		});
		renderWithProviders(<TimePickerField {...props} />);
		const input = screen.getByTestId('custom-input');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('placeholder', 'HH:MM');
		expect(input).toHaveValue('14:30');
	});

	it('forwards onChange handler', () => {
		const handleChange = vi.fn();
		const props = createMockFieldProps({
			props: {
				onChange: handleChange,
			},
		});
		const { container } = renderWithProviders(<TimePickerField {...props} />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		fireEvent.change(input, { target: { value: '15:00' } });
		expect(handleChange).toHaveBeenCalled();
	});
});

describe('TimePickerField - ARIA Attributes', () => {
	it('applies aria-describedby when provided', () => {
		const props = createMockFieldProps({ ariaDescribedBy: 'error-id helper-id' });
		const { container } = renderWithProviders(<TimePickerField {...props} />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		expect(input).toHaveAttribute('aria-describedby', 'error-id helper-id');
	});

	it('does not apply aria-describedby when not provided', () => {
		const props = createMockFieldProps({ ariaDescribedBy: undefined });
		const { container } = renderWithProviders(<TimePickerField {...props} />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		const describedBy = input.getAttribute('aria-describedby');
		expect(describedBy).toBeNull();
	});
});

describe('TimePickerField - Disabled State', () => {
	it('renders disabled input when disabled is true', () => {
		const props = createMockFieldProps({ disabled: true });
		const { container } = renderWithProviders(<TimePickerField {...props} />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('disabled');
	});

	it('renders enabled input when disabled is false', () => {
		const props = createMockFieldProps({ disabled: false });
		const { container } = renderWithProviders(<TimePickerField {...props} />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		expect(input).not.toBeDisabled();
	});
});

describe('TimePickerField - Required State', () => {
	it('renders required input when required is true', () => {
		const props = createMockFieldProps({ required: true });
		const { container } = renderWithProviders(<TimePickerField {...props} />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		expect(input).toHaveAttribute('required');
	});

	it('renders non-required input when required is false', () => {
		const props = createMockFieldProps({ required: false });
		const { container } = renderWithProviders(<TimePickerField {...props} />);
		const input = container.querySelector('input[type="time"]') as HTMLInputElement;
		expect(input).not.toHaveAttribute('required');
	});
});
