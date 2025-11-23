/**
 * OTPInputFieldHandlers.keyboard Tests
 *
 * Tests for keyboard handler creation:
 * - createKeyboardHandlers
 * - Backspace handling
 * - Arrow key navigation
 * - Delete key handling
 * - Vertical arrow prevention
 */

import { createKeyboardHandlers } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.keyboard';
import type { HandlerDependencies } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.types';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

function createMockDependencies(overrides?: Partial<HandlerDependencies>): HandlerDependencies {
	return {
		length: 6,
		onComplete: undefined,
		getValueArray: () => Array.from({ length: 6 }).fill('') as string[],
		updateValue: vi.fn(),
		focusInput: vi.fn(),
		...overrides,
	};
}

function createMockKeyboardEvent(key: string): KeyboardEvent<HTMLInputElement> {
	return {
		key,
		preventDefault: vi.fn(),
	} as unknown as KeyboardEvent<HTMLInputElement>;
}

describe('createKeyboardHandlers', () => {
	it('should be a function', () => {
		expect(typeof createKeyboardHandlers).toBe('function');
	});

	it('should return a keyDown handler function', () => {
		const deps = createMockDependencies();
		const handleKeyDown = createKeyboardHandlers(deps);
		expect(typeof handleKeyDown).toBe('function');
	});
});

describe('createKeyboardHandlers - Backspace Key', () => {
	it('should clear current input when backspace is pressed and input has value', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('Backspace');
		handleKeyDown(2, e);

		expect(e.preventDefault).toHaveBeenCalled();
		expect(updateValue).toHaveBeenCalledWith(['1', '2', '', '', '', '']);
	});

	it('should clear previous input and move focus when backspace is pressed on empty input', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('Backspace');
		handleKeyDown(2, e);

		expect(e.preventDefault).toHaveBeenCalled();
		expect(updateValue).toHaveBeenCalledWith(['1', '', '', '', '', '']);
		expect(focusInput).toHaveBeenCalledWith(1);
	});

	it('should not do anything when backspace is pressed on first empty input', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('Backspace');
		handleKeyDown(0, e);

		expect(e.preventDefault).toHaveBeenCalled();
		expect(updateValue).not.toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});

	it('should handle backspace on last input with value', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '4', '5', '6']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('Backspace');
		handleKeyDown(5, e);

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '']);
	});
});

describe('createKeyboardHandlers - Arrow Keys', () => {
	it('should move focus left when ArrowLeft is pressed', () => {
		const focusInput = vi.fn();
		const deps = createMockDependencies({
			focusInput,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('ArrowLeft');
		handleKeyDown(3, e);

		expect(e.preventDefault).toHaveBeenCalled();
		expect(focusInput).toHaveBeenCalledWith(2);
	});

	it('should not move focus left when ArrowLeft is pressed on first input', () => {
		const focusInput = vi.fn();
		const deps = createMockDependencies({
			focusInput,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('ArrowLeft');
		handleKeyDown(0, e);

		expect(e.preventDefault).toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});

	it('should move focus right when ArrowRight is pressed', () => {
		const focusInput = vi.fn();
		const deps = createMockDependencies({
			focusInput,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('ArrowRight');
		handleKeyDown(2, e);

		expect(e.preventDefault).toHaveBeenCalled();
		expect(focusInput).toHaveBeenCalledWith(3);
	});

	it('should not move focus right when ArrowRight is pressed on last input', () => {
		const focusInput = vi.fn();
		const deps = createMockDependencies({
			length: 6,
			focusInput,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('ArrowRight');
		handleKeyDown(5, e);

		expect(e.preventDefault).toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});

	it('should prevent default for ArrowUp', () => {
		const deps = createMockDependencies();
		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('ArrowUp');
		handleKeyDown(2, e);

		expect(e.preventDefault).toHaveBeenCalled();
	});

	it('should prevent default for ArrowDown', () => {
		const deps = createMockDependencies();
		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('ArrowDown');
		handleKeyDown(2, e);

		expect(e.preventDefault).toHaveBeenCalled();
	});
});

describe('createKeyboardHandlers - Delete Key', () => {
	it('should clear current input when Delete is pressed', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('Delete');
		handleKeyDown(2, e);

		expect(e.preventDefault).toHaveBeenCalled();
		expect(updateValue).toHaveBeenCalledWith(['1', '2', '', '', '', '']);
	});

	it('should clear empty input when Delete is pressed', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['1', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('Delete');
		handleKeyDown(1, e);

		expect(e.preventDefault).toHaveBeenCalled();
		expect(updateValue).toHaveBeenCalledWith(['1', '', '', '', '', '']);
	});
});

describe('createKeyboardHandlers - Other Keys', () => {
	it('should not handle unknown keys', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const deps = createMockDependencies({
			updateValue,
			focusInput,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('Enter');
		handleKeyDown(2, e);

		expect(e.preventDefault).not.toHaveBeenCalled();
		expect(updateValue).not.toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});

	it('should handle different OTP lengths', () => {
		const focusInput = vi.fn();
		const deps = createMockDependencies({
			length: 4,
			focusInput,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('ArrowRight');
		handleKeyDown(2, e);

		expect(focusInput).toHaveBeenCalledWith(3);
	});

	it('should work with different value arrays', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '4', '5', '6']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handleKeyDown = createKeyboardHandlers(deps);
		const e = createMockKeyboardEvent('Backspace');
		handleKeyDown(3, e);

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '', '5', '6']);
	});
});
