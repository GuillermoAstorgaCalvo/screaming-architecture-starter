import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Navigation Menu variant types
 */
export type NavigationMenuVariant = 'default' | 'underline' | 'pills';

/**
 * Navigation Menu item data
 */
export interface NavigationMenuItem {
	/** Unique identifier for the item */
	id: string;
	/** Item label */
	label: ReactNode;
	/** Optional link destination */
	to?: string;
	/** Optional icon for the item */
	icon?: ReactNode;
	/** Whether the item is disabled @default false */
	disabled?: boolean;
}

/**
 * Navigation Menu component props
 */
export interface NavigationMenuProps extends HTMLAttributes<HTMLElement> {
	/** Array of navigation menu items */
	items: readonly NavigationMenuItem[];
	/** ID of the currently active item */
	activeItemId: string;
	/** Callback when item changes */
	onItemChange: (itemId: string) => void;
	/** Visual variant of the navigation menu @default 'default' */
	variant?: NavigationMenuVariant;
	/** Size of the navigation menu @default 'md' */
	size?: StandardSize;
	/** Orientation of the navigation menu @default 'horizontal' */
	orientation?: 'horizontal' | 'vertical';
}
