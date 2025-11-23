/**
 * useToggleGroup Tests
 *
 * Tests for the useToggleGroup hook including:
 * - Single selection mode
 * - Multiple selection mode
 * - Controlled and uncontrolled modes
 * - Value handling
 * - Toggle handler
 * - Context value structure
 */

import { useToggleGroup } from '@core/ui/forms/toggle/hooks/useToggleGroup';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useToggleGroup - Single Selection Mode', () => {
	it('should be a function', () => {
		expect(typeof useToggleGroup).toBe('function');
	});

	it('returns context value with single type', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'single' }));

		expect(result.current.type).toBe('single');
		expect(result.current.selectedValues).toEqual([]);
		expect(result.current.handleToggle).toBeDefined();
		expect(typeof result.current.handleToggle).toBe('function');
	});

	it('handles single selection in controlled mode', () => {
		const onValueChange = vi.fn();
		const { result } = renderHook(() =>
			useToggleGroup({
				type: 'single',
				value: '',
				onValueChange,
			})
		);

		act(() => {
			result.current.handleToggle('a');
		});

		expect(onValueChange).toHaveBeenCalledWith('a');
		expect(result.current.selectedValues).toEqual([]);
	});

	it('handles single deselection in controlled mode', () => {
		const onValueChange = vi.fn();
		const { result } = renderHook(() =>
			useToggleGroup({
				type: 'single',
				value: 'a',
				onValueChange,
			})
		);

		act(() => {
			result.current.handleToggle('a');
		});

		expect(onValueChange).toHaveBeenCalledWith('');
	});

	it('handles single selection in uncontrolled mode', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'single' }));

		act(() => {
			result.current.handleToggle('a');
		});

		expect(result.current.selectedValues).toEqual(['a']);
	});

	it('handles single deselection in uncontrolled mode', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'single' }));

		act(() => {
			result.current.handleToggle('a');
		});

		act(() => {
			result.current.handleToggle('a');
		});

		expect(result.current.selectedValues).toEqual([]);
	});

	it('switches selection in single mode', () => {
		const onValueChange = vi.fn();
		const { result } = renderHook(() =>
			useToggleGroup({
				type: 'single',
				value: 'a',
				onValueChange,
			})
		);

		act(() => {
			result.current.handleToggle('b');
		});

		expect(onValueChange).toHaveBeenCalledWith('b');
	});
});

describe('useToggleGroup - Multiple Selection Mode', () => {
	it('returns context value with multiple type', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'multiple' }));

		expect(result.current.type).toBe('multiple');
		expect(result.current.selectedValues).toEqual([]);
		expect(result.current.handleToggle).toBeDefined();
	});

	it('handles multiple selection in controlled mode', () => {
		const onValueChange = vi.fn();
		const { result } = renderHook(() =>
			useToggleGroup({
				type: 'multiple',
				value: [],
				onValueChange,
			})
		);

		act(() => {
			result.current.handleToggle('a');
		});

		expect(onValueChange).toHaveBeenCalledWith(['a']);
	});

	it('handles multiple deselection in controlled mode', () => {
		const onValueChange = vi.fn();
		const { result } = renderHook(() =>
			useToggleGroup({
				type: 'multiple',
				value: ['a', 'b'],
				onValueChange,
			})
		);

		act(() => {
			result.current.handleToggle('a');
		});

		expect(onValueChange).toHaveBeenCalledWith(['b']);
	});

	it('handles multiple selection in uncontrolled mode', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'multiple' }));

		act(() => {
			result.current.handleToggle('a');
		});

		act(() => {
			result.current.handleToggle('b');
		});

		expect(result.current.selectedValues).toEqual(['a', 'b']);
	});

	it('handles multiple deselection in uncontrolled mode', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'multiple' }));

		act(() => {
			result.current.handleToggle('a');
		});

		act(() => {
			result.current.handleToggle('b');
		});

		act(() => {
			result.current.handleToggle('a');
		});

		expect(result.current.selectedValues).toEqual(['b']);
	});
});

describe('useToggleGroup - Default Values', () => {
	it('defaults to single type', () => {
		const { result } = renderHook(() => useToggleGroup({}));

		expect(result.current.type).toBe('single');
	});

	it('defaults to default variant', () => {
		const { result } = renderHook(() => useToggleGroup({}));

		expect(result.current.variant).toBe('default');
	});

	it('defaults to md size', () => {
		const { result } = renderHook(() => useToggleGroup({}));

		expect(result.current.size).toBe('md');
	});

	it('defaults to disabled false', () => {
		const { result } = renderHook(() => useToggleGroup({}));

		expect(result.current.groupDisabled).toBe(false);
	});
});

describe('useToggleGroup - Variants and Sizes', () => {
	it('applies variant to context', () => {
		const { result } = renderHook(() => useToggleGroup({ variant: 'outline' }));

		expect(result.current.variant).toBe('outline');
	});

	it('applies size to context', () => {
		const { result } = renderHook(() => useToggleGroup({ size: 'lg' }));

		expect(result.current.size).toBe('lg');
	});

	it('applies disabled to context', () => {
		const { result } = renderHook(() => useToggleGroup({ disabled: true }));

		expect(result.current.groupDisabled).toBe(true);
	});
});

describe('useToggleGroup - Context Value Structure', () => {
	it('returns all required properties', () => {
		const { result } = renderHook(() => useToggleGroup({}));

		expect(result.current).toHaveProperty('type');
		expect(result.current).toHaveProperty('selectedValues');
		expect(result.current).toHaveProperty('handleToggle');
		expect(result.current).toHaveProperty('variant');
		expect(result.current).toHaveProperty('size');
		expect(result.current).toHaveProperty('groupDisabled');
	});

	it('returns selectedValues as array', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'single', value: 'a' }));

		expect(Array.isArray(result.current.selectedValues)).toBe(true);
		expect(result.current.selectedValues).toEqual(['a']);
	});

	it('converts single value to array', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'single', value: 'a' }));

		expect(result.current.selectedValues).toEqual(['a']);
	});

	it('converts array value correctly', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'multiple', value: ['a', 'b'] }));

		expect(result.current.selectedValues).toEqual(['a', 'b']);
	});

	it('handles empty string in single mode', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'single', value: '' }));

		expect(result.current.selectedValues).toEqual([]);
	});

	it('handles empty array in multiple mode', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'multiple', value: [] }));

		expect(result.current.selectedValues).toEqual([]);
	});
});

describe('useToggleGroup - Edge Cases', () => {
	it('handles undefined value in single mode', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'single' }));

		expect(result.current.selectedValues).toEqual([]);
	});

	it('handles undefined value in multiple mode', () => {
		const { result } = renderHook(() => useToggleGroup({ type: 'multiple' }));

		expect(result.current.selectedValues).toEqual([]);
	});

	it('handles multiple toggles in sequence', () => {
		const onValueChange = vi.fn();
		const { result, rerender } = renderHook<ReturnType<typeof useToggleGroup>, { value: string[] }>(
			({ value }) =>
				useToggleGroup({
					type: 'multiple',
					value,
					onValueChange,
				}),
			{
				initialProps: { value: [] as string[] },
			}
		);

		act(() => {
			result.current.handleToggle('a');
		});

		// Simulate parent updating the value
		rerender({ value: ['a'] as string[] });

		act(() => {
			result.current.handleToggle('b');
		});

		// Simulate parent updating the value
		rerender({ value: ['a', 'b'] as string[] });

		act(() => {
			result.current.handleToggle('c');
		});

		expect(onValueChange).toHaveBeenCalledTimes(3);
		expect(onValueChange).toHaveBeenNthCalledWith(1, ['a']);
		expect(onValueChange).toHaveBeenNthCalledWith(2, ['a', 'b']);
		expect(onValueChange).toHaveBeenNthCalledWith(3, ['a', 'b', 'c']);
	});
});
