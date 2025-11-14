/**
 * Navigation component constants
 * Constants for Breadcrumbs, Drawer, Tabs, and Accordion components
 */

import type { StandardSize } from '@src-types/ui/base';
import type { AccordionVariant } from '@src-types/ui/navigation/accordion';
import type { SegmentedControlVariant } from '@src-types/ui/navigation/segmentedControl';
import type { TabsVariant } from '@src-types/ui/navigation/tabs';
import type {
	DrawerPosition,
	DrawerSize,
	SheetPosition,
	SheetSize,
	SidebarPosition,
} from '@src-types/ui/overlays/panels';
import type React from 'react';

/**
 * Breadcrumbs base classes
 * Uses design tokens for colors and spacing
 */
export const BREADCRUMBS_BASE_CLASSES =
	'flex items-center space-x-sm text-sm text-text-secondary dark:text-text-secondary-dark';

/**
 * Breadcrumbs item classes
 * Uses design tokens for colors
 */
export const BREADCRUMBS_ITEM_CLASSES =
	'inline-flex items-center transition-colors hover:text-text-primary dark:hover:text-text-primary-dark';

/**
 * Breadcrumbs separator classes
 * Uses design tokens for colors
 */
export const BREADCRUMBS_SEPARATOR_CLASSES =
	'text-text-muted dark:text-text-muted-dark select-none';

/**
 * Drawer base classes
 * Uses design tokens for colors, shadows, and transitions
 */
export const DRAWER_BASE_CLASSES =
	'fixed z-50 bg-surface shadow-xl transition-transform duration-slower ease-in-out dark:bg-surface-dark';

/**
 * Drawer size classes (width for left/right, height for top/bottom)
 * Uses design tokens for customizable sizing
 */
export const DRAWER_SIZE_CLASSES: Record<DrawerSize, string> = {
	sm: 'w-[calc(var(--spacing-4xl)*4)] h-[calc(var(--spacing-4xl)*4)]',
	md: 'w-[calc(var(--spacing-4xl)*5)] h-[calc(var(--spacing-4xl)*6)]',
	lg: 'w-[calc(var(--spacing-4xl)*6)] h-[calc(var(--spacing-4xl)*8)]',
	xl: 'w-[calc(var(--spacing-4xl)*7)] h-[calc(var(--spacing-4xl)*10)]',
	full: 'w-full h-full',
} as const;

/**
 * Drawer position classes
 */
export const DRAWER_POSITION_CLASSES: Record<DrawerPosition, string> = {
	left: 'top-0 left-0 h-full',
	right: 'top-0 right-0 h-full',
	top: 'top-0 left-0 w-full',
	bottom: 'bottom-0 left-0 w-full',
} as const;

/**
 * Drawer overlay base classes
 * Uses design tokens for transitions and overlay colors
 */
export const DRAWER_OVERLAY_BASE_CLASSES =
	'fixed inset-0 z-40 bg-overlay transition-opacity duration-slower ease-in-out';

/**
 * Sheet base classes (similar to Drawer but with different styling)
 * Uses design tokens for colors, shadows, and transitions
 */
export const SHEET_BASE_CLASSES =
	'fixed z-50 bg-surface shadow-2xl transition-transform duration-slower ease-in-out dark:bg-surface-dark';

/**
 * Sheet size classes (width for left/right, height for top/bottom)
 * Uses design tokens for customizable sizing
 */
export const SHEET_SIZE_CLASSES: Record<SheetSize, string> = {
	sm: 'w-[calc(var(--spacing-4xl)*4)] h-[calc(var(--spacing-4xl)*4)]',
	md: 'w-[calc(var(--spacing-4xl)*5)] h-[calc(var(--spacing-4xl)*6)]',
	lg: 'w-[calc(var(--spacing-4xl)*6)] h-[calc(var(--spacing-4xl)*8)]',
	xl: 'w-[calc(var(--spacing-4xl)*7)] h-[calc(var(--spacing-4xl)*10)]',
	full: 'w-full h-full',
} as const;

/**
 * Sheet position classes
 */
export const SHEET_POSITION_CLASSES: Record<SheetPosition, string> = {
	left: 'top-0 left-0 h-full',
	right: 'top-0 right-0 h-full',
	top: 'top-0 left-0 w-full',
	bottom: 'bottom-0 left-0 w-full',
} as const;

/**
 * Sheet overlay base classes
 * Uses design tokens for transitions and overlay colors
 */
export const SHEET_OVERLAY_BASE_CLASSES =
	'fixed inset-0 z-40 bg-overlay-dark transition-opacity duration-slower ease-in-out';

/**
 * Sidebar base classes (persistent layout sidebar, not an overlay)
 * Uses design tokens for colors and transitions
 */
export const SIDEBAR_BASE_CLASSES =
	'flex flex-col h-full bg-surface transition-all duration-slower ease-in-out dark:bg-surface-dark';

/**
 * Sidebar position classes
 */
export const SIDEBAR_POSITION_CLASSES: Record<SidebarPosition, string> = {
	left: 'border-r',
	right: 'border-l',
} as const;

/**
 * Sidebar collapsed width
 * Uses design tokens for customizable width
 */
export const SIDEBAR_COLLAPSED_WIDTH = 'var(--spacing-4xl)';

/**
 * Sidebar default width
 * Uses design tokens for customizable width (16rem = 4 * 4rem)
 */
export const SIDEBAR_DEFAULT_WIDTH = 'calc(var(--spacing-4xl)*4)';

/**
 * Tabs base classes
 */
export const TABS_BASE_CLASSES = 'flex space-x-1';

/**
 * Tabs variant classes
 * Uses design tokens for colors and spacing
 */
export const TABS_VARIANT_CLASSES: Record<TabsVariant, string> = {
	default: '',
	pills: 'bg-muted rounded-lg p-xs dark:bg-muted-dark',
	underline: 'border-b border-border dark:border-border-dark',
} as const;

/**
 * Tab button base classes
 */
export const TAB_BUTTON_BASE_CLASSES =
	'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Text size classes by StandardSize
 */
const TEXT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;

/**
 * Tab button size classes (padding + text size)
 * Uses design tokens for spacing
 */
export const TAB_BUTTON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: `px-xs py-0.5 ${TEXT_SIZE_CLASSES.sm}`,
	md: `px-sm py-xs ${TEXT_SIZE_CLASSES.md}`,
	lg: `px-md py-sm ${TEXT_SIZE_CLASSES.lg}`,
} as const;

/**
 * Tab button inactive state classes (shared across variants)
 * Uses design tokens for colors
 */
const TAB_BUTTON_INACTIVE_CLASSES =
	'text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark';

/**
 * Tab button variant classes
 */
export const TAB_BUTTON_VARIANT_CLASSES: Record<TabsVariant, { active: string; inactive: string }> =
	{
		default: {
			active: 'text-primary border-b-2 border-primary',
			inactive: TAB_BUTTON_INACTIVE_CLASSES,
		},
		pills: {
			active: 'bg-surface text-primary shadow-sm dark:bg-muted-dark dark:text-primary',
			inactive: TAB_BUTTON_INACTIVE_CLASSES,
		},
		underline: {
			active: 'text-primary border-b-2 border-primary -mb-px',
			inactive: TAB_BUTTON_INACTIVE_CLASSES,
		},
	} as const;

/**
 * Accordion base classes
 */
export const ACCORDION_BASE_CLASSES = 'space-y-1';

/**
 * Accordion variant classes
 * Uses design tokens for colors and spacing
 */
export const ACCORDION_VARIANT_CLASSES: Record<AccordionVariant, string> = {
	default: '',
	bordered: 'border border-border rounded-lg dark:border-border-dark',
	separated: 'space-y-sm',
} as const;

/**
 * Accordion item base classes
 * Uses design tokens for transitions
 */
export const ACCORDION_ITEM_BASE_CLASSES =
	'overflow-hidden transition-all duration-normal ease-in-out';

/**
 * Accordion header base classes
 */
export const ACCORDION_HEADER_BASE_CLASSES =
	'flex items-center justify-between w-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Accordion header size classes (padding + text size)
 * Uses design tokens for spacing
 */
export const ACCORDION_HEADER_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: `px-sm py-sm ${TEXT_SIZE_CLASSES.sm}`,
	md: `px-md py-md ${TEXT_SIZE_CLASSES.md}`,
	lg: `px-lg py-lg ${TEXT_SIZE_CLASSES.lg}`,
} as const;

/**
 * Accordion content base classes
 * Uses design tokens for transitions
 */
export const ACCORDION_CONTENT_BASE_CLASSES =
	'overflow-hidden transition-all duration-normal ease-in-out';

/**
 * Accordion content size classes (padding)
 * Uses design tokens for spacing
 */
export const ACCORDION_CONTENT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-sm py-sm',
	md: 'px-md py-md',
	lg: 'px-lg py-lg',
} as const;

/**
 * TreeView base classes
 */
export const TREE_VIEW_BASE_CLASSES = 'w-full outline-none';

/**
 * TreeView node base classes
 */
export const TREE_VIEW_NODE_BASE_CLASSES =
	'flex items-center w-full text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * TreeView node size classes (padding + text size)
 * Uses design tokens for spacing
 */
export const TREE_VIEW_NODE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: `px-xs py-0.5 ${TEXT_SIZE_CLASSES.sm}`,
	md: `px-sm py-xs ${TEXT_SIZE_CLASSES.md}`,
	lg: `px-md py-sm ${TEXT_SIZE_CLASSES.lg}`,
} as const;

/**
 * TreeView node selected state classes
 */
export const TREE_VIEW_NODE_SELECTED_CLASSES =
	'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary';

/**
 * TreeView node hover state classes
 * Uses design tokens for colors
 */
export const TREE_VIEW_NODE_HOVER_CLASSES = 'hover:bg-muted dark:hover:bg-muted-dark';

/**
 * TreeView node content classes
 */
export const TREE_VIEW_NODE_CONTENT_CLASSES = 'flex items-center flex-1 min-w-0';

/**
 * TreeView node icon classes
 */
export const TREE_VIEW_NODE_ICON_CLASSES = 'flex-shrink-0 mr-2';

/**
 * TreeView expand icon classes
 * Uses design tokens for transitions
 */
export const TREE_VIEW_EXPAND_ICON_CLASSES =
	'flex-shrink-0 mr-1 text-muted-foreground transition-transform duration-normal';

/**
 * TreeView expand icon expanded state classes
 */
export const TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES = 'rotate-90';

/**
 * TreeView children container classes
 * Uses design tokens for transitions
 */
export const TREE_VIEW_CHILDREN_CONTAINER_CLASSES =
	'ml-4 overflow-hidden transition-all duration-normal ease-in-out';

/**
 * TreeView children container expanded classes
 */
export const TREE_VIEW_CHILDREN_EXPANDED_CLASSES = 'opacity-100';
export const TREE_VIEW_CHILDREN_EXPANDED_STYLE: React.CSSProperties = {
	maxHeight: 'var(--animation-max-height-tree-view, 10000px)',
};

/**
 * TreeView children container collapsed classes
 */
export const TREE_VIEW_CHILDREN_COLLAPSED_CLASSES = 'max-h-0 opacity-0';

/**
 * SegmentedControl base classes
 * Uses design tokens for colors and spacing
 */
export const SEGMENTED_CONTROL_BASE_CLASSES =
	'inline-flex items-center rounded-md bg-muted p-xs dark:bg-muted-dark';

/**
 * SegmentedControl variant classes
 * Uses design tokens for colors
 */
export const SEGMENTED_CONTROL_VARIANT_CLASSES: Record<SegmentedControlVariant, string> = {
	default: 'bg-muted dark:bg-muted-dark',
	pills: 'bg-muted dark:bg-muted-dark',
	outline: 'bg-transparent border border-border dark:border-border-dark',
} as const;

/**
 * SegmentedControl item base classes
 */
export const SEGMENTED_CONTROL_ITEM_BASE_CLASSES =
	'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * SegmentedControl item size classes (padding + text size)
 * Uses design tokens for spacing
 */
export const SEGMENTED_CONTROL_ITEM_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: `px-sm py-0.5 ${TEXT_SIZE_CLASSES.sm}`,
	md: `px-sm py-xs ${TEXT_SIZE_CLASSES.md}`,
	lg: `px-md py-sm ${TEXT_SIZE_CLASSES.lg}`,
} as const;

/**
 * SegmentedControl item inactive state classes (shared across variants)
 * Uses design tokens for colors
 */
const SEGMENTED_CONTROL_ITEM_INACTIVE_CLASSES =
	'text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark';

/**
 * SegmentedControl item variant classes
 */
export const SEGMENTED_CONTROL_ITEM_VARIANT_CLASSES: Record<
	SegmentedControlVariant,
	{ active: string; inactive: string }
> = {
	default: {
		active:
			'bg-surface text-text-primary shadow-sm rounded-md dark:bg-muted-dark dark:text-text-primary-dark',
		inactive: SEGMENTED_CONTROL_ITEM_INACTIVE_CLASSES,
	},
	pills: {
		active: 'bg-surface text-primary shadow-sm rounded-md dark:bg-muted-dark dark:text-primary',
		inactive: SEGMENTED_CONTROL_ITEM_INACTIVE_CLASSES,
	},
	outline: {
		active:
			'bg-primary text-primary-foreground border border-primary rounded-md dark:bg-primary dark:text-primary-foreground',
		inactive: `${SEGMENTED_CONTROL_ITEM_INACTIVE_CLASSES} border border-transparent`,
	},
} as const;
