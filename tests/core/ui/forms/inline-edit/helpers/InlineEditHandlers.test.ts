/**
 * InlineEditHandlers Tests
 *
 * Tests for handler functions:
 * - focusAndSelectInput
 * - scheduleFocusAndSelect
 * - getInputFromRef
 * - useFocusInput
 * - createDisplayHandlers
 */

import {
	createDisplayHandlers,
	focusAndSelectInput,
	getInputFromRef,
	scheduleFocusAndSelect,
	useFocusInput,
} from '@core/ui/forms/inline-edit/helpers/InlineEditHandlers';
import { renderHook } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('focusAndSelectInput', () => {
	it('should be a function', () => {
		expect(typeof focusAndSelectInput).toBe('function');
	});

	it('focuses and selects text in input element', () => {
		const input = document.createElement('input');
		input.value = 'Test Value';
		document.body.append(input);

		const focusSpy = vi.spyOn(input, 'focus');
		const selectSpy = vi.spyOn(input, 'select');

		focusAndSelectInput(input);

		expect(focusSpy).toHaveBeenCalledTimes(1);
		expect(selectSpy).toHaveBeenCalledTimes(1);

		input.remove();
	});
});

describe('scheduleFocusAndSelect', () => {
	it('should be a function', () => {
		expect(typeof scheduleFocusAndSelect).toBe('function');
	});

	it('schedules focus and select with delay', async () => {
		const input = document.createElement('input');
		input.value = 'Test Value';
		document.body.append(input);

		const focusSpy = vi.spyOn(input, 'focus');
		const selectSpy = vi.spyOn(input, 'select');

		scheduleFocusAndSelect(input);

		// Should not be called immediately
		expect(focusSpy).not.toHaveBeenCalled();
		expect(selectSpy).not.toHaveBeenCalled();

		// Wait for setTimeout
		await new Promise(resolve => setTimeout(resolve, 10));

		expect(focusSpy).toHaveBeenCalledTimes(1);
		expect(selectSpy).toHaveBeenCalledTimes(1);

		input.remove();
	});
});

describe('getInputFromRef', () => {
	it('should be a function', () => {
		expect(typeof getInputFromRef).toBe('function');
	});

	it('returns input element from ref when available', () => {
		const input = document.createElement('input');
		const ref = createRef<HTMLInputElement>();
		ref.current = input;

		const result = getInputFromRef(ref);
		expect(result).toBe(input);
	});

	it('returns null when ref is null', () => {
		const ref = createRef<HTMLInputElement>();
		ref.current = null;

		const result = getInputFromRef(ref);
		expect(result).toBeNull();
	});

	it('returns null when ref.current is null', () => {
		const ref = { current: null } as unknown as React.RefObject<HTMLInputElement>;

		const result = getInputFromRef(ref);
		expect(result).toBeNull();
	});
});

describe('useFocusInput', () => {
	it('should be a function', () => {
		expect(typeof useFocusInput).toBe('function');
	});

	it('returns a function that focuses input when ref is available', async () => {
		const input = document.createElement('input');
		input.value = 'Test Value';
		document.body.append(input);

		const ref = createRef<HTMLInputElement>();
		ref.current = input;

		const { result } = renderHook(() => useFocusInput(ref));

		const focusSpy = vi.spyOn(input, 'focus');
		const selectSpy = vi.spyOn(input, 'select');

		result.current();

		// Wait for setTimeout
		await new Promise(resolve => setTimeout(resolve, 10));

		expect(focusSpy).toHaveBeenCalledTimes(1);
		expect(selectSpy).toHaveBeenCalledTimes(1);

		input.remove();
	});

	it('does nothing when ref is null', async () => {
		const ref = createRef<HTMLInputElement>();
		ref.current = null;

		const { result } = renderHook(() => useFocusInput(ref));

		// Should not throw
		result.current();

		// Wait for setTimeout
		await new Promise(resolve => setTimeout(resolve, 10));

		// Should complete without errors
		expect(true).toBe(true);
	});

	it('memoizes the function based on ref', () => {
		const ref1 = createRef<HTMLInputElement>();
		const ref2 = createRef<HTMLInputElement>();

		const { result: result1, rerender: rerender1 } = renderHook(({ ref }) => useFocusInput(ref), {
			initialProps: { ref: ref1 },
		});

		const fn1 = result1.current;

		rerender1({ ref: ref1 });
		const fn2 = result1.current;

		// Same ref should return same function
		expect(fn1).toBe(fn2);

		rerender1({ ref: ref2 });
		const fn3 = result1.current;

		// Different ref should return different function
		expect(fn1).not.toBe(fn3);
	});
});

describe('createDisplayHandlers', () => {
	it('should be a function', () => {
		expect(typeof createDisplayHandlers).toBe('function');
	});

	it('returns handleDisplayClick and handleDisplayKeyDown', () => {
		const startEditing = vi.fn();
		const focusInput = vi.fn();

		const handlers = createDisplayHandlers({
			disabled: false,
			startEditing,
			focusInput,
		});

		expect(handlers).toHaveProperty('handleDisplayClick');
		expect(handlers).toHaveProperty('handleDisplayKeyDown');
		expect(typeof handlers.handleDisplayClick).toBe('function');
		expect(typeof handlers.handleDisplayKeyDown).toBe('function');
	});

	it('handleDisplayClick calls startEditing and focusInput when not disabled', () => {
		const startEditing = vi.fn();
		const focusInput = vi.fn();

		const handlers = createDisplayHandlers({
			disabled: false,
			startEditing,
			focusInput,
		});

		handlers.handleDisplayClick();

		expect(startEditing).toHaveBeenCalledTimes(1);
		expect(focusInput).toHaveBeenCalledTimes(1);
	});

	it('handleDisplayClick does nothing when disabled', () => {
		const startEditing = vi.fn();
		const focusInput = vi.fn();

		const handlers = createDisplayHandlers({
			disabled: true,
			startEditing,
			focusInput,
		});

		handlers.handleDisplayClick();

		expect(startEditing).not.toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});

	it('handleDisplayKeyDown calls startEditing and focusInput on Enter when not disabled', () => {
		const startEditing = vi.fn();
		const focusInput = vi.fn();

		const handlers = createDisplayHandlers({
			disabled: false,
			startEditing,
			focusInput,
		});

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLButtonElement>;

		handlers.handleDisplayKeyDown(event);

		expect(event.preventDefault).toHaveBeenCalledTimes(1);
		expect(startEditing).toHaveBeenCalledTimes(1);
		expect(focusInput).toHaveBeenCalledTimes(1);
	});

	it('handleDisplayKeyDown calls startEditing and focusInput on Space when not disabled', () => {
		const startEditing = vi.fn();
		const focusInput = vi.fn();

		const handlers = createDisplayHandlers({
			disabled: false,
			startEditing,
			focusInput,
		});

		const event = {
			key: ' ',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLButtonElement>;

		handlers.handleDisplayKeyDown(event);

		expect(event.preventDefault).toHaveBeenCalledTimes(1);
		expect(startEditing).toHaveBeenCalledTimes(1);
		expect(focusInput).toHaveBeenCalledTimes(1);
	});

	it('handleDisplayKeyDown does nothing when disabled', () => {
		const startEditing = vi.fn();
		const focusInput = vi.fn();

		const handlers = createDisplayHandlers({
			disabled: true,
			startEditing,
			focusInput,
		});

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLButtonElement>;

		handlers.handleDisplayKeyDown(event);

		expect(event.preventDefault).not.toHaveBeenCalled();
		expect(startEditing).not.toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});

	it('handleDisplayKeyDown does nothing for other keys', () => {
		const startEditing = vi.fn();
		const focusInput = vi.fn();

		const handlers = createDisplayHandlers({
			disabled: false,
			startEditing,
			focusInput,
		});

		const event = {
			key: 'Tab',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLButtonElement>;

		handlers.handleDisplayKeyDown(event);

		expect(event.preventDefault).not.toHaveBeenCalled();
		expect(startEditing).not.toHaveBeenCalled();
		expect(focusInput).not.toHaveBeenCalled();
	});
});
