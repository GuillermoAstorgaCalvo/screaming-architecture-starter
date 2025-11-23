/**
 * useTagInputState Tests
 *
 * Tests for state management hooks:
 * - useTagState
 * - useInputValueState
 * - useRemoveTagHandler
 */

import {
	useInputValueState,
	useRemoveTagHandler,
	useTagState,
} from '@core/ui/forms/tag-input/hooks/useTagInput.state';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useTagState', () => {
	it('should be a function', () => {
		expect(typeof useTagState).toBe('function');
	});

	it('returns controlled tags when controlledTags is provided', () => {
		const { result } = renderHook(() => useTagState(['tag1', 'tag2'], undefined));

		expect(result.current.tags).toEqual(['tag1', 'tag2']);
		expect(result.current.isControlled).toBe(true);
	});

	it('returns internal tags when controlledTags is undefined', () => {
		const { result } = renderHook(() => useTagState(undefined, ['tag1', 'tag2']));

		expect(result.current.tags).toEqual(['tag1', 'tag2']);
		expect(result.current.isControlled).toBe(false);
	});

	it('initializes with empty array when no defaultTags provided', () => {
		const { result } = renderHook(() => useTagState(undefined, undefined));

		expect(result.current.tags).toEqual([]);
		expect(result.current.isControlled).toBe(false);
	});

	it('allows updating internal tags in uncontrolled mode', () => {
		const { result } = renderHook(() => useTagState(undefined, ['tag1']));

		act(() => {
			result.current.setInternalTags(['tag1', 'tag2']);
		});

		expect(result.current.tags).toEqual(['tag1', 'tag2']);
	});

	it('does not update internal tags in controlled mode', () => {
		const { result } = renderHook(() => useTagState(['tag1'], undefined));

		act(() => {
			result.current.setInternalTags(['tag1', 'tag2']);
		});

		// Tags should still be controlled value
		expect(result.current.tags).toEqual(['tag1']);
	});

	it('updates tags when controlledTags changes', () => {
		const { result, rerender } = renderHook(
			({ controlledTags }: { controlledTags?: string[] }) => useTagState(controlledTags, undefined),
			{
				initialProps: { controlledTags: ['tag1'] },
			}
		);

		expect(result.current.tags).toEqual(['tag1']);

		rerender({ controlledTags: ['tag1', 'tag2'] });
		expect(result.current.tags).toEqual(['tag1', 'tag2']);
	});
});

describe('useInputValueState', () => {
	it('should be a function', () => {
		expect(typeof useInputValueState).toBe('function');
	});

	it('returns controlled value when controlledValue is provided', () => {
		const { result } = renderHook(() => useInputValueState('controlled', undefined, undefined));

		expect(result.current.inputValue).toBe('controlled');
	});

	it('returns defaultValue when controlledValue is undefined', () => {
		const { result } = renderHook(() => useInputValueState(undefined, 'default', undefined));

		expect(result.current.inputValue).toBe('default');
	});

	it('initializes with empty string when no value provided', () => {
		const { result } = renderHook(() => useInputValueState(undefined, undefined, undefined));

		expect(result.current.inputValue).toBe('');
	});

	it('updates inputValue when setInputValue is called', () => {
		const { result } = renderHook(() => useInputValueState(undefined, undefined, undefined));

		act(() => {
			result.current.setInputValue('new value');
		});

		expect(result.current.inputValue).toBe('new value');
	});

	it('calls onValueChange when handleInputChange is called', () => {
		const onValueChange = vi.fn();
		const { result } = renderHook(() => useInputValueState(undefined, undefined, onValueChange));

		act(() => {
			result.current.handleInputChange('new value');
		});

		expect(result.current.inputValue).toBe('new value');
		expect(onValueChange).toHaveBeenCalledWith('new value');
	});

	it('does not call onValueChange when undefined', () => {
		const { result } = renderHook(() => useInputValueState(undefined, undefined, undefined));

		act(() => {
			result.current.handleInputChange('new value');
		});

		expect(result.current.inputValue).toBe('new value');
	});

	it('updates inputValue when controlledValue changes', async () => {
		const { result, rerender } = renderHook(
			({ controlledValue }: { controlledValue?: string }) =>
				useInputValueState(controlledValue, undefined, undefined),
			{
				initialProps: { controlledValue: 'initial' },
			}
		);

		expect(result.current.inputValue).toBe('initial');

		rerender({ controlledValue: 'updated' });
		// Wait for queueMicrotask to complete
		await waitFor(() => {
			expect(result.current.inputValue).toBe('updated');
		});
	});
});

describe('useRemoveTagHandler', () => {
	it('should be a function', () => {
		expect(typeof useRemoveTagHandler).toBe('function');
	});

	it('returns a function', () => {
		const { result } = renderHook(() => useRemoveTagHandler([], undefined));

		expect(typeof result.current).toBe('function');
	});

	it('calls onChange with tags without removed tag', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useRemoveTagHandler(['tag1', 'tag2', 'tag3'], onChange));

		act(() => {
			result.current('tag2');
		});

		expect(onChange).toHaveBeenCalledWith(['tag1', 'tag3']);
	});

	it('updates internal tags in uncontrolled mode', () => {
		const onChange = vi.fn();
		const setInternalTags = vi.fn();
		const { result } = renderHook(() =>
			useRemoveTagHandler(['tag1', 'tag2'], onChange, {
				isControlled: false,
				setInternalTags,
			})
		);

		act(() => {
			result.current('tag1');
		});

		expect(setInternalTags).toHaveBeenCalledWith(['tag2']);
		expect(onChange).toHaveBeenCalledWith(['tag2']);
	});

	it('does not update internal tags in controlled mode', () => {
		const onChange = vi.fn();
		const setInternalTags = vi.fn();
		const { result } = renderHook(() =>
			useRemoveTagHandler(['tag1', 'tag2'], onChange, {
				isControlled: true,
				setInternalTags,
			})
		);

		act(() => {
			result.current('tag1');
		});

		expect(setInternalTags).not.toHaveBeenCalled();
		expect(onChange).toHaveBeenCalledWith(['tag2']);
	});

	it('does not call onChange when undefined', () => {
		const { result } = renderHook(() => useRemoveTagHandler(['tag1', 'tag2'], undefined));

		act(() => {
			result.current('tag1');
		});

		// Should not throw
		expect(result.current).toBeDefined();
	});

	it('handles removing tag that does not exist', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useRemoveTagHandler(['tag1', 'tag2'], onChange));

		act(() => {
			result.current('tag3');
		});

		expect(onChange).toHaveBeenCalledWith(['tag1', 'tag2']);
	});

	it('handles empty tags array', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useRemoveTagHandler([], onChange));

		act(() => {
			result.current('tag1');
		});

		expect(onChange).toHaveBeenCalledWith([]);
	});
});
