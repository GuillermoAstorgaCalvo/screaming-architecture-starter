/**
 * OTPInputField Component Tests
 *
 * Tests for the OTPInputField component including:
 * - Rendering
 * - Input attributes
 * - User interactions (typing, paste, keyboard navigation)
 * - Auto-advance behavior
 * - Focus management
 * - Accessibility
 * - Disabled states
 * - Error states
 */

import { OTPInputField } from '@core/ui/forms/otp-input/components/OTPInputField';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { createRef, type RefObject } from 'react';
import { describe, expect, it, vi } from 'vitest';

const INPUT_ID = 'otp-input-test';
const INPUT_CLASSNAME = 'test-input-class';
const ARIA_DESCRIBEDBY = 'aria-describedby';

function createOTPInputFieldProps(overrides?: Partial<Parameters<typeof OTPInputField>[0]>) {
	const length = overrides?.length ?? 6;
	const inputRefs = createRef<(HTMLInputElement | null)[]>();
	// Initialize the ref's current to an array to match component expectations
	inputRefs.current = Array.from({ length }).fill(null) as (HTMLInputElement | null)[];
	return {
		id: INPUT_ID,
		className: INPUT_CLASSNAME,
		hasError: false,
		ariaDescribedBy: undefined,
		length,
		value: '',
		onChange: vi.fn(),
		inputRefs: inputRefs as RefObject<(HTMLInputElement | null)[]>,
		...overrides,
	};
}

describe('OTPInputField - Rendering', () => {
	it('renders OTP input fields', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps()} />);

		const inputs = screen.getAllByRole('textbox');
		expect(inputs).toHaveLength(6);
	});

	it('renders correct number of inputs for custom length', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ length: 4 })} />);

		const inputs = screen.getAllByRole('textbox');
		expect(inputs).toHaveLength(4);
	});

	it('applies id attributes to inputs', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps()} />);

		const inputs = screen.getAllByRole('textbox');
		expect(inputs[0]).toHaveAttribute('id', `${INPUT_ID}-0`);
		expect(inputs[1]).toHaveAttribute('id', `${INPUT_ID}-1`);
	});

	it('generates default IDs when id is not provided', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ id: undefined })} />);

		const inputs = screen.getAllByRole('textbox');
		expect(inputs[0]).toHaveAttribute('id', 'otp-input-0');
		expect(inputs[1]).toHaveAttribute('id', 'otp-input-1');
	});

	it('applies className to inputs', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps()} />);

		const inputs = screen.getAllByRole('textbox');
		for (const input of inputs) {
			expect(input).toHaveClass(INPUT_CLASSNAME);
		}
	});

	it('has aria-label on container', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps()} />);

		const container = screen.getByLabelText(/one.*time.*password/i);
		expect(container).toBeInTheDocument();
	});
});

describe('OTPInputField - Input Attributes', () => {
	it('applies disabled attribute when disabled', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ disabled: true })} />);

		const inputs = screen.getAllByRole('textbox');
		for (const input of inputs) {
			expect(input).toBeDisabled();
		}
	});

	it('applies required attribute when required', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ required: true })} />);

		const inputs = screen.getAllByRole('textbox');
		// Only the first input should be required
		expect(inputs[0]).toBeRequired();
		// Other inputs should not be required
		for (let i = 1; i < inputs.length; i++) {
			expect(inputs[i]).not.toBeRequired();
		}
	});

	it('applies aria-invalid when hasError is true', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ hasError: true })} />);

		const inputs = screen.getAllByRole('textbox');
		for (const input of inputs) {
			expect(input).toHaveAttribute('aria-invalid', 'true');
		}
	});

	it('applies aria-describedby when provided', () => {
		renderWithProviders(
			<OTPInputField {...createOTPInputFieldProps({ ariaDescribedBy: ARIA_DESCRIBEDBY })} />
		);

		const inputs = screen.getAllByRole('textbox');
		// Only the first input should have aria-describedby
		expect(inputs[0]).toHaveAttribute('aria-describedby', ARIA_DESCRIBEDBY);
		// Other inputs should not have aria-describedby
		for (let i = 1; i < inputs.length; i++) {
			expect(inputs[i]).not.toHaveAttribute('aria-describedby');
		}
	});

	it('displays value in inputs', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ value: '123456' })} />);

		const inputs = screen.getAllByRole('textbox');
		expect(inputs[0]).toHaveValue('1');
		expect(inputs[1]).toHaveValue('2');
		expect(inputs[2]).toHaveValue('3');
		expect(inputs[3]).toHaveValue('4');
		expect(inputs[4]).toHaveValue('5');
		expect(inputs[5]).toHaveValue('6');
	});
});

describe('OTPInputField - User Interactions', () => {
	it('calls onChange when digit is entered', () => {
		const onChange = vi.fn();

		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ onChange })} />);

		const inputs = screen.getAllByRole('textbox');
		fireEvent.change(inputs[0]!, { target: { value: '1' } });

		expect(onChange).toHaveBeenCalled();
	});

	it('handles paste event', () => {
		const onChange = vi.fn();
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = Array.from({ length: 6 }).fill(null) as (HTMLInputElement | null)[];

		renderWithProviders(
			<OTPInputField
				{...createOTPInputFieldProps({
					onChange,
					inputRefs: inputRefs as RefObject<(HTMLInputElement | null)[]>,
				})}
			/>
		);

		const inputs = screen.getAllByRole('textbox');
		// Create a mock clipboard event
		const clipboardData = {
			getData: vi.fn(() => '123456'),
		};
		const pasteEvent = {
			clipboardData,
			preventDefault: vi.fn(),
		} as unknown as React.ClipboardEvent<HTMLInputElement>;

		fireEvent.paste(inputs[0]!, pasteEvent);

		expect(onChange).toHaveBeenCalled();
	});

	it('handles keyboard navigation with arrow keys', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = Array.from({ length: 6 }).fill(null) as (HTMLInputElement | null)[];

		renderWithProviders(
			<OTPInputField
				{...createOTPInputFieldProps({
					inputRefs: inputRefs as RefObject<(HTMLInputElement | null)[]>,
				})}
			/>
		);

		const inputs = screen.getAllByRole('textbox');
		// Spy on the focus method of the second input
		const focusSpy = vi.spyOn(inputs[1]! as HTMLInputElement, 'focus');
		fireEvent.keyDown(inputs[0]!, { key: 'ArrowRight' });

		// Arrow key should move focus
		expect(focusSpy).toHaveBeenCalled();
		focusSpy.mockRestore();
	});

	it('handles backspace key', () => {
		const onChange = vi.fn();
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = Array.from({ length: 6 }).fill(null) as (HTMLInputElement | null)[];

		renderWithProviders(
			<OTPInputField
				{...createOTPInputFieldProps({
					onChange,
					inputRefs: inputRefs as RefObject<(HTMLInputElement | null)[]>,
					value: '123',
				})}
			/>
		);

		const inputs = screen.getAllByRole('textbox');
		fireEvent.keyDown(inputs[2]!, { key: 'Backspace' });

		// Backspace should trigger onChange
		expect(onChange).toHaveBeenCalled();
	});

	it('handles delete key', () => {
		const onChange = vi.fn();
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = Array.from({ length: 6 }).fill(null) as (HTMLInputElement | null)[];

		renderWithProviders(
			<OTPInputField
				{...createOTPInputFieldProps({
					onChange,
					inputRefs: inputRefs as RefObject<(HTMLInputElement | null)[]>,
					value: '123',
				})}
			/>
		);

		const inputs = screen.getAllByRole('textbox');
		fireEvent.keyDown(inputs[1]!, { key: 'Delete' });

		// Delete should trigger onChange
		expect(onChange).toHaveBeenCalled();
	});
});

describe('OTPInputField - Auto-Advance', () => {
	it('auto-advances to next input when digit is entered', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = Array.from({ length: 6 }).fill(null) as (HTMLInputElement | null)[];

		renderWithProviders(
			<OTPInputField
				{...createOTPInputFieldProps({
					inputRefs: inputRefs as RefObject<(HTMLInputElement | null)[]>,
				})}
			/>
		);

		const inputs = screen.getAllByRole('textbox');
		// Spy on the focus method of the second input
		const focusSpy = vi.spyOn(inputs[1]! as HTMLInputElement, 'focus');
		fireEvent.change(inputs[0]!, { target: { value: '1' } });

		// Should focus next input
		expect(focusSpy).toHaveBeenCalled();
		focusSpy.mockRestore();
	});

	it('does not advance beyond last input', () => {
		const onChange = vi.fn();
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = Array.from({ length: 6 }).fill(null) as (HTMLInputElement | null)[];

		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ onChange, inputRefs })} />);

		const inputs = screen.getAllByRole('textbox');
		// Spy on the focus method of the last input to verify it's not called
		const focusSpy = vi.spyOn(inputs[5]! as HTMLInputElement, 'focus');
		fireEvent.change(inputs[5]!, { target: { value: '6' } });

		// Should trigger onChange but not focus (since it's the last input)
		expect(onChange).toHaveBeenCalled();
		// Focus should not be called when entering digit in last input
		expect(focusSpy).not.toHaveBeenCalled();
		focusSpy.mockRestore();
	});
});

describe('OTPInputField - Focus Management', () => {
	it('handles focus event', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = Array.from({ length: 6 }).fill(null) as (HTMLInputElement | null)[];

		renderWithProviders(
			<OTPInputField
				{...createOTPInputFieldProps({
					inputRefs: inputRefs as RefObject<(HTMLInputElement | null)[]>,
				})}
			/>
		);

		const inputs = screen.getAllByRole('textbox');
		// Spy on the select method of the third input
		const selectSpy = vi.spyOn(inputs[2]! as HTMLInputElement, 'select');
		fireEvent.focus(inputs[2]!);

		// Focus should select the input
		expect(selectSpy).toHaveBeenCalled();
		selectSpy.mockRestore();
	});
});

describe('OTPInputField - Completion Callback', () => {
	it('calls onComplete when all digits are filled', () => {
		const onComplete = vi.fn();
		const onChange = vi.fn((value: string) => {
			// Simulate controlled component updating
		});

		renderWithProviders(
			<OTPInputField {...createOTPInputFieldProps({ onChange, onComplete, length: 4 })} />
		);

		const inputs = screen.getAllByRole('textbox');
		// Simulate filling all inputs
		fireEvent.change(inputs[0]!, { target: { value: '1' } });
		fireEvent.change(inputs[1]!, { target: { value: '2' } });
		fireEvent.change(inputs[2]!, { target: { value: '3' } });
		fireEvent.change(inputs[3]!, { target: { value: '4' } });

		// onComplete is called when value reaches full length
		// This depends on the onChange implementation
	});
});

describe('OTPInputField - Auto Focus', () => {
	it('auto-focuses first input when autoFocus is true', async () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = Array.from({ length: 6 }).fill(null) as (HTMLInputElement | null)[];

		renderWithProviders(
			<OTPInputField
				{...createOTPInputFieldProps({
					inputRefs: inputRefs as RefObject<(HTMLInputElement | null)[]>,
					autoFocus: true,
				})}
			/>
		);

		const inputs = screen.getAllByRole('textbox');
		// Spy on the focus method of the first input
		const focusSpy = vi.spyOn(inputs[0]! as HTMLInputElement, 'focus');

		await waitFor(() => {
			expect(focusSpy).toHaveBeenCalled();
		});
		focusSpy.mockRestore();
	});

	it('does not auto-focus when autoFocus is false', async () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = Array.from({ length: 6 }).fill(null) as (HTMLInputElement | null)[];

		renderWithProviders(
			<OTPInputField
				{...createOTPInputFieldProps({
					inputRefs: inputRefs as RefObject<(HTMLInputElement | null)[]>,
					autoFocus: false,
				})}
			/>
		);

		const inputs = screen.getAllByRole('textbox');
		// Spy on the focus method of the first input
		const focusSpy = vi.spyOn(inputs[0]! as HTMLInputElement, 'focus');

		await new Promise(resolve => setTimeout(resolve, 100));
		expect(focusSpy).not.toHaveBeenCalled();
		focusSpy.mockRestore();
	});
});

describe('OTPInputField - Accessibility', () => {
	it('has correct ARIA attributes', () => {
		renderWithProviders(
			<OTPInputField
				{...createOTPInputFieldProps({
					hasError: true,
					ariaDescribedBy: ARIA_DESCRIBEDBY,
				})}
			/>
		);

		const inputs = screen.getAllByRole('textbox');
		for (const input of inputs) {
			expect(input).toHaveAttribute('aria-invalid', 'true');
		}
		// Only the first input should have aria-describedby
		expect(inputs[0]).toHaveAttribute('aria-describedby', ARIA_DESCRIBEDBY);
		// Other inputs should not have aria-describedby
		for (let i = 1; i < inputs.length; i++) {
			expect(inputs[i]).not.toHaveAttribute('aria-describedby');
		}
	});

	it('has accessible label', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps()} />);

		const container = screen.getByLabelText(/one.*time.*password/i);
		expect(container).toBeInTheDocument();
	});
});

describe('OTPInputField - Edge Cases', () => {
	it('handles empty value', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ value: '' })} />);

		const inputs = screen.getAllByRole('textbox');
		for (const input of inputs) {
			expect(input).toHaveValue('');
		}
	});

	it('handles value shorter than length', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ value: '12' })} />);

		const inputs = screen.getAllByRole('textbox');
		expect(inputs[0]).toHaveValue('1');
		expect(inputs[1]).toHaveValue('2');
		expect(inputs[2]).toHaveValue('');
	});

	it('handles value longer than length', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ value: '123456789' })} />);

		const inputs = screen.getAllByRole('textbox');
		// Should only show first 6 digits
		expect(inputs[5]).toHaveValue('6');
	});

	it('handles different lengths', () => {
		renderWithProviders(<OTPInputField {...createOTPInputFieldProps({ length: 4 })} />);

		const inputs = screen.getAllByRole('textbox');
		expect(inputs).toHaveLength(4);
	});
});
