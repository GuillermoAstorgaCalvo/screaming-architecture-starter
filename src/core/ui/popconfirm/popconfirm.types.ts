import type { PopoverPosition } from '@src-types/ui/overlays';
import type { ReactNode } from 'react';

/**
 * Popconfirm component props - Lightweight confirmation popover
 */
export interface PopconfirmProps {
	/** Whether the popconfirm is open */
	isOpen: boolean;
	/** Function to close the popconfirm */
	onClose: () => void;
	/** Trigger element (the element that opens the popconfirm) */
	trigger: ReactNode;
	/** Popconfirm title */
	title: string;
	/** Popconfirm description/content */
	description?: ReactNode;
	/** Label for the confirm/primary action button */
	confirmLabel?: string;
	/** Label for the cancel/secondary action button */
	cancelLabel?: string;
	/** Callback when confirm button is clicked */
	onConfirm?: () => void | Promise<void>;
	/** Callback when cancel button is clicked */
	onCancel?: () => void;
	/** Whether the confirm action is destructive (changes button styling) @default false */
	destructive?: boolean;
	/** Whether to show cancel button @default true */
	showCancel?: boolean;
	/** Position of the popconfirm relative to trigger @default 'top' */
	position?: PopoverPosition;
	/** Whether to close on outside click @default true */
	closeOnOutsideClick?: boolean;
	/** Whether to close on escape key @default true */
	closeOnEscape?: boolean;
	/** Optional ID for the popconfirm element */
	popconfirmId?: string;
	/** Custom className for the popconfirm content */
	className?: string;
	/** Custom className for the popconfirm container */
	containerClassName?: string;
}

/**
 * Props for the footer component
 */
export interface PopconfirmFooterProps {
	readonly showCancel: boolean;
	readonly cancelLabel: string;
	readonly confirmLabel: string;
	readonly destructive: boolean;
	readonly onCancel: () => void;
	readonly onConfirm: () => Promise<void>;
}

/**
 * Handlers for confirm and cancel actions
 */
export interface PopconfirmHandlers {
	readonly handleConfirm: () => Promise<void>;
	readonly handleCancel: () => void;
}

/**
 * Props for popconfirm content rendering
 */
export interface PopconfirmContentProps {
	readonly title: string;
	readonly description?: ReactNode;
	readonly footer: ReactNode;
}
