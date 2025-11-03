import type { ModalProps, ModalSize } from '@src-types/ui';
import type { ReactNode } from 'react';

import { ModalDialog } from './ModalDialog';
import { useModalSetup } from './useModalSetup';

export type { ModalProps, ModalSize } from '@src-types/ui';

interface ModalSetupOptions {
	readonly modalId?: string;
	readonly closeOnOverlayClick: boolean;
	readonly onClose: () => void;
}

function prepareModalOptions(
	modalId: string | undefined,
	closeOnOverlayClick: boolean,
	onClose: () => void
): ModalSetupOptions {
	if (modalId !== undefined) {
		return { modalId, closeOnOverlayClick, onClose };
	}
	return { closeOnOverlayClick, onClose };
}

interface DialogProps {
	readonly setup: ReturnType<typeof useModalSetup>;
	readonly className?: string;
	readonly closeOnEscape: boolean;
	readonly onClose: () => void;
	readonly size: ModalSize;
	readonly title: string;
	readonly showCloseButton: boolean;
	readonly footer?: ReactNode;
	readonly children: ReactNode;
}

function buildDialogProps(props: DialogProps) {
	const {
		setup,
		className,
		closeOnEscape,
		onClose,
		size,
		title,
		showCloseButton,
		footer,
		children,
	} = props;
	return {
		modalRef: setup.modalRef,
		titleId: setup.titleId,
		descriptionId: setup.descriptionId,
		...(className !== undefined && { className }),
		closeOnEscape,
		onClose,
		handleOverlayClick: setup.handleOverlayClick,
		handleOverlayKeyDown: setup.handleOverlayKeyDown,
		size,
		title,
		showCloseButton,
		footer,
		children,
	};
}

function renderModalDialog(props: DialogProps) {
	return <ModalDialog {...buildDialogProps(props)} />;
}

function extractModalProps(props: Readonly<ModalProps>) {
	return {
		isOpen: props.isOpen,
		onClose: props.onClose,
		title: props.title,
		children: props.children,
		size: props.size ?? 'md',
		showCloseButton: props.showCloseButton ?? true,
		footer: props.footer,
		className: props.className,
		closeOnOverlayClick: props.closeOnOverlayClick ?? true,
		closeOnEscape: props.closeOnEscape ?? true,
		modalId: props.modalId,
	};
}

/**
 * Modal - Accessible modal dialog component
 *
 * Features:
 * - Accessible: proper ARIA attributes, focus management, keyboard navigation
 * - Customizable sizes: sm, md, lg, xl, full
 * - Optional footer and close button
 * - Escape key and overlay click handling
 * - Focus trapping within modal
 * - Dark mode support
 * - Restores focus to previous element on close
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 */
export default function Modal(props: Readonly<ModalProps>) {
	const modalProps = extractModalProps(props);
	const setup = useModalSetup(
		prepareModalOptions(modalProps.modalId, modalProps.closeOnOverlayClick, modalProps.onClose),
		modalProps.isOpen,
		modalProps.closeOnEscape
	);

	if (!modalProps.isOpen) {
		return null;
	}

	return renderModalDialog({
		setup,
		...(modalProps.className !== undefined && { className: modalProps.className }),
		closeOnEscape: modalProps.closeOnEscape,
		onClose: modalProps.onClose,
		size: modalProps.size,
		title: modalProps.title,
		showCloseButton: modalProps.showCloseButton,
		footer: modalProps.footer,
		children: modalProps.children,
	});
}
