/**
 * useInlineEdit Tests
 *
 * Tests for the main useInlineEdit hook:
 * - Initial state
 * - Starting editing
 * - Changing value
 * - Saving
 * - Canceling
 * - Controlled and uncontrolled modes
 */

import { useInlineEdit } from '@core/ui/forms/inline-edit/hooks/useInlineEdit';
import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('useInlineEdit - Initial State', () => {
	it('should be a function', () => {
		expect(typeof useInlineEdit).toBe('function');
	});

	it('returns all expected properties', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Test',
			})
		);

		expect(result.current).toHaveProperty('isEditing');
		expect(result.current).toHaveProperty('editValue');
		expect(result.current).toHaveProperty('startEditing');
		expect(result.current).toHaveProperty('stopEditing');
		expect(result.current).toHaveProperty('handleChange');
		expect(result.current).toHaveProperty('handleKeyDown');
		expect(result.current).toHaveProperty('handleBlur');
	});

	it('starts in non-editing state', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Test',
			})
		);

		expect(result.current.isEditing).toBe(false);
	});

	it('initializes editValue with controlled value', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Controlled Value',
			})
		);

		expect(result.current.editValue).toBe('Controlled Value');
	});

	it('initializes editValue with defaultValue when value is undefined', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				defaultValue: 'Default Value',
			})
		);

		expect(result.current.editValue).toBe('Default Value');
	});

	it('initializes editValue with empty string when both are undefined', () => {
		const { result } = renderHook(() => useInlineEdit({}));

		expect(result.current.editValue).toBe('');
	});
});

describe('useInlineEdit - Starting Editing', () => {
	it('startEditing switches to editing state', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Test',
			})
		);

		expect(result.current.isEditing).toBe(false);

		act(() => {
			result.current.startEditing();
		});
		expect(result.current.isEditing).toBe(true);
	});

	it('startEditing initializes editValue with current value', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Initial Value',
			})
		);

		result.current.startEditing();
		expect(result.current.editValue).toBe('Initial Value');
	});

	it('startEditing uses controlled value when available', () => {
		const { result, rerender } = renderHook(
			({ value }: { value?: string }) =>
				useInlineEdit({
					...(value !== undefined && { value }),
				}),
			{
				initialProps: { value: 'Initial' },
			}
		);

		act(() => {
			result.current.startEditing();
		});
		expect(result.current.editValue).toBe('Initial');

		rerender({ value: 'Updated' });
		act(() => {
			result.current.startEditing();
		});
		expect(result.current.editValue).toBe('Updated');
	});

	it('startEditing uses defaultValue when value is undefined', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				defaultValue: 'Default',
			})
		);

		result.current.startEditing();
		expect(result.current.editValue).toBe('Default');
	});
});

describe('useInlineEdit - Changing Value', () => {
	it('handleChange updates editValue', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Initial',
			})
		);

		result.current.startEditing();

		const event = {
			target: { value: 'Changed' },
		} as React.ChangeEvent<HTMLInputElement>;

		act(() => {
			result.current.handleChange(event);
		});
		expect(result.current.editValue).toBe('Changed');
	});

	it('handleChange calls onChange callback when provided', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Initial',
				onChange,
			})
		);

		result.current.startEditing();

		const event = {
			target: { value: 'Changed' },
		} as React.ChangeEvent<HTMLInputElement>;

		result.current.handleChange(event);
		expect(onChange).toHaveBeenCalledWith('Changed');
	});

	it('handleChange does not call onChange when not provided', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Initial',
			})
		);

		result.current.startEditing();

		const event = {
			target: { value: 'Changed' },
		} as React.ChangeEvent<HTMLInputElement>;

		// Should not throw
		act(() => {
			result.current.handleChange(event);
		});
		expect(result.current.editValue).toBe('Changed');
	});
});

describe('useInlineEdit - Saving', () => {
	it('handleKeyDown saves on Enter key', () => {
		const onSave = vi.fn();
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Initial',
				onSave,
			})
		);

		result.current.startEditing();

		const changeEvent = {
			target: { value: 'Changed' },
		} as React.ChangeEvent<HTMLInputElement>;
		act(() => {
			result.current.handleChange(changeEvent);
		});

		const keyEvent = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(keyEvent);
		});

		expect(onSave).toHaveBeenCalledWith('Changed');
		expect(result.current.isEditing).toBe(false);
	});

	it('handleBlur saves when value changed', () => {
		const onSave = vi.fn();
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Initial',
				onSave,
			})
		);

		result.current.startEditing();

		const changeEvent = {
			target: { value: 'Changed' },
		} as React.ChangeEvent<HTMLInputElement>;
		result.current.handleChange(changeEvent);

		const blurEvent = {} as React.FocusEvent<HTMLInputElement>;
		act(() => {
			result.current.handleBlur(blurEvent);
		});

		expect(onSave).toHaveBeenCalledWith('Changed');
		expect(result.current.isEditing).toBe(false);
	});

	it('trims value on save', () => {
		const onSave = vi.fn();
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Initial',
				onSave,
			})
		);

		result.current.startEditing();

		const changeEvent = {
			target: { value: '  Trimmed  ' },
		} as React.ChangeEvent<HTMLInputElement>;
		act(() => {
			result.current.handleChange(changeEvent);
		});

		const keyEvent = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(keyEvent);
		});

		expect(onSave).toHaveBeenCalledWith('Trimmed');
	});

	it('does not save when value unchanged and onCancel is provided', () => {
		const onSave = vi.fn();
		const onCancel = vi.fn();
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Initial',
				onSave,
				onCancel,
			})
		);

		result.current.startEditing();

		// Don't change value
		const blurEvent = {} as React.FocusEvent<HTMLInputElement>;
		act(() => {
			result.current.handleBlur(blurEvent);
		});

		expect(onSave).not.toHaveBeenCalled();
		expect(result.current.isEditing).toBe(false);
	});
});

describe('useInlineEdit - Canceling', () => {
	it('handleKeyDown cancels on Escape key', () => {
		const onCancel = vi.fn();
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Initial',
				onCancel,
			})
		);

		act(() => {
			result.current.startEditing();
		});

		const changeEvent = {
			target: { value: 'Changed' },
		} as React.ChangeEvent<HTMLInputElement>;
		act(() => {
			result.current.handleChange(changeEvent);
		});

		const keyEvent = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(keyEvent);
		});

		expect(onCancel).toHaveBeenCalled();
		expect(result.current.isEditing).toBe(false);
		expect(result.current.editValue).toBe('Initial');
	});

	it('handleKeyDown resets to original value on Escape', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Original',
			})
		);

		act(() => {
			result.current.startEditing();
		});

		const changeEvent = {
			target: { value: 'Changed' },
		} as React.ChangeEvent<HTMLInputElement>;
		act(() => {
			result.current.handleChange(changeEvent);
		});

		const keyEvent = {
			key: 'Escape',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;

		act(() => {
			result.current.handleKeyDown(keyEvent);
		});

		expect(result.current.editValue).toBe('Original');
		expect(result.current.isEditing).toBe(false);
	});
});

describe('useInlineEdit - Controlled Mode', () => {
	it('updates editValue when controlled value changes', () => {
		const { result, rerender } = renderHook(
			({ value }: { value?: string }) =>
				useInlineEdit({
					...(value !== undefined && { value }),
				}),
			{
				initialProps: { value: 'Initial' },
			}
		);

		expect(result.current.editValue).toBe('Initial');

		rerender({ value: 'Updated' });
		// editValue should reflect the new controlled value
		// Note: This depends on implementation - may need to call startEditing
		result.current.startEditing();
		expect(result.current.editValue).toBe('Updated');
	});
});

describe('useInlineEdit - Uncontrolled Mode', () => {
	it('uses defaultValue in uncontrolled mode', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				defaultValue: 'Default',
			})
		);

		expect(result.current.editValue).toBe('Default');
	});

	it('allows editing defaultValue', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				defaultValue: 'Default',
			})
		);

		act(() => {
			result.current.startEditing();
		});

		const changeEvent = {
			target: { value: 'Changed' },
		} as React.ChangeEvent<HTMLInputElement>;
		act(() => {
			result.current.handleChange(changeEvent);
		});

		expect(result.current.editValue).toBe('Changed');
	});
});

describe('useInlineEdit - Edge Cases', () => {
	it('handles empty string value', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				value: '',
			})
		);

		expect(result.current.editValue).toBe('');
		act(() => {
			result.current.startEditing();
		});
		expect(result.current.isEditing).toBe(true);
	});

	it('handles undefined callbacks', () => {
		const { result } = renderHook(() => useInlineEdit({}));

		act(() => {
			result.current.startEditing();
		});

		const changeEvent = {
			target: { value: 'Changed' },
		} as React.ChangeEvent<HTMLInputElement>;
		act(() => {
			result.current.handleChange(changeEvent);
		});

		const keyEvent = {
			key: 'Enter',
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<HTMLInputElement>;
		act(() => {
			result.current.handleKeyDown(keyEvent);
		});

		const blurEvent = {} as React.FocusEvent<HTMLInputElement>;
		act(() => {
			result.current.handleBlur(blurEvent);
		});

		// Should not throw
		expect(result.current.isEditing).toBe(false);
	});

	it('handles rapid state changes', () => {
		const { result } = renderHook(() =>
			useInlineEdit({
				value: 'Initial',
			})
		);

		act(() => {
			result.current.startEditing();
			result.current.stopEditing();
			result.current.startEditing();
			result.current.stopEditing();
		});

		expect(result.current.isEditing).toBe(false);
	});
});
