import { focusFirstElement, handleTabNavigation, saveActiveElement } from '@core/a11y/focus';
import { type RefObject, useEffect, useId, useRef } from 'react';

/**
 * Generates a unique modal ID using React's useId hook
 */
export function useModalId(providedId: string | undefined): string {
	const reactId = useId();

	if (providedId) {
		return providedId;
	}

	// Convert React's ID format to a modal-specific ID
	return `modal-${reactId}`;
}

/**
 * Hook to handle Escape key closing
 */
export function useEscapeKey(isOpen: boolean, closeOnEscape: boolean, onClose: () => void): void {
	useEffect(() => {
		if (!isOpen || !closeOnEscape) {
			return;
		}

		const handleEscape = (event: globalThis.KeyboardEvent): void => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, closeOnEscape, onClose]);
}

function setModalInitialFocus(modal: HTMLDialogElement): void {
	focusFirstElement(modal);
}

function handleModalOpen(
	modal: HTMLDialogElement,
	previousActiveElementRef: RefObject<HTMLElement | null>
): () => void {
	previousActiveElementRef.current = saveActiveElement();
	modal.showModal();
	document.body.style.overflow = 'hidden';

	const timeoutId = setTimeout(() => {
		setModalInitialFocus(modal);
	}, 0);

	return () => {
		clearTimeout(timeoutId);
		document.body.style.overflow = '';
		modal.close();
		previousActiveElementRef.current?.focus();
	};
}

/**
 * Hook to manage focus and dialog element control
 */
export function useModalFocus(
	modalRef: RefObject<HTMLDialogElement | null>,
	isOpen: boolean
): void {
	const previousActiveElementRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const modal = modalRef.current;
		if (!modal) {
			return undefined;
		}

		if (isOpen) {
			return handleModalOpen(modal, previousActiveElementRef);
		}

		modal.close();
		return undefined;
	}, [isOpen, modalRef]);
}

/**
 * Hook to handle focus trapping within the modal
 */
export function useFocusTrap(modalRef: RefObject<HTMLDialogElement | null>, isOpen: boolean): void {
	useEffect(() => {
		const modal = modalRef.current;
		if (!isOpen || !modal) {
			return;
		}

		const handleTabKey = (event: globalThis.KeyboardEvent): void => {
			handleTabNavigation(modal, event);
		};

		document.addEventListener('keydown', handleTabKey);
		return () => {
			document.removeEventListener('keydown', handleTabKey);
		};
	}, [isOpen, modalRef]);
}
