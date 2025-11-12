import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode } from 'react';

import type { ModalSize, StandardSize } from './base';

/**
 * Modal component props
 */
export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	/** @default 'md' */
	size?: ModalSize;
	/** @default true */
	showCloseButton?: boolean;
	footer?: ReactNode;
	className?: string;
	/** @default true */
	closeOnOverlayClick?: boolean;
	/** @default true */
	closeOnEscape?: boolean;
	modalId?: string;
}

/**
 * Tooltip position types
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Tooltip component props
 */
export interface TooltipProps {
	/** Tooltip content */
	children: ReactNode;
	/** Tooltip text/content to display */
	content: ReactNode;
	/** Position of the tooltip @default 'top' */
	position?: TooltipPosition;
	/** Delay before showing tooltip (ms) @default 500 */
	delay?: number;
	/** Whether the tooltip is disabled @default false */
	disabled?: boolean;
	/** Additional className for the tooltip wrapper */
	className?: string;
}

/**
 * Popover position type
 */
export type PopoverPosition =
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top-start'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-end'
	| 'left-start'
	| 'left-end'
	| 'right-start'
	| 'right-end';

/**
 * Popover component props - flexible overlay component
 */
export interface PopoverProps {
	/** Whether the popover is open */
	isOpen: boolean;
	/** Function to close the popover */
	onClose: () => void;
	/** Popover content */
	children: ReactNode;
	/** Trigger element (the element that opens the popover) */
	trigger: ReactNode;
	/** Position of the popover relative to trigger @default 'bottom' */
	position?: PopoverPosition;
	/** Whether to close on outside click @default true */
	closeOnOutsideClick?: boolean;
	/** Whether to close on escape key @default true */
	closeOnEscape?: boolean;
	/** Optional ID for the popover element */
	popoverId?: string;
	/** Custom className for the popover content */
	className?: string;
	/** Custom className for the popover container */
	containerClassName?: string;
}

/**
 * Drawer position types
 */
export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Drawer size types
 */
export type DrawerSize = StandardSize | 'xl' | 'full';

/**
 * Drawer component props
 */
export interface DrawerProps {
	/** Whether the drawer is open */
	isOpen: boolean;
	/** Function to close the drawer */
	onClose: () => void;
	/** Drawer content */
	children: ReactNode;
	/** Position of the drawer @default 'right' */
	position?: DrawerPosition;
	/** Size of the drawer @default 'md' */
	size?: DrawerSize;
	/** Optional title for the drawer */
	title?: string;
	/** Optional footer content */
	footer?: ReactNode;
	/** Whether to show close button @default true */
	showCloseButton?: boolean;
	/** Whether to close on overlay click @default true */
	closeOnOverlayClick?: boolean;
	/** Whether to close on escape key @default true */
	closeOnEscape?: boolean;
	/** Optional ID for the drawer element */
	drawerId?: string;
	/** Custom className for the drawer content */
	className?: string;
	/** Custom className for the drawer overlay */
	overlayClassName?: string;
}

/**
 * Sheet position types (similar to Drawer but for alternative overlay panels)
 */
export type SheetPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Sheet size types
 */
export type SheetSize = StandardSize | 'xl' | 'full';

/**
 * Sheet component props - Alternative to Drawer for bottom/top/side panels
 */
export interface SheetProps {
	/** Whether the sheet is open */
	isOpen: boolean;
	/** Function to close the sheet */
	onClose: () => void;
	/** Sheet content */
	children: ReactNode;
	/** Position of the sheet @default 'right' */
	position?: SheetPosition;
	/** Size of the sheet @default 'md' */
	size?: SheetSize;
	/** Optional title for the sheet */
	title?: string;
	/** Optional footer content */
	footer?: ReactNode;
	/** Whether to show close button @default true */
	showCloseButton?: boolean;
	/** Whether to close on overlay click @default true */
	closeOnOverlayClick?: boolean;
	/** Whether to close on escape key @default true */
	closeOnEscape?: boolean;
	/** Optional ID for the sheet element */
	sheetId?: string;
	/** Custom className for the sheet content */
	className?: string;
	/** Custom className for the sheet overlay */
	overlayClassName?: string;
}

/**
 * Sidebar position types
 */
export type SidebarPosition = 'left' | 'right';

/**
 * Sidebar component props - Persistent layout sidebar (not an overlay)
 */
export interface SidebarProps {
	/** Sidebar content */
	children: ReactNode;
	/** Position of the sidebar @default 'left' */
	position?: SidebarPosition;
	/** Width of the sidebar (in pixels or CSS units) @default '16rem' */
	width?: number | string;
	/** Whether the sidebar is collapsed @default false */
	collapsed?: boolean;
	/** Whether the sidebar is collapsible @default false */
	collapsible?: boolean;
	/** Callback when collapse state changes */
	onCollapseChange?: (collapsed: boolean) => void;
	/** Optional header content */
	header?: ReactNode;
	/** Optional footer content */
	footer?: ReactNode;
	/** Custom className for the sidebar */
	className?: string;
	/** Custom className for the sidebar content */
	contentClassName?: string;
	/** Whether to show a border @default true */
	showBorder?: boolean;
	/** Custom style for the sidebar */
	style?: CSSProperties;
}

/**
 * Resizable direction types
 */
export type ResizableDirection = 'horizontal' | 'vertical' | 'both';

/**
 * Resizable component props - creates resizable panels/containers
 */
export interface ResizableProps {
	/** Resizable content */
	children: ReactNode;
	/** Direction of resizing @default 'horizontal' */
	direction?: ResizableDirection;
	/** Minimum size (in pixels or percentage) @default '0' */
	minSize?: string | number;
	/** Maximum size (in pixels or percentage) */
	maxSize?: string | number;
	/** Default size (in pixels or percentage) */
	defaultSize?: string | number;
	/** Controlled size (in pixels or percentage) */
	size?: string | number;
	/** Callback when size changes */
	onResize?: (size: number) => void;
	/** Whether resizing is disabled @default false */
	disabled?: boolean;
	/** Custom className for the resizable container */
	className?: string;
	/** Custom className for the resize handle */
	handleClassName?: string;
	/** Custom style for the resizable container */
	style?: CSSProperties;
}

/**
 * Hover Card position types
 */
export type HoverCardPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Hover Card component props - shows card content on hover
 */
export interface HoverCardProps {
	/** Trigger element (the element that shows the hover card) */
	children: ReactNode;
	/** Hover card content */
	content: ReactNode;
	/** Position of the hover card @default 'top' */
	position?: HoverCardPosition;
	/** Delay before showing hover card (ms) @default 300 */
	delay?: number;
	/** Delay before hiding hover card (ms) @default 100 */
	hideDelay?: number;
	/** Whether the hover card is disabled @default false */
	disabled?: boolean;
	/** Custom className for the hover card wrapper */
	className?: string;
	/** Custom className for the hover card content */
	contentClassName?: string;
	/** Whether to show an arrow pointing to the trigger @default true */
	showArrow?: boolean;
}

/**
 * Backdrop variant types
 */
export type BackdropVariant = 'default' | 'blur' | 'solid';

/**
 * Backdrop opacity types
 */
export type BackdropOpacity = 'light' | 'medium' | 'dark' | 'default';

/**
 * Backdrop component props - standalone reusable backdrop/overlay
 */
export interface BackdropProps {
	/** Whether the backdrop is visible */
	isOpen: boolean;
	/** Click handler for the backdrop */
	onClick?: (event: MouseEvent<HTMLDivElement>) => void;
	/** Visual variant of the backdrop @default 'default' */
	variant?: BackdropVariant;
	/** Opacity level of the backdrop @default 'default' */
	opacity?: BackdropOpacity;
	/** Custom z-index value (number) */
	zIndex?: number;
	/** Custom className for the backdrop */
	className?: string;
}

/**
 * Portal component props - reusable portal wrapper for rendering content outside the DOM hierarchy
 */
export interface PortalProps {
	/** Content to render in the portal */
	children: ReactNode;
	/** Container element to portal into. If not provided, defaults to document.body */
	container?: HTMLElement | null;
	/** Whether to render the portal. If false, returns null. Useful for conditional rendering */
	enabled?: boolean;
}

/**
 * FocusTrap component props - standalone reusable focus trap wrapper
 */
export interface FocusTrapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	/** Content to wrap with focus trap */
	children: ReactNode;
	/** Whether focus trapping is enabled @default true */
	enabled?: boolean;
	/** Custom className for the focus trap container */
	className?: string;
}

/**
 * Action Sheet action data
 */
export interface ActionSheetAction {
	/** Unique identifier for the action */
	id: string;
	/** Action label */
	label: ReactNode;
	/** Optional icon for the action */
	icon?: ReactNode;
	/** Whether the action is destructive (red styling) @default false */
	destructive?: boolean;
	/** Whether the action is disabled @default false */
	disabled?: boolean;
	/** Callback when action is selected */
	onSelect?: () => void | Promise<void>;
}

/**
 * Action Sheet component props
 */
export interface ActionSheetProps {
	/** Whether the action sheet is open */
	isOpen: boolean;
	/** Function to close the action sheet */
	onClose: () => void;
	/** Array of actions to display */
	actions: readonly ActionSheetAction[];
	/** Optional title for the action sheet */
	title?: string;
	/** Optional cancel button label @default 'Cancel' */
	cancelLabel?: string;
	/** Whether to show cancel button @default true */
	showCancel?: boolean;
	/** Whether to close on overlay click @default true */
	closeOnOverlayClick?: boolean;
	/** Whether to close on escape key @default true */
	closeOnEscape?: boolean;
	/** Optional ID for the action sheet element */
	actionSheetId?: string;
	/** Custom className for the action sheet */
	className?: string;
	/** Custom className for the overlay */
	overlayClassName?: string;
}

/**
 * Pull to Refresh component props
 */
export interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
	/** Content to wrap */
	children: ReactNode;
	/** Callback when pull to refresh is triggered */
	onRefresh: () => Promise<void> | void;
	/** Whether pull to refresh is disabled @default false */
	disabled?: boolean;
	/** Threshold in pixels before refresh is triggered @default 80 */
	threshold?: number;
	/** Custom pull indicator content */
	pullIndicator?: ReactNode;
	/** Custom release indicator content */
	releaseIndicator?: ReactNode;
	/** Custom refreshing indicator content */
	refreshingIndicator?: ReactNode;
	/** Custom className for the container */
	className?: string;
}

/**
 * Swipeable direction types
 */
export type SwipeableDirection =
	| 'left'
	| 'right'
	| 'up'
	| 'down'
	| 'horizontal'
	| 'vertical'
	| 'all';

/**
 * Swipeable action configuration
 */
export interface SwipeableAction {
	/** Unique identifier for the action */
	id: string;
	/** Action content (e.g., icon, button) */
	content: ReactNode;
	/** Background color class or style */
	background?: string;
	/** Callback when action is triggered */
	onAction?: () => void | Promise<void>;
}

/**
 * Swipeable component props
 */
export interface SwipeableProps extends HTMLAttributes<HTMLDivElement> {
	/** Content to make swipeable */
	children: ReactNode;
	/** Allowed swipe directions @default 'horizontal' */
	direction?: SwipeableDirection;
	/** Threshold in pixels before swipe action is triggered @default 50 */
	threshold?: number;
	/** Actions to show when swiping left */
	leftActions?: readonly SwipeableAction[];
	/** Actions to show when swiping right */
	rightActions?: readonly SwipeableAction[];
	/** Actions to show when swiping up */
	upActions?: readonly SwipeableAction[];
	/** Actions to show when swiping down */
	downActions?: readonly SwipeableAction[];
	/** Callback when swipe is detected */
	onSwipe?: (direction: SwipeableDirection) => void;
	/** Whether swiping is disabled @default false */
	disabled?: boolean;
	/** Custom className for the container */
	className?: string;
}
