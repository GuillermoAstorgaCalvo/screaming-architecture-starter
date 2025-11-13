import SortableListItem from '@core/ui/utilities/sortable-list/components/SortableListItem';
import type {
	GetItemDragStateParams,
	ItemDragState,
	ItemEventHandlers,
	RenderItemParams,
	RenderItemsParams,
} from '@core/ui/utilities/sortable-list/types/SortableListTypes';
import type { DragEvent, KeyboardEvent, ReactNode } from 'react';

/**
 * Determines the drag state for a specific item
 */
export function getItemDragState<T>({
	item,
	index,
	draggedItemId,
	dragTargetIndex,
}: GetItemDragStateParams<T>): ItemDragState {
	return {
		isDragging: draggedItemId === item.id,
		isDragTarget: dragTargetIndex === index,
	};
}

/**
 * Creates event handlers for a sortable list item
 */
export function createItemEventHandlers(
	itemId: string,
	index: number,
	handlers: ItemEventHandlers
) {
	return {
		onDragStart: () => handlers.handleDragStart(itemId, index),
		onDragEnd: handlers.handleDragEnd,
		onDragOver: (e: DragEvent<HTMLLIElement>) => handlers.handleDragOver(e, index),
		onDrop: (e: DragEvent<HTMLLIElement>) => handlers.handleDrop(e, index),
		onKeyDown: (e: KeyboardEvent<HTMLLIElement>) => handlers.handleKeyDown(e, itemId, index),
	};
}

/**
 * Renders a single sortable list item
 */
export function renderSortableItem<T>({
	item,
	index,
	items,
	draggedItemId,
	dragTargetIndex,
	showDragHandle,
	dragHandle,
	disabled,
	handlers,
	renderItem,
}: RenderItemParams<T>): ReactNode {
	const { isDragging, isDragTarget } = getItemDragState({
		item,
		index,
		draggedItemId,
		dragTargetIndex,
	});

	const eventHandlers = createItemEventHandlers(item.id, index, handlers);

	return (
		<SortableListItem
			key={item.id}
			itemId={item.id}
			index={index}
			isDragging={isDragging}
			isDragTarget={isDragTarget}
			showDragHandle={showDragHandle}
			dragHandle={dragHandle}
			disabled={disabled}
			aria-setsize={items.length}
			aria-posinset={index + 1}
			{...eventHandlers}
		>
			{renderItem(item, index)}
		</SortableListItem>
	);
}

/**
 * Renders all sortable list items
 */
export function renderSortableItems<T>({
	items,
	draggedItemId,
	dragTargetIndex,
	showDragHandle,
	dragHandle,
	disabled,
	handlers,
	renderItem,
}: RenderItemsParams<T>): ReactNode[] {
	return items.map((item, index) =>
		renderSortableItem({
			item,
			index,
			items,
			draggedItemId,
			dragTargetIndex,
			showDragHandle,
			dragHandle,
			disabled,
			handlers,
			renderItem,
		})
	);
}
