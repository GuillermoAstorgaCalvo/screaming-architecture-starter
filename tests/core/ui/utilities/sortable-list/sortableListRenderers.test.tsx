/**
 * Tests for sortableListRenderers
 *
 * Tests renderer functions:
 * - getItemDragState
 * - createItemEventHandlers
 * - renderSortableItem
 * - renderSortableItems
 */

import {
	createItemEventHandlers,
	getItemDragState,
	renderSortableItem,
	renderSortableItems,
} from '@core/ui/utilities/sortable-list/helpers/SortableListRenderers';
import type { SortableListItem } from '@src-types/ui/layout/list';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

interface TestItem extends SortableListItem<string> {
	id: string;
	data: string;
}

const mockItems: TestItem[] = [
	{ id: '1', data: 'Item 1' },
	{ id: '2', data: 'Item 2' },
	{ id: '3', data: 'Item 3' },
];

const TEST_ID_ITEM_1 = 'sortable-list-item-1';
const TEST_ID_ITEM_2 = 'sortable-list-item-2';
const TEST_ID_ITEM_3 = 'sortable-list-item-3';

const createMockHandlers = () => ({
	handleDragStart: vi.fn(),
	handleDragEnd: vi.fn(),
	handleDragOver: vi.fn(),
	handleDrop: vi.fn(),
	handleKeyDown: vi.fn(),
});

describe('getItemDragState', () => {
	it('returns correct drag state when item is being dragged', () => {
		const state = getItemDragState({
			item: mockItems[0] as TestItem,
			index: 0,
			draggedItemId: '1',
			dragTargetIndex: null,
		});

		expect(state.isDragging).toBe(true);
		expect(state.isDragTarget).toBe(false);
	});

	it('returns correct drag state when item is drag target', () => {
		const state = getItemDragState({
			item: mockItems[1] as TestItem,
			index: 1,
			draggedItemId: '1',
			dragTargetIndex: 1,
		});

		expect(state.isDragging).toBe(false);
		expect(state.isDragTarget).toBe(true);
	});

	it('returns correct drag state when item is both dragging and target', () => {
		const state = getItemDragState({
			item: mockItems[0] as TestItem,
			index: 0,
			draggedItemId: '1',
			dragTargetIndex: 0,
		});

		expect(state.isDragging).toBe(true);
		expect(state.isDragTarget).toBe(true);
	});

	it('returns false for both states when not dragging', () => {
		const state = getItemDragState({
			item: mockItems[0] as TestItem,
			index: 0,
			draggedItemId: null,
			dragTargetIndex: null,
		});

		expect(state.isDragging).toBe(false);
		expect(state.isDragTarget).toBe(false);
	});
});

describe('createItemEventHandlers', () => {
	it('creates event handlers with correct itemId and index', () => {
		const handlers = {
			handleDragStart: vi.fn(),
			handleDragEnd: vi.fn(),
			handleDragOver: vi.fn(),
			handleDrop: vi.fn(),
			handleKeyDown: vi.fn(),
		};

		const eventHandlers = createItemEventHandlers('test-id', 2, handlers);

		// Test drag start
		eventHandlers.onDragStart();
		expect(handlers.handleDragStart).toHaveBeenCalledWith('test-id', 2);

		// Test drag end
		eventHandlers.onDragEnd();
		expect(handlers.handleDragEnd).toHaveBeenCalled();

		// Test drag over
		const dragOverEvent = new DragEvent('dragover', {
			bubbles: true,
			cancelable: true,
		});
		eventHandlers.onDragOver(dragOverEvent as any);
		expect(handlers.handleDragOver).toHaveBeenCalledWith(dragOverEvent, 2);

		// Test drop
		const dropEvent = new DragEvent('drop', {
			bubbles: true,
			cancelable: true,
		});
		eventHandlers.onDrop(dropEvent as any);
		expect(handlers.handleDrop).toHaveBeenCalledWith(dropEvent, 2);

		// Test key down
		const keyEvent = new KeyboardEvent('keydown', {
			key: 'ArrowDown',
			bubbles: true,
			cancelable: true,
		});
		eventHandlers.onKeyDown(keyEvent as any);
		expect(handlers.handleKeyDown).toHaveBeenCalledWith(keyEvent, 'test-id', 2);
	});
});

const renderItemWithTestId = (item: SortableListItem<unknown>, _index: number) => (
	<div data-testid={`item-${item.id}`}>{(item as TestItem).data}</div>
);

const renderItemBasic = (item: SortableListItem<unknown>, _index: number) => (
	<div>{(item as TestItem).data}</div>
);

const getDefaultItemProps = () => ({
	item: mockItems[0] as TestItem,
	index: 0,
	items: mockItems,
	draggedItemId: null as string | null,
	dragTargetIndex: null as number | null,
	showDragHandle: true,
	disabled: false,
	handlers: createMockHandlers(),
	renderItem: renderItemBasic,
});

const createRenderSortableItemProps = (
	overrides?: Partial<Parameters<typeof renderSortableItem>[0]>
) => ({
	...getDefaultItemProps(),
	...overrides,
});

const renderItemAndGetContainer = (view: React.ReactNode) => {
	renderWithProviders(view as React.ReactElement);
};

describe('renderSortableItem', () => {
	it('renders a sortable item with correct props', () => {
		const view = renderSortableItem(
			createRenderSortableItemProps({
				renderItem: renderItemWithTestId,
			})
		);
		renderItemAndGetContainer(view);

		expect(screen.getByTestId(TEST_ID_ITEM_1)).toBeInTheDocument();
		expect(screen.getByTestId('item-1')).toBeInTheDocument();
		expect(screen.getByText('Item 1')).toBeInTheDocument();
	});
});

describe('renderSortableItem - drag states', () => {
	it('applies dragging state classes', () => {
		const view = renderSortableItem(
			createRenderSortableItemProps({
				draggedItemId: '1',
			})
		);
		renderItemAndGetContainer(view);

		const item = screen.getByTestId(TEST_ID_ITEM_1);
		expect(item).toHaveClass('opacity-disabled');
		expect(item).toHaveClass('scale-95');
	});

	it('applies drag target state classes', () => {
		const view = renderSortableItem(
			createRenderSortableItemProps({
				item: mockItems[1] as TestItem,
				index: 1,
				draggedItemId: '1',
				dragTargetIndex: 1,
			})
		);
		renderItemAndGetContainer(view);

		const item = screen.getByTestId(TEST_ID_ITEM_2);
		expect(item).toHaveClass('ring-2');
		expect(item).toHaveClass('ring-primary');
	});
});

describe('renderSortableItem - drag handle', () => {
	it('hides drag handle when showDragHandle is false', () => {
		const view = renderSortableItem(
			createRenderSortableItemProps({
				showDragHandle: false,
			})
		);
		renderItemAndGetContainer(view);

		expect(screen.queryByTestId('sortable-list-item-drag-handle')).not.toBeInTheDocument();
	});

	it('renders custom drag handle', () => {
		const customHandle = <div data-testid="custom-handle">Custom</div>;
		const view = renderSortableItem(
			createRenderSortableItemProps({
				dragHandle: customHandle,
			})
		);
		renderWithProviders(view as React.ReactElement);

		expect(screen.getByTestId('custom-handle')).toBeInTheDocument();
	});
});

describe('renderSortableItem - disabled state', () => {
	it('applies disabled state', () => {
		const view = renderSortableItem(
			createRenderSortableItemProps({
				disabled: true,
			})
		);
		renderItemAndGetContainer(view);

		const item = screen.getByTestId(TEST_ID_ITEM_1);
		expect(item).toHaveAttribute('draggable', 'false');
		expect(item).toHaveAttribute('tabIndex', '-1');
	});
});

const getDefaultItemsProps = () => ({
	items: mockItems,
	draggedItemId: null as string | null,
	dragTargetIndex: null as number | null,
	showDragHandle: true,
	disabled: false,
	handlers: createMockHandlers(),
	renderItem: renderItemWithTestId,
});

const createRenderSortableItemsProps = (
	overrides?: Partial<Parameters<typeof renderSortableItems>[0]>
) => ({
	...getDefaultItemsProps(),
	...overrides,
});

describe('renderSortableItems', () => {
	it('renders all items', () => {
		const view = renderSortableItems(createRenderSortableItemsProps());

		renderWithProviders(<div>{view}</div>);

		expect(screen.getByTestId('item-1')).toBeInTheDocument();
		expect(screen.getByTestId('item-2')).toBeInTheDocument();
		expect(screen.getByTestId('item-3')).toBeInTheDocument();
	});

	it('handles empty items array', () => {
		const view = renderSortableItems(
			createRenderSortableItemsProps({
				items: [],
				renderItem: (_item, _index) => <div>Item</div>,
			})
		);
		expect(view).toEqual([]);
	});

	it('applies correct drag states to each item', () => {
		const view = renderSortableItems(
			createRenderSortableItemsProps({
				draggedItemId: '1',
				dragTargetIndex: 2,
				renderItem: renderItemBasic,
			})
		);
		renderWithProviders(<div>{view}</div>);

		const firstItem = screen.getByTestId(TEST_ID_ITEM_1);
		const thirdItem = screen.getByTestId(TEST_ID_ITEM_3);

		expect(firstItem).toHaveClass('opacity-disabled');
		expect(thirdItem).toHaveClass('ring-2');
	});
});
