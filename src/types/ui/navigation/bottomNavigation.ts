import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Bottom Navigation item data
 */
export interface BottomNavigationItem {
	/** Unique identifier for the item */
	id: string;
	/** Item label */
	label: string;
	/** Icon for the item */
	icon: ReactNode;
	/** Optional badge count */
	badge?: number | string;
	/** Whether the item is disabled @default false */
	disabled?: boolean;
	/** Optional link destination */
	to?: string;
}

/**
 * Bottom Navigation component props
 */
export interface BottomNavigationProps extends HTMLAttributes<HTMLElement> {
	/** Array of navigation items */
	items: readonly BottomNavigationItem[];
	/** ID of the currently active item */
	activeItemId: string;
	/** Callback when item changes */
	onItemChange: (itemId: string) => void;
	/** Size of the navigation items @default 'md' */
	size?: StandardSize;
	/** Whether to show labels @default true */
	showLabels?: boolean;
	/** Custom className for the container */
	className?: string;
}
