import type { ReactNode } from 'react';

export interface AlertDialogProps {
	/** Whether the alert dialog is open */
	isOpen: boolean;
	/** Function to close the alert dialog */
	onClose: () => void;
	/** Alert dialog title */
	title: string;
	/** Alert dialog description/content */
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
	/** Size of the alert dialog @default 'sm' */
	size?: 'sm' | 'md' | 'lg';
	/** Additional CSS classes */
	className?: string;
}

export interface FooterProps {
	showCancel: boolean;
	cancelLabel: string;
	confirmLabel: string;
	destructive: boolean;
	onCancel: () => void;
	onConfirm: () => Promise<void>;
}
