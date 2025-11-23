/**
 * useInlineEdit.handlers Tests
 *
 * Tests for handler hooks:
 * - useStartEditingHandler
 * - useChangeHandler
 * - useKeyDownHandler
 * - useBlurHandler
 * - useInlineEditHandlers
 */

import {
	useBlurHandler,
	useChangeHandler,
	useInlineEditHandlers,
	useKeyDownHandler,
	useStartEditingHandler,
} from '@core/ui/forms/inline-edit/hooks/useInlineEdit.handlers';
import { renderHook } from '@testing-library/react';
import type React from 'react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useStartEditingHandler', () => {
	it('should be a function', () => {
		expect(typeof useStartEditingHandler).toBe('function');
	});

	it('returns a function that starts editing', () => {
		const getCurrentValueFn = vi.fn(() => 'Current Value');
		const updateEditValue = vi.fn();
		const setOriginalValue = vi.fn();
		const startEditingState = vi.fn();

		const { result } = renderHook(() =>
			useStartEditingHandler({
				getCurrentValueFn,
				updateEditValue,
				setOriginalValue,
				startEditingState,
			})
		);

		result.current();

		expect(getCurrentValueFn).toHaveBeenCalledTimes(1);
		expect(updateEditValue).toHaveBeenCalledWith('Current Value');
		expect(setOriginalValue).toHaveBeenCalledWith('Current Value');
		expect(startEditingState).toHaveBeenCalledTimes(1);
	});

	it('memoizes the function', () => {
		const getCurrentValueFn = vi.fn(() => 'Value');
		const updateEditValue = vi.fn();
		const setOriginalValue = vi.fn();
		const startEditingState = vi.fn();

		const { result, rerender } = renderHook(
			({ getCurrentValueFn }) =>
				useStartEditingHandler({
					getCurrentValueFn,
					updateEditValue,
					setOriginalValue,
					startEditingState,
				}),
			{
				initialProps: { getCurrentValueFn },
			}
		);

		const fn1 = result.current;

		rerender({ getCurrentValueFn });
		const fn2 = result.current;

		// Should be the same function reference
		expect(fn1).toBe(fn2);
	});
});

describe('useChangeHandler', () => {
	it('should be a function', () => {
		expect(typeof useChangeHandler).toBe('function');
	});

	it('returns a function that updates edit value', () => {
		const updateEditValue = vi.fn();
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useChangeHandler({
				updateEditValue,
				onChange,
			})
		);

		const event = {
			target: { value: 'New Value' },
		} as React.ChangeEvent<HTMLInputElement>;

		result.current(event);

		expect(updateEditValue).toHaveBeenCalledWith('New Value');
		expect(onChange).toHaveBeenCalledWith('New Value');
	});

	it('calls onChange when provided', () => {
		const updateEditValue = vi.fn();
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useChangeHandler({
				updateEditValue,
				onChange,
			})
		);

		const event = {
			target: { value: 'Test' },
		} as React.ChangeEvent<HTMLInputElement>;

		result.current(event);

		expect(onChange).toHaveBeenCalledWith('Test');
	});

	it('does not call onChange when not provided', () => {
		const updateEditValue = vi.fn();

		const { result } = renderHook(() =>
			useChangeHandler({
				updateEditValue,
				onChange: undefined,
			})
		);

		const event = {
			target: { value: 'Test' },
		} as React.ChangeEvent<HTMLInputElement>;

		result.current(event);

		expect(updateEditValue).toHaveBeenCalledWith('Test');
		// onChange should not throw
		expect(true).toBe(true);
	});
});

describe('useKeyDownHandler', () => {
	it('should be a function', () => {
		expect(typeof useKeyDownHandler).toBe('function');
	});

	it('saves on Enter key', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = 'Edited Value';
		const setIsEditing = vi.fn();
		const resetToOriginal = vi.fn();
		const onSave = vi.fn();

		const { result } = renderHook(() =>
			useKeyDownHandler({
				editValueRef,
				setIsEditing,
				resetToOriginal,
				onSave,
				onCancel: undefined,
			})
		);

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;

		result.current(event);

		expect(event.preventDefault).toHaveBeenCalledTimes(1);
		expect(onSave).toHaveBeenCalledWith('Edited Value');
		expect(setIsEditing).toHaveBeenCalledWith(false);
		expect(resetToOriginal).not.toHaveBeenCalled();
	});

	it('cancels on Escape key', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = 'Edited Value';
		const setIsEditing = vi.fn();
		const resetToOriginal = vi.fn();
		const onCancel = vi.fn();

		const { result } = renderHook(() =>
			useKeyDownHandler({
				editValueRef,
				setIsEditing,
				resetToOriginal,
				onSave: undefined,
				onCancel,
			})
		);

		const event = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;

		result.current(event);

		expect(event.preventDefault).toHaveBeenCalledTimes(1);
		expect(resetToOriginal).toHaveBeenCalledTimes(1);
		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(setIsEditing).toHaveBeenCalledWith(false);
	});

	it('does nothing for other keys', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = 'Value';
		const setIsEditing = vi.fn();
		const resetToOriginal = vi.fn();
		const onSave = vi.fn();
		const onCancel = vi.fn();

		const { result } = renderHook(() =>
			useKeyDownHandler({
				editValueRef,
				setIsEditing,
				resetToOriginal,
				onSave,
				onCancel,
			})
		);

		const event = {
			key: 'Tab',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;

		result.current(event);

		expect(event.preventDefault).not.toHaveBeenCalled();
		expect(onSave).not.toHaveBeenCalled();
		expect(onCancel).not.toHaveBeenCalled();
		expect(setIsEditing).not.toHaveBeenCalled();
		expect(resetToOriginal).not.toHaveBeenCalled();
	});

	it('trims value on save', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = '  Trimmed Value  ';
		const setIsEditing = vi.fn();
		const resetToOriginal = vi.fn();
		const onSave = vi.fn();

		const { result } = renderHook(() =>
			useKeyDownHandler({
				editValueRef,
				setIsEditing,
				resetToOriginal,
				onSave,
				onCancel: undefined,
			})
		);

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;

		result.current(event);

		expect(onSave).toHaveBeenCalledWith('Trimmed Value');
	});

	it('handles null editValueRef.current', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = undefined;
		const setIsEditing = vi.fn();
		const resetToOriginal = vi.fn();
		const onSave = vi.fn();

		const { result } = renderHook(() =>
			useKeyDownHandler({
				editValueRef,
				setIsEditing,
				resetToOriginal,
				onSave,
				onCancel: undefined,
			})
		);

		const event = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;

		result.current(event);

		expect(onSave).toHaveBeenCalledWith('');
	});
});

describe('useBlurHandler', () => {
	it('should be a function', () => {
		expect(typeof useBlurHandler).toBe('function');
	});

	it('saves when value changed and onCancel is not provided', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = 'Changed Value';
		const originalValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		originalValueRef.current = 'Original Value';
		const setIsEditing = vi.fn();
		const onSave = vi.fn();

		const { result } = renderHook(() =>
			useBlurHandler({
				editValueRef,
				originalValueRef,
				setIsEditing,
				onSave,
				onCancel: undefined,
			})
		);

		const event = {} as React.FocusEvent<HTMLInputElement>;

		result.current(event);

		expect(onSave).toHaveBeenCalledWith('Changed Value');
		expect(setIsEditing).toHaveBeenCalledWith(false);
	});

	it('saves when value changed and onCancel is provided', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = 'Changed Value';
		const originalValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		originalValueRef.current = 'Original Value';
		const setIsEditing = vi.fn();
		const onSave = vi.fn();
		const onCancel = vi.fn();

		const { result } = renderHook(() =>
			useBlurHandler({
				editValueRef,
				originalValueRef,
				setIsEditing,
				onSave,
				onCancel,
			})
		);

		const event = {} as React.FocusEvent<HTMLInputElement>;

		result.current(event);

		expect(onSave).toHaveBeenCalledWith('Changed Value');
		expect(setIsEditing).toHaveBeenCalledWith(false);
		expect(onCancel).not.toHaveBeenCalled();
	});

	it('does not save when value unchanged and onCancel is provided', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = 'Same Value';
		const originalValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		originalValueRef.current = 'Same Value';
		const setIsEditing = vi.fn();
		const onSave = vi.fn();
		const onCancel = vi.fn();

		const { result } = renderHook(() =>
			useBlurHandler({
				editValueRef,
				originalValueRef,
				setIsEditing,
				onSave,
				onCancel,
			})
		);

		const event = {} as React.FocusEvent<HTMLInputElement>;

		result.current(event);

		expect(onSave).not.toHaveBeenCalled();
		expect(setIsEditing).toHaveBeenCalledWith(false);
	});

	it('saves when value unchanged and onCancel is not provided', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = 'Same Value';
		const originalValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		originalValueRef.current = 'Same Value';
		const setIsEditing = vi.fn();
		const onSave = vi.fn();

		const { result } = renderHook(() =>
			useBlurHandler({
				editValueRef,
				originalValueRef,
				setIsEditing,
				onSave,
				onCancel: undefined,
			})
		);

		const event = {} as React.FocusEvent<HTMLInputElement>;

		result.current(event);

		expect(onSave).toHaveBeenCalledWith('Same Value');
		expect(setIsEditing).toHaveBeenCalledWith(false);
	});

	it('trims value on save', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = '  Trimmed  ';
		const originalValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		originalValueRef.current = 'Original';
		const setIsEditing = vi.fn();
		const onSave = vi.fn();

		const { result } = renderHook(() =>
			useBlurHandler({
				editValueRef,
				originalValueRef,
				setIsEditing,
				onSave,
				onCancel: undefined,
			})
		);

		const event = {} as React.FocusEvent<HTMLInputElement>;

		result.current(event);

		expect(onSave).toHaveBeenCalledWith('Trimmed');
	});

	it('handles null ref values', () => {
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = undefined;
		const originalValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		originalValueRef.current = undefined;
		const setIsEditing = vi.fn();
		const onSave = vi.fn();

		const { result } = renderHook(() =>
			useBlurHandler({
				editValueRef,
				originalValueRef,
				setIsEditing,
				onSave,
				onCancel: undefined,
			})
		);

		const event = {} as React.FocusEvent<HTMLInputElement>;

		result.current(event);

		expect(onSave).toHaveBeenCalledWith('');
		expect(setIsEditing).toHaveBeenCalledWith(false);
	});
});

describe('useInlineEditHandlers', () => {
	it('should be a function', () => {
		expect(typeof useInlineEditHandlers).toBe('function');
	});

	it('returns all handler functions', () => {
		const getCurrentValueFn = vi.fn(() => 'Value');
		const updateEditValue = vi.fn();
		const setOriginalValue = vi.fn();
		const startEditingState = vi.fn();
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = 'Edit';
		const originalValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		originalValueRef.current = 'Original';
		const setIsEditing = vi.fn();
		const resetToOriginal = vi.fn();
		const onSave = vi.fn();
		const onCancel = vi.fn();
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useInlineEditHandlers({
				getCurrentValueFn,
				updateEditValue,
				setOriginalValue,
				startEditingState,
				editValueRef,
				originalValueRef,
				setIsEditing,
				resetToOriginal,
				onSave,
				onCancel,
				onChange,
			})
		);

		expect(result.current).toHaveProperty('startEditing');
		expect(result.current).toHaveProperty('handleChange');
		expect(result.current).toHaveProperty('handleKeyDown');
		expect(result.current).toHaveProperty('handleBlur');
		expect(typeof result.current.startEditing).toBe('function');
		expect(typeof result.current.handleChange).toBe('function');
		expect(typeof result.current.handleKeyDown).toBe('function');
		expect(typeof result.current.handleBlur).toBe('function');
	});

	it('integrates all handlers correctly', () => {
		const getCurrentValueFn = vi.fn(() => 'Initial');
		const updateEditValue = vi.fn();
		const setOriginalValue = vi.fn();
		const startEditingState = vi.fn();
		const editValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		editValueRef.current = 'Edited';
		const originalValueRef = createRef<string | undefined>() as React.RefObject<string | undefined>;
		originalValueRef.current = 'Initial';
		const setIsEditing = vi.fn();
		const resetToOriginal = vi.fn();
		const onSave = vi.fn();
		const onCancel = vi.fn();
		const onChange = vi.fn();

		const { result } = renderHook(() =>
			useInlineEditHandlers({
				getCurrentValueFn,
				updateEditValue,
				setOriginalValue,
				startEditingState,
				editValueRef,
				originalValueRef,
				setIsEditing,
				resetToOriginal,
				onSave,
				onCancel,
				onChange,
			})
		);

		// Test startEditing
		result.current.startEditing();
		expect(getCurrentValueFn).toHaveBeenCalled();
		expect(updateEditValue).toHaveBeenCalled();
		expect(setOriginalValue).toHaveBeenCalled();
		expect(startEditingState).toHaveBeenCalled();

		// Test handleChange
		const changeEvent = {
			target: { value: 'New' },
		} as React.ChangeEvent<HTMLInputElement>;
		result.current.handleChange(changeEvent);
		expect(updateEditValue).toHaveBeenCalledWith('New');
		expect(onChange).toHaveBeenCalledWith('New');

		// Test handleKeyDown (Enter)
		const enterEvent = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;
		result.current.handleKeyDown(enterEvent);
		expect(onSave).toHaveBeenCalled();

		// Test handleBlur
		const blurEvent = {} as React.FocusEvent<HTMLInputElement>;
		result.current.handleBlur(blurEvent);
		expect(setIsEditing).toHaveBeenCalledWith(false);
	});
});
