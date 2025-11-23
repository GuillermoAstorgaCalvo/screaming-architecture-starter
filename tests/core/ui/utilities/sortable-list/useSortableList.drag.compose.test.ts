/**
 * Tests for useSortableList.drag.compose hook
 *
 * Tests drag event handlers composition:
 * - Handler creation
 * - Handler integration
 */

import { useDragEventHandlers } from '@core/ui/utilities/sortable-list/hooks/useSortableList.drag.compose';
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

const createMockDragState = (draggedItemId: string | null = null) => ({
	draggedItemId,
	dragTargetIndex: null,
	setDraggedItemId: vi.fn(),
	setDragTargetIndex: vi.fn(),
});

const createMockRef = <T>(value: T | null = null) => ({ current: value });

const createMockHandlers = () => ({
	onReorder: vi.fn(),
	resetState: vi.fn(),
});

const renderHookWithDefaults = (
	dragState: ReturnType<typeof createMockDragState>,
	draggedIndexRef: ReturnType<typeof createMockRef<number | null>>,
	handlers: ReturnType<typeof createMockHandlers>
) => {
	return renderHook(() =>
		useDragEventHandlers({
			disabled: false,
			dragState,
			draggedIndexRef,
			items: mockItems,
			onReorder: handlers.onReorder,
			resetState: handlers.resetState,
		})
	);
};

describe('useDragEventHandlers', () => {
	it('returns all drag event handlers', () => {
		const dragState = createMockDragState();
		const draggedIndexRef = createMockRef<number | null>();
		const handlers = createMockHandlers();

		const { result } = renderHookWithDefaults(dragState, draggedIndexRef, handlers);

		expect(typeof result.current.handleDragStart).toBe('function');
		expect(typeof result.current.handleDragEnd).toBe('function');
		expect(typeof result.current.handleDragOver).toBe('function');
		expect(typeof result.current.handleDrop).toBe('function');
	});

	it('creates handlers that call resetState on drag end', () => {
		const dragState = createMockDragState();
		const draggedIndexRef = createMockRef<number | null>();
		const handlers = createMockHandlers();

		const { result } = renderHookWithDefaults(dragState, draggedIndexRef, handlers);

		result.current.handleDragEnd();

		expect(handlers.resetState).toHaveBeenCalled();
	});

	it('creates handlers that use drag state', () => {
		const dragState = createMockDragState('1');
		const draggedIndexRef = createMockRef<number | null>(0);
		const handlers = createMockHandlers();

		const { result } = renderHookWithDefaults(dragState, draggedIndexRef, handlers);

		const dragOverEvent = new DragEvent('dragover', {
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current.handleDragOver(dragOverEvent, 1);

		expect(dragState.setDragTargetIndex).toHaveBeenCalledWith(1);
	});
});
