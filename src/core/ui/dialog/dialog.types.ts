import type { ModalSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

/**
 * Dialog variant types
 */
export type DialogVariant = 'default' | 'centered' | 'fullscreen';

/**
 * Dialog component props
 */
export interface DialogProps {
	/** Whether the dialog is open */
	isOpen: boolean;
	/** Function to close the dialog */
	onClose: () => void;
	/** Dialog title */
	title: string;
	/** Dialog content */
	children: ReactNode;
	/** Size of the dialog @default 'md' */
	size?: ModalSize;
	/** Visual variant of the dialog @default 'default' */
	variant?: DialogVariant;
	/** Whether to show close button @default true */
	showCloseButton?: boolean;
	/** Optional footer content */
	footer?: ReactNode;
	/** Additional CSS classes */
	className?: string;
	/** Whether to close on overlay click @default true */
	closeOnOverlayClick?: boolean;
	/** Whether to close on escape key @default true */
	closeOnEscape?: boolean;
	/** Optional ID for the dialog element */
	dialogId?: string;
}
