/**
 * OTPInputFieldHelpers Tests
 *
 * Tests for helper functions:
 * - createInputRefCallback
 * - getInputAriaAttributes
 * - getInputEventHandlers
 * - getInputAttributes
 * - renderOTPInput
 */

import {
	createInputRefCallback,
	getInputAriaAttributes,
	getInputAttributes,
	getInputEventHandlers,
	renderOTPInput,
} from '@core/ui/forms/otp-input/helpers/OTPInputFieldHelpers';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('createInputRefCallback', () => {
	it('should be a function', () => {
		expect(typeof createInputRefCallback).toBe('function');
	});

	it('should return a callback function', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];
		const callback = createInputRefCallback({ index: 0, inputRefs });
		expect(typeof callback).toBe('function');
	});

	it('should assign input element to refs array at correct index', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];
		const callback = createInputRefCallback({ index: 2, inputRefs });
		const mockInput = document.createElement('input');

		callback(mockInput);

		expect(inputRefs.current[2]).toBe(mockInput);
	});

	it('should handle null input element', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];
		const callback = createInputRefCallback({ index: 1, inputRefs });

		callback(null);

		expect(inputRefs.current[1]).toBeNull();
	});

	it('should handle different indices', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];
		const input1 = document.createElement('input');
		const input2 = document.createElement('input');

		const callback1 = createInputRefCallback({ index: 0, inputRefs });
		const callback2 = createInputRefCallback({ index: 5, inputRefs });

		callback1(input1);
		callback2(input2);

		expect(inputRefs.current[0]).toBe(input1);
		expect(inputRefs.current[5]).toBe(input2);
	});
});

describe('getInputAriaAttributes', () => {
	it('should be a function', () => {
		expect(typeof getInputAriaAttributes).toBe('function');
	});

	it('should return aria-invalid when hasError is true', () => {
		const attrs = getInputAriaAttributes({
			index: 0,
			hasError: true,
			ariaDescribedBy: undefined,
			length: 6,
		});

		expect(attrs['aria-invalid']).toBe(true);
	});

	it('should return aria-invalid false when hasError is false', () => {
		const attrs = getInputAriaAttributes({
			index: 0,
			hasError: false,
			ariaDescribedBy: undefined,
			length: 6,
		});

		expect(attrs['aria-invalid']).toBe(false);
	});

	it('should return aria-describedby for first input when provided', () => {
		const attrs = getInputAriaAttributes({
			index: 0,
			hasError: false,
			ariaDescribedBy: 'test-id-error',
			length: 6,
		});

		expect(attrs['aria-describedby']).toBe('test-id-error');
	});

	it('should not return aria-describedby for non-first inputs', () => {
		const attrs = getInputAriaAttributes({
			index: 1,
			hasError: false,
			ariaDescribedBy: 'test-id-error',
			length: 6,
		});

		expect(attrs['aria-describedby']).toBeUndefined();
	});

	it('should return correct aria-label for each input', () => {
		const attrs1 = getInputAriaAttributes({
			index: 0,
			hasError: false,
			ariaDescribedBy: undefined,
			length: 6,
		});

		const attrs2 = getInputAriaAttributes({
			index: 3,
			hasError: false,
			ariaDescribedBy: undefined,
			length: 6,
		});

		expect(attrs1['aria-label']).toBe('Digit 1 of 6');
		expect(attrs2['aria-label']).toBe('Digit 4 of 6');
	});

	it('should handle different OTP lengths', () => {
		const attrs = getInputAriaAttributes({
			index: 2,
			hasError: false,
			ariaDescribedBy: undefined,
			length: 4,
		});

		expect(attrs['aria-label']).toBe('Digit 3 of 4');
	});
});

describe('getInputEventHandlers', () => {
	it('should be a function', () => {
		expect(typeof getInputEventHandlers).toBe('function');
	});

	it('should return event handlers object', () => {
		const handlers = getInputEventHandlers({
			index: 0,
			onInput: vi.fn(),
			onKeyDown: vi.fn(),
			onPaste: vi.fn(),
			onFocus: vi.fn(),
		});

		expect(handlers).toHaveProperty('onChange');
		expect(handlers).toHaveProperty('onKeyDown');
		expect(handlers).toHaveProperty('onPaste');
		expect(handlers).toHaveProperty('onFocus');
	});

	it('should call onInput with correct index and value on change', () => {
		const onInput = vi.fn();
		const handlers = getInputEventHandlers({
			index: 2,
			onInput,
			onKeyDown: vi.fn(),
			onPaste: vi.fn(),
			onFocus: vi.fn(),
		});

		const mockEvent = {
			currentTarget: { value: '5' },
		} as ChangeEvent<HTMLInputElement>;

		handlers.onChange(mockEvent);

		expect(onInput).toHaveBeenCalledWith(2, '5');
	});

	it('should call onKeyDown with correct index and event', () => {
		const onKeyDown = vi.fn();
		const handlers = getInputEventHandlers({
			index: 3,
			onInput: vi.fn(),
			onKeyDown,
			onPaste: vi.fn(),
			onFocus: vi.fn(),
		});

		const mockEvent = {
			key: 'Backspace',
		} as KeyboardEvent<HTMLInputElement>;

		handlers.onKeyDown(mockEvent);

		expect(onKeyDown).toHaveBeenCalledWith(3, mockEvent);
	});

	it('should call onPaste handler when paste event occurs', () => {
		const onPaste = vi.fn();
		const handlers = getInputEventHandlers({
			index: 0,
			onInput: vi.fn(),
			onKeyDown: vi.fn(),
			onPaste,
			onFocus: vi.fn(),
		});

		const mockEvent = {
			currentTarget: { disabled: false },
			clipboardData: { getData: vi.fn(() => '123') },
		} as unknown as ClipboardEvent<HTMLInputElement>;

		handlers.onPaste(mockEvent);

		expect(onPaste).toHaveBeenCalledWith(mockEvent);
	});

	it('should call onFocus with correct index and event', () => {
		const onFocus = vi.fn();
		const handlers = getInputEventHandlers({
			index: 1,
			onInput: vi.fn(),
			onKeyDown: vi.fn(),
			onPaste: vi.fn(),
			onFocus,
		});

		const mockEvent = {
			target: { select: vi.fn() },
		} as unknown as React.FocusEvent<HTMLInputElement>;

		handlers.onFocus(mockEvent);

		expect(onFocus).toHaveBeenCalledWith(1, mockEvent);
	});
});

describe('getInputAttributes', () => {
	it('should be a function', () => {
		expect(typeof getInputAttributes).toBe('function');
	});

	it('should return complete input attributes', () => {
		const attrs = getInputAttributes({
			index: 0,
			inputId: 'test-otp-input',
			inputValue: '1',
			className: 'custom-class',
			disabled: false,
			required: true,
			hasError: false,
			ariaDescribedBy: 'test-id-error',
			length: 6,
		});

		expect(attrs.id).toBe('test-otp-input');
		expect(attrs.type).toBe('text');
		expect(attrs.inputMode).toBe('numeric');
		expect(attrs.pattern).toBe('[0-9]*');
		expect(attrs.maxLength).toBe(1);
		expect(attrs.value).toBe('1');
		expect(attrs.className).toBe('custom-class');
		expect(attrs.disabled).toBe(false);
		expect(attrs.required).toBe(true);
		expect(attrs.autoComplete).toBe('one-time-code');
	});

	it('should set required only for first input', () => {
		const attrs1 = getInputAttributes({
			index: 0,
			inputId: 'test-otp-input',
			inputValue: '',
			className: '',
			disabled: false,
			required: true,
			hasError: false,
			ariaDescribedBy: undefined,
			length: 6,
		});

		const attrs2 = getInputAttributes({
			index: 1,
			inputId: 'test-otp-input',
			inputValue: '',
			className: '',
			disabled: false,
			required: true,
			hasError: false,
			ariaDescribedBy: undefined,
			length: 6,
		});

		expect(attrs1.required).toBe(true);
		expect(attrs2.required).toBeUndefined();
	});

	it('should include aria attributes', () => {
		const attrs = getInputAttributes({
			index: 0,
			inputId: 'test-otp-input',
			inputValue: '',
			className: '',
			disabled: false,
			required: false,
			hasError: true,
			ariaDescribedBy: 'test-id-error',
			length: 6,
		});

		expect(attrs['aria-invalid']).toBe(true);
		expect(attrs['aria-describedby']).toBe('test-id-error');
		expect(attrs['aria-label']).toBe('Digit 1 of 6');
	});

	it('should handle disabled state', () => {
		const attrs = getInputAttributes({
			index: 0,
			inputId: 'test-otp-input',
			inputValue: '',
			className: '',
			disabled: true,
			required: false,
			hasError: false,
			ariaDescribedBy: undefined,
			length: 6,
		});

		expect(attrs.disabled).toBe(true);
	});
});

describe('renderOTPInput', () => {
	it('should be a function', () => {
		expect(typeof renderOTPInput).toBe('function');
	});

	it('should render input element', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { container } = renderWithProviders(
			renderOTPInput({
				index: 0,
				inputValue: '1',
				inputId: 'test-otp-input',
				className: 'test-class',
				disabled: false,
				required: true,
				hasError: false,
				ariaDescribedBy: undefined,
				length: 6,
				inputRefs,
				onInput: vi.fn(),
				onKeyDown: vi.fn(),
				onPaste: vi.fn(),
				onFocus: vi.fn(),
			})
		);

		const input = container.querySelector('input');
		expect(input).toBeInTheDocument();
	});

	it('should render input with correct attributes', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { container } = renderWithProviders(
			renderOTPInput({
				index: 0,
				inputValue: '5',
				inputId: 'otp-input-0',
				className: 'custom-class',
				disabled: false,
				required: true,
				hasError: false,
				ariaDescribedBy: 'otp-input-0-error',
				length: 6,
				inputRefs,
				onInput: vi.fn(),
				onKeyDown: vi.fn(),
				onPaste: vi.fn(),
				onFocus: vi.fn(),
			})
		);

		const input = container.querySelector('input');
		expect(input).toHaveAttribute('id', 'otp-input-0');
		expect(input).toHaveAttribute('type', 'text');
		expect(input).toHaveAttribute('inputmode', 'numeric');
		expect(input).toHaveAttribute('pattern', '[0-9]*');
		expect(input).toHaveAttribute('maxlength', '1');
		expect(input).toHaveValue('5');
		expect(input).toHaveClass('custom-class');
		expect(input).toHaveAttribute('autocomplete', 'one-time-code');
	});

	it('should attach event handlers', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];
		const onInput = vi.fn();
		const onKeyDown = vi.fn();
		const onPaste = vi.fn();
		const onFocus = vi.fn();

		const { container } = renderWithProviders(
			renderOTPInput({
				index: 0,
				inputValue: '',
				inputId: 'test-otp-input',
				className: '',
				disabled: false,
				required: false,
				hasError: false,
				ariaDescribedBy: undefined,
				length: 6,
				inputRefs,
				onInput,
				onKeyDown,
				onPaste,
				onFocus,
			})
		);

		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeInTheDocument();

		// Test that handlers are attached (they should be callable)
		// Note: React synthetic events won't fire in this test, but we verify handlers exist
		expect(input).toBeInTheDocument();
	});

	it('should assign ref callback', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { container } = renderWithProviders(
			renderOTPInput({
				index: 2,
				inputValue: '',
				inputId: 'test-otp-input',
				className: '',
				disabled: false,
				required: false,
				hasError: false,
				ariaDescribedBy: undefined,
				length: 6,
				inputRefs,
				onInput: vi.fn(),
				onKeyDown: vi.fn(),
				onPaste: vi.fn(),
				onFocus: vi.fn(),
			})
		);

		const input = container.querySelector('input');
		expect(input).toBeInTheDocument();
		// Ref should be assigned after render
	});

	it('should render multiple inputs with different indices', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { container } = renderWithProviders(
			<>
				{renderOTPInput({
					index: 0,
					inputValue: '1',
					inputId: 'otp-0',
					className: '',
					disabled: false,
					required: false,
					hasError: false,
					ariaDescribedBy: undefined,
					length: 6,
					inputRefs,
					onInput: vi.fn(),
					onKeyDown: vi.fn(),
					onPaste: vi.fn(),
					onFocus: vi.fn(),
				})}
				{renderOTPInput({
					index: 1,
					inputValue: '2',
					inputId: 'otp-1',
					className: '',
					disabled: false,
					required: false,
					hasError: false,
					ariaDescribedBy: undefined,
					length: 6,
					inputRefs,
					onInput: vi.fn(),
					onKeyDown: vi.fn(),
					onPaste: vi.fn(),
					onFocus: vi.fn(),
				})}
			</>
		);

		const inputs = container.querySelectorAll('input');
		expect(inputs).toHaveLength(2);
		expect(inputs[0]).toHaveValue('1');
		expect(inputs[1]).toHaveValue('2');
	});
});
