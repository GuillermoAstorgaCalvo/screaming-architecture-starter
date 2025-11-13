import type { ReactNode } from 'react';

/**
 * Tooltip position types
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Tooltip component props
 */
export interface TooltipProps {
	children: ReactNode;
	content: ReactNode;
	/** @default 'top' */
	position?: TooltipPosition;
	/** @default 500 */
	delay?: number;
	/** @default false */
	disabled?: boolean;
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
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	trigger: ReactNode;
	/** @default 'bottom' */
	position?: PopoverPosition;
	/** @default true */
	closeOnOutsideClick?: boolean;
	/** @default true */
	closeOnEscape?: boolean;
	popoverId?: string;
	className?: string;
	containerClassName?: string;
}

/**
 * Hover Card position types
 */
export type HoverCardPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Hover Card component props - shows card content on hover
 */
export interface HoverCardProps {
	children: ReactNode;
	content: ReactNode;
	/** @default 'top' */
	position?: HoverCardPosition;
	/** @default 300 */
	delay?: number;
	/** @default 100 */
	hideDelay?: number;
	/** @default false */
	disabled?: boolean;
	className?: string;
	contentClassName?: string;
	/** @default true */
	showArrow?: boolean;
}
