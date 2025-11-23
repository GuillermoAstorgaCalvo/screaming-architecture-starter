/**
 * Tests for useSortableList.drag hook
 *
 * Tests drag handlers hook:
 * - Drag state management
 * - Event handlers
 * - State reset
 */

import { useDragHandlers } from '@core/ui/utilities/sortable-list/hooks/useSortableList.drag';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface TestItem {
	id: string;
	data: string;
}

const mockItems: TestItem[] = [
	{ id: '1', data: 'Item 1' },
	{ id: '2', data: 'Item 2' },
	{ id: '3', data: 'Item 3' },
];

describe('useDragHandlers - Initial State', () => {
	it('returns initial drag state', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		expect(result.current.draggedItemId).toBeNull();
		expect(result.current.dragTargetIndex).toBeNull();
		expect(typeof result.current.handleDragStart).toBe('function');
		expect(typeof result.current.handleDragEnd).toBe('function');
		expect(typeof result.current.handleDragOver).toBe('function');
		expect(typeof result.current.handleDrop).toBe('function');
	});
});

describe('useDragHandlers - Drag Start', () => {
	it('sets dragged item ID and index', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleDragStart('1', 0);
		});

		expect(result.current.draggedItemId).toBe('1');
	});

	it('does not set state when disabled', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: true,
			})
		);

		result.current.handleDragStart('1', 0);

		expect(result.current.draggedItemId).toBeNull();
	});
});

describe('useDragHandlers - Drag End', () => {
	it('resets drag state', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleDragStart('1', 0);
		});
		expect(result.current.draggedItemId).toBe('1');

		act(() => {
			result.current.handleDragEnd();
		});

		expect(result.current.draggedItemId).toBeNull();
		expect(result.current.dragTargetIndex).toBeNull();
	});
});

describe('useDragHandlers - Drag Over - target index management', () => {
	it('sets drag target index', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleDragStart('1', 0);
		});

		const dragOverEvent = new DragEvent('dragover', {
			bubbles: true,
			cancelable: true,
		}) as any;

		act(() => {
			result.current.handleDragOver(dragOverEvent, 2);
		});

		expect(result.current.dragTargetIndex).toBe(2);
	});

	it('clears drag target index when same as dragged index', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		result.current.handleDragStart('1', 0);

		const dragOverEvent = new DragEvent('dragover', {
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current.handleDragOver(dragOverEvent, 0);

		expect(result.current.dragTargetIndex).toBeNull();
	});
});

describe('useDragHandlers - Drag Over - event handling', () => {
	it('prevents default on drag over', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		result.current.handleDragStart('1', 0);

		const dragOverEvent = new DragEvent('dragover', {
			bubbles: true,
			cancelable: true,
		}) as any;

		const preventDefaultSpy = vi.spyOn(dragOverEvent, 'preventDefault');
		const stopPropagationSpy = vi.spyOn(dragOverEvent, 'stopPropagation');

		result.current.handleDragOver(dragOverEvent, 2);

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(stopPropagationSpy).toHaveBeenCalled();
	});
});

describe('useDragHandlers - Drag Over - disabled state', () => {
	it('does not set state when disabled', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: true,
			})
		);

		const dragOverEvent = new DragEvent('dragover', {
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current.handleDragOver(dragOverEvent, 2);

		expect(result.current.dragTargetIndex).toBeNull();
	});
});

describe('useDragHandlers - Drop - successful drop', () => {
	it('reorders items and resets state', async () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleDragStart('1', 0);
		});

		const dropEvent = new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
		}) as any;

		act(() => {
			result.current.handleDrop(dropEvent, 2);
		});

		await waitFor(() => {
			expect(onReorder).toHaveBeenCalled();
		});

		const reorderedItems = onReorder.mock.calls[0]?.[0];
		expect(reorderedItems).toBeDefined();
		expect(reorderedItems.length).toBe(mockItems.length);
		expect(reorderedItems[2].id).toBe('1');

		expect(result.current.draggedItemId).toBeNull();
		expect(result.current.dragTargetIndex).toBeNull();
	});
});

describe('useDragHandlers - Drop - edge cases', () => {
	it('does not reorder when same index', async () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		act(() => {
			result.current.handleDragStart('1', 1);
		});

		const dropEvent = new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
		}) as any;

		act(() => {
			result.current.handleDrop(dropEvent, 1);
		});

		await waitFor(() => {
			expect(onReorder).not.toHaveBeenCalled();
		});

		expect(result.current.draggedItemId).toBeNull();
		expect(result.current.dragTargetIndex).toBeNull();
	});

	it('does not reorder when disabled', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: true,
			})
		);

		const dropEvent = new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current.handleDrop(dropEvent, 2);

		expect(onReorder).not.toHaveBeenCalled();
	});
});

describe('useDragHandlers - Drop - event handling', () => {
	it('prevents default on drop', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useDragHandlers({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		result.current.handleDragStart('1', 0);

		const dropEvent = new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
		}) as any;

		const preventDefaultSpy = vi.spyOn(dropEvent, 'preventDefault');
		const stopPropagationSpy = vi.spyOn(dropEvent, 'stopPropagation');

		result.current.handleDrop(dropEvent, 2);

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(stopPropagationSpy).toHaveBeenCalled();
	});
});
