import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

import type { StandardSize } from './base';

/**
 * Link variant types
 */
export type LinkVariant = 'default' | 'subtle' | 'muted';

/**
 * Link component props
 */
export interface LinkProps extends Omit<HTMLAttributes<HTMLAnchorElement>, 'href'> {
	/** Visual variant of the link @default 'default' */
	variant?: LinkVariant;
	/** Size of the link @default 'md' */
	size?: StandardSize;
	/** Link content */
	children: ReactNode;
	/** Link destination (for react-router-dom) */
	to: string;
	/** Legacy href support (for external links) */
	href?: string;
	/** Whether to open in new tab @default false */
	target?: '_blank' | '_self' | '_parent' | '_top';
	/** Whether to show external link icon @default false */
	showExternalIcon?: boolean;
}

/**
 * Anchor component props
 *
 * Anchor is for smooth scrolling to page sections (hash navigation).
 * Different from Link which is for routing with react-router-dom.
 * Useful for table of contents and in-page navigation.
 */
export interface AnchorProps extends Omit<HTMLAttributes<HTMLAnchorElement>, 'href'> {
	/** Visual variant of the anchor @default 'default' */
	variant?: LinkVariant;
	/** Size of the anchor @default 'md' */
	size?: StandardSize;
	/** Anchor content */
	children: ReactNode;
	/** Hash target (e.g., '#section-1' or 'section-1') */
	href: string;
	/** Scroll offset in pixels (to account for fixed headers) @default 0 */
	scrollOffset?: number;
	/** Scroll behavior @default 'smooth' */
	scrollBehavior?: ScrollBehavior;
}

/**
 * Stepper step status types
 */
export type StepperStepStatus = 'pending' | 'active' | 'completed' | 'error';

/**
 * Stepper orientation types
 */
export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * Stepper step data
 */
export interface StepperStep {
	/** Unique identifier for the step */
	id: string;
	/** Step label/title */
	label: string;
	/** Optional step description */
	description?: string;
	/** Optional step content */
	content?: ReactNode;
}

/**
 * Stepper component props
 */
export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of step data */
	steps: readonly StepperStep[];
	/** Current active step index (0-based) */
	activeStep: number;
	/** Orientation of the stepper @default 'horizontal' */
	orientation?: StepperOrientation;
	/** Size of the stepper @default 'md' */
	size?: StandardSize;
	/** Whether to show step numbers @default true */
	showNumbers?: boolean;
	/** Optional click handler for steps */
	onStepClick?: (stepIndex: number) => void;
}

/**
 * Accordion variant types
 */
export type AccordionVariant = 'default' | 'bordered' | 'separated';

/**
 * Accordion item data
 */
export interface AccordionItem {
	/** Unique identifier for the item */
	id: string;
	/** Item header content */
	header: ReactNode;
	/** Item content */
	content: ReactNode;
	/** Whether the item is expanded by default @default false */
	defaultExpanded?: boolean;
	/** Whether the item is disabled @default false */
	disabled?: boolean;
}

/**
 * Accordion component props
 */
export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of accordion items */
	items: readonly AccordionItem[];
	/** Whether multiple items can be expanded at once @default false */
	allowMultiple?: boolean;
	/** Visual variant of the accordion @default 'default' */
	variant?: AccordionVariant;
	/** Size of the accordion @default 'md' */
	size?: StandardSize;
	/** Optional accordion ID for accessibility */
	accordionId?: string;
}

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

/**
 * Breadcrumb item data
 */
export interface BreadcrumbItem {
	/** Item label */
	label: ReactNode;
	/** Optional link destination */
	to?: string;
	/** Whether this is the current page @default false */
	isCurrentPage?: boolean;
}

/**
 * Breadcrumbs component props
 */
export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
	/** Array of breadcrumb items */
	items: readonly BreadcrumbItem[];
	/** Separator between items @default '/' */
	separator?: ReactNode;
}

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

/**
 * TreeView selection mode types
 */
export type TreeViewSelectionMode = 'single' | 'multiple' | 'none';

/**
 * TreeView node data
 */
export interface TreeNode {
	/** Unique identifier for the node */
	id: string;
	/** Node label/content */
	label: ReactNode;
	/** Optional icon for the node */
	icon?: ReactNode;
	/** Child nodes (for hierarchical structure) */
	children?: readonly TreeNode[];
	/** Whether the node is expanded by default @default false */
	defaultExpanded?: boolean;
	/** Whether the node is disabled @default false */
	disabled?: boolean;
	/** Whether the node is selected by default @default false */
	defaultSelected?: boolean;
	/** Optional custom data associated with the node */
	data?: unknown;
}

/**
 * TreeView component props
 */
export interface TreeViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
	/** Array of tree nodes */
	nodes: readonly TreeNode[];
	/** Selection mode @default 'none' */
	selectionMode?: TreeViewSelectionMode;
	/** IDs of selected nodes (controlled mode) */
	selectedNodeIds?: readonly string[];
	/** IDs of expanded nodes (controlled mode) */
	expandedNodeIds?: readonly string[];
	/** Default selected node IDs (uncontrolled mode) */
	defaultSelectedNodeIds?: readonly string[];
	/** Default expanded node IDs (uncontrolled mode) */
	defaultExpandedNodeIds?: readonly string[];
	/** Callback when selection changes */
	onSelectionChange?: (selectedNodeIds: string[]) => void;
	/** Callback when expansion changes */
	onExpansionChange?: (expandedNodeIds: string[]) => void;
	/** Callback when a node is clicked */
	onNodeClick?: (nodeId: string, node: TreeNode) => void;
	/** Callback when a node is double-clicked */
	onNodeDoubleClick?: (nodeId: string, node: TreeNode) => void;
	/** Optional TreeView ID for accessibility */
	treeViewId?: string;
	/** Whether to show expand/collapse icons @default true */
	showExpandIcons?: boolean;
	/** Size of the tree view @default 'md' */
	size?: StandardSize;
}

/**
 * Wizard step validation function
 * Returns true if step is valid, false otherwise
 */
export type WizardStepValidator<T extends Record<string, unknown> = Record<string, unknown>> = (
	data: T
) => boolean | Promise<boolean>;

/**
 * Wizard step configuration
 */
export interface WizardStepConfig {
	/** Unique identifier for the step */
	id: string;
	/** Step label/title */
	label: string;
	/** Optional step description */
	description?: string;
	/** Step content (ReactNode) */
	content: ReactNode;
	/** Whether this step can be skipped @default false */
	skippable?: boolean;
	/** Whether this step is optional (doesn't block completion) @default false */
	optional?: boolean;
	/** Optional validation function for this step */
	validate?: WizardStepValidator;
	/** Whether to validate on step change @default true */
	validateOnChange?: boolean;
}

/**
 * Wizard component props
 */
export interface WizardProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of wizard step configurations */
	steps: readonly WizardStepConfig[];
	/** Initial active step index (0-based) @default 0 */
	initialStep?: number;
	/** Controlled active step index (0-based) */
	activeStep?: number;
	/** Callback when step changes */
	onStepChange?: (stepIndex: number) => void;
	/** Callback when wizard is completed */
	onComplete?: () => void | Promise<void>;
	/** Callback when wizard is cancelled */
	onCancel?: () => void;
	/** Orientation of the stepper @default 'horizontal' */
	orientation?: StepperOrientation;
	/** Size of the stepper @default 'md' */
	size?: StandardSize;
	/** Whether to show step numbers @default true */
	showNumbers?: boolean;
	/** Whether to show navigation buttons @default true */
	showNavigation?: boolean;
	/** Custom label for next button */
	nextButtonLabel?: string;
	/** Custom label for previous button */
	previousButtonLabel?: string;
	/** Custom label for finish button */
	finishButtonLabel?: string;
	/** Whether to show progress indicator @default true */
	showProgress?: boolean;
	/** Whether to allow going back to previous steps @default true */
	allowBackNavigation?: boolean;
	/** Form data (for validation) */
	formData?: Record<string, unknown>;
	/** Class name for the wizard container */
	className?: string;
}

/**
 * SegmentedControl variant types
 */
export type SegmentedControlVariant = 'default' | 'pills' | 'outline';

/**
 * SegmentedControl item data
 */
export interface SegmentedControlItem {
	/** Unique identifier for the item */
	id: string;
	/** Item label */
	label: ReactNode;
	/** Optional icon for the item */
	icon?: ReactNode;
	/** Whether the item is disabled @default false */
	disabled?: boolean;
}

/**
 * SegmentedControl component props
 */
export interface SegmentedControlProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of segmented control items */
	items: readonly SegmentedControlItem[];
	/** ID of the currently selected item */
	value: string;
	/** Callback when selection changes */
	onValueChange: (itemId: string) => void;
	/** Visual variant of the segmented control @default 'default' */
	variant?: SegmentedControlVariant;
	/** Size of the segmented control @default 'md' */
	size?: StandardSize;
	/** Whether the segmented control is disabled @default false */
	disabled?: boolean;
	/** Optional segmented control ID for accessibility */
	segmentedControlId?: string;
}

/**
 * NotificationBell component props
 */
export interface NotificationBellProps extends HTMLAttributes<HTMLButtonElement> {
	/** Number of notifications to display (0 hides the badge) */
	count?: number;
	/** Maximum number to display before showing "+" (e.g., 99+) @default 99 */
	maxCount?: number;
	/** Size of the bell icon @default 'md' */
	size?: StandardSize;
	/** Variant of the badge @default 'error' */
	badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
	/** Whether to show a pulsing animation when there are notifications @default false */
	animated?: boolean;
	/** Whether the button is disabled @default false */
	disabled?: boolean;
	/** Accessible label for the notification bell @default 'Notifications' */
	'aria-label'?: string;
}

/**
 * Floating Action Button position types
 */
export type FloatingActionButtonPosition =
	| 'bottom-right'
	| 'bottom-left'
	| 'top-right'
	| 'top-left';

/**
 * Floating Action Button component props
 */
export interface FloatingActionButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	/** Icon to display in the FAB */
	icon: ReactNode;
	/** Accessible label for the button (required for accessibility) */
	'aria-label': string;
	/** Optional tooltip text */
	tooltip?: string;
	/** Position of the FAB @default 'bottom-right' */
	position?: FloatingActionButtonPosition;
	/** Size of the FAB @default 'md' */
	size?: StandardSize;
	/** Visual variant @default 'primary' */
	variant?: 'primary' | 'secondary';
	/** Whether the FAB is extended (shows label) @default false */
	extended?: boolean;
	/** Label text for extended FAB */
	label?: ReactNode;
	/** Custom className for the FAB */
	className?: string;
}

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

/**
 * AppBar variant types
 */
export type AppBarVariant = 'default' | 'elevated' | 'outlined';

/**
 * AppBar component props
 */
export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
	/** AppBar title */
	title?: ReactNode;
	/** Optional leading element (e.g., menu icon, back button) */
	leading?: ReactNode;
	/** Optional trailing elements (e.g., action buttons) */
	trailing?: ReactNode;
	/** Visual variant of the AppBar @default 'default' */
	variant?: AppBarVariant;
	/** Whether the AppBar is fixed at the top @default false */
	fixed?: boolean;
	/** Custom className for the AppBar */
	className?: string;
}
