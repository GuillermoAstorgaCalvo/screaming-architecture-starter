import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * List variant types
 */
export type ListVariant = 'default' | 'bordered' | 'divided';

/**
 * List component props
 */
export interface ListProps extends HTMLAttributes<HTMLUListElement> {
	/** Visual variant of the list @default 'default' */
	variant?: ListVariant;
	/** Size of the list items @default 'md' */
	size?: StandardSize;
	/** List content */
	children: ReactNode;
}

/**
 * ListGroup component props (wrapper for List)
 */
export interface ListGroupProps extends HTMLAttributes<HTMLDivElement> {
	/** List content */
	children: ReactNode;
	/** Optional header content */
	header?: ReactNode;
	/** Optional footer content */
	footer?: ReactNode;
}

/**
 * ListItem component props
 */
export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
	/** List item content */
	children: ReactNode;
	/** Optional leading icon/element */
	leading?: ReactNode;
	/** Optional trailing icon/element */
	trailing?: ReactNode;
	/** Whether the item is clickable/interactive @default false */
	clickable?: boolean;
	/** Whether the item is selected @default false */
	selected?: boolean;
}

/**
 * Sortable list item data
 */
export interface SortableListItem<T = unknown> {
	/** Unique identifier for the item */
	id: string;
	/** Item content/data */
	data: T;
}

/**
 * SortableList component props
 */
export interface SortableListProps<T = unknown>
	extends Omit<HTMLAttributes<HTMLUListElement>, 'onChange'> {
	/** Array of sortable items */
	items: readonly SortableListItem<T>[];
	/** Render function for each item */
	renderItem: (item: SortableListItem<T>, index: number) => ReactNode;
	/** Callback when items are reordered */
	onReorder: (items: readonly SortableListItem<T>[]) => void;
	/** Visual variant of the list @default 'default' */
	variant?: ListVariant;
	/** Size of the list items @default 'md' */
	size?: StandardSize;
	/** Whether to show drag handle @default true */
	showDragHandle?: boolean;
	/** Custom drag handle component */
	dragHandle?: ReactNode;
	/** Whether the list is disabled @default false */
	disabled?: boolean;
	/** Custom aria-label for the sortable list @default 'Sortable list' */
	'aria-label'?: string;
}

/**
 * SortableListItem component props
 */
export interface SortableListItemProps extends HTMLAttributes<HTMLLIElement> {
	/** Item content */
	children: ReactNode;
	/** Unique identifier for the item */
	itemId: string;
	/** Index of the item in the list */
	index: number;
	/** Whether the item is being dragged @default false */
	isDragging?: boolean;
	/** Whether the item is the drag target @default false */
	isDragTarget?: boolean;
	/** Whether to show drag handle @default true */
	showDragHandle?: boolean;
	/** Custom drag handle component */
	dragHandle?: ReactNode;
	/** Whether the list is disabled @default false */
	disabled?: boolean;
}
