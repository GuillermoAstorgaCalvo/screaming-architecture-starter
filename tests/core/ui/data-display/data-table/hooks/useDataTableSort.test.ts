/**
 * useDataTableSort Tests
 *
 * Tests for the useDataTableSort hook:
 * - Initial state setup
 * - Setting sort
 * - Toggling sort
 * - Clearing sort
 * - Sort state transitions
 */

import { useDataTableSort } from '@core/ui/data-display/data-table/hooks/useDataTableSort';
import type { ColumnSort } from '@src-types/ui/dataTable';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface TestData {
	id: string;
	name: string;
	age: number;
}

describe('useDataTableSort', () => {
	describe('initial state', () => {
		it('should initialize with null sort', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			expect(result.current.sort).toBeNull();
		});

		it('should initialize with provided initialSort', () => {
			const initialSort: ColumnSort<TestData> = {
				columnId: 'name',
				direction: 'asc',
			};

			const { result } = renderHook(() => useDataTableSort<TestData>({ initialSort }));

			expect(result.current.sort).toEqual(initialSort);
		});

		it('should initialize with provided initialSort with desc direction', () => {
			const initialSort: ColumnSort<TestData> = {
				columnId: 'age',
				direction: 'desc',
			};

			const { result } = renderHook(() => useDataTableSort<TestData>({ initialSort }));

			expect(result.current.sort).toEqual(initialSort);
		});
	});

	describe('setSort', () => {
		it('should set sort for a column with asc direction', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			expect(result.current.sort).toEqual({
				columnId: 'name',
				direction: 'asc',
			});
		});

		it('should set sort for a column with desc direction', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('age', 'desc');
			});

			expect(result.current.sort).toEqual({
				columnId: 'age',
				direction: 'desc',
			});
		});

		it('should default to asc direction when not specified', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name');
			});

			expect(result.current.sort).toEqual({
				columnId: 'name',
				direction: 'asc',
			});
		});

		it('should clear sort when columnId is null', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			act(() => {
				result.current.setSort(null);
			});

			expect(result.current.sort).toBeNull();
		});

		it('should update sort when setting different column', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			act(() => {
				result.current.setSort('age', 'desc');
			});

			expect(result.current.sort).toEqual({
				columnId: 'age',
				direction: 'desc',
			});
		});

		it('should update sort direction for same column', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			act(() => {
				result.current.setSort('name', 'desc');
			});

			expect(result.current.sort).toEqual({
				columnId: 'name',
				direction: 'desc',
			});
		});

		it('should call onSortChange when provided', () => {
			const onSortChange = vi.fn();
			const { result } = renderHook(() => useDataTableSort<TestData>({ onSortChange }));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			expect(onSortChange).toHaveBeenCalledTimes(1);
			expect(onSortChange).toHaveBeenCalledWith({
				columnId: 'name',
				direction: 'asc',
			});
		});

		it('should call onSortChange with null when clearing sort', () => {
			const onSortChange = vi.fn();
			const { result } = renderHook(() => useDataTableSort<TestData>({ onSortChange }));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			act(() => {
				result.current.setSort(null);
			});

			expect(onSortChange).toHaveBeenCalledTimes(2);
			expect(onSortChange).toHaveBeenNthCalledWith(2, null);
		});
	});

	describe('toggleSort', () => {
		it('should set sort to asc when no sort is active', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.toggleSort('name');
			});

			expect(result.current.sort).toEqual({
				columnId: 'name',
				direction: 'asc',
			});
		});

		it('should toggle from asc to desc for same column', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			act(() => {
				result.current.toggleSort('name');
			});

			expect(result.current.sort).toEqual({
				columnId: 'name',
				direction: 'desc',
			});
		});

		it('should toggle from desc to null for same column', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'desc');
			});

			act(() => {
				result.current.toggleSort('name');
			});

			expect(result.current.sort).toBeNull();
		});

		it('should set sort to asc when toggling different column', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			act(() => {
				result.current.toggleSort('age');
			});

			expect(result.current.sort).toEqual({
				columnId: 'age',
				direction: 'asc',
			});
		});

		it('should cycle through states: null -> asc -> desc -> null', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			// Start with null
			expect(result.current.sort).toBeNull();

			// Toggle to asc
			act(() => {
				result.current.toggleSort('name');
			});
			expect(result.current.sort?.direction).toBe('asc');

			// Toggle to desc
			act(() => {
				result.current.toggleSort('name');
			});
			expect(result.current.sort?.direction).toBe('desc');

			// Toggle to null
			act(() => {
				result.current.toggleSort('name');
			});
			expect(result.current.sort).toBeNull();
		});

		it('should call onSortChange when toggling', () => {
			const onSortChange = vi.fn();
			const { result } = renderHook(() => useDataTableSort<TestData>({ onSortChange }));

			act(() => {
				result.current.toggleSort('name');
			});

			expect(onSortChange).toHaveBeenCalledTimes(1);
			expect(onSortChange).toHaveBeenCalledWith({
				columnId: 'name',
				direction: 'asc',
			});
		});

		it('should call onSortChange with null when toggling from desc', () => {
			const onSortChange = vi.fn();
			const { result } = renderHook(() => useDataTableSort<TestData>({ onSortChange }));

			act(() => {
				result.current.setSort('name', 'desc');
			});

			act(() => {
				result.current.toggleSort('name');
			});

			expect(onSortChange).toHaveBeenCalledTimes(2);
			expect(onSortChange).toHaveBeenNthCalledWith(2, null);
		});
	});

	describe('clearSort', () => {
		it('should clear sort when sort is active', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			act(() => {
				result.current.clearSort();
			});

			expect(result.current.sort).toBeNull();
		});

		it('should not throw when clearing already null sort', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.clearSort();
			});

			expect(result.current.sort).toBeNull();
		});

		it('should call onSortChange with null when clearing', () => {
			const onSortChange = vi.fn();
			const { result } = renderHook(() => useDataTableSort<TestData>({ onSortChange }));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			act(() => {
				result.current.clearSort();
			});

			expect(onSortChange).toHaveBeenCalledTimes(2);
			expect(onSortChange).toHaveBeenNthCalledWith(2, null);
		});
	});

	describe('sort state transitions', () => {
		it('should handle rapid toggles', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.toggleSort('name');
			});

			act(() => {
				result.current.toggleSort('name');
			});

			act(() => {
				result.current.toggleSort('name');
			});

			expect(result.current.sort).toBeNull();
		});

		it('should handle switching between multiple columns', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
			});
			expect(result.current.sort?.columnId).toBe('name');

			act(() => {
				result.current.setSort('age', 'desc');
			});
			expect(result.current.sort?.columnId).toBe('age');

			act(() => {
				result.current.setSort('name', 'desc');
			});
			expect(result.current.sort?.columnId).toBe('name');
		});

		it('should maintain sort state across multiple operations', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
			});
			expect(result.current.sort?.direction).toBe('asc');

			act(() => {
				result.current.toggleSort('name');
			});
			expect(result.current.sort?.direction).toBe('desc');

			act(() => {
				result.current.clearSort();
			});
			expect(result.current.sort).toBeNull();

			act(() => {
				result.current.setSort('age', 'asc');
			});
			expect(result.current.sort?.columnId).toBe('age');
		});
	});

	describe('edge cases', () => {
		it('should handle empty string columnId', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('', 'asc');
			});

			expect(result.current.sort?.columnId).toBe('');
		});

		it('should handle special characters in columnId', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('column-name_123', 'asc');
			});

			expect(result.current.sort?.columnId).toBe('column-name_123');
		});

		it('should maintain stable function references', () => {
			const { result, rerender } = renderHook(() => useDataTableSort<TestData>({}));

			const { setSort, toggleSort, clearSort } = result.current;

			rerender();

			expect(result.current.setSort).toBe(setSort);
			expect(result.current.toggleSort).toBe(toggleSort);
			expect(result.current.clearSort).toBe(clearSort);
		});

		it('should handle onSortChange being undefined', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
			});

			expect(result.current.sort).toEqual({
				columnId: 'name',
				direction: 'asc',
			});
		});

		it('should handle multiple rapid setSort calls', () => {
			const { result } = renderHook(() => useDataTableSort<TestData>({}));

			act(() => {
				result.current.setSort('name', 'asc');
				result.current.setSort('age', 'desc');
				result.current.setSort('name', 'desc');
			});

			expect(result.current.sort).toEqual({
				columnId: 'name',
				direction: 'desc',
			});
		});
	});

	describe('integration with onSortChange', () => {
		it('should call onSortChange for all sort operations', () => {
			const onSortChange = vi.fn();
			const { result } = renderHook(() => useDataTableSort<TestData>({ onSortChange }));

			act(() => {
				result.current.setSort('name', 'asc');
			});
			expect(onSortChange).toHaveBeenCalledTimes(1);

			act(() => {
				result.current.toggleSort('name');
			});
			expect(onSortChange).toHaveBeenCalledTimes(2);

			act(() => {
				result.current.clearSort();
			});
			expect(onSortChange).toHaveBeenCalledTimes(3);
		});

		it('should pass correct sort state to onSortChange', () => {
			const onSortChange = vi.fn();
			const { result } = renderHook(() => useDataTableSort<TestData>({ onSortChange }));

			act(() => {
				result.current.setSort('name', 'asc');
			});
			expect(onSortChange).toHaveBeenLastCalledWith({
				columnId: 'name',
				direction: 'asc',
			});

			act(() => {
				result.current.toggleSort('name');
			});
			expect(onSortChange).toHaveBeenLastCalledWith({
				columnId: 'name',
				direction: 'desc',
			});

			act(() => {
				result.current.toggleSort('name');
			});
			expect(onSortChange).toHaveBeenLastCalledWith(null);
		});
	});
});
