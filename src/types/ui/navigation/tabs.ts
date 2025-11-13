import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Tabs variant types
 */
export type TabsVariant = 'default' | 'pills' | 'underline';

/**
 * Tab item data
 */
export interface TabItem {
	/** Unique identifier for the tab */
	id: string;
	/** Tab label */
	label: ReactNode;
	/** Tab content */
	content?: ReactNode;
	/** Optional icon for the tab */
	icon?: ReactNode;
	/** Whether the tab is disabled @default false */
	disabled?: boolean;
}

/**
 * Tabs component props
 */
export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of tab items */
	items: readonly TabItem[];
	/** ID of the currently active tab */
	activeTabId: string;
	/** Callback when tab changes */
	onTabChange: (tabId: string) => void;
	/** Visual variant of the tabs @default 'default' */
	variant?: TabsVariant;
	/** Size of the tabs @default 'md' */
	size?: StandardSize;
	/** Whether tabs should take full width @default false */
	fullWidth?: boolean;
	/** Optional tabs ID for accessibility */
	tabsId?: string;
}
