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

/**
 * Breadcrumbs base classes
 */
export const BREADCRUMBS_BASE_CLASSES =
	'flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400';

/**
 * Breadcrumbs item classes
 */
export const BREADCRUMBS_ITEM_CLASSES =
	'inline-flex items-center transition-colors hover:text-gray-900 dark:hover:text-gray-200';

/**
 * Breadcrumbs separator classes
 */
export const BREADCRUMBS_SEPARATOR_CLASSES = 'text-gray-400 dark:text-gray-500 select-none';

/**
 * Drawer base classes
 */
export const DRAWER_BASE_CLASSES =
	'fixed z-50 bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-gray-800';

/**
 * Drawer size classes (width for left/right, height for top/bottom)
 */
export const DRAWER_SIZE_CLASSES: Record<DrawerSize, string> = {
	sm: 'w-64 h-64',
	md: 'w-80 h-96',
	lg: 'w-96 h-[32rem]',
	xl: 'w-[28rem] h-[40rem]',
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
 */
export const DRAWER_OVERLAY_BASE_CLASSES =
	'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out';

/**
 * Sheet base classes (similar to Drawer but with different styling)
 */
export const SHEET_BASE_CLASSES =
	'fixed z-50 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-gray-800';

/**
 * Sheet size classes (width for left/right, height for top/bottom)
 */
export const SHEET_SIZE_CLASSES: Record<SheetSize, string> = {
	sm: 'w-64 h-64',
	md: 'w-80 h-96',
	lg: 'w-96 h-[32rem]',
	xl: 'w-[28rem] h-[40rem]',
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
 */
export const SHEET_OVERLAY_BASE_CLASSES =
	'fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ease-in-out';

/**
 * Sidebar base classes (persistent layout sidebar, not an overlay)
 */
export const SIDEBAR_BASE_CLASSES =
	'flex flex-col h-full bg-white transition-all duration-300 ease-in-out dark:bg-gray-800';

/**
 * Sidebar position classes
 */
export const SIDEBAR_POSITION_CLASSES: Record<SidebarPosition, string> = {
	left: 'border-r',
	right: 'border-l',
} as const;

/**
 * Sidebar collapsed width
 */
export const SIDEBAR_COLLAPSED_WIDTH = '4rem';

/**
 * Sidebar default width
 */
export const SIDEBAR_DEFAULT_WIDTH = '16rem';

/**
 * Tabs base classes
 */
export const TABS_BASE_CLASSES = 'flex space-x-1';

/**
 * Tabs variant classes
 */
export const TABS_VARIANT_CLASSES: Record<TabsVariant, string> = {
	default: '',
	pills: 'bg-gray-100 rounded-lg p-1 dark:bg-gray-800',
	underline: 'border-b border-gray-200 dark:border-gray-700',
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
 */
export const TAB_BUTTON_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: `px-2 py-1 ${TEXT_SIZE_CLASSES.sm}`,
	md: `px-3 py-1.5 ${TEXT_SIZE_CLASSES.md}`,
	lg: `px-4 py-2 ${TEXT_SIZE_CLASSES.lg}`,
} as const;

/**
 * Tab button inactive state classes (shared across variants)
 */
const TAB_BUTTON_INACTIVE_CLASSES =
	'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200';

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
			active: 'bg-white text-primary shadow-sm dark:bg-gray-700 dark:text-primary',
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
 */
export const ACCORDION_VARIANT_CLASSES: Record<AccordionVariant, string> = {
	default: '',
	bordered: 'border border-gray-200 rounded-lg dark:border-gray-700',
	separated: 'space-y-2',
} as const;

/**
 * Accordion item base classes
 */
export const ACCORDION_ITEM_BASE_CLASSES =
	'overflow-hidden transition-all duration-200 ease-in-out';

/**
 * Accordion header base classes
 */
export const ACCORDION_HEADER_BASE_CLASSES =
	'flex items-center justify-between w-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Accordion header size classes (padding + text size)
 */
export const ACCORDION_HEADER_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: `px-3 py-2 ${TEXT_SIZE_CLASSES.sm}`,
	md: `px-4 py-3 ${TEXT_SIZE_CLASSES.md}`,
	lg: `px-5 py-4 ${TEXT_SIZE_CLASSES.lg}`,
} as const;

/**
 * Accordion content base classes
 */
export const ACCORDION_CONTENT_BASE_CLASSES =
	'overflow-hidden transition-all duration-200 ease-in-out';

/**
 * Accordion content size classes (padding)
 */
export const ACCORDION_CONTENT_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'px-3 py-2',
	md: 'px-4 py-3',
	lg: 'px-5 py-4',
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
 */
export const TREE_VIEW_NODE_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: `px-2 py-1 ${TEXT_SIZE_CLASSES.sm}`,
	md: `px-3 py-1.5 ${TEXT_SIZE_CLASSES.md}`,
	lg: `px-4 py-2 ${TEXT_SIZE_CLASSES.lg}`,
} as const;

/**
 * TreeView node selected state classes
 */
export const TREE_VIEW_NODE_SELECTED_CLASSES =
	'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary';

/**
 * TreeView node hover state classes
 */
export const TREE_VIEW_NODE_HOVER_CLASSES = 'hover:bg-muted dark:hover:bg-gray-800';

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
 */
export const TREE_VIEW_EXPAND_ICON_CLASSES =
	'flex-shrink-0 mr-1 text-muted-foreground transition-transform duration-200';

/**
 * TreeView expand icon expanded state classes
 */
export const TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES = 'rotate-90';

/**
 * TreeView children container classes
 */
export const TREE_VIEW_CHILDREN_CONTAINER_CLASSES =
	'ml-4 overflow-hidden transition-all duration-200 ease-in-out';

/**
 * TreeView children container expanded classes
 */
export const TREE_VIEW_CHILDREN_EXPANDED_CLASSES = 'max-h-[10000px] opacity-100';

/**
 * TreeView children container collapsed classes
 */
export const TREE_VIEW_CHILDREN_COLLAPSED_CLASSES = 'max-h-0 opacity-0';

/**
 * SegmentedControl base classes
 */
export const SEGMENTED_CONTROL_BASE_CLASSES =
	'inline-flex items-center rounded-md bg-gray-100 p-1 dark:bg-gray-800';

/**
 * SegmentedControl variant classes
 */
export const SEGMENTED_CONTROL_VARIANT_CLASSES: Record<SegmentedControlVariant, string> = {
	default: 'bg-gray-100 dark:bg-gray-800',
	pills: 'bg-gray-100 dark:bg-gray-800',
	outline: 'bg-transparent border border-gray-200 dark:border-gray-700',
} as const;

/**
 * SegmentedControl item base classes
 */
export const SEGMENTED_CONTROL_ITEM_BASE_CLASSES =
	'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * SegmentedControl item size classes (padding + text size)
 */
export const SEGMENTED_CONTROL_ITEM_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: `px-2.5 py-1 ${TEXT_SIZE_CLASSES.sm}`,
	md: `px-3 py-1.5 ${TEXT_SIZE_CLASSES.md}`,
	lg: `px-4 py-2 ${TEXT_SIZE_CLASSES.lg}`,
} as const;

/**
 * SegmentedControl item inactive state classes (shared across variants)
 */
const SEGMENTED_CONTROL_ITEM_INACTIVE_CLASSES =
	'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200';

/**
 * SegmentedControl item variant classes
 */
export const SEGMENTED_CONTROL_ITEM_VARIANT_CLASSES: Record<
	SegmentedControlVariant,
	{ active: string; inactive: string }
> = {
	default: {
		active: 'bg-white text-gray-900 shadow-sm rounded-md dark:bg-gray-700 dark:text-gray-100',
		inactive: SEGMENTED_CONTROL_ITEM_INACTIVE_CLASSES,
	},
	pills: {
		active: 'bg-white text-primary shadow-sm rounded-md dark:bg-gray-700 dark:text-primary',
		inactive: SEGMENTED_CONTROL_ITEM_INACTIVE_CLASSES,
	},
	outline: {
		active:
			'bg-primary text-primary-foreground border border-primary rounded-md dark:bg-primary dark:text-primary-foreground',
		inactive: `${SEGMENTED_CONTROL_ITEM_INACTIVE_CLASSES} border border-transparent`,
	},
} as const;
