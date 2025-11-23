/**
 * OTPInputFieldHandlers.input Tests
 *
 * Tests for input handler creation:
 * - createInputHandlers
 * - Single character input
 * - Multiple character input
 * - Empty input handling
 * - Auto-focus behavior
 * - Completion callback
 */

import { createInputHandlers } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.input';
import type { HandlerDependencies } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.types';
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

describe('createInputHandlers - Single Character Input', () => {
	it('should be a function', () => {
		expect(typeof createInputHandlers).toBe('function');
	});

	it('should create a handler function', () => {
		const deps = createMockDependencies();
		const handleInput = createInputHandlers(deps);
		expect(typeof handleInput).toBe('function');
	});

	it('should handle single valid digit input', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(0, '5');

		expect(getValueArray).toHaveBeenCalled();
		expect(updateValue).toHaveBeenCalledWith(['5', '', '', '', '', '']);
		expect(focusInput).toHaveBeenCalledWith(1);
	});

	it('should move to next input after entering digit', () => {
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['1', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(1, '2');

		expect(focusInput).toHaveBeenCalledWith(2);
	});

	it('should not move focus when entering last digit', () => {
		const focusInput = vi.fn();
		const onComplete = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '4', '5', '']);

		const deps = createMockDependencies({
			length: 6,
			onComplete,
			getValueArray,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(5, '6');

		expect(focusInput).not.toHaveBeenCalled();
		expect(onComplete).toHaveBeenCalledWith('123456');
	});

	it('should trigger onComplete when last digit is entered', () => {
		const onComplete = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '4', '5', '']);

		const deps = createMockDependencies({
			onComplete,
			getValueArray,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(5, '6');

		expect(onComplete).toHaveBeenCalledWith('123456');
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('should handle empty input by clearing value', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(1, '');

		expect(updateValue).toHaveBeenCalledWith(['1', '', '', '', '', '']);
	});

	it('should ignore invalid characters', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['1', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(1, 'a');
		handleInput(1, '!');
		handleInput(1, ' ');

		expect(updateValue).not.toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});
});

describe('createInputHandlers - Multiple Character Input', () => {
	it('should handle multiple digits pasted into single input', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(0, '123');

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '', '', '']);
		expect(focusInput).toHaveBeenCalledWith(3);
	});

	it('should fill multiple digits starting from current index', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['1', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(1, '456');

		expect(updateValue).toHaveBeenCalledWith(['1', '4', '5', '6', '', '']);
		expect(focusInput).toHaveBeenCalledWith(4);
	});

	it('should clamp multiple digits to max length', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			length: 6,
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(0, '123456789');

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
		expect(focusInput).toHaveBeenCalledWith(5);
	});

	it('should extract only digits from mixed input', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(0, '1a2b3c');

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '', '', '']);
		expect(focusInput).toHaveBeenCalledWith(3);
	});

	it('should not process empty multiple character input', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(0, 'abc');

		expect(updateValue).not.toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});

	it('should trigger onComplete when multiple digits complete the OTP', () => {
		const onComplete = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '', '', '']);

		const deps = createMockDependencies({
			onComplete,
			getValueArray,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(3, '456');

		expect(onComplete).toHaveBeenCalledWith('123456');
	});
});

describe('createInputHandlers - Edge Cases', () => {
	it('should work without onComplete callback', () => {
		const getValueArray = vi.fn(() => ['1', '2', '3', '4', '5', '']);

		const deps = createMockDependencies({
			onComplete: undefined,
			getValueArray,
		});

		const handleInput = createInputHandlers(deps);
		expect(() => handleInput(5, '6')).not.toThrow();
	});

	it('should handle different OTP lengths', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '']);

		const deps = createMockDependencies({
			length: 4,
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(0, '1234');

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4']);
		expect(focusInput).toHaveBeenCalledWith(3);
	});

	it('should handle input at different positions', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(3, '4');

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4', '', '']);
		expect(focusInput).toHaveBeenCalledWith(4);
	});

	it('should handle overwriting existing values', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '4', '5', '6']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handleInput = createInputHandlers(deps);
		handleInput(2, '9');

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '9', '4', '5', '6']);
		expect(focusInput).toHaveBeenCalledWith(3);
	});
});
