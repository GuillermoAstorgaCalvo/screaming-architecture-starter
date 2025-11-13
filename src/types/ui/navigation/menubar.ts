import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Menubar submenu item data
 */
export interface MenubarSubmenuItem {
	/** Unique identifier for the submenu item */
	id: string;
	/** Submenu item label */
	label: ReactNode;
	/** Optional icon for the submenu item */
	icon?: ReactNode;
	/** Optional keyboard shortcut display */
	shortcut?: string;
	/** Whether the submenu item is disabled @default false */
	disabled?: boolean;
	/** Optional callback when submenu item is selected */
	onSelect?: () => void | Promise<void>;
}

/**
 * Menubar submenu separator
 */
export interface MenubarSubmenuSeparator {
	/** Unique identifier for the separator */
	id: string;
	/** Separator type */
	type: 'separator';
}

/**
 * Menubar submenu item or separator
 */
export type MenubarSubmenuItemOrSeparator = MenubarSubmenuItem | MenubarSubmenuSeparator;

/**
 * Menubar item data
 */
export interface MenubarItem {
	/** Unique identifier for the item */
	id: string;
	/** Item label */
	label: ReactNode;
	/** Optional icon for the item */
	icon?: ReactNode;
	/** Optional keyboard shortcut display */
	shortcut?: string;
	/** Whether the item is disabled @default false */
	disabled?: boolean;
	/** Optional submenu items */
	submenu?: readonly MenubarSubmenuItemOrSeparator[];
	/** Optional callback when item is selected (for items without submenu) */
	onSelect?: () => void | Promise<void>;
}

/**
 * Menubar component props
 */
export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of menubar items */
	items: readonly MenubarItem[];
}
