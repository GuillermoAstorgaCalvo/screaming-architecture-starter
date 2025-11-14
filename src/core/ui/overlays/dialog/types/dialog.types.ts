import type { DialogSetupResult } from '@core/ui/overlays/dialog/hooks/useDialogSetup';
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

/**
 * Options for dialog setup hook
 */
export interface DialogSetupOptions {
	readonly dialogId?: string;
	readonly closeOnOverlayClick: boolean;
	readonly onClose: () => void;
}

/**
 * Props for rendering the dialog component
 */
export interface DialogRenderProps {
	readonly setup: DialogSetupResult;
	readonly className?: string | undefined;
	readonly closeOnEscape: boolean;
	readonly onClose: () => void;
	readonly size: ModalSize;
	readonly variant: DialogVariant;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly footer?: ReactNode | undefined;
	readonly children: ReactNode;
}

/**
 * Extracted and normalized dialog props
 */
export interface ExtractedDialogProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly title: string;
	readonly children: ReactNode;
	readonly size: ModalSize;
	readonly variant: DialogVariant;
	readonly showCloseButton: boolean;
	readonly footer?: ReactNode | undefined;
	readonly className?: string | undefined;
	readonly closeOnOverlayClick: boolean;
	readonly closeOnEscape: boolean;
	readonly dialogId?: string | undefined;
}
