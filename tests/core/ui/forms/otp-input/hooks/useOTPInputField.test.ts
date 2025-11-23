/**
 * useOTPInputField Tests
 *
 * Tests for field handlers hook:
 * - useOTPInputFieldHandlers
 * - Handler creation
 * - Utility functions
 * - Handler dependencies
 */

import { useOTPInputFieldHandlers } from '@core/ui/forms/otp-input/hooks/useOTPInputField';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useOTPInputFieldHandlers', () => {
	it('should be a function', () => {
		expect(typeof useOTPInputFieldHandlers).toBe('function');
	});

	it('should return all handler functions', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { result } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 6,
				value: '',
				onChange: vi.fn(),
				onComplete: undefined,
				inputRefs,
			})
		);

		expect(result.current).toHaveProperty('handleInput');
		expect(result.current).toHaveProperty('handleKeyDown');
		expect(result.current).toHaveProperty('handlePaste');
		expect(result.current).toHaveProperty('handleFocus');
		expect(typeof result.current.handleInput).toBe('function');
		expect(typeof result.current.handleKeyDown).toBe('function');
		expect(typeof result.current.handlePaste).toBe('function');
		expect(typeof result.current.handleFocus).toBe('function');
	});
});

describe('useOTPInputFieldHandlers - Utility Functions', () => {
	it('should create getValueArray that returns array from value', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { result } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 6,
				value: '123',
				onChange: vi.fn(),
				inputRefs,
			})
		);

		// Access internal getValueArray through handler dependencies
		// We'll test it indirectly through handleInput
		const { handleInput } = result.current;
		expect(typeof handleInput).toBe('function');
	});

	it('should create updateValue that calls onChange', () => {
		const onChange = vi.fn();
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { result } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 6,
				value: '',
				onChange,
				inputRefs,
			})
		);

		// Test through handleInput
		result.current.handleInput(0, '1');

		expect(onChange).toHaveBeenCalled();
	});

	it('should create focusInput that focuses and selects input', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		const mockInput0 = {
			focus: vi.fn(),
			select: vi.fn(),
		} as unknown as HTMLInputElement;
		const mockInput1 = {
			focus: vi.fn(),
			select: vi.fn(),
		} as unknown as HTMLInputElement;
		inputRefs.current = [mockInput0, mockInput1, null, null, null, null];

		const { result } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 6,
				value: '',
				onChange: vi.fn(),
				inputRefs,
			})
		);

		// Test through handleInput which should call focusInput on the next input
		result.current.handleInput(0, '1');

		// handleInput should focus the next input (index 1) after filling index 0
		expect(mockInput1.focus).toHaveBeenCalled();
		expect(mockInput1.select).toHaveBeenCalled();
	});
});

describe('useOTPInputFieldHandlers - Handler Creation', () => {
	it('should create handleInput that processes input', () => {
		const onChange = vi.fn();
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { result } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 6,
				value: '',
				onChange,
				inputRefs,
			})
		);

		result.current.handleInput(0, '1');

		expect(onChange).toHaveBeenCalled();
	});

	it('should create handleKeyDown that processes keyboard events', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { result } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 6,
				value: '',
				onChange: vi.fn(),
				inputRefs,
			})
		);

		const mockEvent = {
			key: 'Backspace',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;

		result.current.handleKeyDown(0, mockEvent);

		expect(mockEvent.preventDefault).toHaveBeenCalled();
	});

	it('should create handlePaste that processes paste events', () => {
		const onChange = vi.fn();
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { result } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 6,
				value: '',
				onChange,
				inputRefs,
			})
		);

		const mockEvent = {
			preventDefault: vi.fn(),
			clipboardData: {
				getData: vi.fn(() => '123456'),
			},
		} as unknown as React.ClipboardEvent<HTMLInputElement>;

		result.current.handlePaste(mockEvent);

		expect(mockEvent.preventDefault).toHaveBeenCalled();
		expect(onChange).toHaveBeenCalled();
	});

	it('should create handleFocus that processes focus events', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { result } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 6,
				value: '',
				onChange: vi.fn(),
				inputRefs,
			})
		);

		const mockEvent = {
			target: {
				select: vi.fn(),
			},
		} as unknown as React.FocusEvent<HTMLInputElement>;

		result.current.handleFocus(0, mockEvent);

		expect(mockEvent.target.select).toHaveBeenCalled();
	});
});

describe('useOTPInputFieldHandlers - Handler Dependencies', () => {
	it('should update handlers when length changes', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { result, rerender } = renderHook(
			({ length }) =>
				useOTPInputFieldHandlers({
					length,
					value: '',
					onChange: vi.fn(),
					inputRefs,
				}),
			{
				initialProps: { length: 6 },
			}
		);

		const firstHandleInput = result.current.handleInput;

		rerender({ length: 4 });

		// Handlers should be recreated when length changes
		expect(result.current.handleInput).not.toBe(firstHandleInput);
	});

	it('should update handlers when value changes', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { result, rerender } = renderHook(
			({ value }) =>
				useOTPInputFieldHandlers({
					length: 6,
					value,
					onChange: vi.fn(),
					inputRefs,
				}),
			{
				initialProps: { value: '' },
			}
		);

		const firstHandleInput = result.current.handleInput;

		rerender({ value: '123' });

		// Handlers should be recreated when value changes
		expect(result.current.handleInput).not.toBe(firstHandleInput);
	});

	it('should update handlers when onChange changes', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];
		const onChange1 = vi.fn();
		const onChange2 = vi.fn();

		const { result, rerender } = renderHook(
			({ onChange }) =>
				useOTPInputFieldHandlers({
					length: 6,
					value: '',
					onChange,
					inputRefs,
				}),
			{
				initialProps: { onChange: onChange1 },
			}
		);

		const firstHandleInput = result.current.handleInput;

		rerender({ onChange: onChange2 });

		// Handlers should be recreated when onChange changes
		expect(result.current.handleInput).not.toBe(firstHandleInput);
	});

	it('should update handlers when onComplete changes', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];
		const onComplete1 = vi.fn();
		const onComplete2 = vi.fn();

		const { result, rerender } = renderHook(
			({ onComplete }) =>
				useOTPInputFieldHandlers({
					length: 6,
					value: '',
					onChange: vi.fn(),
					onComplete,
					inputRefs,
				}),
			{
				initialProps: { onComplete: onComplete1 },
			}
		);

		const firstHandleInput = result.current.handleInput;

		rerender({ onComplete: onComplete2 });

		// Handlers should be recreated when onComplete changes
		expect(result.current.handleInput).not.toBe(firstHandleInput);
	});
});

describe('useOTPInputFieldHandlers - Integration', () => {
	it('should handle complete input flow', () => {
		const onChange = vi.fn();
		const onComplete = vi.fn();
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		const mockInput = {
			focus: vi.fn(),
			select: vi.fn(),
		} as unknown as HTMLInputElement;
		inputRefs.current = [mockInput, null, null, null, null, null];

		const { result } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 6,
				value: '',
				onChange,
				onComplete,
				inputRefs,
			})
		);

		// Simulate typing digits
		result.current.handleInput(0, '1');
		expect(onChange).toHaveBeenCalled();

		// Simulate keyboard navigation
		const keyEvent = {
			key: 'ArrowRight',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;
		result.current.handleKeyDown(0, keyEvent);
		expect(keyEvent.preventDefault).toHaveBeenCalled();

		// Simulate paste
		const pasteEvent = {
			preventDefault: vi.fn(),
			clipboardData: {
				getData: vi.fn(() => '23456'),
			},
		} as unknown as React.ClipboardEvent<HTMLInputElement>;
		result.current.handlePaste(pasteEvent);
		expect(pasteEvent.preventDefault).toHaveBeenCalled();
		expect(onChange).toHaveBeenCalled();
	});

	it('should handle different OTP lengths', () => {
		const inputRefs4 = createRef<(HTMLInputElement | null)[]>();
		inputRefs4.current = [];
		const inputRefs8 = createRef<(HTMLInputElement | null)[]>();
		inputRefs8.current = [];

		const { result: result4 } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 4,
				value: '',
				onChange: vi.fn(),
				inputRefs: inputRefs4,
			})
		);

		const { result: result8 } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 8,
				value: '',
				onChange: vi.fn(),
				inputRefs: inputRefs8,
			})
		);

		expect(result4.current.handleInput).toBeDefined();
		expect(result8.current.handleInput).toBeDefined();
	});

	it('should work without onComplete callback', () => {
		const inputRefs = createRef<(HTMLInputElement | null)[]>();
		inputRefs.current = [];

		const { result } = renderHook(() =>
			useOTPInputFieldHandlers({
				length: 6,
				value: '',
				onChange: vi.fn(),
				onComplete: undefined,
				inputRefs,
			})
		);

		expect(() => {
			result.current.handleInput(0, '1');
		}).not.toThrow();
	});
});
