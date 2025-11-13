import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Action Sheet action data
 */
export interface ActionSheetAction {
	id: string;
	label: ReactNode;
	icon?: ReactNode;
	/** @default false */
	destructive?: boolean;
	/** @default false */
	disabled?: boolean;
	onSelect?: () => void | Promise<void>;
}

/**
 * Action Sheet component props
 */
export interface ActionSheetProps {
	isOpen: boolean;
	onClose: () => void;
	actions: readonly ActionSheetAction[];
	title?: string;
	/** @default 'Cancel' */
	cancelLabel?: string;
	/** @default true */
	showCancel?: boolean;
	/** @default true */
	closeOnOverlayClick?: boolean;
	/** @default true */
	closeOnEscape?: boolean;
	actionSheetId?: string;
	className?: string;
	overlayClassName?: string;
}

/**
 * Pull to Refresh component props
 */
export interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	onRefresh: () => Promise<void> | void;
	/** @default false */
	disabled?: boolean;
	/** @default 80 */
	threshold?: number;
	pullIndicator?: ReactNode;
	releaseIndicator?: ReactNode;
	refreshingIndicator?: ReactNode;
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
	id: string;
	content: ReactNode;
	background?: string;
	onAction?: () => void | Promise<void>;
}

/**
 * Swipeable component props
 */
export interface SwipeableProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	/** @default 'horizontal' */
	direction?: SwipeableDirection;
	/** @default 50 */
	threshold?: number;
	leftActions?: readonly SwipeableAction[];
	rightActions?: readonly SwipeableAction[];
	upActions?: readonly SwipeableAction[];
	downActions?: readonly SwipeableAction[];
	onSwipe?: (direction: SwipeableDirection) => void;
	/** @default false */
	disabled?: boolean;
	className?: string;
}
