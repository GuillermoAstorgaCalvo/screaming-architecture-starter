import { ModalDialog } from '@core/ui/overlays/modal/components/ModalDialog';
import type {
	ExtractedModalProps,
	ModalRenderProps,
	ModalSetupOptions,
} from '@core/ui/overlays/modal/types/Modal.types';
import type { ModalProps } from '@src-types/ui/overlays/panels';
import type { ReactNode } from 'react';

/**
 * Prepares modal setup options from individual parameters
 */
export function prepareModalOptions(
	modalId: string | undefined,
	closeOnOverlayClick: boolean,
	onClose: () => void
): ModalSetupOptions {
	if (modalId !== undefined) {
		return { modalId, closeOnOverlayClick, onClose };
	}
	return { closeOnOverlayClick, onClose };
}

/**
 * Builds props for the ModalDialog component from render props
 */
export function buildDialogProps(props: ModalRenderProps) {
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

/**
 * Renders the ModalDialog component with the provided props
 */
export function renderModalDialog(props: ModalRenderProps) {
	return <ModalDialog {...buildDialogProps(props)} />;
}

/**
 * Builds optional props object for modal
 */
function buildOptionalProps(props: Readonly<ModalProps>) {
	const optional: { footer?: ReactNode; className?: string; modalId?: string } = {};
	if (props.footer !== undefined) optional.footer = props.footer;
	if (props.className !== undefined) optional.className = props.className;
	if (props.modalId !== undefined) optional.modalId = props.modalId;
	return optional;
}

/**
 * Extracts and normalizes modal props with default values
 */
export function extractModalProps(props: Readonly<ModalProps>): ExtractedModalProps {
	const size = props.size ?? 'md';
	const showCloseButton = props.showCloseButton ?? true;
	const closeOnOverlayClick = props.closeOnOverlayClick ?? true;
	const closeOnEscape = props.closeOnEscape ?? true;

	return {
		isOpen: props.isOpen,
		onClose: props.onClose,
		title: props.title,
		children: props.children,
		size,
		showCloseButton,
		closeOnOverlayClick,
		closeOnEscape,
		...buildOptionalProps(props),
	};
}
