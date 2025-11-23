/**
 * OTPInputFieldHandlers.focus Tests
 *
 * Tests for focus handler creation:
 * - createFocusHandlers
 * - Focus event handling
 * - Input selection behavior
 */

import { createFocusHandlers } from '@core/ui/forms/otp-input/helpers/OTPInputFieldHandlers.focus';
import type { FocusEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('createFocusHandlers', () => {
	it('should be a function', () => {
		expect(typeof createFocusHandlers).toBe('function');
	});

	it('should return a focus handler function', () => {
		const handleFocus = createFocusHandlers();
		expect(typeof handleFocus).toBe('function');
	});

	it('should select input text on focus', () => {
		const handleFocus = createFocusHandlers();
		const selectSpy = vi.fn();
		const mockEvent = {
			target: {
				select: selectSpy,
			},
		} as unknown as FocusEvent<HTMLInputElement>;

		handleFocus(0, mockEvent);

		expect(selectSpy).toHaveBeenCalledTimes(1);
	});

	it('should select input text for any index', () => {
		const handleFocus = createFocusHandlers();
		const selectSpy = vi.fn();
		const mockEvent = {
			target: {
				select: selectSpy,
			},
		} as unknown as FocusEvent<HTMLInputElement>;

		handleFocus(5, mockEvent);
		expect(selectSpy).toHaveBeenCalledTimes(1);

		selectSpy.mockClear();
		handleFocus(0, mockEvent);
		expect(selectSpy).toHaveBeenCalledTimes(1);
	});

	it('should handle focus event without throwing', () => {
		const handleFocus = createFocusHandlers();
		const mockEvent = {
			target: {
				select: vi.fn(),
			},
		} as unknown as FocusEvent<HTMLInputElement>;

		expect(() => handleFocus(0, mockEvent)).not.toThrow();
	});

	it('should work with different input elements', () => {
		const handleFocus = createFocusHandlers();
		const selectSpy1 = vi.fn();
		const selectSpy2 = vi.fn();

		const mockEvent1 = {
			target: {
				select: selectSpy1,
			},
		} as unknown as FocusEvent<HTMLInputElement>;

		const mockEvent2 = {
			target: {
				select: selectSpy2,
			},
		} as unknown as FocusEvent<HTMLInputElement>;

		handleFocus(0, mockEvent1);
		handleFocus(1, mockEvent2);

		expect(selectSpy1).toHaveBeenCalledTimes(1);
		expect(selectSpy2).toHaveBeenCalledTimes(1);
	});
});
