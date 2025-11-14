import type { ModalSetupResult } from '@core/ui/overlays/modal/hooks/useModalSetup';
import type { ModalSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

/**
 * Options for modal setup hook
 */
export interface ModalSetupOptions {
	readonly modalId?: string;
	readonly closeOnOverlayClick: boolean;
	readonly onClose: () => void;
}

/**
 * Props for rendering the modal dialog component
 */
export interface ModalRenderProps {
	readonly setup: ModalSetupResult;
	readonly className?: string;
	readonly closeOnEscape: boolean;
	readonly onClose: () => void;
	readonly size: ModalSize;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly footer?: ReactNode;
	readonly children: ReactNode;
}

/**
 * Extracted and normalized modal props
 */
export interface ExtractedModalProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly title: string;
	readonly children: ReactNode;
	readonly size: ModalSize;
	readonly showCloseButton: boolean;
	readonly footer?: ReactNode;
	readonly className?: string;
	readonly closeOnOverlayClick: boolean;
	readonly closeOnEscape: boolean;
	readonly modalId?: string;
}
