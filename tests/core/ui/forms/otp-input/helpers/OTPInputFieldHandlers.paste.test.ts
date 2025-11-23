/**
 * OTPInputFieldHandlers.paste Tests
 *
 * Tests for paste handler creation:
 * - createPasteHandlers
 * - Paste event handling
 * - Digit extraction
 * - Value array filling
 * - Focus management
 * - Completion callback
 */

import { createPasteHandlers } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.paste';
import type { HandlerDependencies } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.types';
import type { ClipboardEvent } from 'react';
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

function createMockClipboardEvent(data: string): ClipboardEvent<HTMLInputElement> {
	return {
		preventDefault: vi.fn(),
		clipboardData: {
			getData: vi.fn(() => data),
		},
	} as unknown as ClipboardEvent<HTMLInputElement>;
}

describe('createPasteHandlers', () => {
	it('should be a function', () => {
		expect(typeof createPasteHandlers).toBe('function');
	});

	it('should return a paste handler function', () => {
		const deps = createMockDependencies();
		const handlePaste = createPasteHandlers(deps);
		expect(typeof handlePaste).toBe('function');
	});
});

describe('createPasteHandlers - Basic Paste', () => {
	it('should prevent default paste behavior', () => {
		const deps = createMockDependencies();
		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('123456');

		handlePaste(e);

		expect(e.preventDefault).toHaveBeenCalled();
	});

	it('should extract and fill digits from pasted text', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('123456');

		handlePaste(e);

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
	});

	it('should extract only digits from mixed text', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('1a2b3c4d5e6f');

		handlePaste(e);

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
	});

	it('should focus the next input after pasting', () => {
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			focusInput,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('123');

		handlePaste(e);

		expect(focusInput).toHaveBeenCalledWith(2);
	});

	it('should focus last input when pasted digits exceed length', () => {
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			length: 6,
			getValueArray,
			focusInput,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('123456789');

		handlePaste(e);

		expect(focusInput).toHaveBeenCalledWith(5);
	});
});

describe('createPasteHandlers - Paste into Partially Filled Input', () => {
	it('should fill from first empty index', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('3456');

		handlePaste(e);

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
		expect(focusInput).toHaveBeenCalledWith(5);
	});

	it('should fill from first empty index when multiple empty slots exist', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['1', '', '3', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('2456');

		handlePaste(e);

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
	});

	it('should not overwrite existing values when pasting', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('456');

		handlePaste(e);

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
	});
});

describe('createPasteHandlers - Completion', () => {
	it('should trigger onComplete when paste completes OTP', () => {
		const onComplete = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			onComplete,
			getValueArray,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('123456');

		handlePaste(e);

		expect(onComplete).toHaveBeenCalledWith('123456');
		expect(onComplete).toHaveBeenCalledTimes(1);
	});

	it('should trigger onComplete when paste fills remaining slots', () => {
		const onComplete = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '', '', '', '']);

		const deps = createMockDependencies({
			onComplete,
			getValueArray,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('3456');

		handlePaste(e);

		expect(onComplete).toHaveBeenCalledWith('123456');
	});

	it('should not trigger onComplete when paste does not complete OTP', () => {
		const onComplete = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			onComplete,
			getValueArray,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('123');

		handlePaste(e);

		expect(onComplete).not.toHaveBeenCalled();
	});

	it('should work without onComplete callback', () => {
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			onComplete: undefined,
			getValueArray,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('123456');

		expect(() => handlePaste(e)).not.toThrow();
	});
});

describe('createPasteHandlers - Edge Cases', () => {
	it('should not process paste when no digits are found', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('abc');

		handlePaste(e);

		expect(e.preventDefault).toHaveBeenCalled();
		expect(updateValue).not.toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});

	it('should handle empty paste', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('');

		handlePaste(e);

		expect(updateValue).not.toHaveBeenCalled();
	});

	it('should clamp pasted digits to max length', () => {
		const updateValue = vi.fn();
		const getValueArray = vi.fn(() => ['', '', '', '', '', '']);

		const deps = createMockDependencies({
			length: 6,
			getValueArray,
			updateValue,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('123456789012345');

		handlePaste(e);

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4', '5', '6']);
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

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('1234');

		handlePaste(e);

		expect(updateValue).toHaveBeenCalledWith(['1', '2', '3', '4']);
		expect(focusInput).toHaveBeenCalledWith(3);
	});

	it('should handle paste when all inputs are already filled', () => {
		const updateValue = vi.fn();
		const focusInput = vi.fn();
		const getValueArray = vi.fn(() => ['1', '2', '3', '4', '5', '6']);

		const deps = createMockDependencies({
			getValueArray,
			updateValue,
			focusInput,
		});

		const handlePaste = createPasteHandlers(deps);
		const e = createMockClipboardEvent('789');

		handlePaste(e);

		// Should not change anything since all slots are filled
		expect(updateValue).not.toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});
});
