/**
 * Tests for useSortableList hook
 *
 * Tests the main hook:
 * - Initial state
 * - Drag handlers integration
 * - Keyboard handlers integration
 * - Combined functionality
 */

import { useSortableList } from '@core/ui/utilities/sortable-list/hooks/useSortableList';
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

describe('useSortableList - Initial State', () => {
	it('returns initial state', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
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
		expect(typeof result.current.handleKeyDown).toBe('function');
	});
});

describe('useSortableList - Drag Handlers - Basic drag operations', () => {
	it('handles drag start', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
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

	it('handles drag end', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
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

describe('useSortableList - Drag Handlers - Drag interactions', () => {
	it('handles drag over', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
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

	it('handles drop and reorders items', async () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
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
	});
});

describe('useSortableList - Keyboard Handlers - Arrow key navigation', () => {
	it('handles ArrowUp key', async () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		const keyEvent = new KeyboardEvent('keydown', {
			key: 'ArrowUp',
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current.handleKeyDown(keyEvent, '2', 1);

		await waitFor(() => {
			expect(onReorder).toHaveBeenCalled();
		});

		const reorderedItems = onReorder.mock.calls[0]?.[0];
		expect(reorderedItems[0].id).toBe('2');
	});

	it('handles ArrowDown key', async () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		const keyEvent = new KeyboardEvent('keydown', {
			key: 'ArrowDown',
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current.handleKeyDown(keyEvent, '1', 0);

		await waitFor(() => {
			expect(onReorder).toHaveBeenCalled();
		});

		const reorderedItems = onReorder.mock.calls[0]?.[0];
		expect(reorderedItems[1].id).toBe('1');
	});
});

describe('useSortableList - Keyboard Handlers - Home/End navigation', () => {
	it('handles Home key', async () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		const keyEvent = new KeyboardEvent('keydown', {
			key: 'Home',
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current.handleKeyDown(keyEvent, '3', 2);

		await waitFor(() => {
			expect(onReorder).toHaveBeenCalled();
		});

		const reorderedItems = onReorder.mock.calls[0]?.[0];
		expect(reorderedItems[0].id).toBe('3');
	});

	it('handles End key', async () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
				items: mockItems,
				onReorder,
				disabled: false,
			})
		);

		const keyEvent = new KeyboardEvent('keydown', {
			key: 'End',
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current.handleKeyDown(keyEvent, '1', 0);

		await waitFor(() => {
			expect(onReorder).toHaveBeenCalled();
		});

		const reorderedItems = onReorder.mock.calls[0]?.[0];
		expect(reorderedItems[2].id).toBe('1');
	});
});

describe('useSortableList - Keyboard Handlers - Disabled state', () => {
	it('does not handle keyboard navigation when disabled', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
				items: mockItems,
				onReorder,
				disabled: true,
			})
		);

		const keyEvent = new KeyboardEvent('keydown', {
			key: 'ArrowDown',
			bubbles: true,
			cancelable: true,
		}) as any;

		result.current.handleKeyDown(keyEvent, '1', 0);

		expect(onReorder).not.toHaveBeenCalled();
	});
});

describe('useSortableList - Disabled State', () => {
	it('does not handle drag start when disabled', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
				items: mockItems,
				onReorder,
				disabled: true,
			})
		);

		result.current.handleDragStart('1', 0);

		expect(result.current.draggedItemId).toBeNull();
	});

	it('does not handle drag over when disabled', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
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

	it('does not handle drop when disabled', () => {
		const onReorder = vi.fn();

		const { result } = renderHook(() =>
			useSortableList({
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
