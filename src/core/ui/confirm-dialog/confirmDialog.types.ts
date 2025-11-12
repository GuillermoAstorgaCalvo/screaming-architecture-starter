import type { ModalSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

/**
 * Dialog variant types
 */
export type DialogVariant = 'default' | 'centered' | 'fullscreen';

/**
 * ConfirmDialog component props
 */
export interface ConfirmDialogProps {
	/** Whether the confirmation dialog is open */
	isOpen: boolean;
	/** Function to close the confirmation dialog */
	onClose: () => void;
	/** Confirmation dialog title */
	title: string;
	/** Confirmation dialog description/content */
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
	/** Size of the confirmation dialog @default 'sm' */
	size?: ModalSize;
	/** Dialog variant @default 'centered' */
	variant?: DialogVariant;
	/** Additional CSS classes */
	className?: string;
}

/**
 * Props for the footer component
 */
export interface FooterProps {
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
export interface Handlers {
	readonly handleConfirm: () => Promise<void>;
	readonly handleCancel: () => void;
}

/**
 * Props for dialog content rendering
 */
export interface DialogContentProps {
	readonly description?: ReactNode;
}

/**
 * Props for preparing dialog component
 */
export interface DialogProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly title: string;
	readonly size: ModalSize;
	readonly variant: DialogVariant;
	readonly className: string | undefined;
	readonly footer: ReactNode;
	readonly children: ReactNode;
}
