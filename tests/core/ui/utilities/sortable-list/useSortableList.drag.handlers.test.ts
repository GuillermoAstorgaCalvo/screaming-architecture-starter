/**
 * Tests for useSortableList.drag.handlers hook
 *
 * Tests individual drag handlers:
 * - useDragStartHandler
 * - useDragEndHandler
 * - useDragOverHandler
 * - useDropHandler
 */

import {
	useDragEndHandler,
	useDragOverHandler,
	useDragStartHandler,
	useDropHandler,
} from '@core/ui/utilities/sortable-list/hooks/useSortableList.drag.handlers';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

interface TestItem {
	id: string;
	data: string;
}

const mockItems: TestItem[] = [
	{ id: '1', data: 'Item 1' },
	{ id: '2', data: 'Item 2' },
];

const TEST_ITEM_ID = 'item-1';
const TEST_DESCRIPTION_DISABLED = 'does not call logic when disabled';

describe('useDragStartHandler', () => {
	it('creates handler that calls drag start logic', () => {
		const setDraggedItemId = vi.fn();
		const draggedIndexRef = { current: null };

		const { result } = renderHook(() =>
			useDragStartHandler({
				disabled: false,
				setDraggedItemId,
				draggedIndexRef,
			})
		);

		result.current(TEST_ITEM_ID, 0);

		expect(setDraggedItemId).toHaveBeenCalledWith(TEST_ITEM_ID);
		expect(draggedIndexRef.current).toBe(0);
	});

	it(TEST_DESCRIPTION_DISABLED, () => {
		const setDraggedItemId = vi.fn();
		const draggedIndexRef = { current: null };

		const { result } = renderHook(() =>
			useDragStartHandler({
				disabled: true,
				setDraggedItemId,
				draggedIndexRef,
			})
		);

		result.current(TEST_ITEM_ID, 0);

		expect(setDraggedItemId).not.toHaveBeenCalled();
		expect(draggedIndexRef.current).toBeNull();
	});
});

describe('useDragEndHandler', () => {
	it('creates handler that calls resetState', () => {
		const resetState = vi.fn();

		const { result } = renderHook(() => useDragEndHandler(resetState));

		result.current();

		expect(resetState).toHaveBeenCalled();
	});
});

describe('useDragOverHandler', () => {
	it('creates handler that prevents default and calls logic', () => {
		const setDragTargetIndex = vi.fn();
		const draggedIndexRef = { current: 0 };

		const { result } = renderHook(() =>
			useDragOverHandler({
				disabled: false,
				draggedItemId: TEST_ITEM_ID,
				setDragTargetIndex,
				draggedIndexRef,
			})
		);

		const dragOverEvent = new DragEvent('dragover', {
			bubbles: true,
			cancelable: true,
		}) as any;

		const preventDefaultSpy = vi.spyOn(dragOverEvent, 'preventDefault');
		const stopPropagationSpy = vi.spyOn(dragOverEvent, 'stopPropagation');

		result.current(dragOverEvent, 1);

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(stopPropagationSpy).toHaveBeenCalled();
		expect(setDragTargetIndex).toHaveBeenCalledWith(1);
	});

	it(TEST_DESCRIPTION_DISABLED, () => {
		const setDragTargetIndex = vi.fn();
		const draggedIndexRef = { current: 0 };

		const { result } = renderHook(() =>
			useDragOverHandler({
				disabled: true,
				draggedItemId: TEST_ITEM_ID,
				setDragTargetIndex,
				draggedIndexRef,
			})
		);

		const dragOverEvent = new DragEvent('dragover', {
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current(dragOverEvent, 1);

		expect(setDragTargetIndex).not.toHaveBeenCalled();
	});
});

describe('useDropHandler', () => {
	it('creates handler that prevents default and calls logic', () => {
		const onReorder = vi.fn();
		const resetState = vi.fn();
		const draggedIndexRef = { current: 0 };

		const { result } = renderHook(() =>
			useDropHandler({
				disabled: false,
				draggedItemId: TEST_ITEM_ID,
				items: mockItems,
				onReorder,
				resetState,
				draggedIndexRef,
			})
		);

		const dropEvent = new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
		}) as any;

		const preventDefaultSpy = vi.spyOn(dropEvent, 'preventDefault');
		const stopPropagationSpy = vi.spyOn(dropEvent, 'stopPropagation');

		result.current(dropEvent, 1);

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(stopPropagationSpy).toHaveBeenCalled();
		expect(onReorder).toHaveBeenCalled();
		expect(resetState).toHaveBeenCalled();
	});

	it(TEST_DESCRIPTION_DISABLED, () => {
		const onReorder = vi.fn();
		const resetState = vi.fn();
		const draggedIndexRef = { current: 0 };

		const { result } = renderHook(() =>
			useDropHandler({
				disabled: true,
				draggedItemId: TEST_ITEM_ID,
				items: mockItems,
				onReorder,
				resetState,
				draggedIndexRef,
			})
		);

		const dropEvent = new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current(dropEvent, 1);

		expect(onReorder).not.toHaveBeenCalled();
		expect(resetState).not.toHaveBeenCalled();
	});
});
