/**
 * useInlineEdit.state Tests
 *
 * Tests for state management hooks:
 * - useEditingState
 * - useEditValueState
 * - useInlineEditState
 */

import {
	useEditingState,
	useEditValueState,
	useInlineEditState,
} from '@core/ui/forms/inline-edit/hooks/useInlineEdit.state';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useEditingState', () => {
	it('should be a function', () => {
		expect(typeof useEditingState).toBe('function');
	});

	it('returns initial state as not editing', () => {
		const { result } = renderHook(() => useEditingState());

		expect(result.current.isEditing).toBe(false);
		expect(typeof result.current.setIsEditing).toBe('function');
		expect(typeof result.current.startEditing).toBe('function');
		expect(typeof result.current.stopEditing).toBe('function');
	});

	it('setIsEditing updates isEditing state', () => {
		const { result } = renderHook(() => useEditingState());

		expect(result.current.isEditing).toBe(false);

		act(() => {
			result.current.setIsEditing(true);
		});
		expect(result.current.isEditing).toBe(true);

		act(() => {
			result.current.setIsEditing(false);
		});
		expect(result.current.isEditing).toBe(false);
	});

	it('startEditing sets isEditing to true', () => {
		const { result } = renderHook(() => useEditingState());

		expect(result.current.isEditing).toBe(false);

		act(() => {
			result.current.startEditing();
		});
		expect(result.current.isEditing).toBe(true);
	});

	it('stopEditing sets isEditing to false', () => {
		const { result } = renderHook(() => useEditingState());

		act(() => {
			result.current.setIsEditing(true);
		});
		expect(result.current.isEditing).toBe(true);

		act(() => {
			result.current.stopEditing();
		});
		expect(result.current.isEditing).toBe(false);
	});

	it('memoizes startEditing function', () => {
		const { result, rerender } = renderHook(() => useEditingState());

		const fn1 = result.current.startEditing;

		rerender();
		const fn2 = result.current.startEditing;

		expect(fn1).toBe(fn2);
	});

	it('memoizes stopEditing function', () => {
		const { result, rerender } = renderHook(() => useEditingState());

		const fn1 = result.current.stopEditing;

		rerender();
		const fn2 = result.current.stopEditing;

		expect(fn1).toBe(fn2);
	});
});

describe('useEditValueState', () => {
	it('should be a function', () => {
		expect(typeof useEditValueState).toBe('function');
	});

	it('initializes with provided initial value', () => {
		const { result } = renderHook(() => useEditValueState('Initial Value'));

		expect(result.current.editValue).toBe('Initial Value');
		expect(result.current.editValueRef.current).toBe('Initial Value');
		expect(result.current.originalValueRef.current).toBe('Initial Value');
	});

	it('updateEditValue updates editValue and ref', () => {
		const { result } = renderHook(() => useEditValueState('Initial'));

		expect(result.current.editValue).toBe('Initial');

		act(() => {
			result.current.updateEditValue('Updated');
		});
		expect(result.current.editValue).toBe('Updated');
		expect(result.current.editValueRef.current).toBe('Updated');
	});

	it('editValueRef stays in sync with editValue', async () => {
		const { result } = renderHook(() => useEditValueState('Initial'));

		result.current.updateEditValue('Changed');

		// Wait for useEffect to sync
		await waitFor(() => {
			expect(result.current.editValueRef.current).toBe('Changed');
		});
	});

	it('resetToOriginal resets editValue to original', () => {
		const { result } = renderHook(() => useEditValueState('Original'));

		act(() => {
			result.current.updateEditValue('Changed');
		});
		expect(result.current.editValue).toBe('Changed');

		act(() => {
			result.current.resetToOriginal();
		});
		expect(result.current.editValue).toBe('Original');
	});

	it('setOriginalValue updates originalValueRef', () => {
		const { result } = renderHook(() => useEditValueState('Initial'));

		expect(result.current.originalValueRef.current).toBe('Initial');

		result.current.setOriginalValue('New Original');
		expect(result.current.originalValueRef.current).toBe('New Original');
	});

	it('resetToOriginal uses updated original value', () => {
		const { result } = renderHook(() => useEditValueState('Initial'));

		act(() => {
			result.current.setOriginalValue('New Original');
			result.current.updateEditValue('Changed');
		});
		expect(result.current.editValue).toBe('Changed');

		act(() => {
			result.current.resetToOriginal();
		});
		expect(result.current.editValue).toBe('New Original');
	});

	it('handles empty string initial value', () => {
		const { result } = renderHook(() => useEditValueState(''));

		expect(result.current.editValue).toBe('');
		expect(result.current.editValueRef.current).toBe('');
		expect(result.current.originalValueRef.current).toBe('');
	});

	it('memoizes updateEditValue function', () => {
		const { result, rerender } = renderHook(() => useEditValueState('Initial'));

		const fn1 = result.current.updateEditValue;

		rerender();
		const fn2 = result.current.updateEditValue;

		expect(fn1).toBe(fn2);
	});

	it('memoizes resetToOriginal function', () => {
		const { result, rerender } = renderHook(() => useEditValueState('Initial'));

		const fn1 = result.current.resetToOriginal;

		rerender();
		const fn2 = result.current.resetToOriginal;

		expect(fn1).toBe(fn2);
	});

	it('memoizes setOriginalValue function', () => {
		const { result, rerender } = renderHook(() => useEditValueState('Initial'));

		const fn1 = result.current.setOriginalValue;

		rerender();
		const fn2 = result.current.setOriginalValue;

		expect(fn1).toBe(fn2);
	});
});

describe('useInlineEditState', () => {
	it('should be a function', () => {
		expect(typeof useInlineEditState).toBe('function');
	});

	it('returns all expected properties', () => {
		const { result } = renderHook(() =>
			useInlineEditState({
				initialValue: 'Initial',
			})
		);

		expect(result.current).toHaveProperty('isEditing');
		expect(result.current).toHaveProperty('setIsEditing');
		expect(result.current).toHaveProperty('startEditingState');
		expect(result.current).toHaveProperty('stopEditing');
		expect(result.current).toHaveProperty('editValue');
		expect(result.current).toHaveProperty('editValueRef');
		expect(result.current).toHaveProperty('originalValueRef');
		expect(result.current).toHaveProperty('updateEditValue');
		expect(result.current).toHaveProperty('resetToOriginal');
		expect(result.current).toHaveProperty('setOriginalValue');
	});

	it('initializes with provided initial value', () => {
		const { result } = renderHook(() =>
			useInlineEditState({
				initialValue: 'Test Value',
			})
		);

		expect(result.current.editValue).toBe('Test Value');
		expect(result.current.isEditing).toBe(false);
		expect(result.current.editValueRef.current).toBe('Test Value');
		expect(result.current.originalValueRef.current).toBe('Test Value');
	});

	it('manages editing state', () => {
		const { result } = renderHook(() =>
			useInlineEditState({
				initialValue: 'Initial',
			})
		);

		expect(result.current.isEditing).toBe(false);

		act(() => {
			result.current.startEditingState();
		});
		expect(result.current.isEditing).toBe(true);

		act(() => {
			result.current.stopEditing();
		});
		expect(result.current.isEditing).toBe(false);
	});

	it('manages edit value state', () => {
		const { result } = renderHook(() =>
			useInlineEditState({
				initialValue: 'Initial',
			})
		);

		expect(result.current.editValue).toBe('Initial');

		act(() => {
			result.current.updateEditValue('Changed');
		});
		expect(result.current.editValue).toBe('Changed');

		act(() => {
			result.current.resetToOriginal();
		});
		expect(result.current.editValue).toBe('Initial');
	});

	it('integrates editing and value state', () => {
		const { result } = renderHook(() =>
			useInlineEditState({
				initialValue: 'Original',
			})
		);

		// Start editing
		act(() => {
			result.current.startEditingState();
		});
		expect(result.current.isEditing).toBe(true);

		// Change value
		act(() => {
			result.current.updateEditValue('Edited');
		});
		expect(result.current.editValue).toBe('Edited');

		// Cancel (reset and stop editing)
		act(() => {
			result.current.resetToOriginal();
			result.current.stopEditing();
		});
		expect(result.current.editValue).toBe('Original');
		expect(result.current.isEditing).toBe(false);
	});

	it('handles empty string initial value', () => {
		const { result } = renderHook(() =>
			useInlineEditState({
				initialValue: '',
			})
		);

		expect(result.current.editValue).toBe('');
		expect(result.current.isEditing).toBe(false);
	});

	it('updates original value when setOriginalValue is called', () => {
		const { result } = renderHook(() =>
			useInlineEditState({
				initialValue: 'Initial',
			})
		);

		act(() => {
			result.current.setOriginalValue('New Original');
			result.current.updateEditValue('Changed');
		});
		expect(result.current.originalValueRef.current).toBe('New Original');

		act(() => {
			result.current.resetToOriginal();
		});
		expect(result.current.editValue).toBe('New Original');
	});
});
