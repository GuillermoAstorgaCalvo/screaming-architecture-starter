import type { ModalSize, StandardSize } from '@src-types/ui/base';
import type { CSSProperties, ReactNode } from 'react';

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
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	/** @default 'right' */
	position?: DrawerPosition;
	/** @default 'md' */
	size?: DrawerSize;
	title?: string;
	footer?: ReactNode;
	/** @default true */
	showCloseButton?: boolean;
	/** @default true */
	closeOnOverlayClick?: boolean;
	/** @default true */
	closeOnEscape?: boolean;
	drawerId?: string;
	className?: string;
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
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
	/** @default 'right' */
	position?: SheetPosition;
	/** @default 'md' */
	size?: SheetSize;
	title?: string;
	footer?: ReactNode;
	/** @default true */
	showCloseButton?: boolean;
	/** @default true */
	closeOnOverlayClick?: boolean;
	/** @default true */
	closeOnEscape?: boolean;
	sheetId?: string;
	className?: string;
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
	children: ReactNode;
	/** @default 'left' */
	position?: SidebarPosition;
	/** @default '16rem' */
	width?: number | string;
	/** @default false */
	collapsed?: boolean;
	/** @default false */
	collapsible?: boolean;
	onCollapseChange?: (collapsed: boolean) => void;
	header?: ReactNode;
	footer?: ReactNode;
	className?: string;
	contentClassName?: string;
	/** @default true */
	showBorder?: boolean;
	style?: CSSProperties;
}
