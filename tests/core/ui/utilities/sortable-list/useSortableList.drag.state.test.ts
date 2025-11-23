/**
 * Tests for useSortableList.drag.state hook
 *
 * Tests drag state management:
 * - Initial state
 * - State updates
 */

import { useDragState } from '@core/ui/utilities/sortable-list/hooks/useSortableList.drag.state';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useDragState', () => {
	it('returns initial state', () => {
		const { result } = renderHook(() => useDragState());

		expect(result.current.draggedItemId).toBeNull();
		expect(result.current.dragTargetIndex).toBeNull();
		expect(typeof result.current.setDraggedItemId).toBe('function');
		expect(typeof result.current.setDragTargetIndex).toBe('function');
	});

	it('updates draggedItemId', () => {
		const { result } = renderHook(() => useDragState());

		act(() => {
			result.current.setDraggedItemId('item-1');
		});

		expect(result.current.draggedItemId).toBe('item-1');
	});

	it('updates dragTargetIndex', () => {
		const { result } = renderHook(() => useDragState());

		act(() => {
			result.current.setDragTargetIndex(2);
		});

		expect(result.current.dragTargetIndex).toBe(2);
	});

	it('can reset draggedItemId to null', () => {
		const { result } = renderHook(() => useDragState());

		act(() => {
			result.current.setDraggedItemId('item-1');
		});

		expect(result.current.draggedItemId).toBe('item-1');

		act(() => {
			result.current.setDraggedItemId(null);
		});

		expect(result.current.draggedItemId).toBeNull();
	});

	it('can reset dragTargetIndex to null', () => {
		const { result } = renderHook(() => useDragState());

		act(() => {
			result.current.setDragTargetIndex(2);
		});

		expect(result.current.dragTargetIndex).toBe(2);

		act(() => {
			result.current.setDragTargetIndex(null);
		});

		expect(result.current.dragTargetIndex).toBeNull();
	});

	it('can update both states independently', () => {
		const { result } = renderHook(() => useDragState());

		act(() => {
			result.current.setDraggedItemId('item-1');
			result.current.setDragTargetIndex(2);
		});

		expect(result.current.draggedItemId).toBe('item-1');
		expect(result.current.dragTargetIndex).toBe(2);
	});
});
